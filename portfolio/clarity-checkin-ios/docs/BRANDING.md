# App branding — Clarity Check-in

> **Filled copy** of the monorepo template. Session prompts: *“Follow `docs/BRANDING.md`”* — do not paste full icon rules into every chat.  
> **Source template:** [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md)

---

## App identity

| Field | Value |
|-------|--------|
| **Display name** | Clarity Check-in |
| **Repo path** | `portfolio/clarity-checkin-ios/` |
| **Stack** | SwiftUI iOS 17 + `ClarityUI` |
| **Bundle ID** | `com.chasewhittaker.ClarityCheckin` |
| **Storage keys** | `chase_checkin_ios_v1`, `chase_checkin_ios_draft_v1`, `chase_checkin_ios_meds_v1` |
| **Primary ritual** (center glyph concept) | Morning + evening check-in on a horizon; small checklist tick; compact med **pill** on the horizon |

---

## Visual system

### Clarity iOS

**Shared technical spec:** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)

| Checklist | Done |
|-----------|------|
| `AppIcon.appiconset/AppIcon.png` — **1024×1024**, opaque | ✅ |
| `Contents.json` — `"filename": "AppIcon.png"` on universal iOS slot | ✅ |
| Icon uses shared shell + unique center glyph per spec | ✅ |
| `AccentColor.colorset` aligned with badge | ✅ |
| Wide mockup in `docs/design/` | ✅ `app-icon-mockup-wide.png` |

| Asset | Path |
|-------|------|
| Shipped icon | `ClarityCheckin/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| Wide reference | `docs/design/app-icon-mockup-wide.png` |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-13 | Initial `BRANDING.md`; AppIcon shipped; linked from `CLAUDE.md`. |
| 2026-04-13 | Portfolio template [`PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md) added for sibling apps. |
