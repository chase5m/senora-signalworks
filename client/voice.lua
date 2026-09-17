ChaseBootlegAudio = {}

local chaseVoiceResource = ChaseBootlegConfig.Voice and ChaseBootlegConfig.Voice.resource or 'pma-voice'
local chaseBridgeReady = false
local chaseCartridgeMonitor = false
local chaseReception, chaseAcousticSignature = nil, nil
local chaseSpeechRoute, chaseSpeechReception, chaseHostSpeech, chaseSpeechState = nil, nil, nil, nil
local chaseSpeechFlags, chaseSpeechLastReport = nil, 0
local chaseSpeechTransmitting, chaseSpeechStopping = false, false
local chaseSpeechProbeAt = nil
local chaseTalkPressed = false
local chaseTalkConfig = ChaseBootlegConfig.Talk or {}
local chaseTalkCommand = type(chaseTalkConfig.command) == 'string' and chaseTalkConfig.command or 'senoratalk'
local chaseTalkKey = type(chaseTalkConfig.key) == 'string' and chaseTalkConfig.key or 'CAPITAL'
local chaseRadioKey = GetConvar('voice_defaultRadio', 'LMENU')
local chaseTalkKeyBlocked = type(chaseRadioKey) == 'string' and chaseTalkKey:upper() == chaseRadioKey:upper()
local chaseBridgeNotice = false
local chaseSpeechFields = { 'mode', 'talking', 'micOpen', 'transmitting', 'role', 'stationId', 'stationName', 'frequency', 'hostName', 'hostSource' }
local chaseVolume = GetResourceKvpInt('chase_bootleg:volume')
if GetResourceKvpString('chase_bootleg:volumeSet') ~= 'true' then
    chaseVolume = math.floor(math.max(0, math.min(100, tonumber(ChaseBootlegConfig.Voice.volume) or 65)))
end

local function ChaseBootlegCallVoice(method, ...)
    if GetResourceState(chaseVoiceResource) ~= 'started' then return false end
    local arguments = table.pack(...)
    local success, result = pcall(function()
        return exports[chaseVoiceResource][method](nil, table.unpack(arguments, 1, arguments.n))
    end)
    return success and result ~= false, result
end

local function ChaseBootlegSendAudioState(message)
    SendNUIMessage(message)
    if ChaseBootlegPhone then ChaseBootlegPhone.ChaseSend(message) end
end

local function ChaseBootlegAlive()
    local state = LocalPlayer.state
    return not IsEntityDead(PlayerPedId()) and state.isDead ~= true and state.dead ~= true and state.inlaststand ~= true
end

local function ChaseBootlegSetTalking(pressed)
    if not pressed and not chaseTalkPressed then return end
    chaseTalkPressed = pressed
    ChaseBootlegCallVoice('ChaseBootlegSetTalking', pressed)
end

local function ChaseBootlegSpeechMetadata(value)
    if type(value) ~= 'table' or (type(value.stationId) ~= 'string' and type(value.stationId) ~= 'number')
        or type(value.hostSource) ~= 'number' or value.hostSource <= 0 then return nil end
    local role = value.role
    if role ~= 'host' and role ~= 'cohost' and role ~= 'caller' then role = nil end
    return { stationId = value.stationId, hostSource = value.hostSource, role = role,
        stationName = type(value.stationName) == 'string' and value.stationName or nil,
        hostName = type(value.hostName) == 'string' and value.hostName or nil,
        frequency = type(value.frequency) == 'number' and value.frequency or nil }
end

