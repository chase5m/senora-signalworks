ChaseBootlegDashboard = {}

local config = ChaseBootlegConfig.Dashboard
local active, opening, sequence = nil, false, 0
local stopping = false
local axes = { x = { 235, 90, 90 }, y = { 90, 210, 130 }, z = { 95, 155, 255 } }

local function copyMount(value)
    local result = {}
    for _, key in ipairs({ 'x', 'y', 'z', 'rx', 'ry', 'rz' }) do result[key] = tonumber(value[key]) or 0.0 end
    return result
end

local function validVehicle(state, placing)
    local ped = PlayerPedId()
    return not stopping and ped == state.ped and not IsEntityDead(ped) and DoesEntityExist(state.vehicle)
        and GetVehiclePedIsIn(ped, false) == state.vehicle and VehToNet(state.vehicle) == state.netId
        and (not placing or (GetPedInVehicleSeat(state.vehicle, -1) == ped
            and GetEntitySpeed(state.vehicle) <= ChaseBootlegConfig.Devices.installMaximumSpeed))
end

local function vehicleError(state, placing)
    local ped = PlayerPedId()
    if IsEntityDead(ped) then return 'You cannot use a dashboard receiver while incapacitated.' end
    if not DoesEntityExist(state.vehicle) or GetVehiclePedIsIn(ped, false) ~= state.vehicle or ped ~= state.ped then
        return 'Stay seated in the same vehicle while opening the dashboard receiver.'
    end
    if state.netId == 0 or VehToNet(state.vehicle) ~= state.netId then return 'This vehicle is still loading. Wait a moment and try again.' end
    if placing and GetPedInVehicleSeat(state.vehicle, -1) ~= ped then return 'Sit in the driver seat to position the receiver.' end
    if placing and GetEntitySpeed(state.vehicle) > ChaseBootlegConfig.Devices.installMaximumSpeed then
        return 'Stop the vehicle before positioning the receiver.'
    end
    return 'The dashboard receiver is unavailable. Please try again.'
end

local function positionError(view)
    local reason = view.positionError
    if type(reason) == 'table' then reason = reason.message end
    if type(reason) == 'string' and reason ~= '' then return reason end
    return 'Receiver placement is unavailable for this vehicle. Try again while parked in the driver seat.'
end

local function clampMount(state)
    local minimum, maximum = GetModelDimensions(GetEntityModel(state.vehicle))
    for _, axis in ipairs({ 'x', 'y', 'z' }) do
        local bounds = config.placement.bounds[axis]
        local low, high = math.max(bounds.min, minimum[axis]), math.min(bounds.max, maximum[axis])
        if low > high then low, high = bounds.min, bounds.max end
        state.mount[axis] = math.max(low, math.min(high, state.mount[axis])) + 0.0
        state.mount['r' .. axis] = ((state.mount['r' .. axis] + 180.0) % 360.0) - 180.0
    end
end

local function message(state, errorMessage)
    SendNUIMessage({ type = 'chase_bootleg:dashboardEditor', data = state and {
        mode = state.mode, session = state.session, transform = state.transform, axis = state.axis, mount = state.mount,
        installed = state.installed, busy = state.busy == true, error = errorMessage,
        canMove = state.canMove == true
    } or false })
end

local function makeCamera(state)
    local receiver = ChaseBootlegDevices.ChaseVehicleReceiver(state.vehicle)
    if not receiver or not DoesEntityExist(receiver.object) then return false end
    local centre = ChaseBootlegConfig.ReceiverVisuals.display.centre
    local target = GetOffsetFromEntityInWorldCoords(receiver.object, centre.x, centre.y, centre.z)
    local position
    if state.mode == 'place' then
        position = GetPedBoneCoords(PlayerPedId(), 31086, 0.06, 0.04, 0.0)
    else
        position = GetOffsetFromEntityInWorldCoords(receiver.object, centre.x,
            centre.y - config.interaction.cameraDistance, centre.z + 0.01)
    end
    local offset = GetOffsetFromEntityGivenWorldCoords(state.vehicle, position.x, position.y, position.z)
    state.camera = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
    if not state.camera or state.camera == 0 then state.camera = nil return false end

    SetCamUseShallowDofMode(state.camera, false)
    SetCamDofStrength(state.camera, 0.0)
    SetCamMotionBlurStrength(state.camera, 0.0)
    AttachCamToEntity(state.camera, state.vehicle, offset.x + 0.0, offset.y + 0.0, offset.z + 0.0, true)
    local delta = target - position
    state.yaw = math.deg(math.atan(-delta.x, delta.y))
    state.pitch = math.deg(math.atan(delta.z, math.sqrt(delta.x * delta.x + delta.y * delta.y)))
    SetCamRot(state.camera, state.pitch + 0.0, 0.0, state.yaw + 0.0, 2)
    SetCamFov(state.camera, state.mode == 'place' and config.placement.cameraFov + 0.0 or config.interaction.cameraFov + 0.0)
    if state.mode == 'interact' then
        PointCamAtEntity(state.camera, receiver.object, centre.x + 0.0, centre.y + 0.0, centre.z + 0.0, true)
        state.cameraTarget = receiver.object
    end
    RenderScriptCams(true, true, 250, true, false)
    return true
