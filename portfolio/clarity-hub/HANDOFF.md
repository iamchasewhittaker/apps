# Clarity Hub — Handoff

> Read `CLAUDE.md` (this app) + `/CLAUDE.md` (repo root) before making changes.

## State

| Field | Value |
|-------|-------|
| **Focus** | Stable — 5 remaining tabs (Check-in, Triage, Time, Budget, Growth) |
| **Next** | **Maintenance mode** — bugfixes and small parity with iOS blobs only; no new tabs. Web role vs Wellness Tracker is documented in [`docs/governance/PRODUCT_LINES.md`](../../docs/governance/PRODUCT_LINES.md) (canonical surface for the five Clarity iOS `app_key` blobs). |
| **Last touch** | 2026-04-15 — governance: Hub = companion to split Clarity iOS suite; Wellness = unified wellness web |
| **Status** | ✅ Deployed · v0.2 · 5 tabs + external links to YNAB + Tasks |

## What's Built

- `src/App.jsx` — auth gate (email OTP), 5-blob state, load/pull on mount, save/push effects, NavTabs w/ external links
- `src/theme.js` — T palette, loadBlob/saveBlob, date helpers, defaults, fmtCents/fmtDuration/computeStreak
- `src/sync.js` — push/pull wrappers for 5 Supabase app_keys (checkin, triage, time, budget, growth)
- `src/shared/sync.js` — shared Supabase sync module
- `src/ErrorBoundary.jsx`
- `src/tabs/CheckinTab.jsx` — morning/evening forms, pulse checks, history
- `src/tabs/TriageTab.jsx` — capacity bar, tasks, ideas pipeline, wins log
- `src/tabs/TimeTab.jsx` — focus timer + manual sessions + scripture streak
- `src/tabs/BudgetTab.jsx` — dual scenarios + wants tracker
- `src/tabs/GrowthTab.jsx` — 7 growth areas, sessions, streaks
- `src/tabs/SettingsTab.jsx` — sign out, data export, links to standalone apps

## Removed (split out)

| Item | Now lives at |
|------|-------------|
| `YnabTab.jsx` + 3 engine files | `portfolio/ynab-clarity-web/` → https://ynab-clarity-web.vercel.app |
| `RollerTaskTab.jsx` | `portfolio/rollertask-tycoon-web/` → https://rollertask-tycoon-web.vercel.app |

## Deploy Status

- [x] `npm run build` passes cleanly
- [x] Deployed — https://clarity-hub-lilac.vercel.app
- [x] Supabase env vars set on Vercel (production + preview)
- [x] CI job in `.github/workflows/portfolio-web-build.yml`
- [x] Nav links to YNAB Clarity Web + RollerTask Tycoon Web

## Hard Rules

1. Inline styles only — no CSS files, no Tailwind, no component libraries
2. T palette only — every color from `import { T } from "../theme"`
3. No unused variables (CI treats ESLint warnings as errors)
4. No TypeScript — plain JS
5. Blob pattern — tabs get `blob` + `setBlob` props; no tab-level localStorage
