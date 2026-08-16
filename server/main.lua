-- gwwg-tablet | server
-- Persists player progression + mines to JSON in the resource folder.

local RESOURCE = GetCurrentResourceName()

local Players = {} -- [license] = { xp, level, quests = { daily = {key, progress, claimed}, weekly = {...} } }
local Mines = {}   -- [license] = { name, level, development, crew = {license,...}, cellsCreated, processed }
local dirty = false

-- ============================================================
-- Framework bridge
-- ============================================================

local Framework = nil -- 'esx' | 'qb' | nil

local function detectFramework()
    if Config.Framework == 'standalone' then return end
    if GetResourceState('es_extended') == 'started' then
        Framework = 'esx'
    elseif GetResourceState('qb-core') == 'started' then
        Framework = 'qb'
    end
end

local function payPlayer(src, amount)
    if amount <= 0 then return end
    if Framework == 'esx' then
        local xPlayer = exports.es_extended:getSharedObject().GetPlayerFromId(src)
        if xPlayer then xPlayer.addMoney(amount) end
    elseif Framework == 'qb' then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if Player then Player.Functions.AddMoney('cash', amount, 'tablet-quest-reward') end
    end
    -- standalone: hook your own payment here
end

local function getPlayerDisplayName(src)
    if Framework == 'esx' then
        local xPlayer = exports.es_extended:getSharedObject().GetPlayerFromId(src)
        if xPlayer and xPlayer.getName then return xPlayer.getName() end
    elseif Framework == 'qb' then
        local Player = exports['qb-core']:GetCoreObject().Functions.GetPlayer(src)
        if Player then
            local ci = Player.PlayerData.charinfo
            if ci then return ('%s %s'):format(ci.firstname or '', ci.lastname or '') end
        end
    end
    return GetPlayerName(src) or 'Unknown'
end

-- ============================================================
-- Persistence
-- ============================================================

local function loadData()
    local raw = LoadResourceFile(RESOURCE, 'data/players.json')
    if raw then Players = json.decode(raw) or {} end
    raw = LoadResourceFile(RESOURCE, 'data/mines.json')
    if raw then Mines = json.decode(raw) or {} end
end

local function saveData()
    SaveResourceFile(RESOURCE, 'data/players.json', json.encode(Players), -1)
    SaveResourceFile(RESOURCE, 'data/mines.json', json.encode(Mines), -1)
    dirty = false
end

CreateThread(function()
    while true do
        Wait(60000)
        if dirty then saveData() end
    end
end)

AddEventHandler('onResourceStop', function(res)
    if res == RESOURCE and dirty then saveData() end
end)

-- ============================================================
-- Helpers
-- ============================================================

local function getLicense(src)
    for _, id in ipairs(GetPlayerIdentifiers(src)) do
        if id:sub(1, 8) == 'license:' then return id end
    end
    return 'src:' .. tostring(src) -- fallback (local dev without license)
end

local function periodKey(kind)
    -- daily: server date; weekly: ISO-ish year-week (Monday first day, %W)
    if kind == 'daily' then return os.date('%Y-%m-%d') end
    return os.date('%Y-W%W')
end

local function xpForLevel(level)
    return Config.Leveling.Base + (level - 1) * Config.Leveling.Step
end

local function freshQuestState(kind)
    return { key = periodKey(kind), progress = {}, claimed = {} }
end

local function ensurePlayer(src)
    local lic = getLicense(src)
    local p = Players[lic]
    if not p then
        p = { xp = 0, level = 1, quests = { daily = freshQuestState('daily'), weekly = freshQuestState('weekly') } }
        Players[lic] = p
        dirty = true
    end
    -- reset expired quest periods
    for _, kind in ipairs({ 'daily', 'weekly' }) do
        if not p.quests[kind] or p.quests[kind].key ~= periodKey(kind) then
            p.quests[kind] = freshQuestState(kind)
            dirty = true
        end
    end
    return p, lic
end

local function addXp(src, amount)
    local p = ensurePlayer(src)
    p.xp = p.xp + amount
    while p.level < Config.Leveling.MaxLevel and p.xp >= xpForLevel(p.level) do
        p.xp = p.xp - xpForLevel(p.level)
        p.level = p.level + 1
        TriggerClientEvent('gwwg-tablet:client:notify', src, ('Level up! You are now level %d'):format(p.level))
    end
    dirty = true
end

local function findQuest(kind, id)
    for _, q in ipairs(Config.Quests[kind]) do
        if q.id == id then return q end
    end
