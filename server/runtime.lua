ChaseBootlegServer = {
    stations = {}, sessions = {}, generations = {}, unloading = {}, tuned = {}, audible = {}, speechRoutes = {}, scans = {}, locks = {}, ready = false
}

local server = ChaseBootlegServer
local domain = ChaseBootlegDomain
local config = ChaseBootlegConfig
local nextGeneration = 0
local nextCall = 0

function ChaseBootlegServer.ChaseReject(code, message)
    error({ code = code, message = message }, 0)
end

function ChaseBootlegServer.ChaseCurrent(identity)
    return server.sessions[identity.source] == identity and server.generations[identity.source] == identity.generation
        and not server.unloading[identity.source] and ChaseBootlegFramework.ChaseIsCurrent(identity)
end

function ChaseBootlegServer.ChaseRequireCurrent(identity)
    if not server.ChaseCurrent(identity) then server.ChaseReject('session_changed', 'Your character session changed. Open Signalworks again.') end
end

function ChaseBootlegServer.ChaseRequireBroadcast(identity)
    if not ChaseBootlegFramework.ChaseCanBroadcast(identity) then
        server.ChaseReject('broadcast_job_required', 'Your job does not authorize starting or changing a broadcasting station.')
    end
end

function ChaseBootlegServer.ChaseCoHosts(station)
    station.cohosts = station.cohosts or {}
    return station.cohosts
end

function ChaseBootlegServer.ChaseNextCallId()
    nextCall = nextCall + 1
    return nextCall
end

function ChaseBootlegServer.ChaseCallState(entry, station, state)
    if GetPlayerName(entry.source) then
        TriggerClientEvent('chase_bootleg:client:callState', entry.source, { state = state, stationId = station.id, stationName = station.name })
    end
end

function ChaseBootlegServer.ChaseDeclineCall(station, state)
    local pending = station.pendingCall
    if not pending then return end
    station.pendingCall = nil
    if station.host and GetPlayerName(station.host) then TriggerClientEvent('chase_bootleg:client:incomingCall', station.host, nil) end
    server.ChaseCallState(pending, station, state or 'declined')
end

function ChaseBootlegServer.ChaseSpeechSources(station)
    station.speech = station.speech or {}
    return station.speech
end

function ChaseBootlegServer.ChaseClearSpeech(station)
    station.talking, station.speechAt, station.speech = false, nil, {}
end

function ChaseBootlegServer.ChaseSpeaking(station)
    local now, latest = GetGameTimer(), nil
    for playerSource, at in pairs(server.ChaseSpeechSources(station)) do
        if domain.ChaseElapsed(now, at) < 2500 then latest = math.max(latest or at, at) else station.speech[playerSource] = nil end
    end
    station.speechAt = latest
    station.talking = latest ~= nil
    return station.talking
end

function ChaseBootlegServer.ChaseEndCall(station)
    local caller = station.caller
    if not caller then return end
    station.caller = nil
    server.ChaseSpeechSources(station)[caller.source] = nil
    ChaseBootlegVoice.ChaseClearRoute(caller.source)
    server.ChaseCallState(caller, station, 'ended')
end

function ChaseBootlegServer.ChaseRemoveCoHost(station, index)
    local cohost = table.remove(server.ChaseCoHosts(station), index)
    if not cohost then return end
    server.ChaseSpeechSources(station)[cohost.source] = nil
    ChaseBootlegVoice.ChaseClearRoute(cohost.source)
end

function ChaseBootlegServer.ChaseStopMicrophone(station)
    server.ChaseClearSpeech(station)
    server.ChaseDeclineCall(station)
    server.ChaseEndCall(station)
    for index = #server.ChaseCoHosts(station), 1, -1 do server.ChaseRemoveCoHost(station, index) end
    if station.host then ChaseBootlegVoice.ChaseClearRoute(station.host) end
    station.host = nil
    station.hostIdentity = nil
    station.hostAlias = nil
    station.routeKey = nil
    server.ChaseSyncSpeech()
end

function ChaseBootlegServer.ChaseReplaceHost(station)
    local promoted = table.remove(server.ChaseCoHosts(station), 1)
    if not promoted then return server.ChaseStopMicrophone(station) end
    server.ChaseDeclineCall(station)
    server.ChaseEndCall(station)
    ChaseBootlegVoice.ChaseClearRoute(station.host)
    server.ChaseClearSpeech(station)
    station.routeKey = nil
    station.host, station.hostIdentity, station.hostAlias = promoted.source, promoted.identity, promoted.identity.name
    server.ChaseSyncSpeech()
