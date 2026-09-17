ChaseBootlegVoice = {}

local chaseReadyClients = {}
local chaseRoutes = {}

function ChaseBootlegVoice.ChaseIsReady()
    if ChaseBootlegConfig.Voice and ChaseBootlegConfig.Voice.enabled == false then return false end
    local resource = ChaseBootlegConfig.Voice and ChaseBootlegConfig.Voice.resource or 'pma-voice'
    if GetResourceState(resource) ~= 'started' then return false end
    local success, version = pcall(function()
        return exports[resource]:ChaseBootlegBridgeVersion()
    end)
    return success and version == 3
end

function ChaseBootlegVoice.ChaseIsHostAvailable(playerSource)
    if not chaseReadyClients[playerSource] or not ChaseBootlegVoice.ChaseIsReady() then return false end
    local state = Player(playerSource).state
    local callChannel = tonumber(state.callChannel) or tonumber(state.call) or 0
    return callChannel == 0 and state.isDead ~= true and state.dead ~= true and state.inlaststand ~= true
end

function ChaseBootlegVoice.ChaseSetRoute(hostSource, listenerSources, metadata)
    if not ChaseBootlegVoice.ChaseIsHostAvailable(hostSource) then
        ChaseBootlegVoice.ChaseClearRoute(hostSource)
        return false
    end
    local listeners, seen = {}, {}
    for _, listener in ipairs(listenerSources or {}) do
        if type(listener) == 'number' and listener ~= hostSource and not seen[listener]
            and GetPlayerName(listener) and chaseReadyClients[listener] then
            seen[listener] = true
            listeners[#listeners + 1] = listener
        end
    end
    table.sort(listeners)
    local info = metadata or {}
    local signature = ('%s:%s:%s:%s:%s:%s:%s'):format(table.concat(listeners, ','), info.stationId or 0,
        info.hostSource or hostSource, info.hostName or '', info.stationName or '', info.frequency or 0, info.role or '')
    local previous = chaseRoutes[hostSource]
    if not previous or previous.signature ~= signature then
        local payload = { listeners = listeners, stationId = info.stationId, hostSource = info.hostSource or hostSource,
            hostName = info.hostName, stationName = info.stationName, frequency = info.frequency, role = info.role }
        chaseRoutes[hostSource] = { signature = signature, metadata = info }
        TriggerClientEvent('chase_bootleg:client:voiceRoute', hostSource, payload)
    end
    return true
end

function ChaseBootlegVoice.ChaseClearRoute(hostSource)
    local previous = chaseRoutes[hostSource]
    local metadata = previous and previous.metadata or {}
    chaseRoutes[hostSource] = nil
    if GetPlayerName(hostSource) then
        TriggerClientEvent('chase_bootleg:client:voiceRoute', hostSource, { listeners = {}, stopped = true,
            stationId = metadata.stationId, hostSource = metadata.hostSource or hostSource,
            hostName = metadata.hostName, stationName = metadata.stationName, frequency = metadata.frequency, role = metadata.role })
    end
end

RegisterNetEvent('chase_bootleg:server:voiceReady', function(enabled)
    local playerSource = source
    chaseReadyClients[playerSource] = enabled == true and ChaseBootlegVoice.ChaseIsReady() or nil
    if not chaseReadyClients[playerSource] then ChaseBootlegVoice.ChaseClearRoute(playerSource) end
end)

AddEventHandler('playerDropped', function()
    local playerSource = source
    chaseReadyClients[playerSource] = nil
    chaseRoutes[playerSource] = nil
    for host in pairs(chaseRoutes) do
        ChaseBootlegVoice.ChaseClearRoute(host)
    end
end)

AddEventHandler('onResourceStop', function(resource)
    local voiceResource = ChaseBootlegConfig.Voice and ChaseBootlegConfig.Voice.resource or 'pma-voice'
    if resource ~= GetCurrentResourceName() and resource ~= voiceResource then return end
    for host in pairs(chaseRoutes) do ChaseBootlegVoice.ChaseClearRoute(host) end
    chaseReadyClients = {}
end)
