# Session start — Build Clarity Hub YNAB Tab

Copy everything below into a **new** chat and send.

---

Read `CLAUDE.md` and `HANDOFF.md` first, then `portfolio/clarity-hub/CLAUDE.md` and `portfolio/clarity-hub/HANDOFF.md`.

**App path:** `portfolio/clarity-hub/`

**Goal:** Build out `YnabTab.jsx` — the full YNAB Clarity web tab with setup flow, dashboard, bills planner, income gap, cash flow timeline, and fund category write-back.

## What's already built (do NOT rebuild)

- `src/engines/MetricsEngine.js` — full port of MetricsEngine.swift (safeToSpend, buildBalances, incomeGap, etc.)
- `src/engines/CashFlowEngine.js` — full port of CashFlowEngine.swift (buildTimeline → CashFlowEvent[])
- `src/engines/YNABClient.js` — YNAB API fetch client (fetchBudgets, fetchCategories, fetchMonth, fetchTransactions, fetchBudgetDetail, updateCategoryBudgeted)
- `src/theme.js` — T palette, loadYnabToken/saveYnabToken, DEFAULT_YNAB blob shape, fmtCents/fmtDollars, today/yesterday
- `src/App.jsx` — auth gate, ynab blob state, passes `blob={ynab}` and `setBlob={setYnab}` to YnabTab

## YNAB tab architecture

**Setup gate:** If `blob.preferences.setupComplete === false`, show setup flow. Once complete, show dashboard.

**Setup flow (4 steps):**
1. **Token entry** — text input for YNAB personal access token → call `YNABClient.fetchBudgets(token)` to verify → on success, save to `chase_hub_ynab_token` via `saveYnabToken(token)`
2. **Budget picker** — list budgets from step 1 → user picks one → save `activeBudgetID` + `activeBudgetName` to `setBlob({...blob, preferences: {...blob.preferences, activeBudgetID: id, activeBudgetName: name}})`
3. **Category roles** — fetch categories via `YNABClient.fetchCategories(token, budgetID)` → user assigns role to each category (mortgage / bill / essential / flexible / ignore) and optional dueDay for bills → save to `blob.categoryMappings`
4. **Income sources** — user adds paychecks: name, amountCents, frequency (monthly/semimonthly/biweekly), nextPayDate, secondPayDay (for semimonthly) → save to `blob.incomeSources` → set `setupComplete: true`

**Dashboard sections (after setup):**
1. **Safe-to-spend** — `MetricsEngine.safeToSpend(balances)`, `.safePerDay()`, `.safePerWeek()`. Show 3 cards: daily / weekly / monthly. Pull live data: `YNABClient.fetchMonth(token, budgetID, currentMonth)` → `MetricsEngine.buildBalances(categories, blob.categoryMappings)`
2. **Budget health bar** — `MetricsEngine.totalFunded / totalRequired` as a progress bar. Show coverage %.
3. **Bills planner** — group balances by coverage status: Needs Attention (shortfall > 0), Partial (0 < funded < required), Covered (funded >= required). Show category name, due day, budgeted vs required.
4. **Income gap** — `MetricsEngine.incomeGap(incomeSources, balances, today)`, `MetricsEngine.grossAnnualNeeded(...)`. Show expected this month vs required, gap/surplus, gross salary target.
5. **Cash flow timeline** — `CashFlowEngine.buildTimeline(blob.incomeSources, balances, currentMonth)` → chronological list of paycheck/bill events with today marker. Show date, label, kind icon, cumulative income, coverage status.
6. **Spending** — `YNABClient.fetchTransactions(token, budgetID, sinceDate)` → `MetricsEngine.spendingYesterday/spendingThisWeek/spendingThisMonth`. Show 3 spend cards.
7. **Fund category** — tap any bill → show current budgeted vs needed → confirm → `YNABClient.updateCategoryBudgeted(token, budgetID, categoryID, amountMilliunits)`. Always show confirmation dialog before PATCH.

## YNAB blob shape (what's synced)

```json
{
  "categoryMappings": [
    { "ynabCategoryID": "uuid", "ynabCategoryName": "Rent", "ynabGroupName": "Housing", "roleRaw": "mortgage", "dueDay": 1 }
  ],
  "incomeSources": [
    { "id": "uuid", "name": "Paycheck", "amountCents": 250000, "frequencyRaw": "biweekly", "nextPayDate": "2026-04-18", "secondPayDay": 20, "sortOrder": 0 }
  ],
  "preferences": {
    "activeBudgetID": "uuid",
    "activeBudgetName": "My Budget",
    "setupComplete": false,
    "taxRate": 0.28,
    "annualSalary": 0
  }
}
```

CategoryRole values: `"mortgage"`, `"bill"`, `"essential"`, `"flexible"`, `"ignore"`  
IncomeFrequency values: `"monthly"`, `"semimonthly"`, `"biweekly"`

## Settings re-entry

In `SettingsTab.jsx`, add a "Re-run YNAB setup" button that sets `setupComplete: false`. Also show YNAB token entry/update there.

## Key files to read before coding

| What | Path |
|------|------|
| MetricsEngine | `src/engines/MetricsEngine.js` |
| CashFlowEngine | `src/engines/CashFlowEngine.js` |
| YNABClient | `src/engines/YNABClient.js` |
| theme + defaults | `src/theme.js` |
| App shell (how blob is passed) | `src/App.jsx` |
| iOS source of truth | `portfolio/ynab-clarity-ios/YNABClarity/` |

## Constraints

- CRA only — no TypeScript, no component libraries, inline styles only
- `YnabTab.jsx` receives `blob` (ynabBlob) + `setBlob` (setYnab) as props — no internal persistent state
- YNAB token in localStorage (`chase_hub_ynab_token`) — NOT in the synced blob
- Milliunits: YNAB API returns milliunits (1/1000 dollar) — MetricsEngine handles conversion at boundary inside `buildBalances()`
- Always confirm before PATCH write-back to YNAB

## Acceptance ("done when")

- [ ] Setup flow: token → budget picker → category roles → income sources → `setupComplete: true`
- [ ] Dashboard loads: safe-to-spend daily/weekly/monthly from live YNAB API
- [ ] Bills planner: grouped by Needs Attention / Partial / Covered
- [ ] Income gap: expected vs required, gap/surplus, gross salary target
- [ ] Cash flow timeline: chronological events with today marker
- [ ] Spending: yesterday/this week/this month
- [ ] Fund category: confirmation dialog → PATCH → blob updated
- [ ] `npm run build` passes cleanly

After the session: update `CHANGELOG.md` [Unreleased], app `ROADMAP.md`, app `HANDOFF.md`, root `ROADMAP.md` Change Log, and root `HANDOFF.md` State.
