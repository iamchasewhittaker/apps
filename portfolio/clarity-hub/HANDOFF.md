# Clarity Hub — Handoff

> Read `CLAUDE.md` (this app) + `/CLAUDE.md` (repo root) before making changes.

## State

| Field | Value |
|-------|-------|
| **Focus** | Remaining tabs: Check-in, Triage, Growth, RollerTask, full Settings |
| **Next** | Build CheckinTab.jsx → TriageTab.jsx → GrowthTab.jsx → RollerTaskTab.jsx → Settings → CI → deploy |
| **Last touch** | 2026-04-13 — built YnabTab, TimeTab, BudgetTab; deployed to Vercel; added deploy automation (.env.supabase + scripts/vercel-add-env + /deploy skill) |
| **Status** | ✅ YNAB + Time + Budget done · Deployed · Env vars set · 4 tabs still placeholder |

## What's Built

- `src/App.jsx` — auth gate (email OTP), 7-blob state, load/pull on mount, save/push effects, NavTabs
- `src/theme.js` — T palette, loadBlob/saveBlob, YNAB token helpers, date helpers, defaults, fmtCents/fmtDollars/fmtDuration, computeStreak
- `src/sync.js` — push/pull wrappers for all 7 Supabase app_keys
- `src/shared/sync.js` — shared Supabase sync module
- `src/ErrorBoundary.jsx`
- `src/engines/MetricsEngine.js` — port of MetricsEngine.swift
- `src/engines/CashFlowEngine.js` — port of CashFlowEngine.swift
- `src/engines/YNABClient.js` — YNAB API fetch client
- `src/tabs/YnabTab.jsx` — ✅ Full: setup flow (token→budget→categories→income) + dashboard + fund modal
- `src/tabs/TimeTab.jsx` — ✅ Full: focus timer + manual sessions + scripture streak
- `src/tabs/BudgetTab.jsx` — ✅ Full: dual scenarios + wants tracker
- `src/tabs/SettingsTab.jsx` — 🟡 Partial: YNAB token + sign out (needs account info, export, last synced)

## What's NOT Built Yet

| Tab | File | Priority | Key Features |
|-----|------|----------|-------------|
| **Check-in** | `CheckinTab.jsx` | 🔴 First | Morning/evening forms, pulse checks, history |
| **Triage** | `TriageTab.jsx` | 🔴 First | Capacity bar, tasks, ideas pipeline, wins log |
| **Growth** | `GrowthTab.jsx` | 🟡 Then | 7 areas grid, log session, history, weekly bar |
| **RollerTask** | `RollerTaskTab.jsx` | 🟡 Then | Points/cash display, task completion, ledger |
| **Settings** | `SettingsTab.jsx` | 🟢 Enhance | Account, data export, last synced timestamp |
| **CI** | `.github/workflows/` | 🟢 Admin | Add clarity-hub job to portfolio-web-build.yml |

## Session Start Doc

Full spec for the remaining tabs (blob shapes, features, iOS source locations):  
**`docs/SESSION_START_REMAINING_TABS.md`**

## Deploy Status

- [x] `npm run build` passes cleanly
- [x] Deployed — https://clarity-hub-lilac.vercel.app
- [x] Supabase env vars set on Vercel (production + preview)
- [x] Deploy automation: `scripts/vercel-add-env` + `.env.supabase` at repo root + `/deploy` skill
- [ ] Add to CI workflow
- [ ] Deploy after remaining tabs are built

## Hard Rules

1. Inline styles only — no CSS files, no Tailwind, no component libraries
2. T palette only — every color from `import { T } from "../theme"`
3. No unused variables (CI treats ESLint warnings as errors)
4. No TypeScript — plain JS
5. Blob pattern — tabs get `blob` + `setBlob` props; no tab-level localStorage

## iOS Sources of Truth

| App | Model file |
|-----|-----------|
| Check-in | `portfolio/clarity-checkin-ios/ClarityCheckin/Models/CheckinBlob.swift` |
| Triage | `portfolio/clarity-triage-ios/ClarityTriage/Models/TriageBlob.swift` |
| Growth | `portfolio/clarity-growth-ios/ClarityGrowth/Models/GrowthBlob.swift` |
