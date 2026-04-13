# App Forge — Changelog

## [Unreleased]

- **Theme alignment:** updated `C` tokens in `App.jsx` to match shared portfolio BASE token set (`bg` `#0f1117`, `surface` `#161b27`, `border` `#1f2937`, `borderLight` `#374151`, `text` `#f3f4f6`, `muted` `#6b7280`, `dim` `#374151`); added DM Sans Google Fonts link to `public/index.html`; updated `theme-color` meta to `#0f1117`
- **Monorepo:** path `portfolio/app-forge`; `PROJECT_INSTRUCTIONS.md` (renamed from `APP_FORGE_PROJECT_INSTRUCTIONS.md`); README, ROADMAP, AGENTS, `docs/*`; Linear links.

## v8.1 — 2026-03-24
- Updated `APP_SNAPSHOT_DEFAULTS` with current versions for all apps:
  - Wellness: v11 → v15.9 (Supabase sync live, shared project, configurable meds, backup restore)
  - Growth: updated to v6 retired status with migration note
  - Job Search: v6 → v8.2 (Supabase sync live, auth fix, shared Supabase project)
- Added `notes` field content to wellness and jobsearch snapshots (Supabase project info, auth method, API key storage)
- Updated `APP_META` in job-search-hq/src/App.jsx: v8.1 → v8.2

## v8 — 2026-03-24
- Replaced brittle substring audit detection with APP_META comment parsing
- detectApp() now reads `// APP_META: { "app": "...", "version": "..." }` first, falls back to marker scoring
- Updated wellness markers fallback: removed `morning_start` (now in TrackerTab.jsx), uses `chase_wellness_v1` in shell
- Added APP_META to wellness-tracker/src/App.jsx (wellness v15.6) and job-search-hq/src/App.jsx (jobsearch v7)

## v7 — 2026-03-23
- Fixed Job Search HQ audit detection: removed runApplyKit marker (no longer in v6), added CHASE_CONTEXT
- Updated Job Search HQ snapshot default to v6 with Interview Prep changelog summary

## v6 — 2026-03-21
- Fixed white border around app edges (added global html/body margin/padding reset)

## v5 — 2026-03-21
- Added Apps tab (blue) — one card per app tracking version, changelog summary, live URL, storage key, local folder, and notes
- Apps tab pre-filled with current state of all 4 apps (Wellness v11, Growth v5, Job Search HQ v4, App Forge v5)
- Tap "Update" on any card after a deploy to log the new version and what changed
- appSnapshots added to localStorage data model (key: chase_forge_v1, field: appSnapshots)

## v4
- Added audit.sh detection order fix: App Forge must be checked first
- Fixed confirm() false positive in audit.sh caused by string literal on line 86
- Updated pre-deploy.sh to skip string literal lines using grep -E filters

## v3
- Added audit.sh — runs framework checks in Terminal, auto-copies results to clipboard
- Updated deploy workflow: audit.sh runs BEFORE pre-deploy.sh

## v2
- Fixed duplicate CSS borderBottom key in tab style object
- Changed vercel.json check to always-pass reminder
- Fixed pre-deploy.sh false positives

## v1 — Initial build
- Audit, Lessons, Learn, Ideas tabs
- Dark mode, localStorage key chase_forge_v1