local function ChaseBootlegReceptionSources(reception)
    if type(reception) ~= 'table' then return {} end
    if type(reception.hostSources) ~= 'table' then
        return type(reception.hostSource) == 'number' and { reception.hostSource } or {}
    end
    local sources = {}
    for _, playerSource in ipairs(reception.hostSources) do
        if type(playerSource) == 'number' and playerSource > 0 then sources[#sources + 1] = playerSource end
    end
    return sources
end

local function ChaseBootlegSpeechCopy(value)
    if type(value) ~= 'table' then return nil end
    local copy = {}
    for _, key in ipairs(chaseSpeechFields) do copy[key] = value[key] end
    return copy
end

local function ChaseBootlegSpeechEqual(left, right)
    if left == right then return true end
    if type(left) ~= 'table' or type(right) ~= 'table' then return false end
    for _, key in ipairs(chaseSpeechFields) do if left[key] ~= right[key] then return false end end
    return true
end

local function ChaseBootlegSpeechElapsed(now, previous)
    return (now - previous) % 4294967296
end

local function ChaseBootlegPublishSpeech(localSpeech, receiver)
    local config = ChaseBootlegConfig.Speech or {}
    local enabled, hud = config.enabled ~= false, config.hud ~= false
    local flags = tostring(enabled) .. ':' .. tostring(hud)
    if chaseSpeechState and flags == chaseSpeechFlags
        and ChaseBootlegSpeechEqual(chaseSpeechState['local'], localSpeech)
        and ChaseBootlegSpeechEqual(chaseSpeechState.receiver, receiver) then return end
    chaseSpeechFlags = flags
    chaseSpeechState = { ['local'] = localSpeech, receiver = receiver }
    ChaseBootlegSendAudioState({ type = 'chase_bootleg:speech', enabled = enabled, hud = hud, talkKey = chaseTalkKey,
        data = { ['local'] = ChaseBootlegSpeechCopy(localSpeech), receiver = ChaseBootlegSpeechCopy(receiver) } })
end

local function ChaseBootlegReportSpeech(transmitting)
    local now = GetGameTimer()
    if transmitting ~= chaseSpeechTransmitting or (transmitting and ChaseBootlegSpeechElapsed(now, chaseSpeechLastReport) >= 1000) then
        chaseSpeechTransmitting = transmitting
        chaseSpeechLastReport = now
        TriggerServerEvent('chase_bootleg:server:speech', transmitting)
    end
end

local function ChaseBootlegClearSpeech(clearRoutes)
    if clearRoutes then
        chaseSpeechRoute, chaseSpeechReception, chaseHostSpeech = nil, nil, nil
        ChaseBootlegSetTalking(false)
    end
    ChaseBootlegReportSpeech(false)
    ChaseBootlegPublishSpeech({ mode = 'idle', talking = false, micOpen = false, transmitting = false }, nil)
end

local function ChaseBootlegRefreshSpeech()
    local config = ChaseBootlegConfig.Speech or {}
    if chaseSpeechStopping or not ChaseBootlegAlive() then
        ChaseBootlegClearSpeech(true)
        return false
    end
    if config.enabled == false or not chaseBridgeReady or GetResourceState(chaseVoiceResource) ~= 'started' then
        ChaseBootlegClearSpeech(false)
        return false
    end
    local now = GetGameTimer()
    if chaseSpeechProbeAt and ChaseBootlegSpeechElapsed(now, chaseSpeechProbeAt) < 3000 then return false end
    local success, activity = ChaseBootlegCallVoice('ChaseBootlegSpeechState')
    if not success or type(activity) ~= 'table' then
        chaseSpeechProbeAt = now
        ChaseBootlegClearSpeech(false)
        return false
    end
    chaseSpeechProbeAt = nil
    local talking = activity.talking == true
    local localSpeech = ChaseBootlegSpeechCopy(chaseSpeechRoute) or {}
    localSpeech.micOpen = activity.micOpen == true and chaseSpeechRoute ~= nil
    localSpeech.transmitting = localSpeech.micOpen and activity.transmitting == true
    localSpeech.talking = localSpeech.transmitting and talking
    localSpeech.mode = localSpeech.talking and 'station' or 'idle'
    if not localSpeech.micOpen then
        localSpeech = { mode = 'idle', talking = false, micOpen = false, transmitting = false }
    end
    local receiver = ChaseBootlegSpeechCopy(chaseSpeechReception)
    if receiver then
        receiver.talking = activity.receivingAllowed == true and chaseVolume > 0
            and chaseSpeechReception.quality > 0 and chaseSpeechReception.gain > 0
            and chaseHostSpeech ~= nil and chaseHostSpeech.talking == true
            and chaseHostSpeech.stationId == receiver.stationId and chaseHostSpeech.hostSource == receiver.hostSource
    end
    ChaseBootlegReportSpeech(localSpeech.transmitting == true and localSpeech.talking == true)
    ChaseBootlegPublishSpeech(localSpeech, receiver)
    return talking or localSpeech.micOpen or receiver ~= nil
end

function ChaseBootlegAudio.ChaseGetSpeech()
    if not chaseSpeechState then return nil end
    return { ['local'] = ChaseBootlegSpeechCopy(chaseSpeechState['local']),
        receiver = ChaseBootlegSpeechCopy(chaseSpeechState.receiver) }
end

function ChaseBootlegAudio.ChaseSetVolume(volume)
    if type(volume) ~= 'number' or volume ~= volume then return false end
    chaseVolume = math.floor(math.max(0, math.min(100, volume)))
    SetResourceKvpInt('chase_bootleg:volume', chaseVolume)
    SetResourceKvp('chase_bootleg:volumeSet', 'true')
    ChaseBootlegCallVoice('ChaseBootlegSetVolume', chaseVolume)
    ChaseBootlegSendAudioState({ type = 'chase_bootleg:volume', volume = chaseVolume })
    ChaseBootlegRefreshSpeech()
    return true
end

function ChaseBootlegAudio.ChaseIsReady()
    return chaseBridgeReady
end

function ChaseBootlegAudio.ChaseSetTalking(pressed)
    if pressed ~= true or not chaseSpeechRoute or not ChaseBootlegAlive() then pressed = false end
    ChaseBootlegSetTalking(pressed)
    ChaseBootlegRefreshSpeech()
    return chaseTalkPressed
end

function ChaseBootlegAudio.ChaseGetVolume()
    return chaseVolume
end

function ChaseBootlegAudio.ChaseReset()
    chaseCartridgeMonitor = false
    chaseReception, chaseAcousticSignature = nil, nil
    if ChaseBootlegAcoustics then ChaseBootlegAcoustics.ChaseReset() end
    ChaseBootlegCallVoice('ChaseBootlegReset')
    SendNUIMessage({ type = 'chase_bootleg:audioStop' })
    ChaseBootlegClearSpeech(true)
end

local function ChaseBootlegApplyReception(force)
    local reception = chaseReception
    local participant = type(reception) == 'table' and reception.participant == true
    local quality = type(reception) == 'table' and tonumber(reception.quality) or 0.0
    local gain = type(reception) == 'table' and tonumber(reception.gain) or 1.0
    quality = math.max(0.0, math.min(1.0, quality or 0.0))
    gain = math.max(0.0, math.min(1.0, gain or 1.0))
    local device = type(reception) == 'table' and reception.device or nil
    local profile = device ~= 'studio' and ChaseBootlegConfig.ReceiverAudio and ChaseBootlegConfig.ReceiverAudio[device] or nil
    if reception and ChaseBootlegAcoustics then gain, profile = ChaseBootlegAcoustics.ChaseResolve(reception) end
    local signature = ('%.3f:%.3f:%s:%d:%d'):format(quality, gain, device or '',
        profile and math.floor(profile.low) or 0, profile and math.floor(profile.high / 20) or 0)
    if not force and chaseAcousticSignature == signature then return end
    chaseAcousticSignature = signature
    ChaseBootlegCallVoice('ChaseBootlegReceiveMany', ChaseBootlegReceptionSources(reception), quality * gain, device, profile)
    if chaseSpeechReception then chaseSpeechReception.quality, chaseSpeechReception.gain = quality, gain end
    ChaseBootlegSendAudioState({ type = 'chase_bootleg:signal', quality = participant and 0.0 or quality,
        gain = participant and 1.0 or gain, device = not participant and device or nil, profile = profile })
end

RegisterNetEvent('chase_bootleg:client:voiceRoute', function(route)
    if source ~= 65535 or type(route) ~= 'table' then return end
    local accepted = ChaseBootlegCallVoice('ChaseBootlegSetTargets', route.listeners or {}, route.stopped ~= true)
    chaseSpeechRoute = route.stopped ~= true and accepted and ChaseBootlegSpeechMetadata(route) or nil
    if not chaseSpeechRoute then ChaseBootlegSetTalking(false) end
    ChaseBootlegRefreshSpeech()
end)

RegisterNetEvent('chase_bootleg:client:reception', function(reception)
    if source ~= 65535 then return end
    local participant = type(reception) == 'table' and reception.participant == true
    local metadata = not participant and ChaseBootlegSpeechMetadata(reception) or nil
    if not metadata or not chaseSpeechReception or chaseSpeechReception.stationId ~= metadata.stationId
        or chaseSpeechReception.hostSource ~= metadata.hostSource then chaseHostSpeech = nil end
    chaseSpeechReception = metadata
    chaseReception = type(reception) == 'table' and reception or nil
    if not chaseReception and ChaseBootlegAcoustics then ChaseBootlegAcoustics.ChaseReset() end
    ChaseBootlegApplyReception(true)
    if (not reception or not reception.stationId) and not chaseCartridgeMonitor then
        SendNUIMessage({ type = 'chase_bootleg:audioStop' })
    end
    ChaseBootlegRefreshSpeech()
end)

RegisterNetEvent('chase_bootleg:client:hostSpeech', function(activity)
    if source ~= 65535 or type(activity) ~= 'table' or type(activity.talking) ~= 'boolean' then return end
    local metadata = ChaseBootlegSpeechMetadata(activity)
    if not metadata or not chaseSpeechReception or chaseSpeechReception.stationId ~= metadata.stationId
        or chaseSpeechReception.hostSource ~= metadata.hostSource then return end
    metadata.talking = activity.talking
    chaseHostSpeech = metadata
    chaseSpeechReception.hostName, chaseSpeechReception.stationName, chaseSpeechReception.frequency =
        metadata.hostName, metadata.stationName, metadata.frequency
    ChaseBootlegRefreshSpeech()
end)

RegisterNetEvent('chase_bootleg:client:cartridge', function(cartridge)
    if source ~= 65535 then return end
    if type(cartridge) ~= 'table' then
        chaseCartridgeMonitor = false
        SendNUIMessage({ type = 'chase_bootleg:audioStop' })
        return
    end
    chaseCartridgeMonitor = cartridge.monitor == true
    local gain = cartridge.gain
    local profile = ChaseBootlegConfig.ReceiverAudio and ChaseBootlegConfig.ReceiverAudio[cartridge.device]
    if not chaseCartridgeMonitor and ChaseBootlegAcoustics then
        gain, profile = ChaseBootlegAcoustics.ChaseResolve(chaseReception or cartridge)
    end
    SendNUIMessage({
        type = 'chase_bootleg:audio',
        url = cartridge.url,
        provider = cartridge.provider,
        title = cartridge.title,
        startedAt = cartridge.startedAt,
        duration = cartridge.duration,
        stationId = cartridge.stationId,
        quality = cartridge.quality,
        gain = gain,
        device = cartridge.device,
        monitor = chaseCartridgeMonitor,
        profile = profile,
    })
end)

AddEventHandler('chase_bootleg:pma:interrupted', function()
    chaseSpeechRoute = nil
    ChaseBootlegSetTalking(false)
    ChaseBootlegRefreshSpeech()
    TriggerServerEvent('chase_bootleg:server:microphoneInterrupted')
    if ChaseBootlegClient then ChaseBootlegClient.ChaseRefresh() end
end)

RegisterCommand('+' .. chaseTalkCommand, function() ChaseBootlegAudio.ChaseSetTalking(true) end, false)
RegisterCommand('-' .. chaseTalkCommand, function() ChaseBootlegAudio.ChaseSetTalking(false) end, false)

if chaseTalkKeyBlocked then
    print(('[chase_bootleg] Talk key %s is the pma-voice radio key (voice_defaultRadio); the +%s mapping was not registered. Choose another key in config.music.lua.'):format(chaseTalkKey, chaseTalkCommand))
else
    RegisterKeyMapping('+' .. chaseTalkCommand, 'Senora Signalworks: talk on station', 'keyboard', chaseTalkKey)
end

AddEventHandler('onClientResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        chaseSpeechStopping = true
        ChaseBootlegAudio.ChaseReset()
    end
    if resource == chaseVoiceResource then
        chaseBridgeReady = false
        chaseSpeechProbeAt = nil
        ChaseBootlegClearSpeech(true)
        TriggerServerEvent('chase_bootleg:server:voiceReady', false)
    end
end)

CreateThread(function()
    while not chaseSpeechStopping do
        local success, version = ChaseBootlegCallVoice('ChaseBootlegBridgeVersion')
        local current = success and version == 3
        local gated = current and ChaseBootlegCallVoice('ChaseBootlegSetTalking', chaseTalkPressed)
        if current and not gated and not chaseBridgeNotice then
            chaseBridgeNotice = true
            print('[chase_bootleg] The installed pma-voice bridge cannot gate station push-to-talk. Reinstall it with install_voice_bridge.py (docs/VOICE.md) and restart pma-voice.')
        end
        local ready = gated == true and ChaseBootlegConfig.Voice.enabled ~= false
        if ready ~= chaseBridgeReady then
            chaseBridgeReady = ready
            TriggerServerEvent('chase_bootleg:server:voiceReady', ready)
            if ready then ChaseBootlegAudio.ChaseSetVolume(chaseVolume) end
        end
        Wait(3000)
    end
end)

CreateThread(function()
    while not chaseSpeechStopping do
        local active = ChaseBootlegRefreshSpeech()
        local config = ChaseBootlegConfig.Speech or {}
        local interval = math.max(50, math.min(250, tonumber(config.pollMilliseconds) or 100))
        Wait(active and interval or 250)
    end
end)

CreateThread(function()
    while not chaseSpeechStopping do
        if chaseReception then
            if ChaseBootlegAlive() then ChaseBootlegApplyReception(false) else ChaseBootlegAudio.ChaseReset() end
        end
        local config = ChaseBootlegConfig.Acoustics or {}
        Wait(chaseReception and math.max(25, math.min(250, tonumber(config.pollMilliseconds) or 50)) or 500)
    end
end)
