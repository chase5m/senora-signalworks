ChaseBootlegAcoustics = {}

local acousticState
local pendingProbe

local function clamp(value, minimum, maximum, fallback)
    value = tonumber(value)
    if not value or value ~= value then return fallback end
    return math.max(minimum, math.min(maximum, value))
end

local function position(value)
    if not value or type(value.x) ~= 'number' or type(value.y) ~= 'number' or type(value.z) ~= 'number' then return nil end
    return { x = value.x, y = value.y, z = value.z }
end

local function distance(left, right)
    local x, y, z = left.x - right.x, left.y - right.y, left.z - right.z
    return math.sqrt(x * x + y * y + z * z)
end

local function networkEntity(netId)
    if type(netId) ~= 'number' or netId <= 0 or not NetworkDoesEntityExistWithNetworkId(netId) then return nil end
    local entity = NetworkGetEntityFromNetworkId(netId)
    return entity ~= 0 and DoesEntityExist(entity) and entity or nil
end

local function emitter(reception)
    local vehicle = networkEntity(reception.vehicleNetId)
    local object = networkEntity(reception.emitterNetId)
    if object then return position(GetEntityCoords(object)), object, vehicle end
    if type(reception.emitterSource) == 'number' then
        local player = GetPlayerFromServerId(reception.emitterSource)
        if player ~= -1 then
            local ped = GetPlayerPed(player)
            if ped ~= 0 and DoesEntityExist(ped) then
                local source = position(GetEntityCoords(ped))
                source.z = source.z + 0.9
                local cabin = GetVehiclePedIsIn(ped, false)
                return source, ped, cabin ~= 0 and cabin or vehicle
            end
        end
    end
    if vehicle then
        local source = position(GetEntityCoords(vehicle))
        source.z = source.z + 0.6
        return source, vehicle, vehicle
    end
    return position(reception.emitterPosition), 0, vehicle
end

local function cabinOpenness(vehicle)
    local class = GetVehicleClass(vehicle)
    if class == 8 or class == 13 or class == 14 then return 1.0 end
    if IsVehicleAConvertible(vehicle, false) then
        local roof = GetConvertibleRoofState(vehicle)
        if roof == 1 or roof == 2 or roof == 3 or roof == 6 then return 1.0 end
    end
    local openness = 0.0
    local doors = { 'door_dside_f', 'door_pside_f', 'door_dside_r', 'door_pside_r' }
    for index, bone in ipairs(doors) do
        if GetEntityBoneIndexByName(vehicle, bone) ~= -1 then
            if IsVehicleDoorDamaged(vehicle, index - 1) then return 1.0 end
            openness = math.max(openness, clamp(GetVehicleDoorAngleRatio(vehicle, index - 1), 0.0, 1.0, 0.0))
        end
    end
    local windows = { 'window_lf', 'window_rf', 'window_lr', 'window_rr' }
    for index, bone in ipairs(windows) do
        if GetEntityBoneIndexByName(vehicle, bone) ~= -1 and not IsVehicleWindowIntact(vehicle, index - 1) then return 1.0 end
    end
    return math.min(1.0, openness * 2.0)
end

local function smoothstep(value)
    value = math.max(0.0, math.min(1.0, value))
    return value * value * (3.0 - 2.0 * value)
end

local function profileFor(device)
    local configured = ChaseBootlegConfig.ReceiverAudio and ChaseBootlegConfig.ReceiverAudio[device] or {}
    return { low = clamp(configured.low, 20.0, 1500.0, 20.0),
        high = clamp(configured.high, 2000.0, 20000.0, 20000.0),
        distortion = clamp(configured.distortion, 0.0, 0.3, 0.0) }
end

local function updateProbe(state, listener, source, ignored, now, config)
    if pendingProbe then
        local status, hit = GetShapeTestResult(pendingProbe.handle)
        if status ~= 1 or (now - pendingProbe.startedAt) % 4294967296 >= 1000 then
            if status == 2 and pendingProbe.state == state then state.blocked = hit == true or hit == 1 end
            pendingProbe = nil
        end
    end
    if pendingProbe or now - state.probeAt < clamp(config.probeMilliseconds, 100, 2000, 250) then return end
    state.probeAt = now
    local handle = StartShapeTestLosProbe(listener.x + 0.0, listener.y + 0.0, listener.z + 0.0,
        source.x + 0.0, source.y + 0.0, source.z + 0.0, 81, ignored, 4)
    if handle and handle ~= 0 then pendingProbe = { handle = handle, state = state, startedAt = now } end
