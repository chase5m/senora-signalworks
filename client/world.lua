ChaseBootlegWorld = {}

local chaseRigs = {}
local chaseDevices = {}
local chaseFailedModels = {}
local chaseAttachments = {}
local chaseDepotBlip = nil
local chaseTargetZone = nil
local chaseStopping = false

local function ChaseBootlegLoadModel(name)
    local hash = joaat(name)
    if chaseFailedModels[name] and GetGameTimer() < chaseFailedModels[name] then return nil end
    if not IsModelInCdimage(hash) or not IsModelValid(hash) then
        chaseFailedModels[name] = GetGameTimer() + 60000
        print(('[chase_bootleg] Missing streamed model: %s. Check the stream folder and YTYP manifest.'):format(name))
        return nil
    end
    RequestModel(hash)
    local deadline = GetGameTimer() + 5000
    while not HasModelLoaded(hash) and GetGameTimer() < deadline and not chaseStopping do Wait(25) end
    if not HasModelLoaded(hash) or chaseStopping then return nil end
    return hash
end

local function ChaseBootlegObject(name, parent)
    local hash = ChaseBootlegLoadModel(name)
    if not hash or not DoesEntityExist(parent) then return nil end
    local position = GetEntityCoords(parent)
    local object = CreateObjectNoOffset(hash, position.x, position.y, position.z, false, false, false)
    SetModelAsNoLongerNeeded(hash)
    if object == 0 then return nil end
    SetEntityAsMissionEntity(object, true, true)
    SetEntityCollision(object, false, true)
    SetEntityVisible(object, false, false)
    return object
end

local function ChaseBootlegAttach(object, parent, x, y, z, rx, ry, rz, bone, collision)
    if not object or not DoesEntityExist(object) or not DoesEntityExist(parent) then return end
    local attachment = { parent, bone or 0, x, y, z, rx or 0, ry or 0, rz or 0, collision == true }
    local previous = chaseAttachments[object]
    local changed = previous == nil
    if previous then
        for index = 1, #attachment do
            if previous[index] ~= attachment[index] then changed = true break end
        end
    end
    if not changed then return end
    AttachEntityToEntity(object, parent, bone or 0, x + 0.0, y + 0.0, z + 0.0,
        (rx or 0) + 0.0, (ry or 0) + 0.0, (rz or 0) + 0.0, false, false, collision == true, true, 2, true)
    SetEntityCollision(object, collision == true, true)
    SetEntityNoCollisionEntity(object, parent, false)
    chaseAttachments[object] = attachment
end

