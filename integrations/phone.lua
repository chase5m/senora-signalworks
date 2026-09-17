ChaseBootlegPhone = { registered = false, open = false }

local function ChaseBootlegPhoneVisibility(visible)
    ChaseBootlegPhone.open = visible == true
    if ChaseBootlegAudio.ChaseSetTalking then ChaseBootlegAudio.ChaseSetTalking(false) end
    SendNUIMessage({ type = 'chase_bootleg:phoneVisibility', visible = ChaseBootlegPhone.open })
end

function ChaseBootlegPhone.ChaseSend(message)
    if not ChaseBootlegPhone.open or not ChaseBootlegPhone.registered then return end
    pcall(function()
        exports[ChaseBootlegConfig.Phone.resource]:SendCustomAppMessage(ChaseBootlegConfig.Phone.identifier, message)
    end)
end

function ChaseBootlegPhone.ChaseClose(stowDevice)
    if not ChaseBootlegPhone.open then return false end
    ChaseBootlegPhoneVisibility(false)
    pcall(function()
        exports[ChaseBootlegConfig.Phone.resource]:CloseApp({ app = ChaseBootlegConfig.Phone.identifier })
        if stowDevice then exports[ChaseBootlegConfig.Phone.resource]:ToggleOpen(false) end
    end)
    return true
end

local function ChaseBootlegRegisterPhone()
    local config = ChaseBootlegConfig.Phone
    if not config.enabled or ChaseBootlegPhone.registered or GetResourceState(config.resource) ~= 'started' then return end
    local success, registered, failure = pcall(function()
        return exports[config.resource]:AddCustomApp({
            identifier = config.identifier,
            name = 'Senora Signalworks',
            description = 'Your city. Your frequency. Tune in to live player radio.',
            defaultApp = true,
            size = 350,
            ui = GetCurrentResourceName() .. '/web/index.html?phone=1&resource=' .. GetCurrentResourceName(),
            icon = 'https://cfx-nui-' .. GetCurrentResourceName() .. '/web/chase_bootleg_icon.svg',
            fixBlur = true,
            onOpen = function() ChaseBootlegPhoneVisibility(true) end,
            onClose = function() ChaseBootlegPhoneVisibility(false) end,
        })
    end)
    ChaseBootlegPhone.registered = success and registered == true
    if not ChaseBootlegPhone.registered then
        print(('[chase_bootleg] Phone registration unavailable: %s'):format(tostring(failure or registered)))
    end
end

CreateThread(function()
    if not ChaseBootlegConfig.Phone.enabled then return end
    Wait(1500)
    for _ = 1, 10 do
        ChaseBootlegRegisterPhone()
        if ChaseBootlegPhone.registered then return end
        Wait(5000)
    end
end)

AddEventHandler('onClientResourceStart', function(resource)
    if resource == ChaseBootlegConfig.Phone.resource then
        ChaseBootlegPhone.registered = false
        SetTimeout(1500, ChaseBootlegRegisterPhone)
    end
end)

AddEventHandler('onClientResourceStop', function(resource)
    if resource == ChaseBootlegConfig.Phone.resource then
        ChaseBootlegPhone.registered = false
        ChaseBootlegPhoneVisibility(false)
    elseif resource == GetCurrentResourceName() and ChaseBootlegPhone.registered then
        pcall(function()
            exports[ChaseBootlegConfig.Phone.resource]:RemoveCustomApp(ChaseBootlegConfig.Phone.identifier)
        end)
    end
end)
