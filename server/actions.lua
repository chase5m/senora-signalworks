ChaseBootlegActions = {}

local server = ChaseBootlegServer
local domain = ChaseBootlegDomain
local config = ChaseBootlegConfig
local actions = ChaseBootlegActions

local function ChaseFieldText(value, minimum, maximum, label)
    local text = domain.ChaseText(value, minimum, maximum)
    if not text then server.ChaseReject('invalid_text', ('%s must contain %s-%s characters without control characters or markup.'):format(label, minimum, maximum)) end
    return text
end

local function ChaseFrequency(value, stationId)
    if not domain.ChaseInteger(value, config.Frequency.min, config.Frequency.max) then
        server.ChaseReject('invalid_frequency', 'Choose a valid FM frequency.')
    end
    for _, station in pairs(server.stations) do
        if station.frequency == value and station.id ~= stationId then server.ChaseReject('frequency_taken', 'That frequency is already reserved.') end
    end
    return value
end

local function ChaseSelectedStation(identity, data)
    if not domain.ChaseInteger(data.stationId, 1, 2147483647) then server.ChaseReject('invalid_station', 'Choose a station first.') end
    local station = server.stations[data.stationId]
    if not station or not domain.ChaseVisible(station, identity.identifier, server.tuned[identity.source]) then
        server.ChaseReject('station_unavailable', 'That station is not available.')
    end
    return station
end

local function ChasePaymentResult(success, code, message)
    if not success then server.ChaseReject(code, message) end
end

local function ChaseRequireLiveConsole(identity)
    local station = server.ChaseRequireStation(identity)
    server.ChaseNearVan(identity, station, true)
    if not station.live then server.ChaseReject('broadcast_required', 'Start the transmitter first.') end
    return station
end

local function ChaseRequireVoice(identity)
    if not ChaseBootlegVoice.ChaseIsReady() or not ChaseBootlegVoice.ChaseIsHostAvailable(identity.source) then
        server.ChaseReject('voice_unavailable', 'The live voice bridge is unavailable or your voice is busy with a call or radio.')
    end
end

local function ChaseCoHostIndex(station, playerSource)
    for index, cohost in ipairs(server.ChaseCoHosts(station)) do
        if cohost.source == playerSource then return index end
    end
end

local function ChaseRequireMusic()
    local music = config.Music
    if not music or music.enabled == false then server.ChaseReject('music_unavailable', 'The music queue is disabled on this server.') end
    return music
end

local function ChaseTrack(station, trackId)
    if not domain.ChaseInteger(trackId, 1, 9007199254740991) then server.ChaseReject('invalid_track', 'Choose a queued track.') end
    for index, track in ipairs(station.queue or {}) do
        if track.id == trackId then return track, index end
    end
    server.ChaseReject('track_unavailable', 'That track is no longer in the queue.')
end

local function ChaseHostedStation(identity)
    local station = server.ChaseRequireStation(identity)
    if station.host ~= identity.source or station.hostIdentity ~= identity then server.ChaseReject('host_required', 'Only the primary host can answer calls.') end
    return station
end

function ChaseBootlegActions.ChaseCreateStation(identity, data)
    server.ChaseRequireBroadcast(identity)
    server.ChaseAtDepot(identity)
    if server.ChaseMine(identity.identifier) then server.ChaseReject('already_member', 'You already own or belong to a station.') end
    local count = 0
    for _ in pairs(server.stations) do count = count + 1 end
    if count >= config.MaxStations then server.ChaseReject('station_limit', 'All station permits are currently allocated.') end
    local name = ChaseFieldText(data.name, 3, 48, 'Station name')
    local tagline = ChaseFieldText(data.tagline or '', 0, 100, 'Tagline')
    local frequency = ChaseFrequency(data.frequency)
    local mode = config.Music and config.Music.defaultMode == 'autonomous' and 'autonomous' or 'dj'
    ChasePaymentResult(ChaseBootlegMoney.ChaseDebit(identity, nil, config.StationPrice, 'purchase', {
        {
            query = 'INSERT INTO chase_bootleg_stations (owner, name, tagline, frequency, power, mode) VALUES (?, ?, ?, ?, ?, ?)',
            values = { identity.identifier, name, tagline, frequency, config.PowerModes[1].id, mode }
        }
    }, ChaseBootlegFramework.ChaseCanBroadcast))
    local row = ChaseBootlegDatabase.ChaseLoadStation(identity.identifier)
    if not row then server.ChaseReject('station_loading', 'Your purchase was recorded, but the station could not be loaded. Contact an administrator.') end
    local station = {
        id = tonumber(row.id), owner = identity.identifier, name = row.name, tagline = row.tagline,
        frequency = tonumber(row.frequency), power = row.power, isPublic = true, showTitle = '',
        battery = tonumber(row.battery), balance = tonumber(row.balance), stage = 'stored', live = false,
        crew = {}, listenerCount = 0, mode = row.mode == 'autonomous' and 'autonomous' or 'dj', queue = {}, autoplay = false, cohosts = {}
    }
    server.stations[station.id] = station
end

