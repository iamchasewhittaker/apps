# Changelog

## [Unreleased]

### Fixed (2026-04-14)
- **Lockfile / CI:** pinned `typescript@4.9.5` as a devDependency so `npm ci` matches `react-scripts@5` peer (`^3 || ^4`); regenerated `package-lock.json` (was resolving `typescript@6`, which broke clean installs)

### Added (2026-04-14)
- **Shared auth bootstrap:** added `src/shared/auth.js` — canonical-host redirect (`apps.chasewhittaker.com/ynab`), session key consolidation, OTP `emailRedirectTo`
- **Refactored sync:** `src/shared/sync.js` + `src/sync.js` export app identity + `emailRedirectTo`; `App.jsx` uses shared `emailRedirectTo`
- **Auth diagnostics:** `REACT_APP_AUTH_DEBUG` flag enables auth state event logging
- **Env template:** `.env.example` updated with `REACT_APP_AUTH_CANONICAL_ORIGIN` and `REACT_APP_AUTH_APP_PATH`
- **Supabase / Vercel:** auth env vars set in Vercel production

### Fixed (2026-04-14)
- **Favicon/logo white corners:** removed `rx` rounded corners from `favicon.svg` and `logo.svg`; regenerated `logo192.png`, `logo512.png`, `apple-touch-icon.png` — solid `#0f1117` fill covers full square

### Added (2026-04-13)
- **Logo standardization:** added `logo.svg` (`YNAB` green / `CLARITY` white), `favicon.svg`, `logo192.png`, `logo512.png`, `apple-touch-icon.png`, `manifest.json`; updated `index.html` with favicon/manifest links and fixed title

## v1.0.0 — 2026-04-13 — Standalone launch (split from clarity-hub)

### Added
- Full app extracted from `clarity-hub` — single-blob CRA app
- `src/theme.js` — T palette, `chase_hub_ynab_v1` storage key, YNAB token helpers, format helpers (fmtCents, fmtDollars, fmtDuration, computeStreak)
- `src/sync.js` — pushYnab/pullYnab using Supabase `app_key = 'ynab'`
- `src/App.jsx` — auth gate (email OTP), gear icon, settings modal (token update + re-run setup + sign out)
- `src/shared/sync.js` — Supabase sync engine
- `src/tabs/YnabTab.jsx` — full YNAB dashboard: 4-step setup flow + safe-to-spend + bills + income gap + cash flow + fund write-back
- `src/engines/MetricsEngine.js`, `CashFlowEngine.js`, `YNABClient.js`
- CI job in `.github/workflows/portfolio-web-build.yml`
- Deployed to https://ynab-clarity-web.vercel.app

## v0.1 — 2026-04-13 — Initial scaffold
- React CRA project created via `scripts/new-app`
