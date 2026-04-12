# Changelog — YNAB Clarity iOS

## [v0.2] — 2026-04-12

### Added
- **4-Rules redesign:** tabs restructured around YNAB's 4 rules — Assign (Give Every Dollar a Job), Bills (Embrace True Expenses), Adjust (Roll With the Punches), Age Money (Age Your Money)
- **Categorization Review section (Bills tab):** surfaces uncategorized transactions with payee-name keyword suggestions; tap any row to open `CategoryReviewSheet` showing top 3 category options; confirm writes back to YNAB via `PATCH /budgets/{id}/transactions`; section shows badge count or green "All Categorized" row
- **`CategorySuggestionEngine`** (`Engine/CategorySuggestionEngine.swift`) — pure Swift enum; `payeeRules` maps 25+ lowercase payee patterns to `CategoryRole`; `suggest()` returns `[CategorySuggestion]` ranked by confidence; `needsReview()` filters: not deleted, not transfer, outflow only, no category or "Uncategorized"
- **`CategorySuggestion`** struct — `mapping: CategoryMapping`, `confidence: Double`, `matchedKeyword: String`
- **Age of Money card (Age Money tab):** pulls `ageOfMoney` from YNAB `GET /budgets/{id}`; color-coded label: < 10 days = "Paycheck to paycheck" (danger), 10–19 = "Building a buffer" (caution), 20–29 = "Getting ahead" (safe), ≥ 30 = "Money is aging well" (accent)
- **`YNABBudgetDetail` + `YNABBudgetDetailResponse`** — decodable structs for `GET /budgets/{id}` response; extracts `ageOfMoney: Int?`
- **`YNABBulkTransactionUpdate`** — encodable body for `PATCH /budgets/{id}/transactions`; sends `[{id, categoryId}]`
- **`YNABClient.fetchBudgetDetail(budgetID:)`** — `GET /budgets/{id}` → `YNABBudgetDetail`
- **`YNABClient.updateTransactionCategory(budgetID:transactionID:categoryID:)`** — bulk PATCH endpoint; accepts HTTP 209
- **`AppState.ageOfMoney: Int?`** published property; fetched in parallel with existing `fetchMonth` + `fetchTransactions` calls
- **`AppState.updateTransactionCategory(transactionID:categoryID:categoryMappings:incomeSources:)`** — calls client, then refreshes
- **`YNABTransaction.categoryId: String?`** — decoded from existing `category_id` field in transactions API response
- Budget health row + underfunded goals card moved to **Adjust tab** (was Overview/Dashboard)
- **TipBanner messages updated** per rule: Assign → "Give every dollar a job…", Bills → "Embrace your true expenses…", Adjust → "Roll with the punches…", Age Money → "Age your money…"
- **`label:Receipt` pre-filter** added to `spend-clarity/src/gmail_client.py` `search_emails()` — aligns with Inbox Zero Gmail filter taxonomy

### Fixed
- **`MetricsEngineTests`:** added `categoryId: nil` to all 4 `YNABTransaction` memberwise initializers — new field added to the struct broke the test build

### Changed
- **Tab 1 "Assign"** (`DashboardView`): simplified to Safe to Spend + Spending cards only; budget health + underfunded goals moved to Adjust tab
- **Tab 2 "Bills"** (`BillsPlannerView`): categorization review section inserted above existing bill sections; navigation title unchanged
- **Tab 3 "Adjust"** (`IncomeGapView`): navigation title → "Adjust"; added `budgetHealthRow` + `underfundedGoalsCard` at top; TipBanner → Rule 3 message
- **Tab 4 "Age Money"** (`CashFlowView`): navigation title → "Age Money"; age of money card inserted above summary + timeline cards; TipBanner → Rule 4 message
- **`patchRequest`** now accepts HTTP 200, 201, and 209 — YNAB bulk transaction PATCH returns 209, which previously caused a runtime error
- **`ContentView`** tab labels and icons updated to 4-rules naming

---

## [Unreleased]

### Added
- **Overview tab** (`OverviewView.swift`) — Safe to Spend + Spending + stale/error banners; first tab in `TabView`
- **`SettingsSheetView.swift`** — settings extracted for reuse from Overview
- **`PayeeDisplayFormatter.swift`** — merchant-friendly payee labels + memo preview for Bills review
- **Assign Category sheet** — searchable list of all non-ignored mapped categories, grouped by role, with “Suggested” section; memo line on header when present
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
- Unit tests: `testBuildBalances_usesGoalTargetWhenPresent`, `testBuildBalances_fallsToBudgetedWhenNoGoal`, `testSafeToSpend_includesToBeBudgeted`, `testObligationsCoverageFraction_matchesOverallRequired`, `testObligationsCoverageFraction_clampedWhenCategoryDeeplyNegative`, `testOutflowSpending_sumsNegativeAmountsInRange`
- **`FundCategoryConfirmationSheet.swift`** — shared fund confirmation sheet for Bills and Adjust tabs
- **`GoalStatus.ynabCategoryID`** — stable identity + funding target wiring from Adjust tab goal gaps
- **Unit tests** for `PayeeDisplayFormatter` (ACH / withdrawal noise, Amazon memo subtitle) and `underfundedGoals` category ID

### Changed
- **App icon** — replaced `AppIcon.png` with higher-contrast artwork (1024×1024); `Contents.json` includes `ios-marketing` 1024 entry alongside universal
- **`PayeeDisplayFormatter`** — strips leading bank / ACH / bill-pay noise before merchant shortcuts so payees like “Withdrawal ACH … AMZN …” resolve to **Amazon**
- **`PayeeDisplayFormatter.itemContextSubtitle`** — memo lines prefixed with `Item:`; Amazon-specific hint when memo is empty
- **Adjust tab** — underfunded goal rows are tappable; confirmation sheet assigns gap via existing `fundCategory` YNAB write
- **Low vision** — `ClarityTheme.muted` brightened; `supportingFont` (subheadline) for tips and long explanatory copy across Overview, Assign, Bills, Adjust, Age Money, How It Works, `TipBanner`
- **Age of Money** — status row pairs SF Symbol + descriptive text (not color-only); extended blurbs in `ageLabel`
- **Removed global / sheet `preferredColorScheme(.dark)`** — app follows system appearance while keeping dark-themed surfaces
- **5 tabs:** Overview → Assign → Bills → Adjust → Age Money (`ContentView.swift`)
- **Assign tab** (`DashboardView.swift`) — Ready to Assign, obligations funded progress, next-step copy (no longer hosts Safe to Spend / Spending)
- **Bills** — categorization rows use cleaned payee + optional memo subtitle; `CategorySuggestionEngine` returns all role matches / all flexibles (no arbitrary cap of 3)
- **Adjust** — “Underfunded Goals” renamed to **Funding gaps** with clearer copy (goal target vs assigned this month)
- **Age Money** (`CashFlowView`) — milestones card, coaching actions, supporting-context header for paycheck/required + timeline; timeline optional when empty
- **`YNABTransaction.memo: String?`** — decoded for memo display in Bills
- **`HowItWorksView`** — copy aligned to five tabs
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
- **App Icon asset catalog** — removed duplicate `ios-marketing` + `universal` 1024 entries (same file) that triggered Xcode “unassigned child” on `AppIcon`
- **`YNABClarity.xcodeproj`** — `FundCategoryConfirmationSheet.swift` added to **Components** group and app target **Sources**
- **`ProgressView` runtime warnings:** clamp coverage to `0...1` when YNAB `available` is negative so `funded / target` never goes below zero; `ClarityTheme.clampedProgressFraction` + defensive `progressColor` clamp
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