function ChaseBootlegActions.ChaseUpdateStation(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    if station.live or station.stage == 'deploying' or station.stage == 'packing' then
        server.ChaseReject('stop_required', 'Stop the transmitter and finish deployment before changing station settings.')
    end
    if station.vehicle then server.ChaseNearVan(identity, station, true) end
    if type(data.isPublic) ~= 'boolean' or not domain.ChasePower(data.power) then server.ChaseReject('invalid_settings', 'Choose a valid power mode and privacy setting.') end
    local fields = {
        name = ChaseFieldText(data.name, 3, 48, 'Station name'),
        tagline = ChaseFieldText(data.tagline or '', 0, 100, 'Tagline'),
        frequency = ChaseFrequency(data.frequency, station.id), power = data.power, isPublic = data.isPublic,
        showTitle = ChaseFieldText(data.showTitle or '', 0, 64, 'Show title')
    }
    if data.mode ~= nil then
        if data.mode ~= 'dj' and data.mode ~= 'autonomous' then server.ChaseReject('invalid_mode', 'Choose the DJ-managed or autonomous mode.') end
        if data.mode == 'autonomous' then ChaseRequireMusic() end
        fields.mode = data.mode
    end
    ChaseBootlegDatabase.ChaseUpdateStation(station, fields)
    server.ChaseRequireBroadcast(identity)
    for key, value in pairs(fields) do station[key] = value end
    server.ChaseReplicate(station)
end

function ChaseBootlegActions.ChaseSpawnVan(identity)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    server.ChaseAtDepot(identity)
    if station.vehicle or station.stage ~= 'stored' then server.ChaseReject('van_exists', 'Your station already has a van outside.') end
    for _, vehicle in ipairs(GetAllVehicles()) do
        if GetEntityRoutingBucket(vehicle) == config.Depot.bucket
            and domain.ChaseDistance(GetEntityCoords(vehicle), config.Depot.spawn) < config.Depot.spawnClearance then
            server.ChaseReject('spawn_blocked', 'The depot parking bay is occupied.')
        end
    end
    local spawn = config.Depot.spawn
    local vehicle = CreateVehicleServerSetter(joaat(config.Vehicle.model), 'automobile', spawn.x + 0.0, spawn.y + 0.0, spawn.z + 0.0, spawn.w + 0.0)
    if not vehicle or vehicle == 0 then server.ChaseReject('spawn_failed', 'The studio van could not be created.') end
    station.vehicle = vehicle
    local startedAt = GetGameTimer()
    while not DoesEntityExist(vehicle) and domain.ChaseElapsed(GetGameTimer(), startedAt) < config.Vehicle.spawnTimeoutSeconds * 1000 do Wait(50) end
    if not DoesEntityExist(vehicle) or not server.ChaseCurrent(identity) or not ChaseBootlegFramework.ChaseCanBroadcast(identity) then
        if DoesEntityExist(vehicle) then DeleteEntity(vehicle) end
        station.vehicle = nil
        server.ChaseReject('spawn_cancelled', 'Van collection was cancelled. Try again from the depot.')
    end
    local nearDepot = pcall(server.ChaseAtDepot, identity)
    if not nearDepot then
        DeleteEntity(vehicle)
        station.vehicle = nil
        server.ChaseReject('depot_required', 'Stay at the depot while your van is prepared.')
    end
    SetEntityRoutingBucket(vehicle, config.Depot.bucket)
    SetEntityOrphanMode(vehicle, 2)
    station.vehicleNetId = NetworkGetNetworkIdFromEntity(vehicle)
    station.bucket = config.Depot.bucket
    station.lastAttendedAt = os.time()
    local plate = ('CHB%05d'):format(station.id % 100000)
    SetVehicleNumberPlateText(vehicle, plate)
    server.ChaseStage(station, 'parked')
    ChaseBootlegServerKeys.ChasePrepareVan(identity, vehicle)
    TriggerClientEvent('chase_bootleg:client:vanReady', identity.source, { netId = station.vehicleNetId, plate = plate })
end

function ChaseBootlegActions.ChaseStoreVan(identity)
    local station = server.ChaseRequireStation(identity)
    server.ChaseAtDepot(identity)
    local vehicle = server.ChaseNearVan(identity, station, true)
    if station.stage ~= 'parked' then server.ChaseReject('pack_required', 'Pack the studio before storing the van.') end
    if domain.ChaseDistance(GetEntityCoords(vehicle), config.Depot.position) > config.Depot.radius + config.Vehicle.operatorRange then
        server.ChaseReject('depot_required', 'Bring the van into the depot.')
    end
    if server.ChaseHasOccupants(vehicle) then server.ChaseReject('van_occupied', 'Everyone must leave the van before storage.') end
    ChaseBootlegDatabase.ChaseSaveBattery(station)
    server.ChaseRequireCurrent(identity)
    server.ChaseAtDepot(identity)
    server.ChaseNearVan(identity, station, true)
    if server.ChaseHasOccupants(vehicle) then server.ChaseReject('van_occupied', 'Everyone must leave the van before storage.') end
    server.ChaseRemoveVan(station)
end

function ChaseBootlegActions.ChaseDeploy(identity)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    local vehicle = server.ChaseNearVan(identity, station, true)
    if station.stage ~= 'parked' then server.ChaseReject('already_deployed', 'The studio must be packed before deployment.') end
    if station.battery < config.Battery.minimumToBroadcast then server.ChaseReject('battery_low', 'Recharge the studio battery at the depot.') end
    if GetVehiclePedIsIn(GetPlayerPed(identity.source), false) ~= 0 then server.ChaseReject('exit_vehicle', 'Step out of the van to deploy the studio.') end
    station.anchor = GetEntityCoords(vehicle)
    station.transitionIdentity = identity
    station.lastOperatorIdentity = identity
    FreezeEntityPosition(vehicle, true)
    server.ChaseStage(station, 'deploying', config.Vehicle.deploySeconds)
end

function ChaseBootlegActions.ChasePack(identity)
    local station = server.ChaseRequireStation(identity)
    server.ChaseNearVan(identity, station, true)
    if station.stage ~= 'ready' and station.stage ~= 'live' and station.stage ~= 'deploying' then
        server.ChaseReject('pack_unavailable', 'There is no deployed studio to pack.')
    end
    server.ChaseStopStation(station, 'ready')
    station.transitionIdentity = identity
    server.ChaseStage(station, 'packing', config.Vehicle.packSeconds)
end

function ChaseBootlegActions.ChaseBroadcast(identity, data)
    if type(data.enabled) ~= 'boolean' then server.ChaseReject('invalid_state', 'Choose whether the transmitter should be on or off.') end
    local station = server.ChaseRequireStation(identity)
    server.ChaseNearVan(identity, station, data.enabled)
    if not data.enabled then
        if station.live then server.ChaseStopStation(station, 'ready') end
        return
    end
    server.ChaseRequireBroadcast(identity)
    if station.live then return end
    if station.stage ~= 'ready' or not server.ChaseStationary(station) then server.ChaseReject('deploy_required', 'Deploy the parked studio before broadcasting.') end
    if station.battery < config.Battery.minimumToBroadcast then server.ChaseReject('battery_low', 'Recharge the studio battery at the depot.') end
    station.live = true
    station.operatorIdentity = identity
    station.broadcastEpoch = (station.broadcastEpoch or 0) + 1
    station.scanOffsetX = math.random() * 2 - 1
    station.scanOffsetY = math.random() * 2 - 1
    server.ChaseStage(station, 'live')
    if station.mode == 'autonomous' and not station.cartridge and server.ChaseStartTrack(station, server.ChaseNextTrack(station), identity) then
        station.autoplay = true
    end
end

function ChaseBootlegActions.ChaseMicrophone(identity, data)
    if type(data.enabled) ~= 'boolean' then server.ChaseReject('invalid_state', 'Choose whether the microphone should be live.') end
    local station = server.ChaseRequireStation(identity)
    local cohostIndex = ChaseCoHostIndex(station, identity.source)
    if not data.enabled then
        if station.host == identity.source then server.ChaseReplaceHost(station)
        elseif cohostIndex then server.ChaseRemoveCoHost(station, cohostIndex)
        else
            if station.host then server.ChaseNearVan(identity, station, false) end
            server.ChaseStopMicrophone(station)
        end
        server.ChaseReplicate(station)
        return
    end
    server.ChaseRequireBroadcast(identity)
    ChaseRequireLiveConsole(identity)
    ChaseRequireVoice(identity)
    if station.host == identity.source or cohostIndex then return end
    if server.ChaseParticipantStation(identity.source) then server.ChaseReject('already_participating', 'Finish your current call before joining the studio.') end
    if station.host then
        local maximum = config.CoHosts and config.CoHosts.maximum or 0
        if #server.ChaseCoHosts(station) >= maximum then server.ChaseReject('microphone_busy', 'Another host is using the microphone and no co-host slot is free.') end
    end
    server.tuned[identity.source] = nil
    identity.cartridgeSignature = nil
    TriggerClientEvent('chase_bootleg:client:reception', identity.source, nil)
    TriggerClientEvent('chase_bootleg:client:cartridge', identity.source, nil)
    if station.host then
        local cohosts = server.ChaseCoHosts(station)
        cohosts[#cohosts + 1] = { source = identity.source, identity = identity }
    else
        station.host = identity.source
        station.hostIdentity = identity
        station.hostAlias = identity.name
        station.routeKey = nil
    end
    server.ChaseReplicate(station)
end

function ChaseBootlegActions.ChaseTune(identity, data)
    local station
    if data.frequency ~= nil then
        if not domain.ChaseInteger(data.frequency, config.Frequency.min, config.Frequency.max) then server.ChaseReject('invalid_frequency', 'Choose a valid FM frequency.') end
        for _, candidate in pairs(server.stations) do
            if candidate.frequency == data.frequency then station = candidate break end
        end
    else
        station = ChaseSelectedStation(identity, data)
    end
    if not station or not station.live then server.ChaseReject('no_signal', 'No active station was found on that frequency.') end
    if data.placedNetId ~= nil then return ChaseBootlegReceivers.ChasePlacedTune(identity, data.placedNetId, station) end
    local vehicle = server.ChaseVehicle(station)
    local position, bucket = server.ChasePosition(identity)
    if not vehicle or not domain.ChaseCanReceive(station, position, bucket, GetEntityCoords(vehicle)) then
        server.ChaseReject('no_signal', 'That station is outside your reception area.')
    end
    if server.ChaseOnMicrophone(identity.source) then server.ChaseReject('feedback_prevented', 'Close your microphone before listening to a station.') end
    if ChaseBootlegReceivers then ChaseBootlegReceivers.ChaseTune(identity, station.id) end
    server.tuned[identity.source] = station.id
    identity.reception = nil
end

function ChaseBootlegActions.ChaseUntune(identity, data)
    if data.placedNetId ~= nil then return ChaseBootlegReceivers.ChasePlacedTune(identity, data.placedNetId, nil) end
    if ChaseBootlegReceivers and ChaseBootlegReceivers.ChaseEnabled() and ChaseBootlegReceivers.players[identity.source] then
        ChaseBootlegReceivers.ChaseTune(identity, nil)
    end
    server.tuned[identity.source] = nil
    identity.reception = nil
    identity.cartridgeSignature = nil
    TriggerClientEvent('chase_bootleg:client:reception', identity.source, nil)
    TriggerClientEvent('chase_bootleg:client:cartridge', identity.source, nil)
end

function ChaseBootlegActions.ChaseRequest(identity, data)
    local station = ChaseSelectedStation(identity, data)
    if data.kind ~= 'request' and data.kind ~= 'advertisement' and data.kind ~= 'song' and data.kind ~= 'message' then
        server.ChaseReject('invalid_request', 'Choose a song, message or advertisement.')
    end
    local limit = math.min(config.Requests.maxLength, 240)
    local message = ChaseFieldText(data.message or '', data.kind == 'song' and 0 or 3, limit, 'Message')
    if data.kind == 'song' then
        local music = ChaseRequireMusic()
        local provider = domain.ChaseMusicProvider(data.url)
        if not provider or not music.providers or music.providers[provider] ~= true then
            server.ChaseReject('invalid_link', 'Paste a supported YouTube or SoundCloud link.')
        end
        message = data.url .. '\n' .. message
        if not utf8.len(message) or utf8.len(message) > limit then
            server.ChaseReject('invalid_text', ('The song link and message must fit within %s characters.'):format(limit))
        end
    end
    server.ChaseRate(identity, 'requestMessage', config.Requests.cooldownSeconds * 1000)
    if ChaseBootlegDatabase.ChasePendingCount(station.id) >= config.Requests.maxPending then server.ChaseReject('queue_full', 'This station has too many pending requests.') end
    server.ChaseRequireCurrent(identity)
    MySQL.insert.await([[
        INSERT INTO chase_bootleg_requests (station_id, sender, sender_name, kind, message) VALUES (?, ?, ?, ?, ?)
    ]], { station.id, identity.identifier, identity.name, data.kind, message })
    MySQL.query.await([[
        DELETE FROM chase_bootleg_requests
        WHERE station_id = ? AND status <> 'pending' AND id NOT IN (
            SELECT id FROM (SELECT id FROM chase_bootleg_requests WHERE station_id = ? ORDER BY id DESC LIMIT ?) AS recent
        )
    ]], { station.id, station.id, config.Requests.retained })
end

function ChaseBootlegActions.ChaseModerateRequest(identity, data)
    local station = server.ChaseRequireStation(identity)
    if not domain.ChaseInteger(data.requestId, 1, 9007199254740991) or (data.status ~= 'accepted' and data.status ~= 'dismissed') then
        server.ChaseReject('invalid_request', 'Choose a valid request and moderation action.')
    end
    local changed = MySQL.update.await([[
        UPDATE chase_bootleg_requests SET status = ? WHERE id = ? AND station_id = ? AND status = 'pending'
    ]], { data.status, data.requestId, station.id })
    if changed ~= 1 then server.ChaseReject('request_unavailable', 'That request was already handled or is unavailable.') end
end

function ChaseBootlegActions.ChaseTip(identity, data)
    local station = ChaseSelectedStation(identity, data)
    if domain.ChaseCanManage(station, identity.identifier) then server.ChaseReject('self_tip', 'You cannot tip your own station.') end
    if not domain.ChaseInteger(data.amount, 1, config.MaxTip) then server.ChaseReject('invalid_amount', 'Enter a whole amount within the tip limit.') end
    if station.balance + data.amount > config.MaxStationBalance then server.ChaseReject('balance_limit', 'This station has reached its balance limit.') end
    ChasePaymentResult(ChaseBootlegMoney.ChaseDebit(identity, station, data.amount, 'tip', {
        {
            query = 'UPDATE chase_bootleg_stations SET balance = balance + ? WHERE id = ? AND balance = ? AND balance + ? <= ?',
            values = { data.amount, station.id, station.balance, data.amount, config.MaxStationBalance }
        }
    }))
    station.balance = station.balance + data.amount
end

function ChaseBootlegActions.ChaseWithdraw(identity, data)
    local station = server.ChaseRequireStation(identity, true)
    if not domain.ChaseInteger(data.amount, 1, config.MaxWithdrawal) then server.ChaseReject('invalid_amount', 'Enter a whole amount within the withdrawal limit.') end
    ChasePaymentResult(ChaseBootlegMoney.ChaseWithdraw(identity, station, data.amount))
end

function ChaseBootlegActions.ChaseCrewAdd(identity, data)
    local station = server.ChaseRequireStation(identity, true)
    if not domain.ChaseInteger(data.source, 1, 65535) then server.ChaseReject('invalid_player', 'Enter an online player ID.') end
    local target = server.ChaseSession(data.source)
    if server.ChaseMine(target.identifier) then server.ChaseReject('already_member', 'That character already owns or belongs to a station.') end
    local count = 0
    for _ in pairs(station.crew) do count = count + 1 end
    if count >= config.MaxCrew then server.ChaseReject('crew_full', 'Your station has reached its crew limit.') end
    local memberId = MySQL.insert.await('INSERT INTO chase_bootleg_crew (station_id, identifier, name) VALUES (?, ?, ?)',
        { station.id, target.identifier, target.name })
    if not memberId then server.ChaseReject('crew_failed', 'The crew member could not be added.') end
    station.crew[target.identifier] = { id = memberId, name = target.name }
    if server.ChaseCurrent(target) then server.ChaseNotify(target.source, 'You joined the crew of ' .. station.name .. '.', 'success') end
end

function ChaseBootlegActions.ChaseCrewRemove(identity, data)
    local station = server.ChaseRequireStation(identity, true)
    local memberIdentifier, member
    if domain.ChaseInteger(data.memberId, 1, 2147483647) then
        for identifier, candidate in pairs(station.crew) do
            if candidate.id == data.memberId then memberIdentifier, member = identifier, candidate break end
        end
    elseif domain.ChaseInteger(data.source, 1, 65535) then
        local target = server.ChaseSession(data.source)
        memberIdentifier, member = target.identifier, station.crew[target.identifier]
    end
    if not member then server.ChaseReject('crew_unavailable', 'That crew member could not be found.') end
    MySQL.update.await('DELETE FROM chase_bootleg_crew WHERE id = ? AND station_id = ?', { member.id, station.id })
    station.crew[memberIdentifier] = nil
    for _, participant in ipairs(server.ChaseParticipants(station)) do
        local session = server.sessions[participant]
        if session and session.identifier == memberIdentifier then server.ChaseLeave(participant) end
    end
end

function ChaseBootlegActions.ChasePlayCartridge(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = ChaseRequireLiveConsole(identity)
    local selected
    for _, cartridge in ipairs(config.Cartridges) do
        if cartridge.id == data.cartridgeId then selected = cartridge break end
    end
    if not selected then server.ChaseReject('cartridge_unavailable', 'Choose an installed cartridge.') end
    station.cartridge = { id = selected.id, provider = 'file', url = selected.url, title = selected.name, duration = selected.duration,
        startedAt = os.time(), monitorIdentity = identity }
end

function ChaseBootlegActions.ChasePreviewCartridge(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    server.ChaseNearVan(identity, station, true)
    for _, cartridge in ipairs(config.Cartridges) do
        if cartridge.id == data.cartridgeId then
            TriggerClientEvent('chase_bootleg:client:previewCartridge', identity.source, {
                cartridgeId = cartridge.id, title = cartridge.name, url = cartridge.url,
                duration = cartridge.duration, stationId = station.id
            })
            return
        end
    end
    server.ChaseReject('cartridge_unavailable', 'Choose an installed cartridge.')
end

function ChaseBootlegActions.ChaseStopPreview(identity)
    TriggerClientEvent('chase_bootleg:client:previewCartridge', identity.source, nil)
end

function ChaseBootlegActions.ChaseStopCartridge(identity)
    local station = server.ChaseRequireStation(identity)
    server.ChaseNearVan(identity, station, false)
    station.cartridge = nil
    station.autoplay = false
    station.trackCursor = nil
end

function ChaseBootlegActions.ChaseSetMode(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    if data.mode ~= 'dj' and data.mode ~= 'autonomous' then server.ChaseReject('invalid_mode', 'Choose the DJ-managed or autonomous mode.') end
    if data.mode == 'autonomous' then ChaseRequireMusic() end
    ChaseBootlegDatabase.ChaseSaveMode(station, data.mode)
    station.mode = data.mode
end

local function ChaseNewTrack(identity, station, data)
    local music = ChaseRequireMusic()
    local provider = domain.ChaseMusicProvider(data.url)
    if not provider or not music.providers or music.providers[provider] ~= true then
        server.ChaseReject('invalid_link', 'Paste a supported YouTube or SoundCloud link.')
    end
    local title = data.title == nil and data.url:sub(1, 120) or ChaseFieldText(data.title, 1, 120, 'Track title')
    if not domain.ChaseInteger(data.duration, music.minDurationSeconds, music.maxDurationSeconds) then
        server.ChaseReject('invalid_duration', ('Tracks must run between %s and %s seconds.'):format(music.minDurationSeconds, music.maxDurationSeconds))
    end
    station.queue = station.queue or {}
    if #station.queue >= music.maxQueue then server.ChaseReject('queue_full', 'The music queue is full.') end
    local last = station.queue[#station.queue]
    local track = { provider = provider, url = data.url, title = title, duration = data.duration, addedBy = identity.identifier,
        position = (last and last.position or 0) + 1 }
    return track
end

function ChaseBootlegActions.ChaseQueueAdd(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    local track = ChaseNewTrack(identity, station, data)
    local trackId = ChaseBootlegDatabase.ChaseInsertTrack(station, track, track.position)
    if not domain.ChaseInteger(trackId, 1, 9007199254740991) then server.ChaseReject('queue_failed', 'The track could not be saved.') end
    track.id = trackId
    station.queue[#station.queue + 1] = track
end

function ChaseBootlegActions.ChaseQueueRequest(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    if not domain.ChaseInteger(data.requestId, 1, 9007199254740991) then server.ChaseReject('invalid_request', 'Choose a pending song request.') end
    local row = MySQL.single.await("SELECT kind, message FROM chase_bootleg_requests WHERE id = ? AND station_id = ? AND status = 'pending'", { data.requestId, station.id })
    server.ChaseRequireBroadcast(identity)
    if not row or row.kind ~= 'song' then server.ChaseReject('request_unavailable', 'That song request was already handled or is unavailable.') end
    local url = type(row.message) == 'string' and row.message:match('^([^\n]+)\n')
    local track = ChaseNewTrack(identity, station, { url = url, title = data.title, duration = data.duration })
    local trackId = ChaseBootlegDatabase.ChaseInsertRequestTrack(station, data.requestId, track)
    if not domain.ChaseInteger(trackId, 1, 9007199254740991) then server.ChaseReject('queue_failed', 'The song request could not be queued.') end
    track.id = trackId
    station.queue[#station.queue + 1] = track
end

function ChaseBootlegActions.ChaseQueueMove(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    local track, index = ChaseTrack(station, data.trackId)
    if not domain.ChaseInteger(data.position, 1, #station.queue) then server.ChaseReject('invalid_position', 'Choose a position within the music queue.') end
    if index == data.position then return end
    local queue = {}
    for position, queued in ipairs(station.queue) do queue[position] = queued end
    table.remove(queue, index)
    table.insert(queue, data.position, track)
    if not ChaseBootlegDatabase.ChaseMoveTracks(station, queue) then server.ChaseReject('queue_failed', 'The queue order could not be saved.') end
    station.queue = queue
    for position, queued in ipairs(queue) do
        queued.position = position
        if station.trackCursor and queued.id == station.trackCursor.trackId then station.trackCursor.index = position end
    end
end

function ChaseBootlegActions.ChaseQueueRemove(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    local track, index = ChaseTrack(station, data.trackId)
    ChaseBootlegDatabase.ChaseDeleteTrack(station, track.id)
    if station.queue[index] == track then
        table.remove(station.queue, index)
        if station.trackCursor and index < station.trackCursor.index then station.trackCursor.index = station.trackCursor.index - 1 end
    end
end

function ChaseBootlegActions.ChasePlayTrack(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = ChaseRequireLiveConsole(identity)
    ChaseRequireMusic()
    local track = ChaseTrack(station, data.trackId)
    if not server.ChasePlayable(track) then server.ChaseReject('provider_disabled', 'That music provider is disabled on this server.') end
    server.ChaseStartTrack(station, track, identity)
    station.autoplay = true
end

function ChaseBootlegActions.ChaseSkipTrack(identity)
    server.ChaseRequireBroadcast(identity)
    local station = ChaseRequireLiveConsole(identity)
    ChaseRequireMusic()
    local current = station.cartridge
    station.autoplay = server.ChaseStartTrack(station, server.ChaseNextTrack(station, current and current.trackId), identity)
end

function ChaseBootlegActions.ChasePreviousTrack(identity)
    server.ChaseRequireBroadcast(identity)
    local station = ChaseRequireLiveConsole(identity)
    ChaseRequireMusic()
    station.autoplay = server.ChaseStartTrack(station, server.ChasePreviousTrack(station), identity)
end

function ChaseBootlegActions.ChasePauseTrack(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = ChaseRequireLiveConsole(identity)
    if type(data.paused) ~= 'boolean' then server.ChaseReject('invalid_playback', 'Choose whether to pause or resume playback.') end
    local cartridge = station.cartridge
    if not cartridge or not cartridge.trackId then server.ChaseReject('track_unavailable', 'Play a queued music track first.') end
    if data.paused and not cartridge.pausedAt then
        if os.time() >= cartridge.startedAt + cartridge.duration then server.ChaseReject('track_unavailable', 'That track has already ended.') end
        cartridge.pausedAt = os.time()
    elseif not data.paused and cartridge.pausedAt then
        cartridge.startedAt = cartridge.startedAt + os.time() - cartridge.pausedAt
        cartridge.pausedAt = nil
    end
end

function ChaseBootlegActions.ChaseMusicVolume(identity, data)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    server.ChaseNearVan(identity, station, true)
    if type(data.volume) ~= 'number' or data.volume ~= data.volume or data.volume < 0 or data.volume > 1 then
        server.ChaseReject('invalid_volume', 'Choose a broadcast volume between zero and one.')
    end
    station.musicVolume = data.volume
end

function ChaseBootlegActions.ChaseCallStation(identity, data)
    local calls = config.Calls
    if not calls or calls.enabled ~= true then server.ChaseReject('calls_unavailable', 'Listener calls are disabled on this server.') end
    if not domain.ChaseInteger(data.stationId, 1, 2147483647) then server.ChaseReject('invalid_station', 'Choose a station first.') end
    local station = server.stations[data.stationId]
    local reception = server.audible[identity.source]
    if not station or not reception or reception.stationId ~= station.id then server.ChaseReject('tune_required', 'Tune in to that station before calling.') end
    if data.placedNetId ~= nil then
        ChaseBootlegReceivers.ChasePlaced(identity, data.placedNetId)
        if reception.emitterNetId ~= data.placedNetId then server.ChaseReject('tune_required', 'Stand beside that field radio while it plays the station before calling.') end
    end
    if not station.live or not station.host then server.ChaseReject('host_unavailable', 'No host is on the air to take your call.') end
    if station.caller or station.pendingCall then server.ChaseReject('line_busy', 'The station line is busy. Try again in a moment.') end
    if server.ChaseParticipantStation(identity.source) then server.ChaseReject('already_participating', 'You are already on a station microphone.') end
    server.ChaseRate(identity, 'callStation', calls.cooldownSeconds * 1000)
    ChaseRequireVoice(identity)
    local callId = server.ChaseNextCallId()
    station.pendingCall = { callId = callId, source = identity.source, identity = identity, name = identity.name, createdAt = os.time() }
    TriggerClientEvent('chase_bootleg:client:incomingCall', station.host, { callId = callId, callerName = identity.name,
        stationId = station.id, stationName = station.name, ringSeconds = calls.ringSeconds })
end

function ChaseBootlegActions.ChaseAnswerCall(identity, data)
    if type(data.accept) ~= 'boolean' or not domain.ChaseInteger(data.callId, 1, 9007199254740991) then
        server.ChaseReject('invalid_call', 'Choose whether to accept or decline the call.')
    end
    local station = ChaseHostedStation(identity)
    local pending = station.pendingCall
    if not pending or pending.callId ~= data.callId then server.ChaseReject('call_unavailable', 'That call is no longer waiting.') end
    if not data.accept then return server.ChaseDeclineCall(station) end
    local caller = pending.identity
    local reception = server.audible[pending.source]
    if not server.ChaseCurrent(caller) or not ChaseBootlegFramework.ChaseIsAlive(caller) or not reception or reception.stationId ~= station.id
        or not ChaseBootlegVoice.ChaseIsHostAvailable(pending.source) then
        server.ChaseDeclineCall(station, 'ended')
        server.ChaseReject('caller_unavailable', 'The caller is no longer available.')
    end
    station.pendingCall = nil
    station.caller = { source = pending.source, identity = caller, callId = pending.callId, acceptedAt = os.time() }
    TriggerClientEvent('chase_bootleg:client:incomingCall', identity.source, nil)
    server.ChaseCallState(station.caller, station, 'onair')
end

function ChaseBootlegActions.ChaseEndCall(identity)
    local station, role = server.ChaseParticipantStation(identity.source)
    if role == 'pending' then return server.ChaseDeclineCall(station, 'ended') end
    if role == 'caller' then return server.ChaseEndCall(station) end
    station = server.ChaseRequireStation(identity)
    if station.caller then server.ChaseEndCall(station)
    elseif station.pendingCall then server.ChaseDeclineCall(station)
    else server.ChaseReject('call_unavailable', 'There is no caller on the line.') end
end

function ChaseBootlegActions.ChaseRecharge(identity)
    server.ChaseRequireBroadcast(identity)
    local station = server.ChaseRequireStation(identity)
    server.ChaseAtDepot(identity)
    if station.stage ~= 'parked' and station.stage ~= 'stored' then server.ChaseReject('pack_required', 'Pack the studio before recharging.') end
    if station.vehicle then server.ChaseNearVan(identity, station, true) end
    if station.battery >= 99.99 then server.ChaseReject('battery_full', 'The studio battery is already full.') end
    ChaseBootlegDatabase.ChaseSaveBattery(station)
    server.ChaseRequireCurrent(identity)
    server.ChaseRequireBroadcast(identity)
    server.ChaseAtDepot(identity)
    if station.vehicle then server.ChaseNearVan(identity, station, true) end
    ChasePaymentResult(ChaseBootlegMoney.ChaseDebit(identity, station, config.Battery.rechargePrice, 'recharge', {
        { query = 'UPDATE chase_bootleg_stations SET battery = 100 WHERE id = ? AND battery < 100', values = { station.id } }
    }, ChaseBootlegFramework.ChaseCanBroadcast))
    station.battery = 100
    server.ChaseReplicate(station)
end

function ChaseBootlegActions.ChaseScan(identity, data)
    if not config.Scanner.enabled or not ChaseBootlegFramework.ChaseIsPolice(identity) then server.ChaseReject('police_required', 'Only authorized on-duty officers can use this scanner.') end
    if not domain.ChaseInteger(data.frequency, config.Frequency.min, config.Frequency.max) then server.ChaseReject('invalid_frequency', 'Choose a valid FM frequency.') end
    server.ChaseRate(identity, 'scannerReading', config.Scanner.cooldownSeconds * 1000)
    local position, bucket = server.ChasePosition(identity)
    local station
    for _, candidate in pairs(server.stations) do
        if candidate.frequency == data.frequency and candidate.live and candidate.bucket == bucket then station = candidate break end
    end
    local vehicle = station and server.ChaseVehicle(station)
    local empty = { detected = false, frequency = data.frequency, strength = 0, bearing = 0, uncertainty = 180, readings = 0, message = 'No readable transmission on this frequency.' }
    if not vehicle then return empty end
    local target = GetEntityCoords(vehicle)
    local distance = domain.ChaseDistance(position, target)
    local range = math.min(config.Scanner.maxRange, domain.ChasePower(station.power).range * 1.5)
    if distance > range then return empty end
    local history = server.scans[identity.source]
    if not history or history.stationId ~= station.id or history.epoch ~= station.broadcastEpoch or history.bucket ~= bucket then
        history = { stationId = station.id, epoch = station.broadcastEpoch, bucket = bucket, readings = {} }
        server.scans[identity.source] = history
    end
    local now = os.time()
    for index = #history.readings, 1, -1 do
        if now - history.readings[index].createdAt > config.Scanner.historySeconds then table.remove(history.readings, index) end
    end
    local separated = domain.ChaseSeparated(history.readings, position, config.Scanner.separation)
    if separated and #history.readings < config.Scanner.requiredReadings then
        history.readings[#history.readings + 1] = { x = position.x, y = position.y, z = position.z, createdAt = now }
    end
    local area = domain.ChaseScanArea(target, config.Scanner.searchRadius, station.scanOffsetX, station.scanOffsetY)
    local bearing = (math.deg(math.atan(area.x - position.x, area.y - position.y)) + 360) % 360
    local complete = #history.readings >= config.Scanner.requiredReadings
    local result = {
        detected = true, frequency = data.frequency,
        strength = domain.ChaseRound(domain.ChaseSignal(domain.ChaseDistance(position, { x = area.x, y = area.y, z = target.z }), range), 0.1),
        bearing = domain.ChaseRound(bearing, config.Scanner.bearingStep) % 360,
        uncertainty = complete and 20 or 40, readings = #history.readings,
        message = complete and 'Approximate search area established. The transmitter is somewhere inside this area.'
            or (separated and 'Reading recorded. Move to a different location for another reading.' or 'Move farther from your earlier reading locations.')
    }
    if complete then result.searchArea = area end
    return result
end

ChaseBootlegActions.ChaseDispatch = {
    createStation = actions.ChaseCreateStation, updateStation = actions.ChaseUpdateStation,
    spawnVan = actions.ChaseSpawnVan, storeVan = actions.ChaseStoreVan,
    deploy = actions.ChaseDeploy, pack = actions.ChasePack, broadcast = actions.ChaseBroadcast,
    microphone = actions.ChaseMicrophone, tune = actions.ChaseTune, untune = actions.ChaseUntune,
    request = actions.ChaseRequest, moderateRequest = actions.ChaseModerateRequest,
    tip = actions.ChaseTip, withdraw = actions.ChaseWithdraw,
    crewAdd = actions.ChaseCrewAdd, crewRemove = actions.ChaseCrewRemove,
    playCartridge = actions.ChasePlayCartridge, stopCartridge = actions.ChaseStopCartridge,
    previewCartridge = actions.ChasePreviewCartridge, stopPreview = actions.ChaseStopPreview,
    recharge = actions.ChaseRecharge, scan = actions.ChaseScan,
    setMode = actions.ChaseSetMode, queueAdd = actions.ChaseQueueAdd, queueRemove = actions.ChaseQueueRemove,
    playTrack = actions.ChasePlayTrack, skipTrack = actions.ChaseSkipTrack, previousTrack = actions.ChasePreviousTrack,
    pauseTrack = actions.ChasePauseTrack, musicVolume = actions.ChaseMusicVolume,
    queueMove = actions.ChaseQueueMove, queueRequest = actions.ChaseQueueRequest,
    callStation = actions.ChaseCallStation, answerCall = actions.ChaseAnswerCall, endCall = actions.ChaseEndCall
}

if ChaseBootlegReceivers then
    ChaseBootlegActions.ChaseDispatch.buyDevice = ChaseBootlegReceivers.ChaseBuy
    ChaseBootlegActions.ChaseDispatch.equipDevice = ChaseBootlegReceivers.ChaseEquip
    ChaseBootlegActions.ChaseDispatch.installReceiver = ChaseBootlegReceivers.ChaseInstall
    ChaseBootlegActions.ChaseDispatch.moveReceiver = ChaseBootlegReceivers.ChaseMove
    ChaseBootlegActions.ChaseDispatch.placeRadio = ChaseBootlegReceivers.ChasePlace
    ChaseBootlegActions.ChaseDispatch.pickupRadio = ChaseBootlegReceivers.ChasePickup
end
