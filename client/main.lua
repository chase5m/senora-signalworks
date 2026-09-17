ChaseBootlegClient = { visible = false, view = 'listen', snapshot = nil, permissions = {} }

local chaseRequestVersion = 0
local chaseRefreshPending = false
local chaseCurrentScanBlip = nil
local chaseCurrentScanArea = nil
local chaseScanExpiry = 0
local chaseNextLiveRefresh = 0
local chasePermissionRequest = false
local chasePendingCall, chaseCallAnswering = nil, false
local chaseCallMessages = {
    onair = { text = 'You are on the air', tone = 'success' },
    declined = { text = 'The host declined your call', tone = 'error' },
    ended = { text = 'Call ended', tone = 'inform' }
}

local function ChaseBootlegInterfaceOpen()
    return ChaseBootlegClient.visible or (ChaseBootlegPhone and ChaseBootlegPhone.open)
        or (ChaseBootlegDashboard and ChaseBootlegDashboard.ChaseActive())
end

local function ChaseBootlegSendInterface(message)
    SendNUIMessage(message)
    if ChaseBootlegPhone then ChaseBootlegPhone.ChaseSend(message) end
end

local function ChaseBootlegError(message, code)
    return { ok = false, error = { code = code or 'unavailable', message = message } }
end

function ChaseBootlegClient.ChaseNotify(message, tone)
    lib.notify({ title = 'Senora Signalworks', description = tostring(message), type = tone or 'inform' })
    ChaseBootlegSendInterface({ type = 'chase_bootleg:toast', message = tostring(message), tone = tone or 'info' })
end

local function ChaseBootlegPrepareSnapshot(snapshot)
    if type(snapshot) ~= 'table' then return nil end
    snapshot.volume = ChaseBootlegAudio.ChaseGetVolume()
    snapshot.voiceReady = snapshot.voiceReady == true and ChaseBootlegAudio.ChaseIsReady()
    if ChaseBootlegAudio.ChaseGetSpeech then snapshot.speech = ChaseBootlegAudio.ChaseGetSpeech() end
    if snapshot.viewer then snapshot.viewer.voiceReady = snapshot.voiceReady end
    if snapshot.viewer then ChaseBootlegClient.permissions = snapshot.viewer end
    ChaseBootlegClient.snapshot = snapshot
    if ChaseBootlegDashboard then ChaseBootlegDashboard.ChaseUpdateSnapshot(snapshot) end
    if ChaseBootlegKeys then ChaseBootlegKeys.ChaseRecoverVan(snapshot) end
    return snapshot
end

local function ChaseBootlegFetch(callbackName, ...)
    local arguments = table.pack(...)
    local success, response = pcall(function()
        return lib.callback.await(callbackName, false, table.unpack(arguments, 1, arguments.n))
    end)
    if not success or type(response) ~= 'table' then
        return ChaseBootlegError('The studio could not reach the server. Please try again.', 'connection')
    end
    return response
end

function ChaseBootlegClient.ChaseUpdatePermissions()
    if chasePermissionRequest then return ChaseBootlegClient.permissions end
    chasePermissionRequest = true
    local response = ChaseBootlegFetch('chase_bootleg:server:permissions')
    ChaseBootlegClient.permissions = response.ok and response.data or {}
    chasePermissionRequest = false
    local view = ChaseBootlegClient.view
    if (view == 'studio' and ChaseBootlegClient.permissions.canOperate ~= true)
        or (view == 'scanner' and ChaseBootlegClient.permissions.isPolice ~= true) then
        ChaseBootlegClient.view = 'listen'
        if ChaseBootlegClient.visible then
            SendNUIMessage({ type = 'chase_bootleg:visibility', visible = true, view = 'listen' })
            LocalPlayer.state:set('chase_bootleg:device', nil, true)
        end
    end
    return ChaseBootlegClient.permissions
end

function ChaseBootlegClient.ChaseCanOpenStudio()
    return ChaseBootlegClient.permissions.canOperate == true
end

