# CLAUDE.md — YNAB Clarity iOS

> Read this before touching any file in this project. Both Claude Code and Cursor use this file.

## What this app does

A YNAB companion app for iOS. Answers 4 questions the YNAB UI answers poorly:

1. Are my bills / mortgage covered this month?
2. How much am I short — and what income gap does that create?
3. How much can I safely spend today / this week / this month?
4. When will my mortgage be fully funded based on my paycheck schedule?

**Read + write:** The app reads YNAB data via the API. It can also **write** budgeted
(assigned) amounts back via `PATCH /v1/budgets/{id}/months/{month}/categories/{cat_id}`.
Writes require user confirmation and are equivalent to the user manually assigning money in YNAB.

> *"For Reese. For Buzz. Forward — no excuses."*

## Tech stack

- Swift 5.0 · SwiftUI · SwiftData · iOS 17.0+
- No third-party dependencies
- Bundle ID: `com.chasewhittaker.YNABClarity`

## Security rules (non-negotiable)

- YNAB token stored in iOS Keychain only (`kSecAttrAccessibleWhenUnlockedThisDeviceOnly`)
- Token **never** written to AppStorage, UserDefaults, SwiftData, logs, or print statements
- `YNABClient` never stores the token as a property — reads from Keychain on each refresh
- `YNABClient.request()` must never log the Authorization header
- `MockData.swift` uses placeholder budget ID, not the real one

## Architecture

```
YNABClarityApp.swift         — @main, ModelContainer setup, AppState StateObject
ContentView.swift            — TabView (4 tabs) + setup gate, refresh on launch
Theme/
  ClarityTheme.swift         — dark palette, semantic colors, card modifier, currency formatter
Models/
  CategoryMapping.swift      — @Model: ynabCategoryID, name, ynabGroupName, roleRaw, dueDay
  IncomeSource.swift         — @Model: name, amountCents, frequencyRaw, nextPayDate, sortOrder
YNAB/
  YNABModels.swift           — Decodable response types (convertFromSnakeCase); goalTarget/budgeted/activity/balance dollar computed props
  YNABClient.swift           — URLSession; fetchBudgets/fetchCategories/fetchMonth (read) + updateCategoryBudgeted (write)
Engine/
  MetricsEngine.swift        — pure static functions, no SwiftUI; CategoryBalance + GoalStatus value types; all formulas
  CashFlowEngine.swift       — buildTimeline() → [CashFlowEvent]; mortgage-covered marker; today marker
Setup/
  SetupFlowView.swift        — 4-step onboarding coordinator (token → budget → categories → income)
  TokenStepView.swift        — Keychain token entry + verification against YNAB API
  BudgetStepView.swift       — budget picker; calls fetchBudgets
  CategorySetupView.swift    — role picker per YNAB category; suggestRole() auto-classification; dueDay picker
  IncomeSetupView.swift      — income source list; YNAB monthly income hint banner
Views/
  DashboardView.swift        — "Overview" tab; safe-to-spend → budget health → mortgage → bills → underfunded goals; SettingsSheet
  BillsPlannerView.swift     — "Bills" tab; sections by coverage status (Needs Attention / Partial / Covered)
  IncomeGapView.swift        — "Income" tab; income vs required, gap/surplus, gross annual salary target
  CashFlowView.swift         — "Cash Flow" tab; chronological timeline with today marker from CashFlowEngine
  FunMoneyHelpView.swift     — help sheet (dos/don'ts for personal fun money vs shared categories)
  Components/
    TipBanner.swift          — dismissible first-visit contextual help banner (one per tab)
Shared/
  KeychainHelper.swift       — SecItem read/write, device-only storage
  AppState.swift             — @MainActor ObservableObject; in-memory YNAB cache; buildBalances() wrapper; fundCategory()
  MockData.swift             — static preview/test data (no real IDs or tokens)
```

## Critical data flow: goal_target vs budgeted

YNAB categories have two dollar amounts that matter:
- **`budgeted`** (milliunits) — the amount the user has **assigned** this month. Can be $0 early in the month.
- **`goal_target`** (milliunits) — the user's **monthly goal** for that category. Persistent across months.

`MetricsEngine.buildBalances()` sets `monthlyTarget` to `goalTargetDollars ?? budgetedDollars`.
This means the app prefers goal targets (which reflect what the user *needs*) and falls back to
assigned amounts only when no goal is set. Every downstream metric — `totalRequired`, `shortfall`,
`safeToSpend`, `incomeGap`, `grossAnnualNeeded`, the cash flow timeline — depends on this value.

**If `monthlyTarget` is $0 everywhere**, the root cause is that `YNABMonthCategory` is not
decoding `goal_target` from the API response, or the user's YNAB categories don't have goals set.

## Key conventions

