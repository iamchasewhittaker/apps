# Clarity Hub — Changelog

## [Unreleased]

### Added (2026-04-14)
- **Cross-app navigation (WHI-40):** `AppNav` bar above tab row links to Wellness, Job Search, YNAB, Tasks — uses shared `resolveAppUrl` for canonical-origin URL resolution; replaces inline `EXTERNAL_LINKS` in `NavTabs`
- **Shared UI component:** added `src/shared/ui.jsx` (copy of `portfolio/shared/ui.jsx`) — `Card`, `NavTabs`, `AppNav`, `resolveAppUrl`
- **Shared sync.js update:** synced `src/shared/sync.js` to canonical (comment-only drift fix)
- **Shared auth bootstrap:** added `src/shared/auth.js` — canonical-host redirect (`apps.chasewhittaker.com/hub`), session key consolidation, OTP `emailRedirectTo`
- **Refactored sync:** `src/shared/sync.js` + `src/sync.js` export app identity + `emailRedirectTo`; `App.jsx` uses shared `emailRedirectTo`
- **Canonical external links:** SettingsTab links to YNAB and RollerTask now resolve to canonical-host paths when `REACT_APP_AUTH_CANONICAL_ORIGIN` is set
- **Auth diagnostics:** `REACT_APP_AUTH_DEBUG` flag enables auth state event logging
- **Env template:** `.env.example` updated with `REACT_APP_AUTH_CANONICAL_ORIGIN` and `REACT_APP_AUTH_APP_PATH`
- **Supabase / Vercel:** Site URL + redirect allowlist set to canonical origin; auth env vars set in Vercel production

### Fixed (2026-04-14)
- **Favicon/logo white corners:** removed `rx` rounded corners from `favicon.svg` and `logo.svg`; regenerated `logo192.png`, `logo512.png`, `apple-touch-icon.png` — solid `#0f1117` fill covers full square

### Added (2026-04-13)
- **Logo standardization:** added `logo.svg` (`CLARITY` indigo / `HUB` white), `favicon.svg`, `logo192.png`, `logo512.png`, `apple-touch-icon.png`; updated `manifest.json` from CRA defaults to proper name/colors; added SVG favicon to `index.html`

## [0.2.0] — 2026-04-13 — YNAB + RollerTask split out

### Removed
- `src/tabs/YnabTab.jsx`, `src/engines/MetricsEngine.js`, `src/engines/CashFlowEngine.js`, `src/engines/YNABClient.js` — moved to `portfolio/ynab-clarity-web/`
- `src/tabs/RollerTaskTab.jsx` — moved to `portfolio/rollertask-tycoon-web/`
- `DEFAULT_YNAB`, `DEFAULT_ROLLERTASK`, YNAB token helpers, `fmtDollars` from `theme.js`
- ynab + rollertask push/pull exports from `sync.js`

### Changed
- `src/App.jsx` — reduced to 5-blob shell; default tab changed to "checkin"; nav now includes external links to YNAB Clarity Web + RollerTask Tycoon Web
- `src/tabs/SettingsTab.jsx` — removed YNAB section; added links to standalone apps; scoped export to 5 remaining blobs
- Bumped to v0.2

### Added (scaffold — 2026-04-13)
- `src/tabs/TimeTab.jsx` — focus timer (start/pause/resume/stop/discard), manual session log, scripture streak tracker with consecutive-day count
- `src/tabs/BudgetTab.jsx` — dual-scenario (baseline/stretch) at-a-glance, scenario editors, wants tracker with quick-add buttons (+$5/+$20/+$50) and reset
- Deployed to Vercel: https://clarity-hub-lilac.vercel.app
- `src/tabs/YnabTab.jsx` — full YNAB tab: 4-step setup flow (token verify → budget picker → category roles w/ auto-suggest → income sources), dashboard with safe-to-spend, budget health bar, bills planner (Needs Attention / Partial / Covered), income gap, cash flow timeline, spending summary, and fund category write-back with confirmation modal
- `src/tabs/SettingsTab.jsx` — YNAB section: token update field, Re-run YNAB Setup button
- Snake_case → camelCase mappers for YNAB API response fields (required by MetricsEngine)

---

### Added (scaffold — 2026-04-13)
- CRA scaffold with 7-blob state management and auth gate (email OTP via Supabase)
- `src/theme.js` — Clarity palette tokens, load/save helpers for all 7 app blobs, YNAB token helpers, format helpers
- `src/sync.js` — push/pull wrappers for 7 Supabase app_keys: ynab, checkin, triage, time, budget, growth, rollertask
- `src/engines/MetricsEngine.js` — full port of MetricsEngine.swift (safe-to-spend, shortfall, coverage, income gap, spending aggregates)
- `src/engines/CashFlowEngine.js` — full port of CashFlowEngine.swift (chronological paycheck/bill timeline with markers)
- `src/engines/YNABClient.js` — YNAB API browser fetch client (read + PATCH write-back)
- 8 placeholder tabs: YNAB, Check-in, Triage, Time, Budget, Growth, Tasks, Settings
- Auth gate + 7-blob load/pull on mount, save/push on change
- Scrollable NavTabs (8 tabs in horizontal scroll)
- `src/shared/sync.js` — copy of portfolio/shared/sync.js

## [0.1.0] — 2026-04-13

- Initial scaffold
