ChaseBootlegShop = {}

local chaseShopPed, chaseShopBlip, chaseShopTarget = nil, nil, false
local chaseShopStopping = false
local chaseShopOpening = false

local function ChaseShopPurchase(device)
    local response = ChaseBootlegClient.ChaseAction('buyDevice', { device = device })
    if not response.ok then ChaseBootlegClient.ChaseNotify(response.error and response.error.message or 'The purchase could not be completed.', 'error') end
end

function ChaseBootlegShop.ChaseOpen()
    if chaseShopOpening or IsEntityDead(PlayerPedId()) then return false end
    chaseShopOpening = true
    local success, response = pcall(function()
        return lib.callback.await('chase_bootleg:server:shop', false)
    end)
    chaseShopOpening = false
    if not success or type(response) ~= 'table' or not response.ok then
        ChaseBootlegClient.ChaseNotify(type(response) == 'table' and response.error and response.error.message
            or 'The electronics shop is unavailable. Please try again.', 'error')
        return false
    end
    local shop = response.data
    ChaseBootlegClient.ChaseClose()
    if shop.provider == 'ox_inventory' then
        if not shop.pending or #shop.pending == 0 then
            return exports.ox_inventory:openInventory('shop', { type = shop.type, id = shop.id }) ~= false
        end
        local options = {{ title = 'View shop', icon = 'basket-shopping', onSelect = function()
            exports.ox_inventory:openInventory('shop', { type = shop.type, id = shop.id })
        end }}
        for _, product in ipairs(shop.pending) do
            options[#options + 1] = { title = 'Collect ' .. product.label,
                description = 'Already paid · no additional charge', icon = 'receipt',
                onSelect = function() ChaseShopPurchase(product.device) end }
        end
        lib.registerContext({ id = 'chase_bootleg:electronics', title = 'Senora Electronics', options = options })
        lib.showContext('chase_bootleg:electronics')
        return true
    end
    local options = {}
    for _, product in ipairs(shop.products or {}) do
        options[#options + 1] = {
            title = product.label,
            description = product.pending and 'Collect your already-paid receiver.'
                or ('%s%s · Paid from your %s account'):format(ChaseBootlegConfig.Currency, product.price, ChaseBootlegConfig.MoneyAccount),
            icon = 'radio',
            onSelect = function() ChaseShopPurchase(product.device) end
        }
    end
    lib.registerContext({ id = 'chase_bootleg:electronics', title = 'Senora Electronics', options = options })
    lib.showContext('chase_bootleg:electronics')
    return true
end

local function ChaseShopRemovePed()
    if not chaseShopPed then return end
    if chaseShopTarget and GetResourceState('ox_target') == 'started' then
        exports.ox_target:removeLocalEntity(chaseShopPed, 'chase_bootleg:shop')
    end
    if DoesEntityExist(chaseShopPed) then DeleteEntity(chaseShopPed) end
    chaseShopPed, chaseShopTarget = nil, false
end

local function ChaseShopCreatePed(shop)
    local hash = joaat(shop.ped or 'a_m_y_business_03')
    if not IsModelInCdimage(hash) or not IsModelValid(hash) then return end
    RequestModel(hash)
    local deadline = GetGameTimer() + 4000
    while not HasModelLoaded(hash) and not chaseShopStopping and GetGameTimer() < deadline do Wait(25) end
    if chaseShopStopping or not HasModelLoaded(hash) then SetModelAsNoLongerNeeded(hash) return end
    local position = shop.position
    RequestCollisionAtCoord(position.x + 0.0, position.y + 0.0, position.z + 0.0)
    local found, ground = GetGroundZFor_3dCoord(position.x + 0.0, position.y + 0.0, position.z + 3.0, false)
    local z = found and math.abs(ground - position.z) < 2.0 and ground or position.z
    chaseShopPed = CreatePed(4, hash, position.x + 0.0, position.y + 0.0, z + 0.0,
        (position.w or 144.0) + 0.0, false, false)
    SetModelAsNoLongerNeeded(hash)
    if chaseShopPed == 0 then chaseShopPed = nil return end
    SetEntityAsMissionEntity(chaseShopPed, true, true)
    SetEntityInvincible(chaseShopPed, true)
    SetBlockingOfNonTemporaryEvents(chaseShopPed, true)
    FreezeEntityPosition(chaseShopPed, true)
    TaskStartScenarioInPlace(chaseShopPed, 'WORLD_HUMAN_CLIPBOARD', 0, true)
    if GetResourceState('ox_target') == 'started' and ChaseBootlegConfig.Interaction.target ~= 'none' then
        exports.ox_target:addLocalEntity(chaseShopPed, {{
            name = 'chase_bootleg:shop', label = 'Browse Senora electronics', icon = 'fa-solid fa-radio', distance = 2.2,
            onSelect = function() ChaseBootlegShop.ChaseOpen() end
        }})
        chaseShopTarget = true
    end
end

CreateThread(function()
    local devices = ChaseBootlegConfig.Devices
    local shop = devices and devices.Shop
    if not devices or not devices.enabled or not devices.shopEnabled or not shop then return end
    local blip = type(shop.blip) == 'table' and shop.blip or {}
    if shop.blip ~= false and blip.enabled ~= false then
        chaseShopBlip = AddBlipForCoord(shop.position.x + 0.0, shop.position.y + 0.0, shop.position.z + 0.0)
        SetBlipSprite(chaseShopBlip, blip.sprite or 521)
        SetBlipColour(chaseShopBlip, blip.colour or 0)
        SetBlipScale(chaseShopBlip, (blip.scale or 0.7) + 0.0)
        SetBlipAsShortRange(chaseShopBlip, true)
        BeginTextCommandSetBlipName('STRING')
        AddTextComponentString(blip.label or 'Senora Electronics · Legion Square')
        EndTextCommandSetBlipName(chaseShopBlip)
    end
    while not chaseShopStopping do
        local distance = #(GetEntityCoords(PlayerPedId()) - vector3(shop.position.x, shop.position.y, shop.position.z))
        if distance < 80.0 and not chaseShopPed then ChaseShopCreatePed(shop)
        elseif distance > 95.0 then ChaseShopRemovePed() end
        local sleep = 750
        if chaseShopPed and not chaseShopTarget and distance < 2.5 and not IsEntityDead(PlayerPedId()) and not IsPedInAnyVehicle(PlayerPedId(), false)
            and not ChaseBootlegClient.visible and not (ChaseBootlegPhone and ChaseBootlegPhone.open) then
            sleep = 0
            BeginTextCommandDisplayHelp('STRING')
            AddTextComponentSubstringPlayerName('Press ~INPUT_CONTEXT~ to browse ~y~Senora electronics')
            EndTextCommandDisplayHelp(0, false, true, -1)
            if IsControlJustReleased(0, ChaseBootlegConfig.Interaction.control) then ChaseBootlegShop.ChaseOpen() end
        end
        Wait(sleep)
    end
end)

AddEventHandler('onClientResourceStop', function(resource)
    if resource ~= GetCurrentResourceName() then return end
    chaseShopStopping = true
    ChaseShopRemovePed()
    if chaseShopBlip then RemoveBlip(chaseShopBlip) end
end)
