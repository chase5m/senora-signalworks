ChaseBootlegServerKeys = {}

local server = ChaseBootlegServer
local domain = ChaseBootlegDomain
local config = ChaseBootlegConfig

function ChaseBootlegServerKeys.ChaseProvider()
    local provider = config.Keys and config.Keys.provider or 'auto'
    if provider == 'auto' then
        if GetResourceState('qbx_vehiclekeys') == 'started' then return 'qbx_vehiclekeys' end
        if GetResourceState('qb-vehiclekeys') == 'started' then return 'qb-vehiclekeys' end
        if GetResourceState('wasabi_carlock') == 'started' then return 'wasabi_carlock' end
        return 'none'
    end
    return provider
end

function ChaseBootlegServerKeys.ChaseGiveKeys(identity, vehicle)
    server.ChaseRequireCurrent(identity)
    if ChaseBootlegServerKeys.ChaseProvider() ~= 'qbx_vehiclekeys' then return true end
    if GetResourceState('qbx_vehiclekeys') ~= 'started' or not DoesEntityExist(vehicle) then return false end
    exports.qbx_vehiclekeys:GiveKeys(identity.source, vehicle, true)
    server.ChaseRequireCurrent(identity)
    return exports.qbx_vehiclekeys:HasKeys(identity.source, vehicle) == true
end

function ChaseBootlegServerKeys.ChasePrepareVan(identity, vehicle)
    if ChaseBootlegServerKeys.ChaseProvider() ~= 'qbx_vehiclekeys' then return end
    Entity(vehicle).state:set('doorslockstate', 1, true)
    SetVehicleDoorsLocked(vehicle, 1)
    local success, granted = pcall(ChaseBootlegServerKeys.ChaseGiveKeys, identity, vehicle)
    if not success or not granted then
        print('[chase_bootleg] Studio van keys are awaiting confirmation. The client will retry after the van streams in.')
    end
end

function ChaseBootlegServerKeys.ChaseConfirmVan(playerSource, netId)
    if not server.ready then return domain.ChaseError('starting', 'The studio is still starting.') end
    local success, result = pcall(function()
        if not domain.ChaseInteger(netId, 1, 2147483647) then
            server.ChaseReject('invalid_vehicle', 'Choose your studio van first.')
        end
        local identity = server.ChaseSession(playerSource)
        server.ChaseRate(identity, 'vanKeys', 750)
        local station = server.ChaseRequireStation(identity)
        local vehicle = server.ChaseVehicle(station)
        if not vehicle or station.vehicleNetId ~= netId then
            server.ChaseReject('van_required', 'Collect your studio van from the depot first.')
        end
        local position, bucket = server.ChasePosition(identity)
        local nearVan = domain.ChaseDistance(position, GetEntityCoords(vehicle)) <= config.Vehicle.operatorRange
        local atDepot = bucket == config.Depot.bucket
            and domain.ChaseDistance(position, config.Depot.position) <= config.Depot.radius
            and domain.ChaseDistance(GetEntityCoords(vehicle), config.Depot.spawn) <= config.Depot.spawnClearance
        if bucket ~= station.bucket or GetEntityRoutingBucket(vehicle) ~= bucket or not (nearVan or atDepot) then
            server.ChaseReject('van_too_far', 'Stand beside your studio van to collect its keys.')
        end
        if not ChaseBootlegServerKeys.ChaseGiveKeys(identity, vehicle) then
            server.ChaseReject('keys_pending', 'Your van keys are still syncing. Try again beside the van.')
        end
        return { netId = netId }
    end)
    if success then return domain.ChaseSuccess(result) end
    if type(result) == 'table' and result.code and result.message then return domain.ChaseError(result.code, result.message) end
    print(('[chase_bootleg] Van key confirmation failed: %s'):format(tostring(result)))
    return domain.ChaseError('keys_unavailable', 'Your van keys could not be confirmed. Try again beside the van.')
end

lib.callback.register('chase_bootleg:server:vanKeys', ChaseBootlegServerKeys.ChaseConfirmVan)
