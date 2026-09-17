ChaseBootlegReceivers = { players = {}, vehicles = {}, installations = {}, orders = {}, proofs = {}, placed = {}, placementReviews = {} }

local receivers = ChaseBootlegReceivers
local server = ChaseBootlegServer
local domain = ChaseBootlegDomain
local adapter = ChaseBootlegDeviceAdapter
local config = ChaseBootlegConfig
local nextOrder = 0
local mountAxes = { 'x', 'y', 'z', 'rx', 'ry', 'rz' }
local defaultMountBounds = { x = { min = -1.5, max = 1.5 }, y = { min = -2.5, max = 2.5 }, z = { min = -1.0, max = 2.0 } }

local function ChaseMount(value)
    if type(value) ~= 'table' then server.ChaseReject('invalid_mount', 'Choose the receiver position inside your vehicle before installing it.') end
    local settings = config.Dashboard and config.Dashboard.placement
    local bounds = settings and settings.bounds or defaultMountBounds
    local mount = {}
    for _, axis in ipairs(mountAxes) do
        local number = value[axis]
        local minimum, maximum = -180.0, 180.0
        if defaultMountBounds[axis] then
            local bound = bounds[axis] or defaultMountBounds[axis]
            minimum, maximum = bound.min, bound.max
        end
        if type(number) ~= 'number' or number ~= number or number < minimum or number > maximum then
            server.ChaseReject('invalid_mount', 'Keep the receiver position and rotation within the vehicle placement limits.')
        end
        mount[axis] = number + 0.0
    end
    return mount
end

local function ChaseMountValues(key, mount)
    return { key, mount.x, mount.y, mount.z, mount.rx, mount.ry, mount.rz }
end

local function ChaseSaveMount(key, mount)
    local changed = MySQL.update.await([[
        INSERT INTO chase_bootleg_receiver_mounts (vehicle_key, x, y, z, rx, ry, rz)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE x = VALUES(x), y = VALUES(y), z = VALUES(z),
            rx = VALUES(rx), ry = VALUES(ry), rz = VALUES(rz)
    ]], ChaseMountValues(key, mount))
    assert(type(changed) == 'number', 'Receiver mount write returned an uncertain result')
end

local function ChaseMountSignature(mount)
    if not mount then return 'default' end
    return ('%.5f:%.5f:%.5f:%.5f:%.5f:%.5f'):format(mount.x, mount.y, mount.z, mount.rx, mount.ry, mount.rz)
end

function ChaseBootlegReceivers.ChaseEnabled()
    return config.Devices and config.Devices.enabled == true
end

local function ChaseProduct(device)
    local product = type(device) == 'string' and config.Devices.products[device]
    if not product then server.ChaseReject('invalid_device', 'Choose a receiver from the Signalworks shop.') end
    return product
end

local function ChaseCount(identity, item)
    local success, count = pcall(adapter.ChaseCount, identity, item)
    return success and type(count) == 'number' and count or 0
end

function ChaseBootlegReceivers.ChaseAtShop(identity)
    local position, bucket = server.ChasePosition(identity)
    local shop = config.Devices.Shop
    if bucket ~= shop.bucket or domain.ChaseDistance(position, shop.position) > shop.radius then
        server.ChaseReject('shop_required', 'Visit the Signalworks vendor at Legion Square to buy or collect a receiver.')
    end
end

local function ChasePlayerState(playerSource)
    local state = receivers.players[playerSource]
    local station = state and server.stations[state.stationId]
    Player(playerSource).state:set('chase_bootleg:receiver', state and state.device ~= 'vehicle' and {
        device = state.device, carry = state.carry, stationId = state.stationId,
        frequency = station and station.frequency, enabled = state.stationId ~= nil
    } or nil, true)
end

local function ChaseVehicleState(receiver)
    if not DoesEntityExist(receiver.vehicle) or NetworkGetNetworkIdFromEntity(receiver.vehicle) ~= receiver.netId
        or adapter.ChasePlate(GetVehicleNumberPlateText(receiver.vehicle)) ~= receiver.plate
        or GetEntityModel(receiver.vehicle) ~= receiver.model then return end
    local station = server.stations[receiver.stationId]
    local transmitter = station and server.ChaseVehicle(station)
    local receives, quality = false, 0.0
    if transmitter then
        receives, quality = domain.ChaseCanReceive(station, GetEntityCoords(receiver.vehicle),
            GetEntityRoutingBucket(receiver.vehicle), GetEntityCoords(transmitter))
    end
    quality = receives and domain.ChaseRound(quality, 0.05) or 0.0
    local label = station and station.name or 'No station selected'
    local installed = receivers.installations[receiver.key]
    local mount = installed and installed.mount
    local signature = ('%s:%s:%s:%s:%s'):format(receiver.stationId or 0, station and station.frequency or 0, label, quality, ChaseMountSignature(mount))
    if receiver.stateSignature == signature then return end
    receiver.stateSignature = signature
    Entity(receiver.vehicle).state:set('chase_bootleg:receiver', {
        device = 'vehicle', installed = true, stationId = receiver.stationId,
        frequency = station and station.frequency, enabled = receiver.stationId ~= nil, label = label, quality = quality, mount = mount
    }, true)
end

local function ChaseCurrentVehicle(identity, driverRequired)
    local position, bucket = server.ChasePosition(identity)
    local ped = GetPlayerPed(identity.source)
    local vehicle = GetVehiclePedIsIn(ped, false)
    if vehicle == 0 or not DoesEntityExist(vehicle) or GetEntityRoutingBucket(vehicle) ~= bucket then
        server.ChaseReject('vehicle_required', 'Sit inside the vehicle to use its receiver.')
    end
    if driverRequired and GetPedInVehicleSeat(vehicle, -1) ~= ped then
        server.ChaseReject('driver_required', 'Sit in the driver seat to install the receiver.')
    end
    return vehicle, position
end

local function ChaseRequireMountVehicle(identity, vehicle, proof)
    server.ChaseRequireCurrent(identity)
    if ChaseCurrentVehicle(identity, true) ~= vehicle or NetworkGetNetworkIdFromEntity(vehicle) ~= proof.netId
        or adapter.ChasePlate(GetVehicleNumberPlateText(vehicle)) ~= proof.plate or GetEntityModel(vehicle) ~= proof.model then
        server.ChaseReject('vehicle_changed', 'Stay in the same vehicle while positioning the receiver.')
    end
    if GetEntitySpeed(vehicle) > config.Devices.installMaximumSpeed then
        server.ChaseReject('park_required', 'Keep the vehicle parked while positioning its receiver.')
    end
