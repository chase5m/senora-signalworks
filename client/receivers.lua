ChaseBootlegDevices = {}

local chaseConfig = ChaseBootlegConfig.ReceiverVisuals
local chaseVehicles, chasePlayers, chaseModelRetries = {}, {}, {}
local chasePlayerRetries = {}
local chaseStopping, chaseUsingItem = false, false
local chaseAnimation = nil
local chaseHandCarryFlags = 33
local chaseAnimationLoading, chaseCarryAction = nil, nil
local chaseAnimationDictionaries = {}
local chaseCarrySuspended, chaseCarryOverride, chaseCarryOverrideUntil = false, nil, 0
local chaseDisplaySequence = 0
local chaseDisplaySlots = {}
local chaseDisplayDictionaries = {}
local chasePlaced, chasePlacedSettled, chasePlacedAttempts, chasePlacedTarget = {}, {}, {}, false
local chasePlacedHash = joaat(chaseConfig.models.portable)
local ChaseReceiverRemoveVehicle
local ChaseReceiverObservePlayer

local function ChaseReceiverLocalState()
    if chaseCarryAction and chaseCarryAction.presentationReleased then return LocalPlayer.state['chase_bootleg:receiver'] end
    if chaseCarryAction and chaseCarryAction.visualState then return chaseCarryAction.visualState end
    if chaseCarryOverride and GetGameTimer() < chaseCarryOverrideUntil then return chaseCarryOverride end
    chaseCarryOverride = nil
    return LocalPlayer.state['chase_bootleg:receiver']
end

local function ChaseReceiverLoadModel(name)
    if chaseStopping or not name then return nil end
    if GetGameTimer() < (chaseModelRetries[name] or 0) then return nil end
    local hash = joaat(name)
    if not IsModelInCdimage(hash) or not IsModelValid(hash) then
        chaseModelRetries[name] = GetGameTimer() + 60000
        print(('[chase_bootleg] Receiver model unavailable: %s'):format(name))
        return nil
    end
    RequestModel(hash)
    local deadline = GetGameTimer() + 4000
    while not chaseStopping and not HasModelLoaded(hash) and GetGameTimer() < deadline do Wait(25) end
    if not HasModelLoaded(hash) or chaseStopping then
        SetModelAsNoLongerNeeded(hash)
        return nil
    end
    return hash
end

local function ChaseReceiverBone(parent, mount, isPed)
    if isPed then return GetPedBoneIndex(parent, mount.bone) end
    return mount.bone and GetEntityBoneIndexByName(parent, mount.bone) or 0
end

local function ChaseReceiverAttach(object, parent, mount, isPed)
    AttachEntityToEntity(object, parent, ChaseReceiverBone(parent, mount, isPed), mount.x + 0.0, mount.y + 0.0, mount.z + 0.0,
        mount.rx + 0.0, mount.ry + 0.0, mount.rz + 0.0, false, false, false, true, 2, true)
end

local function ChaseReceiverObject(name, parent, mount, isPed)
    local hash = ChaseReceiverLoadModel(name)
    if not hash then return nil end
    if not DoesEntityExist(parent) or chaseStopping then SetModelAsNoLongerNeeded(hash) return nil end
    local position = GetEntityCoords(parent)
    local object = CreateObjectNoOffset(hash, position.x + 0.0, position.y + 0.0, position.z + 0.0, false, false, false)
    SetModelAsNoLongerNeeded(hash)
    if object == 0 then return nil end
    SetEntityAsMissionEntity(object, true, true)
    SetEntityCollision(object, false, false)
    if ChaseReceiverBone(parent, mount, isPed) == -1 then DeleteEntity(object) return nil end
    ChaseReceiverAttach(object, parent, mount, isPed)
    return object
end

local function ChaseReceiverMount(vehicle)
    local state = Entity(vehicle).state['chase_bootleg:receiver']
    if type(state) == 'table' and type(state.mount) == 'table' then return state.mount end
    local hash = GetEntityModel(vehicle)
    for model, mount in pairs(chaseConfig.mounts) do
        if hash == joaat(model) then return mount end
    end
    return chaseConfig.fallback
end

function ChaseBootlegDevices.ChaseVehicleReceiver(vehicle)
    return chaseVehicles[vehicle]
end

function ChaseBootlegDevices.ChaseVehicleMount(vehicle)
    local mount = ChaseReceiverMount(vehicle)
    if not mount then return nil end
    local copy = { x = mount.x, y = mount.y, z = mount.z, rx = mount.rx, ry = mount.ry, rz = mount.rz }
    if mount.bone then
        local bone = GetEntityBoneIndexByName(vehicle, mount.bone)
        if bone ~= -1 then
            local origin = GetWorldPositionOfEntityBone(vehicle, bone)
            local offset = GetOffsetFromEntityGivenWorldCoords(vehicle, origin.x, origin.y, origin.z)
            copy.x, copy.y, copy.z = offset.x + copy.x, offset.y + copy.y, offset.z + copy.z + 0.10
        end
    end
    return copy
end

function ChaseBootlegDevices.ChasePreviewVehicle(vehicle, mount, isCurrent)
    if chaseStopping or not DoesEntityExist(vehicle) or isCurrent and not isCurrent() then return nil end
    local receiver = chaseVehicles[vehicle]
    if receiver and (not receiver.object or not DoesEntityExist(receiver.object)) then
        ChaseReceiverRemoveVehicle(vehicle)
        receiver = nil
    end
    if not receiver then
        local object = ChaseReceiverObject(chaseConfig.models.vehicle, vehicle, mount, false)
        if not object then return nil end
        if chaseStopping or not DoesEntityExist(vehicle) or isCurrent and not isCurrent() then
            DeleteEntity(object)
            return nil
        end
        receiver = { object = object, model = chaseConfig.models.vehicle, state = { installed = false, label = 'Position your receiver' } }
        chaseVehicles[vehicle] = receiver
    end
    receiver.preview = true
    receiver.mount = mount
    ChaseReceiverAttach(receiver.object, vehicle, mount, false)
    return receiver
end

