# The Marlow Papers — FiveM UI Direction

Design source for a full QBCore/QBox NUI redesign in an original direction:
**a city that runs on paper.** No dark glass, no neon — every interface is a
printed artifact on ivory stock, laid on a dark desk. The "Marlow RP"
identity is a placeholder and easy to swap.

## Design tokens

| Token | Value | Use |
|---|---|---|
| Ivory | `#F1EBDF` (gradient `#F4EFE4 → #EDE6D6`) | card stock |
| Bright stock | `#F7F2E8` | fields, tiles, inner paper |
| Manila | `#E4DBC6` | folders, photo boxes |
| Ink | `#16140F` | type, rules, solid buttons |
| Ink soft / faded | `#57524A` / `#8A8478` | secondary / metadata |
| Vermilion | `#C3372B` | the one live action, stamps, selection |
| Ledger green | `#2E7D5B` | credit, success |
| Brass | `#B07818` | caution, pins |
| Duty blue | `#2F5E8F` | police, signatures |
| Desk | `#101113 → #08090a` | dark world behind the paper |

Typography: **Instrument Serif** (+italic — display, names, big numerals),
**Archivo** (UI labels, buttons, 400–800), **IBM Plex Mono** (serials,
plates, ledgers, keybinds). Paper grain: 1px dot pattern at 4.5% ink.

## Signature motifs

- **Cards deal in** (translate + slight rotate), stamps **slam** at 1.7×
  and settle crooked, meters draw inside 1px ink frames.
- Punched **ticket notches** and dashed perforations; **luggage tags** with
  pointed ends and punched holes; receipt **tear edges**.
- **Crop marks** on focused documents; double ledger rules (1.5px + 1px);
  dotted **leader lines** to prices; barcodes as striped gradients.
- Serif italic index numerals (01, 02…) instead of icons where possible;
  one vermilion action per surface.
- Reduced motion disables everything.

## Artboards

Page 1 — Core & HUD: system specimen sheet; HUD (pocket-watch minimap,
status ticket, receipt wallet, odometer digits); valet-board garage menu;
DMV Form 12-B with ballot boxes and a signature; reticle + strung paper
tags for qb-target; a **fanned card deck** for the radial menu; telegram
slips, a keybind slip and a printing work order.

Page 2 — Screens & Apps: passport cards with MRZ lines + dossier folder;
folded survey map with wax-red pins; Marlow OS e-paper phone; pockets/trunk
cargo manifests with hotbar stubs; Fleeca passbook with DR/CR ledger and
side tabs; diner price list + printed register receipt; nightly census
with tally marks; Benny's letterhead payroll; staff case files with a
two-signature ban; tailor's pattern wardrobe with fabric swatches.

NUI implementation follows once the direction is approved.
