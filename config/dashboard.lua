-- Created by Chase. Mounts are saved per registered vehicle; model defaults only seed the placement preview.
ChaseBootlegConfig.Dashboard = {
    enabled = true,
    -- Any parked driver may install or reposition a receiver. Set true if your server explicitly wants garage-owner-only access.
    requireOwner = false,
    placement = {
        -- These server-enforced limits are offsets from the vehicle root. The client also clips the preview to the vehicle model bounds.
        bounds = { x = { min = -1.5, max = 1.5 }, y = { min = -2.5, max = 2.5 }, z = { min = -1.0, max = 2.0 } },
        moveStep = 0.01,
        rotateStep = 2.0,
        axisLength = 0.18,
        cameraFov = 58.0
    },
    -- The close-up camera faces the physical screen; no duplicate audio player is created in the dashboard DUI.
    interaction = { cameraDistance = 0.28, cameraFov = 36.0 },
    commands = { open = 'senoradash', position = 'senoramount' }
}
