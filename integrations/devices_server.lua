ChaseBootlegDeviceAdapter = {}

local adapter = ChaseBootlegDeviceAdapter
local framework = ChaseBootlegFramework

local function ChaseConfig()
    return ChaseBootlegConfig.Devices
end

local function ChaseInventory()
    local provider = ChaseConfig().inventory
    if provider ~= 'auto' then return provider end
    if GetResourceState('ox_inventory') == 'started' then return 'ox_inventory' end
    if GetResourceState('qb-inventory') == 'started' then return 'qb-inventory' end
    if framework.ChaseName() == 'esx' then return 'esx' end
    return 'unavailable'
end

function ChaseBootlegDeviceAdapter.ChaseInventory()
    return ChaseInventory()
end

local function ChaseIdentifier(value)
    assert(type(value) == 'string' and value:match('^[%a_][%w_]*$'), 'Invalid configured vehicle database identifier')
    return '`' .. value .. '`'
end

function ChaseBootlegDeviceAdapter.ChasePlate(value)
    if type(value) ~= 'string' then return nil end
    local plate = value:match('^%s*(.-)%s*$'):upper()
    if #plate < 1 or #plate > 16 or plate:find('[%c]') then return nil end
    return plate
end

function ChaseBootlegDeviceAdapter.ChaseCount(identity, item)
    if not framework.ChaseIsCurrent(identity) then return 0 end
    local provider = ChaseInventory()
    if provider == 'ox_inventory' then return exports.ox_inventory:GetItemCount(identity.source, item) or 0 end
    if provider == 'qb-inventory' then
        local count = 0
        for _, entry in pairs(identity.player.PlayerData.items or {}) do
            if entry.name == item then count = count + (tonumber(entry.amount) or 0) end
        end
        return count
    end
    if provider == 'esx' then
        local entry = identity.player.getInventoryItem(item)
        return entry and tonumber(entry.count) or 0
    end
    return 0
end

function ChaseBootlegDeviceAdapter.ChaseCanCarry(identity, item)
    if not framework.ChaseIsCurrent(identity) then return false end
    local provider = ChaseInventory()
    if provider == 'ox_inventory' then return exports.ox_inventory:CanCarryItem(identity.source, item, 1) == true end
    if provider == 'qb-inventory' then return exports['qb-inventory']:CanAddItem(identity.source, item, 1) == true end
    if provider == 'esx' then return identity.player.canCarryItem(item, 1) == true end
    return false
end

function ChaseBootlegDeviceAdapter.ChaseAdd(identity, item)
    if not framework.ChaseIsCurrent(identity) then return false end
    local provider = ChaseInventory()
    if provider == 'ox_inventory' then return exports.ox_inventory:AddItem(identity.source, item, 1) == true end
    if provider == 'qb-inventory' then return exports['qb-inventory']:AddItem(identity.source, item, 1, false, false, 'chase_bootleg:device-purchase') == true end
    if provider == 'esx' then
        local before = adapter.ChaseCount(identity, item)
        if not framework.ChaseIsCurrent(identity) then return false end
        identity.player.addInventoryItem(item, 1)
        if not framework.ChaseIsCurrent(identity) then error('Character changed during ESX device delivery') end
        local after = adapter.ChaseCount(identity, item)
        if after == before then return false end
        if after ~= before + 1 then error('Unable to confirm ESX device delivery') end
        return true
    end
    return false
end

function ChaseBootlegDeviceAdapter.ChaseRemove(identity, item)
    if not framework.ChaseIsCurrent(identity) then return false end
    local provider = ChaseInventory()
    if provider == 'ox_inventory' then return exports.ox_inventory:RemoveItem(identity.source, item, 1) == true end
    if provider == 'qb-inventory' then return exports['qb-inventory']:RemoveItem(identity.source, item, 1, false, 'chase_bootleg:receiver-install') == true end
    if provider == 'esx' then
        local before = adapter.ChaseCount(identity, item)
        if before < 1 or not framework.ChaseIsCurrent(identity) then return false end
        identity.player.removeInventoryItem(item, 1)
        if not framework.ChaseIsCurrent(identity) then error('Character changed during ESX receiver consumption') end
        local after = adapter.ChaseCount(identity, item)
        if after == before then return false end
        if after ~= before - 1 then error('Unable to confirm ESX receiver consumption') end
        return true
    end
    return false
end

local function ChaseVehicleId(value)
    local number = type(value) == 'number' and value or type(value) == 'string' and tonumber(value)
    return number and math.tointeger(number) and number > 0 and number <= 2147483647 and math.tointeger(number) or nil
end

local function ChaseModelHash(value)
    if type(value) == 'string' and tonumber(value) == nil then
        if #value == 0 or #value > 64 or value:find('[%c]') then return nil end
        return joaat(value)
    end
    local number = type(value) == 'number' and value or type(value) == 'string' and tonumber(value)
    return number and math.tointeger(number) and number >= -2147483648 and number <= 4294967295 and math.tointeger(number) or nil
end

