# App branding — Ash Reader (iOS)

> Single source for identity + visual rules. Link here from `CLAUDE.md` — do not restate hex codes or icon geometry in session prompts.

---

## App identity

| Field | Value |
|-------|-------|
| **Display name** | Ash Reader |
| **Repo path** | `portfolio/ash-reader-ios/` |
| **Stack** | SwiftUI iOS 17+ · UserDefaults · fully offline |
| **Bundle ID** | `com.chasewhittaker.AshReader` |
| **Storage key prefix** | `ash_reader_ios_` |
| **Primary ritual** | Read therapeutic conversation in chunks → copy → paste into Ash |

---

## Visual system

### Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Accent / Electric Yellow | `#f5e300` | Tab tint, Copy button, progress bar, capsule active state, numbered labels |
| Accent Ink | `#0f0f0f` | Text on yellow, icon foreground |
| Background | `#0f0f0f` | App background, nav bars |
| Surface | `#1a1a1a` / `#151515` | Cards, accordion rows |
| Surface Hover | `#1e1e22` | Accordion expanded state |
| Border | `#2a2a2a` / `#2e2e2e` | Card strokes, dividers |
| Body text | `#e8e8e8` | Primary readable text |
| Secondary text | `#b0b0b0` | Subtitles, counts |
| Muted text | `#777777` / `#888888` | Theme indices, section headers |
| Done / green | `#6dbf6d` | Checkmark fill, success messages |

### App icon — Concept P6 (canonical)

- **Background:** electric yellow `#f5e300`
- **Foreground:** "AR" monogram + "ASH READER" subtitle, both `#0f0f0f`
- **Typeface:** Futura Bold (800 weight) for "AR" at 520pt; Futura 500 for "ASH READER" subtitle at 90pt, 75% opacity
- **Source SVG:** `design/app-icon.svg` (1024×1024 viewBox, rx=180 rounded square)
- **Generation script:** `design/generate-app-icons.sh` — uses `qlmanage` + `sips` (no external deps)
- **Output:** 12 PNGs → `AshReader/Assets.xcassets/AppIcon.appiconset/`
- **Re-run whenever SVG changes.** Do NOT hand-edit PNGs.

| Size | File |
|------|------|
| 40×40 | `Icon-20@2x.png` |
| 60×60 | `Icon-20@3x.png` |
| 58×58 | `Icon-29@2x.png` |
| 87×87 | `Icon-29@3x.png` |
| 80×80 | `Icon-40@2x.png` |
| 120×120 | `Icon-40@3x.png` / `Icon-60@2x.png` |
| 180×180 | `Icon-60@3x.png` |
| 76×76 | `Icon-76.png` |
| 152×152 | `Icon-76@2x.png` |
| 167×167 | `Icon-83.5@2x.png` |
| 1024×1024 | `Icon-1024.png` |

---

## Typography (UI)

- **Body / actions:** `SF Pro` (`.system(size: 15)`) — default SwiftUI
- **Subtitles / counts:** `.system(size: 11–13)`
- **Section headers (CAPS):** `.system(size: 13, weight: .semibold)`, `.textCase(.uppercase)`, `.tracking(0.7)`
- **Chunk text:** `.system(size: 16)`, line spacing 6

---

## Voice

| Rule | Value |
|------|-------|
| Product name | Ash Reader |
| Tone | Calm, direct — therapeutic context; no hype |
| Avoid | Marketing superlatives, emoji in UI |

---

## Related files

| File | Purpose |
|------|---------|
| `design/app-icon.svg` | Canonical P6 icon source |
| `design/generate-app-icons.sh` | Renders SVG → all 12 PNG sizes |
| `design/logo-mockups.html` | All P1–P6 variants (preserved for reference) |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-17 | Initial `BRANDING.md` — P6 electric yellow "AR" monogram |
