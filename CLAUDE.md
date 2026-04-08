# App Portfolio — Master Project Instructions

> For Claude Code. Read this first before touching any app in this portfolio.

## Portfolio Overview

| App | Version | Storage Key | URL | Status |
|-----|---------|-------------|-----|--------|
| Wellness Tracker | v15.10 | `chase_wellness_v1` | wellnes-tracker.vercel.app | ✅ Active |
| Wellness Tracker (iOS) | Phase 1 | `chase_wellness_ios_v1` (+ draft, meds keys); **local-only** (no Supabase) | local Xcode | 🟡 Local · [`portfolio/wellness-tracker-ios`](portfolio/wellness-tracker-ios) |
| Job Search HQ | v8.3 | `chase_job_search_v1` | job-search-hq.vercel.app | ✅ Active |
| App Forge | v8.1 | `chase_forge_v1` | app-forge-fawn.vercel.app | ✅ Active |
| YNAB Clarity (iOS) | v0.1 | SwiftData + `AppStorage` (`chase_ynab_clarity_ios_*`); token in Keychain | local Xcode | 🟡 Local · [`portfolio/ynab-clarity-ios`](portfolio/ynab-clarity-ios) |
| RollerTask Tycoon (iOS) | v1.0 | SwiftData + `UserDefaults` (`chase_roller_task_tycoon_ios_*`) | local Xcode | 🟡 Local · [Linear](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) |
| RollerTask Tycoon (web PWA) | v1.0 | `chase_roller_task_v1` (historical) | (optional Vercel) | 🗄️ Retired — [`portfolio/archive/roller-task-tycoon`](portfolio/archive/roller-task-tycoon) |
| Growth Tracker | v6 | retired | — | 🗄️ Retired |
| AI Dev Mastery | v1.0 | none (no persistence) | not yet deployed | 🟡 Local |

> ⚠️ **AI Dev Mastery** also lives under this monorepo at `projects/ai-dev-mastery/` (and may be checked out elsewhere). When standalone, it is not wired to Supabase, no localStorage, pure course viewer.

**Product framework:** **[PRODUCT_BUILD_FRAMEWORK.md](PRODUCT_BUILD_FRAMEWORK.md)** — universal 6-phase framework (Product Definition → PRD → UX Flow → Architecture → Milestones → Ship). **No coding starts until Phases 1–3 are documented for that app.**

**Migration tracking:** [MONOREPO_MIGRATION.md](MONOREPO_MIGRATION.md) · [Linear — Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) · **Terms:** [docs/GLOSSARY.md](docs/GLOSSARY.md) · **Local legacy (not in git):** [docs/LEGACY_LOCAL_MIRRORS.md](docs/LEGACY_LOCAL_MIRRORS.md)

**Multi-session / multi-agent:** Read **[HANDOFF.md](HANDOFF.md)** when continuing work or opening a **new** chat; copy a starter from [docs/templates/](docs/templates/).

- **End / switch agent:** Update **State** (and **Notes**) in `HANDOFF.md`.
- **New chat:** Paste from `docs/templates/SESSION_START_MONOREPO.md` or `SESSION_START_APP_CHANGE.md`; say read `CLAUDE.md` + `HANDOFF.md` first.
- **Shipped:** Linear + commits = truth; `HANDOFF.md` = current focus.

**Claude Code / any non-Cursor assistant:** The **canonical** handoff routine is **`HANDOFF.md` (Quick routine)** plus the bullets above. **`.cursor/rules/session-handoff.mdc`** is **not** read by Claude Code — it only **mirrors** the same habits for Cursor; you do not need `.cursor` to follow this workflow.

**Cursor only:** Repo root has **`.cursor/rules/session-handoff.mdc`** (`alwaysApply`). Each **`portfolio/*`** app and **`projects/ai-dev-mastery/`** include a **symlink** to that file so opening a subfolder as the workspace still loads the same rule.

## Tech Stack (all apps)
- **Most apps:** React (Create React App) + localStorage; inline styles (no CSS modules, no Tailwind); Vercel; PWA manifest.
- **RollerTask Tycoon** (`portfolio/roller-task-tycoon-ios/`): **SwiftUI** + **SwiftData** + `@AppStorage` (native iOS; not the web portfolio stack). **Wellness Tracker** (`portfolio/wellness-tracker-ios/`): **SwiftUI** check-in, **local-only** (UserDefaults). **Archived** Vite PWA: [`portfolio/archive/roller-task-tycoon`](portfolio/archive/roller-task-tycoon) (**`VITE_*`** + `import.meta.env` when building that tree).
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
  roller-task-tycoon-ios/
    RollerTaskTycoon.xcodeproj, RollerTaskTycoon/  ← SwiftUI + SwiftData; local iOS (bundle id still com.chasewhittaker.ParkChecklist)
  wellness-tracker-ios/
    WellnessTracker.xcodeproj, WellnessTracker/  ← SwiftUI Phase 1 check-in; bundle com.chasewhittaker.WellnessTracker
  archive/
    growth-tracker/  ← retired; merged into Wellness GrowthTab (`chase_wellness_v1.growthLogs`)
    roller-task-tycoon/  ← retired Vite PWA; APP_KEY roller_task_tycoon_v1 (historical Supabase rows may remain)
