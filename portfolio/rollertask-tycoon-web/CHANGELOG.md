# Changelog

## [Unreleased]

### Added (2026-04-14)
- **Shared auth bootstrap:** added `src/shared/auth.js` — canonical-host redirect (`apps.chasewhittaker.com/tasks`), session key consolidation, OTP `emailRedirectTo`
- **Refactored sync:** `src/shared/sync.js` + `src/sync.js` export app identity + `emailRedirectTo`; `App.jsx` uses shared `emailRedirectTo`
- **Auth diagnostics:** `REACT_APP_AUTH_DEBUG` flag enables auth state event logging
- **Env template:** `.env.example` updated with `REACT_APP_AUTH_CANONICAL_ORIGIN` and `REACT_APP_AUTH_APP_PATH`
- **Supabase / Vercel:** auth env vars set in Vercel production

### Fixed (2026-04-14)
- **Favicon/logo white corners:** removed `rx` rounded corners from `favicon.svg` and `logo.svg`; regenerated `logo192.png`, `logo512.png`, `apple-touch-icon.png` — solid `#0f1117` fill covers full square

### Added (2026-04-13)
- **Logo standardization:** added `logo.svg` (`ROLLER` amber / `TASK` white), `favicon.svg`, `logo192.png`, `logo512.png`, `apple-touch-icon.png`, `manifest.json`; updated `index.html` with favicon/manifest links and fixed title

## v1.0.0 — 2026-04-13 — Standalone launch (split from clarity-hub)

### Added
- Full app extracted from `clarity-hub` — single-blob CRA app
- `src/theme.js` — T palette, `chase_hub_rollertask_v1` storage key, DEFAULT_ROLLERTASK
- `src/sync.js` — pushRollertask/pullRollertask using Supabase `app_key = 'rollertask'`
- `src/App.jsx` — auth gate (email OTP), gear icon, settings modal (sign out)
- `src/shared/sync.js` — Supabase sync engine
- `src/tabs/RollerTaskTab.jsx` — full gamified task tracker: task list, points, categories, ledger
- CI job in `.github/workflows/portfolio-web-build.yml`
- Deployed to https://rollertask-tycoon-web.vercel.app

## v0.1 — 2026-04-13 — Initial scaffold
- React CRA project created via `scripts/new-app`
