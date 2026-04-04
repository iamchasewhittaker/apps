# App Portfolio — Master Project Instructions

> For Claude Code. Read this first before touching any app in this portfolio.

## Portfolio Overview

| App | Version | Storage Key | URL | Status |
|-----|---------|-------------|-----|--------|
| Wellness Tracker | v15.10 | `chase_wellness_v1` | wellnes-tracker.vercel.app | ✅ Active |
| Job Search HQ | v8.3 | `chase_job_search_v1` | job-search-hq.vercel.app | ✅ Active |
| App Forge | v8.1 | `chase_forge_v1` | app-forge-fawn.vercel.app | ✅ Active |
| RollerTask Tycoon | v1.0 | `chase_roller_task_v1` | roller-task-tycoon.vercel.app | ✅ Deployed (add `VITE_SUPABASE_*` on Vercel for sync) |
| Growth Tracker | v6 | retired | — | 🗄️ Retired |
| AI Dev Mastery | v1.0 | none (no persistence) | not yet deployed | 🟡 Local |

> ⚠️ **AI Dev Mastery** also lives under this monorepo at `projects/ai-dev-mastery/` (and may be checked out elsewhere). When standalone, it is not wired to Supabase, no localStorage, pure course viewer.

**Migration tracking:** [MONOREPO_MIGRATION.md](MONOREPO_MIGRATION.md) · [Linear — Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37)

## Tech Stack (all apps)
- **Most apps:** React (Create React App) + localStorage; inline styles (no CSS modules, no Tailwind); Vercel; PWA manifest.
- **RollerTask Tycoon** (`portfolio/roller-task-tycoon/`): **Vite 6** + vanilla JS + same Supabase blob sync — uses **`VITE_*`** env vars (`import.meta.env`), not `REACT_APP_*`.
- No TypeScript, no Redux, no external state libraries (portfolio-wide)

## Monorepo Layout
```
/portfolio/
  shared/
    sync.js        ← Supabase offline-first sync (source of truth; copy into each app)
  app-hub/
    sync.sh        ← post-push summaries (paths resolved via script location)
  wellness-tracker/
    src/
      App.jsx      ← shell only (~370 lines)
      theme.js     ← T (colors), load/save/loadDraft/saveDraft helpers, STORE keys
      ErrorBoundary.jsx
      ui.jsx       ← shared UI components (NavTabs, Card, etc.)
      tabs/        ← one file per tab
        TrackerTab.jsx, TasksTab.jsx, TimeTrackerTab.jsx,
        BudgetTab.jsx, HistoryTab.jsx, GrowthTab.jsx
  job-search-hq/
    src/
      App.jsx      ← shell only (~280 lines)
      constants.js ← all data, styles (s), helpers, templates — no React
      ErrorBoundary.jsx
      tabs/
        FocusTab.jsx, PipelineTab.jsx, ContactsTab.jsx,
        AITab.jsx, ResourcesTab.jsx
      components/
        Field.jsx, AIResult.jsx, ApiKeyModal.jsx,
        AppCard.jsx, AppModal.jsx, ContactCard.jsx,
        ContactModal.jsx, ProfileModal.jsx, PrepModal.jsx
  app-forge/
    src/
      App.jsx      ← monolith (not yet refactored)
  roller-task-tycoon/
    index.html, src/main.js, src/sync.js, src/shared/sync.js  ← Vite + vanilla; APP_KEY roller_task_tycoon_v1
  archive/
    growth-tracker/  ← retired; merged into Wellness GrowthTab (`chase_wellness_v1.growthLogs`)
```

Master instructions (this file) and [ROADMAP.md](ROADMAP.md) live at the **repo root** (`~/Developer/chase`).

## Key Conventions

### Storage pattern (all apps)
- One big JSON blob per app in localStorage
- `load()` / `save()` helpers in each app's `theme.js` or `constants.js`
- `save()` in Wellness now stamps `_syncAt: Date.now()` for Supabase sync
- Never split data across multiple localStorage keys (except meds in Wellness)

### Component pattern (Wellness + Job Search)
- `App.jsx` is the shell: state, load/save effects, data helpers, modal renders, nav
- Tabs are dumb — they receive state + setters as props, own no persistent state
- ErrorBoundary wraps every tab render
- Styles live in a single `s` object (Job Search) or `T` tokens (Wellness)