function ChaseBootlegClient.ChaseRefresh()
    if not ChaseBootlegInterfaceOpen() or chaseRefreshPending then return end
    chaseRefreshPending = true
    CreateThread(function()
        Wait(800)
        if not ChaseBootlegInterfaceOpen() then chaseRefreshPending = false return end
        chaseRequestVersion = chaseRequestVersion + 1
        local version = chaseRequestVersion
        local receiverView = (ChaseBootlegPhone and ChaseBootlegPhone.open)
            or (ChaseBootlegDashboard and ChaseBootlegDashboard.ChaseActive())
        local response = ChaseBootlegFetch('chase_bootleg:server:bootstrap', receiverView and 'listen' or ChaseBootlegClient.view)
        if version == chaseRequestVersion and response.ok and ChaseBootlegInterfaceOpen() then
            ChaseBootlegSendInterface({ type = 'chase_bootleg:snapshot', data = ChaseBootlegPrepareSnapshot(response.data) })
        end
        chaseRefreshPending = false
    end)
end

local function ChaseBootlegCallFocus()
    if ChaseBootlegClient.visible then return end
    if ChaseBootlegPhone and ChaseBootlegPhone.open then return end
    if ChaseBootlegDashboard and ChaseBootlegDashboard.ChaseActive() then return end
    local popup = chasePendingCall ~= nil
    SetNuiFocus(popup, popup)
    SetNuiFocusKeepInput(popup)
end

function ChaseBootlegClient.ChaseRestoreCallFocus()
    ChaseBootlegCallFocus()
end

function ChaseBootlegClient.ChaseHasCallFocus()
    return chasePendingCall ~= nil
end

function ChaseBootlegClient.ChaseOpen(view)
    if IsEntityDead(PlayerPedId()) then return false end
    if view == 'studio' or view == 'scanner' then
        local permissions = ChaseBootlegClient.ChaseUpdatePermissions()
        if (view == 'studio' and permissions.canOperate ~= true) or (view == 'scanner' and permissions.isPolice ~= true) then
            ChaseBootlegClient.ChaseNotify(view == 'scanner' and 'This scanner is restricted to authorized police jobs.'
                or 'The broadcast studio is restricted to authorized broadcasting jobs.', 'error')
            return false
        end
    end
    local receiver = (view == nil or view == 'listen') and ChaseBootlegDevices
        and ChaseBootlegDevices.ChaseReceiverMode() or nil
    if receiver == 'vehicle' then
        if ChaseBootlegDashboard and ChaseBootlegConfig.Dashboard and ChaseBootlegConfig.Dashboard.enabled then
            return ChaseBootlegDashboard.ChaseOpen()
        end
        local response = ChaseBootlegClient.ChaseAction('equipDevice', { device = 'vehicle' })
        if not response.ok then receiver = nil end
    end
    if ChaseBootlegDashboard then ChaseBootlegDashboard.ChaseClose() end
    ChaseBootlegClient.visible = true
    local views = { listen = true, studio = true, scanner = true, directory = true }
    ChaseBootlegClient.view = views[view] and view or 'listen'
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(false)
    if ChaseBootlegAudio.ChaseSetTalking then ChaseBootlegAudio.ChaseSetTalking(false) end
    SendNUIMessage({ type = 'chase_bootleg:visibility', visible = true, view = ChaseBootlegClient.view, receiver = receiver })
    if not IsPedInAnyVehicle(PlayerPedId(), false) then
        LocalPlayer.state:set('chase_bootleg:device', ChaseBootlegClient.view == 'scanner' and 'scanner' or nil, true)
    end
    return true
end

