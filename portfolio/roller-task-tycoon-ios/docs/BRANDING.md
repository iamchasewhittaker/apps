# App branding -- RollerTask Tycoon

> **Filled copy** of the monorepo branding template.
> **Source template:** [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md)

## App identity

| Field | Value |
|-------|--------|
| **Display name** | RollerTask Tycoon |
| **Repo path** | `portfolio/roller-task-tycoon-ios/` |
| **Stack** | SwiftUI iOS 17 + SwiftData |
| **Bundle ID** | `com.chasewhittaker.ParkChecklist` |
| **Storage keys** | SwiftData + `@AppStorage` (`chase_roller_task_tycoon_ios_*`) |
| **Primary ritual** | Park-themed task completion with gamified rewards |
| **Center glyph** | Roller coaster track arc (peaked curve) with gold accent at summit |

## Visual system

### Clarity iOS (adopted)

**Canonical spec:** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)

| Checklist | Done |
|-----------|------|
| `AppIcon.appiconset/AppIcon.png` -- 1024x1024, opaque | yes |
| `Contents.json` -- `"filename": "AppIcon.png"` on universal iOS slot | yes |
| Icon uses shared shell (dark tile + white/blue rings + blue badge) | yes |
| Unique center glyph (coaster track arc + gold peak dot) | yes |

## Assets

| Asset | Path |
|-------|------|
| Shipped icon (1024x1024) | `RollerTaskTycoon/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| Generator source | `../clarity-logo-mockups-assets/generate_clarity_icons.py` (`draw_rollertask_center`) |
| Generated master | `../clarity-logo-mockups-assets/rollertask-tycoon-icon.png` |

## Web companion

| Asset | Path |
|-------|------|
| logo192.png | `../rollertask-tycoon-web/public/logo192.png` |
| logo512.png | `../rollertask-tycoon-web/public/logo512.png` |
| apple-touch-icon.png | `../rollertask-tycoon-web/public/apple-touch-icon.png` |
| favicon.svg | `../rollertask-tycoon-web/public/favicon.svg` |
| logo.svg | `../rollertask-tycoon-web/public/logo.svg` |

## In-app theme (ParkTheme.swift)

| Token | Hex | Usage |
|-------|-----|-------|
| woodDark | `#3E2723` | Navigation bars, headers |
| gold | `#C8A84B` | Accent, rewards, profit |
| plaque | `#F5E6C8` | Card backgrounds |
| alertRed | `#C62828` | Broken down status |

## Changelog

| Date | Change |
|------|--------|
| 2026-04-14 | Initial BRANDING.md; adopted Clarity family icon system; coaster track arc glyph with gold peak |
