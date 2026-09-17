ChaseBootlegFramework = {}

local frameworkName
local frameworkObject

function ChaseBootlegFramework.ChaseInitialize()
    local configured = ChaseBootlegConfig.Framework
    if configured == 'auto' then
        if GetResourceState('qbx_core') == 'started' then configured = 'qbox'
        elseif GetResourceState('qb-core') == 'started' then configured = 'qbcore'
        elseif GetResourceState('es_extended') == 'started' then configured = 'esx'
        else error('Chase Bootleg requires qbx_core, qb-core or es_extended.') end
    end
    frameworkName = configured
    if configured == 'qbox' then
        assert(GetResourceState('qbx_core') == 'started', 'Start qbx_core before Chase Bootleg.')
    elseif configured == 'qbcore' then
        frameworkObject = exports['qb-core']:GetCoreObject()
    elseif configured == 'esx' then
        frameworkObject = exports['es_extended']:getSharedObject()
    else
        error('Invalid ChaseBootlegConfig.Framework.')
    end
    return frameworkName
end

function ChaseBootlegFramework.ChaseName()
    return frameworkName
end

function ChaseBootlegFramework.ChasePlayer(playerSource)
    if frameworkName == 'qbox' then return exports.qbx_core:GetPlayer(playerSource) end
    if frameworkName == 'qbcore' then return frameworkObject.Functions.GetPlayer(playerSource) end
    if frameworkName == 'esx' then return frameworkObject.GetPlayerFromId(playerSource) end
end

function ChaseBootlegFramework.ChaseIdentity(playerSource)
    local player = ChaseBootlegFramework.ChasePlayer(playerSource)
    if not player then return nil end
    if frameworkName == 'esx' then
        local identifier = player.getIdentifier()
        if type(identifier) ~= 'string' or identifier == '' then return nil end
        local name = ChaseBootlegDomain.ChaseText(player.getName(), 1, 100) or 'Listener'
        return { source = playerSource, identifier = 'esx:' .. identifier, name = name, player = player }
    end
    local data = player.PlayerData
    if not data or not data.citizenid then return nil end
    local character = data.charinfo or {}
    local name = ('%s %s'):format(character.firstname or '', character.lastname or ''):match('^%s*(.-)%s*$')
    name = ChaseBootlegDomain.ChaseText(name, 1, 100) or 'Listener'
    return { source = playerSource, identifier = 'qb:' .. data.citizenid, name = name, player = player }
end

function ChaseBootlegFramework.ChaseIsCurrent(identity)
    if not ChaseBootlegServer or ChaseBootlegServer.sessions[identity.source] ~= identity
        or ChaseBootlegServer.generations[identity.source] ~= identity.generation
        or ChaseBootlegServer.unloading[identity.source] then return false end
    local current = ChaseBootlegFramework.ChaseIdentity(identity.source)
    if not current or current.identifier ~= identity.identifier then return false end
    identity.player = current.player
    identity.name = current.name
    return true
end

function ChaseBootlegFramework.ChaseAccount()
    if frameworkName == 'esx' and ChaseBootlegConfig.MoneyAccount == 'cash' then return 'money' end
    return ChaseBootlegConfig.MoneyAccount
end

function ChaseBootlegFramework.ChaseBalance(identity)
    if not ChaseBootlegFramework.ChaseIsCurrent(identity) then return nil end
    local account = ChaseBootlegFramework.ChaseAccount()
    if frameworkName == 'qbox' then return exports.qbx_core:GetMoney(identity.source, account) end
    if frameworkName == 'qbcore' then return identity.player.Functions.GetMoney(account) end
    local balance = identity.player.getAccount(account)
    return balance and balance.money or nil
end

function ChaseBootlegFramework.ChaseRemoveMoney(identity, amount, reason)
    local before = ChaseBootlegFramework.ChaseBalance(identity)
    if type(before) ~= 'number' or before < amount then return false end
    if not ChaseBootlegFramework.ChaseIsCurrent(identity) then return false end
    local account = ChaseBootlegFramework.ChaseAccount()
    if frameworkName == 'qbox' then return exports.qbx_core:RemoveMoney(identity.source, account, amount, reason) == true end
    if frameworkName == 'qbcore' then return identity.player.Functions.RemoveMoney(account, amount, reason) == true end
    identity.player.removeAccountMoney(account, amount, reason)
    local after = ChaseBootlegFramework.ChaseBalance(identity)
    if after == before then return false end
    if after ~= before - amount then error('Unable to confirm the ESX debit result') end
    return true
end

function ChaseBootlegFramework.ChaseAddMoney(identity, amount, reason)
    local before = ChaseBootlegFramework.ChaseBalance(identity)
    if type(before) ~= 'number' then return false end
    if not ChaseBootlegFramework.ChaseIsCurrent(identity) then return false end
    local account = ChaseBootlegFramework.ChaseAccount()
    if frameworkName == 'qbox' then return exports.qbx_core:AddMoney(identity.source, account, amount, reason) == true end
    if frameworkName == 'qbcore' then return identity.player.Functions.AddMoney(account, amount, reason) == true end
    identity.player.addAccountMoney(account, amount, reason)
    local after = ChaseBootlegFramework.ChaseBalance(identity)
    if after == before then return false end
    if after ~= before + amount then error('Unable to confirm the ESX credit result') end
    return true
end

function ChaseBootlegFramework.ChaseIsPolice(identity)
    if not ChaseBootlegFramework.ChaseIsCurrent(identity) then return false end
    local job
    if frameworkName == 'esx' then job = identity.player.getJob()
    else job = identity.player.PlayerData.job end
    if not job or not ChaseBootlegConfig.Police.jobs[job.name] then return false end
    if not ChaseBootlegConfig.Police.requireDuty then return true end
    if frameworkName == 'esx' then
        if type(job.onDuty) == 'boolean' then return job.onDuty end
        if type(job.onduty) == 'boolean' then return job.onduty end
        return ChaseBootlegConfig.Police.esxDutyFallback == true
    end
    return job.onduty == true
end

function ChaseBootlegFramework.ChaseCanBroadcast(identity)
    local rule = ChaseBootlegConfig.BroadcastJob
    if not rule or rule.enabled == false then return ChaseBootlegFramework.ChaseIsCurrent(identity) end
    if not ChaseBootlegFramework.ChaseIsCurrent(identity) then return false end
    local job = frameworkName == 'esx' and identity.player.getJob() or identity.player.PlayerData.job
    if not job or job.name ~= rule.name then return false end
    local grade = type(job.grade) == 'table' and job.grade.level or job.grade
    if (tonumber(grade) or 0) < (rule.minGrade or 0) then return false end
    if rule.requireDuty then
        return job.onduty == true or frameworkName == 'esx' and job.onDuty == true
    end
    return true
end

function ChaseBootlegFramework.ChaseIsAlive(identity)
    if not ChaseBootlegFramework.ChaseIsCurrent(identity) then return false end
    local ped = GetPlayerPed(identity.source)
    if ped == 0 or not DoesEntityExist(ped) or GetEntityHealth(ped) <= 0 then return false end
    if frameworkName ~= 'esx' then
        local metadata = identity.player.PlayerData.metadata or {}
        if metadata.isdead or metadata.inlaststand then return false end
    end
    return true
end