end

function ChaseBootlegDashboard.ChaseActive()
    return active ~= nil or opening ~= false
end

function ChaseBootlegDashboard.ChaseClose(savedMount)
    opening = false
    local state = active
    if not state then return end
    active = nil
    local receiver = ChaseBootlegDevices.ChaseVehicleReceiver(state.vehicle)
    if state.mouseDown and receiver and receiver.dui == state.pointerDui then SendDuiMouseUp(receiver.dui, 'left') end
    if state.mode == 'place' then ChaseBootlegDevices.ChaseEndVehiclePreview(state.vehicle, savedMount) end
    if state.camera then
        RenderScriptCams(false, true, 200, true, false)
        DestroyCam(state.camera, false)
    end
    if state.focused then
        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)
    end
    message(nil)
    if not stopping and state.focused and ChaseBootlegClient.ChaseRestoreCallFocus then ChaseBootlegClient.ChaseRestoreCallFocus() end
end

local function snapshot(state)
    local success, response = pcall(lib.callback.await, 'chase_bootleg:server:bootstrap', false, 'listen')
    if opening ~= state or stopping then return nil end
    if not success or type(response) ~= 'table' or not response.ok or type(response.data) ~= 'table' then
        local detail = type(response) == 'table' and type(response.error) == 'table' and response.error.message
        ChaseBootlegClient.ChaseNotify(detail or 'The receiver could not reach the server.', 'error')
        return nil
    end
    local devices = response.data.devices
    local view = type(devices) == 'table' and devices.vehicle
    if type(view) ~= 'table' or view.netId ~= state.netId then
        ChaseBootlegClient.ChaseNotify('The server could not identify the vehicle you are sitting in. Wait a moment and try again.', 'error')
        return nil
    end
    return response.data, view
end

local function request(action, data)
    local success, response = pcall(ChaseBootlegClient.ChaseAction, action, data)
    if success and type(response) == 'table' and type(response.ok) == 'boolean' then
        if not response.ok and type(response.error) ~= 'table' then response.error = { message = 'The receiver request failed. Please try again.' } end
        return response
    end
    return { ok = false, error = { message = 'The receiver could not reach the server. Please try again.' } }
end

local function preview(state)
    return ChaseBootlegDevices.ChasePreviewVehicle(state.vehicle, state.mount, function()
        return active == state and validVehicle(state, true)
    end)
end

local function focusAvailable()
    return not IsNuiFocused() or ChaseBootlegClient.visible or ChaseBootlegPhone and ChaseBootlegPhone.open
        or ChaseBootlegClient.ChaseHasCallFocus and ChaseBootlegClient.ChaseHasCallFocus()
end

local function waitForFocus(state)
    local deadline = GetGameTimer() + 250
    while opening == state and validVehicle(state, state.mode == 'place') and not focusAvailable() and GetGameTimer() < deadline do Wait(25) end
    return opening == state and validVehicle(state, state.mode == 'place') and focusAvailable()
end

