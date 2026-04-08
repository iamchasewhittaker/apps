# Changelog — YNAB Clarity iOS

## [Unreleased]

### Fixed
- Auto-categorization no longer defaults everything to Ignore — `suggestRole()` now runs
  a group-level pass first (stronger signal), then expanded keyword matching covering
  real-world YNAB naming patterns (Tithes & Giving, Fun & Entertainment, Gifts &
  Celebrations, NEEDS, KIDS, etc.)
- Re-running category setup now re-suggests roles for anything previously saved as Ignore,
  instead of locking in that default permanently
- Mortgage and fixed bills paid early in the month (balance = $0) now correctly show as
  covered — `isCovered` checks whether a payment went out, not just whether balance > 0
- Income setup YNAB suggestion banner now correctly pre-fills the form when tapped —
  replaced `isPresented` + separate state with `sheet(item:)` using `IncomeSheetConfig:
  Identifiable` to eliminate a SwiftUI timing race where the sheet evaluated its closure
  before the prefill state update propagated
- All 5 view files recreated after accidental deletion from disk (Views/ directory was
  removed when trying to fix an Xcode project navigator issue); project is now committed
  to git so this cannot cause permanent data loss again

### Added
- "Re-suggest All" button in category setup resets all role selections to fresh
  auto-suggestions without leaving the screen
- Fun Money help sheet — tap ⓘ on the Safe to Spend card to see what should and
  shouldn't come out of personal fun money vs. shared family categories
- `activityDollars` computed property on `YNABMonthCategory` for downstream use
- All 4 main tab views written and registered in Xcode project:
  `DashboardView`, `BillsPlannerView`, `IncomeGapView`, `CashFlowView`
- `FunMoneyHelpView` — full dos/don'ts help sheet with Chase ($250/mo) and
  Kassie ($200/mo) fun money budgets, redirect rules, and rule-of-thumb callout
- `SettingsSheet` embedded in DashboardView — tax rate slider, budget name display,
  token re-entry, and reset setup action
- Initial commit of entire project to monorepo git — `portfolio/ynab-clarity-ios/`
  was previously untracked, making file recovery impossible

---

### Added (initial build)
- Initial project scaffold: Xcode project, all source files, unit tests
- `ClarityTheme` — dark palette, semantic colors (safe/caution/danger/accent/mortgage), card modifier
- `CategoryMapping` SwiftData model — maps YNAB categories to app roles
- `IncomeSource` SwiftData model — named income with biweekly/monthly frequency
- `YNABClient` — read-only YNAB API client (fetchBudgets, fetchCategories, fetchMonth)
- `MetricsEngine` — pure formula functions (totalRequired, shortfall, safeToSpend, incomeGap, grossAnnualNeeded)
- `CashFlowEngine` — timeline event builder with mortgage-covered marker
- `KeychainHelper` — device-only Keychain read/write for YNAB token
- `AppState` — @MainActor ObservableObject, in-memory YNAB data cache
- `MockData` — static preview/test data (placeholder budget ID, not real)
- 4-step setup flow: token entry → budget picker → category classification → income sources
- 4 main screens: Dashboard, Bills Planner, Income Gap/Salary, Cash Flow
- `MetricsEngineTests` — unit tests for all formula functions
- `CashFlowEngineTests` — timeline and date math tests
- `.gitignore` — Xcode artifacts, no credentials
