# RollerTask Tycoon Web — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity

- **Version:** v1.0
- **Storage key:** `chase_hub_rollertask_v1` (localStorage — shared with clarity-hub for continuity)
- **Supabase `app_key`:** `rollertask` (must not change — iOS sync depends on it)
- **URL:** https://rollertask-tycoon-web.vercel.app
- **Supabase:** project `unqtnnxlltiadzbqpyhh` — same as all portfolio apps
- **Entry:** `src/App.jsx`

## Purpose

Standalone points-based motivation tracker — web companion to `roller-task-tycoon-ios`. Split out from Clarity Hub for focused access and sharing.

## Tech Stack

React (CRA) · localStorage · Supabase sync · inline styles (no CSS modules, no Tailwind) · no TypeScript · no component libraries

## File Structure

```
src/
  App.jsx             — shell: auth gate, single-blob state, settings modal
  theme.js            — T (colors), loadBlob/saveBlob, defaults
  sync.js             — pushRollertask/pullRollertask + auth
  shared/sync.js      — copy of portfolio/shared/sync.js
  ErrorBoundary.jsx
  tabs/
    RollerTaskTab.jsx — task list, points, park cash, profit ledger
```

## Key Conventions

- Single-blob app: `App.jsx` owns one `rollertask` state — `RollerTaskTab` receives `blob` + `setBlob`
- Gamified task system: complete tasks to earn points, tracked in a ledger
- Settings accessible via gear icon in top bar (modal, not a separate tab)

## Commands

```bash
cd portfolio/rollertask-tycoon-web

npm start          # dev server at localhost:3000
npm run build      # production build (verify before deploy)

# Deploy:
vercel link        # first time only
scripts/vercel-add-env portfolio/rollertask-tycoon-web
vercel --prod
```

## Constraints

- Do not change storage key `chase_hub_rollertask_v1` — existing user data depends on it
- Do not change Supabase `app_key` string `rollertask` — iOS sync depends on it
- Keep `src/shared/sync.js` in sync with `portfolio/shared/sync.js` (copy, not symlink)
- No TypeScript — plain JS only
