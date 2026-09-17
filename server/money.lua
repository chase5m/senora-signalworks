ChaseBootlegMoney = {}

local blockedActors = {}
local blockedStations = {}

local function ChaseMarkReview(identity, station, id, reason)
    blockedActors[identity.identifier] = id
    if station then blockedStations[station.id] = id end
    print(('[chase_bootleg] Payment %s needs operator reconciliation: %s. Automatic repayment is disabled.'):format(id, reason))
    return false, 'payment_review', 'This payment needs administrator review. Do not repeat it.'
end

local function ChaseReadOperation(identity, station, id)
    local success, operation = pcall(ChaseBootlegDatabase.ChaseOperation, id)
    if not success or not operation then
        ChaseMarkReview(identity, station, id, 'Unable to confirm the journal state')
        return nil
    end
    return operation
end

local function ChaseStatus(id, previous, status, detail)
    local success, changed = pcall(ChaseBootlegDatabase.ChaseOperationStatus, id, previous, status, detail)
    return success and changed
end

local function ChaseCancel(identity, station, id, previous, authorizationEnded)
    if not ChaseStatus(id, previous, 'cancelled', 'Character session ended before payment') then
        return ChaseMarkReview(identity, station, id, 'Unable to cancel the journal')
    end
    if authorizationEnded then
        return false, authorizationEnded.code or 'broadcast_job_required', authorizationEnded.message or 'Your job no longer authorizes this station purchase or operation.'
    end
    return false, 'session_changed', 'Your character session changed. Open Signalworks again.'
end

local function ChaseRefund(identity, station, id, amount)
    if not ChaseBootlegServer.ChaseCurrent(identity) then
        return ChaseMarkReview(identity, station, id, 'Player disconnected before the refund')
    end
    if not ChaseStatus(id, 'debited', 'refund_started') then
        return ChaseMarkReview(identity, station, id, 'Unable to prepare the refund')
    end
    if not ChaseBootlegServer.ChaseCurrent(identity) then
        return ChaseMarkReview(identity, station, id, 'Player disconnected before the refund could be issued')
    end
    local success, credited = pcall(ChaseBootlegFramework.ChaseAddMoney, identity, amount, 'chase_bootleg:refund:' .. id)
    if not success or not credited then
        return ChaseMarkReview(identity, station, id, 'Refund result could not be confirmed')
    end
    if not ChaseStatus(id, 'refund_started', 'refunded') then
        return ChaseMarkReview(identity, station, id, 'Refund issued; completion record could not be confirmed')
    end
    return false, 'payment_refunded', 'The operation failed and your payment was refunded.'
end

function ChaseBootlegMoney.ChaseInitialize()
    for _, operation in ipairs(ChaseBootlegDatabase.ChaseUnresolvedOperations()) do
        blockedActors[operation.actor] = operation.id
        if operation.station_id then blockedStations[tonumber(operation.station_id)] = operation.id end
        print(('[chase_bootleg] Unresolved payment %s (%s). Review docs/OPERATIONS.md before reconciling it.'):format(operation.id, operation.status))
    end
end

function ChaseBootlegMoney.ChaseBlocked(identity, station)
    return blockedActors[identity.identifier] or (station and blockedStations[station.id])
end

