local server = ChaseBootlegServer
local domain = ChaseBootlegDomain
local config = ChaseBootlegConfig

local function ChaseEnvelope(success, result)
    if success then return domain.ChaseSuccess(result) end
    if type(result) == 'table' and result.code and result.message then return domain.ChaseError(result.code, result.message) end
    print(('[chase_bootleg] Unexpected server error: %s'):format(tostring(result)))
    return domain.ChaseError('internal_error', 'Signalworks could not complete that operation. Please contact an administrator if it continues.')
end

local function ChaseLockKeys(identity, action, data)
    local keys = {}
    local station = server.ChaseMine(identity.identifier)
    if action == 'tune' or action == 'request' or action == 'tip' or action == 'callStation' then
        station = domain.ChaseInteger(data.stationId, 1, 2147483647) and server.stations[data.stationId] or nil
    end
    if action == 'answerCall' or action == 'endCall' then station = server.ChaseParticipantStation(identity.source) or station end
    if action == 'tune' and domain.ChaseInteger(data.frequency, config.Frequency.min, config.Frequency.max) then
        for _, candidate in pairs(server.stations) do
            if candidate.frequency == data.frequency then station = candidate break end
        end
    end
    if station then keys[#keys + 1] = 'station:' .. station.id end
    local placedNetId = action == 'pickupRadio' and data.netId or data.placedNetId
    if (action == 'pickupRadio' or action == 'tune' or action == 'untune' or action == 'callStation')
        and domain.ChaseInteger(placedNetId, 1, 2147483647) then
        keys[#keys + 1] = 'placed:' .. placedNetId
    end
    if action == 'createStation' or action == 'updateStation' or action == 'crewAdd' or action == 'crewRemove' then
        keys[#keys + 1] = 'catalog'
    end
    if action == 'spawnVan' then keys[#keys + 1] = 'depot' end
    return keys
end

local function ChaseRequireView(identity, view)
    if view == 'studio' then server.ChaseRequireBroadcast(identity)
    elseif view == 'scanner' and (not config.Scanner.enabled or not ChaseBootlegFramework.ChaseIsPolice(identity)) then
        server.ChaseReject('police_required', 'Only authorized on-duty officers can open the scanner.')
    end
end

function ChaseBootlegServer.ChasePermissions(playerSource)
    if not server.ready then return domain.ChaseError('starting', 'Signalworks is not ready.') end
    return ChaseEnvelope(pcall(function()
        local identity = server.ChaseSession(playerSource)
        local now = GetGameTimer()
        if identity.permissionCache and domain.ChaseElapsed(now, identity.permissionCache.at) < 250 then
            return identity.permissionCache.value
        end
        local permissions = { canOperate = ChaseBootlegFramework.ChaseCanBroadcast(identity),
            isPolice = config.Scanner.enabled and ChaseBootlegFramework.ChaseIsPolice(identity) or false }
        identity.permissionCache = { at = now, value = permissions }
        return permissions
    end))
end

function ChaseBootlegServer.ChaseShop(playerSource)
    if not server.ready then return domain.ChaseError('starting', 'Signalworks is not ready.') end
    return ChaseEnvelope(pcall(function()
        local identity = server.ChaseSession(playerSource)
        server.ChaseRate(identity, 'receiverShop', 750)
        return ChaseBootlegShop.ChaseOpen(identity)
    end))
end

function ChaseBootlegServer.ChaseBootstrap(playerSource, view)
    if not server.ready then return domain.ChaseError('starting', 'Signalworks is starting or a required dependency is unavailable.') end
    if view ~= nil and view ~= 'listen' and view ~= 'studio' and view ~= 'scanner' and view ~= 'directory' and view ~= 'devices' then
        return domain.ChaseError('invalid_view', 'Choose a supported Signalworks view.')
    end
    return ChaseEnvelope(pcall(function()
        local identity = server.ChaseSession(playerSource)
        server.ChaseRate(identity, 'bootstrap', config.Security.bootstrapCooldownMilliseconds)
        ChaseRequireView(identity, view)
        local snapshot = server.ChaseSnapshot(identity)
        ChaseRequireView(identity, view)
        return snapshot
    end))
end

function ChaseBootlegServer.ChaseAction(playerSource, action, data)
    if not server.ready then return domain.ChaseError('starting', 'Signalworks is starting or a required dependency is unavailable.') end
    if type(action) ~= 'string' or #action > 32 or type(data) ~= 'table' or not ChaseBootlegActions.ChaseDispatch[action] then
        return domain.ChaseError('invalid_action', 'This Signalworks action is not supported.')
    end
    local identity, keys
    local token = {}
    local acquired = false
    local success, result = pcall(function()
        identity = server.ChaseSession(playerSource)
        server.ChaseRate(identity, 'action', config.Security.actionCooldownMilliseconds)
        if identity.busy then server.ChaseReject('busy', 'Your previous request is still being processed.') end
        keys = ChaseLockKeys(identity, action, data)
        for _, key in ipairs(keys) do
            if server.locks[key] then server.ChaseReject('busy', 'This station is handling another request. Try again in a moment.') end
        end
        identity.busy = token
        for _, key in ipairs(keys) do server.locks[key] = token end
        acquired = true
        server.ChasePosition(identity)
        local actionResult = ChaseBootlegActions.ChaseDispatch[action](identity, data)
        server.ChaseRoutes()
        if action == 'scan' then return actionResult end
        server.ChaseRefresh()
        return server.ChaseSnapshot(identity)
    end)
    if acquired then
        for _, key in ipairs(keys) do
            if server.locks[key] == token then server.locks[key] = nil end
        end
        if identity.busy == token then identity.busy = nil end
    end
    return ChaseEnvelope(success, result)
end

local function ChaseAttended(station)
    local vehicle = server.ChaseVehicle(station)
    if not vehicle then return false end
    for _, identity in pairs(server.sessions) do
        if domain.ChaseCanManage(station, identity.identifier) and server.ChaseCurrent(identity)
            and ChaseBootlegFramework.ChaseIsAlive(identity) and GetPlayerRoutingBucket(identity.source) == station.bucket
            and domain.ChaseDistance(GetEntityCoords(GetPlayerPed(identity.source)), GetEntityCoords(vehicle)) <= 50.0 then
            return true
        end
    end
    return false
end

function ChaseBootlegServer.ChaseMonitorStation(station, elapsedSeconds)
    if station.stage == 'stored' then return end
    local vehicle = server.ChaseVehicle(station)
    if not vehicle then
        server.ChaseSafetyNotice(station, server.ChaseSafetyReason(station))
        server.ChaseRemoveVan(station)
        return
    end
    if station.stage ~= 'parked' and not server.ChaseStationary(station) then
        server.ChaseSafetyNotice(station, server.ChaseSafetyReason(station))
        server.ChaseStopStation(station, 'parked')
        server.ChaseRefresh()
        return
    end
    if station.stage == 'deploying' then
        local identity = station.transitionIdentity
        if not identity or not server.ChaseCurrent(identity) or not ChaseBootlegFramework.ChaseCanBroadcast(identity)
            or not pcall(server.ChaseNearVan, identity, station, true) then
            server.ChaseSafetyNotice(station, ('Deployment cancelled. Stay alive within %.1f metres of the van with the broadcaster job until deployment finishes.'):format(config.Vehicle.operatorRange))
            server.ChaseStopStation(station, 'parked')
            server.ChaseRefresh()
            return
        end
    end
    if station.transitionStartedAt and domain.ChaseElapsed(GetGameTimer(), station.transitionStartedAt) >= station.duration * 1000 then
        if station.stage == 'deploying' then
            station.transitionIdentity = nil
            server.ChaseStage(station, 'ready')
        elseif station.stage == 'packing' then
            server.ChaseStopStation(station, 'parked')
        end
        server.ChaseRefresh()
    end
    if station.stage == 'ready' or station.live then
        local drain = station.live and domain.ChasePower(station.power).drainPerMinute or config.Battery.idleDrainPerMinute
        local previous = math.floor(station.battery)
        station.battery = math.max(0, station.battery - drain * elapsedSeconds / 60)
        if station.battery <= 0 then
            server.ChaseSafetyNotice(station, 'The studio battery is empty. Pack and recharge at the depot.')
            server.ChaseStopStation(station, 'parked')
            server.ChaseRefresh()
        elseif math.floor(station.battery) ~= previous then
            server.ChaseReplicate(station)
        end
    end
    if station.cartridge and not station.cartridge.pausedAt and os.time() >= station.cartridge.startedAt + station.cartridge.duration then
        local finished = station.cartridge
        station.cartridge = nil
        if station.live and station.autoplay then
            server.ChaseStartTrack(station, server.ChaseNextTrack(station, finished.trackId), finished.monitorIdentity)
            station.autoplay = server.ChaseMusicEnabled()
            server.ChaseRefresh()
        end
    end
    if ChaseAttended(station) or server.ChaseHasOccupants(vehicle) then
        station.lastAttendedAt = os.time()
    elseif station.lastAttendedAt and os.time() - station.lastAttendedAt > config.Vehicle.unattendedMinutes * 60 then
        ChaseBootlegDatabase.ChaseSaveBattery(station)
        if not server.ChaseHasOccupants(vehicle) then server.ChaseRemoveVan(station) end
        server.ChaseRefresh()
    end
end

function ChaseBootlegServer.ChaseTick(elapsedSeconds)
    for playerSource, identity in pairs(server.sessions) do
        if not server.ChaseCurrent(identity) then server.ChaseDropSource(playerSource) end
    end
    for _, station in pairs(server.stations) do
        local key = 'station:' .. station.id
        if not server.locks[key] then
            local lock = {}
            server.locks[key] = lock
            local success, failure = pcall(server.ChaseMonitorStation, station, elapsedSeconds)
            if server.locks[key] == lock then server.locks[key] = nil end
            if not success then print(('[chase_bootleg] Station %s monitor error: %s'):format(station.id, tostring(failure))) end
        end
    end
    server.ChaseRoutes()
end

local function ChaseValidateConfig()
    assert(config.Framework == 'auto' or config.Framework == 'qbox' or config.Framework == 'qbcore' or config.Framework == 'esx', 'Invalid framework selection')
    assert(domain.ChaseInteger(config.StationPrice, 1, 10000000), 'StationPrice must be an integer from 1 to 10000000')
    assert(domain.ChaseInteger(config.Battery.rechargePrice, 1, 10000000), 'Recharge price must be an integer from 1 to 10000000')
    assert(domain.ChaseInteger(config.MaxStationBalance, 1, 1000000000), 'Invalid maximum station balance')
    assert(#config.PowerModes > 0, 'At least one power mode is required')
    assert(config.Depot.radius > 0 and config.Vehicle.operatorRange > 0, 'Interaction ranges must be positive')
    assert(config.Scanner.requiredReadings >= 2 and config.Scanner.searchRadius >= 100, 'Scanner must keep at least 100 metres of location uncertainty')
    local powerIds, cartridgeIds = {}, {}
    for _, mode in ipairs(config.PowerModes) do
        assert(type(mode.id) == 'string' and not powerIds[mode.id] and mode.range > 0 and mode.drainPerMinute >= 0, 'Invalid power mode')
        powerIds[mode.id] = true
    end
    for _, cartridge in ipairs(config.Cartridges) do
        assert(type(cartridge.id) == 'string' and not cartridgeIds[cartridge.id], 'Cartridge IDs must be unique strings')
        assert(type(cartridge.url) == 'string' and (cartridge.url:match('^audio/[%w_%-%.]+$') or cartridge.url:match('^https://')), 'Cartridges require bundled audio or HTTPS URLs')
        assert(type(cartridge.duration) == 'number' and cartridge.duration > 0 and cartridge.duration <= 600, 'Cartridge duration must be 1–600 seconds')
        cartridgeIds[cartridge.id] = true
    end
    local music, cohosts, calls = config.Music, config.CoHosts, config.Calls
    assert(type(music) == 'table' and type(music.enabled) == 'boolean' and type(music.providers) == 'table'
        and type(music.providers.youtube) == 'boolean' and type(music.providers.soundcloud) == 'boolean', 'Music requires enabled and provider booleans')
    assert(domain.ChaseInteger(music.maxQueue, 1, 1000) and domain.ChaseInteger(music.minDurationSeconds, 1, 86400)
        and domain.ChaseInteger(music.maxDurationSeconds, music.minDurationSeconds, 86400), 'Music queue and duration limits must be sane integers')
    assert(music.defaultMode == 'dj' or music.defaultMode == 'autonomous', 'Music defaultMode must be dj or autonomous')
    assert(type(cohosts) == 'table' and domain.ChaseInteger(cohosts.maximum, 0, 16), 'CoHosts.maximum must be an integer from 0 to 16')
    assert(type(calls) == 'table' and type(calls.enabled) == 'boolean' and domain.ChaseInteger(calls.ringSeconds, 5, 300)
        and domain.ChaseInteger(calls.cooldownSeconds, 0, 3600) and domain.ChaseInteger(calls.maxOnAirSeconds, 10, 86400)
        and type(calls.acceptKey) == 'string' and type(calls.declineKey) == 'string', 'Calls require enabled, timing integers and key names')
    local placed, carry = config.PlacedRadio, config.ReceiverVisuals and config.ReceiverVisuals.carry
    assert(type(placed) == 'table' and type(placed.enabled) == 'boolean' and domain.ChaseInteger(placed.maximumPerPlayer, 0, 50)
        and type(placed.interactDistance) == 'number' and placed.interactDistance > 0 and domain.ChaseInteger(placed.expireMinutes, 1, 10080),
        'PlacedRadio requires enabled, maximumPerPlayer (0-50), a positive interactDistance and expireMinutes (1-10080)')
    assert(type(carry) == 'table' and type(carry.hand) == 'table' and type(carry.shoulder) == 'table', 'ReceiverVisuals.carry requires hand and shoulder mounts')
    for _, mount in pairs(carry) do
        for _, field in ipairs({ 'bone', 'x', 'y', 'z', 'rx', 'ry', 'rz' }) do
            assert(type(mount[field]) == 'number', 'ReceiverVisuals.carry mounts require numeric bone, x, y, z, rx, ry and rz')
        end
        assert((mount.dictionary == nil) == (mount.animation == nil) and (mount.dictionary == nil or type(mount.dictionary) == 'string' and type(mount.animation) == 'string'),
            'ReceiverVisuals.carry mounts need both dictionary and animation strings or neither')
    end
end

lib.callback.register('chase_bootleg:server:bootstrap', server.ChaseBootstrap)
lib.callback.register('chase_bootleg:server:action', server.ChaseAction)
lib.callback.register('chase_bootleg:server:permissions', server.ChasePermissions)
lib.callback.register('chase_bootleg:server:shop', server.ChaseShop)

RegisterNetEvent('chase_bootleg:server:speech', function(active)
    server.ChaseSpeech(source, active)
end)

RegisterNetEvent('chase_bootleg:server:microphoneInterrupted', function()
    server.ChaseLeave(source)
    server.ChaseRoutes()
end)

AddEventHandler('playerDropped', function()
    local playerSource = source
    server.ChaseDropSource(playerSource)
    server.ChaseRoutes()
end)

AddEventHandler('playerJoining', function()
    local playerSource = tonumber(source)
    if playerSource then server.ChaseLoadSource(playerSource) end
end)

local function ChaseCharacterUnloaded(playerSource)
    if not GetInvokingResource() then return end
    playerSource = tonumber(playerSource)
    if playerSource then
        server.ChaseUnloadSource(playerSource)
        server.ChaseRoutes()
    end
end

local function ChaseCharacterLoaded(player)
    if not GetInvokingResource() then return end
    local playerSource = type(player) == 'table' and player.PlayerData and player.PlayerData.source or player
    playerSource = tonumber(playerSource)
    if playerSource then
        server.ChaseLoadSource(playerSource)
        server.ChaseRoutes()
    end
end

AddEventHandler('QBCore:Server:OnPlayerUnload', ChaseCharacterUnloaded)
AddEventHandler('esx:playerLogout', ChaseCharacterUnloaded)
AddEventHandler('QBCore:Server:PlayerLoaded', ChaseCharacterLoaded)
AddEventHandler('esx:playerLoaded', ChaseCharacterLoaded)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        server.ready = false
        if ChaseBootlegShop then ChaseBootlegShop.ChaseStop() end
        if ChaseBootlegReceivers then
            ChaseBootlegReceivers.ChaseStop()
            ChaseBootlegReceivers.ChaseStopPlaced()
        end
        for _, station in pairs(server.stations) do
            MySQL.update('UPDATE chase_bootleg_stations SET battery = ? WHERE id = ?', { station.battery, station.id })
            server.ChaseRemoveVan(station)
        end
        for playerSource in pairs(server.sessions) do
            TriggerClientEvent('chase_bootleg:client:reception', playerSource, nil)
            TriggerClientEvent('chase_bootleg:client:cartridge', playerSource, nil)
        end
    elseif resourceName == 'qbx_core' or resourceName == 'qb-core' or resourceName == 'es_extended' or resourceName == 'oxmysql' then
        server.ready = false
        if ChaseBootlegReceivers then ChaseBootlegReceivers.ChaseStop() end
        for _, station in pairs(server.stations) do server.ChaseStopStation(station, station.vehicle and 'parked' or 'stored') end
        server.ChaseRoutes()
        print('[chase_bootleg] A core dependency stopped. Restart chase_bootleg after restoring its dependencies.')
    end
end)

MySQL.ready(function()
    local success, failure = pcall(function()
        ChaseValidateConfig()
        assert(GetConvar('onesync', 'off') ~= 'off', 'OneSync is required for authoritative vehicle and distance checks')
        ChaseBootlegFramework.ChaseInitialize()
        server.stations = ChaseBootlegDatabase.ChaseLoadStations()
        for _, station in pairs(server.stations) do
            assert(domain.ChasePower(station.power), 'A saved station uses a removed power mode; restore it or migrate that station')
            station.battery = domain.ChaseClamp(station.battery, 0, 100)
        end
        ChaseBootlegMoney.ChaseInitialize()
        if ChaseBootlegReceivers then ChaseBootlegReceivers.ChaseInitialize() end
        if ChaseBootlegShop then ChaseBootlegShop.ChaseInitialize() end
        server.ready = true
        print(('[chase_bootleg] Created by Chase. Server ready with %s.'):format(ChaseBootlegFramework.ChaseName()))
    end)
    if not success then print(('[chase_bootleg] Startup failed: %s. Import the documented SQL migrations and check the dependencies.'):format(failure)) end
end)

CreateThread(function()
    while true do
        Wait(250)
        if server.ready then server.ChaseSpeechTick() end
    end
end)

CreateThread(function()
    local previous = GetGameTimer()
    while true do
        Wait(1000)
        local now = GetGameTimer()
        local elapsed = domain.ChaseClamp(domain.ChaseElapsed(now, previous) / 1000, 0, 10)
        previous = now
        if server.ready then
            local success, failure = pcall(server.ChaseTick, elapsed)
            if not success then print(('[chase_bootleg] Runtime monitor failed: %s'):format(tostring(failure))) end
        end
    end
end)

CreateThread(function()
    while true do
        Wait(config.Battery.persistSeconds * 1000)
        if server.ready then
            for _, station in pairs(server.stations) do
                local key = 'station:' .. station.id
                if station.stage ~= 'stored' and not server.locks[key] then
                    local lock = {}
                    server.locks[key] = lock
                    local success, failure = pcall(ChaseBootlegDatabase.ChaseSaveBattery, station)
                    if server.locks[key] == lock then server.locks[key] = nil end
                    if not success then print(('[chase_bootleg] Battery save failed: %s'):format(tostring(failure))) end
                end
            end
        end
    end
end)