function ChaseBootlegDevices.ChaseEndVehiclePreview(vehicle, mount)
    local receiver = chaseVehicles[vehicle]
    if not receiver then return end
    receiver.preview = false
    if not DoesEntityExist(vehicle) or not receiver.object or not DoesEntityExist(receiver.object) then
        ChaseReceiverRemoveVehicle(vehicle)
        return
    end
    local state = Entity(vehicle).state['chase_bootleg:receiver']
    state = type(state) == 'table' and state or nil
    if (not state or not state.installed) and receiver.optimisticUntil and receiver.optimisticUntil > GetGameTimer()
        and receiver.optimisticState then state = receiver.optimisticState end
    if mount then
        receiver.optimisticUntil = GetGameTimer() + 2000
        receiver.optimisticState = { installed = true, mount = mount, enabled = state and state.enabled,
            frequency = state and state.frequency, label = state and state.label, quality = state and state.quality }
    elseif type(state) ~= 'table' or not state.installed then
        ChaseReceiverRemoveVehicle(vehicle)
        return
    end
    local restored = mount or state and state.mount or ChaseReceiverMount(vehicle)
    if type(restored) ~= 'table' then ChaseReceiverRemoveVehicle(vehicle) return end
    receiver.mountSignature = nil
    receiver.mount = restored
    ChaseReceiverAttach(receiver.object, vehicle, restored, false)
end

local function ChaseReceiverDestroyDisplay(receiver)

    local slot = receiver.displaySlot
    if slot then
        if receiver.textureBound then RemoveReplaceTexture(slot.dictionary, slot.texture) end
        if receiver.model == slot.model and receiver.object and DoesEntityExist(receiver.object) then
            DeleteEntity(receiver.object)
            receiver.object = nil
        end
        if chaseDisplaySlots[slot.model] == receiver then chaseDisplaySlots[slot.model] = nil end
        receiver.displaySlot, receiver.textureBound = nil, nil
    end
    if receiver.dui then DestroyDui(receiver.dui) receiver.dui = nil end
    receiver.ready = false
end

local function ChaseReceiverAcquireDisplay(vehicle, receiver)
    if receiver.displaySlot then return true end
    for _, slot in ipairs(chaseConfig.display.slots or {}) do
        if not chaseDisplaySlots[slot.model] then
            chaseDisplaySlots[slot.model], receiver.displaySlot = receiver, slot
            RequestStreamedTextureDict(slot.dictionary, false)
            chaseDisplayDictionaries[slot.dictionary] = true
            local previous = receiver.object
            local object = ChaseReceiverObject(slot.model, vehicle, receiver.mount or ChaseReceiverMount(vehicle), false)

            if not object or chaseStopping or chaseVehicles[vehicle] ~= receiver
                or receiver.displaySlot ~= slot or chaseDisplaySlots[slot.model] ~= receiver
                or receiver.object ~= previous or not DoesEntityExist(vehicle) then
                if object and DoesEntityExist(object) then DeleteEntity(object) end
                if receiver.displaySlot == slot then ChaseReceiverDestroyDisplay(receiver) end
                return false
            end
            ChaseReceiverAttach(object, vehicle, receiver.mount or ChaseReceiverMount(vehicle), false)
            receiver.object, receiver.model = object, slot.model
            if previous and DoesEntityExist(previous) then DeleteEntity(previous) end
            return true
        end
    end
    return false
end

local function ChaseReceiverRetireDisplay(vehicle, receiver)
    local previous, slot = receiver.object, receiver.displaySlot
    local mount = receiver.mount or ChaseReceiverMount(vehicle)

    local object = ChaseReceiverObject(chaseConfig.models.vehicle, vehicle, mount, false)
    if chaseStopping or chaseVehicles[vehicle] ~= receiver or receiver.object ~= previous or receiver.displaySlot ~= slot then
        if object and DoesEntityExist(object) then DeleteEntity(object) end
        return
    end
    if object then ChaseReceiverAttach(object, vehicle, receiver.mount or mount, false) end
    ChaseReceiverDestroyDisplay(receiver)
    receiver.object, receiver.model = object, chaseConfig.models.vehicle
end

function ChaseReceiverRemoveVehicle(vehicle)
    local receiver = chaseVehicles[vehicle]
    if not receiver then return end
    ChaseReceiverDestroyDisplay(receiver)
    if receiver.object and DoesEntityExist(receiver.object) then DeleteEntity(receiver.object) end
    chaseVehicles[vehicle] = nil
end

local function ChaseReceiverStopAnimation()
    if not chaseAnimation then return end
    local animation = chaseAnimation
    chaseAnimation = nil
    if DoesEntityExist(animation.ped) then
        StopAnimTask(animation.ped, animation.dictionary, animation.animation, 3.0)
    end
end

local function ChaseReceiverRemovePlayer(player)
    local receiver = chasePlayers[player]
    if not receiver then return end
    for _, object in ipairs(receiver.objects) do if DoesEntityExist(object) then DeleteEntity(object) end end
    if player == PlayerId() then ChaseReceiverStopAnimation() end
    chasePlayers[player] = nil
end

local function ChaseReceiverLoadAnimation(dictionary)
    if not dictionary or chaseStopping then return false end
    chaseAnimationDictionaries[dictionary] = true
    RequestAnimDict(dictionary)
    local deadline = GetGameTimer() + 2000
    while not chaseStopping and not HasAnimDictLoaded(dictionary) and GetGameTimer() < deadline do Wait(25) end
    return not chaseStopping and HasAnimDictLoaded(dictionary)
end

local function ChaseReceiverCanAnimate(ped)
    return not chaseStopping and ped == PlayerPedId() and DoesEntityExist(ped)
        and not IsEntityDead(ped) and not IsPedInAnyVehicle(ped, false) and not IsPedRagdoll(ped)
end

local function ChaseReceiverPlay(ped, mount, clip, flags)
    local replayAttempts = 0
    if mount == chaseConfig.carry.hand and flags == chaseHandCarryFlags and chaseAnimation
        and chaseAnimation.ped == ped and chaseAnimation.dictionary == mount.dictionary
        and chaseAnimation.animation == clip and chaseAnimation.flags == flags then
        replayAttempts = chaseAnimation.replayAttempts or 0
        if chaseAnimation.retryAt then replayAttempts = math.min(replayAttempts + 1, 3) end
    end
    if chaseAnimation and (chaseAnimation.ped ~= ped or chaseAnimation.dictionary ~= mount.dictionary
        or chaseAnimation.flags ~= flags) then ChaseReceiverStopAnimation() end

    TaskPlayAnim(ped, mount.dictionary, clip, 4.0, -4.0, -1, flags, 0.0, false, false, false)
    SetEntityAnimSpeed(ped, mount.dictionary, clip, 1.0)
    chaseAnimation = { ped = ped, dictionary = mount.dictionary, animation = clip, flags = flags,
        replayAttempts = replayAttempts }
end

