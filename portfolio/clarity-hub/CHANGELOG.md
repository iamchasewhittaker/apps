# Clarity Hub — Changelog

## [Unreleased]

### Added
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