function ChaseBootlegClient.ChaseOpenPlaced(netId)
    if IsEntityDead(PlayerPedId()) or not NetworkDoesNetworkIdExist(netId) then return false end
    local object = NetworkGetEntityFromNetworkId(netId)
    local state = DoesEntityExist(object) and Entity(object).state['chase_bootleg:placed'] or nil
    if type(state) ~= 'table' or state.netId ~= netId then return false end
    if ChaseBootlegDashboard then ChaseBootlegDashboard.ChaseClose() end
    ChaseBootlegClient.visible = true
    ChaseBootlegClient.view = 'listen'
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(false)
    if ChaseBootlegAudio.ChaseSetTalking then ChaseBootlegAudio.ChaseSetTalking(false) end
    SendNUIMessage({ type = 'chase_bootleg:visibility', visible = true, view = 'listen', receiver = 'placed',
        placed = { netId = netId, stationId = state.stationId, frequency = state.frequency, label = state.label, ownerName = state.ownerName } })
    LocalPlayer.state:set('chase_bootleg:device', nil, true)
    return true
end

function ChaseBootlegClient.ChaseClose(keepDashboard)
    if not keepDashboard and ChaseBootlegDashboard then ChaseBootlegDashboard.ChaseClose() end
    chaseRequestVersion = chaseRequestVersion + 1
    local phoneClosed = ChaseBootlegPhone and ChaseBootlegPhone.ChaseClose(keepDashboard == true)
    if phoneClosed and not ChaseBootlegClient.visible then return end
    ChaseBootlegClient.visible = false
    ChaseBootlegCallFocus()
    if ChaseBootlegAudio.ChaseSetTalking then ChaseBootlegAudio.ChaseSetTalking(false) end
    SendNUIMessage({ type = 'chase_bootleg:visibility', visible = false })
    LocalPlayer.state:set('chase_bootleg:device', nil, true)
end

local function ChaseBootlegClearScan()
    if chaseCurrentScanBlip then RemoveBlip(chaseCurrentScanBlip) chaseCurrentScanBlip = nil end
    if chaseCurrentScanArea then RemoveBlip(chaseCurrentScanArea) chaseCurrentScanArea = nil end
end

local function ChaseBootlegShowScan(result)
    if type(result) ~= 'table' or type(result.searchArea) ~= 'table' then return end
    local area = result.searchArea
    if type(area.x) ~= 'number' or type(area.y) ~= 'number' or type(area.radius) ~= 'number' then return end
    ChaseBootlegClearScan()
    chaseCurrentScanArea = AddBlipForRadius(area.x + 0.0, area.y + 0.0, 0.0, math.max(50.0, area.radius + 0.0))
    SetBlipColour(chaseCurrentScanArea, 47)
    SetBlipAlpha(chaseCurrentScanArea, 70)
    chaseCurrentScanBlip = AddBlipForCoord(area.x + 0.0, area.y + 0.0, 0.0)
    SetBlipSprite(chaseCurrentScanBlip, 459)
    SetBlipColour(chaseCurrentScanBlip, 47)
    SetBlipScale(chaseCurrentScanBlip, 0.7)
    BeginTextCommandSetBlipName('STRING')
    AddTextComponentString('Senora Signalworks: approximate search area')
    EndTextCommandSetBlipName(chaseCurrentScanBlip)
    chaseScanExpiry = GetGameTimer() + (ChaseBootlegConfig.Scanner.historySeconds * 1000)
end

RegisterNUICallback('chase_bootleg:bootstrap', function(payload, callback)
    chaseRequestVersion = chaseRequestVersion + 1
    local version = chaseRequestVersion
    local view = type(payload) == 'table' and payload.view or nil
    local response = ChaseBootlegFetch('chase_bootleg:server:bootstrap', view or ChaseBootlegClient.view)
    if response.ok and version == chaseRequestVersion then response.data = ChaseBootlegPrepareSnapshot(response.data) end
    callback(response)
end)

