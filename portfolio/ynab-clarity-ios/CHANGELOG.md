# Changelog — YNAB Clarity iOS

## [Unreleased]

### Added
- **Overview — Spending card:** yesterday / this week / this month outflow totals from `GET .../transactions?since_date=` (excludes transfers); `YNABTransaction` model + `YNABClient.fetchTransactions`
- **Overview — stale sync banner:** when last successful refresh was over 24 hours ago (or never), show a caution banner; refresh timestamp persisted as `chase_ynab_clarity_ios_last_refreshed_epoch` (AppStorage)
- **`YNABMonthDetail.toBeBudgeted`** — Ready to Assign (milliunits) decoded from month response for safe-to-spend
- **YNAB goal targets:** `YNABMonthCategory` decodes `goal_target`, `goal_type`, and `goal_percentage_complete`; `MetricsEngine.buildBalances()` uses `goalTargetDollars ?? budgetedDollars` so metrics reflect monthly goals when assigned dollars are still $0
- **Budget Health** row on Overview: Required / Funded / Shortfall at a glance
- **Underfunded Goals** card on Overview: categories where goal exceeds assigned this month, sorted by gap; green state when all goals are funded (`MetricsEngine.underfundedGoals`, `GoalStatus`)
- **`dueDay`** on `CategoryMapping` (default 0) and on `CategoryBalance`; category setup shows day-of-month picker for mortgage / bill / essential roles
- **`TipBanner`** (`Views/Components/TipBanner.swift`) — dismissible per-tab tips via `chase_ynab_clarity_ios_tip_dismissed_*` AppStorage keys
- **`HowItWorksView`** — full in-app guide from Settings (four core questions, $0 troubleshooting, role definitions)
- **`YNABClient.updateCategoryBudgeted`** — PATCH assigned amount; **`AppState.fundCategory`** refreshes after write
- **Fund** flow on Bills tab: shortfall rows open a confirmation sheet (`sheet(item:)`), then PATCH to goal target in milliunits
- **Cash Flow:** `.todayMarker` event, divider in UI; bill rows show Covered or dollar shortfall; timeline uses `dueDay` with role-based fallback (mortgage day 1, else day 5)
- Unit tests: `testBuildBalances_usesGoalTargetWhenPresent`, `testBuildBalances_fallsToBudgetedWhenNoGoal`, `testSafeToSpend_includesToBeBudgeted`, `testObligationsCoverageFraction_matchesOverallRequired`, `testOutflowSpending_sumsNegativeAmountsInRange`

### Changed
- **Safe to spend:** discretionary pool is all mapped categories except mortgage/bill/essential (not only `.flexible`), plus **Ready to Assign** dollars, minus required shortfall
- **Overview:** single **Bills & Essentials** card includes mortgage with combined progress; mortgage rows use purple label in the uncovered list
- **`AppState.refresh`:** loads month + transactions in parallel; `transactions` published for the Spending card
- **Overview** card order: Safe to Spend → Budget Health → Bills & Essentials (with mortgage) → Spending → Underfunded Goals (replaces separate Mortgage + Bills cards)
- **Bills** tab: sections by coverage — Needs Attention (under 50% funded), Partially Funded (half or more but not covered), Fully Covered (collapsible)
- **Income** tab (renamed from Salary in tab bar): surplus when income exceeds required; expandable income sources inside “This Month”; Salary Target card explains tax rate and required monthly base
- **`MockData`:** all month categories include matching `goalTarget` for tests and previews
- **`YNABClient`** class comment: documents read + PATCH write paths
- **`CLAUDE.md`:** goal vs budgeted data flow, API write rules, architecture updates

### Fixed
- **`YNABClient.patchRequest`:** discard PATCH response body with `_` instead of unused `let data` — clears compiler warning (and builds with “Treat Warnings as Errors”)
- **$0 metrics** when YNAB assigned (`budgeted`) was $0 but monthly goals were set — root cause was using assigned amount as `monthlyTarget` without reading `goal_target`

### Added (earlier in this release train)
- `semimonthly` frequency option ("Twice a month") for income sources — lets users like
  Kassie (paid on the 5th and 20th) enter semi-monthly paychecks accurately
- `secondPayDay: Int` property on `IncomeSource` (SwiftData-safe, defaults to 20) — stores
  the day-of-month for the second payday; only meaningful when frequency is `.semimonthly`
- When "Twice a month" is selected in the income form, the DatePicker label changes to
  "1st pay date" and a `Stepper` row appears for "2nd pay date: Day X" (range 1–31)
- `occurrencesInMonth` now handles `.semimonthly` — emits two dates per month (day from
  `nextPayDate` + `secondPayDay`), both clamped to the month's actual length and sorted
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

### Fixed (earlier)
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

---

### Added (initial build)
- Initial project scaffold: Xcode project, all source files, unit tests
- `ClarityTheme` — dark palette, semantic colors (safe/caution/danger/accent/mortgage), card modifier
- `CategoryMapping` SwiftData model — maps YNAB categories to app roles
- `IncomeSource` SwiftData model — named income with biweekly/monthly frequency
- `YNABClient` — YNAB API client (fetchBudgets, fetchCategories, fetchMonth; PATCH budgeted)
- `MetricsEngine` — pure formula functions (totalRequired, shortfall, safeToSpend, incomeGap, grossAnnualNeeded)
- `CashFlowEngine` — timeline event builder with mortgage-covered marker and today marker
- `KeychainHelper` — device-only Keychain read/write for YNAB token
- `AppState` — @MainActor ObservableObject, in-memory YNAB data cache
- `MockData` — static preview/test data (placeholder budget ID, not real)
- 4-step setup flow: token entry → budget picker → category classification → income sources
- 4 main screens: Dashboard, Bills Planner, Income Gap, Cash Flow
- `MetricsEngineTests` — unit tests for all formula functions
- `CashFlowEngineTests` — timeline and date math tests
- `.gitignore` — Xcode artifacts, no credentials