local function begin(vehicle, mode)
    if stopping or active or opening then return false end
    if not config.enabled then ChaseBootlegClient.ChaseNotify('Dashboard receivers are disabled on this server.', 'error') return false end
    if vehicle == 0 then ChaseBootlegClient.ChaseNotify('Sit in a vehicle to use its dashboard receiver.', 'error') return false end
    local state = { vehicle = vehicle, netId = VehToNet(vehicle), ped = PlayerPedId(), mode = mode, transform = 'move', axis = 'x' }
    if state.netId == 0 or not validVehicle(state, mode == 'place') then
        ChaseBootlegClient.ChaseNotify(vehicleError(state, mode == 'place'), 'error') return false
    end
    opening = state
    if not waitForFocus(state) then
        if opening == state then
            opening = false
            ChaseBootlegClient.ChaseNotify(not validVehicle(state, mode == 'place') and vehicleError(state, mode == 'place')
                or 'Close the other menu, then open the dashboard receiver again.', 'error')
        end
        return false
    end
    local data, vehicleView = snapshot(state)
    if opening ~= state then return false end
    opening = false
    if not data then return false end
    if not validVehicle(state, mode == 'place') then ChaseBootlegClient.ChaseNotify(vehicleError(state, mode == 'place'), 'error') return false end
    if not focusAvailable() then ChaseBootlegClient.ChaseNotify('Close the other menu, then open the dashboard receiver again.', 'error') return false end
    if mode == 'place' and not (vehicleView.installed and vehicleView.canMove or not vehicleView.installed and vehicleView.canInstall) then
        ChaseBootlegClient.ChaseNotify(positionError(vehicleView), 'error') return false
    end
    if mode == 'interact' and not vehicleView.installed then
        ChaseBootlegClient.ChaseNotify('Use a Dash Receiver item to install a screen in this vehicle.', 'error') return false
    end
    local owned = type(data.devices.owned) == 'table' and tonumber(data.devices.owned.vehicle) or 0
    if mode == 'place' and not vehicleView.installed and owned < 1 then
        ChaseBootlegClient.ChaseNotify('You need a Dash Receiver item to install one.', 'error') return false
    end
    state.installed, state.canMove, state.snapshot = vehicleView.installed, vehicleView.canMove, data
    state.mount = copyMount(vehicleView.mount or ChaseBootlegDevices.ChaseVehicleMount(vehicle)
        or { x = 0.0, y = 0.55, z = 0.6, rx = 0.0, ry = 0.0, rz = 0.0 })
    state.original = copyMount(state.mount)
    sequence = sequence + 1
    state.session = ('%s:%s:%s'):format(GetGameTimer(), sequence, state.netId)
    ChaseBootlegClient.snapshot = data
    ChaseBootlegClient.ChaseClose(true)
    active = state
    if mode == 'place' then
        clampMount(state)
        if not preview(state) then
            if active == state then ChaseBootlegDashboard.ChaseClose() end
            return false
        end
    else
        local response = request('equipDevice', { device = 'vehicle' })
        if active ~= state then return false end
        if not validVehicle(state, false) then ChaseBootlegDashboard.ChaseClose() return false end
        if not response.ok then
            ChaseBootlegDashboard.ChaseClose()
            ChaseBootlegClient.ChaseNotify(response.error and response.error.message or 'The receiver could not be equipped.', 'error') return false
        end
        if type(response.data) == 'table' then state.snapshot = response.data end
    end
    local deadline = GetGameTimer() + 5000
    local receiver = ChaseBootlegDevices.ChaseVehicleReceiver(vehicle)
    while active == state and validVehicle(state, mode == 'place') and (not receiver or not receiver.ready) and GetGameTimer() < deadline do
        Wait(25)
        receiver = ChaseBootlegDevices.ChaseVehicleReceiver(vehicle)
    end
    if active ~= state then return false end
    if not validVehicle(state, mode == 'place') or not receiver or not receiver.ready or not focusAvailable() or not makeCamera(state) then
        ChaseBootlegDashboard.ChaseClose()
        ChaseBootlegClient.ChaseNotify('The dashboard screen could not load. Please try again.', 'error') return false
    end
    state.focused = true
    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)
    SetCursorLocation(0.5, 0.5)
    message(state)
    return true
end

function ChaseBootlegDashboard.ChasePlace(vehicle)
    return begin(vehicle or GetVehiclePedIsIn(PlayerPedId(), false), 'place')
end

function ChaseBootlegDashboard.ChaseOpen(vehicle)
    return begin(vehicle or GetVehiclePedIsIn(PlayerPedId(), false), 'interact')
end

function ChaseBootlegDashboard.ChaseUpdateSnapshot(data)
    local state = active
    local devices = type(data) == 'table' and data.devices
    local vehicle = type(devices) == 'table' and devices.vehicle
    if not state or type(vehicle) ~= 'table' or vehicle.netId ~= state.netId or not validVehicle(state, state.mode == 'place') then return false end
    state.snapshot, state.canMove = data, vehicle.canMove == true
    return true
