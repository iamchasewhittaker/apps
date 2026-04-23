# Branding — Fairway

## Palette

Augusta green — deep, precise, turf-management aesthetic. Not playful; professional.

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0A1A0F` | App background, sheet backgrounds |
| Surface | `#112417` | Cards, list rows, zone cards |
| Primary | `#1B5E2F` | Navigation bars, primary buttons |
| Accent | `#15803D` | Active status dots, selected tab indicator, chart bars |
| Highlight | `#4ADE80` | Positive readings, healthy indicators |
| PRE-SEASON badge | `#D97706` | Amber — `isPreSeason: true` heads and problems |
| CONFIRMED badge | `#DC2626` | Red — confirmed problem areas |
| Text primary | `#F3F4F6` | All body and label text |
| Text secondary | `#9CA3AF` | Captions, secondary labels |

---

## Typography

SwiftUI system typography throughout — no custom fonts. Size and weight follow SwiftUI `.title`, `.headline`, `.body`, `.caption` scales so Dynamic Type works automatically.

Monospace: system monospace (`.monospacedDigit()`) for numeric readings — soil values, spreader output, GPM.

---

## Voice

Fairway talks like a head groundskeeper's clipboard — short labels, units always present, no interpretation unless the data demands it.

---

## Logo direction

Dark background (`#0f1117`). Label text: **LAWN** in deep green (`#15803D`), all-caps, weight 600, spaced wide. Main text: **FAIRWAY** in white (`#F3F4F6`), weight 800, 95px, letter-spacing -4. Favicon: FAIRWAY at 12px with a `#15803D` accent bar below.

SVG values:
- Label: `LAWN` · accent `#15803D` · label y `200`
- Main: `FAIRWAY` · 7 chars · 95px · letter-spacing -4
- Favicon bar: x `10`, width `44`

---

## iOS conventions

- `tint` color: accent green `#15803D`
- Status dots: green = active, gray = inactive, amber = PRE-SEASON, red = CONFIRMED
- Zone cards: `Surface` background, accent dot left of zone name
- Bar chart (soil): bars in `Accent`; bars below ideal range in `PRE-SEASON` amber
- No custom animations — SwiftUI defaults only

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-22 | Initial BRANDING.md from Idea Kitchen retroactive session |
