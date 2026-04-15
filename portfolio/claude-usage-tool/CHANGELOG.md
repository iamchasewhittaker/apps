# Changelog — Claude Usage Tool

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Reactivated from `projects/archive/` to `portfolio/` as active portfolio app
- Added HANDOFF.md, LEARNINGS.md, CHANGELOG.md, ROADMAP.md, docs/BRANDING.md (portfolio standard docs)
- Added Cursor symlink for session handoff

## [0.10.0] - 2026-03-25

### Added
- Admin API client (`adminApi.ts`) for usage/cost reports and credit balance
- Dual data path: scraping + Admin API
- Activity log showing last fetch times and errors

### Fixed
- Platform login crash workaround (opens in system browser)

## [0.9.0] - 2026-03-20

### Added
- Claude Max/Pro usage monitoring with usage bars and reset timers
- API credit balance tracking from platform.claude.com
- Auto-refresh every 60 seconds
- Persistent sessions between app restarts (electron-store)
- macOS tray icon with popup window