end

local function ensureMine(lic, ownerName)
    local m = Mines[lic]
    if not m then
        m = {
            name = Config.Mine.DefaultName:format(ownerName or 'Owner'),
            level = 1,
            development = 0,
            crew = {},
            cellsCreated = 0,
            processed = 0,
        }
        Mines[lic] = m
        dirty = true
    end
    return m
end

-- ============================================================
-- Progress API (feed this from your job scripts)
-- ============================================================

local function addProgress(src, metric, amount)
    amount = tonumber(amount) or 1
    if amount <= 0 then return end
    local p, lic = ensurePlayer(src)

    for _, kind in ipairs({ 'daily', 'weekly' }) do
        local state = p.quests[kind]
        for _, q in ipairs(Config.Quests[kind]) do
            if q.metric == metric and not state.claimed[q.id] then
                state.progress[q.id] = (state.progress[q.id] or 0) + amount
            end
        end
    end

    -- every unit of real work also counts toward generic 'tasks' quests
    if metric ~= 'tasks' then
        for _, kind in ipairs({ 'daily', 'weekly' }) do
            local state = p.quests[kind]
            for _, q in ipairs(Config.Quests[kind]) do
                if q.metric == 'tasks' and not state.claimed[q.id] then
                    state.progress[q.id] = (state.progress[q.id] or 0) + amount
                end
            end
        end
    end

    -- mine bookkeeping
    if metric == 'rock_cells' then
        local mine = Mines[lic]
        if mine then
            mine.cellsCreated = mine.cellsCreated + amount
            local perLevel = Config.Mine.DevelopmentPerLevel[mine.level]
            if perLevel then
                mine.development = mine.development + amount
                while mine.level < Config.Mine.MaxLevel and mine.development >= (Config.Mine.DevelopmentPerLevel[mine.level] or math.huge) do
                    mine.development = mine.development - Config.Mine.DevelopmentPerLevel[mine.level]
                    mine.level = mine.level + 1
                    TriggerClientEvent('gwwg-tablet:client:notify', src, ('Your mine reached level %d!'):format(mine.level))
                end
            end
        end
    end

    dirty = true
end

exports('AddProgress', function(src, metric, amount)
    addProgress(src, metric, amount)
end)

RegisterNetEvent('gwwg-tablet:server:addProgress', function(metric, amount)
    addProgress(source, metric, amount)
end)

-- ============================================================
-- Data snapshot sent to the NUI
-- ============================================================

local function buildQuestList(kind, state)
    local out = {}
    for _, q in ipairs(Config.Quests[kind]) do
        out[#out + 1] = {
            id = q.id,
            name = q.name,
            description = q.description,
            target = q.target,
            xp = q.xp,
            cash = q.cash,
            kind = kind,
            progress = state.progress[q.id] or 0,
            claimed = state.claimed[q.id] == true,
        }
    end
    return out
end

local function crewEntry(lic)
    -- resolve an online player's name for a crew license, else show stored short id
    for _, playerId in ipairs(GetPlayers()) do
        if getLicense(tonumber(playerId)) == lic then
            return { license = lic, name = getPlayerDisplayName(tonumber(playerId)), online = true }
        end
    end
    return { license = lic, name = 'Offline worker', online = false }
end