end

function ChaseBootlegAcoustics.ChaseReset()
    acousticState = nil
end

function ChaseBootlegAcoustics.ChaseResolve(reception)
    local config = ChaseBootlegConfig.Acoustics or {}
    local device = reception and reception.device
    local gain = clamp(reception and reception.gain, 0.0, 1.0, 1.0)
    local profile = profileFor(device)
    if gain == 0.0 or config.enabled == false or not reception or reception.participant or (device ~= 'portable' and device ~= 'vehicle')
        or (not reception.emitterPosition and not reception.emitterNetId and not reception.vehicleNetId and not reception.emitterSource) then
        acousticState = nil
        return gain, profile
    end
    local source, ignored, sourceVehicle = emitter(reception)
    if not source then return gain, profile end
    local ped = PlayerPedId()
    local listener = position(GetEntityCoords(ped))
    local spatialDistance = distance(listener, source)
    listener.z = listener.z + 0.65
    local listenerVehicle = GetVehiclePedIsIn(ped, false)
    local sameCabin = sourceVehicle and sourceVehicle ~= 0 and sourceVehicle == listenerVehicle
    local devices = ChaseBootlegConfig.Devices or {}
    local range = device == 'vehicle' and devices.vehicleExteriorRange or devices.portableRange
    local full = device == 'vehicle' and devices.vehicleExteriorFullVolumeRange or devices.portableFullVolumeRange
    range = clamp(range, 1.0, 100.0, device == 'vehicle' and 18.0 or 12.0)
    full = clamp(full, 0.0, range - 0.1, 2.0)
    gain = sameCabin and 1.0 or 1.0 - smoothstep((spatialDistance - full) / (range - full))
    local key = table.concat({ tostring(reception.stationId), device, tostring(reception.emitterSource),
        tostring(reception.emitterNetId), tostring(reception.vehicleNetId) }, ':')
    local now = GetGameTimer()
    if not acousticState or acousticState.key ~= key then
        acousticState = { key = key, gain = 0.0, high = profile.high, at = now - 50, probeAt = now - 250, blocked = false }
    end
    local state = acousticState
    if not sameCabin and spatialDistance > 0.8 then
        updateProbe(state, listener, source, ignored, now, config)
    else
        state.blocked = false
        if pendingProbe and pendingProbe.state == state then pendingProbe.state = nil end
    end
    if state.blocked and not sameCabin then
        gain = gain * clamp(config.wallGain, 0.0, 1.0, 0.28)
        profile.high = math.min(profile.high, clamp(config.wallHigh, 2000.0, 20000.0, 2200.0))
    end
    local function crossCabin(vehicle)
        if not vehicle or vehicle == 0 then return end
        local open = cabinOpenness(vehicle)
        local closedGain = clamp(config.closedVehicleGain, 0.0, 1.0, 0.22)
        local openGain = clamp(config.openVehicleGain, closedGain, 1.0, 0.80)
        local closedHigh = clamp(config.closedVehicleHigh, 2000.0, 20000.0, 2200.0)
        local openHigh = clamp(config.openVehicleHigh, closedHigh, 20000.0, 7000.0)
        gain = gain * (closedGain + (openGain - closedGain) * open)
        profile.high = math.min(profile.high, closedHigh + (openHigh - closedHigh) * open)
    end
    if not sameCabin then crossCabin(sourceVehicle) crossCabin(listenerVehicle) end
    local elapsed = math.max(1, math.min(250, (now - state.at) % 4294967296))
    local blend = 1.0 - math.exp(-elapsed / clamp(config.smoothingMilliseconds, 50, 2000, 240))
    state.at = now
    state.gain = state.gain + (gain - state.gain) * blend
    state.high = state.high + (profile.high - state.high) * blend
    profile.high = state.high
    return state.gain, profile
end
