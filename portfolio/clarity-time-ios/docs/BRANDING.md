# App branding — Clarity Time

> **Filled copy** of the monorepo template. Session prompts: *“Follow `docs/BRANDING.md`”* — do not paste full icon rules into every chat.  
> **Source template:** [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md)

---

## App identity

| Field | Value |
|-------|--------|
| **Display name** | Clarity Time |
| **Repo path** | `portfolio/clarity-time-ios/` |
| **Stack** | SwiftUI iOS 17 + `ClarityUI` |
| **Bundle ID** | `com.chasewhittaker.ClarityTime` |
| **Storage key** | `chase_time_ios_v1` |
| **Primary ritual** (center glyph concept) | Time sessions + scripture streak — **analog clock** on the navy tile: white outer ring, light-blue inner ring, **two white hands**, **blue progress arc** on the ring (timer / segment of focus) + suite **check badge** |

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
| Wide mockup in `docs/design/` | ✅ `app-icon-mockup-wide.png` (1376×768, user mark centered on `#E6E7EB` field) |

| Asset | Path |
|-------|------|
| Shipped icon | `ClarityTime/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| Wide reference | `docs/design/app-icon-mockup-wide.png` |
| User-provided 1024 master (provenance) | `docs/design/app-icon-source-user-1024.png` |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-13 | Shipped AppIcon from wide mockup; `docs/BRANDING.md`; linked from `CLAUDE.md`. |
| 2026-04-13 | **Canonical mark:** user-supplied 1024 clock + progress arc + check badge → `AppIcon.png`; wide slide asset rebuilt from that master on gray canvas. |
