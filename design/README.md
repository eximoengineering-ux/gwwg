# Nova — FiveM UI Direction (three)

Third design direction, per feedback: **modern 2026, elegant and balanced.**
Soft charcoal surfaces, one calm accent, generous rounding, quiet motion.
Four starter boards (HUD, garage menu, dialog, notifications); the full set
of screens follows once the direction is approved. "Nova RP" is a
placeholder identity.

## Design tokens

| Token | Value | Use |
|---|---|---|
| Base | `#0b0c10` scene → `#101116` | world backdrop |
| Surface | `rgba(23,24,30,0.78–0.85)` + 24–28px blur | panels |
| Hairline | `rgba(255,255,255,0.07)` + inset top light `0.07` | borders |
| Accent | `#8B93FF` (hover `#AEB4FF`, gradient → `#6E6BFF`) | the one live color |
| Success / Danger / Warn / Aqua | `#5FD4A2` / `#FF6B6B` / `#FFC46B` / `#6BC8E8` | status |
| Text | `#F2F3F7` / `#9CA0AE` / `#5D616E` | primary / secondary / muted |

Typography: **Sora** (display, 500–700, tight tracking) + **Manrope**
(UI, 400–800); numerals always `font-variant-numeric: tabular-nums`.
Radius scale: 999px capsules, 22px dialogs, 14–18px panels/rows,
11–12px controls. Keycaps: rounded 7–8px with inset top light and a
2px drop — real keyboard feel.

Motion: entrances fade + 12px rise + 0.98 scale on
`cubic-bezier(0.22, 1, 0.36, 1)`; meters grow from zero; quiet loops only
(breathing status dot, voice bars, keybind ripple, toast drain).
Disabled under `prefers-reduced-motion`.

## Boards

- `Main.dc.html` — HUD: rounded minimap card, capsule status bar with
  voice meter, wallet capsule, speed panel with gear and belt dot
- `Menu.dc.html` — garage list with soft selection ring and meta meters
- `Input.dc.html` — DMV dialog: focus-ring plate field, segmented class
  control, total row, gradient primary button
- `Notify.dc.html` — toast stack with timed drains, keybind ripple chip,
  progress card

Earlier directions (Ember, The Marlow Papers) live in git history and the
canvas version picker.
