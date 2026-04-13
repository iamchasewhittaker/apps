# Changelog — Clarity Budget (iOS)

## [Unreleased]

- **App icon:** `docs/design/app-icon-mockup-wide.png` (dual-column / balance mark) → `AppIcon.appiconset/AppIcon.png` (1024×1024) via `sips --padColor E6E7EB -p 1376 1376` + `sips -z 1024 1024`; `Contents.json` filename on universal iOS slot
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) (from portfolio template); `CLAUDE.md` links branding + shared icon spec

## v0.1 — 2026-04-13 — Phase 4 MVP

- **Models:** `BudgetBlob`, `BudgetScenario`, `BudgetScenarioKind`; cents-based money; `BudgetMoneyFormat`; `BudgetBlobFactory.defaultBlob()`; pure helpers `afterNeedsCents`, `wantsRemainingVersusBudgetCents`, `surplusAfterNeedsAndWantsCents`
- **Config:** `BudgetConfig` — store key `chase_budget_ios_v1`
- **Store:** `BudgetStore` — `@Observable @MainActor`, `nonisolated init()`, load/save via `StorageHelpers`, replace baseline/stretch, add/reset wants spend
- **Views:** TabView (Scenarios · Wants); scenario editors + summary; wants quick-add + custom amount + reset; `QuoteBanner` + `budgetQuotes`
- **Quotes:** `budgetQuotes` — clarity, scenarios, wants, margin themes
- **Tests:** `BudgetBlobTests` — JSON round-trip, scenario math, money format smoke
- **Project:** `ClarityBudget.xcodeproj` generated programmatically — `CB*` PBX IDs (from Time template), local SPM `../clarity-ui`, scheme `ClarityBudget`
- **Verify:** `xcodebuild build` succeeded on **iPhone 15 (iOS 17.2) simulator** with `CODE_SIGNING_ALLOWED=NO`. Run `xcodebuild test` on the same destination when the Simulator service is healthy (`-showdestinations` to pick an installed runtime).
