-- Created by Chase. Receiver acoustics apply to the selected physical speaker, not ordinary nearby player conversations.
ChaseBootlegConfig.Acoustics = {
    enabled = true,
    -- Audio gain is updated locally between server audience checks. Values are milliseconds; larger smoothing is a softer fade.
    pollMilliseconds = 50,
    probeMilliseconds = 250,
    smoothingMilliseconds = 240,
    -- Solid world geometry and props reduce sound and remove high frequencies. One asynchronous probe runs at a time.
    wallGain = 0.28,
    wallHigh = 2200.0,
    -- Each crossed cabin boundary adds attenuation. Occupants in the source vehicle do not cross its own cabin boundary.
    closedVehicleGain = 0.22,
    closedVehicleHigh = 2200.0,
    openVehicleGain = 0.80,
    openVehicleHigh = 7000.0,
    -- YouTube/SoundCloud official embedded players support volume only; their cross-origin audio cannot enter the local filter graph.
    -- Live station voice and bundled/local cartridge files receive both distance/enclosure volume and the frequency filter.
}
