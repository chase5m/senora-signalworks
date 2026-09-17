ChaseBootlegKeys = {}

local chasePending = {}
local chaseRecoveryAt = {}
local domain = ChaseBootlegDomain
local config = ChaseBootlegConfig

local function ChaseProvider()
    local provider = config.Keys.provider
    if provider == 'auto' then
        if GetResourceState('qbx_vehiclekeys') == 'started' then return 'qbx_vehiclekeys' end
        if GetResourceState('qb-vehiclekeys') == 'started' then return 'qb-vehiclekeys' end
        if GetResourceState('wasabi_carlock') == 'started' then return 'wasabi_carlock' end
        return 'none'
    end
    return provider
end

function ChaseBootlegKeys.ChaseGiveKeys(vehicle, plate)
    local provider = ChaseProvider()
    if provider == 'qbx_vehiclekeys' then
        local startedAt = GetGameTimer()
        local nextAttempt = 0
        while DoesEntityExist(vehicle) and domain.ChaseElapsed(GetGameTimer(), startedAt) < 6000 do
            if exports.qbx_vehiclekeys:HasKeys(vehicle) then return true end
            local elapsed = domain.ChaseElapsed(GetGameTimer(), startedAt)
            if elapsed >= nextAttempt then
                local response = lib.callback.await('chase_bootleg:server:vanKeys', false, VehToNet(vehicle))
                if type(response) == 'table' and not response.ok and response.error
                    and response.error.code ~= 'keys_pending' and response.error.code ~= 'rate_limited' then
                    return false, response.error.message
                end
                nextAttempt = elapsed + 1500
            end
            Wait(100)
        end
        return false, 'Your van keys are still syncing. Open the studio beside the van to retry.'
    elseif provider == 'qb-vehiclekeys' then
        TriggerEvent('vehiclekeys:client:SetOwner', plate)
    elseif provider == 'wasabi_carlock' then
        exports.wasabi_carlock:GiveKey(plate)
    end
    return true
end

local function ChaseCollectKeys(netId, plate, delivery)
    if chasePending[netId] then return end
    chasePending[netId] = true
    CreateThread(function()
        local success, granted, message = pcall(function()
            local startedAt = GetGameTimer()
            while not NetworkDoesEntityExistWithNetworkId(netId) and domain.ChaseElapsed(GetGameTimer(), startedAt) < 10000 do Wait(100) end
            if not NetworkDoesEntityExistWithNetworkId(netId) then return false, 'Move closer to your studio van, then open the studio to collect its keys.' end
            local vehicle = NetToVeh(netId)
            if delivery then SetVehicleOnGroundProperly(vehicle) end
            return ChaseBootlegKeys.ChaseGiveKeys(vehicle, plate)
        end)
        chasePending[netId] = nil
        if not success then
            print(('[chase_bootleg] Key adapter failed: %s'):format(tostring(granted)))
            ChaseBootlegClient.ChaseNotify('Your van keys could not be confirmed. Open the studio beside the van to retry.', 'error')
        elseif not granted then
            ChaseBootlegClient.ChaseNotify(message, 'error')
        elseif delivery and ChaseProvider() == 'qbx_vehiclekeys' then
            ChaseBootlegClient.ChaseNotify('Studio van keys received.', 'success')
        end
    end)
end

function ChaseBootlegKeys.ChaseRecoverVan(snapshot)
    if ChaseProvider() ~= 'qbx_vehiclekeys' or type(snapshot) ~= 'table' or type(snapshot.mine) ~= 'table' then return end
    local netId = snapshot.mine.vehicleNetId
    if type(netId) ~= 'number' or not NetworkDoesEntityExistWithNetworkId(netId) or chasePending[netId] then return end
    local previous = chaseRecoveryAt[netId]
    if previous and domain.ChaseElapsed(GetGameTimer(), previous) < 10000 then return end
    local vehicle = NetToVeh(netId)
    local position = GetEntityCoords(PlayerPedId())
    if domain.ChaseDistance(position, GetEntityCoords(vehicle)) > config.Vehicle.operatorRange
        and domain.ChaseDistance(position, config.Depot.position) > config.Depot.radius then return end
    chaseRecoveryAt = { [netId] = GetGameTimer() }
    local success, hasKeys = pcall(function() return exports.qbx_vehiclekeys:HasKeys(vehicle) end)
    if success and hasKeys then return end
    ChaseCollectKeys(netId, nil, false)
end

RegisterNetEvent('chase_bootleg:client:vanReady', function(details)
    if source ~= 65535 or type(details) ~= 'table' or type(details.netId) ~= 'number' then return end
    ChaseCollectKeys(details.netId, details.plate, true)
end)