end

local function ChaseMountOwnerRequired()
    return config.Dashboard and config.Dashboard.requireOwner == true
end

local function ChaseRequireMountAccess(identity, vehicle, proof)
    ChaseRequireMountVehicle(identity, vehicle, proof)
    local current = receivers.ChaseProof(vehicle, true)
    ChaseRequireMountVehicle(identity, vehicle, proof)
    if not current or current.key ~= proof.key then
        server.ChaseReject('vehicle_record_changed', 'The saved vehicle record changed. Reopen placement in the same registered vehicle.')
    end
    if ChaseMountOwnerRequired() and current.owner ~= identity.identifier then
        server.ChaseReject('vehicle_owner_required', 'Only the current vehicle owner can position its receiver.')
    end
end

local function ChaseBind(vehicle, proof)
    local installed = proof and receivers.installations[proof.key]
    if not installed or installed.status ~= 'active' or tonumber(installed.model) ~= proof.model then return nil end
    if not DoesEntityExist(vehicle) or NetworkGetNetworkIdFromEntity(vehicle) ~= proof.netId
        or adapter.ChasePlate(GetVehicleNumberPlateText(vehicle)) ~= proof.plate or GetEntityModel(vehicle) ~= proof.model then return nil end
    for otherVehicle, receiver in pairs(receivers.vehicles) do
        if otherVehicle ~= vehicle and receiver.key == proof.key and DoesEntityExist(otherVehicle)
            and NetworkGetNetworkIdFromEntity(otherVehicle) == receiver.netId then return nil end
    end
    local receiver = receivers.vehicles[vehicle]
    if receiver and receiver.key == proof.key and receiver.netId == NetworkGetNetworkIdFromEntity(vehicle) then return receiver end
    receiver = { key = proof.key, vehicle = vehicle, netId = NetworkGetNetworkIdFromEntity(vehicle),
        plate = proof.plate, model = proof.model, stationId = tonumber(installed.station_id) }
    receivers.vehicles[vehicle] = receiver
    ChaseVehicleState(receiver)
    return receiver
end

function ChaseBootlegReceivers.ChaseProof(vehicle, force)
    if not vehicle or vehicle == 0 or not DoesEntityExist(vehicle) then return nil end
    local netId = NetworkGetNetworkIdFromEntity(vehicle)
    local plate = adapter.ChasePlate(GetVehicleNumberPlateText(vehicle))
    local model = GetEntityModel(vehicle)
    local vehicleId = Entity(vehicle).state.vehicleid
    local cached = receivers.proofs[vehicle]
    if not force and cached and cached.proof and cached.netId == netId and cached.plate == plate and cached.model == model
        and cached.vehicleId == vehicleId
        and domain.ChaseElapsed(GetGameTimer(), cached.checkedAt) < config.Devices.ownershipCacheSeconds * 1000 then
        return cached.proof
    end
    local proof = adapter.ChaseVehicle(vehicle)
    if not DoesEntityExist(vehicle) or NetworkGetNetworkIdFromEntity(vehicle) ~= netId then return nil end
    if proof then proof.netId = netId end
    receivers.proofs[vehicle] = { netId = netId, plate = plate, model = model, vehicleId = vehicleId,
        checkedAt = GetGameTimer(), proof = proof }
    local bound = proof and ChaseBind(vehicle, proof)
    if not bound and receivers.vehicles[vehicle] then
        Entity(vehicle).state:set('chase_bootleg:receiver', nil, true)
        receivers.vehicles[vehicle] = nil
    end
    return proof
end

