# CLAUDE.md — YNAB Clarity iOS

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
YNABClarityApp.swift    — @main, ModelContainer setup
ContentView.swift       — TabView + setup gate, refreshes on launch
Theme/ClarityTheme.swift — dark palette, card modifier, currency formatter
Models/
  CategoryMapping.swift — @Model: ynabCategoryID, name, roleRaw
  IncomeSource.swift    — @Model: name, amountCents, frequencyRaw, nextPayDate
YNAB/
  YNABModels.swift      — Decodable response types (convertFromSnakeCase)
  YNABClient.swift      — URLSession, 3 methods: fetchBudgets/Categories/Month
Engine/
  MetricsEngine.swift   — pure static functions, no SwiftUI, all formulas
  CashFlowEngine.swift  — buildTimeline() → [CashFlowEvent]
Setup/                  — 4-step onboarding: token → budget → categories → income
Views/                  — 4 main tabs
Shared/
  KeychainHelper.swift  — SecItem read/write, device-only storage
  AppState.swift        — @MainActor ObservableObject, in-memory YNAB cache
  MockData.swift        — static preview/test data (no real IDs)
```

## Key conventions

- SwiftData @Model properties must never be renamed or removed (lightweight migration only)
- New @Model properties must have default values
- `amountCents: Int` — whole cents, not Double, to avoid float rounding
- AppStorage keys prefixed with `chase_ynab_clarity_ios_`
- `YNABClient` takes token as `init(token: String)` — future OAuth just changes the caller
- YNAB amounts are in milliunits → divide by 1000 for dollars

## YNAB API

- Base URL: `https://api.ynab.com/v1`
- Auth: `Authorization: Bearer {token}`
- Decoder: `.convertFromSnakeCase`
- Month format: `YYYY-MM-01`
- Active budget: stored at runtime in AppStorage `chase_ynab_clarity_ios_budget_id`

## SwiftData schema migration rules

To add a new field to CategoryMapping or IncomeSource:
1. Add with a default value: `var dueDay: Int = 1`
2. Test by running on an existing simulator install (don't delete the app)
3. If app crashes on launch, the migration is broken — investigate before proceeding

## Testing

Run tests: ⌘U in Xcode

- `MetricsEngineTests` — all formula logic against MockData
- `CashFlowEngineTests` — timeline generation and date math

Both test targets compile without network access. No mocking of external APIs needed.

## Related

- `projects/ynab-enrichment/` — Python tool that enriches YNAB transaction memos (separate, read-write)
- YNAB budget ID: stored at runtime only, never hardcoded
