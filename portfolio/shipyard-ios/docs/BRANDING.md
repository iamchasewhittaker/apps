# App branding — Shipyard (iOS)

> **Purpose:** Single source for identity + visual rules. Link here from `CLAUDE.md` instead of restating hex codes or icon geometry in every chat.

---

## App identity

| Field | Value |
|-------|-------|
| **Display name** | Shipyard |
| **Repo path** | `portfolio/shipyard-ios/` |
| **Stack** | SwiftUI + iOS 17 + `@Observable` (no ClarityUI in Phase 1) |
| **Bundle ID** | `com.chasewhittaker.Shipyard` |
| **Storage / app key** | `chase_shipyard_ios_v1` (Phase 2+) |
| **Primary ritual** | "Glance at the fleet — which ship is under construction today?" |

---

## Visual system — Nautical

Shipyard is the **one non-Clarity-family** iOS app. It borrows the "dark suite + accent" spirit but uses a nautical palette and compass-rose mark, not the Clarity geometry.

### Palette

| Token | Swift | Hex | Use |
|-------|-------|-----|-----|
| Navy (bg) | `Palette.navy` | `#0A1E3F` | App background, icon background |
| Deep sea | `Palette.deepSea` | `#132B5A` | Cards, grouped list rows |
| Gold (accent) | `Palette.gold` | `#D4A84B` | Compass rose, AccentColor, chips |
| Sail cream | `Palette.sailCream` | `#F4EAD5` | Primary text |
| Mist | `Palette.mist` | `#9BB0C8` | Secondary text |
| Storm (warning) | `Palette.storm` | `#E56B4E` | Stalled / drydock chip |

### Icon — Compass Rose

**Master:** `design/app-icon.svg` — 1024 × 1024 flat SVG, navy background, gold compass rose (4 cardinal points + inner circle).

**Render:** `design/generate-app-icons.sh` — single command: `qlmanage -t -s 1024 design/app-icon.svg` → `sips` resize → `Shipyard/Assets.xcassets/AppIcon.appiconset/Icon-1024.png`.

| Checklist | Done |
|-----------|------|
| `Assets.xcassets/AppIcon.appiconset/Icon-1024.png` — 1024×1024 opaque | ✅ |
| `AppIcon.appiconset/Contents.json` — single universal iOS slot | ✅ |
| `AccentColor.colorset` — gold (`#D4A84B`) | ✅ |
| Master SVG + render script committed | ✅ |

---

## Voice & naming

| Rule | Value |
|------|-------|
| User-visible product name | Shipyard |
| Lexicon | Nautical — "ships" not "projects", "under construction" not "building", "drydock" not "paused", "launched" not "shipped", "fleet" not "dashboard" |
| Words to avoid in UI | "App", "project" (user-facing copy) |

---

## Related monorepo docs

| Doc | Use when |
|-----|----------|
| [`/docs/templates/PORTFOLIO_APP_LOGO.md`](../../../docs/templates/PORTFOLIO_APP_LOGO.md) | Reviewing the shared logo format |
| [`/docs/design/README.md`](../../../docs/design/README.md) | Index of design specs |
| [`portfolio/shipyard/`](../../shipyard/) | Web source of truth — keep labels consistent |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-17 | Initial `BRANDING.md` + compass-rose AppIcon + nautical palette |