end

function ChaseBootlegServer.ChaseLeave(playerSource)
    for _, station in pairs(server.stations) do
        local cohosts = server.ChaseCoHosts(station)
        local changed = false
        for index = #cohosts, 1, -1 do
            if cohosts[index].source == playerSource then server.ChaseRemoveCoHost(station, index) changed = true end
        end
        if station.host == playerSource then server.ChaseReplaceHost(station) changed = true end
        if station.caller and station.caller.source == playerSource then server.ChaseEndCall(station) changed = true end
        if station.pendingCall and station.pendingCall.source == playerSource then server.ChaseDeclineCall(station, 'ended') changed = true end
        if changed then server.ChaseReplicate(station) end
    end
end

function ChaseBootlegServer.ChaseParticipantStation(playerSource)
    for _, station in pairs(server.stations) do
        if station.host == playerSource then return station, 'host', station.hostIdentity end
        for _, cohost in ipairs(server.ChaseCoHosts(station)) do
            if cohost.source == playerSource then return station, 'cohost', cohost.identity end
        end
        if station.caller and station.caller.source == playerSource then return station, 'caller', station.caller.identity end
        if station.pendingCall and station.pendingCall.source == playerSource then return station, 'pending', station.pendingCall.identity end
    end
end

function ChaseBootlegServer.ChaseOnMicrophone(playerSource)
    local _, role = server.ChaseParticipantStation(playerSource)
    return role == 'host' or role == 'cohost'
end

