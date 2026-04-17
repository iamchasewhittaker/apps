# Changelog — Spend Radar (web)

All notable changes to this project will be documented here.

## [Unreleased]

### Added
- Initial CRA scaffold — `package.json`, `public/index.html`, `public/manifest.json`, `public/favicon.svg`
- `src/index.js` — React 18 `createRoot` entry
- `src/App.jsx` — header + metrics row + subscriptions-by-category grid + cancel candidates + recent receipts table + refresh button + sync timestamp
- `src/constants.js` — `CSV_URLS`, palette (`C`), style tokens (`s`), tiny CSV parser, `parseDollar`/`formatDollar`/`monthlyEquivalent`, `localStorage` cache helpers
- `src/ErrorBoundary.jsx` — standard portfolio error boundary
- `CLAUDE.md`, `HANDOFF.md`, `LEARNINGS.md`, `ROADMAP.md`, `docs/BRANDING.md`
