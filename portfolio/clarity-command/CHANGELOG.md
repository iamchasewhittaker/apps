# Clarity Command — Changelog

## [Unreleased]

### Added (2026-04-14)
- **Shared auth bootstrap:** added `src/shared/auth.js` — canonical-host redirect (`apps.chasewhittaker.com/command`), session key consolidation, OTP `emailRedirectTo`
- **Refactored sync:** `src/shared/sync.js` + `src/sync.js` export app identity + `emailRedirectTo`; `App.jsx` uses shared `emailRedirectTo`
- **Auth diagnostics:** `REACT_APP_AUTH_DEBUG` flag enables auth state event logging
- **Env template:** `.env.example` updated with `REACT_APP_AUTH_CANONICAL_ORIGIN` and `REACT_APP_AUTH_APP_PATH`
- **Supabase / Vercel:** Site URL + redirect allowlist set to canonical origin; auth env vars set in Vercel production

### Fixed (2026-04-14)
- **Favicon/logo white corners:** removed `rx` rounded corners from background `<rect>` in `favicon.svg` and `logo.svg`; regenerated `logo192.png`, `logo512.png`, `apple-touch-icon.png` — solid `#0f1117` fill covers full square

### Changed (2026-04-13)
- **Logo standardization:** replaced shield/compass with portfolio-standard text logo — `CLARITY` (gold `#c8a84b`) / `COMMAND` (white) on `#0f1117`; updated `logo.svg`, `favicon.svg`, `logo192.png`, `logo512.png`, `apple-touch-icon.png`
- **`public/index.html`:** added missing `<link rel="icon">` (SVG) and `<link rel="apple-touch-icon">`

### Added (Phase 2 — 2026-04-13)
- Logo: shield + compass SVG (`logo.svg`, `logo192.png`, `logo512.png`, `apple-touch-icon.png`, `favicon.svg`)
- Cross-app reads: pulls `job-search-daily` and `wellness-daily` from Supabase on load
- MissionTab: shows live job count from Job Search HQ with 📡 indicator when synced
- ScoreboardTab: `LiveAppData` section shows Job Search count + Wellness morning/evening/activity status

## [1.0.0] — 2026-04-13
### Added
- Initial build — full Phase 1 web app
- Morning Mission tab: daily LDS scripture, wife's words, conviction messages for yesterday's misses, both urgency counters (days since layoff + streak), target checklist, job action logger, commit button
- Evening Reflection tab: excuses audit, accomplishments log, tomorrow's top 3 priorities
- Scoreboard tab: week grid, area streaks, monthly calendar heatmap, stats row
- Settings tab: layoff date, custom targets, wife's reminders bank, scripture bank, data export
- 15 LDS scriptures (D&C, Book of Mormon, Bible) with conviction messages
- 15 wife's words from her letter, area-tagged for targeted conviction
- Supabase sync adapter (APP_KEY = 'command'), localStorage-only fallback
- Email OTP auth gate (same pattern as Wellness Tracker)
- PWA manifest
