# Ember RP — QBCore UI Redesign

Design source for a full QBCore/QBox NUI redesign. Dark modern style: near-black
backgrounds, ember-orange accent, balanced glassmorphism. English UI.
The "Ember RP" identity (name + flame mark) is a placeholder and easy to swap.

## Design tokens

| Token | Value | Use |
|---|---|---|
| Abyss | `#0C0B0A` | base background |
| Coal | `#171512` | raised background |
| Surface | `rgba(21,19,16,0.85)` + 14px blur | glass panels |
| Hairline | `rgba(255,255,255,0.08)` | borders |
| Ember | `#FF7A1F` | accent, active states |
| Flare | `#FFB56B` | accent highlight |
| Text | `#F5F1EC` / `#A8A29C` / `#6B655F` | primary / secondary / muted |
| Mint / Coral / Sky | `#42D392` / `#F4544E` / `#4C9EEB` | success / error / info |
| Amber / Cyan | `#E8B04B` / `#45C8D8` | hunger, fuel / thirst, oxygen |
| Violet | `#B98CF0` | stamina / stress |
| Scene | `#0e1119 → #131620 → #0a0c11` | in-game backdrop gradient (not a UI surface) |

Typography: **Space Grotesk** (display, headings, numbers) + **Instrument Sans**
(body, UI text). Accent gradient: `#FF7A1F → #E8540E` (135deg). Glow reserved
for the single active element.

Signature motif — the **Ember Cut**: sharp-cornered glass panels with one
16px sliced corner (`clip-path`), a 3px ember keyline on the active edge, a
diagonal slash accent at the cut, and faint scanlines
(`repeating-linear-gradient`, 1px/3px) in the glass, and a woven **edge
pattern** trimming key panel rims: a 5px strip of 45° ember hairlines
(`repeating-linear-gradient(-45deg, rgba(255,122,31,0.5) 0 2px, transparent
2px 6px)`) that fades out at both ends via a mask. Gauges are 270° SVG
rings (`pathLength` dasharray); status rings are 100-unit circles. Keycaps,
pills and toggles stay rounded (5px/14px); panels stay sharp.

Motion language: staggered entrances (fade + 28–36px translate, 0.5–0.65s,
`cubic-bezier(0.2, 0.8, 0.2, 1)`, 80–120ms stagger); gauges and status rings
sweep in by animating `stroke-dasharray`; bars fill from zero. Ambient loops
(compass tick scroll, voice EQ, glow pulses, sheen sweeps, dash crawl, toast
drain, progressbar stripe scroll) cycle in 0.9–5s. Everything is disabled
under `prefers-reduced-motion: reduce`.

Inward tilt: edge-anchored panels lean toward screen center with
`transform: perspective(1200px) rotateY(±6–8deg)` (origin on the screen-edge
side); bottom/center panels use `rotateX(4–6deg)` instead.

## Mockups (batch 1)

`design/mockups/` holds the artboard sources (`*.dc.html` + `canvas.json`)
for the shared design canvas:

- `Main.dc.html` — brand & design-system board
- `HUD.dc.html` — status rings, minimap, money, speedometer
- `Menu.dc.html` — qb-menu context menu
- `Input.dc.html` — qb-input form dialog
- `Target.dc.html` — qb-target third-eye options
- `Radial.dc.html` — qb-radialmenu
- `Notify.dc.html` — notifications, drawtext keybind, progressbar

Page 2 — Screens & Apps (all remaining surfaces, same system):

- `Multichar.dc.html` — character select + details card
- `Spawn.dc.html` — map-style spawn selector (last location / apartment / motel)
- `Phone.dc.html` — EmberOS phone: clock, notification, app grid, dock
- `Inventory.dc.html` — pockets/trunk grids, weight bars, hotbar, item actions
- `Banking.dc.html` — Fleeca app: sidebar, balance, quick actions, transactions
- `Shop.dc.html` — 24/7 store: category tabs, product grid, basket, cash/bank
- `Scoreboard.dc.html` — server header, job counts, player table
- `Management.dc.html` — boss menu: society stats, employee table
- `Admin.dc.html` — staff panel: categories, toggles, player actions
- `Clothing.dc.html` — wardrobe: category rail, variation carousel, outfits

EmberOS phone apps (page 3, three screens per board):

- `PhoneSettings.dc.html` — lock screen, camera viewfinder, settings (streamer mode, storage)
- `PhoneCalls.dc.html` — keypad, recents, in-call controls
- `PhoneMsg.dc.html` — message inbox, chat with location card, contact profile
- `PhoneBank.dc.html` — Fleeca home card, transfer with numpad, transfer receipt
- `PhoneBirdy.dc.html` — social feed, compose with photo attach, profile
- `PhoneMail.dc.html` — mail inbox, opened DMV receipt email, alarms
- `PhoneGarage.dc.html` — fleet with valet request, city services directory, EmberCoin crypto chart

Extended screens (page 4) — the remaining interface of every script:

- `Charcreate.dc.html` — multicharacter: identity form, heritage, delete guard
- `Apartment.dc.html` — apartments: building select, interior menu, rent status
- `HUDStates.dc.html` — HUD states (critical, underwater, money, cinematic, parachute, stress) + settings
- `Hotbar.dc.html` — inventory hotbar, right-click menu, item detail, split, weight
- `Crafting.dc.html` — workbench recipes, live progress, weapon attachment bench
- `ATM.dc.html` — street ATM: PIN pad, quick withdraw, dispensing, fees
- `GarageUI.dc.html` — garage terminal, vehicle rail, shared keys, impound
- `Ammunation.dc.html` — weapon shop with license gate, checkout with tax
- `Barber.dc.html` — barber controls, tattoo zone picker, saved looks

## Single-file collection

`EmberRP-UI-All.html` bundles **every** board above into one standalone file (open it in any browser). It is the canonical collection: every new interface designed for this project gets added here. To rebuild it after adding or editing a board, register the board in the `SECTIONS` list of `build-all.mjs` and run:

```
node design/build-all.mjs
```

NUI implementation follows once mockups are approved.