local function ChaseReceiverHandReplayReady(ped, mount, clip, playing)
    local animation = chaseAnimation
    if mount ~= chaseConfig.carry.hand or not animation or animation.flags ~= chaseHandCarryFlags
        or animation.ped ~= ped or animation.dictionary ~= mount.dictionary
        or animation.animation ~= clip then return true end
    local now = GetGameTimer()
    if playing then
        animation.retryAt = nil
        animation.playingSince = animation.playingSince or now
        if now - animation.playingSince >= 2000 then animation.replayAttempts = 0 end
        return true
    end
    animation.playingSince = nil

    animation.retryAt = animation.retryAt or now + math.min(750 * 2 ^ (animation.replayAttempts or 0), 4000)
    return now >= animation.retryAt
end

local function ChaseReceiverAnimate(mount)
    if not mount or (chaseCarryAction and not chaseCarryAction.presentationReleased)
        or chaseStopping or chaseCarrySuspended or chaseAnimationLoading then return end
    local ped = PlayerPedId()
    if not mount.dictionary or not ChaseReceiverCanAnimate(ped) then ChaseReceiverStopAnimation() return end
    local clip = mount.animation
    local playing = IsEntityPlayingAnim(ped, mount.dictionary, clip, 3)
    local replayReady = ChaseReceiverHandReplayReady(ped, mount, clip, playing)
    if playing or not replayReady then return end
    local load = {}
    chaseAnimationLoading = load
    local loaded = ChaseReceiverLoadAnimation(mount.dictionary)
    if chaseAnimationLoading == load then chaseAnimationLoading = nil end
    local current = ChaseReceiverLocalState()
    local currentMount = type(current) == 'table' and current.device == 'portable'
        and chaseConfig.carry[current.carry == 'shoulder' and 'shoulder' or 'hand'] or nil
    if not loaded or (chaseCarryAction and not chaseCarryAction.presentationReleased)
        or chaseCarrySuspended or currentMount ~= mount or not ChaseReceiverCanAnimate(ped) then return end
    ChaseReceiverPlay(ped, mount, clip, mount == chaseConfig.carry.hand and chaseHandCarryFlags or 49)
end

local function ChaseCarryRefusal(code, message)
    return false, { ok = false, error = { code = code, message = message } }
end

local function ChaseCarryValid(operation)
    return chaseCarryAction == operation and not operation.cancelled and ChaseReceiverCanAnimate(operation.ped)
        and #(GetEntityCoords(operation.ped) - operation.origin) < 3.0
end

local function ChaseCarryTransition(operation, clip)
    if not clip or not ChaseCarryValid(operation) then return false end
    operation.phase = (clip == operation.mount.lowerAnimation or clip == operation.mount.reachAnimation) and 'lowering' or 'raising'
    ChaseReceiverPlay(operation.ped, operation.mount, clip, 2)
    local startedAt = GetGameTimer()
    local duration = operation.mount.transitionMilliseconds or 1400
    while ChaseCarryValid(operation) and GetGameTimer() - startedAt < duration do
        if GetGameTimer() - startedAt > 250 and not IsEntityPlayingAnim(operation.ped, operation.mount.dictionary, clip, 3) then return false end
        Wait(0)
    end
    return ChaseCarryValid(operation)
end

local function ChaseCarryFinish(operation)
    if chaseCarryAction ~= operation then return end
    chaseCarryAction, chaseCarrySuspended = nil, false
    if operation.putAway and ChaseReceiverCanAnimate(operation.ped) then
        local state = ChaseReceiverLocalState()
        if type(state) == 'table' and state.device == 'portable' then

            ChaseBootlegClient.ChaseAction('equipDevice', { device = 'none' })
            return
        end
    end
    if not operation.presentationReleased then ChaseReceiverStopAnimation() end
end

local function ChaseCarryReleasePresentation(operation)
    if chaseCarryAction ~= operation or operation.phase ~= 'request' or operation.presentationReleased then return end

    operation.presentationReleased = true
    ChaseReceiverStopAnimation()
end

local function ChaseCarryApproach(operation, object)
    local offset = operation.mount.floorOffset
    if not offset or not DoesEntityExist(object) then return false end
    local position = GetEntityCoords(object)
    local heading = (GetEntityHeading(object) - (operation.mount.floorHeading or 0.0)) % 360.0
    local radians = math.rad(heading)
    local target = vector3(position.x - offset.x * math.cos(radians) + offset.y * math.sin(radians),
        position.y - offset.x * math.sin(radians) - offset.y * math.cos(radians), GetEntityCoords(operation.ped).z)
    if #(target - operation.origin) > 2.5 then return false end
    operation.phase = 'approaching'
    TaskGoStraightToCoord(operation.ped, target.x + 0.0, target.y + 0.0, target.z + 0.0, 1.0, -1, heading + 0.0, 0.0)
    local deadline = GetGameTimer() + 3500
    local aligned = false
    while ChaseCarryValid(operation) and DoesEntityExist(object) and GetGameTimer() < deadline do
        local here = GetEntityCoords(operation.ped)
        local angle = math.abs((GetEntityHeading(operation.ped) - heading + 180.0) % 360.0 - 180.0)
        if #(here - target) < 0.10 and angle < 8.0 then aligned = true break end
        Wait(0)
    end
    if ChaseReceiverCanAnimate(operation.ped) then TaskStandStill(operation.ped, 200) end
    return aligned and ChaseCarryValid(operation) and DoesEntityExist(object)
end

