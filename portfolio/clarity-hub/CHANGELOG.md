# Clarity Hub — Changelog

## [Unreleased]

### Added
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