local function ChaseQboxVehicle(vehicle, plate, model)
    local stateId = Entity(vehicle).state.vehicleid
    local hintedId = ChaseVehicleId(stateId)
    local function ChaseRead(vehicleId, requirePropertiesPlate)
        local owned = exports.qbx_vehicles:GetPlayerVehicle(vehicleId)
        if type(owned) ~= 'table' or ChaseVehicleId(owned.id) ~= vehicleId
            or (owned.citizenid ~= nil and (type(owned.citizenid) ~= 'string' or owned.citizenid == '')) then return nil end
        local properties = type(owned.props) == 'table' and owned.props or nil
        local propertiesPlate = properties and adapter.ChasePlate(properties.plate)
        if requirePropertiesPlate and not propertiesPlate then return nil end
        if properties and properties.plate ~= nil and propertiesPlate ~= plate then return nil end
        local savedModel
        if properties and properties.model ~= nil then savedModel = ChaseModelHash(properties.model)
        else savedModel = ChaseModelHash(owned.modelName) end
        if not savedModel or (savedModel & 0xffffffff) ~= (model & 0xffffffff) then return nil end
        return { key = 'qb:' .. vehicleId, owner = owned.citizenid and 'qb:' .. owned.citizenid or nil,
            framework = 'qb', plate = plate, model = savedModel }
    end
    local record = hintedId and ChaseRead(hintedId, true) or nil
    if not record then
        local plateId = ChaseVehicleId(exports.qbx_vehicles:GetVehicleIdByPlate(plate))
        if plateId then record = ChaseRead(plateId, false) end
    end
    if not DoesEntityExist(vehicle) or Entity(vehicle).state.vehicleid ~= stateId then return nil end
    return record
end

function ChaseBootlegDeviceAdapter.ChaseVehicle(vehicle)
    if not vehicle or vehicle == 0 or not DoesEntityExist(vehicle) then return nil end
    local plate = adapter.ChasePlate(GetVehicleNumberPlateText(vehicle))
    local model = GetEntityModel(vehicle)
    if not plate then return nil end
    local name = framework.ChaseName()
    local record
    if name == 'qbox' then
        if GetResourceState('qbx_vehicles') ~= 'started' then return nil end
        record = ChaseQboxVehicle(vehicle, plate, model)
    elseif name == 'qbcore' then
        local schema = ChaseConfig().qbVehicles
        local query = ('SELECT %s AS id, %s AS owner, %s AS model FROM %s WHERE %s = ? LIMIT 2'):format(
            ChaseIdentifier(schema.id), ChaseIdentifier(schema.owner), ChaseIdentifier(schema.model), ChaseIdentifier(schema.table), ChaseIdentifier(schema.plate))
        local rows = MySQL.query.await(query, { plate })
        local owned = #rows == 1 and rows[1]
        if not owned or not owned.owner or type(owned.model) ~= 'string' then return nil end
        record = { key = 'qb:' .. owned.id, owner = 'qb:' .. owned.owner, framework = 'qb', plate = plate, model = joaat(owned.model) }
    elseif name == 'esx' then
        local schema = ChaseConfig().esxVehicles
        local query = ('SELECT %s AS owner, %s AS properties FROM %s WHERE %s = ? LIMIT 2'):format(
            ChaseIdentifier(schema.owner), ChaseIdentifier(schema.properties), ChaseIdentifier(schema.table), ChaseIdentifier(schema.plate))
        local rows = MySQL.query.await(query, { plate })
        local owned = #rows == 1 and rows[1]
        if not owned or not owned.owner then return nil end
        local success, properties = pcall(json.decode, owned.properties)
        if not success or type(properties) ~= 'table' or type(properties.model) ~= 'number' then return nil end
        record = { key = 'esx:' .. plate, owner = 'esx:' .. owned.owner, framework = 'esx', plate = plate, model = properties.model }
    end
    if not record or not DoesEntityExist(vehicle) or GetEntityModel(vehicle) ~= model
        or adapter.ChasePlate(GetVehicleNumberPlateText(vehicle)) ~= plate or (record.model & 0xffffffff) ~= (model & 0xffffffff) then return nil end
    record.model = model
    return record
end

function ChaseBootlegDeviceAdapter.ChaseRegisterUsables()
    if ChaseInventory() == 'ox_inventory' then return end
    for device, product in pairs(ChaseConfig().products) do
        local function ChaseUseDevice(playerSource)
            local success, identity = pcall(ChaseBootlegServer.ChaseSession, playerSource)
            if success and adapter.ChaseCount(identity, product.item) > 0 then
                TriggerClientEvent('chase_bootleg:client:useDevice', playerSource, device)
            end
        end
        if framework.ChaseName() == 'qbcore' then
            exports['qb-core']:GetCoreObject().Functions.CreateUseableItem(product.item, ChaseUseDevice)
        elseif framework.ChaseName() == 'esx' then
            exports.es_extended:getSharedObject().RegisterUsableItem(product.item, ChaseUseDevice)
        end
    end
end
