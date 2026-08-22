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
(`repeating-linear-gradient`, 1px/3px) in the glass. Gauges are 270° SVG
rings (`pathLength` dasharray); status rings are 100-unit circles. Keycaps,
pills and toggles stay rounded (5px/14px); panels stay sharp.

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

Planned batches: 2) multicharacter + spawn + apartments, 3) phone,
4) banking, garages, shops, scoreboard, inventory, management, adminmenu,
clothing. NUI implementation follows once mockups are approved.
