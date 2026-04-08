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

### Added
- "Re-suggest All" button in category setup resets all role selections to fresh
  auto-suggestions without leaving the screen
- Fun Money help sheet — tap ⓘ on the Safe to Spend card to see what should and
  shouldn't come out of personal fun money vs. shared family categories
- `activityDollars` computed property on `YNABMonthCategory` for downstream use

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