/projects/
  ai-dev-mastery/, shortcut-reference/, ynab-enrichment/, Money/  ← non-portfolio worktrees
  archive/
    claude-usage-tool/  ← retired fork (Electron menu bar; see README)
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

**Wellness Tracker: LIVE ✅** | **Wellness Tracker (iOS):** local-only (no cloud sync) | **Job Search HQ: LIVE ✅** | **RollerTask Tycoon (iOS):** local-first (no Supabase in app yet) | **RollerTask Tycoon (archived web):** historical `roller_task_tycoon_v1` rows may still exist | App Forge: later

> ⚠️ **Wellness and Job Search** share the same Supabase project (`unqtnnxlltiadzbqpyhh`). The **retired Vite PWA** used the same project with `app_key = roller_task_tycoon_v1` (see archived app’s `CLAUDE.md`).

- `/portfolio/shared/sync.js` — `createSync(url, key)` factory, exports `push`, `pull`, `auth`
- `wellness-tracker/src/sync.js` — app adapter, APP_KEY = `'wellness'`
- `job-search-hq/src/sync.js` — app adapter, APP_KEY = `'job-search'`
- `portfolio/archive/roller-task-tycoon/src/sync.js` — **archived** app adapter, APP_KEY = `'roller_task_tycoon_v1'`, env `VITE_SUPABASE_*`
- CRA apps copy `shared/sync.js` as `src/shared/sync.js` (real file, not symlink — symlinks break on Vercel). The archived RollerTask PWA did the same.
- `save()` stamps `_syncAt` · `push()` fires on every save · `pull()` runs on startup
- Email OTP + `verifyOtp` auth gate: **Wellness** + **Job Search** in `App.jsx`; archived **RollerTask web** used `src/main.js` (vanilla). **Dashboard:** Authentication → Email Templates → **Magic link** — add `{{ .Token }}` to the body (default template is link-only; [Supabase OTP docs](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp)). See each app’s `CLAUDE.md` for a sample template.
- `.env` in CRA apps uses `REACT_APP_SUPABASE_*`. **Archived RollerTask web** uses **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** when you build that tree.

> ⚠️ **Env prefixes:** CRA apps → `REACT_APP_*` + `process.env`. **Archived Vite RollerTask only** → `VITE_*` + `import.meta.env`.

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
- Don't install component libraries (MUI, Chakra, etc.) — all web UI is inline styles (archived RollerTask PWA used `<style>` in `index.html`, not a shared `s` object)
- Don't split the Job Search / Wellness styles `s` / `T` into CSS files without a deliberate refactor — it works across Vercel deploys
- Don't create new localStorage keys without updating the storage key table above
- Don't change existing `STORE` constant names in shipped apps — existing user data depends on them
- Don't add arbitrary backends — offline-first; **Supabase** (shared sync) is the only cloud data path

## CI — portfolio web builds

GitHub Actions **`.github/workflows/portfolio-web-build.yml`** runs **`npm ci && npm run build`** for **Wellness**, **Job Search**, and **App Forge** when those paths change (push to `main` / `master` or PR). **RollerTask Tycoon (iOS)** is not in that workflow — use Xcode (**⌘B** / **⌘U** for `RollerTaskTycoonTests`).

## Linear — project tracking (PM-style)

When you **ship or materially extend** an app in this portfolio, **use Linear** like a senior PM would: create or update a **project** on the Whittaker team with a short **purpose**, **success criteria**, and **workstreams** (Launch / QA / Backlog); seed **issues** with clear scope and “done when” acceptance. Link the Linear project from the app **README** or **ROADMAP** when useful. *(Example: [RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771).)*

## Documentation Auto-Update Rule

> **After every session where any app is modified, Claude must:**
> 1. Update that app's `CHANGELOG.md` — log what changed under `## [Unreleased]`
> 2. Update that app's `ROADMAP.md` — mark completed items, add new ideas
> 3. Update `/ROADMAP.md` (repo root) Change Log table with a new row
> 4. Do this without being asked — it is part of every edit, not an optional step

This applies to all apps in the portfolio **and** to AI Dev Mastery at `projects/ai-dev-mastery/` (monorepo root `~/Developer/chase`; you may still keep a separate clone under `~/Documents/Projects/ai-dev-mastery/` if you prefer).

## Roadmap Reference
See [ROADMAP.md](ROADMAP.md) for the full priority queue, per-app suggestions, and decisions log.
