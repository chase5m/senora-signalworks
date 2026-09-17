-- Created by Chase. These editable mounts are designed for the GTA speedo van and the supplied original props.
-- Roof height and rear position are calculated from the vehicle's actual model bounds. Adjust offsets after checking your van in game.
ChaseBootlegConfig.Mounts = {
    roof = { x = 0.0, y = -0.25, z = 1.216275, pitch = -1.4947, clearance = 0.006 },
    lid = { x = 0.0, y = 0.82, z = 0.25, openAngle = -68.0 },
    mast = { x = 0.0, y = 0.12, z = -1.0, travel = 1.33 },
    console = { x = 0.0, rearInset = 0.65, floorHeight = 0.60, travel = 0.83 },
    powercase = { x = 0.45, rearInset = 1.42, floorHeight = 0.62 },
    cartridge = { x = 0.365, y = 0.075, z = 0.440 },
    lever = { x = 0.113, y = -0.230, z = 0.451, offAngle = 60.0, onAngle = 0.0 },
    onair = { x = -0.391, y = 0.134, z = 0.451 },
}

-- Each model is a real streamed drawable. Missing models are reported; substitute model names only if their pivots also match.
ChaseBootlegConfig.Models = {
    base = 'chase_bootleg_roof_base',
    lid = 'chase_bootleg_roof_lid',
    mast = 'chase_bootleg_mast',
    console = 'chase_bootleg_console',
    cartridge = 'chase_bootleg_cartridge',
    receiver = 'chase_bootleg_receiver',
    scanner = 'chase_bootleg_scanner',
    powercase = 'chase_bootleg_powercase',
    battery = 'chase_bootleg_battery',
    lever = 'chase_bootleg_live_lever',
    onair = 'chase_bootleg_onair',
}

-- Physical displays use a separate lightweight page and are created only for the closest consoles. The screen faces the van's rear.
ChaseBootlegConfig.Display = {
    enabled = true,
    distance = 12.0,
    maximum = 2,
    width = 768,
    height = 432,
    centre = { x = 0.0, y = 0.082, z = 0.520 },
    size = { width = 0.42, height = 0.24 },
}

-- ox_target is optional. The E-key prompts and commands work without a target resource.
ChaseBootlegConfig.Interaction = { target = 'auto', distance = 2.3, control = 38, key = 'F5' }

-- These namespaced export hooks can be called from your inventory or phone. Device requirements are configured in config/devices.lua.
ChaseBootlegConfig.Phone = { enabled = true, resource = 'lb-phone', identifier = 'chase_bootleg' }

-- Select auto, qbx_vehiclekeys, qb-vehiclekeys, wasabi_carlock, or none. Adapt integrations/keys.lua for a different key resource.
ChaseBootlegConfig.Keys = { provider = 'qbx_vehiclekeys' }