function ChaseBootlegMoney.ChaseDebit(identity, station, amount, kind, queries, authorize, authorizationFailure)
    if ChaseBootlegMoney.ChaseBlocked(identity, station) then
        return false, 'payment_review', 'An earlier payment needs administrator review.'
    end
    local balance = ChaseBootlegFramework.ChaseBalance(identity)
    if type(balance) ~= 'number' or balance < amount then
        return false, 'insufficient_funds', 'You do not have enough money in the configured account.'
    end
    local id = ChaseBootlegDatabase.ChaseBeginOperation(identity, station, amount, kind)
    if not id then return false, 'database_unavailable', 'The payment journal is unavailable.' end
    if not ChaseBootlegServer.ChaseCurrent(identity) then return ChaseCancel(identity, station, id, 'prepared') end
    if authorize and not authorize(identity) then return ChaseCancel(identity, station, id, 'prepared', authorizationFailure or {}) end
    if not ChaseStatus(id, 'prepared', 'debit_started') then
        return ChaseMarkReview(identity, station, id, 'Unable to prepare the debit')
    end
    if not ChaseBootlegServer.ChaseCurrent(identity) then return ChaseCancel(identity, station, id, 'debit_started') end
    if authorize and not authorize(identity) then return ChaseCancel(identity, station, id, 'debit_started', authorizationFailure or {}) end
    local success, debited = pcall(ChaseBootlegFramework.ChaseRemoveMoney, identity, amount, 'chase_bootleg:' .. kind .. ':' .. id)
    if not success then return ChaseMarkReview(identity, station, id, 'Framework debit raised an exception') end
    if not debited then
        if not ChaseStatus(id, 'debit_started', 'rejected') then
            return ChaseMarkReview(identity, station, id, 'Debit rejected; journal update unavailable')
        end
        return false, 'payment_rejected', 'The payment was declined.'
    end
    if not ChaseStatus(id, 'debit_started', 'debited') then
        return ChaseMarkReview(identity, station, id, 'Money removed; debit record could not be confirmed')
    end
    if authorize and not authorize(identity) then return ChaseRefund(identity, station, id, amount) end
    pcall(ChaseBootlegDatabase.ChaseCommitDebit, id, queries)
    local operation = ChaseReadOperation(identity, station, id)
    if not operation then return false, 'payment_review', 'The payment needs administrator review.' end
    if operation.status == 'completed' then return true, id end
    if operation.status == 'debited' then return ChaseRefund(identity, station, id, amount) end
    return ChaseMarkReview(identity, station, id, 'Unexpected journal state after committing the debit')
end

function ChaseBootlegMoney.ChaseWithdraw(identity, station, amount)
    if ChaseBootlegMoney.ChaseBlocked(identity, station) then
        return false, 'payment_review', 'An earlier payment needs administrator review.'
    end
    if station.balance < amount then return false, 'insufficient_balance', 'The station does not have that much money.' end
    local id = ChaseBootlegDatabase.ChaseBeginOperation(identity, station, amount, 'withdraw')
    if not id then return false, 'database_unavailable', 'The payment journal is unavailable.' end
    if not ChaseBootlegServer.ChaseCurrent(identity) then return ChaseCancel(identity, station, id, 'prepared') end
    pcall(ChaseBootlegDatabase.ChaseReserveWithdrawal, id, station, amount)
    local operation = ChaseReadOperation(identity, station, id)
    if not operation then return false, 'payment_review', 'The payment needs administrator review.' end
    if operation.status == 'prepared' then
        if not ChaseStatus(id, 'prepared', 'rejected') then
            return ChaseMarkReview(identity, station, id, 'Unable to record a failed reservation')
        end
        return false, 'balance_changed', 'The station balance changed. Open Bootleg again.'
    end
    if operation.status ~= 'reserved' then return ChaseMarkReview(identity, station, id, 'Unexpected withdrawal reservation state') end
    station.balance = station.balance - amount
    local previous = 'reserved'
    if ChaseBootlegServer.ChaseCurrent(identity) then
        if not ChaseStatus(id, 'reserved', 'credit_started') then
            return ChaseMarkReview(identity, station, id, 'Unable to prepare the payout')
        end
        previous = 'credit_started'
        if ChaseBootlegServer.ChaseCurrent(identity) then
            local success, credited = pcall(ChaseBootlegFramework.ChaseAddMoney, identity, amount, 'chase_bootleg:withdraw:' .. id)
            if not success then return ChaseMarkReview(identity, station, id, 'Framework payout raised an exception') end
            if credited then
                if not ChaseStatus(id, 'credit_started', 'completed') then
                    return ChaseMarkReview(identity, station, id, 'Payout issued; completion record could not be confirmed')
                end
                return true, id
            end
        end
    end
    pcall(ChaseBootlegDatabase.ChaseRollbackWithdrawal, id, station, amount, previous)
    operation = ChaseReadOperation(identity, station, id)
    if operation and operation.status == 'rolled_back' then
        station.balance = station.balance + amount
        return false, 'payment_cancelled', 'The payout could not be delivered. Funds remain in the station.'
    end
    return ChaseMarkReview(identity, station, id, 'Withdrawal reversal could not be confirmed')
end
