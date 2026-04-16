# Changelog — Clarity Budget (iOS)

## [Unreleased]

- **CI / Simulator:** `xcodebuild test -scheme ClarityBudget` verified green on **iPhone 15 / iOS 17.2** after resolving CoreSimulator / `launchd_sim` boot issues; recovery steps in `LEARNINGS.md` (`HANDOFF` checklist updated).
- **Swift 6:** `BudgetStore` — removed `nonisolated init()`; `ClarityBudgetApp` `@MainActor`; defaults in `init()`; **`BudgetYNABDashboardCache`** bundles YNAB error + snapshot + `fetchedAt` as **one** `@Observable` field (avoids repeated non-isolated-init diagnostics on multiple `_ynab…` backings); type line **`@MainActor @Observable`**. See `LEARNINGS.md`.
- **Docs (2026-04-16):** `HANDOFF.md`, `MVP-AUDIT.md`, `CLAUDE.md`, `ROADMAP.md` — v0.2 MVP narrative (Today + web + stub iOS sync); root `HANDOFF.md` Clarity Budget prompt + `chase/ROADMAP.md` Change Log + `chase/CLAUDE.md` portfolio row; `docs/governance/PRODUCT_LINES.md` role line.
- **Web UI:** [`../clarity-budget-web`](../clarity-budget-web) dashboard layout aligned with iOS **Today** (hero month “Full pool”, week/day cards with captions, obligations gap strip, loading skeleton, Geist on `body`).
- **YNAB-first home:** **Today** tab — safe-to-spend month / week / day (`BudgetMetricsEngine.safePerDay` / `safePerWeek`), `refreshYNABSnapshot()` in `BudgetStore`, `SafeToSpendHomeView`; pull-to-refresh + quick YNAB sheet; **Settings** tab embeds `BudgetYNABSettingsView` (`showDismiss: false`); Scenarios tab title fixed.
- **Blob sync field:** `_syncAt` (`syncAtMilliseconds`) on `BudgetBlob` for Supabase merge; `replaceBlobFromRemote` + stub `BudgetSupabaseSync` (wire `supabase-swift` later).
- **Tests:** `BudgetMetricsEngineTests` for STS pace helpers.
- **Web:** new [`../clarity-budget-web`](../clarity-budget-web) — Next.js dashboard + `clarity_budget` `user_data` sync (see that README).
- **Docs:** `MVP-AUDIT.md` filled in; explicit in-repo-only backlog (no Linear). `CLAUDE.md` / `HANDOFF.md` / `ROADMAP.md` note the same.
- **YNAB (read + write):** Keychain token (`BudgetYNABKeychain`, service `com.chasewhittaker.ClarityBudget`); ported `YNABClient` / `YNABModels`; `BudgetYNABDTOs` + `BudgetMetricsEngine` + `YNABScenarioImport`; `BudgetBlob` extended with `ynabBudgetId`, `ynabCategoryMappings`, `ynabIncomeSources` (legacy JSON decodes with empty defaults); **Budget** toolbar → **YNAB** settings (budget picker, category roles, income sources, import Baseline, fund category with confirmation + PATCH); tests `YNABScenarioImportTests` + legacy blob decode in `BudgetBlobTests`.
- **Theme alignment (via clarity-ui):** `ClarityPalette` BASE tokens updated — `bg` `#0f1117`, `surface` `#161b27`, `border` `#1f2937`, `text` `#f3f4f6`, `muted` `#6b7280`; inherited from `clarity-ui` package; no local changes required
- **App icon (glyph refresh):** shipped center mark changed from **dual columns + balance stroke** to **stacked coins**; `docs/design/app-icon-mockup-wide.png` + `AppIcon.png` regenerated with `sips`; prior columns art → `docs/design/app-icon-mockup-explore-columns.png`. **`docs/BRANDING.md`** updated. `xcodebuild build` **ClarityBudget** ✅ (iPhone 15 / iOS 17.2, `CODE_SIGNING_ALLOWED=NO`).
- **Design references:** wide **explore** launcher mockups in `docs/design/` — `app-icon-mockup-explore-{scales,stack,ledger}.png` (1376×768); rationale in **`docs/BRANDING.md`**.
- **App icon:** `docs/design/app-icon-mockup-wide.png` (dual-column / balance mark) → `AppIcon.appiconset/AppIcon.png` (1024×1024) via `sips --padColor E6E7EB -p 1376 1376` + `sips -z 1024 1024`; `Contents.json` filename on universal iOS slot
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) (from portfolio template); `CLAUDE.md` links branding + shared icon spec

## v0.1 — 2026-04-13 — Phase 4 MVP

- **Models:** `BudgetBlob`, `BudgetScenario`, `BudgetScenarioKind`; cents-based money; `BudgetMoneyFormat`; `BudgetBlobFactory.defaultBlob()`; pure helpers `afterNeedsCents`, `wantsRemainingVersusBudgetCents`, `surplusAfterNeedsAndWantsCents`
- **Config:** `BudgetConfig` — store key `chase_budget_ios_v1`
- **Store:** `BudgetStore` — `@Observable @MainActor`, main-actor `init()`, load/save via `StorageHelpers`, replace baseline/stretch, add/reset wants spend
- **Views:** TabView (Scenarios · Wants); scenario editors + summary; wants quick-add + custom amount + reset; `QuoteBanner` + `budgetQuotes`
- **Quotes:** `budgetQuotes` — clarity, scenarios, wants, margin themes
- **Tests:** `BudgetBlobTests` — JSON round-trip, scenario math, money format smoke
- **Project:** `ClarityBudget.xcodeproj` generated programmatically — `CB*` PBX IDs (from Time template), local SPM `../clarity-ui`, scheme `ClarityBudget`
- **Verify:** `xcodebuild build` succeeded on **iPhone 15 (iOS 17.2) simulator** with `CODE_SIGNING_ALLOWED=NO`. Run `xcodebuild test` on the same destination when the Simulator service is healthy (`-showdestinations` to pick an installed runtime).