local function ChaseCarryPrepareAction(action, data)
    if action ~= 'placeRadio' and action ~= 'pickupRadio' and action ~= 'equipDevice' then return true end
    if chaseCarryAction then return ChaseCarryRefusal('busy', 'Finish the current Field Radio movement first.') end
    local current = ChaseReceiverLocalState()
    local operation = { action = action, ped = PlayerPedId(), origin = GetEntityCoords(PlayerPedId()),
        visualState = type(current) == 'table' and { device = current.device, carry = current.carry } or { device = 'none' }, phase = 'preparing' }
    chaseCarryAction = operation
    if action == 'equipDevice' then
        operation.phase, operation.requestAt = 'request', GetGameTimer()
        return true
    end
    operation.mount = chaseConfig.carry.hand
    if not ChaseReceiverCanAnimate(operation.ped) then
        ChaseCarryFinish(operation)
        return ChaseCarryRefusal('carry_unavailable', 'Stand on foot to move the Field Radio.')
    end
    if not ChaseReceiverLoadAnimation(operation.mount.dictionary) or not ChaseCarryValid(operation) then
        ChaseCarryFinish(operation)
        return ChaseCarryRefusal('animation_unavailable', 'The Field Radio movement could not load. Please try again.')
    end
    if action == 'placeRadio' then
        if operation.visualState.device ~= 'portable' or operation.visualState.carry == 'shoulder' then

            operation.visualState = { device = 'portable', carry = 'hand' }
        end
        ChaseReceiverObservePlayer(PlayerId(), operation.visualState)
    else
        if operation.visualState.device == 'portable' then
            ChaseCarryFinish(operation)
            return ChaseCarryRefusal('hands_full', 'Put away the radio you are carrying before picking up another.')
        end
        operation.object = chasePlaced[data.netId]
        if not operation.object or not ChaseCarryApproach(operation, operation.object) then
            ChaseCarryFinish(operation)
            return ChaseCarryRefusal('pickup_alignment', 'Stand on clear, level ground beside the radio so you can reach its handle.')
        end
    end
    local lowerClip = action == 'pickupRadio' and (operation.mount.reachAnimation or operation.mount.lowerAnimation)
        or operation.mount.lowerAnimation
    if not ChaseCarryTransition(operation, lowerClip) then
        ChaseCarryFinish(operation)
        return ChaseCarryRefusal('carry_cancelled', 'Field Radio movement cancelled.')
    end
    if action == 'placeRadio' then
        local receiver = chasePlayers[PlayerId()]
        local object = receiver and receiver.objects[1]
        if not object or not DoesEntityExist(object) then
            ChaseCarryFinish(operation)
            return ChaseCarryRefusal('carry_unavailable', 'The held Field Radio is unavailable. Please equip it again.')
        end
        local position = GetEntityCoords(object)
        data.placement = { x = position.x, y = position.y, z = position.z, heading = GetEntityHeading(object) }
    elseif not DoesEntityExist(operation.object) then
        ChaseCarryTransition(operation, operation.mount.recoverAnimation or operation.mount.raiseAnimation)
        ChaseCarryFinish(operation)
        return ChaseCarryRefusal('radio_unavailable', 'Someone else picked up that Field Radio.')
    else
        local offset = operation.mount.floorOffset
        local reach = GetOffsetFromEntityInWorldCoords(operation.ped, offset.x, offset.y, offset.z)
        if #(GetEntityCoords(operation.object) - reach) > 0.20 then
            ChaseCarryTransition(operation, operation.mount.recoverAnimation or operation.mount.raiseAnimation)
            ChaseCarryFinish(operation)
            return ChaseCarryRefusal('pickup_alignment', 'Move beside the radio on level ground to reach its handle.')
        end
    end
    operation.phase, operation.requestAt = 'request', GetGameTimer()
    return true
end

local function ChaseCarryCompleteAction(action, response)
    if action ~= 'placeRadio' and action ~= 'pickupRadio' and action ~= 'equipDevice' then return end
    local operation = chaseCarryAction
    if not operation or operation.action ~= action then return end
    local devices = response.ok and response.data and response.data.devices
    if devices then
        chaseCarryOverride = { device = devices.active, carry = devices.carry }
        chaseCarryOverrideUntil = GetGameTimer() + 2000
        operation.visualState = chaseCarryOverride
    end
    if response.ok and action == 'placeRadio' then
        ChaseReceiverRemovePlayer(PlayerId())

        if not operation.presentationReleased then
            ChaseCarryTransition(operation, operation.mount.recoverAnimation or operation.mount.raiseAnimation)
        end
    elseif response.ok and action == 'pickupRadio' then
        if devices and devices.active == 'portable' then ChaseReceiverObservePlayer(PlayerId(), operation.visualState) end
        if not operation.presentationReleased then
            local clip = devices and devices.active == 'portable' and operation.mount.raiseAnimation
                or operation.mount.recoverAnimation or operation.mount.raiseAnimation
            ChaseCarryTransition(operation, clip)
        end
    elseif action ~= 'equipDevice' then

        if not operation.presentationReleased then
            local clip = action == 'pickupRadio' and operation.mount.recoverAnimation or operation.mount.raiseAnimation
            ChaseCarryTransition(operation, clip or operation.mount.raiseAnimation)
        end
    elseif devices and devices.active ~= 'portable' then
        ChaseReceiverRemovePlayer(PlayerId())
    end
    ChaseCarryFinish(operation)
end

local function ChaseCarryRecoverAction(action, failure)
    local operation = chaseCarryAction
    if operation and operation.action == action then
        operation.putAway = false
        ChaseCarryFinish(operation)
    end
    print(('[chase_bootleg] Field Radio movement failed: %s'):format(tostring(failure)))
end

function ChaseBootlegDevices.ChaseBeforeAction(action, data)
    local success, allowed, refusal = pcall(ChaseCarryPrepareAction, action, data)
    if success then return allowed, refusal end
    ChaseCarryRecoverAction(action, allowed)
    return ChaseCarryRefusal('carry_failed', 'The radio movement could not finish. Please try again.')
end

function ChaseBootlegDevices.ChaseAfterAction(action, response)
    local success, failure = pcall(ChaseCarryCompleteAction, action, response)
    if not success then ChaseCarryRecoverAction(action, failure) end
