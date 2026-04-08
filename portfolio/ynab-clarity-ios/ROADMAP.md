# Roadmap — YNAB Clarity iOS

> Local iOS app. No Vercel, no Supabase (read-only YNAB API only).
> Run in Xcode: ⌘B to build, ⌘R to run, ⌘U for tests.

## Current state — v0.1 (in progress)

| Area | Status |
|------|--------|
| Setup flow (token → budget → categories → income) | ✅ Done |
| Auto-categorization (`suggestRole`) | ✅ Done |
| Mortgage isCovered fix (paid early in month) | ✅ Done |
| Dashboard (Overview tab) | ✅ Done |
| Bills Planner tab | ✅ Done |
| Salary / Income Gap tab | ✅ Done |
| Cash Flow timeline tab | ✅ Done |
| Fun Money help sheet | ✅ Done |
| Settings sheet (tax rate, token re-entry, reset) | ✅ Done |
| Committed to git | ✅ Done |
| Unit tests (MetricsEngine, CashFlowEngine) | ✅ Done |

---

## V1 — Backlog (next up)

| # | Priority | Task | Why |
|---|----------|------|-----|
| 1 | 🔴 High | Add `dueDay` field to `CategoryMapping` — let user set actual bill due dates | CashFlowEngine currently hardcodes day 1 (mortgage) and day 5 (all bills); real due dates make timeline accurate |
| 2 | 🔴 High | Category Setup: persist group name alongside category ID on save | `suggestRole()` uses group name at classify time but if the user re-enters setup, old mappings lose group context |
| 3 | 🟡 Medium | Refresh indicator — show spinner overlay on cards while `isLoading` is true (not just on first load) | Pull-to-refresh currently shows no loading state on subsequent refreshes |
| 4 | 🟡 Medium | Edit income sources from the Salary tab (not just setup) | Currently only editable during onboarding |
| 5 | 🟡 Medium | "Next paycheck" date display on Cash Flow — show days until next income event | Makes the timeline more actionable at a glance |
| 6 | 🟡 Medium | Empty state on Dashboard when no categories mapped | Currently shows zero-value cards with no guidance |
| 7 | 🟢 Low | Haptic feedback on pull-to-refresh complete | Small polish |
| 8 | 🟢 Low | App icon — custom icon for homescreen | Currently default |
| 9 | 🟢 Low | Category setup: allow reordering role suggestions by priority | Cosmetic |

---

## V2 — Ideas (parked)

| # | Idea | Notes |
|---|------|-------|
| V2-1 | Biweekly paycheck funding tracker — show "you'll have enough after paycheck N" | Extends CashFlowEngine mortgage-marker concept to all required bills |
| V2-2 | Monthly savings rate display — (income - required - flexible spent) / income | Gives a true savings % not visible in YNAB |
| V2-3 | Historical trend — how has safe-to-spend changed month over month | Needs multi-month YNAB API calls |
| V2-4 | Notification on the 1st — "your mortgage needs $X, you have $Y" | Local notification, no server needed |
| V2-5 | TestFlight distribution | Needs Apple Developer account + provisioning |
| V2-6 | Widgets — safe-to-spend today on homescreen | WidgetKit extension |
| V2-7 | Multiple budgets — switch between YNAB budgets | Currently locked to one budget ID |

---

## Known limitations (Phase 1)

- Bill due dates are hardcoded: mortgage = day 1, all other bills = day 5
  → Fix: add `dueDay: Int` to `CategoryMapping` (V1 backlog item #1)
- Cash Flow tab shows all bills on the same day (no per-bill due dates)
- Income sources are set manually — YNAB hint is monthly total only, not per-source
- No edit/reorder for income sources after setup without resetting

---

## Change Log

| Date | Change |
|------|--------|
| 2026-04-08 | `IncomeSetupView`: fixed YNAB suggestion banner pre-fill using `sheet(item:)` |
| 2026-04-08 | All 5 view files recreated after accidental deletion; project committed to git |
| 2026-04-08 | `DashboardView`, `BillsPlannerView`, `IncomeGapView`, `CashFlowView`, `FunMoneyHelpView` written |
| 2026-04-08 | `SettingsSheet` embedded in DashboardView (tax rate, token re-entry, reset) |
| 2026-04-07 | Mortgage `isCovered` logic fixed — checks `activityDollars < 0 && available >= 0` |
| 2026-04-07 | Auto-categorization fixed — group-level pass + expanded keywords in `suggestRole()` |
| 2026-04-07 | Fun Money help sheet added (`FunMoneyHelpView`) with Chase/Kassie rules |
| 2026-04-07 | Initial project scaffold — all models, engines, setup flow, unit tests |