function ChaseBootlegServer.ChaseParticipants(station, excluded)
    local participants = {}
    local function ChaseInclude(playerSource)
        if playerSource and playerSource ~= excluded then participants[#participants + 1] = playerSource end
    end
    ChaseInclude(station.host)
    for _, cohost in ipairs(server.ChaseCoHosts(station)) do ChaseInclude(cohost.source) end
    ChaseInclude(station.caller and station.caller.source)
    return participants
end

function ChaseBootlegServer.ChaseDropSource(playerSource)
    nextGeneration = nextGeneration + 1
    server.generations[playerSource] = nextGeneration
    local hadSession = server.sessions[playerSource] ~= nil or server.tuned[playerSource] ~= nil
    if ChaseBootlegReceivers then ChaseBootlegReceivers.ChaseDropSource(playerSource) end
    if ChaseBootlegShop then ChaseBootlegShop.ChaseDropSource(playerSource) end
    server.ChaseLeave(playerSource)
    server.sessions[playerSource] = nil
    server.tuned[playerSource] = nil
    server.audible[playerSource] = nil
    server.ChaseClearSpeechSource(playerSource)
    server.scans[playerSource] = nil
    if hadSession then
        TriggerClientEvent('chase_bootleg:client:reception', playerSource, nil)
        TriggerClientEvent('chase_bootleg:client:cartridge', playerSource, nil)
    end
end

function ChaseBootlegServer.ChaseUnloadSource(playerSource)
    server.unloading[playerSource] = true
    server.ChaseDropSource(playerSource)
end

function ChaseBootlegServer.ChaseLoadSource(playerSource)
    server.ChaseDropSource(playerSource)
    server.unloading[playerSource] = nil
end

function ChaseBootlegServer.ChaseSession(playerSource)
    if server.unloading[playerSource] then server.ChaseReject('character_unavailable', 'Load your character before opening Signalworks.') end
    local current = ChaseBootlegFramework.ChaseIdentity(playerSource)
    if not current then server.ChaseReject('character_unavailable', 'Load your character before opening Signalworks.') end
    local identity = server.sessions[playerSource]
    if identity and identity.identifier == current.identifier and identity.generation == server.generations[playerSource] then
        identity.player = current.player
        identity.name = current.name
        return identity
    end
    server.ChaseDropSource(playerSource)
    current.generation = server.generations[playerSource]
    current.rate = {}
    current.window = { startedAt = GetGameTimer(), count = 0 }
    server.sessions[playerSource] = current
    return current
end

function ChaseBootlegServer.ChaseRate(identity, action, milliseconds)
    local now = GetGameTimer()
    local previous = identity.rate[action]
    if previous and now >= previous and now - previous < milliseconds then
        server.ChaseReject('rate_limited', 'Please wait a moment before trying again.')
    end
    if now < identity.window.startedAt or now - identity.window.startedAt > 10000 then
        identity.window = { startedAt = now, count = 0 }
    end
    if identity.window.count >= config.Security.maxActionsPerTenSeconds then
        server.ChaseReject('rate_limited', 'Too many requests. Please wait a few seconds.')
    end
    identity.window.count = identity.window.count + 1
    identity.rate[action] = now
end

function ChaseBootlegServer.ChasePosition(identity)
    server.ChaseRequireCurrent(identity)
    if not ChaseBootlegFramework.ChaseIsAlive(identity) then server.ChaseReject('player_unavailable', 'Your character cannot use this equipment right now.') end
    return GetEntityCoords(GetPlayerPed(identity.source)), GetPlayerRoutingBucket(identity.source)
end

function ChaseBootlegServer.ChaseAtDepot(identity)
    local position, bucket = server.ChasePosition(identity)
    if bucket ~= config.Depot.bucket or domain.ChaseDistance(position, config.Depot.position) > config.Depot.radius then
        server.ChaseReject('depot_required', 'Visit the Signalworks studio depot to do that.')
    end
end

function ChaseBootlegServer.ChaseMine(identifier)
    for _, station in pairs(server.stations) do
        if domain.ChaseCanManage(station, identifier) then return station end
    end
end

function ChaseBootlegServer.ChaseRequireStation(identity, ownerOnly)
    local station = server.ChaseMine(identity.identifier)
    if not station then server.ChaseReject('station_required', 'You do not belong to a station.') end
    if ownerOnly and station.owner ~= identity.identifier then server.ChaseReject('owner_required', 'Only the station owner can do that.') end
    return station
end

function ChaseBootlegServer.ChaseVehicle(station)
    if not station.vehicle or not DoesEntityExist(station.vehicle) then return nil end
    if NetworkGetNetworkIdFromEntity(station.vehicle) ~= station.vehicleNetId then return nil end
    return station.vehicle
end

function ChaseBootlegServer.ChaseNearVan(identity, station, stationary)
    local vehicle = server.ChaseVehicle(station)
    if not vehicle then server.ChaseReject('van_required', 'Collect your studio van from the depot first.') end
    local position, bucket = server.ChasePosition(identity)
    if bucket ~= station.bucket or GetEntityRoutingBucket(vehicle) ~= station.bucket
        or domain.ChaseDistance(position, GetEntityCoords(vehicle)) > config.Vehicle.operatorRange then
        server.ChaseReject('van_too_far', 'Stand beside your studio van to do that.')
    end
    if stationary and GetEntitySpeed(vehicle) > config.Vehicle.maxStationarySpeed then
        server.ChaseReject('van_moving', 'Park the van before operating the studio.')
    end
    return vehicle
end

function ChaseBootlegServer.ChaseStationary(station)
    local vehicle = server.ChaseVehicle(station)
    return vehicle ~= nil and GetEntityRoutingBucket(vehicle) == station.bucket
        and GetEntitySpeed(vehicle) <= config.Vehicle.maxStationarySpeed
        and (not station.anchor or domain.ChaseDistance(station.anchor, GetEntityCoords(vehicle)) <= config.Vehicle.movementTolerance)
end

function ChaseBootlegServer.ChaseSafetyReason(station)
    local vehicle = server.ChaseVehicle(station)
    if not vehicle then return 'The studio van is no longer available. Collect it again from the depot.' end
    if GetEntityRoutingBucket(vehicle) ~= station.bucket then return 'The studio closed because the van changed routing area.' end
    if GetEntitySpeed(vehicle) > config.Vehicle.maxStationarySpeed then return 'The studio closed because the van moved. Park before deploying again.' end
    if station.anchor and domain.ChaseDistance(station.anchor, GetEntityCoords(vehicle)) > config.Vehicle.movementTolerance then
        return 'The studio closed because the van shifted from its deployed position. Park and deploy again.'
    end
end

function ChaseBootlegServer.ChaseSafetyNotice(station, message)
    local identity = station.transitionIdentity or station.hostIdentity or station.operatorIdentity or station.lastOperatorIdentity
    if identity and server.ChaseCurrent(identity) then server.ChaseNotify(identity.source, message, 'warning') end
end

function ChaseBootlegServer.ChaseReplicate(station)
    local vehicle = server.ChaseVehicle(station)
    if not vehicle then return end
    Entity(vehicle).state:set('chase_bootleg:rig', {
        id = station.id, stage = station.stage, changedAt = station.changedAt or os.time(),
        duration = station.duration or 0, battery = math.floor(station.battery), micLive = station.host ~= nil,
        live = station.live, name = station.name, frequency = station.frequency,
        power = station.power, showTitle = station.showTitle
    }, true)
end

function ChaseBootlegServer.ChaseStage(station, stage, duration)
    station.stage = stage
    station.changedAt = os.time()
    station.duration = duration or 0
    station.transitionStartedAt = duration and GetGameTimer() or nil
    server.ChaseReplicate(station)
end

function ChaseBootlegServer.ChaseRefresh()
    for playerSource, identity in pairs(server.sessions) do
        if server.ChaseCurrent(identity) then TriggerClientEvent('chase_bootleg:client:refresh', playerSource) end
    end
end

function ChaseBootlegServer.ChaseNotify(playerSource, message, tone)
    TriggerClientEvent('chase_bootleg:client:notify', playerSource, { message = message, tone = tone or 'info' })
end

function ChaseBootlegServer.ChaseStopStation(station, nextStage)
    server.ChaseStopMicrophone(station)
    station.live = false
    station.cartridge = nil
    station.autoplay = false
    station.transitionIdentity = nil
    station.operatorIdentity = nil
    local vehicle = server.ChaseVehicle(station)
    if vehicle and (nextStage == 'parked' or nextStage == 'stored') then
        FreezeEntityPosition(vehicle, false)
        station.anchor = nil
    end
    server.ChaseStage(station, nextStage)
end

function ChaseBootlegServer.ChaseRemoveVan(station)
    local vehicle = server.ChaseVehicle(station)
    server.ChaseStopStation(station, 'stored')
    if vehicle then
        Entity(vehicle).state:set('chase_bootleg:rig', nil, true)
        DeleteEntity(vehicle)
    end
    station.vehicle = nil
    station.vehicleNetId = nil
    station.bucket = nil
    station.anchor = nil
end

function ChaseBootlegServer.ChaseHasOccupants(vehicle)
    for seat = -1, 31 do
        if GetPedInVehicleSeat(vehicle, seat) ~= 0 then return true end
    end
    return false
end

function ChaseBootlegServer.ChaseParticipantAvailable(station, entry, role)
    local identity = entry and entry.identity
    if not identity or identity.source ~= entry.source or not station.live or station.battery <= 0
        or not server.ChaseCurrent(identity) or not ChaseBootlegFramework.ChaseIsAlive(identity)
        or not ChaseBootlegVoice.ChaseIsReady() or not ChaseBootlegVoice.ChaseIsHostAvailable(entry.source)
        or not server.ChaseStationary(station) then return false end
    if role == 'caller' then
        local reception = server.audible[entry.source]
        return reception ~= nil and reception.stationId == station.id
            and os.time() - entry.acceptedAt <= (config.Calls and config.Calls.maxOnAirSeconds or 600)
    end
    return ChaseBootlegFramework.ChaseCanBroadcast(identity) and domain.ChaseCanManage(station, identity.identifier)
        and pcall(server.ChaseNearVan, identity, station, true) == true
end

function ChaseBootlegServer.ChaseHostAvailable(station)
    local identity = station.hostIdentity
    if not station.host or not server.ChaseParticipantAvailable(station, { source = station.host, identity = identity }, 'host') then return false end
    if station.operatorIdentity and not ChaseBootlegFramework.ChaseCanBroadcast(station.operatorIdentity) then return false end
    station.hostAlias = identity.name
    return true
end

function ChaseBootlegServer.ChaseValidateParticipants(station)
    local cohosts = server.ChaseCoHosts(station)
    local changed = false
    for index = #cohosts, 1, -1 do
        if not server.ChaseParticipantAvailable(station, cohosts[index], 'cohost') then server.ChaseRemoveCoHost(station, index) changed = true end
    end
    while station.host and not server.ChaseHostAvailable(station) do server.ChaseReplaceHost(station) changed = true end
    if station.caller and not server.ChaseParticipantAvailable(station, station.caller, 'caller') then server.ChaseEndCall(station) changed = true end
    if station.pendingCall and (not station.host or os.time() - station.pendingCall.createdAt > (config.Calls and config.Calls.ringSeconds or 30)) then
        server.ChaseDeclineCall(station)
        changed = true
    end
    if changed then server.ChaseReplicate(station) end
end

function ChaseBootlegServer.ChaseMusicEnabled()
    return config.Music ~= nil and config.Music.enabled ~= false
end

function ChaseBootlegServer.ChasePlayable(track)
    return track ~= nil and server.ChaseMusicEnabled() and type(config.Music.providers) == 'table'
        and config.Music.providers[track.provider] == true
end

function ChaseBootlegServer.ChaseNextTrack(station, currentId)
    local queue, cursor = station.queue or {}, station.trackCursor
    local wanted = currentId or cursor and cursor.trackId
    local index = cursor and math.min(cursor.index - 1, #queue) or 0
    for position, track in ipairs(queue) do
        if track.id == wanted then index = position break end
    end
    for step = 1, #queue do
        local track = station.mode == 'autonomous' and queue[(index + step - 1) % #queue + 1] or queue[index + step]
        if not track then return nil end
        if server.ChasePlayable(track) then return track end
    end
end

function ChaseBootlegServer.ChaseStartTrack(station, track, monitorIdentity)
    if not server.ChasePlayable(track) then station.cartridge = nil return false end
    station.cartridge = { id = 'track:' .. track.id, trackId = track.id, provider = track.provider, url = track.url, title = track.title,
        duration = track.duration, startedAt = os.time(), monitorIdentity = monitorIdentity }
    for index, queued in ipairs(station.queue or {}) do
        if queued.id == track.id then station.trackCursor = { trackId = track.id, index = index } break end
    end
    return true
end

function ChaseBootlegServer.ChaseHostMetadata(station)
    return { stationId = station.id, hostSource = station.host, hostName = station.host and station.hostAlias or '',
        stationName = station.name, frequency = station.frequency }
end

local function ChaseSpeechAvailable(station)
    return server.ChaseHostAvailable(station) and Player(station.host).state.radioActive ~= true
end

function ChaseBootlegServer.ChaseClearSpeechSource(playerSource)
    local previous = server.speechRoutes[playerSource]
    if previous then
        local payload = { stationId = previous.stationId, hostSource = previous.hostSource, hostName = previous.hostName,
            stationName = previous.stationName, frequency = previous.frequency, talking = false }
        TriggerClientEvent('chase_bootleg:client:hostSpeech', playerSource, payload)
        server.speechRoutes[playerSource] = nil
    end
end

function ChaseBootlegServer.ChaseSyncSpeech()
    local desired, metadata = {}, {}
    if not config.Speech or config.Speech.enabled ~= false then
        for _, station in pairs(server.stations) do
            if ChaseSpeechAvailable(station) then
                local payload = server.ChaseHostMetadata(station)
                payload.talking = server.ChaseSpeaking(station)
                metadata[station.id] = payload
                desired[station.host] = payload
            end
        end
        for playerSource, reception in pairs(server.audible) do
            local station = server.stations[reception.stationId]
            local identity = server.sessions[playerSource]
            if metadata[reception.stationId] and identity and server.ChaseCurrent(identity)
                and ChaseBootlegFramework.ChaseIsAlive(identity) and GetPlayerRoutingBucket(playerSource) == station.bucket then
                desired[playerSource] = metadata[reception.stationId]
            end
        end
    end
    for playerSource, previous in pairs(server.speechRoutes) do
        local nextState = desired[playerSource]
        if not nextState or nextState.stationId ~= previous.stationId or nextState.hostSource ~= previous.hostSource then
            server.ChaseClearSpeechSource(playerSource)
        end
    end
    for playerSource, payload in pairs(desired) do
        local previous = server.speechRoutes[playerSource]
        if not previous or previous.stationId ~= payload.stationId or previous.hostSource ~= payload.hostSource
            or previous.hostName ~= payload.hostName or previous.stationName ~= payload.stationName
            or previous.frequency ~= payload.frequency or previous.talking ~= payload.talking then
            TriggerClientEvent('chase_bootleg:client:hostSpeech', playerSource, payload)
            server.speechRoutes[playerSource] = payload
        end
    end
end

function ChaseBootlegServer.ChaseSpeech(playerSource, active)
    if not server.ready or type(active) ~= 'boolean' or config.Speech and config.Speech.enabled == false then return false end
    local identity = server.sessions[playerSource]
    if not identity or not server.ChaseCurrent(identity) then return false end
    local station, role, participant = server.ChaseParticipantStation(playerSource)
    if not station or role == 'pending' or participant ~= identity then return false end
    local now = GetGameTimer()
    if identity.speechEventAt and domain.ChaseElapsed(now, identity.speechEventAt) < 50
        and not (active == false and station.talking == true) then return false end
    identity.speechEventAt = now
    if not ChaseSpeechAvailable(station) then
        server.ChaseClearSpeech(station)
        server.ChaseSyncSpeech()
        return false
    end
    local previous = station.talking == true
    server.ChaseSpeechSources(station)[playerSource] = active and Player(playerSource).state.radioActive ~= true and now or nil
    if server.ChaseSpeaking(station) ~= previous then server.ChaseSyncSpeech() end
    return true
end

function ChaseBootlegServer.ChaseSpeechTick()
    local changed = false
    for _, station in pairs(server.stations) do
        if station.talking and (not server.ChaseSpeaking(station) or not ChaseSpeechAvailable(station)
            or config.Speech and config.Speech.enabled == false) then
            server.ChaseClearSpeech(station)
            changed = true
        end
    end
    if changed then server.ChaseSyncSpeech() end
end

function ChaseBootlegServer.ChaseStationView(station, identifier)
    local view = domain.ChaseStationView(station, identifier)
    local available = server.ChaseHostAvailable(station)
    view.micLive = available
    view.hostName = available and station.hostIdentity.name or ''
    view.talking = (not config.Speech or config.Speech.enabled ~= false) and available
        and Player(station.host).state.radioActive ~= true and server.ChaseSpeaking(station)
    return view
end

function ChaseBootlegServer.ChaseSendCartridge(playerSource, station, monitor)
    local cartridge = station and station.cartridge
    local reception = server.audible[playerSource]
    if cartridge and os.time() < cartridge.startedAt + cartridge.duration then
        TriggerClientEvent('chase_bootleg:client:cartridge', playerSource, {
            url = cartridge.url, provider = cartridge.provider or 'file', title = cartridge.title or '',
            startedAt = cartridge.startedAt, duration = cartridge.duration, stationId = station.id,
            quality = monitor and 1.0 or reception and reception.quality or 1.0,
            gain = monitor and 1.0 or reception and reception.gain or 1.0,
            device = monitor and 'studio' or reception and reception.device, monitor = monitor == true,
            emitterSource = not monitor and reception and reception.emitterSource or nil,
            emitterNetId = not monitor and reception and reception.emitterNetId or nil,
            vehicleNetId = not monitor and reception and reception.vehicleNetId or nil,
            emitterPosition = not monitor and reception and reception.emitterPosition or nil
        })
    else
        TriggerClientEvent('chase_bootleg:client:cartridge', playerSource, nil)
    end
end

function ChaseBootlegServer.ChaseSyncCartridges()
    local monitors = {}
    for _, station in pairs(server.stations) do
        local identity = station.cartridge and station.cartridge.monitorIdentity
        if identity and station.live and os.time() < station.cartridge.startedAt + station.cartridge.duration
            and server.ChaseCurrent(identity) and ChaseBootlegFramework.ChaseCanBroadcast(identity)
            and domain.ChaseCanManage(station, identity.identifier) and server.ChaseStationary(station)
            and pcall(server.ChaseNearVan, identity, station, true) then monitors[identity.source] = station end
    end
    for playerSource, identity in pairs(server.sessions) do
        local reception = server.audible[playerSource]
        local station = monitors[playerSource] or reception and server.stations[reception.stationId]
        local cartridge = station and station.cartridge
        local signature = cartridge and os.time() < cartridge.startedAt + cartridge.duration and ('%s:%s:%s:%s:%s:%s:%s'):format(
            station.id, cartridge.provider or 'file', cartridge.url, cartridge.title or '', cartridge.startedAt, cartridge.duration,
            monitors[playerSource] and 'monitor' or 'receiver') or ''
        if identity.cartridgeSignature ~= signature then
            server.ChaseSendCartridge(playerSource, station, monitors[playerSource] ~= nil)
            identity.cartridgeSignature = signature
        end
    end
end

local function ChaseTargets(audience, participants, excluded)
    local targets, seen = {}, { [excluded] = true }
    for _, group in ipairs({ audience, participants }) do
        for _, playerSource in ipairs(group) do
            if not seen[playerSource] then
                seen[playerSource] = true
                targets[#targets + 1] = playerSource
            end
        end
    end
    table.sort(targets)
    return targets
end

function ChaseBootlegServer.ChaseRoutes()
    local audiences, studios = {}, {}
    for _, station in pairs(server.stations) do
        audiences[station.id] = {}
        station.listenerCount = 0
        if station.live and (not server.ChaseStationary(station) or station.battery <= 0) then
            server.ChaseSafetyNotice(station, server.ChaseSafetyReason(station) or 'The studio battery is empty. Pack and recharge at the depot.')
            server.ChaseStopStation(station, server.ChaseVehicle(station) and 'parked' or 'stored')
        end
        if station.live and station.operatorIdentity and not ChaseBootlegFramework.ChaseCanBroadcast(station.operatorIdentity) then
            server.ChaseStopStation(station, server.ChaseVehicle(station) and 'ready' or 'stored')
        end
        server.ChaseValidateParticipants(station)
        if station.host then studios[station.host] = station end
        for _, cohost in ipairs(server.ChaseCoHosts(station)) do studios[cohost.source] = station end
    end
    local desired = {}
    if ChaseBootlegReceivers and ChaseBootlegReceivers.ChaseEnabled() then
        desired = ChaseBootlegReceivers.ChaseAudience()
    else
        for playerSource, stationId in pairs(server.tuned) do
            local identity = server.sessions[playerSource]
            local station = server.stations[stationId]
            local vehicle = station and server.ChaseVehicle(station)
            local available = identity and server.ChaseCurrent(identity) and ChaseBootlegFramework.ChaseIsAlive(identity)
            local receives, quality = false, 0
            if available and vehicle and not studios[playerSource] then
                receives, quality = domain.ChaseCanReceive(station, GetEntityCoords(GetPlayerPed(playerSource)),
                    GetPlayerRoutingBucket(playerSource), GetEntityCoords(vehicle))
            end
            if receives then desired[playerSource] = { station = station, quality = quality, gain = 1.0, device = 'direct' }
            else server.tuned[playerSource] = nil end
        end
    end
    local previous = server.audible
    server.audible = {}
    for playerSource, identity in pairs(server.sessions) do
        local candidate = not studios[playerSource] and desired[playerSource] or nil
        local reception, signature
        if candidate then
            local station = candidate.station
            reception = { stationId = station.id, hostSource = station.host, hostSources = server.ChaseParticipants(station, playerSource),
                hostName = station.host and station.hostAlias or '', stationName = station.name, frequency = station.frequency,
                quality = candidate.quality, gain = candidate.gain, device = candidate.device,
                emitterSource = candidate.emitterSource, emitterNetId = candidate.emitterNetId, vehicleNetId = candidate.vehicleNetId,
                emitterPosition = candidate.emitterPosition }
            server.audible[playerSource] = reception
            audiences[station.id][#audiences[station.id] + 1] = playerSource
            station.listenerCount = station.listenerCount + 1
            signature = ('%s:%s:%s:%s:%s:%s:%s:%s:%s:%s:%s:%s'):format(station.id, station.host or 0, table.concat(reception.hostSources, ','),
                domain.ChaseRound(candidate.quality, 0.05), domain.ChaseRound(candidate.gain, 0.05), candidate.device or '',
                candidate.emitterSource or 0, candidate.emitterNetId or 0, candidate.vehicleNetId or 0, reception.hostName, station.name, station.frequency)
            if candidate.emitterPosition then
                signature = signature .. (':%.1f:%.1f:%.1f'):format(candidate.emitterPosition.x, candidate.emitterPosition.y, candidate.emitterPosition.z)
            end
        elseif studios[playerSource] then
            local station = studios[playerSource]
            reception = { stationId = station.id, hostSource = station.host, hostSources = server.ChaseParticipants(station, playerSource),
                hostName = station.hostAlias or '', stationName = station.name, frequency = station.frequency,
                quality = 1.0, gain = 1.0, device = 'studio', participant = true }
            signature = ('studio:%s:%s:%s:%s:%s:%s'):format(station.id, station.host or 0, table.concat(reception.hostSources, ','),
                reception.hostName, station.name, station.frequency)
        end
        if reception then
            if identity.reception ~= signature then
                TriggerClientEvent('chase_bootleg:client:reception', playerSource, reception)
                identity.reception = signature
            end
        elseif identity.reception or previous[playerSource] then
            identity.reception = nil
            TriggerClientEvent('chase_bootleg:client:reception', playerSource, nil)
            TriggerClientEvent('chase_bootleg:client:refresh', playerSource)
        end
    end
    for _, station in pairs(server.stations) do
        if station.host then
            local participants = server.ChaseParticipants(station)
            for _, participant in ipairs(participants) do
                local metadata = server.ChaseHostMetadata(station)
                metadata.role = participant == station.host and 'host'
                    or station.caller and station.caller.source == participant and 'caller' or 'cohost'
                ChaseBootlegVoice.ChaseSetRoute(participant, ChaseTargets(audiences[station.id], participants, participant), metadata)
            end
        end
    end
    server.ChaseSyncCartridges()
    server.ChaseSyncSpeech()
end

function ChaseBootlegServer.ChaseSnapshot(identity)
    server.ChaseRequireCurrent(identity)
    local mine = server.ChaseMine(identity.identifier)
    local requests = mine and ChaseBootlegDatabase.ChaseRequests(mine.id) or {}
    server.ChaseRequireCurrent(identity)
    if mine and not domain.ChaseCanManage(mine, identity.identifier) then mine, requests = nil, {} end
    local stations, cartridges, crew = {}, {}, {}
    local tunedStationId = server.audible[identity.source] and server.audible[identity.source].stationId or server.tuned[identity.source]
    local viewerBucket = GetPlayerRoutingBucket(identity.source)
    for _, station in pairs(server.stations) do
        local entitledTune = station.bucket == viewerBucket and tunedStationId or nil
        if domain.ChaseVisible(station, identity.identifier, entitledTune) then
            stations[#stations + 1] = server.ChaseStationView(station, identity.identifier)
        end
    end
    table.sort(stations, function(first, second) return first.frequency < second.frequency end)
    for _, cartridge in ipairs(config.Cartridges) do
        cartridges[#cartridges + 1] = { id = cartridge.id, name = cartridge.name, description = cartridge.description, duration = cartridge.duration }
    end
    if mine then
        for identifier, member in pairs(mine.crew) do
            local playerSource = 0
            for sourceId, session in pairs(server.sessions) do
                if session.identifier == identifier and server.ChaseCurrent(session) then playerSource = sourceId break end
            end
            crew[#crew + 1] = { memberId = member.id, source = playerSource, name = member.name }
        end
        table.sort(crew, function(first, second) return first.memberId < second.memberId end)
    end
    local voiceReady = ChaseBootlegVoice.ChaseIsReady()
    local canOperate = ChaseBootlegFramework.ChaseCanBroadcast(identity)
    local music, calls, talk = config.Music or {}, config.Calls or {}, config.Talk or {}
    local studio, role = server.ChaseParticipantStation(identity.source)
    local call = { state = 'idle' }
    if role == 'caller' or role == 'pending' then
        call = { state = role == 'caller' and 'onair' or 'ringing', stationId = studio.id, stationName = studio.name }
    end
    local mineView = mine and server.ChaseStationView(mine, identity.identifier) or nil
    if mineView then
        mineView.queue = {}
        for _, track in ipairs(mine.queue or {}) do
            mineView.queue[#mineView.queue + 1] = { id = track.id, provider = track.provider, url = track.url, title = track.title, duration = track.duration }
        end
        mineView.autoplay = mine.autoplay == true
        mineView.pendingCall = mine.pendingCall and { callId = mine.pendingCall.callId, callerName = mine.pendingCall.name,
            expiresAt = mine.pendingCall.createdAt + (calls.ringSeconds or 30) } or nil
        mineView.caller = mine.caller and { name = mine.caller.identity.name } or nil
    end
    return {
        viewer = { name = identity.name, isPolice = config.Scanner.enabled and ChaseBootlegFramework.ChaseIsPolice(identity) or false,
            canCreate = mine == nil and canOperate, canOperate = canOperate, voiceReady = voiceReady,
            isHost = mine ~= nil and mine.host == identity.source, isCoHost = mine ~= nil and role == 'cohost', call = call },
        stations = stations, mine = mineView,
        tunedStationId = tunedStationId, requests = requests, cartridges = cartridges, crew = crew, voiceReady = voiceReady,
        devices = ChaseBootlegReceivers and ChaseBootlegReceivers.ChaseSnapshot(identity) or nil,
        config = { stationPrice = config.StationPrice, maxTip = config.MaxTip,
            frequencyMin = config.Frequency.min, frequencyMax = config.Frequency.max, currency = config.Currency,
            powerModes = config.PowerModes, requestMaxLength = config.Requests.maxLength, broadcastJob = config.BroadcastJob,
            speech = { enabled = not config.Speech or config.Speech.enabled ~= false, hud = not config.Speech or config.Speech.hud ~= false },
            music = { enabled = config.Music ~= nil and music.enabled ~= false,
                providers = { youtube = music.providers ~= nil and music.providers.youtube == true, soundcloud = music.providers ~= nil and music.providers.soundcloud == true },
                maxQueue = music.maxQueue or 0, maxDurationSeconds = music.maxDurationSeconds or 0, minDurationSeconds = music.minDurationSeconds or 0 },
            calls = { enabled = calls.enabled == true, ringSeconds = calls.ringSeconds or 30, acceptKey = calls.acceptKey or 'Y', declineKey = calls.declineKey or 'U' },
            talk = { command = type(talk.command) == 'string' and talk.command or 'senoratalk', key = type(talk.key) == 'string' and talk.key or 'CAPITAL' } }
    }
end