function ChaseBootlegClient.ChaseAction(action, data)
    chaseRequestVersion = chaseRequestVersion + 1
    local version = chaseRequestVersion
    data = data or {}
    if (action == 'installReceiver' or action == 'moveReceiver') and data.mount == nil then
        if not ChaseBootlegDashboard or not ChaseBootlegConfig.Dashboard or not ChaseBootlegConfig.Dashboard.enabled then
            return ChaseBootlegError('Dashboard placement is unavailable on this server.', 'placement_unavailable')
        end
        local placed = ChaseBootlegDashboard.ChasePlace()
        return placed and { ok = true, data = ChaseBootlegClient.snapshot }
            or ChaseBootlegError('The dashboard placement could not be opened.', 'placement')
    end
    if action == 'installReceiver' and data.netId == nil then
        local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
        if vehicle ~= 0 then data.netId = VehToNet(vehicle) end
    end
    if ChaseBootlegDevices and ChaseBootlegDevices.ChaseBeforeAction then
        local allowed, refusal = ChaseBootlegDevices.ChaseBeforeAction(action, data)
        if allowed == false then return refusal end
    end
    local response = ChaseBootlegFetch('chase_bootleg:server:action', action, data)
    if ChaseBootlegDevices and ChaseBootlegDevices.ChaseAfterAction then ChaseBootlegDevices.ChaseAfterAction(action, response) end
    if response.ok and action == 'scan' then
        ChaseBootlegShowScan(response.data)
    elseif response.ok and version == chaseRequestVersion then
        response.data = ChaseBootlegPrepareSnapshot(response.data)
        ChaseBootlegSendInterface({ type = 'chase_bootleg:snapshot', data = response.data })
    end
    return response
end

RegisterNUICallback('chase_bootleg:action', function(payload, callback)
    if type(payload) ~= 'table' or type(payload.action) ~= 'string' or #payload.action > 40
        or (payload.data ~= nil and type(payload.data) ~= 'table') then
        callback(ChaseBootlegError('Invalid request.', 'validation'))
        return
    end
    callback(ChaseBootlegClient.ChaseAction(payload.action, payload.data))
end)

RegisterNUICallback('chase_bootleg:scan', function(payload, callback)
    local response = ChaseBootlegFetch('chase_bootleg:server:action', 'scan', type(payload) == 'table' and payload or {})
    if response.ok then ChaseBootlegShowScan(response.data) end
    callback(response)
end)

RegisterNUICallback('chase_bootleg:volume', function(payload, callback)
    local success = type(payload) == 'table' and ChaseBootlegAudio.ChaseSetVolume(payload.volume)
    callback(success and { ok = true, data = { volume = ChaseBootlegAudio.ChaseGetVolume() } }
        or ChaseBootlegError('Volume must be between 0 and 100.', 'validation'))
end)

RegisterNUICallback('chase_bootleg:talk', function(payload, callback)
    if type(payload) ~= 'table' or type(payload.pressed) ~= 'boolean' then
        callback(ChaseBootlegError('Invalid request.', 'validation'))
        return
    end
    callback({ ok = true, data = { transmitting = ChaseBootlegAudio.ChaseSetTalking(payload.pressed) } })
end)

RegisterNUICallback('chase_bootleg:close', function(_, callback)
    ChaseBootlegClient.ChaseClose()
    callback({ ok = true })
end)

RegisterNetEvent('chase_bootleg:client:refresh', function()
    if source ~= 65535 then return end
    ChaseBootlegClient.ChaseRefresh()
end)

RegisterNetEvent('chase_bootleg:client:notify', function(notification)
    if source ~= 65535 or type(notification) ~= 'table' then return end
    local tone = notification.tone == 'error' and 'error' or notification.tone == 'success' and 'success' or 'inform'
    ChaseBootlegClient.ChaseNotify(notification.message, tone)
end)

local chaseCallConfig = ChaseBootlegConfig.Calls or {}
local chaseAcceptKey = type(chaseCallConfig.acceptKey) == 'string' and chaseCallConfig.acceptKey or 'Y'
local chaseDeclineKey = type(chaseCallConfig.declineKey) == 'string' and chaseCallConfig.declineKey or 'U'