end

function ChaseBootlegDashboard.ChaseDisplay(vehicle, view)
    local state = active
    view.resource = GetCurrentResourceName()
    view.minFrequency, view.maxFrequency = ChaseBootlegConfig.Frequency.min, ChaseBootlegConfig.Frequency.max
    view.interactive = state ~= nil and state.vehicle == vehicle and state.mode == 'interact'
        and validVehicle(state, false)
    if view.interactive then
        view.session, view.stations, view.canMove = state.session, state.snapshot.stations, state.canMove
        local confirmed = state.confirmedDisplay
        if confirmed then
            local caughtUp = view.enabled == confirmed.enabled and (not confirmed.enabled or view.frequency == confirmed.frequency)
            if caughtUp or GetGameTimer() >= confirmed.expires then state.confirmedDisplay = nil
            else
                view.frequency, view.label, view.enabled = confirmed.frequency, confirmed.label, confirmed.enabled
            end
        end
        local frequency = view.frequency
        local validFrequency = type(frequency) == 'number' and frequency >= view.minFrequency and frequency <= view.maxFrequency
        if view.enabled and validFrequency then state.lastFrequency = frequency
        elseif not view.enabled and state.lastFrequency then view.frequency = state.lastFrequency end
    end
    view.volume = ChaseBootlegAudio.ChaseGetVolume()
    return view
end

local function currentDisplay(state)
    local receiver = ChaseBootlegDevices.ChaseVehicleReceiver(state.vehicle)
    local stored = receiver and receiver.state or {}
    return ChaseBootlegDashboard.ChaseDisplay(state.vehicle, {
        frequency = stored.frequency, label = stored.label or 'Senora Signalworks',
        enabled = stored.enabled == true, quality = stored.quality or 0.0
    })
end

local function confirmTuning(state, data)
    local devices = type(data) == 'table' and data.devices
    if type(devices) ~= 'table' or devices.active ~= 'vehicle' or type(devices.vehicle) ~= 'table'
        or devices.vehicle.netId ~= state.netId then return end
    local selected
    for _, station in ipairs(data.stations or {}) do
        if station.id == devices.tunedStationId then selected = station break end
    end
    if devices.tunedStationId and not selected then return end

    local receiver = ChaseBootlegDevices.ChaseVehicleReceiver(state.vehicle)
    local previousFrequency = state.lastFrequency or receiver and receiver.state and receiver.state.frequency
    if type(previousFrequency) ~= 'number' or previousFrequency < ChaseBootlegConfig.Frequency.min
        or previousFrequency > ChaseBootlegConfig.Frequency.max then previousFrequency = nil end
    state.lastFrequency = selected and selected.frequency or previousFrequency
    state.confirmedDisplay = {
        frequency = selected and selected.frequency or previousFrequency,
        label = selected and selected.name or 'No station selected', enabled = selected ~= nil,
        expires = GetGameTimer() + 2000
    }
end

local function projected(world)
    local visible, x, y = GetScreenCoordFromWorldCoord(world.x + 0.0, world.y + 0.0, world.z + 0.0)
    if not visible then return nil end
    local width, height = GetActiveScreenResolution()
    return { x = x * width, y = y * height }
end

local function axisPoints(state, axis)
    local origin = GetOffsetFromEntityInWorldCoords(state.vehicle, state.mount.x, state.mount.y, state.mount.z)
    local offset = copyMount(state.mount)
    offset[axis] = offset[axis] + config.placement.axisLength
    return origin, GetOffsetFromEntityInWorldCoords(state.vehicle, offset.x, offset.y, offset.z)
end

local function segmentDistance(cursor, start, finish)
    local x, y = finish.x - start.x, finish.y - start.y
    local length = x*x + y*y
    if length < 4 then return math.huge end
    local amount = math.max(0.1, math.min(1.0, ((cursor.x-start.x)*x + (cursor.y-start.y)*y)/length))
    return math.sqrt((cursor.x-start.x-amount*x)^2 + (cursor.y-start.y-amount*y)^2)
end

