ChaseBootlegDomain = {}

function ChaseBootlegDomain.ChaseInteger(value, minimum, maximum)
    return type(value) == 'number' and value == value and value ~= math.huge and value ~= -math.huge
        and value % 1 == 0 and value >= minimum and value <= maximum
end

function ChaseBootlegDomain.ChaseText(value, minimum, maximum)
    if type(value) ~= 'string' or #value > maximum * 4 then return nil end
    local length = utf8.len(value)
    if not length or value:find('[%z\1-\31\127<>]') then return nil end
    local cleaned = value:match('^%s*(.-)%s*$')
    length = utf8.len(cleaned)
    if length < minimum or length > maximum then return nil end
    return cleaned
end

function ChaseBootlegDomain.ChaseDistance(first, second)
    local x, y, z = first.x - second.x, first.y - second.y, (first.z or 0) - (second.z or 0)
    return math.sqrt(x * x + y * y + z * z)
end

function ChaseBootlegDomain.ChasePower(id)
    for _, mode in ipairs(ChaseBootlegConfig.PowerModes) do
        if mode.id == id then return mode end
    end
end

function ChaseBootlegDomain.ChaseClamp(value, minimum, maximum)
    return math.max(minimum, math.min(maximum, value))
end

function ChaseBootlegDomain.ChaseRound(value, step)
    return math.floor(value / step + 0.5) * step
end

function ChaseBootlegDomain.ChaseElapsed(now, startedAt)
    return (now - startedAt) % 4294967296
end

function ChaseBootlegDomain.ChaseCanManage(station, identifier)
    return station ~= nil and (station.owner == identifier or station.crew[identifier] ~= nil)
end

function ChaseBootlegDomain.ChaseVisible(station, identifier, tunedStationId)
    return station.isPublic or ChaseBootlegDomain.ChaseCanManage(station, identifier) or station.id == tunedStationId
end

function ChaseBootlegDomain.ChaseSignal(distance, range)
    if distance > range then return 0 end
    return ChaseBootlegDomain.ChaseClamp(1.0 - (distance / range) ^ 2 * 0.9, 0.1, 1.0)
end

function ChaseBootlegDomain.ChaseCanReceive(station, position, bucket, vehiclePosition)
    if not station.live or station.bucket ~= bucket or not vehiclePosition then return false, 0 end
    local mode = ChaseBootlegDomain.ChasePower(station.power)
    if not mode then return false, 0 end
    local quality = ChaseBootlegDomain.ChaseSignal(ChaseBootlegDomain.ChaseDistance(position, vehiclePosition), mode.range)
    return quality > 0, quality
end

function ChaseBootlegDomain.ChaseStationView(station, identifier)
    local canManage = ChaseBootlegDomain.ChaseCanManage(station, identifier)
    local view = {
        id = station.id, name = station.name, tagline = station.tagline, frequency = station.frequency,
        power = station.power, isPublic = station.isPublic, stage = station.stage, live = station.live,
        micLive = station.host ~= nil, listeners = station.listenerCount or 0,
        battery = math.floor(station.battery), showTitle = station.showTitle, hostName = station.hostAlias or '',
        canManage = canManage, canWithdraw = station.owner == identifier,
        mode = station.mode or 'dj', cohostNames = {},
        nowPlaying = station.cartridge and { provider = station.cartridge.provider or 'file', title = station.cartridge.title or '',
            duration = station.cartridge.duration, startedAt = station.cartridge.startedAt } or nil
    }
    for _, cohost in ipairs(station.cohosts or {}) do view.cohostNames[#view.cohostNames + 1] = cohost.identity.name end
    if canManage then view.vehicleNetId = station.vehicleNetId end
    if station.owner == identifier then view.balance = station.balance end
    return view
end

function ChaseBootlegDomain.ChaseSeparated(readings, position, separation)
    for _, reading in ipairs(readings) do
        if ChaseBootlegDomain.ChaseDistance(reading, position) < separation then return false end
    end
    return true
end

function ChaseBootlegDomain.ChaseScanArea(position, radius, offsetX, offsetY)
    local grid = radius * 0.8
    local x = ChaseBootlegDomain.ChaseRound(position.x, grid) + offsetX * radius * 0.15
    local y = ChaseBootlegDomain.ChaseRound(position.y, grid) + offsetY * radius * 0.15
    return { x = x, y = y, radius = radius }
end

function ChaseBootlegDomain.ChaseMusicProvider(url)
    if type(url) ~= 'string' or #url > 300 or url:find('[%s%c<>"\'\\]') then return nil end
    local host, path = url:match('^https://([%w%.%-]+)(/.*)$')
    if not host then return nil end
    if host == 'youtube.com' or host == 'www.youtube.com' or host == 'music.youtube.com' then
        local id = path:match('^/watch%?v=([%w_%-]+)') or host ~= 'music.youtube.com' and path:match('^/shorts/([%w_%-]+)')
        return id and #id >= 11 and 'youtube' or nil
    elseif host == 'youtu.be' then
        local id = path:match('^/([%w_%-]+)')
        return id and #id >= 11 and 'youtube' or nil
    elseif host == 'soundcloud.com' or host == 'www.soundcloud.com' or host == 'm.soundcloud.com' then
        return (path:match('^/[%w_%-]+/[%w_%-]+$') or path:match('^/[%w_%-]+/[%w_%-]+%?')) and 'soundcloud' or nil
    elseif host == 'on.soundcloud.com' then
        return path:match('^/%w+') and 'soundcloud' or nil
    end
end

function ChaseBootlegDomain.ChaseError(code, message)
    return { ok = false, error = { code = code, message = message } }
end

function ChaseBootlegDomain.ChaseSuccess(data)
    return { ok = true, data = data }
end
