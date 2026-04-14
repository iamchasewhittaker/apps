# Clarity Hub — Handoff

> Read `CLAUDE.md` (this app) + `/CLAUDE.md` (repo root) before making changes.

## State

| Field | Value |
|-------|-------|
| **Focus** | YNAB tab done — Time tab is next |
| **Next** | Build TimeTab.jsx: focus timer, manual session log, scripture streak |
| **Last touch** | 2026-04-13 — built full YnabTab.jsx (setup flow + dashboard + fund modal), updated SettingsTab |
| **Status** | 🟡 YNAB tab complete — all other tabs still placeholder |

## What's Built

- `src/App.jsx` — auth gate (email OTP), 7-blob state management, load/pull on mount, save/push effects, NavTabs
- `src/theme.js` — Clarity palette, loadBlob/saveBlob for all 7 apps, YNAB token helpers, date helpers, defaults, fmtCents/fmtDollars/fmtDuration, computeStreak
- `src/sync.js` — push/pull wrappers for all 7 Supabase app_keys
- `src/shared/sync.js` — copied from `portfolio/shared/sync.js`
- `src/ErrorBoundary.jsx`
- `src/engines/MetricsEngine.js` — full port of MetricsEngine.swift
- `src/engines/CashFlowEngine.js` — full port of CashFlowEngine.swift
- `src/engines/YNABClient.js` — YNAB API fetch client
- `src/tabs/*.jsx` — 8 placeholder files (YnabTab, CheckinTab, TriageTab, TimeTab, BudgetTab, GrowthTab, RollerTaskTab, SettingsTab)

## What's NOT Built Yet

All tab implementations are placeholders. Build in this order:

| Tab | File | Priority | Key Features |
|-----|------|----------|-------------|
| **YNAB** | `YnabTab.jsx` | 🔴 First | Setup flow, dashboard, bills, income gap, cash flow, fund write-back |
| **Time** | `TimeTab.jsx` | 🟡 Next | Timer, manual sessions, scripture streak |
| **Budget** | `BudgetTab.jsx` | 🟡 Next | Dual scenarios, wants tracker |
| **Check-in** | `CheckinTab.jsx` | 🟢 Then | Morning/evening forms, pulse, history |
| **Triage** | `TriageTab.jsx` | 🟢 Then | Capacity, tasks, ideas, wins |
| **Growth** | `GrowthTab.jsx` | 🟢 Then | 7 areas, sessions, streaks |
| **Tasks** | `RollerTaskTab.jsx` | 🔵 Later | Attractions, cash, ledger |
| **Settings** | `SettingsTab.jsx` | 🔵 Later | YNAB token mgmt, export |

## Deploy Checklist

- [x] `npm run build` passes cleanly
- [ ] Deploy to Vercel
- [ ] Set `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` env vars in Vercel
- [ ] Add to root `CLAUDE.md` portfolio table
- [ ] Add to CI workflow (`.github/workflows/portfolio-web-build.yml`)

## Key Files for YNAB Tab

| What | Path |
|------|------|
| MetricsEngine | `src/engines/MetricsEngine.js` |
| CashFlowEngine | `src/engines/CashFlowEngine.js` |
| YNABClient | `src/engines/YNABClient.js` |
| YNAB blob default | `src/theme.js` → `DEFAULT_YNAB` |
| YNAB token helpers | `src/theme.js` → `loadYnabToken`, `saveYnabToken` |
| iOS source of truth | `portfolio/ynab-clarity-ios/YNABClarity/` |

## YNAB Blob Shape (what gets synced, NOT live data)

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
    "setupComplete": true,
    "taxRate": 0.28,
    "annualSalary": 0
  }
}
```

CategoryRole values: `"mortgage"`, `"bill"`, `"essential"`, `"flexible"`, `"ignore"`
IncomeFrequency values: `"monthly"`, `"semimonthly"`, `"biweekly"`