local function ChaseBootlegAnswerCall(accept)
    if not chasePendingCall or chaseCallAnswering then return end
    chaseCallAnswering = true
    local response = ChaseBootlegClient.ChaseAction('answerCall', { callId = chasePendingCall, accept = accept })
    chaseCallAnswering = false
    if not response.ok then
        ChaseBootlegClient.ChaseNotify(response.error and response.error.message or 'The call could not be answered.', 'error')
    end
end

RegisterNetEvent('chase_bootleg:client:incomingCall', function(call)
    if source ~= 65535 then return end
    local pending = type(call) == 'table' and type(call.callId) == 'number' and call or nil
    chasePendingCall = pending and pending.callId or nil
    if pending then pending.acceptKey, pending.declineKey = chaseAcceptKey, chaseDeclineKey end
    ChaseBootlegSendInterface({ type = 'chase_bootleg:incomingCall', data = pending })
    ChaseBootlegCallFocus()
end)

RegisterNetEvent('chase_bootleg:client:callState', function(call)
    if source ~= 65535 or type(call) ~= 'table' then return end
    local message = chaseCallMessages[call.state]
    if not message then return end
    ChaseBootlegSendInterface({ type = 'chase_bootleg:callState', data = call })
    lib.notify({ title = 'Senora Signalworks', description = message.text, type = message.tone })
end)

RegisterCommand('senoracallaccept', function() ChaseBootlegAnswerCall(true) end, false)
RegisterCommand('senoracalldecline', function() ChaseBootlegAnswerCall(false) end, false)
RegisterKeyMapping('senoracallaccept', 'Senora Signalworks: accept listener call', 'keyboard', chaseAcceptKey)
RegisterKeyMapping('senoracalldecline', 'Senora Signalworks: decline listener call', 'keyboard', chaseDeclineKey)
RegisterCommand(ChaseBootlegConfig.Commands.open, function() ChaseBootlegClient.ChaseOpen('listen') end, false)
RegisterCommand(ChaseBootlegConfig.Commands.studio, function() ChaseBootlegClient.ChaseOpen('studio') end, false)
RegisterCommand(ChaseBootlegConfig.Commands.scanner, function() ChaseBootlegClient.ChaseOpen('scanner') end, false)
RegisterKeyMapping(ChaseBootlegConfig.Commands.open, 'Senora Signalworks: open receiver', 'keyboard', ChaseBootlegConfig.Interaction.key)
RegisterCommand('senora', function() ChaseBootlegClient.ChaseOpen('listen') end, false)
RegisterCommand('senorastudio', function() ChaseBootlegClient.ChaseOpen('studio') end, false)
RegisterCommand('senorascan', function() ChaseBootlegClient.ChaseOpen('scanner') end, false)
RegisterCommand('senorashop', function()
    if ChaseBootlegShop then ChaseBootlegShop.ChaseOpen() end
end, false)
RegisterCommand(ChaseBootlegConfig.Commands.directory or 'senorafrequencies', function() ChaseBootlegClient.ChaseOpen('directory') end, false)

exports('ChaseOpenBootleg', function(view) return ChaseBootlegClient.ChaseOpen(view) end)
exports('ChaseCloseBootleg', function() ChaseBootlegClient.ChaseClose() end)

AddEventHandler('onClientResourceStop', function(resource)
    if resource ~= GetCurrentResourceName() then return end
    chasePendingCall = nil
    ChaseBootlegClient.ChaseClose()
    ChaseBootlegClearScan()
end)

CreateThread(function()
    while true do
        if ChaseBootlegInterfaceOpen() and IsEntityDead(PlayerPedId()) then ChaseBootlegClient.ChaseClose() end
        if chaseCurrentScanArea and GetGameTimer() > chaseScanExpiry then ChaseBootlegClearScan() end
        if ChaseBootlegInterfaceOpen() and GetGameTimer() > chaseNextLiveRefresh then
            chaseNextLiveRefresh = GetGameTimer() + 8000
            ChaseBootlegClient.ChaseRefresh()
        end
        Wait(500)
    end
end)

CreateThread(function()
    while true do
        ChaseBootlegClient.ChaseUpdatePermissions()
        Wait(5000)
    end
end)