local function buildSnapshot(src)
    local p, lic = ensurePlayer(src)
    local mine = Mines[lic]
    local mineData = nil
    if mine then
        local perLevel = Config.Mine.DevelopmentPerLevel[mine.level]
        local crew = {}
        for _, memberLic in ipairs(mine.crew) do
            crew[#crew + 1] = crewEntry(memberLic)
        end
        mineData = {
            name = mine.name,
            level = mine.level,
            maxLevel = Config.Mine.MaxLevel,
            development = mine.development,
            developmentTarget = perLevel or 0,
            cellsCreated = mine.cellsCreated,
            processed = mine.processed,
            crew = crew,
            maxHelpers = Config.Mine.MaxHelpers,
        }
    end

    -- count of players currently in the mining job area is game-specific;
    -- here we report total online players as the "underground" hint
    local jobs = {}
    for _, j in ipairs(Config.Jobs) do
        jobs[#jobs + 1] = {
            id = j.id, name = j.name, role = j.role, type = j.type,
            minLevel = j.minLevel, featured = j.featured or false,
            theme = j.theme, business = j.business or false,
            description = j.description,
            workers = 0, -- hook your job scripts to report live worker counts
        }
    end

    return {
        player = {
            name = getPlayerDisplayName(src),
            level = p.level,
            xp = p.xp,
            xpNext = xpForLevel(p.level),
        },
        jobs = jobs,
        quests = {
            daily = buildQuestList('daily', p.quests.daily),
            weekly = buildQuestList('weekly', p.quests.weekly),
        },
        mine = mineData,
        hasMine = mine ~= nil,
    }
end

RegisterNetEvent('gwwg-tablet:server:requestData', function()
    local src = source
    TriggerClientEvent('gwwg-tablet:client:receiveData', src, buildSnapshot(src))
end)

-- ============================================================
-- Quest claim
-- ============================================================

RegisterNetEvent('gwwg-tablet:server:claimQuest', function(kind, id)
    local src = source
    if kind ~= 'daily' and kind ~= 'weekly' then return end
    local p = ensurePlayer(src)
    local q = findQuest(kind, id)
    if not q then return end

    local state = p.quests[kind]
    if state.claimed[id] then return end
    if (state.progress[id] or 0) < q.target then return end

    state.claimed[id] = true
    addXp(src, q.xp)
    payPlayer(src, q.cash)
    dirty = true

    TriggerClientEvent('gwwg-tablet:client:notify', src, ('Quest "%s" claimed: +%d XP, +$%d'):format(q.name, q.xp, q.cash))
    TriggerClientEvent('gwwg-tablet:client:receiveData', src, buildSnapshot(src))
end)

-- ============================================================
-- Mine management
-- ============================================================

RegisterNetEvent('gwwg-tablet:server:createMine', function()
    local src = source
    local _, lic = ensurePlayer(src)
    ensureMine(lic, getPlayerDisplayName(src))
    TriggerClientEvent('gwwg-tablet:client:receiveData', src, buildSnapshot(src))
end)

RegisterNetEvent('gwwg-tablet:server:renameMine', function(newName)
    local src = source
    local _, lic = ensurePlayer(src)
    local mine = Mines[lic]
    if not mine or type(newName) ~= 'string' then return end
    newName = newName:sub(1, 40)
    if #newName < 3 then return end
    mine.name = newName
    dirty = true
    TriggerClientEvent('gwwg-tablet:client:notify', src, 'Mine renamed')
    TriggerClientEvent('gwwg-tablet:client:receiveData', src, buildSnapshot(src))
end)

RegisterNetEvent('gwwg-tablet:server:inviteCrew', function(targetId)
    local src = source
    targetId = tonumber(targetId)
    local _, lic = ensurePlayer(src)
    local mine = Mines[lic]
    if not mine or not targetId then return end

    if #mine.crew >= Config.Mine.MaxHelpers then
        TriggerClientEvent('gwwg-tablet:client:notify', src, 'Crew is full')
        return
    end
    if not GetPlayerName(targetId) then
        TriggerClientEvent('gwwg-tablet:client:notify', src, 'Player not found')
        return
    end
    if targetId == src then
        TriggerClientEvent('gwwg-tablet:client:notify', src, 'You already own this mine')
        return
    end

    local targetLic = getLicense(targetId)
    for _, member in ipairs(mine.crew) do
        if member == targetLic then
            TriggerClientEvent('gwwg-tablet:client:notify', src, 'Already in your crew')
            return
        end
    end

    mine.crew[#mine.crew + 1] = targetLic
    dirty = true

    local targetName = getPlayerDisplayName(targetId)
    TriggerClientEvent('gwwg-tablet:client:notify', src, ('Invited %s'):format(targetName))
    TriggerClientEvent('gwwg-tablet:client:notify', targetId, ('You joined %s'):format(mine.name))
    TriggerClientEvent('gwwg-tablet:client:receiveData', src, buildSnapshot(src))
end)

RegisterNetEvent('gwwg-tablet:server:removeCrew', function(memberLic)
    local src = source
    local _, lic = ensurePlayer(src)
    local mine = Mines[lic]
    if not mine or type(memberLic) ~= 'string' then return end
    for i, member in ipairs(mine.crew) do
        if member == memberLic then
            table.remove(mine.crew, i)
            dirty = true
            break
        end
    end
    TriggerClientEvent('gwwg-tablet:client:receiveData', src, buildSnapshot(src))
end)

-- ============================================================
-- Init
-- ============================================================

CreateThread(function()
    detectFramework()
    loadData()
    print(('[gwwg-tablet] loaded (framework: %s)'):format(Framework or 'standalone'))
end)
