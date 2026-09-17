local chaseTargets = {}
local chaseReceiver = nil
local chaseReceivers, chaseReceiverSet = {}, {}
local chaseReceiverStudio = false
local chaseVolume = 0.7
local chaseQuality = 1.0
local chaseReceiverSubmix = nil
local chaseSubmixes = {}
local chaseBridgeActive = false
local chaseLastRoute = false
local chaseTalkPressed = false
local chaseOriginalAddTargets = addVoiceTargets
local chaseOriginalToggleVoice = toggleVoice
local chaseOriginalCallChannel = setCallChannel

local function ChaseBootlegBridgeAllowed()
    local resource = GetInvokingResource()
    return resource == 'chase_bootleg' or resource == GetCurrentResourceName()
end

local function ChaseBootlegMicOpen()
    local state = LocalPlayer.state
    return chaseBridgeActive and not radioPressed and next(callData or {}) == nil
        and (tonumber(state.callChannel) or 0) == 0 and not state.disableProximity
        and state.isDead ~= true and state.dead ~= true and state.inlaststand ~= true
        and not IsEntityDead(PlayerPedId()) and GetResourceState('chase_bootleg') == 'started'
end

local function ChaseBootlegCanTransmit()
    return chaseTalkPressed and ChaseBootlegMicOpen()
end

