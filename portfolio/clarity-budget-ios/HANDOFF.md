# Handoff — Clarity Budget (iOS)

## Current status: v0.2 MVP (YNAB-first Today + web companion)

- **Backlog / issues:** Linear is not used for this app; use [`ROADMAP.md`](ROADMAP.md) and [`CHANGELOG.md`](CHANGELOG.md) in-repo.
- **Version:** **v0.2** — Today tab (safe to spend month / week / day), [`../clarity-budget-web`](../clarity-budget-web) Next.js dashboard (same STS math + blob sync), `_syncAt` + stub `BudgetSupabaseSync`; iOS cloud sync still **stub** until `supabase-swift` is wired.
- **Last session:** 2026-04-16 — docs + web UI aligned with iOS Today layout; **`xcodebuild test` ClarityBudget** ✅ after Simulator recovery (see `LEARNINGS.md`); portfolio `CLAUDE.md` / root `HANDOFF` / `ROADMAP` Change Log updated.
- **Bundle ID:** `com.chasewhittaker.ClarityBudget`
- **Storage key:** `chase_budget_ios_v1` (single `Codable` root in `UserDefaults` — **never rename**)
- **Shared package:** `../clarity-ui` (local SPM — `ClarityUI`)
- **PBX prefix:** **`CB`** — all generated IDs in `ClarityBudget.xcodeproj/project.pbxproj` use `CB*` (reserved: `CC`, `CT`, `CX` for sibling Clarity apps)
- **Branding / launcher:** [`docs/BRANDING.md`](docs/BRANDING.md) · shipped **`AppIcon.png`** (1024) — **stacked coins**; [`docs/design/app-icon-mockup-wide.png`](docs/design/app-icon-mockup-wide.png); prior **dual-column** wide → `docs/design/app-icon-mockup-explore-columns.png`; other **explore** wides + rationale in `docs/BRANDING.md`. Shared rules: [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md).

### Build / test

- `ClarityBudget.xcodeproj` is **generated in-repo** (no manual Xcode project wizard).
- Verify with `xcodebuild` on an **installed** iOS Simulator + `CODE_SIGNING_ALLOWED=NO`. Use `-showdestinations` if your preferred device name/OS is missing. If tests fail to **boot** the Simulator (`launchd_sim`, “Clone 1 of …”), see **`LEARNINGS.md`** (Simulator / CI) before assuming code regressions.

### Open project

```bash
open portfolio/clarity-budget-ios/ClarityBudget.xcodeproj
```

---

## Product / data model

### Tabs (v0.2)

**Today · Scenarios · Wants · Settings** — `ContentView`. **Today** is the YNAB-first home (`SafeToSpendHomeView`): `refreshYNABSnapshot()`, pull-to-refresh, quick YNAB sheet. **Settings** holds full `BudgetYNABSettingsView` (token, budget, roles, import, fund).

### Dual scenarios (v0.1+)

1. **Baseline** — conservative month: `BudgetScenario` with `label`, `monthlyIncomeCents`, `fixedNeedsCents`, `flexibleNeedsEstimateCents`, `wantsBudgetCents`, `wantsSpentCents`.
2. **Stretch** — alternate plan (e.g. lower fixed costs or higher wants cap) stored side-by-side in `BudgetBlob.baseline` / `BudgetBlob.stretch`.
3. **Glance math (all in cents):**
   - `afterNeedsCents` = income − fixed − flexible estimate
   - `wantsRemainingVersusBudgetCents` = wants budget cap − wants spent
   - `surplusAfterNeedsAndWantsCents` = afterNeeds − wants spent

### Wants tracking

- **Aggregate only (v0.1):** each scenario has `wantsSpentCents` incremented from the **Wants** tab (quick +$5 / +$20 / +$50, custom dollars, or reset). No per-line want ledger yet (see `ROADMAP.md`).

### Persistence

- One root struct `BudgetBlob` keyed by `BudgetConfig.storeKey`, optional **`_syncAt`** (`syncAtMilliseconds`) for cloud merge.
- No secondary keys for app data.

### Web + Supabase

- **Next.js:** [`../clarity-budget-web`](../clarity-budget-web) — Geist typography, dashboard UI matched to iOS Today (hero month + week/day cards, obligations gap strip); same STS math as `BudgetMetricsEngine` / Funded; optional Supabase email/password for `user_data` row `app_key` = `clarity_budget` (see web `README.md`). YNAB PAT stays in **browser `localStorage` only**.
- **iOS cloud:** `BudgetSupabaseSync` is a **stub** (`pullIntoStore` / `pushBlob` no-ops) until you add `supabase-swift` and Info.plist keys `ClaritySupabaseURL` / `ClaritySupabaseAnonKey` (placeholders exist).