local function updatePlacement(state, cursor)
    local hover, nearest, chosenStart, chosenEnd = nil, 16.0, nil, nil
    for axis, colour in pairs(axes) do
        local start, finish = axisPoints(state, axis)
        DrawLine(start.x, start.y, start.z, finish.x, finish.y, finish.z, colour[1], colour[2], colour[3], 255)
        DrawMarker(28, finish.x, finish.y, finish.z, 0.0,0.0,0.0,0.0,0.0,0.0,
            0.018,0.018,0.018,colour[1],colour[2],colour[3],255,false,false,2,false,nil,nil,false)
        local a, b = projected(start), projected(finish)
        if a and b then
            local distance = segmentDistance(cursor, a, b)
            if distance < nearest then hover, nearest, chosenStart, chosenEnd = axis, distance, a, b end
        end
    end
    if not state.busy and hover and IsDisabledControlJustPressed(0, 24) then
        state.axis = hover
        state.drag = { cursor = cursor, origin = chosenStart, endpoint = chosenEnd, mount = copyMount(state.mount) }
        message(state)
    end
    if state.drag and not IsDisabledControlPressed(0, 24) then state.drag = nil end
    if state.drag and not state.busy then
        local drag = state.drag
        local dx, dy = cursor.x - drag.cursor.x, cursor.y - drag.cursor.y
        local field = state.transform == 'rotate' and 'r' .. state.axis or state.axis
        local delta = state.transform == 'rotate' and (dx - dy) * 0.4
            or ChaseBootlegDashboardMath.ChaseAxisDelta(drag.origin, drag.endpoint, dx, dy, config.placement.axisLength)
        if delta then
            state.mount[field] = drag.mount[field] + delta * (IsDisabledControlPressed(0, 21) and 0.2 or 1.0)
            clampMount(state)
            preview(state)
            if GetGameTimer() >= (state.nextReadout or 0) then
                state.nextReadout = GetGameTimer() + 150
                message(state)
            end
        end
    end
    if IsDisabledControlPressed(0, 25) and not state.drag then
        state.yaw = state.yaw - GetDisabledControlNormal(0, 1) * 5.0
        state.pitch = math.max(-80.0, math.min(80.0, state.pitch - GetDisabledControlNormal(0, 2) * 5.0))
        SetCamRot(state.camera, state.pitch + 0.0, 0.0, state.yaw + 0.0, 2)
    end
end

local function updatePointer(state, cursor)
    local receiver = ChaseBootlegDevices.ChaseVehicleReceiver(state.vehicle)
    if receiver and receiver.object and DoesEntityExist(receiver.object) and state.cameraTarget ~= receiver.object then
        local centre = ChaseBootlegConfig.ReceiverVisuals.display.centre
        PointCamAtEntity(state.camera, receiver.object, centre.x + 0.0, centre.y + 0.0, centre.z + 0.0, true)
        state.cameraTarget = receiver.object
    end
    if not receiver or not receiver.ready or not receiver.dui then state.mouseDown, state.pointerDui = false, nil return end
    if state.pointerDui ~= receiver.dui then state.mouseDown = false state.pointerDui = receiver.dui end
    local corners, complete = {}, true
    for index, world in ipairs({ ChaseBootlegDevices.ChaseReceiverCorners(receiver) }) do
        corners[index] = projected(world)
        if not corners[index] then complete = false end
    end
    local u, v
    if complete then u, v = ChaseBootlegDashboardMath.ChaseUv(corners, cursor) end
    if u then
        local display = ChaseBootlegConfig.ReceiverVisuals.display
        SendDuiMouseMove(receiver.dui, math.floor(u*(display.width-1)), math.floor(v*(display.height-1)))
        if not state.busy and IsDisabledControlJustPressed(0, 24) then SendDuiMouseDown(receiver.dui, 'left') state.mouseDown = true end
        if not state.busy and IsDisabledControlJustPressed(0, 241) then SendDuiMouseWheel(receiver.dui, 100, 0) end
        if not state.busy and IsDisabledControlJustPressed(0, 242) then SendDuiMouseWheel(receiver.dui, -100, 0) end
    else
        SendDuiMouseMove(receiver.dui, -1, -1)
    end
    if state.mouseDown and not IsDisabledControlPressed(0, 24) then SendDuiMouseUp(receiver.dui, 'left') state.mouseDown = false end
end