### API calls (Job Search HQ)
- `callClaude(system, userMsg, maxTokens)` in `constants.js` — use this everywhere
- API key stored in `localStorage` under `chase_anthropic_key`, separate from app data
- `handleClaudeCall(fn, errorSetter)` pattern: wraps any Claude call with standardized error handling

## Supabase Sync — Status

**Wellness Tracker: LIVE ✅** | **Job Search HQ: LIVE ✅** | **RollerTask Tycoon:** wire on deploy | App Forge: later

> ⚠️ **Wellness, Job Search, and RollerTask share the same Supabase project** (`unqtnnxlltiadzbqpyhh`). Data is separated by `app_key` in the shared `user_data` table. One login covers all three.

- `/portfolio/shared/sync.js` — `createSync(url, key)` factory, exports `push`, `pull`, `auth`
- `wellness-tracker/src/sync.js` — app adapter, APP_KEY = `'wellness'`
- `job-search-hq/src/sync.js` — app adapter, APP_KEY = `'job-search'`
- `portfolio/roller-task-tycoon/src/sync.js` — app adapter, APP_KEY = `'roller_task_tycoon_v1'`, env `VITE_SUPABASE_*`
- CRA apps copy `shared/sync.js` as `src/shared/sync.js` (real file, not symlink — symlinks break on Vercel). RollerTask does the same.
- `save()` stamps `_syncAt` · `push()` fires on every save · `pull()` runs on startup
- Email OTP + `verifyOtp` auth gate: **Wellness** + **Job Search** in `App.jsx`; **RollerTask** in `src/main.js` (vanilla). **Dashboard:** Authentication → Email Templates → **Magic link** — add `{{ .Token }}` to the body (default template is link-only; [Supabase OTP docs](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp)). See each app’s `CLAUDE.md` for a sample template.
- `.env` in CRA apps uses `REACT_APP_SUPABASE_*`. **RollerTask** uses **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** (Vite inlines at build).

> ⚠️ **Env prefixes:** CRA apps → `REACT_APP_*` + `process.env`. **RollerTask Tycoon only** → `VITE_*` + `import.meta.env`.

**To activate sync on an app:**
1. Create Supabase project at supabase.com (explain: org, project name, region, free tier limits)
2. Run SQL from `shared/sync.js` comments in Supabase SQL editor (explain: table schema, RLS, updated_at trigger)
3. Copy project URL + anon key → fill in `.env` from `.env.example` (explain: anon key is safe in browser, RLS is what protects data)
4. `npm install @supabase/supabase-js`
5. In the app's `App.jsx` load `useEffect`: call `pull(APP_KEY, stored, stored._syncAt)` after localStorage load
6. In the unified save `useEffect`: call `push(APP_KEY, blob)` after `save(blob)`

**Roll out order:** Wellness first → Job Search → App Forge

## What NOT to Do
- Don't add TypeScript — these apps use plain JS
- Don't install component libraries (MUI, Chakra, etc.) — all UI is inline styles (RollerTask uses `<style>` in `index.html`, not a shared `s` object)
- Don't split the Job Search / Wellness styles `s` / `T` into CSS files without a deliberate refactor — it works across Vercel deploys
- Don't create new localStorage keys without updating the storage key table above
- Don't change existing `STORE` constant names in shipped apps — existing user data depends on them
- Don't add arbitrary backends — offline-first; **Supabase** (shared sync) is the only cloud data path

## Linear — project tracking (PM-style)

When you **ship or materially extend** an app in this portfolio, **use Linear** like a senior PM would: create or update a **project** on the Whittaker team with a short **purpose**, **success criteria**, and **workstreams** (Launch / QA / Backlog); seed **issues** with clear scope and “done when” acceptance. Link the Linear project from the app **README** or **ROADMAP** when useful. *(Example: [RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771).)*

## Documentation Auto-Update Rule

> **After every session where any app is modified, Claude must:**
> 1. Update that app's `CHANGELOG.md` — log what changed under `## [Unreleased]`
> 2. Update that app's `ROADMAP.md` — mark completed items, add new ideas
> 3. Update `/ROADMAP.md` (repo root) Change Log table with a new row
> 4. Do this without being asked — it is part of every edit, not an optional step

This applies to all apps in the portfolio **and** to AI Dev Mastery at `~/Documents/Projects/ai-dev-mastery/`.

## Roadmap Reference
See [ROADMAP.md](ROADMAP.md) for the full priority queue, per-app suggestions, and decisions log.
