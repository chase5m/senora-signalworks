ChaseBootlegConfig = {
    -- Created by Chase. Select auto, qbox, qbcore or esx. Auto prefers Qbox when its QB bridge is present.
    Framework = 'qbox',
    -- Bank is supported by all three adapters. ESX cash is mapped to its money account.
    MoneyAccount = 'bank',
    Currency = '$',
    StationPrice = 45000,
    MaxStations = 64,
    MaxTip = 10000,
    MaxWithdrawal = 100000,
    MaxStationBalance = 10000000,
    MaxCrew = 4,
    Frequency = { min = 880, max = 1080 },
    -- All locations are server checked. Relocate both the interaction point and parking bay for your map.
    Depot = {
        position = { x = 725.9, y = -1072.8, z = 22.2 },
        radius = 20.0,
        spawn = { x = 728.9, y = -1088.7, z = 22.2, w = 90.0 },
        spawnClearance = 4.0,
        bucket = 0,
        blip = { enabled = true, sprite = 521, colour = 47, scale = 0.75, label = 'Senora Signalworks Depot' }
    },
    Vehicle = {
        model = 'speedo',
        operatorRange = 5.0,
        maxStationarySpeed = 0.3,
        deploySeconds = 9,
        packSeconds = 7,
        movementTolerance = 1.5,
        unattendedMinutes = 15,
        spawnTimeoutSeconds = 10
    },
    -- Range uses server positions in the same routing bucket. Battery consumption is percentage points per minute.
    PowerModes = {
        { id = 'low', label = 'Local', range = 650.0, drainPerMinute = 0.45 },
        { id = 'medium', label = 'District', range = 1800.0, drainPerMinute = 0.9 },
        { id = 'high', label = 'City', range = 4200.0, drainPerMinute = 1.6 }
    },
    Battery = { rechargePrice = 150, minimumToBroadcast = 1.0, idleDrainPerMinute = 0.1, persistSeconds = 30 },
    Requests = { maxLength = 240, maxPending = 40, retained = 100, cooldownSeconds = 20 },
    -- Qbox/QBCore require job.onduty=true. ESX onDuty is used when available; legacy ESX falls back to job membership.
    Police = { jobs = { police = true, bcso = true, sasp = true }, requireDuty = true, esxDutyFallback = true },
    Scanner = {
        enabled = true,
        cooldownSeconds = 12,
        separation = 100.0,
        requiredReadings = 3,
        historySeconds = 180,
        maxRange = 6000.0,
        bearingStep = 15,
        searchRadius = 220.0
    },
    -- All URLs are trusted installation choices. Use bundled or properly licensed audio; players cannot submit URLs.
    Cartridges = {
        { id = 'station-ident', name = 'Senora ident', description = 'Original electronic station ident.', url = 'audio/chase_bootleg_ident.wav', duration = 5.0 },
        { id = 'intermission', name = 'Intermission', description = 'Original short intermission cue.', url = 'audio/chase_bootleg_intermission.wav', duration = 8.0 }
    },
    Commands = { open = 'bootleg', studio = 'bootlegstudio', scanner = 'bootlegscan' },
    -- Live microphones stay unavailable until the installer applies and verifies the included pma-voice bridge.
    Voice = { enabled = true, resource = 'pma-voice', volume = 65 },
    -- Visual attachments are local to streamed vans. Model names and transforms are defined by the asset integration file.
    Visuals = { enabled = true, streamDistance = 100.0, pollMilliseconds = 1000 },
    Security = { actionCooldownMilliseconds = 350, bootstrapCooldownMilliseconds = 750, maxActionsPerTenSeconds = 20 },
    -- No network analytics are sent. Unexpected failures and unresolved payments are written to the server console.
    Debug = true
}
