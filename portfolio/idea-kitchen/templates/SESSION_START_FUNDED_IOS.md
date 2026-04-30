# Session Start — Funded iOS (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-07** — Initial scaffold: all models (CategoryMapping, IncomeSource), engines (MetricsEngine, CashFlowEngine), setup flow (token, budget, categories, income), KeychainHelper, MockData, unit tests
- **2026-04-07** — Mortgage isCovered fix, auto-categorization fix (suggestRole group-level pass), Fun Money help sheet
- **2026-04-08** — Semimonthly income support, income setup YNAB hint banner fix (sheet(item:) pattern), views recreated after accidental deletion
- **2026-04-11** — Goal target decoding, Overview tab (Safe to Spend + Budget Health + Underfunded Goals), Bills by coverage status + Fund PATCH, dueDay on categories, Cash Flow today marker, TipBanner, HowItWorksView
- **2026-04-12** — v0.2: 4-Rules tab redesign (Assign/Bills/Adjust/Age Money), Categorization Review with CategorySuggestionEngine + YNAB write-back, Age of Money card, bulk transaction PATCH
- **2026-04-12** — v0.3: CategoryOverride SwiftData model (learning system), 80+ payee rules, 70+ known merchants in PayeeDisplayFormatter
- **2026-04-15** — Rename Conto to Funded: bundle ID com.chasewhittaker.Funded, FUNDED AppIcon, Rose #f43f5e accent, installed on iPhone 12 Pro Max
- **2026-04-15** — Income setup hardening: loading state, API error banner, last-month fallback, Ready to Assign info card
- **2026-04-15** — Categorization triage: assign sheet with notes + purchaser + necessary toggle, memo merge on write-back, TransactionMetadata SwiftData model

---

## Still needs action

- Fund from Overview underfunded goals card (PATCH parity with Bills tab)
- Persist group name alongside category ID in CategoryMapping on save
- Refresh indicator (spinner overlay) on subsequent refreshes
- Edit income sources from Income tab (not just setup)
- Surface PATCH errors to user (toast/banner) if fundCategory fails

---

## Funded state at a glance

| Field | Value |
|-------|-------|
| Version | v0.3 |
| URL | local Xcode |
| Storage key | SwiftData + AppStorage (`chase_ynab_clarity_ios_*`) + Keychain (`com.chasewhittaker.YNABClarity`) |
| Stack | SwiftUI + SwiftData + iOS 17 + YNAB API (read + PATCH write) + Keychain |
| Xcode prefix | -- (standard Xcode) |
| Bundle ID | com.chasewhittaker.Funded |
| Linear | [Funded iOS](https://linear.app/whittaker/project/funded-ios-0fa6245bef6a) |
| Last touch | 2026-04-15 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/funded-ios/CLAUDE.md | App-level instructions |
| portfolio/funded-ios/HANDOFF.md | Session state + notes |
| Funded/Shared/AppState.swift | @MainActor ObservableObject -- in-memory YNAB cache, refresh, fundCategory |
| Funded/Engine/MetricsEngine.swift | Pure formula functions -- totalRequired, shortfall, safeToSpend, incomeGap |
| Funded/YNAB/YNABClient.swift | URLSession client -- fetchBudgets, fetchCategories, fetchMonth, PATCH |
| Funded/Shared/KeychainHelper.swift | SecItem read/write for YNAB token (device-only) |
| Funded/Views/OverviewView.swift | Safe to Spend + Spending + stale/error banners |
| Funded/Views/BillsPlannerView.swift | Bills by coverage status + Fund shortfall + categorization review |

---

## Suggested next actions (pick one)

1. Fund from Overview underfunded goals card (wire FundCategoryConfirmationSheet to goal rows)
2. Refresh indicator -- show spinner overlay on cards during subsequent YNAB fetches
3. Edit income sources from Income tab (not just onboarding setup)