end
ChaseReceiverObservePlayer = function(player, state)
    local ped = GetPlayerPed(player)
    local carry = state.carry == 'shoulder' and 'shoulder' or 'hand'
    local signature = state.device .. ':' .. carry
    local receiver = chasePlayers[player]
    if receiver then
        for _, object in ipairs(receiver.objects) do
            if not DoesEntityExist(object) then ChaseReceiverRemovePlayer(player) receiver = nil break end
        end
    end
    if receiver and (receiver.ped ~= ped or receiver.signature ~= signature) then
        ChaseReceiverRemovePlayer(player)
        receiver = nil
    end
    if not receiver then
        if GetGameTimer() < (chasePlayerRetries[player] or 0) then return end
        receiver = { ped = ped, signature = signature, objects = {} }
        chasePlayers[player] = receiver
        if state.device == 'buds' then
            local left = ChaseReceiverObject(chaseConfig.models.leftBud, ped, chaseConfig.buds.left, true)
            local right = ChaseReceiverObject(chaseConfig.models.rightBud, ped, chaseConfig.buds.right, true)
            if left then receiver.objects[#receiver.objects + 1] = left end
            if right then receiver.objects[#receiver.objects + 1] = right end
        else
            local object = ChaseReceiverObject(chaseConfig.models.portable, ped, chaseConfig.carry[carry], true)
            if object then receiver.objects[1] = object end
        end
        local expected = state.device == 'buds' and 2 or 1
        if #receiver.objects ~= expected then
            ChaseReceiverRemovePlayer(player)
            chasePlayerRetries[player] = GetGameTimer() + 5000
            return
        end
        chasePlayerRetries[player] = nil
    end
    if player == PlayerId() and state.device == 'portable' then ChaseReceiverAnimate(chaseConfig.carry[carry]) end
end

local function ChasePlacedState(entity)
    if not entity or not DoesEntityExist(entity) or GetEntityModel(entity) ~= chasePlacedHash or not NetworkGetEntityIsNetworked(entity) then return nil end
    local state = Entity(entity).state['chase_bootleg:placed']
    return type(state) == 'table' and type(state.netId) == 'number' and state or nil
end

local function ChasePlacedAction(action, data, message)
    local response = ChaseBootlegClient.ChaseAction(action, data)
    if not response.ok then
        ChaseBootlegClient.ChaseNotify(response.error and response.error.message or 'The field radio is unavailable.', 'error')
    elseif message then
        ChaseBootlegClient.ChaseNotify(message, 'success')
    end
end

local function ChasePlacedHelp(text)
    BeginTextCommandDisplayHelp('STRING')
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandDisplayHelp(0, false, true, -1)
end

function ChaseBootlegDevices.ChaseReceiverMode()
    local ped = PlayerPedId()
    local state = LocalPlayer.state['chase_bootleg:receiver']
    local snapshot = ChaseBootlegClient.snapshot
    local selected = snapshot and snapshot.devices and snapshot.devices.active
    if selected == 'buds' or (not selected and type(state) == 'table' and state.device == 'buds') then return 'buds' end
    local vehicle = GetVehiclePedIsIn(ped, false)
    if vehicle ~= 0 then
        local installed = Entity(vehicle).state['chase_bootleg:receiver']
        if type(installed) == 'table' and installed.installed then return 'vehicle' end
    end
    if selected == 'portable' or (not selected and type(state) == 'table' and state.device == 'portable') then return 'portable' end
    return nil
end

local function ChaseReceiverUse(device)
    if chaseUsingItem or IsEntityDead(PlayerPedId()) then return end
    chaseUsingItem = true
    local success, failure = pcall(function()
        local response
        if device == 'vehicle' then
            local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
            if vehicle == 0 or GetPedInVehicleSeat(vehicle, -1) ~= PlayerPedId() then
                ChaseBootlegClient.ChaseNotify('Sit in the driver seat to install or reposition the receiver.', 'error')
                return
            end
            if ChaseBootlegDashboard and ChaseBootlegConfig.Dashboard.enabled then
                ChaseBootlegDashboard.ChasePlace(vehicle)
                return
            end
            response = ChaseBootlegClient.ChaseAction('installReceiver', { netId = VehToNet(vehicle), mount = ChaseBootlegDevices.ChaseVehicleMount(vehicle) })
        else
            local snapshot = ChaseBootlegClient.snapshot
            local current = snapshot and snapshot.devices and snapshot.devices.active
            local selected = current == device and 'none' or device
            response = ChaseBootlegClient.ChaseAction('equipDevice', { device = selected, carry = 'hand' })
        end
        if not response.ok then
            ChaseBootlegClient.ChaseNotify(response.error and response.error.message or 'Receiver unavailable.', 'error')
            return
        end
        if device == 'buds' then
            local equipped = response.data and response.data.devices and response.data.devices.active == 'buds'
            ChaseBootlegClient.ChaseNotify(equipped and 'Signalbuds connected. Open Senora Signalworks on your phone to tune in.' or 'Signalbuds put away.', 'success')
        elseif device == 'portable' and response.data and response.data.devices and response.data.devices.active == 'none' then
            ChaseBootlegClient.ChaseNotify('Field Radio put away.', 'success')
        else
            ChaseBootlegClient.ChaseOpen('listen')
        end
    end)
    chaseUsingItem = false
    if not success then
        print(('[chase_bootleg] Receiver use failed: %s'):format(tostring(failure)))
        ChaseBootlegClient.ChaseNotify('The receiver could not be activated. Try again.', 'error')
    end
end

local function ChaseReceiverInventoryUse(data, device)
    if GetResourceState('ox_inventory') == 'started' then
        exports.ox_inventory:useItem(data, function(used) if used then ChaseReceiverUse(device) end end)
    else
        ChaseReceiverUse(device)
    end
end

exports('ChaseUseVehicleReceiver', function(data) ChaseReceiverInventoryUse(data, 'vehicle') end)
exports('ChaseUsePortableRadio', function(data) ChaseReceiverInventoryUse(data, 'portable') end)
exports('ChaseUseSignalbuds', function(data) ChaseReceiverInventoryUse(data, 'buds') end)

RegisterNetEvent('chase_bootleg:client:useDevice', function(device)
    if source ~= 65535 or (device ~= 'vehicle' and device ~= 'portable' and device ~= 'buds') then return end
    ChaseReceiverUse(device)
end)

function ChaseBootlegDevices.ChaseReceiverCorners(receiver)

    local display = chaseConfig.display
    local centre, size = display.centre, display.size
    local x1, x2 = centre.x - size.width / 2.0, centre.x + size.width / 2.0
    local z1, z2 = centre.z - size.height / 2.0, centre.z + size.height / 2.0
    local a = GetOffsetFromEntityInWorldCoords(receiver.object, x1, centre.y, z2)
    local b = GetOffsetFromEntityInWorldCoords(receiver.object, x2, centre.y, z2)
    local c = GetOffsetFromEntityInWorldCoords(receiver.object, x1, centre.y, z1)
    local d = GetOffsetFromEntityInWorldCoords(receiver.object, x2, centre.y, z1)
    return a, b, c, d
end

CreateThread(function()
    while not chaseStopping do
        local position = GetEntityCoords(PlayerPedId())
        local keepVehicles, keepPlayers = {}, {}
        if chaseConfig.enabled then
            for _, vehicle in ipairs(GetGamePool('CVehicle')) do
                if #(position - GetEntityCoords(vehicle)) < chaseConfig.streamDistance then
                    local receiver = chaseVehicles[vehicle]
                    local state = receiver and receiver.optimisticUntil and GetGameTimer() < receiver.optimisticUntil
                        and receiver.optimisticState or Entity(vehicle).state['chase_bootleg:receiver']
                    local mount = type(state) == 'table' and state.mount or ChaseReceiverMount(vehicle)
                    if receiver and receiver.preview then
                        keepVehicles[vehicle] = true
                        if not receiver.object or not DoesEntityExist(receiver.object) then
                            ChaseReceiverDestroyDisplay(receiver)
                            local object = ChaseReceiverObject(chaseConfig.models.vehicle, vehicle, receiver.mount, false)
                            if object and chaseVehicles[vehicle] == receiver and receiver.preview and not chaseStopping then
                                receiver.object, receiver.model = object, chaseConfig.models.vehicle
                                ChaseReceiverAttach(object, vehicle, receiver.mount, false)
                            elseif object then DeleteEntity(object) end
                        end
                    elseif type(state) == 'table' and state.installed and mount then
                        keepVehicles[vehicle] = true
                        if receiver and (not receiver.object or not DoesEntityExist(receiver.object)) then
                            ChaseReceiverDestroyDisplay(receiver)
                            local object = ChaseReceiverObject(chaseConfig.models.vehicle, vehicle, mount, false)
                            if object and chaseVehicles[vehicle] == receiver and not chaseStopping then
                                receiver.object, receiver.model = object, chaseConfig.models.vehicle
                                receiver.mountSignature = nil
                            elseif object then DeleteEntity(object) end
                        end
                        if not receiver then
                            local object = ChaseReceiverObject(chaseConfig.models.vehicle, vehicle, mount, false)
                            if object then receiver = { object = object, model = chaseConfig.models.vehicle } chaseVehicles[vehicle] = receiver end
                        end
                        if receiver and receiver.object and DoesEntityExist(receiver.object) then
                            receiver.state = state
                            receiver.mount = mount
                            local signature = ('%s:%.5f:%.5f:%.5f:%.3f:%.3f:%.3f'):format(mount.bone or '',
                                mount.x, mount.y, mount.z, mount.rx, mount.ry, mount.rz)
                            if receiver.mountSignature ~= signature then
                                ChaseReceiverAttach(receiver.object, vehicle, mount, false)
                                receiver.mountSignature = signature
                            end
                        end
                    end
                end
            end
            for _, player in ipairs(GetActivePlayers()) do
                local ped = GetPlayerPed(player)
                local state = player == PlayerId() and ChaseReceiverLocalState()
                    or Player(GetPlayerServerId(player)).state['chase_bootleg:receiver']
                if type(state) == 'table' and (state.device == 'portable' or state.device == 'buds')
                    and not IsEntityDead(ped) and #(position - GetEntityCoords(ped)) < 35.0
                    and not (player == PlayerId() and chaseCarrySuspended)
                    and (state.device == 'buds' or not IsPedInAnyVehicle(ped, false)) then
                    keepPlayers[player] = true
                    ChaseReceiverObservePlayer(player, state)
                end
            end
        end
        local keepPlaced = {}
        for _, object in ipairs(ChaseBootlegConfig.PlacedRadio.enabled and GetGamePool('CObject') or {}) do
            local state = GetEntityModel(object) == chasePlacedHash and ChasePlacedState(object) or nil
            if state then
                keepPlaced[state.netId] = true
                chasePlaced[state.netId] = object
                if not chasePlacedSettled[state.netId] and NetworkHasControlOfEntity(object) then
                    SetEntityCollision(object, true, true)
                    SetEntityRotation(object, 0.0, 0.0, GetEntityHeading(object), 2, true)
                    if PlaceObjectOnGroundProperly(object) or (chasePlacedAttempts[state.netId] or 0) >= 10 then
                        FreezeEntityPosition(object, true)
                        chasePlacedSettled[state.netId] = true
                    else
                        chasePlacedAttempts[state.netId] = (chasePlacedAttempts[state.netId] or 0) + 1
                    end
                end
            end
        end
        for netId in pairs(chasePlaced) do
            if not keepPlaced[netId] then chasePlaced[netId], chasePlacedSettled[netId], chasePlacedAttempts[netId] = nil, nil, nil end
        end
        for vehicle in pairs(chaseVehicles) do
            if not keepVehicles[vehicle] or not DoesEntityExist(vehicle) then ChaseReceiverRemoveVehicle(vehicle) end
        end
        for player in pairs(chasePlayers) do if not keepPlayers[player] then ChaseReceiverRemovePlayer(player) end end
        Wait(chaseConfig.pollMilliseconds)
    end
end)

function ChaseBootlegDevices.ChaseFieldContext()
    local ped = PlayerPedId()
    if chaseStopping or chaseUsingItem or chaseCarryAction or chaseCarrySuspended or ChaseBootlegClient.visible
        or (ChaseBootlegPhone and ChaseBootlegPhone.open) or IsPauseMenuActive() or IsNuiFocused()
        or IsEntityDead(ped) or IsPedRagdoll(ped) or IsPedInAnyVehicle(ped, false) then return nil end
    local state = ChaseReceiverLocalState()
    if type(state) == 'table' and state.device == 'portable' then return { mode = 'carried', carry = state.carry } end
    local position = GetEntityCoords(ped)
    local nearest, distance = nil, math.min(2.0, ChaseBootlegConfig.PlacedRadio.interactDistance)
    for netId, object in pairs(chasePlaced) do
        if ChasePlacedState(object) then
            local currentDistance = #(position - GetEntityCoords(object))
            if currentDistance < distance then nearest, distance = netId, currentDistance end
        end
    end
    return nearest and { mode = 'placed', netId = nearest } or nil
end

function ChaseBootlegDevices.ChaseFieldControl(control)
    if control == 'cancel' and chaseCarryAction then
        chaseCarryAction.putAway = true

        if chaseCarryAction.phase ~= 'request' then chaseCarryAction.cancelled = true
        else ChaseCarryReleasePresentation(chaseCarryAction) end
        return
    end
    local context = ChaseBootlegDevices.ChaseFieldContext()
    if not context then return end
    if control == 'cancel' and context.mode ~= 'carried' then return end
    if control == 'place' and context.mode == 'carried' and not ChaseBootlegConfig.PlacedRadio.enabled then return end
    chaseUsingItem = true
    local action, data, message
    if control == 'cancel' then
        action, data, message = 'equipDevice', { device = 'none' }, 'Field Radio put away.'
    elseif context.mode == 'carried' then
        action, data, message = 'placeRadio', {}, 'Field Radio placed on the floor.'
    else
        action, data, message = 'pickupRadio', { netId = context.netId, equip = true }, 'Field Radio picked up.'
    end
    local success, failure = pcall(ChasePlacedAction, action, data, message)
    chaseUsingItem = false
    if not success then
        chaseCarrySuspended = false
        print(('[chase_bootleg] Field Radio control failed: %s'):format(tostring(failure)))
        ChaseBootlegClient.ChaseNotify('The radio action could not finish. Please try again.', 'error')
    end
end

local chaseFieldCommands = { place = '+chase_bootleg:fieldPlace', cancel = '+chase_bootleg:fieldCancel' }
local chaseFieldKeys = ChaseBootlegConfig.FieldControls or { placeKey = 'G', cancelKey = 'X' }
for control, command in pairs(chaseFieldCommands) do
    RegisterCommand(command, function() ChaseBootlegDevices.ChaseFieldControl(control) end, false)
    RegisterCommand(command:gsub('^%+', '-'), function() end, false)
    RegisterKeyMapping(command, control == 'place' and 'Senora Field Radio: place / pick up'
        or 'Senora Field Radio: cancel carry / put away', 'keyboard', control == 'place' and chaseFieldKeys.placeKey or chaseFieldKeys.cancelKey)
end

local function ChaseFieldKeyLabel(command)
    local label = GetControlInstructionalButton(0, joaat(command) | 0x80000000, true)
    if type(label) == 'string' and label:sub(1, 2) == 't_' then return label:sub(3) end
    local labels = { b_100 = 'Mouse 1', b_101 = 'Mouse 2', b_102 = 'Mouse 3', b_2000 = 'Space', b_1000 = 'Shift', b_1001 = 'Ctrl', b_1002 = 'Alt' }
    return labels[label] or 'Bound key'
end

CreateThread(function()
    while not chaseStopping do
        local context = ChaseBootlegDevices.ChaseFieldContext()
        SendNUIMessage({ type = 'chase_bootleg:fieldHint', data = context and {
            mode = context.mode, carry = context.carry, canPlace = ChaseBootlegConfig.PlacedRadio.enabled,
            placeKey = ChaseFieldKeyLabel(chaseFieldCommands.place), cancelKey = ChaseFieldKeyLabel(chaseFieldCommands.cancel)
        } or false })
        Wait(context and 250 or 500)
    end
end)

CreateThread(function()
    while not chaseStopping do
        local position = GetEntityCoords(PlayerPedId())
        local candidates, keep = {}, {}
        for vehicle, receiver in pairs(chaseVehicles) do
            if receiver.object and DoesEntityExist(receiver.object) then
                local distance = #(position - GetEntityCoords(receiver.object))
                if distance < chaseConfig.display.distance then
                    candidates[#candidates + 1] = { vehicle = vehicle, receiver = receiver, distance = distance }
                end
            end
        end
        local seatedVehicle = GetVehiclePedIsIn(PlayerPedId(), false)
        table.sort(candidates, function(a, b)
            local first = a.receiver.preview or a.vehicle == seatedVehicle
            local second = b.receiver.preview or b.vehicle == seatedVehicle
            if first ~= second then return first end
            if a.distance == b.distance then return a.vehicle < b.vehicle end
            return a.distance < b.distance
        end)
        local maximum = math.min(#candidates, chaseConfig.display.maximum, #(chaseConfig.display.slots or {}))
        for index = 1, maximum do keep[candidates[index].vehicle] = true end

        for vehicle, receiver in pairs(chaseVehicles) do
            if receiver.displaySlot and not keep[vehicle] then ChaseReceiverRetireDisplay(vehicle, receiver) end
        end
        for index = 1, maximum do
            local item = candidates[index]
            local receiver = item.receiver
            keep[item.vehicle] = true
            if not receiver.dui and GetGameTimer() > (receiver.retryAfter or 0)
                and ChaseReceiverAcquireDisplay(item.vehicle, receiver) then
                chaseDisplaySequence = chaseDisplaySequence + 1
                receiver.dui = CreateDui(('https://cfx-nui-%s/web/receiver.html?receiver=vehicle'):format(GetCurrentResourceName()),
                    chaseConfig.display.width, chaseConfig.display.height)
                receiver.dictionary = ('chase_bootleg:receiver:%s'):format(chaseDisplaySequence)
                receiver.deadline = GetGameTimer() + 6000
            end
            if receiver.dui and not receiver.ready and IsDuiAvailable(receiver.dui)
                and HasStreamedTextureDictLoaded(receiver.displaySlot.dictionary) then
                local dictionary = CreateRuntimeTxd(receiver.dictionary)
                CreateRuntimeTextureFromDuiHandle(dictionary, 'screen', GetDuiHandle(receiver.dui))
                local slot = receiver.displaySlot
                AddReplaceTexture(slot.dictionary, slot.texture, receiver.dictionary, 'screen')
                receiver.textureBound = true
                receiver.ready = true
            elseif receiver.dui and not receiver.ready and GetGameTimer() > receiver.deadline then
                ChaseReceiverDestroyDisplay(receiver)
                receiver.retryAfter = GetGameTimer() + 15000
            end
            if receiver.ready then
                local state = receiver.state
                local view = {
                    frequency = state.frequency, label = state.label or 'Senora Signalworks',
                    enabled = state.enabled == true, quality = state.quality or 0.0,
                    volume = ChaseBootlegAudio.ChaseGetVolume()
                }
                if ChaseBootlegDashboard then view = ChaseBootlegDashboard.ChaseDisplay(item.vehicle, view) end
                SendDuiMessage(receiver.dui, json.encode({ type = 'chase_bootleg:receiverDisplay', data = view }))
            end
        end
        Wait(500)
    end
end)

CreateThread(function()
    local settings, interaction = ChaseBootlegConfig.PlacedRadio, ChaseBootlegConfig.Interaction
    if GetResourceState('ox_target') == 'started' and interaction.target ~= 'none' then
        exports.ox_target:addModel(chasePlacedHash, {
            { name = 'chase_bootleg:placedTune', label = 'Tune radio', icon = 'fa-solid fa-radio', distance = settings.interactDistance,
                canInteract = function(entity) return ChasePlacedState(entity) ~= nil end,
                onSelect = function(data)
                    local state = ChasePlacedState(data.entity)
                    if state then ChaseBootlegClient.ChaseOpenPlaced(state.netId) end
                end },
            { name = 'chase_bootleg:placedCall', label = 'Call the host', icon = 'fa-solid fa-phone', distance = settings.interactDistance,
                canInteract = function(entity)
                    local state = ChasePlacedState(entity)
                    return state ~= nil and state.enabled == true and state.stationId ~= nil
                end,
                onSelect = function(data)
                    local state = ChasePlacedState(data.entity)
                    if state then ChasePlacedAction('callStation', { stationId = state.stationId, placedNetId = state.netId }) end
                end },
            { name = 'chase_bootleg:placedPickup', label = 'Pick up radio', icon = 'fa-solid fa-hand', distance = settings.interactDistance,
                canInteract = function(entity) return ChasePlacedState(entity) ~= nil end,
                onSelect = function(data)
                    local state = ChasePlacedState(data.entity)
                    if state then ChasePlacedAction('pickupRadio', { netId = state.netId }, 'Field Radio picked up.') end
                end }
        })
        chasePlacedTarget = true
        return
    end
    while not chaseStopping do
        local sleep = 400
        local ped = PlayerPedId()
        if not ChaseBootlegClient.visible and not (ChaseBootlegPhone and ChaseBootlegPhone.open) and not IsEntityDead(ped) and not IsPedInAnyVehicle(ped, false) then
            local position, nearest, nearestDistance = GetEntityCoords(ped), nil, 1.5
            for netId, object in pairs(chasePlaced) do
                local distance = DoesEntityExist(object) and #(position - GetEntityCoords(object)) or nearestDistance
                if distance < nearestDistance then nearest, nearestDistance = netId, distance end
            end
            if nearest then
                sleep = 0
                ChasePlacedHelp('Press ~INPUT_CONTEXT~ to use the ~y~field radio')
                if IsControlJustReleased(0, interaction.control) then ChaseBootlegClient.ChaseOpenPlaced(nearest) end
            end
        end
        Wait(sleep)
    end
end)

if ChaseBootlegConfig.Debug == true then
    local chaseTuning = nil
    local chaseTuneKeys = { [100] = { 'x', -1 }, [102] = { 'x', 1 }, [98] = { 'y', -1 }, [104] = { 'y', 1 }, [103] = { 'z', -1 }, [105] = { 'z', 1 } }
    local function ChaseTuneTarget(kind)
        local ped = PlayerPedId()
        if kind == 'vehicle' then
            local vehicle = GetVehiclePedIsIn(ped, false)
            local receiver = chaseVehicles[vehicle]
            return receiver and receiver.object, vehicle, vehicle ~= 0 and ChaseReceiverMount(vehicle), false
        end
        local receiver = chasePlayers[PlayerId()]
        local signature = (kind == 'leftBud' or kind == 'rightBud') and 'buds:' or ('portable:' .. tostring(kind))
        if not receiver or receiver.signature:sub(1, #signature) ~= signature then return nil end
        local mount = kind == 'leftBud' and chaseConfig.buds.left or kind == 'rightBud' and chaseConfig.buds.right or chaseConfig.carry[kind]
        return receiver.objects[kind == 'rightBud' and 2 or 1], ped, mount, true
    end
    RegisterCommand('senoraprop', function(_, arguments)
        local kind = arguments[1]
        local object, parent, mount, isPed = ChaseTuneTarget(kind)
        if chaseTuning or not object or not DoesEntityExist(object) or not mount then
            print('[chase_bootleg] /senoraprop <hand|shoulder|leftBud|rightBud|vehicle> tunes one attached receiver at a time; equip or enter it first.')
            return
        end
        local live = { bone = mount.bone, x = mount.x, y = mount.y, z = mount.z, rx = mount.rx, ry = mount.ry, rz = mount.rz }
        local label = kind == 'leftBud' and 'left' or kind == 'rightBud' and 'right' or kind == 'vehicle' and GetDisplayNameFromVehicleModel(GetEntityModel(parent)):lower() or kind
        chaseTuning = object
        print(('[chase_bootleg] Tuning %s: numpad 4/6 x, 8/2 y, 7/9 z (hold LEFT SHIFT to rotate), 5 prints, 0 stops.'):format(kind))
        CreateThread(function()
            while chaseTuning and not chaseStopping and DoesEntityExist(object) do
                local changed = false
                for key, axis in pairs(chaseTuneKeys) do
                    if IsRawKeyPressed(key) then
                        local rotate = IsRawKeyDown(160)
                        local field = rotate and 'r' .. axis[1] or axis[1]
                        live[field] = live[field] + axis[2] * (rotate and 2.5 or 0.005)
                        changed = true
                    end
                end
                if changed and DoesEntityExist(parent) then ChaseReceiverAttach(object, parent, live, isPed) end
                if IsRawKeyPressed(101) then
                    local bone = type(live.bone) == 'string' and ("bone = '%s', "):format(live.bone) or live.bone and ('bone = %d, '):format(live.bone) or ''
                    local animation = mount.dictionary and (", dictionary = '%s', animation = '%s'"):format(mount.dictionary, mount.animation) or ''
                    print(('%s = { %sx = %.3f, y = %.3f, z = %.3f, rx = %.1f, ry = %.1f, rz = %.1f%s }'):format(label, bone, live.x, live.y, live.z, live.rx, live.ry, live.rz, animation))
                end
                if IsRawKeyPressed(96) then chaseTuning = nil end
                Wait(0)
            end
            chaseTuning = nil
            print(('[chase_bootleg] Stopped tuning %s.'):format(kind))
        end)
    end, false)
end

CreateThread(function()
    while not chaseStopping do
        local state = ChaseReceiverLocalState()
        if chasePlayers[PlayerId()] and type(state) == 'table' and state.device == 'portable' then
            ChaseReceiverAnimate(chaseConfig.carry[state.carry == 'shoulder' and 'shoulder' or 'hand'])
        end
        Wait(100)
    end
end)

CreateThread(function()
    local controls = { 21, 22, 23, 24, 25, 30, 31, 37, 44, 140, 141, 142 }
    while not chaseStopping do
        local operation = chaseCarryAction
        if operation and operation.phase == 'request' and operation.requestAt
            and GetGameTimer() - operation.requestAt >= 5000 then ChaseCarryReleasePresentation(operation) end
        if operation and not operation.presentationReleased then
            for _, control in ipairs(controls) do DisableControlAction(0, control, true) end
            DisablePlayerFiring(PlayerId(), true)
            Wait(0)
        else
            Wait(100)
        end
    end
end)

AddEventHandler('onClientResourceStop', function(resource)
    if resource ~= GetCurrentResourceName() then return end
    chaseStopping = true
    if chaseCarryAction then
        chaseCarryAction.cancelled = true
        if chaseCarryAction.phase == 'approaching' and DoesEntityExist(chaseCarryAction.ped) then
            TaskStandStill(chaseCarryAction.ped, 1)
        end
    end
    for vehicle in pairs(chaseVehicles) do ChaseReceiverRemoveVehicle(vehicle) end
    for dictionary in pairs(chaseDisplayDictionaries) do SetStreamedTextureDictAsNoLongerNeeded(dictionary) end
    for player in pairs(chasePlayers) do ChaseReceiverRemovePlayer(player) end
    ChaseReceiverStopAnimation()
    for dictionary in pairs(chaseAnimationDictionaries) do RemoveAnimDict(dictionary) end
    if chasePlacedTarget and GetResourceState('ox_target') == 'started' then
        exports.ox_target:removeModel(chasePlacedHash, { 'chase_bootleg:placedTune', 'chase_bootleg:placedCall', 'chase_bootleg:placedPickup' })
    end
end)