---

## What shipped (MVP through v0.2)

| Area | Notes |
|------|-------|
| Today | Safe-to-spend month / week / day; pull-to-refresh; YNAB quick sheet; `refreshYNABSnapshot()` + `YNABDashboardSnapshot` |
| Web | [`../clarity-budget-web`](../clarity-budget-web) — read-only STS from YNAB + optional Supabase blob merge (category roles from phone or prior sync) |
| Scenarios | Edit baseline + stretch; summary rows (after needs, wants remaining vs plan, surplus) |
| Wants | Segmented picker (scenario); log spend; reset spent for scenario |
| Quote | `budgetQuotes` + `QuoteBanner` on Scenarios and Wants |
| Storage | `StorageHelpers` + `BudgetBlob` JSON + `_syncAt` |
| Tests | `ClarityBudgetTests` + `YNABScenarioImportTests` + `BudgetMetricsEngineTests`; legacy blob JSON without YNAB keys |
| YNAB | **Settings** tab + sheet: PAT, budget, roles, income, import Baseline, fund category (PATCH) |

---

## Done when (checklist)

- [x] Two scenarios persist and edit independently
- [x] Wants spend logs against selected scenario; reset works
- [x] `xcodebuild build` clean (simulator, no signing) — verified iPhone 15 / iOS 17.2
- [x] `xcodebuild test` — verified iPhone 15 / iOS 17.2, `CODE_SIGNING_ALLOWED=NO` (same destination as `CLAUDE.md`; Simulator must boot — see `LEARNINGS.md` if `launchd_sim` errors)

---

## Next (repo roadmap)

**Phase 5 — Clarity Growth (iOS)** — `portfolio/clarity-growth-ios/` — not started.

**This app (v0.2+):** see [`ROADMAP.md`](ROADMAP.md) (month boundaries, want line items, export).

---

## Fresh session prompt — continue Clarity Budget (copy into new chat)

After `checkpoint`:

```
Read CLAUDE.md and repo HANDOFF.md first, then portfolio/clarity-budget-ios/CLAUDE.md and portfolio/clarity-budget-ios/HANDOFF.md.

Goal: Continue Clarity Budget iOS at portfolio/clarity-budget-ios/.

Current state: **v0.2 MVP shipped** — **Today** tab (YNAB safe to spend month/week/day) + **web companion** + `_syncAt` / stub Supabase sync; dual scenarios + wants; **Settings** = full YNAB; PBX prefix **CB**; store key `chase_budget_ios_v1`; ClarityUI via `../clarity-ui`; launcher = stacked coins + [`docs/BRANDING.md`](docs/BRANDING.md).

Pick next work from [`ROADMAP.md`](ROADMAP.md) (e.g. real iOS Supabase, wants month boundaries) or fix bugs. Follow existing patterns: `@Observable` `@MainActor` store, `@MainActor` on views that mutate the store from nested `Button` builders, `StorageHelpers` persistence.

Verify: cd portfolio/clarity-budget-ios && xcodebuild -scheme ClarityBudget -showdestinations
Then build and test (if Simulator fails to boot / `launchd_sim`, see `LEARNINGS.md`):
  xcodebuild build -scheme ClarityBudget -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO
  xcodebuild test  -scheme ClarityBudget -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO

Update CHANGELOG [Unreleased], ROADMAP, this HANDOFF, root ROADMAP Change Log, root HANDOFF State when you stop.
```

---

## Historical — Phase 4 initial scaffold prompt (complete)

*(Use the “continue” block above for new sessions; this was the first-build checklist.)*

```
Read CLAUDE.md and HANDOFF.md first.

Goal: Build Phase 4 — Clarity Budget iOS at portfolio/clarity-budget-ios/.

Read portfolio/clarity-budget-ios/HANDOFF.md for scope, constraints, and PBX prefix guidance.
Follow the same structure and pattern as portfolio/clarity-time-ios/ (Phase 3), portfolio/clarity-triage-ios/ (Phase 2), and portfolio/clarity-checkin-ios/ (Phase 1):
  models → store → views → programmatic xcodeproj → verify build → run tests.

The xcodeproj must be generated programmatically (no manual Xcode project wizard).
Use a NEW two-letter PBX ID prefix (do not use CC, CT, or CX — reserved for prior Clarity iOS apps). Document the chosen prefix (e.g. CB) in portfolio/clarity-budget-ios/HANDOFF.md.

Wire local package ../clarity-ui as ClarityUI.

Start with: product/data model notes in HANDOFF if still TBD, then models → store → views → xcodeproj → build → test.
```
