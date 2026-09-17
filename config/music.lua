-- Created by Chase. Queue links are validated by provider on the server and played through the embedded NUI players.
ChaseBootlegConfig.Music = {
    enabled = true,
    -- Disable a provider to reject its links when crews add tracks.
    providers = { youtube = true, soundcloud = true },
    maxQueue = 50,
    minDurationSeconds = 5,
    maxDurationSeconds = 3600,
    -- dj: tracks play in queue order and stop when the queue ends. autonomous: the queue loops without an operator.
    defaultMode = 'dj'
}

-- Additional live microphones beside the primary host. Co-hosts need the broadcast job and must stand at the live console.
ChaseBootlegConfig.CoHosts = { maximum = 3 }

-- Listener call-ins. The host answers with the accept or decline keys; players can rebind them in their settings.
-- Avoid keys already used for voice: N is the default push-to-talk key, so a host on N would decline every call while talking.
ChaseBootlegConfig.Calls = {
    enabled = true,
    ringSeconds = 30,
    cooldownSeconds = 20,
    maxOnAirSeconds = 600,
    acceptKey = 'Y',
    declineKey = 'U'
}

-- Station push-to-talk. Hosts, co-hosts and accepted callers go on air only while this key is held.
-- Players rebind it in FiveM Settings > Key Bindings > FiveM.
-- Avoid keys pma-voice already binds: LMENU (Left Alt) is its default radio key, N its proximity push-to-talk and F11 its
-- proximity cycle. A radio key here would eject participants from the station the moment they talk, so the client refuses
-- to register the mapping when the key matches the pma-voice voice_defaultRadio convar.
ChaseBootlegConfig.Talk = { command = 'senoratalk', key = 'CAPITAL' }