RegisterNUICallback('chase_bootleg:dashboardEditor', function(payload, callback)
    local state = active
    if not state or type(payload) ~= 'table' or payload.session ~= state.session then callback({ ok = false }) return end
    if payload.command == 'cancel' then ChaseBootlegDashboard.ChaseClose() callback({ ok = true }) return end
    if state.busy then callback({ ok = false }) return end
    if state.mode ~= 'place' or not validVehicle(state, true) then callback({ ok = false }) return end
    if payload.command == 'mode' then state.transform = payload.mode == 'rotate' and 'rotate' or 'move' state.drag = nil
    elseif payload.command == 'axis' and axes[payload.axis] then state.axis = payload.axis state.drag = nil
    elseif payload.command == 'reset' then state.mount = copyMount(state.original) state.drag = nil
    elseif payload.command == 'nudge' then
        local field = state.transform == 'rotate' and 'r' .. state.axis or state.axis
        local step = state.transform == 'rotate' and config.placement.rotateStep or config.placement.moveStep
        state.mount[field] = state.mount[field] + (payload.direction == -1 and -1.0 or 1.0) * step * (payload.fine == true and 0.2 or 1.0)
    elseif payload.command == 'save' then
        state.busy = true
        state.drag = nil
        message(state)
        local submitted = copyMount(state.mount)
        local response = request(state.installed and 'moveReceiver' or 'installReceiver', { netId = state.netId, mount = submitted })
        state.busy = false
        if active == state then
            if not validVehicle(state, true) then
                ChaseBootlegDashboard.ChaseClose()
            elseif response.ok then
                local devices = type(response.data) == 'table' and response.data.devices
                local vehicle = type(devices) == 'table' and devices.vehicle
                local confirmed = type(vehicle) == 'table' and vehicle.netId == state.netId and vehicle.mount
                ChaseBootlegDashboard.ChaseClose(type(confirmed) == 'table' and copyMount(confirmed) or submitted)
                ChaseBootlegClient.ChaseNotify('Dashboard receiver position saved. Open the receiver to use its screen.', 'success')
            else message(state, response.error and response.error.message or 'The position could not be saved.') end
        end
        callback(response) return
    else callback({ ok = false }) return end
    clampMount(state)
    preview(state)
    message(state)
    callback({ ok = true })
end)

RegisterNUICallback('chase_bootleg:dashboard', function(payload, callback)
    local state = active
    if not state or state.mode ~= 'interact' or state.busy or type(payload) ~= 'table'
        or payload.session ~= state.session or not validVehicle(state, false) then callback({ ok = false, error = { message = 'Receiver session closed.' } }) return end
    local action, data = payload.action, type(payload.data) == 'table' and payload.data or {}
    if action == 'close' then ChaseBootlegDashboard.ChaseClose() callback({ ok = true }) return end
    if action == 'move' then
        local vehicle = state.vehicle
        ChaseBootlegDashboard.ChaseClose()
        callback({ ok = true })
        CreateThread(function() ChaseBootlegDashboard.ChasePlace(vehicle) end)
        return
    end
    if action == 'volume' then
        local changed = ChaseBootlegAudio.ChaseSetVolume(data.volume) == true
        callback({ ok = changed, data = changed and currentDisplay(state) or nil }) return
    end
    if action ~= 'tune' and action ~= 'untune' then callback({ ok = false }) return end
    state.busy = true
    local response = request(action, { stationId = data.stationId, frequency = data.frequency })
    state.busy = false
    if active == state then
        if not validVehicle(state, false) then ChaseBootlegDashboard.ChaseClose()
        elseif response.ok and type(response.data) == 'table' then
            state.snapshot = response.data
            confirmTuning(state, response.data)
        end
    end
    if response.ok and active == state then callback({ ok = true, data = currentDisplay(state) })
    else callback(response) end
end)

RegisterCommand(config.commands.open, function() ChaseBootlegDashboard.ChaseOpen() end, false)
RegisterCommand(config.commands.position, function() ChaseBootlegDashboard.ChasePlace() end, false)

CreateThread(function()
    while true do
        local state = active
        if state and state.camera then
            if not validVehicle(state, state.mode == 'place') or IsPauseMenuActive() then
                ChaseBootlegDashboard.ChaseClose()
            else
                DisableAllControlActions(0)
                SetEntityLocallyInvisible(PlayerPedId())
                local x, y = GetNuiCursorPosition()
                local cursor = { x = x, y = y }
                if state.mode == 'place' then updatePlacement(state, cursor) else updatePointer(state, cursor) end
            end
            Wait(0)
        else Wait(100) end
    end
end)

AddEventHandler('onClientResourceStop', function(resource)
    if resource == GetCurrentResourceName() then stopping = true ChaseBootlegDashboard.ChaseClose() end
end)
