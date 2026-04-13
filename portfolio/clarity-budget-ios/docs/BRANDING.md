# App branding — Clarity Budget

> **Filled copy** of the monorepo template. Session prompts: *“Follow `docs/BRANDING.md`”* — do not paste full icon rules into every chat.  
> **Source template:** [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md)

---

## App identity

| Field | Value |
|-------|--------|
| **Display name** | Clarity Budget |
| **Repo path** | `portfolio/clarity-budget-ios/` |
| **Stack** | SwiftUI iOS 17 + `ClarityUI` |
| **Bundle ID** | `com.chasewhittaker.ClarityBudget` |
| **Storage key** | `chase_budget_ios_v1` |
| **Primary ritual** (center glyph concept) | Dual-scenario budget + wants — **paired vertical columns** with a **connecting balance stroke** (baseline vs stretch, room for wants) |

---

## Visual system

### Clarity iOS

**Shared technical spec:** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)

| Checklist | Done |
|-----------|------|
| `AppIcon.appiconset/AppIcon.png` — **1024×1024**, opaque | ✅ |
| `Contents.json` — `"filename": "AppIcon.png"` on universal iOS slot | ✅ |
| Icon uses shared shell + unique center glyph per spec | ✅ |
| `AccentColor.colorset` aligned with badge | ✅ (suite blue) |
| Wide mockup in `docs/design/` | ✅ `app-icon-mockup-wide.png` (1376×768) |

| Asset | Path |
|-------|------|
| Shipped icon | `ClarityBudget/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| Wide reference | `docs/design/app-icon-mockup-wide.png` |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-13 | Shipped AppIcon from wide dual-column mockup; `docs/BRANDING.md`; linked from `CLAUDE.md`. |
