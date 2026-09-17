-- Everyday settings. Advanced values live in config/*.lua and load before this file.
-- Change individual fields here; do not replace an entire advanced table unless you supply all its fields.

ChaseBootlegConfig.Framework = 'auto' -- auto, qbox, qbcore or esx
ChaseBootlegConfig.Keys.provider = 'auto' -- auto, qbx_vehiclekeys, qb-vehiclekeys, wasabi_carlock or none
ChaseBootlegConfig.Devices.inventory = 'auto' -- auto, ox_inventory, qb-inventory or esx
ChaseBootlegConfig.Debug = false

-- Station access and prices. Players listen with a receiver; only this job operates a station.
ChaseBootlegConfig.BroadcastJob.enabled = true
ChaseBootlegConfig.BroadcastJob.name = 'signalworks'
ChaseBootlegConfig.BroadcastJob.minGrade = 0
ChaseBootlegConfig.BroadcastJob.requireDuty = false
ChaseBootlegConfig.StationPrice = 45000
ChaseBootlegConfig.MoneyAccount = 'bank'
ChaseBootlegConfig.Currency = '$'
ChaseBootlegConfig.Battery.rechargePrice = 150

-- Move both the interaction point and clear vehicle spawn bay when relocating the depot.
ChaseBootlegConfig.Depot.position = { x = 725.9, y = -1072.8, z = 22.2 }
ChaseBootlegConfig.Depot.spawn = { x = 728.9, y = -1088.7, z = 22.2, w = 90.0 }
ChaseBootlegConfig.Depot.bucket = 0
ChaseBootlegConfig.Depot.blip.enabled = true

-- Receiver vendor. Item definitions and images are in installation/.
ChaseBootlegConfig.Devices.shopEnabled = true
ChaseBootlegConfig.Devices.requireDevices = true
ChaseBootlegConfig.Devices.Shop.position = { x = 213.86, y = -904.56, z = 30.69, w = 144.0 }
ChaseBootlegConfig.Devices.Shop.bucket = 0
ChaseBootlegConfig.Devices.products.portable.price = 1500
ChaseBootlegConfig.Devices.products.vehicle.price = 4000
ChaseBootlegConfig.Devices.products.buds.price = 800

-- Optional integrations. Live microphones require the supplied protocol-3 pma-voice bridge.
ChaseBootlegConfig.Phone.enabled = true
ChaseBootlegConfig.Phone.resource = 'lb-phone'
ChaseBootlegConfig.Voice.enabled = true
ChaseBootlegConfig.Voice.resource = 'pma-voice'
ChaseBootlegConfig.Music.providers.youtube = true
ChaseBootlegConfig.Music.providers.soundcloud = true

-- A parked driver may fit a Dash Receiver in a registered vehicle. Enable owner-only access if desired.
ChaseBootlegConfig.Dashboard.requireOwner = false

-- Defaults for new bindings; players' saved FiveM key bindings take precedence.
ChaseBootlegConfig.Interaction.key = 'F5'
ChaseBootlegConfig.FieldControls.placeKey = 'G'
ChaseBootlegConfig.FieldControls.cancelKey = 'X'
ChaseBootlegConfig.Talk.key = 'CAPITAL' -- Caps Lock; do not share the normal PMA radio key.
ChaseBootlegConfig.Calls.acceptKey = 'Y'
ChaseBootlegConfig.Calls.declineKey = 'U'