local function ChaseBootlegConfigureRigCollision(rig)
    local objects = {}
    for _, object in pairs(rig.objects) do
        if DoesEntityExist(object) then
            SetEntityNoCollisionEntity(object, rig.vehicle, false)
            objects[#objects + 1] = object
        end
    end
    for index = 1, #objects do
        for other = index + 1, #objects do
            SetEntityNoCollisionEntity(objects[index], objects[other], false)
        end
    end
end

local function ChaseBootlegSetRigCollision(rig)
    local settled = rig.state.stage == 'ready' or rig.state.stage == 'live'
    local physical = { base = true, lid = true, powercase = settled, console = settled, mast = settled }
    rig.collision = rig.collision or {}
    for kind, object in pairs(rig.objects) do
        local enabled = physical[kind] == true
        if DoesEntityExist(object) and rig.collision[kind] ~= enabled then
            SetEntityCollision(object, enabled, true)
            rig.collision[kind] = enabled
        end
    end
    if rig.settledCollision ~= settled then
        rig.settledCollision = settled
        ChaseBootlegConfigureRigCollision(rig)
    end
end

local function ChaseBootlegSetRigFrozen(rig)
    if not DoesEntityExist(rig.vehicle) then return end
    if not NetworkHasControlOfEntity(rig.vehicle) then rig.controlled = false return end
    local stage = rig.state.stage
    local active = stage == 'deploying' or stage == 'ready' or stage == 'live' or stage == 'packing'
    local now = GetGameTimer()
    if active then
        if not rig.frozen or not rig.controlled or (now - (rig.frozenAt or now)) % 4294967296 >= 1000 then
            FreezeEntityPosition(rig.vehicle, true)
            rig.frozen, rig.frozenAt = true, now
        end
    elseif (stage == 'parked' or stage == 'stored') and (rig.frozen or not rig.controlled) then
        FreezeEntityPosition(rig.vehicle, false)
        rig.frozen, rig.frozenAt = nil, nil
    end
    rig.controlled = true
end

local function ChaseBootlegDestroyDisplay(rig)
    if rig.dui then DestroyDui(rig.dui) rig.dui = nil end
    rig.displayReady = false
end

local function ChaseBootlegRemoveRig(vehicle)
    local rig = chaseRigs[vehicle]
    if not rig then return end
    if rig.frozen and DoesEntityExist(vehicle) and NetworkHasControlOfEntity(vehicle)
        and (chaseStopping or rig.state.stage == 'parked' or rig.state.stage == 'stored') then
        FreezeEntityPosition(vehicle, false)
    end
    ChaseBootlegDestroyDisplay(rig)
    if rig.target and GetResourceState('ox_target') == 'started' then
        exports.ox_target:removeLocalEntity(vehicle, 'chase_bootleg:console')
    end
    for _, object in pairs(rig.objects) do
        if DoesEntityExist(object) then DeleteEntity(object) end
        chaseAttachments[object] = nil
    end
    chaseRigs[vehicle] = nil
end

local function ChaseBootlegAnimationProgress(rig)
    local stage = rig.state.stage
    if stage == 'stored' or stage == 'parked' then return 0.0 end
    if stage ~= 'deploying' and stage ~= 'packing' then return 1.0 end
    local duration = math.max(0.1, tonumber(rig.state.duration) or 1.0)
    local elapsed = rig.elapsedAtObservation + (GetGameTimer() - rig.observedAt) / 1000.0
    local progress = math.min(1.0, math.max(0.0, elapsed / duration))
    progress = progress * progress * (3.0 - 2.0 * progress)
    return stage == 'packing' and 1.0 - progress or progress
end

local function ChaseBootlegPositionRig(rig)
    local mounts, objects = ChaseBootlegConfig.Mounts, rig.objects
    local progress = ChaseBootlegAnimationProgress(rig)
    ChaseBootlegSetRigFrozen(rig)
    ChaseBootlegSetRigCollision(rig)
    local lidProgress = math.min(1.0, progress / 0.45)
    local mastProgress = math.max(0.0, (progress - 0.45) / 0.55)
    local roofZ = (mounts.roof.z or rig.maximum.z) + mounts.roof.clearance
    ChaseBootlegAttach(objects.base, rig.vehicle, mounts.roof.x, mounts.roof.y, roofZ, mounts.roof.pitch or 0.0,
        nil, nil, nil, rig.collision.base)
    if objects.base then SetEntityVisible(objects.base, true, false) end
    if objects.base then
        ChaseBootlegAttach(objects.lid, objects.base, mounts.lid.x, mounts.lid.y, mounts.lid.z, mounts.lid.openAngle * lidProgress,
            nil, nil, nil, rig.collision.lid)
        if objects.lid then SetEntityVisible(objects.lid, true, false) end
        ChaseBootlegAttach(objects.mast, objects.base, mounts.mast.x, mounts.mast.y,
            mounts.mast.z + mounts.mast.travel * mastProgress, nil, nil, nil, nil, rig.collision.mast)
        if objects.mast then SetEntityVisible(objects.mast, progress > 0.45, false) end
    end
    ChaseBootlegAttach(objects.console, rig.vehicle, mounts.console.x,
        rig.minimum.y + mounts.console.rearInset - mounts.console.travel * progress,
        rig.minimum.z + mounts.console.floorHeight, nil, nil, nil, nil, rig.collision.console)
    ChaseBootlegAttach(objects.powercase, rig.vehicle, mounts.powercase.x,
        rig.minimum.y + mounts.powercase.rearInset, rig.minimum.z + mounts.powercase.floorHeight,
        nil, nil, nil, nil, rig.collision.powercase)
    if objects.powercase then SetEntityVisible(objects.powercase, true, false) end
    if objects.console then
        ChaseBootlegAttach(objects.cartridge, objects.console, mounts.cartridge.x, mounts.cartridge.y, mounts.cartridge.z)
        ChaseBootlegAttach(objects.lever, objects.console, mounts.lever.x, mounts.lever.y, mounts.lever.z,
            rig.state.micLive and mounts.lever.onAngle or mounts.lever.offAngle)
        ChaseBootlegAttach(objects.onair, objects.console, mounts.onair.x, mounts.onair.y, mounts.onair.z)
    end
    if objects.console then SetEntityVisible(objects.console, progress > 0.03, false) end
    if objects.cartridge then SetEntityVisible(objects.cartridge, progress > 0.03, false) end
    if objects.lever then SetEntityVisible(objects.lever, progress > 0.03, false) end
    if objects.onair then SetEntityVisible(objects.onair, progress > 0.03 and rig.state.micLive == true, false) end
    if NetworkHasControlOfEntity(rig.vehicle) then
        SetVehicleDoorControl(rig.vehicle, 2, 1, progress)
        SetVehicleDoorControl(rig.vehicle, 3, 1, progress)
    end
    rig.progress = progress
end

local function ChaseBootlegObserveState(rig, state)
    local signature = ('%s:%s:%s:%s'):format(state.stage or '', state.changedAt or '', state.duration or '', tostring(state.micLive))
    if rig.signature ~= signature then
        rig.signature = signature
        rig.observedAt = GetGameTimer()
        rig.elapsedAtObservation = math.max(0.0, GetCloudTimeAsInt() - (tonumber(state.changedAt) or GetCloudTimeAsInt()))
    end
    rig.state = state
    ChaseBootlegSetRigFrozen(rig)
end

local function ChaseBootlegCreateRig(vehicle, state)
    if chaseRigs[vehicle] or not DoesEntityExist(vehicle) then return end
    local minimum, maximum = GetModelDimensions(GetEntityModel(vehicle))
    local rig = { vehicle = vehicle, objects = {}, minimum = minimum, maximum = maximum, loading = true }
    chaseRigs[vehicle] = rig
    ChaseBootlegObserveState(rig, state)
    for _, kind in ipairs({ 'base', 'lid', 'mast', 'console', 'cartridge', 'powercase', 'lever', 'onair' }) do
        if chaseStopping or not DoesEntityExist(vehicle) then ChaseBootlegRemoveRig(vehicle) return end
        rig.objects[kind] = ChaseBootlegObject(ChaseBootlegConfig.Models[kind], vehicle)
    end
    ChaseBootlegConfigureRigCollision(rig)
    if GetResourceState('ox_target') == 'started' and ChaseBootlegConfig.Interaction.target ~= 'none' then
        exports.ox_target:addLocalEntity(vehicle, {
            {
                name = 'chase_bootleg:console',
                label = 'Open Senora studio',
                icon = 'fa-solid fa-tower-broadcast',
                distance = ChaseBootlegConfig.Interaction.distance,
                canInteract = function() return ChaseBootlegClient.ChaseCanOpenStudio() end,
                onSelect = function() ChaseBootlegClient.ChaseOpen('studio') end,
            },
        })
        rig.target = true
    end
    rig.loading = false
    ChaseBootlegPositionRig(rig)
end

local function ChaseBootlegDevice(player, kind)
    local ped = GetPlayerPed(player)
    local previous = chaseDevices[player]
    if previous and (previous.kind ~= kind or previous.ped ~= ped) then
        if DoesEntityExist(previous.object) then DeleteEntity(previous.object) end
        chaseAttachments[previous.object] = nil
        chaseDevices[player] = nil
    end
    if chaseDevices[player] then return end
    local object = ChaseBootlegObject(ChaseBootlegConfig.Models[kind], ped)
    if not object then return end
    chaseDevices[player] = { object = object, kind = kind, ped = ped }
    ChaseBootlegAttach(object, ped, 0.12, 0.02, -0.025, -85.0, 0.0, 5.0, GetPedBoneIndex(ped, 57005))
    SetEntityVisible(object, true, false)
    if player == PlayerId() then
        local dictionary = 'cellphone@'
        RequestAnimDict(dictionary)
        local deadline = GetGameTimer() + 2500
        while not HasAnimDictLoaded(dictionary) and GetGameTimer() < deadline and not chaseStopping do Wait(25) end
        if HasAnimDictLoaded(dictionary) and not chaseStopping then
            TaskPlayAnim(ped, dictionary, 'cellphone_text_read_base', 3.0, -3.0, -1, 49, 0.0, false, false, false)
            RemoveAnimDict(dictionary)
        end
    end
end

local function ChaseBootlegDrawTriangle(a, b, c, dictionary, u1, v1, u2, v2, u3, v3)
    DrawTexturedPoly(a.x + 0.0, a.y + 0.0, a.z + 0.0, b.x + 0.0, b.y + 0.0, b.z + 0.0,
        c.x + 0.0, c.y + 0.0, c.z + 0.0, 255, 255, 255, 255, dictionary, 'display',
        u1 + 0.0, v1 + 0.0, 1.0, u2 + 0.0, v2 + 0.0, 1.0, u3 + 0.0, v3 + 0.0, 1.0)
end

local function ChaseBootlegDrawDisplay(rig)
    if not rig.displayReady or not rig.objects.console then return end
    local config = ChaseBootlegConfig.Display
    local centre, size = config.centre, config.size
    local x1, x2 = centre.x - size.width / 2.0, centre.x + size.width / 2.0
    local z1, z2 = centre.z - size.height / 2.0, centre.z + size.height / 2.0
    local y = centre.y - 0.002
    local topLeft = GetOffsetFromEntityInWorldCoords(rig.objects.console, x1, y, z2)
    local topRight = GetOffsetFromEntityInWorldCoords(rig.objects.console, x2, y, z2)
    local bottomLeft = GetOffsetFromEntityInWorldCoords(rig.objects.console, x1, y, z1)
    local bottomRight = GetOffsetFromEntityInWorldCoords(rig.objects.console, x2, y, z1)
    ChaseBootlegDrawTriangle(topLeft, bottomLeft, topRight, rig.dictionary, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0)
    ChaseBootlegDrawTriangle(topRight, bottomLeft, bottomRight, rig.dictionary, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0)
end

local function ChaseBootlegHelp(text)
    BeginTextCommandDisplayHelp('STRING')
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandDisplayHelp(0, false, true, -1)
end

CreateThread(function()
    while not chaseStopping do
        local playerPosition = GetEntityCoords(PlayerPedId())
        local keep = {}
        if ChaseBootlegConfig.Visuals.enabled then
            for _, vehicle in ipairs(GetGamePool('CVehicle')) do
                if #(playerPosition - GetEntityCoords(vehicle)) < ChaseBootlegConfig.Visuals.streamDistance then
                    local state = Entity(vehicle).state['chase_bootleg:rig']
                    if type(state) == 'table' and state.id and state.stage ~= 'stored' then
                        keep[vehicle] = true
                        if chaseRigs[vehicle] then ChaseBootlegObserveState(chaseRigs[vehicle], state)
                        else ChaseBootlegCreateRig(vehicle, state) end
                    elseif type(state) == 'table' and state.stage == 'stored' and chaseRigs[vehicle] then
                        ChaseBootlegObserveState(chaseRigs[vehicle], state)
                    end
                end
            end
        end
        for vehicle in pairs(chaseRigs) do
            if not keep[vehicle] or not DoesEntityExist(vehicle) then ChaseBootlegRemoveRig(vehicle) end
        end
        local keptDevices = {}
        for _, player in ipairs(GetActivePlayers()) do
            local ped = GetPlayerPed(player)
            if not IsEntityDead(ped) and not IsPedInAnyVehicle(ped, false)
                and #(playerPosition - GetEntityCoords(ped)) < 35.0 then
                local kind = Player(GetPlayerServerId(player)).state['chase_bootleg:device']
                if kind == 'receiver' or kind == 'scanner' then
                    keptDevices[player] = true
                    ChaseBootlegDevice(player, kind)
                end
            end
        end
        for player, device in pairs(chaseDevices) do
            if not keptDevices[player] then
                if DoesEntityExist(device.object) then DeleteEntity(device.object) end
                chaseAttachments[device.object] = nil
                if player == PlayerId() then StopAnimTask(PlayerPedId(), 'cellphone@', 'cellphone_text_read_base', 3.0) end
                chaseDevices[player] = nil
            end
        end
        Wait(ChaseBootlegConfig.Visuals.pollMilliseconds)
    end
end)

CreateThread(function()
    while not chaseStopping do
        local candidates, keep = {}, {}
        local playerPosition = GetEntityCoords(PlayerPedId())
        for _, rig in pairs(chaseRigs) do
            if not rig.loading and DoesEntityExist(rig.vehicle) and (rig.progress or 0.0) > 0.5 then
                local distance = #(playerPosition - GetEntityCoords(rig.vehicle))
                if distance < ChaseBootlegConfig.Display.distance then
                    candidates[#candidates + 1] = { rig = rig, distance = distance }
                end
            end
        end
        table.sort(candidates, function(a, b) return a.distance < b.distance end)
        if ChaseBootlegConfig.Display.enabled then
            for index = 1, math.min(#candidates, ChaseBootlegConfig.Display.maximum) do
                local rig = candidates[index].rig
                keep[rig.vehicle] = true
                if not rig.dui and GetGameTimer() > (rig.retryAfter or 0) then
                    rig.dui = CreateDui(('https://cfx-nui-%s/web/display.html'):format(GetCurrentResourceName()),
                        ChaseBootlegConfig.Display.width, ChaseBootlegConfig.Display.height)
                    rig.duiDeadline = GetGameTimer() + 5000
                    rig.dictionary = ('chase_bootleg:display:%s'):format(rig.state.id)
                end
                if rig.dui and not rig.displayReady and IsDuiAvailable(rig.dui) then
                    local dictionary = CreateRuntimeTxd(rig.dictionary)
                    CreateRuntimeTextureFromDuiHandle(dictionary, 'display', GetDuiHandle(rig.dui))
                    rig.displayReady = true
                elseif rig.dui and not rig.displayReady and GetGameTimer() > rig.duiDeadline then
                    ChaseBootlegDestroyDisplay(rig)
                    rig.retryAfter = GetGameTimer() + 10000
                end
                if rig.displayReady then SendDuiMessage(rig.dui, json.encode({ type = 'chase_bootleg:rig', data = rig.state })) end
            end
        end
        for vehicle, rig in pairs(chaseRigs) do
            if rig.dui and not keep[vehicle] then ChaseBootlegDestroyDisplay(rig) end
        end
        Wait(500)
    end
end)

CreateThread(function()
    while not chaseStopping do
        local sleep = 400
        local player = PlayerPedId()
        local position = GetEntityCoords(player)
        local nearest = nil
        local nearestDistance = ChaseBootlegConfig.Interaction.distance
        for _, rig in pairs(chaseRigs) do
            if not rig.loading and DoesEntityExist(rig.vehicle) then
                if rig.state.stage == 'deploying' or rig.state.stage == 'packing' then
                    sleep = 0
                    ChaseBootlegPositionRig(rig)
                elseif rig.lastPositioned ~= rig.signature then
                    ChaseBootlegPositionRig(rig)
                    rig.lastPositioned = rig.signature
                end
                if rig.displayReady then sleep = 0 ChaseBootlegDrawDisplay(rig) end
                local rear = GetOffsetFromEntityInWorldCoords(rig.vehicle, 0.0, rig.minimum.y - 0.3, 0.0)
                local distance = #(position - rear)
                if distance < nearestDistance then nearest = rig nearestDistance = distance end
            end
        end
        local depot = ChaseBootlegConfig.Depot.position
        local depotDistance = #(position - vector3(depot.x, depot.y, depot.z))
        if ChaseBootlegClient.ChaseCanOpenStudio() and not ChaseBootlegClient.visible
            and not IsEntityDead(player) and not IsPedInAnyVehicle(player, false) then
            if nearest or depotDistance < 2.5 then
                sleep = 0
                ChaseBootlegHelp('Press ~INPUT_CONTEXT~ to open the ~y~Senora studio')
                if IsControlJustReleased(0, ChaseBootlegConfig.Interaction.control) then ChaseBootlegClient.ChaseOpen('studio') end
            end
        end
        Wait(sleep)
    end
end)

CreateThread(function()
    local depot = ChaseBootlegConfig.Depot
    if depot.blip.enabled then
        chaseDepotBlip = AddBlipForCoord(depot.position.x, depot.position.y, depot.position.z)
        SetBlipSprite(chaseDepotBlip, depot.blip.sprite)
        SetBlipColour(chaseDepotBlip, depot.blip.colour)
        SetBlipScale(chaseDepotBlip, depot.blip.scale + 0.0)
        SetBlipAsShortRange(chaseDepotBlip, true)
        BeginTextCommandSetBlipName('STRING')
        AddTextComponentString(depot.blip.label)
        EndTextCommandSetBlipName(chaseDepotBlip)
        SetBlipDisplay(chaseDepotBlip, 0)
    end
    if GetResourceState('ox_target') == 'started' and ChaseBootlegConfig.Interaction.target ~= 'none' then
        chaseTargetZone = exports.ox_target:addSphereZone({
            coords = vector3(depot.position.x, depot.position.y, depot.position.z),
            radius = 1.5,
            options = {{ name = 'chase_bootleg:depot', label = 'Open Senora depot', icon = 'fa-solid fa-radio',
                canInteract = function() return ChaseBootlegClient.ChaseCanOpenStudio() end,
                onSelect = function() ChaseBootlegClient.ChaseOpen('studio') end }},
        })
    end
    local visible = false
    while not chaseStopping and chaseDepotBlip do
        local allowed = ChaseBootlegClient.ChaseCanOpenStudio()
        if allowed ~= visible then
            visible = allowed
            SetBlipDisplay(chaseDepotBlip, allowed and 2 or 0)
        end
        Wait(1000)
    end
end)

AddEventHandler('onClientResourceStop', function(resource)
    if resource ~= GetCurrentResourceName() then return end
    chaseStopping = true
    for vehicle in pairs(chaseRigs) do ChaseBootlegRemoveRig(vehicle) end
    for _, device in pairs(chaseDevices) do if DoesEntityExist(device.object) then DeleteEntity(device.object) end end
    StopAnimTask(PlayerPedId(), 'cellphone@', 'cellphone_text_read_base', 3.0)
    if chaseDepotBlip then RemoveBlip(chaseDepotBlip) end
    if chaseTargetZone and GetResourceState('ox_target') == 'started' then exports.ox_target:removeZone(chaseTargetZone) end
end)
