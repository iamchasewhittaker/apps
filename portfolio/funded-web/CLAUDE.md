# Funded Web — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — single source for icons/palette; do not restate full rules in session prompts.

## App Identity

- **Version:** v1.0
- **Storage key:** `chase_hub_ynab_v1` (localStorage — shared with clarity-hub for continuity)
- **YNAB token key:** `chase_hub_ynab_token` (localStorage, never synced)
- **Supabase `app_key`:** `ynab` (must not change — iOS sync depends on it)
- **URL:** https://funded-web.vercel.app
- **Supabase:** project `unqtnnxlltiadzbqpyhh` — same as all portfolio apps
- **Entry:** `src/App.jsx`

## Purpose

Standalone YNAB budget dashboard — web companion to `funded-ios`. Split out from Clarity Hub for focused access.

> *"For Reese. For Buzz. Forward — no excuses."*

## Tech Stack

React (CRA) · localStorage · Supabase sync · inline styles (no CSS modules, no Tailwind) · no TypeScript · no component libraries

## File Structure

```
src/
  App.jsx             — shell: auth gate, single-blob state, settings modal
  theme.js            — T (colors), loadBlob/saveBlob, YNAB token helpers, defaults
  sync.js             — pushYnab/pullYnab + auth
  shared/sync.js      — copy of portfolio/shared/sync.js
  ErrorBoundary.jsx
  engines/
    MetricsEngine.js  — YNAB pure functions (port of MetricsEngine.swift)
    CashFlowEngine.js — YNAB timeline builder (port of CashFlowEngine.swift)
    YNABClient.js     — YNAB API fetch client
  tabs/
    YnabTab.jsx       — dashboard, bills, income gap, cash flow, safe-to-spend
```

## Key Conventions

- Single-blob app: `App.jsx` owns one `ynab` state — `YnabTab` receives `blob` + `setBlob`
- YNAB token stored in localStorage under `chase_hub_ynab_token` — NOT in the synced blob
- The `ynab` blob syncs only config (category mappings, income sources, preferences) — NOT live YNAB data
- Live YNAB data fetched fresh via `src/engines/YNABClient.js` on each mount
- Setup gate: if `blob.preferences.setupComplete === false`, show setup flow before dashboard
- Settings accessible via gear icon in top bar (modal, not a separate tab)

## Commands

```bash
cd portfolio/funded-web

npm start          # dev server at localhost:3000
npm run build      # production build (verify before deploy)

# Deploy:
vercel link        # first time only
scripts/vercel-add-env portfolio/funded-web
vercel --prod
```

## Constraints

- Do not change storage key `chase_hub_ynab_v1` — existing user data depends on it
- Do not change Supabase `app_key` string `ynab` — iOS sync depends on it
- Keep `src/shared/sync.js` in sync with `portfolio/shared/sync.js` (copy, not symlink)
- No TypeScript — plain JS only
