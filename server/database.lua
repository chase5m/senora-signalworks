ChaseBootlegDatabase = {}

function ChaseBootlegDatabase.ChaseLoadStations()
    local stations = MySQL.query.await('SELECT * FROM chase_bootleg_stations ORDER BY id')
    local crew = MySQL.query.await('SELECT id, station_id, identifier, name FROM chase_bootleg_crew')
    local tracks = MySQL.query.await('SELECT id, station_id, position, provider, url, title, duration, added_by FROM chase_bootleg_tracks ORDER BY station_id, position, id')
    local mapped = {}
    for _, row in ipairs(stations) do
        local id = tonumber(row.id)
        mapped[id] = {
            id = id, owner = row.owner, name = row.name, tagline = row.tagline,
            frequency = tonumber(row.frequency), power = row.power,
            isPublic = row.is_public == true or tonumber(row.is_public) == 1,
            showTitle = row.show_title, battery = tonumber(row.battery), balance = tonumber(row.balance),
            mode = row.mode == 'autonomous' and 'autonomous' or 'dj', queue = {}, autoplay = false, cohosts = {},
            stage = 'stored', live = false, crew = {}, listenerCount = 0
        }
    end
    for _, member in ipairs(crew) do
        local station = mapped[tonumber(member.station_id)]
        if station then station.crew[member.identifier] = { id = tonumber(member.id), name = member.name } end
    end
    for _, row in ipairs(tracks) do
        local station = mapped[tonumber(row.station_id)]
        if station then
            station.queue[#station.queue + 1] = { id = tonumber(row.id), position = tonumber(row.position) or #station.queue + 1,
                provider = row.provider, url = row.url, title = row.title, duration = tonumber(row.duration), addedBy = row.added_by }
        end
    end
    return mapped
end

function ChaseBootlegDatabase.ChaseLoadStation(owner)
    return MySQL.single.await('SELECT * FROM chase_bootleg_stations WHERE owner = ?', { owner })
end

function ChaseBootlegDatabase.ChaseRequests(stationId)
    local rows = MySQL.query.await([[
        SELECT id, station_id, sender_name, kind, message, status,
            UNIX_TIMESTAMP(created_at) * 1000 AS created_at
        FROM chase_bootleg_requests WHERE station_id = ? ORDER BY id DESC LIMIT ?
    ]], { stationId, ChaseBootlegConfig.Requests.retained })
    local requests = {}
    for _, row in ipairs(rows) do
        requests[#requests + 1] = {
            id = tonumber(row.id), stationId = tonumber(row.station_id), senderName = row.sender_name,
            kind = row.kind, message = row.message, status = row.status, createdAt = tonumber(row.created_at)
        }
    end
    return requests
end

function ChaseBootlegDatabase.ChasePendingCount(stationId)
    return tonumber(MySQL.scalar.await("SELECT COUNT(*) FROM chase_bootleg_requests WHERE station_id = ? AND status = 'pending'", { stationId }))
end

function ChaseBootlegDatabase.ChaseUpdateStation(station, fields)
    return MySQL.update.await([[
        UPDATE chase_bootleg_stations
        SET name = ?, tagline = ?, frequency = ?, power = ?, is_public = ?, show_title = ? WHERE id = ?
    ]], { fields.name, fields.tagline, fields.frequency, fields.power, fields.isPublic and 1 or 0, fields.showTitle, station.id })
end

function ChaseBootlegDatabase.ChaseSaveBattery(station)
    return MySQL.update.await('UPDATE chase_bootleg_stations SET battery = ? WHERE id = ?', { station.battery, station.id })
end

function ChaseBootlegDatabase.ChaseSaveMode(station, mode)
    return MySQL.update.await('UPDATE chase_bootleg_stations SET mode = ? WHERE id = ?', { mode, station.id })
end

function ChaseBootlegDatabase.ChaseInsertTrack(station, track, position)
    return MySQL.insert.await([[
        INSERT INTO chase_bootleg_tracks (station_id, position, provider, url, title, duration, added_by) VALUES (?, ?, ?, ?, ?, ?, ?)
    ]], { station.id, position, track.provider, track.url, track.title, track.duration, track.addedBy })
end

function ChaseBootlegDatabase.ChaseDeleteTrack(station, trackId)
    return MySQL.update.await('DELETE FROM chase_bootleg_tracks WHERE id = ? AND station_id = ?', { trackId, station.id })
end

function ChaseBootlegDatabase.ChaseBeginOperation(identity, station, amount, kind)
    if not station then
        return MySQL.insert.await('INSERT INTO chase_bootleg_ledger (actor, kind, amount) VALUES (?, ?, ?)',
            { identity.identifier, kind, amount })
    end
    return MySQL.insert.await([[
        INSERT INTO chase_bootleg_ledger (station_id, actor, kind, amount) VALUES (?, ?, ?, ?)
    ]], { station.id, identity.identifier, kind, amount })
end

function ChaseBootlegDatabase.ChaseOperation(id)
    return MySQL.single.await('SELECT * FROM chase_bootleg_ledger WHERE id = ?', { id })
end

function ChaseBootlegDatabase.ChaseOperationStatus(id, previous, status, detail)
    return MySQL.update.await([[
        UPDATE chase_bootleg_ledger SET status = ?, detail = ? WHERE id = ? AND status = ?
    ]], { status, detail or '', id, previous }) == 1
end

function ChaseBootlegDatabase.ChaseUnresolvedOperations()
    return MySQL.query.await([[
        SELECT id, actor, station_id, status FROM chase_bootleg_ledger
        WHERE status NOT IN ('completed', 'cancelled', 'refunded', 'rolled_back', 'rejected')
    ]])
end

function ChaseBootlegDatabase.ChaseCommitDebit(id, queries)
    queries[#queries + 1] = {
        query = "UPDATE chase_bootleg_ledger SET status = 'completed' WHERE id = ? AND status = 'debited' AND ROW_COUNT() = 1",
        values = { id }
    }
    return MySQL.transaction.await(queries)
end

function ChaseBootlegDatabase.ChaseReserveWithdrawal(id, station, amount)
    return MySQL.transaction.await({
        {
            query = 'UPDATE chase_bootleg_stations SET balance = balance - ? WHERE id = ? AND balance = ? AND balance >= ?',
            values = { amount, station.id, station.balance, amount }
        },
        {
            query = "UPDATE chase_bootleg_ledger SET status = 'reserved' WHERE id = ? AND status = 'prepared' AND ROW_COUNT() = 1",
            values = { id }
        }
    })
end

function ChaseBootlegDatabase.ChaseRollbackWithdrawal(id, station, amount, previous)
    return MySQL.transaction.await({
        {
            query = "UPDATE chase_bootleg_ledger SET status = 'rolled_back' WHERE id = ? AND status = ?",
            values = { id, previous }
        },
        {
            query = 'UPDATE chase_bootleg_stations SET balance = balance + ? WHERE id = ? AND ROW_COUNT() = 1',
            values = { amount, station.id }
        }
    })
end
