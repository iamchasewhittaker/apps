# Handoff — Clarity Budget (iOS)

## Current status: Phase 4 complete (MVP v0.1)

- **Version:** v0.1
- **Last session:** 2026-04-13
- **Bundle ID:** `com.chasewhittaker.ClarityBudget`
- **Storage key:** `chase_budget_ios_v1` (single `Codable` root in `UserDefaults` — **never rename**)
- **Shared package:** `../clarity-ui` (local SPM — `ClarityUI`)
- **PBX prefix:** **`CB`** — all generated IDs in `ClarityBudget.xcodeproj/project.pbxproj` use `CB*` (reserved: `CC`, `CT`, `CX` for sibling Clarity apps)
- **Branding / launcher:** [`docs/BRANDING.md`](docs/BRANDING.md) · shipped **`AppIcon.png`** (1024) + [`docs/design/app-icon-mockup-wide.png`](docs/design/app-icon-mockup-wide.png). Shared rules: [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md).

### Build / test

- `ClarityBudget.xcodeproj` is **generated in-repo** (no manual Xcode project wizard).
- Verify with `xcodebuild` on an **installed** iOS Simulator + `CODE_SIGNING_ALLOWED=NO`. Use `-showdestinations` if your preferred device name/OS is missing.

### Open project

```bash
open portfolio/clarity-budget-ios/ClarityBudget.xcodeproj
```

---

## Product / data model (v0.1)

### Dual scenarios

1. **Baseline** — conservative month: `BudgetScenario` with `label`, `monthlyIncomeCents`, `fixedNeedsCents`, `flexibleNeedsEstimateCents`, `wantsBudgetCents`, `wantsSpentCents`.
2. **Stretch** — alternate plan (e.g. lower fixed costs or higher wants cap) stored side-by-side in `BudgetBlob.baseline` / `BudgetBlob.stretch`.
3. **Glance math (all in cents):**
   - `afterNeedsCents` = income − fixed − flexible estimate
   - `wantsRemainingVersusBudgetCents` = wants budget cap − wants spent
   - `surplusAfterNeedsAndWantsCents` = afterNeeds − wants spent

### Wants tracking

- **Aggregate only (v0.1):** each scenario has `wantsSpentCents` incremented from the **Wants** tab (quick +$5 / +$20 / +$50, custom dollars, or reset). No per-line want ledger yet (see `ROADMAP.md`).

### Persistence

- One root struct `BudgetBlob` keyed by `BudgetConfig.storeKey`.
- No secondary keys for app data.

---

## What shipped (MVP)

| Area | Notes |
|------|-------|
| Scenarios | Edit baseline + stretch; summary rows (after needs, wants remaining vs plan, surplus) |
| Wants | Segmented picker (scenario); log spend; reset spent for scenario |
| Quote | `budgetQuotes` + `QuoteBanner` on both tabs |
| Storage | `StorageHelpers` + `BudgetBlob` JSON |
| Tests | `ClarityBudgetTests` — JSON round-trip, math, format smoke |

---

## Done when (checklist)

- [x] Two scenarios persist and edit independently
- [x] Wants spend logs against selected scenario; reset works
- [x] `xcodebuild build` clean (simulator, no signing) — verified iPhone 15 / iOS 17.2
- [ ] `xcodebuild test` — run locally when Simulator launches cleanly (same destination as `CLAUDE.md`)

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

Current state: Phase 4 MVP v0.1 shipped — dual scenarios + wants aggregate; PBX prefix CB; store key chase_budget_ios_v1; ClarityUI via ../clarity-ui.

Pick next work from portfolio/clarity-budget-ios/ROADMAP.md (or fix bugs). Follow existing patterns: @Observable @MainActor store, @MainActor on views that mutate store from nested Button builders, StorageHelpers persistence.

Verify: cd portfolio/clarity-budget-ios && xcodebuild -scheme ClarityBudget -showdestinations
Then build (and test when Simulator is healthy):
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