function ChaseBootlegReceivers.ChaseInitialize()
    if not receivers.ChaseEnabled() then return end
    assert(config.Devices.portableRange > config.Devices.portableFullVolumeRange and config.Devices.portableFullVolumeRange >= 0, 'Invalid receiver speaker ranges')
    local exteriorRange = config.Devices.vehicleExteriorRange or 18.0
    local exteriorFullRange = config.Devices.vehicleExteriorFullVolumeRange or 2.0
    assert(exteriorRange > exteriorFullRange and exteriorFullRange >= 0, 'Invalid vehicle exterior speaker ranges')
    for _, product in pairs(config.Devices.products) do
        assert(domain.ChaseInteger(product.price, 1, 10000000) and type(product.item) == 'string', 'Invalid receiver product configuration')
    end
    MySQL.query.await([[
        CREATE TABLE IF NOT EXISTS chase_bootleg_receiver_mounts (
            vehicle_key VARCHAR(80) NOT NULL,
            x DOUBLE NOT NULL, y DOUBLE NOT NULL, z DOUBLE NOT NULL,
            rx DOUBLE NOT NULL, ry DOUBLE NOT NULL, rz DOUBLE NOT NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (vehicle_key),
            CONSTRAINT chase_bootleg_mount_receiver FOREIGN KEY (vehicle_key)
                REFERENCES chase_bootleg_receivers (vehicle_key) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ]])
    for _, row in ipairs(MySQL.query.await('SELECT * FROM chase_bootleg_receivers')) do receivers.installations[row.vehicle_key] = row end
    for _, row in ipairs(MySQL.query.await('SELECT vehicle_key, x, y, z, rx, ry, rz FROM chase_bootleg_receiver_mounts')) do
        local installed = receivers.installations[row.vehicle_key]
        if installed then
            local success, mount = pcall(ChaseMount, row)
            if success then installed.mount = mount
            else print(('[chase_bootleg] Receiver mount for %s is outside configured placement limits; using its default position.'):format(row.vehicle_key)) end
        end
    end
    for _, row in ipairs(MySQL.query.await("SELECT * FROM chase_bootleg_device_orders WHERE status <> 'delivered'")) do
        receivers.orders[row.actor .. ':' .. row.device] = row
    end
    adapter.ChaseRegisterUsables()
end

local function ChaseOrderStatus(order, expected, status)
    local changed = MySQL.update.await('UPDATE chase_bootleg_device_orders SET status = ? WHERE order_key = ? AND status = ?',
        { status, order.order_key, expected })
    if changed == 1 then order.status = status return true end
    return false
end

local function ChaseDeliver(identity, order)
    server.ChaseRequireCurrent(identity)
    receivers.ChaseAtShop(identity)
    if order.status ~= 'paid' then server.ChaseReject('delivery_review', 'An earlier receiver delivery needs administrator review. It will not be charged again.') end
    if not adapter.ChaseCanCarry(identity, order.item) then server.ChaseReject('inventory_full', 'Make space in your inventory, then collect your paid receiver here.') end
    if not ChaseOrderStatus(order, 'paid', 'delivery_started') then server.ChaseReject('delivery_review', 'The receiver delivery could not be reserved. Contact an administrator.') end
    if not server.ChaseCurrent(identity) then
        ChaseOrderStatus(order, 'delivery_started', 'paid')
        server.ChaseReject('session_changed', 'Return to the shop with this character to collect the paid receiver.')
    end
    local nearby, locationError = pcall(receivers.ChaseAtShop, identity)
    if not nearby then
        ChaseOrderStatus(order, 'delivery_started', 'paid')
        error(locationError, 0)
    end
    local success, delivered = pcall(adapter.ChaseAdd, identity, order.item)
    if not success then server.ChaseReject('delivery_review', 'The receiver delivery needs administrator review. Do not repeat the purchase.') end
    if not delivered then
        ChaseOrderStatus(order, 'delivery_started', 'paid')
        server.ChaseReject('inventory_full', 'The paid receiver could not enter your inventory. Make space, then collect it here.')
    end
    if not ChaseOrderStatus(order, 'delivery_started', 'delivered') then
        server.ChaseReject('delivery_review', 'Receiver delivered; its receipt needs administrator review. Do not repeat the purchase.')
    end
    receivers.orders[identity.identifier .. ':' .. order.device] = nil
end

function ChaseBootlegReceivers.ChaseBuy(identity, data)
    if not receivers.ChaseEnabled() or not config.Devices.shopEnabled then server.ChaseReject('shop_unavailable', 'The receiver shop is closed.') end
    local product = ChaseProduct(data.device)
    receivers.ChaseAtShop(identity)
    local pending = receivers.orders[identity.identifier .. ':' .. data.device]
    if pending then return ChaseDeliver(identity, pending) end
    if ChaseBootlegShop and ChaseBootlegShop.ChaseNativeAvailable() then
        server.ChaseReject('native_shop_required', 'Buy receivers from the vendor inventory shop.')
    end
    if not adapter.ChaseCanCarry(identity, product.item) then server.ChaseReject('inventory_full', 'Make room in your inventory before buying a receiver.') end
    nextOrder = nextOrder + 1
    local orderKey = ('%s:%s:%s:%s'):format(os.time(), GetGameTimer(), nextOrder, math.random(100000, 999999))
    local success, code, message = ChaseBootlegMoney.ChaseDebit(identity, nil, product.price, 'device_' .. data.device, {
        { query = 'INSERT INTO chase_bootleg_device_orders (order_key, actor, device, item) VALUES (?, ?, ?, ?)',
            values = { orderKey, identity.identifier, data.device, product.item } }
    }, function(current) return pcall(receivers.ChaseAtShop, current) end,
        { code = 'shop_required', message = 'Stay beside the Signalworks vendor while your purchase is processed.' })
    if not success then server.ChaseReject(code, message) end
    local order = { order_key = orderKey, actor = identity.identifier, device = data.device, item = product.item, status = 'paid' }
    receivers.orders[identity.identifier .. ':' .. data.device] = order
    ChaseDeliver(identity, order)
end

function ChaseBootlegReceivers.ChaseInstall(identity, data)
    if not receivers.ChaseEnabled() then server.ChaseReject('devices_unavailable', 'Receivers are unavailable.') end
    local vehicle = ChaseCurrentVehicle(identity, true)
    if not domain.ChaseInteger(data.netId, 1, 2147483647) or NetworkGetNetworkIdFromEntity(vehicle) ~= data.netId then
        server.ChaseReject('invalid_vehicle', 'Install the receiver in the vehicle you are driving.')
    end
    if GetEntitySpeed(vehicle) > config.Devices.installMaximumSpeed then server.ChaseReject('park_required', 'Park the vehicle before installing its receiver.') end
    local proof = receivers.ChaseProof(vehicle, true)
    server.ChaseRequireCurrent(identity)
    if not proof then server.ChaseReject('vehicle_record_required', 'The vehicle could not be matched to its garage record. Save it with the admin car command, then reopen placement.') end
    if ChaseMountOwnerRequired() and proof.owner ~= identity.identifier then server.ChaseReject('vehicle_owner_required', 'This server requires the garage owner to install a receiver.') end
    local key = 'receiver:' .. proof.key
    if server.locks[key] then server.ChaseReject('busy', 'This receiver is already being installed.') end
    local lock = {}
    server.locks[key] = lock
    local success, failure = pcall(function()
        if receivers.installations[proof.key] then
            server.ChaseReject(receivers.installations[proof.key].status == 'active' and 'receiver_installed' or 'installation_review', 'This vehicle already has an installed or pending receiver.')
        end
        local mount = ChaseMount(data.mount)
        local product = ChaseProduct('vehicle')
        if ChaseCount(identity, product.item) < 1 then server.ChaseReject('device_required', 'You need a Dash Receiver in your inventory.') end
        ChaseRequireMountAccess(identity, vehicle, proof)
        MySQL.insert.await([[
            INSERT INTO chase_bootleg_receivers (vehicle_key, framework, plate, model, installer)
            VALUES (?, ?, ?, ?, ?)
        ]], { proof.key, proof.framework, proof.plate, proof.model, identity.identifier })
        local row = { vehicle_key = proof.key, framework = proof.framework, plate = proof.plate, model = proof.model, installer = identity.identifier, status = 'prepared' }
        receivers.installations[proof.key] = row
        ChaseRequireMountVehicle(identity, vehicle, proof)
        ChaseSaveMount(proof.key, mount)
        row.mount = mount
        ChaseRequireMountVehicle(identity, vehicle, proof)
        if MySQL.update.await("UPDATE chase_bootleg_receivers SET status = 'consume_started' WHERE vehicle_key = ? AND status = 'prepared'", { proof.key }) ~= 1 then
            server.ChaseReject('installation_review', 'The receiver installation could not be reserved. Contact an administrator.')
        end
        row.status = 'consume_started'
        ChaseRequireMountAccess(identity, vehicle, proof)
        local removed, consumed = pcall(adapter.ChaseRemove, identity, product.item)
        if not removed then server.ChaseReject('installation_review', 'Receiver consumption needs administrator review. Do not install another unit.') end
        if not consumed then
            if MySQL.update.await("DELETE FROM chase_bootleg_receivers WHERE vehicle_key = ? AND status = 'consume_started'", { proof.key }) == 1 then
                receivers.installations[proof.key] = nil
            end
            server.ChaseReject('device_required', 'The receiver could not be removed from your inventory.')
        end
        ChaseRequireMountAccess(identity, vehicle, proof)
        if MySQL.update.await("UPDATE chase_bootleg_receivers SET status = 'active' WHERE vehicle_key = ? AND status = 'consume_started'", { proof.key }) ~= 1 then
            server.ChaseReject('installation_review', 'The consumed receiver needs administrator review before activation.')
        end
        row.status = 'active'
        ChaseBind(vehicle, proof)
        if server.ChaseCurrent(identity) and pcall(ChaseRequireMountVehicle, identity, vehicle, proof) then
            receivers.players[identity.source] = { identity = identity, device = 'vehicle', carry = 'hand' }
            ChasePlayerState(identity.source)
        end
    end)
    if server.locks[key] == lock then server.locks[key] = nil end
    if not success then error(failure, 0) end
end

function ChaseBootlegReceivers.ChaseMove(identity, data)
    if not receivers.ChaseEnabled() then server.ChaseReject('devices_unavailable', 'Receivers are unavailable.') end
    local vehicle = ChaseCurrentVehicle(identity, true)
    if not domain.ChaseInteger(data.netId, 1, 2147483647) or NetworkGetNetworkIdFromEntity(vehicle) ~= data.netId then
        server.ChaseReject('invalid_vehicle', 'Position the receiver in the vehicle you are driving.')
    end
    local proof = receivers.ChaseProof(vehicle, true)
    server.ChaseRequireCurrent(identity)
    if not proof then server.ChaseReject('vehicle_record_required', 'The installed receiver could not be matched to this vehicle record. Reopen placement after retrieving the saved vehicle.') end
    if ChaseMountOwnerRequired() and proof.owner ~= identity.identifier then server.ChaseReject('vehicle_owner_required', 'This server requires the garage owner to reposition a receiver.') end
    ChaseRequireMountVehicle(identity, vehicle, proof)
    local mount = ChaseMount(data.mount)
    local key, lock = 'receiver:' .. proof.key, {}
    if server.locks[key] then server.ChaseReject('busy', 'Another occupant is adjusting this receiver. Try again in a moment.') end
    server.locks[key] = lock
    local installed = receivers.installations[proof.key]
    local previous = installed and installed.mount
    local attempted = false
    local success, failure = pcall(function()
        if not installed or installed.status ~= 'active' or tonumber(installed.model) ~= proof.model then
            server.ChaseReject('receiver_required', 'Install a Dash Receiver before positioning it.')
        end
        if installed.mountReview then server.ChaseReject('mount_review', 'The previous receiver position needs administrator review. Contact an administrator.') end
        ChaseRequireMountAccess(identity, vehicle, proof)
        if not ChaseBind(vehicle, proof) then server.ChaseReject('receiver_required', 'This vehicle is not bound to an installed Dash Receiver.') end
        attempted = true
        ChaseSaveMount(proof.key, mount)
        ChaseRequireMountAccess(identity, vehicle, proof)
        local receiver = ChaseBind(vehicle, proof)
        if not receiver then server.ChaseReject('receiver_required', 'This vehicle is no longer bound to the installed Dash Receiver.') end
        installed.mount = mount
        ChaseVehicleState(receiver)
    end)
    if not success and attempted then
        installed.mount = previous
        local restored = pcall(function()
            if previous then ChaseSaveMount(proof.key, previous)
            else MySQL.update.await('DELETE FROM chase_bootleg_receiver_mounts WHERE vehicle_key = ?', { proof.key }) end
        end)
        if not restored then
            installed.mountReview = true
            print(('[chase_bootleg] Receiver mount rollback needs review for %s.'):format(proof.key))
            failure = { code = 'mount_review', message = 'The receiver position could not be confirmed. Contact an administrator before moving it again.' }
        end
        local receiver = receivers.vehicles[vehicle]
        if receiver and receiver.key == proof.key then
            receiver.stateSignature = nil
            pcall(ChaseVehicleState, receiver)
        end
    end
    if server.locks[key] == lock then server.locks[key] = nil end
    if not success then error(failure, 0) end
end

function ChaseBootlegReceivers.ChaseEquip(identity, data)
    if not receivers.ChaseEnabled() then server.ChaseReject('devices_unavailable', 'Receivers are unavailable.') end
    local device = data.device
    if device == 'none' then receivers.ChaseDropSource(identity.source) return end
    local product = ChaseProduct(device)
    local previous = receivers.players[identity.source]
    local stationId = previous and previous.device == device and previous.stationId or nil
    if device == 'vehicle' then
        local vehicle = ChaseCurrentVehicle(identity, false)
        receivers.ChaseProof(vehicle)
        server.ChaseRequireCurrent(identity)
        if not receivers.vehicles[vehicle] then server.ChaseReject('receiver_required', 'This vehicle needs an installed Dash Receiver.') end
        stationId = receivers.vehicles[vehicle].stationId
    elseif ChaseCount(identity, product.item) < 1 then
        server.ChaseReject('device_required', 'You need this receiver in your inventory before equipping it.')
    end
    local carry = data.carry or (previous and previous.carry) or 'hand'
    if carry ~= 'hand' and carry ~= 'shoulder' then server.ChaseReject('invalid_carry', 'Choose hand or shoulder carry.') end
    receivers.players[identity.source] = { identity = identity, device = device, carry = carry, stationId = stationId }
    server.tuned[identity.source] = stationId
    ChasePlayerState(identity.source)
end

function ChaseBootlegReceivers.ChaseTune(identity, stationId)
    if not receivers.ChaseEnabled() then return end
    local state = receivers.players[identity.source]
    if not state then
        if not config.Devices.requireDevices then return end
        server.ChaseReject('device_required', 'Equip a Field Radio or Signalbuds, or select an installed Dash Receiver.')
    end
    if state.device == 'vehicle' then
        local vehicle = ChaseCurrentVehicle(identity, false)
        receivers.ChaseProof(vehicle)
        server.ChaseRequireCurrent(identity)
        local receiver = receivers.vehicles[vehicle]
        if not receiver then server.ChaseReject('receiver_required', 'This vehicle needs an installed Dash Receiver.') end
        if ChaseCurrentVehicle(identity, false) ~= vehicle then server.ChaseReject('vehicle_changed', 'Stay inside the receiver vehicle while tuning.') end
        local key, token = 'receiver:' .. receiver.key, {}
        if server.locks[key] then server.ChaseReject('busy', 'Another occupant is adjusting this receiver. Try again in a moment.') end
        server.locks[key] = token
        local success, failure = pcall(function()
            if stationId then
                MySQL.update.await('UPDATE chase_bootleg_receivers SET station_id = ? WHERE vehicle_key = ? AND status = ?',
                    { stationId, receiver.key, 'active' })
            else
                MySQL.update.await("UPDATE chase_bootleg_receivers SET station_id = NULL WHERE vehicle_key = ? AND status = 'active'", { receiver.key })
            end
            receiver.stationId = stationId
            receivers.installations[receiver.key].station_id = stationId
            ChaseVehicleState(receiver)
            server.ChaseRequireCurrent(identity)
            if ChaseCurrentVehicle(identity, false) ~= vehicle then server.ChaseReject('vehicle_changed', 'Stay inside the receiver vehicle while tuning.') end
        end)
        if server.locks[key] == token then server.locks[key] = nil end
        if not success then error(failure, 0) end
    elseif ChaseCount(identity, ChaseProduct(state.device).item) < 1 then
        receivers.ChaseDropSource(identity.source)
        server.ChaseReject('device_required', 'Your equipped receiver is no longer in your inventory.')
    end
    state.stationId = stationId
    ChasePlayerState(identity.source)
end

function ChaseBootlegReceivers.ChaseDropSource(playerSource)
    receivers.players[playerSource] = nil
    server.tuned[playerSource] = nil
    if GetPlayerName(playerSource) then Player(playerSource).state:set('chase_bootleg:receiver', nil, true) end
end

function ChaseBootlegReceivers.ChaseDiscover()
    if not receivers.ChaseEnabled() then return end
    local plates = {}
    for _, installed in pairs(receivers.installations) do
        if installed.status == 'active' then plates[installed.plate] = true end
    end
    for _, vehicle in ipairs(GetAllVehicles()) do
        local plate = adapter.ChasePlate(GetVehicleNumberPlateText(vehicle))
        local candidateId = Entity(vehicle).state.vehicleid
        if plates[plate] or candidateId and receivers.installations['qb:' .. tostring(candidateId)] then
            local success, proof = pcall(receivers.ChaseProof, vehicle)
            if (not success or not proof) and receivers.vehicles[vehicle] then
                Entity(vehicle).state:set('chase_bootleg:receiver', nil, true)
                receivers.vehicles[vehicle] = nil
            end
        end
    end
    for vehicle, receiver in pairs(receivers.vehicles) do
        if not DoesEntityExist(vehicle) or NetworkGetNetworkIdFromEntity(vehicle) ~= receiver.netId
            or adapter.ChasePlate(GetVehicleNumberPlateText(vehicle)) ~= receiver.plate or GetEntityModel(vehicle) ~= receiver.model then
            if DoesEntityExist(vehicle) then Entity(vehicle).state:set('chase_bootleg:receiver', nil, true) end
            receivers.vehicles[vehicle] = nil
            receivers.proofs[vehicle] = nil
        end
    end
    for vehicle in pairs(receivers.proofs) do
        if not DoesEntityExist(vehicle) then receivers.proofs[vehicle] = nil end
    end
end

local function ChaseSignal(stationId, position, bucket)
    local station = server.stations[stationId]
    local transmitter = station and server.ChaseVehicle(station)
    if not transmitter then return nil end
    local receives, quality = domain.ChaseCanReceive(station, position, bucket, GetEntityCoords(transmitter))
    if receives then return station, quality end
end

local function ChaseCandidate(stationId, position, bucket, device, gain, emitterSource, vehicleNetId, emitterNetId)
    local station, quality = ChaseSignal(stationId, position, bucket)
    if not station or gain <= 0 then return nil end
    return { station = station, quality = quality, gain = gain, device = device, emitterSource = emitterSource,
        vehicleNetId = vehicleNetId, emitterNetId = emitterNetId,
        emitterPosition = { x = position.x, y = position.y, z = position.z } }
end

local function ChasePlacedExists(placed)
    return DoesEntityExist(placed.entity) and NetworkGetNetworkIdFromEntity(placed.entity) == placed.netId
        and GetEntityModel(placed.entity) == joaat(config.ReceiverVisuals.models.portable)
end

local function ChasePlacedPosition(placed)
    return ChasePlacedExists(placed) and GetEntityCoords(placed.entity) or placed.position
end

local function ChasePlacedState(placed)
    if not ChasePlacedExists(placed) then return end
    local station = server.stations[placed.stationId]
    local signal, quality = ChaseSignal(placed.stationId, GetEntityCoords(placed.entity), placed.bucket)
    quality = signal and domain.ChaseRound(quality, 0.05) or 0.0
    local label = station and station.name or 'No station selected'
    local signature = ('%s:%s:%s:%s'):format(placed.stationId or 0, station and station.frequency or 0, label, quality)
    if placed.stateSignature == signature then return end
    placed.stateSignature, placed.quality = signature, quality
    Entity(placed.entity).state:set('chase_bootleg:placed', {
        netId = placed.netId, stationId = placed.stationId, frequency = station and station.frequency,
        label = label, enabled = placed.stationId ~= nil, ownerName = placed.ownerName, quality = quality
    }, true)
end

local function ChaseRemovePlaced(placed)
    if ChasePlacedExists(placed) then DeleteEntity(placed.entity) end
    receivers.placed[placed.netId] = nil
end

local function ChasePlacedCount(identifier)
    local count = 0
    for _, placed in pairs(receivers.placed) do
        if placed.owner == identifier then count = count + 1 end
    end
    return count
end

function ChaseBootlegReceivers.ChasePlaced(identity, netId)
    local placed = domain.ChaseInteger(netId, 1, 2147483647) and receivers.placed[netId] or nil
    if not placed or not ChasePlacedExists(placed) then server.ChaseReject('radio_unavailable', 'That field radio is no longer there.') end
    if placed.pickupState then
        server.ChaseReject(placed.pickupState == 'review' and 'pickup_review' or 'busy',
            placed.pickupState == 'review' and 'This field radio pickup needs administrator review.' or 'Someone is picking up this field radio.')
    end
    local position, bucket = server.ChasePosition(identity)
    if bucket ~= placed.bucket or GetEntityRoutingBucket(placed.entity) ~= placed.bucket
        or domain.ChaseDistance(position, ChasePlacedPosition(placed)) > config.PlacedRadio.interactDistance then
        server.ChaseReject('radio_too_far', 'Stand beside the field radio to use it.')
    end
    return placed
end

local function ChasePlacementPosition(identity, ped, position, bucket)
    local currentPosition, currentBucket = server.ChasePosition(identity)
    if GetPlayerPed(identity.source) ~= ped or currentBucket ~= bucket or GetVehiclePedIsIn(ped, false) ~= 0
        or domain.ChaseDistance(currentPosition, position) > config.PlacedRadio.interactDistance then
        server.ChaseReject('placement_moved', 'Stay beside the placement spot until the field radio is on the floor.')
    end
end

local function ChasePlacementReview(identity, reason)
    receivers.placementReviews[identity.identifier] = { at = os.time(), reason = reason }
    print(('[chase_bootleg] Field radio placement review for %s: %s'):format(identity.identifier, reason))
end

function ChaseBootlegReceivers.ChasePlacedTune(identity, netId, station)
    local placed = receivers.ChasePlaced(identity, netId)
    if station and not ChaseSignal(station.id, ChasePlacedPosition(placed), placed.bucket) then
        server.ChaseReject('no_signal', 'That station is outside the field radio reception area.')
    end
    placed.stationId = station and station.id or nil
    ChasePlacedState(placed)
end

function ChaseBootlegReceivers.ChasePlace(identity, data)
    local settings = config.PlacedRadio
    if not receivers.ChaseEnabled() or settings.enabled ~= true then server.ChaseReject('placement_unavailable', 'Field radios cannot be placed on this server.') end
    local position, bucket = server.ChasePosition(identity)
    local ped = GetPlayerPed(identity.source)
    if GetVehiclePedIsIn(ped, false) ~= 0 then server.ChaseReject('exit_vehicle', 'Step out of the vehicle to place the field radio.') end
    local placement = type(data) == 'table' and data.placement or nil
    if placement ~= nil then
        if type(placement) ~= 'table' then server.ChaseReject('placement_invalid', 'The radio placement is invalid.') end
        for _, field in ipairs({ 'x', 'y', 'z', 'heading' }) do
            local value = placement[field]
            if type(value) ~= 'number' or value ~= value or value == math.huge or value == -math.huge then
                server.ChaseReject('placement_invalid', 'The radio placement is invalid.')
            end
        end
        if domain.ChaseDistance(position, placement) > 1.5 or placement.z > position.z + 0.25
            or placement.z < position.z - 1.5 then
            server.ChaseReject('placement_invalid', 'Place the Field Radio on the ground beside you.')
        end
    end
    if ChasePlacedCount(identity.identifier) >= settings.maximumPerPlayer then server.ChaseReject('placement_limit', 'Pick up your other field radio before placing another.') end
    local product = ChaseProduct('portable')
    if receivers.placementReviews[identity.identifier] then
        server.ChaseReject('placement_review', 'An earlier field radio placement needs administrator review before placing another.')
    end
    if ChaseCount(identity, product.item) < 1 then server.ChaseReject('device_required', 'You need a Field Radio in your inventory to place one.') end
    local key = 'placement:' .. identity.identifier
    if server.locks[key] then server.ChaseReject('busy', 'Your field radio is already being placed.') end
    local lock = {}
    server.locks[key] = lock
    local entity, committed, consumed
    local success, failure = pcall(function()
        local state = receivers.players[identity.source]
        local stationId = state and state.device == 'portable' and state.stationId or nil
        local heading = GetEntityHeading(ped)
        local x, y, z = position.x - math.sin(math.rad(heading)) * 0.6, position.y + math.cos(math.rad(heading)) * 0.6, position.z
        if placement then x, y, z, heading = placement.x, placement.y, placement.z, placement.heading % 360.0 end
        entity = CreateObjectNoOffset(joaat(config.ReceiverVisuals.models.portable), x + 0.0, y + 0.0, z + 0.0, true, true, false)
        local startedAt = GetGameTimer()
        while entity ~= 0 and not DoesEntityExist(entity) and domain.ChaseElapsed(GetGameTimer(), startedAt) < 5000 do Wait(50) end
        if entity == 0 or not DoesEntityExist(entity) then
            server.ChaseReject('placement_failed', 'The field radio could not be placed here. It is still in your inventory.')
        end
        SetEntityRoutingBucket(entity, bucket)
        SetEntityOrphanMode(entity, 2)
        SetEntityHeading(entity, heading)
        local netId = NetworkGetNetworkIdFromEntity(entity)
        if not domain.ChaseInteger(netId, 1, 2147483647) then
            server.ChaseReject('placement_failed', 'The field radio could not be networked. It is still in your inventory.')
        end
        ChasePlacementPosition(identity, ped, position, bucket)
        local removed, result = pcall(adapter.ChaseRemove, identity, product.item)
        if not removed then
            ChasePlacementReview(identity, 'Inventory consumption returned an uncertain result.')
            server.ChaseReject('placement_review', 'The field radio consumption needs administrator review. Do not place another unit.')
        end
        if not result then server.ChaseReject('device_required', 'The field radio could not be removed from your inventory.') end
        consumed = true
        ChasePlacementPosition(identity, ped, position, bucket)
        if not DoesEntityExist(entity) or NetworkGetNetworkIdFromEntity(entity) ~= netId
            or GetEntityModel(entity) ~= joaat(config.ReceiverVisuals.models.portable) or GetEntityRoutingBucket(entity) ~= bucket then
            server.ChaseReject('placement_failed', 'The field radio disappeared while being placed.')
        end
        receivers.placed[netId] = { netId = netId, entity = entity, owner = identity.identifier, ownerName = identity.name, stationId = stationId,
            bucket = bucket, placedAt = os.time(), position = { x = x, y = y, z = z } }
        committed = true
        if state and state.device == 'portable' and receivers.players[identity.source] == state then receivers.ChaseDropSource(identity.source) end
        ChasePlacedState(receivers.placed[netId])
    end)
    if not committed then
        if entity and entity ~= 0 and DoesEntityExist(entity) then DeleteEntity(entity) end
        if consumed then
            local returned, added = false, false
            if server.ChaseCurrent(identity) then returned, added = pcall(adapter.ChaseAdd, identity, product.item) end
            if not returned or not added then ChasePlacementReview(identity, 'Interrupted placement could not confirm inventory return.') end
        end
    end
    if server.locks[key] == lock then server.locks[key] = nil end
    if not success then error(failure, 0) end
end

function ChaseBootlegReceivers.ChasePickup(identity, data)
    local placed = receivers.ChasePlaced(identity, data.netId)
    local product = ChaseProduct('portable')
    if GetVehiclePedIsIn(GetPlayerPed(identity.source), false) ~= 0 then server.ChaseReject('exit_vehicle', 'Step out of the vehicle to pick up the field radio.') end
    if not adapter.ChaseCanCarry(identity, product.item) then server.ChaseReject('inventory_full', 'Make space in your inventory before picking up the field radio.') end
    if receivers.ChasePlaced(identity, data.netId) ~= placed then server.ChaseReject('radio_unavailable', 'That field radio is no longer there.') end
    if GetVehiclePedIsIn(GetPlayerPed(identity.source), false) ~= 0 then server.ChaseReject('exit_vehicle', 'Step out of the vehicle to pick up the field radio.') end
    placed.pickupState = 'pending'
    local success, added = pcall(adapter.ChaseAdd, identity, product.item)
    if not success then
        placed.pickupState = 'review'
        print(('[chase_bootleg] Field radio pickup review for %s, object %s'):format(identity.identifier, placed.netId))
        server.ChaseReject('pickup_review', 'The field radio pickup needs administrator review. Contact an administrator.')
    end
    if not added then
        placed.pickupState = nil
        server.ChaseReject('inventory_full', 'The field radio could not enter your inventory. Make space, then try again.')
    end
    local stationId = placed.stationId
    ChaseRemovePlaced(placed)
    if data.equip ~= false and server.ChaseCurrent(identity) and ChaseBootlegFramework.ChaseIsAlive(identity)
        and GetVehiclePedIsIn(GetPlayerPed(identity.source), false) == 0 then
        receivers.players[identity.source] = { identity = identity, device = 'portable', carry = 'hand', stationId = stationId }
        server.tuned[identity.source] = stationId
        ChasePlayerState(identity.source)
    end
end

function ChaseBootlegReceivers.ChaseStopPlaced()
    for _, placed in pairs(receivers.placed) do ChaseRemovePlaced(placed) end
end

local function ChaseSpeakerGain(distance, range, fullRange)
    local progress = domain.ChaseClamp((distance - fullRange) / (range - fullRange), 0.0, 1.0)
    return 1.0 - progress * progress * (3.0 - 2.0 * progress)
end

function ChaseBootlegReceivers.ChaseAudience()
    local listeners, speakers, audience = {}, {}, {}
    for vehicle, receiver in pairs(receivers.vehicles) do
        if DoesEntityExist(vehicle) and NetworkGetNetworkIdFromEntity(vehicle) == receiver.netId
            and adapter.ChasePlate(GetVehicleNumberPlateText(vehicle)) == receiver.plate and GetEntityModel(vehicle) == receiver.model then
            ChaseVehicleState(receiver)
            local position, bucket = GetEntityCoords(vehicle), GetEntityRoutingBucket(vehicle)
            local candidate = ChaseCandidate(receiver.stationId, position, bucket, 'vehicle', 1.0, nil, receiver.netId)
            if candidate then
                speakers[#speakers + 1] = { position = position, bucket = bucket, candidate = candidate,
                    range = config.Devices.vehicleExteriorRange or 18.0, fullRange = config.Devices.vehicleExteriorFullVolumeRange or 2.0 }
            end
        end
    end
    for netId, placed in pairs(receivers.placed) do
        if not ChasePlacedExists(placed) then
            receivers.placed[netId] = nil
        elseif placed.pickupState then
            placed.quality = 0.0
        elseif GetEntityRoutingBucket(placed.entity) ~= placed.bucket then
            ChaseRemovePlaced(placed)
        elseif os.time() - placed.placedAt > config.PlacedRadio.expireMinutes * 60 then
            ChaseRemovePlaced(placed)
        else
            ChasePlacedState(placed)
            local candidate = placed.stationId and ChaseCandidate(placed.stationId, GetEntityCoords(placed.entity), placed.bucket, 'portable', 1.0, nil, nil, netId)
            if candidate then speakers[#speakers + 1] = { position = GetEntityCoords(placed.entity), bucket = placed.bucket, candidate = candidate,
                range = config.Devices.portableRange, fullRange = config.Devices.portableFullVolumeRange } end
        end
    end
    for _, sourceValue in ipairs(GetPlayers()) do
        local playerSource = tonumber(sourceValue)
        local success, identity = pcall(server.ChaseSession, playerSource)
        if success and ChaseBootlegFramework.ChaseIsAlive(identity) then
            local ped = GetPlayerPed(playerSource)
            local listener = { identity = identity, position = GetEntityCoords(ped), bucket = GetPlayerRoutingBucket(playerSource), vehicle = GetVehiclePedIsIn(ped, false) }
            listeners[playerSource] = listener
            local state = receivers.players[playerSource]
            if state and (state.identity ~= identity or state.device ~= 'vehicle' and ChaseCount(identity, ChaseProduct(state.device).item) < 1) then
                receivers.ChaseDropSource(playerSource)
                TriggerClientEvent('chase_bootleg:client:refresh', playerSource)
                state = nil
            end
            listener.device = state
            if state and state.device == 'portable' and state.stationId then
                local vehicleNetId = listener.vehicle ~= 0 and DoesEntityExist(listener.vehicle) and NetworkGetNetworkIdFromEntity(listener.vehicle) or nil
                local candidate = ChaseCandidate(state.stationId, listener.position, listener.bucket, 'portable', 1.0, playerSource, vehicleNetId)
                if candidate then speakers[#speakers + 1] = { source = playerSource, position = listener.position, bucket = listener.bucket, candidate = candidate,
                    range = config.Devices.portableRange, fullRange = config.Devices.portableFullVolumeRange } end
            end
        elseif receivers.players[playerSource] then
            receivers.ChaseDropSource(playerSource)
        end
    end
    for playerSource, listener in pairs(listeners) do
        local state = listener.device
        local selected
        if state and state.device == 'buds' then
            selected = ChaseCandidate(state.stationId, listener.position, listener.bucket, 'buds', 1.0)
        else
            local vehicle = listener.vehicle
            local receiver = receivers.vehicles[vehicle]
            if receiver and DoesEntityExist(vehicle) and NetworkGetNetworkIdFromEntity(vehicle) == receiver.netId
                and adapter.ChasePlate(GetVehicleNumberPlateText(vehicle)) == receiver.plate and GetEntityModel(vehicle) == receiver.model
                and GetEntityRoutingBucket(vehicle) == listener.bucket then
                selected = ChaseCandidate(receiver.stationId, GetEntityCoords(vehicle), listener.bucket, 'vehicle', 1.0, nil, receiver.netId)
            end
            if not selected and state and state.device == 'portable' then
                local vehicleNetId = vehicle ~= 0 and DoesEntityExist(vehicle) and NetworkGetNetworkIdFromEntity(vehicle) or nil
                selected = ChaseCandidate(state.stationId, listener.position, listener.bucket, 'portable', 1.0, playerSource, vehicleNetId)
            end
            if not selected and not config.Devices.requireDevices and server.tuned[playerSource] then
                selected = ChaseCandidate(server.tuned[playerSource], listener.position, listener.bucket, 'direct', 1.0)
            end
            if not selected then
                local loudest, nearest = 0.0, math.huge
                for _, speaker in ipairs(speakers) do
                    if speaker.source ~= playerSource and speaker.bucket == listener.bucket then
                        local distance = domain.ChaseDistance(listener.position, speaker.position)
                        local gain = ChaseSpeakerGain(distance, speaker.range, speaker.fullRange)
                        if gain > loudest or gain > 0.0 and gain == loudest and distance < nearest then
                            loudest, nearest = gain, distance
                            selected = { station = speaker.candidate.station, quality = speaker.candidate.quality, gain = gain,
                                device = speaker.candidate.device, emitterSource = speaker.source, emitterNetId = speaker.candidate.emitterNetId,
                                vehicleNetId = speaker.candidate.vehicleNetId, emitterPosition = speaker.candidate.emitterPosition }
                        end
                    end
                end
            end
        end
        if selected and not server.ChaseOnMicrophone(playerSource) then audience[playerSource] = selected end
    end
    return audience
end

function ChaseBootlegReceivers.ChaseSnapshot(identity)
    if not receivers.ChaseEnabled() then return nil end
    local owned, shop = {}, {}
    for _, device in ipairs({ 'vehicle', 'portable', 'buds' }) do
        local product = ChaseProduct(device)
        owned[device] = ChaseCount(identity, product.item)
        local pending = receivers.orders[identity.identifier .. ':' .. device]
        shop[#shop + 1] = { device = device, item = product.item, label = product.label, price = product.price,
            pending = pending and pending.status == 'paid' or false }
    end
    local vehicleView = { installed = false, canInstall = false, canControl = false, canMove = false,
        positionError = 'Sit in the driver seat of a parked vehicle to position the receiver.' }
    if ChaseBootlegFramework.ChaseIsAlive(identity) then
        local ped = GetPlayerPed(identity.source)
        local vehicle = GetVehiclePedIsIn(ped, false)
        if vehicle ~= 0 and DoesEntityExist(vehicle) then
            vehicleView.netId = NetworkGetNetworkIdFromEntity(vehicle)
            local success, proof = pcall(receivers.ChaseProof, vehicle)
            server.ChaseRequireCurrent(identity)
            vehicleView.positionError = 'The vehicle could not be matched to its garage record. Save it with the admin car command, then reopen placement.'
            if success and proof and DoesEntityExist(vehicle) and GetVehiclePedIsIn(GetPlayerPed(identity.source), false) == vehicle
                and NetworkGetNetworkIdFromEntity(vehicle) == proof.netId and GetEntityModel(vehicle) == proof.model
                and adapter.ChasePlate(GetVehicleNumberPlateText(vehicle)) == proof.plate
                and GetEntityRoutingBucket(vehicle) == GetPlayerRoutingBucket(identity.source) then
                local installed = receivers.installations[proof.key]
                local receiver = receivers.vehicles[vehicle]
                vehicleView.installed = installed and installed.status == 'active' and tonumber(installed.model) == proof.model
                    and receiver ~= nil and receiver.key == proof.key and receiver.netId == proof.netId or false
                vehicleView.canControl = vehicleView.installed
                local positionError
                if GetPedInVehicleSeat(vehicle, -1) ~= GetPlayerPed(identity.source) then
                    positionError = 'Sit in the driver seat to position the receiver.'
                elseif GetEntitySpeed(vehicle) > config.Devices.installMaximumSpeed then
                    positionError = 'Park the vehicle before positioning its receiver.'
                elseif ChaseMountOwnerRequired() and proof.owner ~= identity.identifier then
                    positionError = 'This server requires the garage owner to position the receiver.'
                elseif installed and installed.status ~= 'active' then
                    positionError = 'A previous receiver installation needs administrator review before another can be installed.'
                elseif installed and installed.mountReview then
                    positionError = 'The previous receiver position needs administrator review.'
                end
                vehicleView.positionError = positionError
                local canPosition = positionError == nil
                vehicleView.canInstall = not installed and canPosition
                vehicleView.canMove = vehicleView.installed and canPosition and not installed.mountReview
                vehicleView.mount = vehicleView.installed and installed.mount or nil
            end
        end
    end
    local state = receivers.players[identity.source]
    local canShop = config.Devices.shopEnabled and pcall(receivers.ChaseAtShop, identity)
    local settings, nearby, canPlace = config.PlacedRadio, {}, false
    if ChaseBootlegFramework.ChaseIsAlive(identity) then
        local ped = GetPlayerPed(identity.source)
        local position, bucket = GetEntityCoords(ped), GetPlayerRoutingBucket(identity.source)
        for _, placed in pairs(receivers.placed) do
            if not placed.pickupState and ChasePlacedExists(placed) and placed.bucket == bucket
                and GetEntityRoutingBucket(placed.entity) == bucket
                and domain.ChaseDistance(position, ChasePlacedPosition(placed)) <= settings.interactDistance then
                local station = server.stations[placed.stationId]
                nearby[#nearby + 1] = { netId = placed.netId, stationId = placed.stationId, frequency = station and station.frequency,
                    label = station and station.name or 'No station selected', ownerName = placed.ownerName, quality = placed.quality or 0.0 }
            end
        end
        table.sort(nearby, function(first, second) return first.netId < second.netId end)
        canPlace = settings.enabled == true and (owned.portable > 0 or state ~= nil and state.device == 'portable')
            and GetVehiclePedIsIn(ped, false) == 0 and ChasePlacedCount(identity.identifier) < settings.maximumPerPlayer
    end
    return { active = state and state.device or 'none', carry = state and state.carry or 'hand', owned = owned, shop = shop,
        vehicle = vehicleView, canShop = canShop == true, tunedStationId = state and state.stationId,
        placedNearby = nearby, canPlace = canPlace }
end

function ChaseBootlegReceivers.ChaseStop()
    for playerSource in pairs(receivers.players) do receivers.ChaseDropSource(playerSource) end
    for vehicle in pairs(receivers.vehicles) do
        if DoesEntityExist(vehicle) then Entity(vehicle).state:set('chase_bootleg:receiver', nil, true) end
    end
    receivers.vehicles = {}
end

CreateThread(function()
    while true do
        Wait((config.Devices and config.Devices.vehicleDiscoverySeconds or 5) * 1000)
        if server.ready and receivers.ChaseEnabled() then
            local success, failure = pcall(receivers.ChaseDiscover)
            if not success then print(('[chase_bootleg] Receiver discovery failed: %s'):format(tostring(failure))) end
        end
    end
end)
