# Clarity Hub — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App Identity

- **Version:** v0.1
- **Storage keys:** `chase_hub_ynab_v1`, `chase_hub_checkin_v1`, `chase_hub_triage_v1`, `chase_hub_time_v1`, `chase_hub_budget_v1`, `chase_hub_growth_v1`, `chase_hub_rollertask_v1`
- **YNAB token key:** `chase_hub_ynab_token` (localStorage, never synced)
- **URL:** TBD (deploy to Vercel)
- **Entry:** `src/App.jsx`
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md)

## Purpose

A web companion for all 7 iOS apps — gives desktop access to the same data via Supabase sync. Each tab mirrors one iOS app's features.

| Tab | iOS App | Supabase `app_key` |
|-----|---------|-------------------|
| YNAB | ynab-clarity-ios | `ynab` |
| Check-in | clarity-checkin-ios | `checkin` |
| Triage | clarity-triage-ios | `triage` |
| Time | clarity-time-ios | `time` |
| Budget | clarity-budget-ios | `budget` |
| Growth | clarity-growth-ios | `growth` |
| Tasks | roller-task-tycoon-ios | `rollertask` |

## Tech Stack

React (CRA) · localStorage · Supabase sync · inline styles (no CSS modules, no Tailwind) · no TypeScript · no component libraries

## File Structure

```
src/
  App.jsx             — shell: auth gate, 7-blob state, nav, save/push effects
  theme.js            — T (colors), loadBlob/saveBlob, YNAB token helpers, defaults, helpers
  sync.js             — push/pull wrappers for all 7 app_keys + auth
  shared/sync.js      — copy of portfolio/shared/sync.js
  ErrorBoundary.jsx
  engines/
    MetricsEngine.js  — YNAB pure functions (port of MetricsEngine.swift)
    CashFlowEngine.js — YNAB timeline builder (port of CashFlowEngine.swift)
    YNABClient.js     — YNAB API fetch client
  tabs/
    YnabTab.jsx       — dashboard, bills, income gap, cash flow, safe-to-spend
    CheckinTab.jsx    — morning/evening forms, pulse checks, history
    TriageTab.jsx     — capacity, tasks, ideas pipeline, wins
    TimeTab.jsx       — focus timer, manual sessions, scripture streak
    BudgetTab.jsx     — dual scenarios, wants tracker
    GrowthTab.jsx     — 7 growth areas, sessions, streaks
    RollerTaskTab.jsx — attractions, park cash, profit ledger
    SettingsTab.jsx   — sign out, YNAB token, data export
```

## Key Conventions

- `App.jsx` owns all 7 blob states — tabs receive `blob` + `setBlob` as props
- `hasLoaded` ref guards save effects from firing on initial mount (same as all other apps)
- YNAB token stored in localStorage under `chase_hub_ynab_token` — NOT in the synced ynab blob
- The `ynab` blob syncs only config (category mappings, income sources, preferences) — NOT live YNAB data
- Live YNAB data fetched fresh via `src/engines/YNABClient.js` on each tab mount
- Budget amounts always in cents (matching iOS pattern); display via `fmtCents()`
- All iOS Codable structs ignore unknown keys on decode — `_syncAt` in pushed blobs is harmless

## YNAB Tab Architecture

The YNAB tab has a setup gate: if `blob.preferences.setupComplete === false`, show the setup flow (token → budget → category roles → income sources). Once complete, show the main dashboard.

Setup steps:
1. Token entry → verify against `GET /v1/budgets` → save to `chase_hub_ynab_token`
2. Budget picker → save `activeBudgetID` + `activeBudgetName` to `ynab.preferences`
3. Category roles → fetch YNAB categories → user assigns roles → save to `ynab.categoryMappings`
4. Income sources → user adds paychecks → save to `ynab.incomeSources`

Dashboard uses `MetricsEngine.js` + `CashFlowEngine.js` (already built in `src/engines/`).

## Commands

```bash
cd portfolio/clarity-hub

npm start          # dev server at localhost:3000
npm run build      # production build (verify before deploy)
```

## Constraints

- Do not change storage key names once any device has real data
- Do not change the `app_key` string values — iOS apps will be syncing to these same keys
- Keep `src/shared/sync.js` in sync with `portfolio/shared/sync.js` (copy, not symlink)
- No TypeScript — plain JS only

## Session Start

```
Read CLAUDE.md and portfolio/clarity-hub/CLAUDE.md first.

Goal: Work on Clarity Hub at portfolio/clarity-hub/.

Read portfolio/clarity-hub/HANDOFF.md for current state.
Run checkpoint before edits; update CHANGELOG / ROADMAP / HANDOFF when done.
```