- SwiftData `@Model` properties must never be renamed or removed (lightweight migration only)
- New `@Model` properties must have default values so existing installs don't crash on launch
- `amountCents: Int` — whole cents, not Double, to avoid float rounding
- AppStorage keys prefixed `chase_ynab_clarity_ios_` (includes `last_refreshed_epoch` for stale-data banner)
- `YNABClient` takes token as `init(token: String)` — future OAuth just changes the caller
- YNAB amounts are in milliunits → divide by 1000 for dollars
- `CategoryBalance` is a value type (struct) — not stored, always recomputed via `MetricsEngine.buildBalances`
- `MetricsEngine` and `CashFlowEngine` are pure enums (no state, no SwiftUI imports) — keep them that way
- Bills tab sections are organized by **coverage status** (Needs Attention / Partial / Covered), not by role
- Overview tab card order: Safe to Spend → Budget Health → Bills & Essentials (mortgage + bills + essentials) → Spending (transactions) → Underfunded Goals
- **Safe to spend:** sums positive available on mapped categories that are **not** mortgage/bill/essential (same pool as “Flexible” in practice), **plus** YNAB month `to_be_budgeted` (Ready to Assign), minus `currentShortfall` on required categories; floored at $0

## Sheet pattern — always use `sheet(item:)` for pre-filled forms

Using `.sheet(isPresented:)` with a separate state variable for pre-fill data is a SwiftUI
timing bug waiting to happen. SwiftUI may evaluate the sheet closure before the state update
propagates, so `State(initialValue:)` receives empty values and locks them in.

**Correct pattern:**
```swift
private struct MySheetConfig: Identifiable {
    let id = UUID()
    var name: String
    var amount: String
}
@State private var activeSheet: MySheetConfig? = nil

// Present:
activeSheet = MySheetConfig(name: "Pre-filled", amount: "100")

// Sheet:
.sheet(item: $activeSheet) { config in
    MyFormView(prefilledName: config.name, prefilledAmount: config.amount)
}
```

## Fun money setup (user's YNAB budget)

- **Chase's Fun Money** — $250/mo in "Fun & Entertainment" group
- **Kassie's Fun Money** — $200/mo in "Fun & Entertainment" group
- Rule: personal-only spending → fun money; anything both people benefit from → shared category
- `FunMoneyHelpView` shows the full dos/don'ts — accessible via ⓘ on the Safe to Spend card

## YNAB API

- Base URL: `https://api.ynab.com/v1`
- Auth: `Authorization: Bearer {token}`
- Decoder: `.convertFromSnakeCase`
- Month format: `YYYY-MM-01`
- Active budget ID: AppStorage key `chase_ynab_clarity_ios_budget_id` (runtime only, never hardcoded)

### Read endpoints (existing)
- `GET /budgets` — budget list (setup)
- `GET /budgets/{id}/categories` — category groups (setup)
- `GET /budgets/{id}/months/{month}` — monthly detail with categories (includes `to_be_budgeted`)
- `GET /budgets/{id}/transactions?since_date=YYYY-MM-DD` — transactions for spending summaries

### Write endpoint
- `PATCH /budgets/{id}/months/{month}/categories/{cat_id}` — update assigned amount
- Body: `{"category": {"budgeted": <milliunits>}}`
- Only `budgeted` can be updated; goals/targets are read-only
- Always show a confirmation dialog before writing
- Refresh data immediately after a successful write

### Key response fields on `YNABMonthCategory`
| Field | Type | Description |
|-------|------|-------------|
| `budgeted` | Int (milliunits) | Assigned this month |
| `activity` | Int (milliunits) | Spending (negative = outflow) |
| `balance` | Int (milliunits) | Available after activity |
| `goal_target` | Int? (milliunits) | Monthly goal amount (nil if no goal) |
| `goal_type` | String? | "MF" (monthly funding), "TB" (target balance), "TBD" (target by date) |
| `goal_percentage_complete` | Int? | YNAB's own goal completion percentage |

## SwiftData schema migration rules

To add a new field to `CategoryMapping` or `IncomeSource`:
1. Add with a default value: `var dueDay: Int = 0`
2. Test by running on an existing simulator install (do **not** delete the app first)
3. If the app crashes on launch, the migration is broken — investigate before proceeding
4. Never rename or remove existing `@Model` properties

## Xcode project file rules

- **Never** add a file via Xcode's "Add Files" by selecting a folder — this creates a
  nested group and can produce duplicate paths or accidentally delete files
- Always add individual `.swift` files one at a time
- If removing a file from the project navigator, use **"Remove Reference"** — never
  "Move to Trash" (this deletes the file from disk and from git working tree)
- If a build error says "Build input files cannot be found", the file was deleted from disk,
  not just from the project; check `git status` and restore with `git checkout`

## Testing

Run tests: **⌘U** in Xcode

- `MetricsEngineTests` — all formula logic against MockData
- `CashFlowEngineTests` — timeline generation and date math

Both test targets compile without network access. No mocking of external APIs needed.

## Git / file safety

- Project lives at `portfolio/ynab-clarity-ios/` in the monorepo at `~/Developer/chase`
- All source is committed — if a file disappears, `git checkout <path>` restores it
- Never leave the project untracked; commit after every meaningful session
- The `.gitignore` excludes Xcode build artifacts (`xcuserstate`, `DerivedData`, etc.) but
  keeps all `.swift`, `.pbxproj`, and asset files

## Related

- `projects/ynab-enrichment/` — Python tool that enriches YNAB transaction memos (separate, read-write)
- Monorepo CLAUDE.md: `~/Developer/chase/CLAUDE.md`
- Plan: `.cursor/plans/ynab_clarity_rethink_*.plan.md`
- Linear: (add project link when created)

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
