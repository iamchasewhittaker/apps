# Clarity Budget (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App identity

- **Version:** v0.2 (v0.1 scenarios/wants + YNAB + Today + web; see `HANDOFF.md`)
- **Bundle ID:** `com.chasewhittaker.ClarityBudget`
- **Storage key:** `chase_budget_ios_v1`
- **Entry:** `ClarityBudget/ClarityBudgetApp.swift`
- **Shared package:** `../clarity-ui` (local SPM — product `ClarityUI`)
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — single source for icons/palette; do not restate full rules in session prompts.
- **Clarity iOS icon system:** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)

## Purpose

Dual-scenario budget (baseline vs stretch) plus wants tracking — local-first, same patterns as Clarity Check-in / Triage / Time. **Today** tab: YNAB **safe to spend** (month / week / day) via `BudgetMetricsEngine` + `refreshYNABSnapshot()`. Optional **YNAB** link: token in Keychain (`BudgetYNABKeychain`), same API client/models/metrics patterns as **Funded** / YNAB stack; **Import** refreshes the **Baseline** scenario from mapped category roles; **Fund category** PATCHes assigned amount with confirmation. **Web:** [`../clarity-budget-web`](../clarity-budget-web) mirrors STS math and optional Supabase blob sync (`clarity_budget`).

> *"For Reese. For Buzz. Forward — no excuses."*

## What This App Is

A dual-scenario iOS budget (baseline vs stretch) with live YNAB integration via a Keychain-secured token — shows safe-to-spend figures for month, week, and day, and lets you assign money to categories directly from the app with a confirmation step. Part of the Clarity iOS suite, sharing the ClarityUI design system and the same Supabase project as the web companion.

## Tech stack

SwiftUI · iOS 17 · `@Observable` · UserDefaults + JSON `Codable` · ClarityUI only (no SwiftData, no third-party deps). YNAB: URLSession + `https://api.ynab.com/v1` (ported `YNABClient` / `YNABModels`); token **never** in UserDefaults or logs (Keychain only, `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`).

## Commands

```bash
cd portfolio/clarity-budget-ios

xcodebuild -scheme ClarityBudget -showdestinations

xcodebuild build -scheme ClarityBudget \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO

xcodebuild test -scheme ClarityBudget \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO
```

If **test** fails to boot the Simulator (`launchd_sim`, “Clone 1 of …”), see **`LEARNINGS.md`** (Simulator / CI) — `build` can still succeed.

Open in Xcode: `open ClarityBudget.xcodeproj`

## File structure

```
ClarityBudget/
  ClarityBudgetApp.swift
  Models/BudgetBlob.swift
  Services/BudgetConfig.swift
  Services/BudgetStore.swift
  Services/YNABDashboardSnapshot.swift
  Services/BudgetSupabaseSync.swift
  YNAB/
    BudgetYNABKeychain.swift
    YNABClient.swift
    YNABModels.swift
    BudgetYNABDTOs.swift       — CategoryRole, YNABCategoryMapping, YNABIncomeSource
    BudgetMetricsEngine.swift  — pure metrics (mirrors YNAB Clarity engine; DTOs not SwiftData)
    YNABScenarioImport.swift   — month + mappings → Baseline cents
  Constants/Quotes.swift
  Views/ContentView.swift
  Views/SafeToSpendHomeView.swift
  Views/BudgetScenariosView.swift
  Views/BudgetYNABSettingsView.swift
  Views/WantsTrackerView.swift
  Assets.xcassets/
ClarityBudgetTests/
  BudgetBlobTests.swift
  YNABScenarioImportTests.swift
  BudgetMetricsEngineTests.swift
```

## Architecture

- Single `BudgetStore` injected with `.environment(BudgetStore.self)` from `@main`
- Views that call store mutations are marked **`@MainActor`** (Swift 6–friendly isolation with `@Observable` stores)
- PBX object IDs use prefix **`CB`** (do not reuse `CC`, `CT`, or `CX`)

## Constraints

- **Issue tracking:** This app opts out of portfolio Linear for MVP. Use [`ROADMAP.md`](ROADMAP.md), [`CHANGELOG.md`](CHANGELOG.md), and [`HANDOFF.md`](HANDOFF.md) only—do not add `TODO`/`FIXME` that assume an external issue tracker for this repo.
- Do not change `BudgetConfig.storeKey` once real devices hold data
- **`BudgetConfig.ynabBudgetIdUserDefaultsKey`** — optional mirror of selected budget id; do not reuse `chase_ynab_clarity_ios_*` keys
- **`YNABClient`** must never log the `Authorization` header (same rule as YNAB Clarity iOS)

### YNAB import mapping (Baseline only)

- **Income:** if `ynabIncomeSources` is non-empty → projected pay this month (`BudgetMetricsEngine.expectedIncomeThisMonth`); else YNAB month `income` (milliunits → cents).
- **Fixed needs:** sum of monthly targets (goal → else assigned) for roles **mortgage + bill**.
- **Flexible needs estimate:** sum of targets for **essential**.
- **Wants budget cap:** sum of targets for **flexible**.
- **Wants spent:** unchanged on import.

## Session start — maintenance / v0.2+

```
Read CLAUDE.md and portfolio/clarity-budget-ios/CLAUDE.md first.

Goal: Work on Clarity Budget iOS at portfolio/clarity-budget-ios/.

Read portfolio/clarity-budget-ios/HANDOFF.md for shipped scope and verification.
Run checkpoint before edits; update CHANGELOG / ROADMAP / HANDOFF when you stop.
```