local function ChaseBootlegAppendTargets(...)
    local targetTables = { ... }
    if ChaseBootlegCanTransmit() then targetTables[#targetTables + 1] = chaseTargets end
    chaseOriginalAddTargets(table.unpack(targetTables))
end

local function ChaseBootlegRefreshTargets()
    if type(voiceTarget) ~= 'number' then return end
    chaseLastRoute = ChaseBootlegCanTransmit()
    MumbleClearVoiceTargetPlayers(voiceTarget)
    ChaseBootlegAppendTargets((radioPressed and isRadioEnabled()) and radioData or {}, callData or {})
end

local function ChaseBootlegSyncTargets()
    if ChaseBootlegCanTransmit() == chaseLastRoute then return end
    ChaseBootlegRefreshTargets()
end

local function ChaseBootlegReleaseReceiver(playerSource)
    local muted = exports[GetCurrentResourceName()]:isPlayerMuted(playerSource)
    MumbleSetVolumeOverrideByServerId(playerSource, muted and 0.0 or -1.0)
    if type(restoreDefaultSubmix) == 'function' then restoreDefaultSubmix(playerSource) end
    return muted == true
end

local function ChaseBootlegRestoreReceiver(playerSource)
    if not playerSource or ChaseBootlegReleaseReceiver(playerSource) then return end
    if (callData or {})[playerSource] then
        chaseOriginalToggleVoice(playerSource, true, 'call')
    elseif (radioData or {})[playerSource] then
        chaseOriginalToggleVoice(playerSource, true, 'radio')
    end
end

local function ChaseBootlegApplyReceiver()
    if not chaseReceiver then return end
    local listenerBusy = (tonumber(LocalPlayer.state.callChannel) or 0) ~= 0 or radioPressed
    local volume = chaseReceiverStudio and 1.0 or listenerBusy and 0.0 or chaseVolume * chaseQuality
    local filtered = chaseReceiverSubmix and GetConvarInt('voice_enableSubmix', 1) == 1
    for _, playerSource in ipairs(chaseReceivers) do
        if not (callData or {})[playerSource] and not (radioData or {})[playerSource]
            and not exports[GetCurrentResourceName()]:isPlayerMuted(playerSource) then
            MumbleSetVolumeOverrideByServerId(playerSource, volume + 0.0)
            if filtered then
                MumbleSetSubmixForServerId(playerSource, chaseReceiverSubmix)
            elseif type(restoreDefaultSubmix) == 'function' then
                restoreDefaultSubmix(playerSource)
            end
        end
    end
end

local function ChaseBootlegReceiverSubmix(device, profile)
    if device ~= 'vehicle' and device ~= 'portable' and device ~= 'buds' then return nil end
    if type(profile) ~= 'table' then return nil end
    local low, high, distortion = tonumber(profile.low), tonumber(profile.high), tonumber(profile.distortion)
    if not low or not high or not distortion or low ~= low or high ~= high or distortion ~= distortion then return nil end
    low = math.max(20.0, math.min(1500.0, low))
    high = math.max(2000.0, math.min(20000.0, high))
    distortion = math.max(0.0, math.min(0.3, distortion))
    local cached = chaseSubmixes[device]
    if cached and cached.low == low and cached.high == high and cached.distortion == distortion then
        return cached.id
    end
    local submix = cached and cached.id or CreateAudioSubmix('chase_bootleg:' .. device)
    if not submix or submix < 0 then return nil end
    if not cached then
        SetAudioSubmixEffectRadioFx(submix, 0)
        SetAudioSubmixEffectParamInt(submix, 0, GetHashKey('default'), 1)
        AddAudioSubmixOutput(submix, 0)
    end
    SetAudioSubmixEffectParamFloat(submix, 0, GetHashKey('freq_low'), low + 0.0)
    SetAudioSubmixEffectParamFloat(submix, 0, GetHashKey('freq_hi'), high + 0.0)
    SetAudioSubmixEffectParamFloat(submix, 0, GetHashKey('o_freq_lo'), low + 0.0)
    SetAudioSubmixEffectParamFloat(submix, 0, GetHashKey('o_freq_hi'), high + 0.0)
    SetAudioSubmixEffectParamFloat(submix, 0, GetHashKey('fudge'), distortion + 0.0)
    chaseSubmixes[device] = { id = submix, low = low, high = high, distortion = distortion }
    return submix
end

local function ChaseBootlegSetReceivers(sources, quality, device, profile)
    local previous = chaseReceivers
    chaseReceivers, chaseReceiverSet = {}, {}
    for _, playerSource in ipairs(sources) do
        if type(playerSource) == 'number' and playerSource > 0 and playerSource ~= playerServerId
            and not chaseReceiverSet[playerSource] then
            chaseReceiverSet[playerSource] = true
            chaseReceivers[#chaseReceivers + 1] = playerSource
        end
    end
    chaseReceiver = chaseReceivers[1]
    chaseReceiverStudio = device == 'studio'
    chaseQuality = math.max(0.0, math.min(1.0, tonumber(quality) or 0.0))
    chaseReceiverSubmix = ChaseBootlegReceiverSubmix(device, profile)
    for _, playerSource in ipairs(previous) do
        if not chaseReceiverSet[playerSource] then ChaseBootlegRestoreReceiver(playerSource) end
    end
    ChaseBootlegApplyReceiver()
end

local function ChaseBootlegClearReceivers()
    local previous = chaseReceivers
    chaseReceivers, chaseReceiverSet, chaseReceiver, chaseReceiverStudio = {}, {}, nil, false
    for _, playerSource in ipairs(previous) do ChaseBootlegRestoreReceiver(playerSource) end
end

local function ChaseBootlegToggleVoice(playerSource, enabled, moduleType)
    local receiver = chaseReceiverSet[playerSource] == true
    local handoff = receiver and (moduleType == 'call' or moduleType == 'radio')
    if handoff then ChaseBootlegReleaseReceiver(playerSource) end
    chaseOriginalToggleVoice(playerSource, enabled, moduleType)
    if receiver and not handoff then ChaseBootlegApplyReceiver() end
end

local function ChaseBootlegInterrupt()
    if not chaseBridgeActive then return end
    chaseBridgeActive = false
    chaseTalkPressed = false
    chaseTargets = {}
    ChaseBootlegRefreshTargets()
    TriggerEvent('chase_bootleg:pma:interrupted')
end

local function ChaseBootlegSetCallChannel(channel)
    if tonumber(channel) and tonumber(channel) ~= 0 then ChaseBootlegInterrupt() end
    return chaseOriginalCallChannel(channel)
end

function ChaseBootlegBeforeCall(channel)
    if tonumber(channel) and tonumber(channel) ~= 0 then ChaseBootlegInterrupt() end
end

if type(chaseOriginalAddTargets) ~= 'function' or type(chaseOriginalToggleVoice) ~= 'function'
    or type(chaseOriginalCallChannel) ~= 'function' then
    error('Chase Bootleg requires the documented pma-voice integration points. Load this file last.')
end

addVoiceTargets = ChaseBootlegAppendTargets
toggleVoice = ChaseBootlegToggleVoice
setCallChannel = ChaseBootlegSetCallChannel

exports('ChaseBootlegBridgeVersion', function() return 3 end)

exports('ChaseBootlegSpeechState', function()
    if not ChaseBootlegBridgeAllowed() then return false end
    local state = LocalPlayer.state
    local alive = not IsEntityDead(PlayerPedId()) and state.isDead ~= true and state.dead ~= true
        and state.inlaststand ~= true
    local nativeTalking = MumbleIsPlayerTalking(PlayerId())
    local inCall = (tonumber(state.callChannel) or 0) ~= 0 or next(callData or {}) ~= nil
    local micOpen = alive and chaseBridgeActive and ChaseBootlegMicOpen()
    local transmitting = micOpen and chaseTalkPressed
    local talking = transmitting and (nativeTalking == true or nativeTalking == 1)
    local receivingAllowed = alive and chaseReceiver ~= nil and chaseVolume > 0.0 and chaseQuality > 0.0
        and not inCall and not radioPressed and not (radioData or {})[chaseReceiver]
        and not exports[GetCurrentResourceName()]:isPlayerMuted(chaseReceiver)
    return { talking = talking == true, mode = talking == true and 'station' or 'idle', micOpen = micOpen == true,
        transmitting = transmitting == true, receivingAllowed = receivingAllowed == true }
end)

exports('ChaseBootlegSetTalking', function(pressed)
    if not ChaseBootlegBridgeAllowed() or type(pressed) ~= 'boolean' then return false end
    chaseTalkPressed = pressed
    ChaseBootlegSyncTargets()
    return true
end)

exports('ChaseBootlegSetTargets', function(listeners, enabled)
    if not ChaseBootlegBridgeAllowed() or type(listeners) ~= 'table' then return false end
    chaseTargets = {}
    for _, playerSource in ipairs(listeners) do
        if type(playerSource) == 'number' and playerSource ~= playerServerId and playerSource > 0 then
            chaseTargets[playerSource] = true
        end
    end
    chaseBridgeActive = enabled == true
    if chaseBridgeActive and not ChaseBootlegMicOpen() then
        ChaseBootlegInterrupt()
        return false
    end
    ChaseBootlegRefreshTargets()
    return true
end)

exports('ChaseBootlegReceiveMany', function(sources, quality, device, profile)
    if not ChaseBootlegBridgeAllowed() or type(sources) ~= 'table' then return false end
    ChaseBootlegSetReceivers(sources, quality, device, profile)
    return true
end)

exports('ChaseBootlegReceive', function(playerSource, quality, device, profile)
    if not ChaseBootlegBridgeAllowed() then return false end
    ChaseBootlegSetReceivers(type(playerSource) == 'number' and { playerSource } or {}, quality, device, profile)
    return true
end)

exports('ChaseBootlegSetVolume', function(volume)
    if not ChaseBootlegBridgeAllowed() or type(volume) ~= 'number' or volume ~= volume then return false end
    chaseVolume = math.max(0.0, math.min(1.0, volume / 100.0))
    ChaseBootlegApplyReceiver()
    return true
end)

exports('ChaseBootlegReset', function()
    if not ChaseBootlegBridgeAllowed() then return false end
    chaseBridgeActive = false
    chaseTalkPressed = false
    chaseTargets = {}
    ChaseBootlegRefreshTargets()
    ChaseBootlegClearReceivers()
    return true
end)

AddEventHandler('pma-voice:radioActive', function(enabled)
    if enabled then ChaseBootlegInterrupt() end
end)

AddEventHandler('onClientResourceStop', function(resource)
    if resource ~= 'chase_bootleg' and resource ~= GetCurrentResourceName() then return end
    chaseBridgeActive = false
    chaseTalkPressed = false
    chaseTargets = {}
    ChaseBootlegRefreshTargets()
    ChaseBootlegClearReceivers()
end)

CreateThread(function()
    while true do
        local active = chaseBridgeActive or chaseReceiver ~= nil
        if chaseBridgeActive and not ChaseBootlegMicOpen() then ChaseBootlegInterrupt() end
        ChaseBootlegSyncTargets()
        if chaseReceiver then ChaseBootlegApplyReceiver() end
        Wait(active and 100 or 1000)
    end
end)
