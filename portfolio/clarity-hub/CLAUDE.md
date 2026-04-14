# Clarity Hub — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App Identity

- **Version:** v0.2
- **Storage keys:** `chase_hub_checkin_v1`, `chase_hub_triage_v1`, `chase_hub_time_v1`, `chase_hub_budget_v1`, `chase_hub_growth_v1`
- **URL:** https://clarity-hub-lilac.vercel.app
- **Vercel project:** `clarity-hub` (team: `iamchasewhittakers-projects`)
- **Supabase:** project `unqtnnxlltiadzbqpyhh` — env vars already set on Vercel (production + preview)
- **Entry:** `src/App.jsx`
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md)

## Purpose

A web companion for 5 iOS apps — gives desktop access to the same data via Supabase sync. Each tab mirrors one iOS app's features.

> *"For Reese. For Buzz. Forward — no excuses."*

YNAB and RollerTask were split into standalone apps (see `portfolio/ynab-clarity-web` and `portfolio/rollertask-tycoon-web`).

| Tab | iOS App | Supabase `app_key` |
|-----|---------|-------------------|
| Check-in | clarity-checkin-ios | `checkin` |
| Triage | clarity-triage-ios | `triage` |
| Time | clarity-time-ios | `time` |
| Budget | clarity-budget-ios | `budget` |
| Growth | clarity-growth-ios | `growth` |

## Tech Stack

React (CRA) · localStorage · Supabase sync · inline styles (no CSS modules, no Tailwind) · no TypeScript · no component libraries

## File Structure

```
src/
  App.jsx             — shell: auth gate, 5-blob state, nav, save/push effects
  theme.js            — T (colors), loadBlob/saveBlob, defaults, helpers
  sync.js             — push/pull wrappers for 5 app_keys + auth
  shared/sync.js      — copy of portfolio/shared/sync.js
  ErrorBoundary.jsx
  tabs/
    CheckinTab.jsx    — morning/evening forms, pulse checks, history
    TriageTab.jsx     — capacity, tasks, ideas pipeline, wins
    TimeTab.jsx       — focus timer, manual sessions, scripture streak
    BudgetTab.jsx     — dual scenarios, wants tracker
    GrowthTab.jsx     — 7 growth areas, sessions, streaks
    SettingsTab.jsx   — sign out, data export, links to standalone apps
```

## Key Conventions

- `App.jsx` owns all 5 blob states — tabs receive `blob` + `setBlob` as props
- `hasLoaded` ref guards save effects from firing on initial mount (same as all other apps)
- Budget amounts always in cents (matching iOS pattern); display via `fmtCents()`
- All iOS Codable structs ignore unknown keys on decode — `_syncAt` in pushed blobs is harmless
- Nav bar includes external links to YNAB Clarity and RollerTask Tycoon standalone apps

## Commands

```bash
cd portfolio/clarity-hub

npm start          # dev server at localhost:3000
npm run build      # production build (verify before deploy)

# Deploy (env vars already set — just build + deploy):
vercel --prod

# Or use the /deploy skill which handles build + env vars + deploy automatically
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
