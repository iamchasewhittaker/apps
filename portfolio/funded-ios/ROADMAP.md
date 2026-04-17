# Roadmap — Funded iOS

> Local iOS app. Reads YNAB via API; can PATCH assigned amounts with confirmation.
> Run in Xcode: ⌘B to build, ⌘R to run, ⌘U for tests.

## Current state — v0.2+ (Overview + 4 rules)

| Area | Status |
|------|--------|
| Setup flow (token → budget → categories → income) | ✅ Done |
| Auto-categorization (`suggestRole`) | ✅ Done |
| Mortgage `isCovered` fix (paid early in month) | ✅ Done |
| Goal target decoding + `monthlyTarget` = goal ?? budgeted | ✅ Done |
| Transactions fetch + stale refresh banner (24h, `last_refreshed_epoch`) | ✅ Done |
| Bills tab by coverage status + Fund shortfall (PATCH) | ✅ Done |
| `dueDay` on categories + cash flow timeline | ✅ Done |
| Income tab: surplus, inline sources, renamed tab | ✅ Done |
| Cash Flow: today marker, bill coverage subtitles | ✅ Done |
| Tip banners + How It Works | ✅ Done |
| Settings sheet (tax rate, token, reset, help link) | ✅ Done |
| Committed to git | ✅ Done |
| Unit tests (MetricsEngine, CashFlowEngine) | ✅ Done |
| `YNABClient.patchRequest` unused `data` binding (warnings-as-errors) | ✅ Done |
| **5-tab layout** (Overview + Assign / Bills / Adjust / Age Money) | ✅ Done |
| **Categorization Review** — payee cleanup, memo preview, full mapped category picker + search + suggestions | ✅ Done |
| **Funding gaps** (Adjust) — renamed + explained vs “available” | ✅ Done |
| **Age Money** — milestones + coaching; timeline as supporting context | ✅ Done |
| **4-Rules tab redesign** (Assign / Bills / Adjust / Age Money) | ✅ Done (superseded by Overview-first) |
| **Categorization Review section** — uncategorized transactions + keyword suggestions + YNAB write-back | ✅ Done |
| **`CategorySuggestionEngine`** — payee keyword rules → `CategoryRole` → ranked suggestions | ✅ Done |
| **Age of Money card** — `GET /budgets/{id}` → `ageOfMoney` → color-coded days display | ✅ Done |
| **`YNABClient.updateTransactionCategory`** — bulk PATCH `/transactions` (HTTP 209) | ✅ Done |
| **Spend Clarity `label:Receipt` pre-filter** — `gmail_client.py` aligned with Gmail Forge taxonomy | ✅ Done |
| `CategorySuggestionEngine.swift` — added to `.pbxproj` (Engine group + Sources phase) | ✅ Done |
| **`CategoryOverride` SwiftData model** — persists learned categorizations; Schema registered | ✅ Done |
| **Learning system** — `BillsPlannerView` saves override after each manual assignment | ✅ Done |
| **`CategorySuggestionEngine`** — 80+ payee rules + override-first lookup (confidence 1.0) | ✅ Done |
| **`PayeeDisplayFormatter`** — 70+ known merchants; universal "No item details yet" subtitle | ✅ Done |

---

## V1 — Backlog (next up)

| # | Priority | Task | Why |
|---|----------|------|-----|
| 1 | 🔴 High | Category Setup: persist group name alongside category ID on save | `suggestRole()` uses group name at classify time but if the user re-enters setup, old mappings lose group context |
| 2 | 🔴 High | Fund from Underfunded Goals card on Overview (same PATCH flow as Bills) | Parity with Bills tab; plan called for both surfaces |
| 3 | 🟡 Medium | Refresh indicator — show spinner overlay on cards while `isLoading` is true (not just on first load) | Pull-to-refresh currently shows no loading state on subsequent refreshes |
| 4 | 🟡 Medium | Edit income sources from the Income tab (not just setup) | Currently only editable during onboarding |
| 5 | 🟡 Medium | "Next paycheck" date display on Cash Flow — show days until next income event | Makes the timeline more actionable at a glance |
| 6 | 🟡 Medium | Empty state on Dashboard when no categories mapped | Currently shows zero-value cards with no guidance |
| 7 | 🟡 Medium | Surface PATCH errors to user (toast / banner) if `fundCategory` fails | Today failures are silent (`try?`) |
| 8 | 🟢 Low | Haptic feedback on pull-to-refresh complete | Small polish |
| 9 | 🟢 Low | App icon — custom icon for homescreen | Currently default |
| 10 | 🟢 Low | Category setup: allow reordering role suggestions by priority | Cosmetic |

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

## Known limitations

- Semi-monthly income sources don't support editing after setup without re-running flow (same gap as other sources → V1 backlog item #4)
- Income sources are set manually — YNAB hint is monthly total only, not per-source
- Fund action assigns to full **goal target** in milliunits (not incremental shortfall only) — confirm UX matches user expectations

---

## Change Log

| Date | Change |
|------|--------|
| 2026-04-15 | **Rename Conto → Funded:** bundle ID `com.chasewhittaker.Funded`; `FundedApp` struct; `FundedTests`; AppIcon regenerated with FUNDED text; Rose accent retained; Keychain service immutable; installed on iPhone 12 Pro Max |
| 2026-04-12 | **v0.3:** `CategoryOverride` SwiftData model + learning system (saves override after each manual assignment); `CategorySuggestionEngine` expanded to 80+ payee rules + override-first lookup; `PayeeDisplayFormatter` expanded to 70+ merchants; `itemContextSubtitle` universal (not Amazon-only); `BillsPlannerView` wired to overrides |
| 2026-04-12 | **4-Rules redesign (v0.2):** tabs → Assign / Bills / Adjust / Age Money; Categorization Review on Bills tab with `CategorySuggestionEngine` + YNAB PATCH write-back; Age of Money card from `GET /budgets/{id}`; budget health + underfunded goals moved to Adjust; `patchRequest` accepts 209; `label:Receipt` pre-filter in Spend Clarity `gmail_client.py` |
| 2026-04-11 | Layout rethink: `goal_target` decoding; Overview reorder + Budget Health + Underfunded Goals; Bills by status + Fund PATCH; `dueDay`; Income tab improvements; Cash Flow today marker + bill status; TipBanner; HowItWorksView; `YNABClient` PATCH; Xcode project includes new Swift files |
| 2026-04-08 | `IncomeFrequency`: added `semimonthly` case + `secondPayDay` on `IncomeSource`; form shows 2nd pay date stepper when selected |
| 2026-04-08 | `IncomeSetupView`: fixed YNAB suggestion banner pre-fill using `sheet(item:)` |
| 2026-04-08 | All 5 view files recreated after accidental deletion; project committed to git |
| 2026-04-08 | `DashboardView`, `BillsPlannerView`, `IncomeGapView`, `CashFlowView`, `FunMoneyHelpView` written |
| 2026-04-08 | `SettingsSheet` embedded in DashboardView (tax rate, token re-entry, reset) |
| 2026-04-07 | Mortgage `isCovered` logic fixed — checks `activityDollars < 0 && available >= 0` |
| 2026-04-07 | Auto-categorization fixed — group-level pass + expanded keywords in `suggestRole()` |
| 2026-04-07 | Fun Money help sheet added (`FunMoneyHelpView`) with Chase/Kassie rules |
| 2026-04-07 | Initial project scaffold — all models, engines, setup flow, unit tests |
