# gwwg-tablet — Job Center Tablet for FiveM

سكربت تابلت وظائف لسيرفرات FiveM — مركز وظائف بواجهة تابلت داكنة، مهام يومية وأسبوعية مع مكافآت XP ومال، ونظام منجم خاص (عمل مستمر) مع طاقم عمّال.

A Job Center tablet script for FiveM: dark tablet UI, jobs list, daily/weekly
quests with XP + cash rewards, player leveling, and a persistent Mineral Mining
business (own a mine, invite helpers, level it up).

## Features | المميزات

- **Job Center** — قائمة الوظائف مع بطاقة مميزة (Featured) وشبكة وظائف، كل وظيفة لها مستوى مطلوب ونوع (SOLO / CO-OP).
- **Quests** — مهام يومية (تتجدد كل يوم) وأسبوعية (تتجدد كل اثنين) مع شريط تقدم وزر Claim للمكافآت.
- **Leveling** — نظام XP ومستويات للاعب، يظهر في أعلى التابلت.
- **Mineral Mining business** — امتلاك منجم خاص باسمك، دعوة حتى 4 عمّال بمعرّف اللاعب، تطوير المنجم ورفع مستواه، وتغيير اسمه.
- **حفظ تلقائي** — بيانات اللاعبين والمناجم تُحفظ في ملفات JSON داخل المورد.
- **Framework bridge** — يكتشف ESX أو QBCore تلقائيًا لدفع المكافآت المالية، ويعمل standalone بدونهما.

## Installation | التركيب

1. Put the folder in `resources/` as `gwwg-tablet`.
2. Add to `server.cfg`:
   ```
   ensure gwwg-tablet
   ```
3. Open with `F5` or `/tablet` (change in `config.lua`).

## Feeding quest progress | ربط تقدم المهام

من أي سكربت آخر (صيد، توصيل، تعدين...) أرسل التقدم عبر:

```lua
-- server side
exports['gwwg-tablet']:AddProgress(src, 'rock_cells', 1)

-- or from a client script (counts for that player)
TriggerServerEvent('gwwg-tablet:server:addProgress', 'fish', 1)
```

Metrics used by the default quests:
`fish`, `deliveries`, `rock_cells`, `minecarts`, `ingots`, `developments`,
`animals`, `parts`, `crops`, `gems`, `shifts`, `tasks`
(every non-`tasks` metric also counts toward `tasks` quests automatically).

Add or edit quests and jobs in `config.lua`.

## UI preview | معاينة الواجهة

Open `html/index.html` directly in a browser — it loads demo data so you can
preview and restyle the UI without starting a FiveM server.

## Files

```
fxmanifest.lua      resource manifest
config.lua          jobs, quests, leveling, mine settings
client/main.lua     tablet open/close, NUI bridge
server/main.lua     progression, quests, rewards, mine, persistence
html/               tablet UI (no build step, no external assets)
data/               auto-created JSON saves (gitignored)
```
