Config = {}

-- ============================================================
-- General
-- ============================================================

-- Command + default key to open the tablet
Config.Command = 'tablet'
Config.OpenKey = 'F5'

-- Framework: 'auto' detects es_extended / qb-core, 'standalone' pays nothing
-- (money rewards are still tracked, hook your own payment in server/main.lua)
Config.Framework = 'auto'

-- XP needed per level: xp required for next level = Base + (level - 1) * Step
Config.Leveling = {
    Base = 250,
    Step = 150,
    MaxLevel = 50,
}

-- ============================================================
-- Jobs shown in the Job Center
-- ============================================================
-- role     = small label next to the level chip (entry rank name)
-- type     = 'SOLO' or 'CO-OP'
-- minLevel = player level required to start
-- featured = shown as the big hero card on top
-- theme    = CSS gradient key used as the card artwork (no image files needed)

Config.Jobs = {
    {
        id = 'farming',
        name = 'Farming',
        role = 'Farmhand',
        type = 'SOLO',
        minLevel = 1,
        featured = true,
        theme = 'farm',
        description = 'Tend crops and livestock on Sandy Shores farms. Start as a Farmhand running watering and feeding tasks, then graduate to full crop cycles and livestock management. Hit Level 3 to unlock the right to buy your own farmhouse or greenhouse.',
    },
    {
        id = 'greenhouse',
        name = 'Greenhouse',
        role = 'Apprentice Gardener',
        type = 'SOLO',
        minLevel = 1,
        theme = 'greenhouse',
        description = 'Climate-controlled growing. Plant the day\'s slate, harvest, and deposit. Hit Level 3 to unlock greenhouse ownership.',
    },
    {
        id = 'postop',
        name = 'Post Op',
        role = 'Solo Courier',
        type = 'SOLO',
        minLevel = 1,
        theme = 'delivery',
        description = 'Pick up packages from the depot, load them into your vehicle, and deliver them across Los Santos. Work solo or team up with a driver and loaders to tackle bigger routes.',
    },
    {
        id = 'mining',
        name = 'Mineral Mining',
        role = 'Surface Miner',
        type = 'CO-OP',
        minLevel = 1,
        theme = 'mine',
        business = true, -- has the persistent business page (own mine, crew, upgrades)
        description = 'Own a persistent mine, invite up to four helpers, expand its tunnels, and refine shared ore into valuable materials.',
    },
    {
        id = 'fieldwork',
        name = 'Field Work',
        role = 'Field Hand',
        type = 'CO-OP',
        minLevel = 1,
        theme = 'field',
        description = 'Agricultural day labor around the Grapeseed fields. Rake, plant, water and harvest by hand, tend livestock, then graduate to tractors and harvesters. The first step into farming — prove yourself here to unlock the Farming and Greenhouse trades.',
    },
}

-- ============================================================
-- Quests
-- ============================================================
-- metric: the counter other scripts feed via the export/event
--   exports['gwwg-tablet']:AddProgress(src, metric, amount)
--   TriggerEvent('gwwg-tablet:server:addProgress', metric, amount)  (from client scripts of the same player)
-- Daily quests reset at midnight, weekly quests reset every Monday (server time).

Config.Quests = {
    daily = {
        { id = 'daily_catch',     name = 'Daily Catch',     description = 'Catch 30 fish today',                       metric = 'fish',        target = 30,  xp = 400, cash = 1200 },
        { id = 'road_runner',     name = 'Road Runner',     description = 'Complete 8 deliveries',                     metric = 'deliveries',  target = 8,   xp = 500, cash = 1800 },
        { id = 'rock_bottom',     name = 'Rock Bottom',     description = 'Mine 100 rock cells',                       metric = 'rock_cells',  target = 100, xp = 400, cash = 1200 },
        { id = 'full_cart',       name = 'Full Cart',       description = 'Sort 2 full minecarts',                     metric = 'minecarts',   target = 2,   xp = 400, cash = 1300 },
        { id = 'hot_metal',       name = 'Hot Metal',       description = 'Cast 3 ingots',                             metric = 'ingots',      target = 3,   xp = 450, cash = 1500 },
        { id = 'claim_developer', name = 'Claim Developer', description = 'Place or open 3 mine developments',         metric = 'developments',target = 3,   xp = 500, cash = 2000 },
        { id = 'hunters_dozen',   name = "Hunter's Dozen",  description = 'Hunt 12 animals',                           metric = 'animals',     target = 12,  xp = 400, cash = 1400 },
        { id = 'scrap_metal',     name = 'Scrap Metal',     description = 'Salvage 20 parts',                          metric = 'parts',       target = 20,  xp = 450, cash = 1500 },
        { id = 'green_thumb',     name = 'Green Thumb',     description = 'Harvest 15 crops in a shift',               metric = 'crops',       target = 15,  xp = 400, cash = 1300 },
    },
    weekly = {
        { id = 'master_angler',   name = 'Master Angler',   description = 'Catch 300 fish this week',                  metric = 'fish',        target = 300, xp = 2500, cash = 8000 },
        { id = 'highway_legend',  name = 'Highway Legend',  description = 'Complete 50 deliveries',                    metric = 'deliveries',  target = 50,  xp = 3000, cash = 12000 },
        { id = 'vein_hunter',     name = 'Vein Hunter',     description = 'Mine 600 rock cells',                       metric = 'rock_cells',  target = 600, xp = 2500, cash = 8000 },
        { id = 'foundry_week',    name = 'Foundry Week',    description = 'Cast 15 ingots',                            metric = 'ingots',      target = 15,  xp = 3000, cash = 10000 },
        { id = 'gem_fever',       name = 'Gem Fever',       description = 'Recover 5 gemstone packs',                  metric = 'gems',        target = 5,   xp = 2800, cash = 9000 },
        { id = 'deep_developer',  name = 'Deep Developer',  description = 'Place or open 20 mine developments',        metric = 'developments',target = 20,  xp = 3500, cash = 12000 },
        { id = 'jack_of_all',     name = 'Jack of All Trades', description = 'Complete 100 tasks across any jobs',     metric = 'tasks',       target = 100, xp = 3000, cash = 10000 },
        { id = 'perfect_record',  name = 'Perfect Record',  description = 'Complete 5 full shifts without abandoning early', metric = 'shifts', target = 5,  xp = 3200, cash = 11000 },
    },
}

-- ============================================================
-- Mining business (persistent mine)
-- ============================================================

Config.Mine = {
    MaxHelpers = 4,          -- owner + up to 4 helpers
    -- XP (mine development) needed to level the mine up, per level
    DevelopmentPerLevel = { 100, 250, 500, 900, 1500 },
    MaxLevel = 5,
    DefaultName = "%s's Mine", -- %s = owner name
}
