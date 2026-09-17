ChaseBootlegConfig.Devices = {
    -- Browsing stations and running a studio remain available without an item. Listening requires an equipped receiver by default.
    enabled = true,
    requireDevices = true,
    -- Auto selects ox_inventory, then qb-inventory, then ESX's standard inventory. Custom inventory bridges belong in integrations/devices_server.lua.
    inventory = 'auto',
    -- Receiver sales are independent from the studio depot. This vendor is at Legion Square; all purchases verify this position and bucket.
    shopEnabled = true,
    Shop = {
        -- With ox_inventory, the vendor opens its native shop and spends this inventory currency once. Money is Qbox/QB cash, not the station bank account.
        nativeInventory = true,
        currency = 'money',
        maximumPerPurchase = 5,
        position = { x = 213.86, y = -904.56, z = 30.69, w = 144.0 },
        radius = 3.0,
        bucket = 0,
        ped = 'a_m_y_business_03',
        blip = { enabled = true, sprite = 521, colour = 47, scale = 0.7, label = 'Senora Signalworks' }
    },
    products = {
        vehicle = { item = 'ssw_vehicle_receiver', label = 'Dash Receiver', price = 4000 },
        portable = { item = 'ssw_portable_radio', label = 'Field Radio', price = 1500 },
        buds = { item = 'ssw_signalbuds', label = 'Signalbuds', price = 800 }
    },
    -- Field Radio audio fades with listener distance. Station reception is measured at the radio, in the same routing bucket.
    portableRange = 12.0,
    portableFullVolumeRange = 2.0,
    -- Exterior listeners hear parked or moving receivers fade across this radius; enclosure and walls further soften the sound.
    vehicleExteriorRange = 18.0,
    vehicleExteriorFullVolumeRange = 2.0,
    -- Persistent receiver records are checked against actual framework vehicle ownership, plate and model. Driver seat is required for installation.
    vehicleDiscoverySeconds = 5,
    ownershipCacheSeconds = 15,
    installMaximumSpeed = 0.3,
    -- Keep these SQL schemas aligned with your framework. Only identifier names are configurable, never player-supplied SQL.
    qbVehicles = { table = 'player_vehicles', id = 'id', owner = 'citizenid', plate = 'plate', model = 'vehicle' },
    esxVehicles = { table = 'owned_vehicles', owner = 'owner', plate = 'plate', properties = 'vehicle' }
}

-- This job can purchase and operate broadcasting stations. Receiver sales and listening are available to everyone.
-- Owners and crew can always stop microphones/transmission, pack and store their existing van safely after a job change.
ChaseBootlegConfig.BroadcastJob = { enabled = true, name = 'signalworks', requireDuty = false, minGrade = 0 }
