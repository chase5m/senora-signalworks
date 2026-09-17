ChaseBootlegShop = { registered = false, sessions = {} }

local shop = ChaseBootlegShop
local server = ChaseBootlegServer
local config = ChaseBootlegConfig
local shopType = 'chase_bootleg_receivers'

function ChaseBootlegShop.ChaseNativeAvailable()
    return config.Devices.enabled and config.Devices.shopEnabled and config.Devices.Shop.nativeInventory ~= false
        and ChaseBootlegDeviceAdapter.ChaseInventory() == 'ox_inventory' and GetResourceState('ox_inventory') == 'started'
end

local function ChaseValidateShop(playerSource)
    if not server.ready or not config.Devices.enabled or not config.Devices.shopEnabled then return nil end
    local success, identity = pcall(server.ChaseSession, playerSource)
    if not success or not pcall(ChaseBootlegReceivers.ChaseAtShop, identity) then return nil end
    return identity
end

local function ChaseShopOpen(payload)
    if payload.shopType ~= shopType then return true end
    if not shop.registered or not shop.ChaseNativeAvailable() or tostring(payload.shopId) ~= '1' then return false end
    local identity = ChaseValidateShop(payload.source)
    if not identity then return false end
    shop.sessions[payload.source] = identity
    return true
end

local function ChaseShopBuy(payload)
    if payload.shopType ~= shopType then return true end
    if not shop.registered or not shop.ChaseNativeAvailable() or tonumber(payload.shopId) ~= 1 then return false end
    local identity = ChaseValidateShop(payload.source)
    if not identity or shop.sessions[payload.source] ~= identity then return false end
    local product
    for _, candidate in pairs(config.Devices.products) do
        if candidate.item == payload.itemName then product = candidate break end
    end
    if not product or not ChaseBootlegDomain.ChaseInteger(payload.count, 1, config.Devices.Shop.maximumPerPurchase or 5)
        or payload.currency ~= (config.Devices.Shop.currency or 'money')
        or type(payload.price) ~= 'number' or payload.price < 1 or payload.totalPrice ~= payload.price * payload.count then return false end
    local randomPrices = GetConvarBool('inventory:randomprices', false) and payload.currency == 'money'
    local minimum = randomPrices and math.ceil(product.price * 0.8) or product.price
    local maximum = randomPrices and math.ceil(product.price * 1.2) or product.price
    if payload.price < minimum or payload.price > maximum or payload.price % 1 ~= 0 then return false end
    return true
end

local function ChaseGuardShopOpen(payload)
    local success, allowed = pcall(ChaseShopOpen, payload)
    return success and allowed == true
end

local function ChaseGuardShopBuy(payload)
    local success, allowed = pcall(ChaseShopBuy, payload)
    return success and allowed == true
end

function ChaseBootlegShop.ChaseInitialize()
    if shop.registered or not shop.ChaseNativeAvailable() then return end
    local settings = config.Devices.Shop
    assert(type(settings.currency or 'money') == 'string', 'Receiver shop currency must be an inventory item name')
    local products = {}
    for _, device in ipairs({ 'vehicle', 'portable', 'buds' }) do
        local product = config.Devices.products[device]
        assert(exports.ox_inventory:Items(product.item), ('Register the receiver inventory item %s before starting Signalworks'):format(product.item))
        products[#products + 1] = { name = product.item, price = product.price, currency = settings.currency or 'money' }
    end
    assert(exports.ox_inventory:Items(settings.currency or 'money'), 'The receiver shop currency item is missing')
    local position = settings.position
    local coordinates = vec3(position.x + 0.0, position.y + 0.0, position.z + 0.0)
    exports.ox_inventory:RegisterShop(shopType, { name = 'Senora Signalworks', inventory = products,
        locations = { coordinates }, targets = { { loc = coordinates, coords = coordinates, distance = settings.radius } } })
    exports.ox_inventory:registerHook('openShop', ChaseGuardShopOpen, { inventoryFilter = { '^' .. shopType .. '$' } })
    exports.ox_inventory:registerHook('buyItem', ChaseGuardShopBuy, { inventoryFilter = { '^' .. shopType .. '$' } })
    shop.registered = true
end

function ChaseBootlegShop.ChaseOpen(identity)
    ChaseBootlegReceivers.ChaseAtShop(identity)
    if not config.Devices.enabled or not config.Devices.shopEnabled then server.ChaseReject('shop_unavailable', 'The receiver shop is closed.') end
    local pending = {}
    for _, device in ipairs({ 'vehicle', 'portable', 'buds' }) do
        local order = ChaseBootlegReceivers.orders[identity.identifier .. ':' .. device]
        if order and order.status == 'paid' then pending[#pending + 1] = { device = device, label = config.Devices.products[device].label } end
    end
    if shop.ChaseNativeAvailable() then
        if not shop.registered then server.ChaseReject('shop_unavailable', 'The inventory shop is not ready. Contact an administrator.') end
        return { provider = 'ox_inventory', type = shopType, id = 1, pending = pending }
    end
    return { provider = 'fallback', products = ChaseBootlegReceivers.ChaseSnapshot(identity).shop }
end

function ChaseBootlegShop.ChaseDropSource(playerSource)
    shop.sessions[playerSource] = nil
end

function ChaseBootlegShop.ChaseStop()
    if shop.registered and GetResourceState('ox_inventory') == 'started' then
        exports.ox_inventory:RegisterShop(shopType, { name = 'Senora Signalworks', inventory = {} })
    end
    shop.registered = false
    shop.sessions = {}
end
