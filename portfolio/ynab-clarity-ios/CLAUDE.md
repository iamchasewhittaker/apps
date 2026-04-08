# CLAUDE.md — YNAB Clarity iOS

> Read this before touching any file in this project. Both Claude Code and Cursor use this file.

## What this app does

A read-only YNAB companion app. Answers 4 questions the YNAB UI answers poorly:

1. Are my bills / mortgage covered this month?
2. How much am I short — and what income gap does that create?
3. How much can I safely spend today / this week / this month?
4. When will my mortgage be fully funded based on my paycheck schedule?

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
  CategoryMapping.swift      — @Model: ynabCategoryID, name, ynabGroupName, roleRaw
  IncomeSource.swift         — @Model: name, amountCents, frequencyRaw, nextPayDate, sortOrder
YNAB/
  YNABModels.swift           — Decodable response types (convertFromSnakeCase); budgetedDollars/activityDollars/balanceDollars computed props
  YNABClient.swift           — URLSession, 3 methods: fetchBudgets/fetchCategories/fetchMonth
Engine/
  MetricsEngine.swift        — pure static functions, no SwiftUI; CategoryBalance value type; all formulas
  CashFlowEngine.swift       — buildTimeline() → [CashFlowEvent]; mortgage-covered marker
Setup/
  SetupFlowView.swift        — 4-step onboarding coordinator (token → budget → categories → income)
  TokenStepView.swift        — Keychain token entry + verification against YNAB API
  BudgetStepView.swift       — budget picker; calls fetchBudgets
  CategorySetupView.swift    — role picker per YNAB category; suggestRole() auto-classification
  IncomeSetupView.swift      — income source list; YNAB monthly income hint banner
Views/
  DashboardView.swift        — "Overview" tab; mortgage card, bills card, safe-to-spend chips, SettingsSheet
  BillsPlannerView.swift     — "Bills" tab; sectioned list with progress bars + Covered/Partial/Shortfall badges
  IncomeGapView.swift        — "Salary" tab; income vs required, gap indicator, gross annual salary target
  CashFlowView.swift         — "Cash Flow" tab; chronological timeline from CashFlowEngine
  FunMoneyHelpView.swift     — help sheet (dos/don'ts for personal fun money vs shared categories)
Shared/
  KeychainHelper.swift       — SecItem read/write, device-only storage
  AppState.swift             — @MainActor ObservableObject; in-memory YNAB cache; buildBalances() wrapper
  MockData.swift             — static preview/test data (no real IDs or tokens)
```

## Key conventions

- SwiftData `@Model` properties must never be renamed or removed (lightweight migration only)
- New `@Model` properties must have default values so existing installs don't crash on launch
- `amountCents: Int` — whole cents, not Double, to avoid float rounding
- AppStorage keys prefixed `chase_ynab_clarity_ios_`
- `YNABClient` takes token as `init(token: String)` — future OAuth just changes the caller
- YNAB amounts are in milliunits → divide by 1000 for dollars
- `CategoryBalance` is a value type (struct) — not stored, always recomputed via `MetricsEngine.buildBalances`
- `MetricsEngine` and `CashFlowEngine` are pure enums (no state, no SwiftUI imports) — keep them that way

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

## SwiftData schema migration rules

To add a new field to `CategoryMapping` or `IncomeSource`:
1. Add with a default value: `var dueDay: Int = 1`
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
- Linear: (add project link when created)
