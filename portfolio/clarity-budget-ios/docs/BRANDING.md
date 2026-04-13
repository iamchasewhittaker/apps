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
| **Primary ritual** (center glyph concept) | Dual-scenario budget + wants — **stacked coins** (three rounded forms) on the shared tile — reads as **building margin** and stacking progress across baseline vs stretch |

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
| Wide mockup in `docs/design/` | ✅ `app-icon-mockup-wide.png` (1376×768); **`app-icon-mockup-explore-stack.png`** kept in sync as duplicate path for older links |

| Asset | Path |
|-------|------|
| Shipped icon | `ClarityBudget/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| Wide reference (shipped glyph) | `docs/design/app-icon-mockup-wide.png` — **stacked coins** (same pixels as `app-icon-mockup-explore-stack.png`) |
| Explore — columns *(prior ship)* | `docs/design/app-icon-mockup-explore-columns.png` |
| Explore — scales | `docs/design/app-icon-mockup-explore-scales.png` |
| Explore — ledger | `docs/design/app-icon-mockup-explore-ledger.png` |

---

## Alternate explorations (not shipped)

Same Clarity shell as [`CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md) §2. **Shipped** center mark is **stacked coins** on `app-icon-mockup-wide.png` / `AppIcon.png`. The files below are **reference-only** for future iteration or decks.

| File | Why it works for Clarity Budget |
|------|----------------------------------|
| **`app-icon-mockup-explore-columns.png`** | **Dual scenarios + wants.** Paired vertical columns with a connecting stroke map directly to **baseline vs stretch** and room for wants. *(Previously shipped 2026-04-13; retained as explore.)* |
| **`app-icon-mockup-explore-scales.png`** | **Fairness / tradeoffs.** Scales read as “weighing” baseline vs stretch and **balancing** needs vs wants—strong money metaphor without chart junk. |
| **`app-icon-mockup-explore-ledger.png`** | **Line-item clarity.** A baseline with ticks reads as **accounts + summary lines**—fits “know your numbers” without copying the coin stack. |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-13 | Shipped AppIcon from wide dual-column mockup; `docs/BRANDING.md`; linked from `CLAUDE.md`. |
| 2026-04-14 | Wide **explore** mockups (`explore-scales`, `explore-stack`, `explore-ledger`) + rationale table; then **shipped glyph → stacked coins** (`app-icon-mockup-wide.png` + `AppIcon.png` via `sips`; prior dual-column → `app-icon-mockup-explore-columns.png`; `explore-stack` synced to canonical wide). |
