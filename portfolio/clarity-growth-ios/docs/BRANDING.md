# App branding — Clarity Growth

> **Filled copy** of the monorepo template. Session prompts: *“Follow `docs/BRANDING.md`”* — do not paste full icon rules into every chat.  
> **Source template:** [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md)

---

## App identity

| Field | Value |
|-------|--------|
| **Display name** | Clarity Growth |
| **Repo path** | `portfolio/clarity-growth-ios/` |
| **Stack** | SwiftUI iOS 17 + `ClarityUI` |
| **Bundle ID** | `com.chasewhittaker.ClarityGrowth` |
| **Storage key** | `chase_growth_ios_v1` |
| **Primary ritual** (center glyph concept) | Seven growth areas + streaks — **sprout** (stem + two leaves) on the shared tile — reads as **organic growth** and pairs with streak continuity without tying the mark to one area |

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
| Wide mockup in `docs/design/` | ✅ `app-icon-mockup-wide.png` (1376×768 on `#E6E7EB` field); **`app-icon-mockup-explore-sprout.png`** kept in sync as a duplicate path for older links |

| Asset | Path |
|-------|------|
| Shipped icon | `ClarityGrowth/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| Wide reference (shipped glyph) | `docs/design/app-icon-mockup-wide.png` — **sprout** (same pixels as `app-icon-mockup-explore-sprout.png`) |
| Explore — steps *(prior ship)* | `docs/design/app-icon-mockup-explore-steps.png` |
| Explore — nodes | `docs/design/app-icon-mockup-explore-nodes.png` |
| Explore — arc | `docs/design/app-icon-mockup-explore-arc.png` |

---

## Alternate explorations (not shipped)

Same Clarity shell as [`CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md) §2. **Shipped** center mark is the **sprout** on `app-icon-mockup-wide.png` / `AppIcon.png`. The files below are **reference-only** if you iterate the launcher again.

| File | Why it works for Clarity Growth |
|------|----------------------------------|
| **`app-icon-mockup-explore-steps.png`** | **Forward progress / leveling up.** Ascending steps read as incremental gains—good when you want a “climb” metaphor tied to milestones rather than organic imagery. *(Previously shipped 2026-04-13; retained as explore.)* |
| **`app-icon-mockup-explore-nodes.png`** | **Many areas, one system.** Linked nodes suggest **multiple growth tracks** (the seven IDs) that still form one graph—emphasizes **breadth** over a single curve. |
| **`app-icon-mockup-explore-arc.png`** | **Trajectory + measurement.** An upward curve with ticks reads as **progress over time**—aligned with **weekly bars** and session counts without duplicating Clarity Time’s clock. |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-13 | Shipped AppIcon from wide mockup (`sips` pad `#E6E7EB` → 1024); `docs/BRANDING.md`; linked from `CLAUDE.md`. |
| 2026-04-13 | Added wide **explore** mockups (`explore-sprout`, `explore-nodes`, `explore-arc`) + rationale table in this file. |
| 2026-04-14 | **Shipped glyph → sprout:** `app-icon-mockup-wide.png` + `AppIcon.png` regenerated via `sips`; prior **steps** wide preserved as `app-icon-mockup-explore-steps.png`; `app-icon-mockup-explore-sprout.png` synced to canonical wide. |
