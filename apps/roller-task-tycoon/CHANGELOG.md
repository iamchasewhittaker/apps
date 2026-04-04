# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **Sync startup:** `pull` now uses a fresh `loadState()` snapshot (and `hasLoaded` is set only after `pull` finishes) so a fast local save is not compared against a stale `_syncAt` and overwritten by older remote data.
- **Notifications:** toast HTML escapes user-controlled task text so notification `innerHTML` cannot inject markup.

### Added

- **Supabase CLI:** `supabase init` + `supabase link` to project `unqtnnxlltiadzbqpyhh`; committed `supabase/config.toml` and `supabase/.gitignore` (`.temp` / local junk ignored).
- **Vercel:** production [roller-task-tycoon.vercel.app](https://roller-task-tycoon.vercel.app) — set `VITE_SUPABASE_*` in project settings and redeploy for cloud sync.
- **Linear** project [RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771) with launch/QA/backlog issues; linked from README + AGENTS.
- Initial **Vite + vanilla JS** scaffold with original RollerTask Tycoon UI (Win95-style windows, taskbar, stats, notifications).
- **PWA:** `manifest.json`, teal icons (192 / 512 / apple-touch), `apple-mobile-web-app-*` meta, `viewport-fit=cover`, safe-area padding for taskbar and notifications.
- **Persistence:** `localStorage` key `chase_roller_task_v1` — blob `{ tasks, cash, _syncAt }`.
- **Supabase sync:** copy of portfolio `createSync` pattern; `APP_KEY = roller_task_tycoon_v1`; `push` after mutations; `pull` on startup when logged in.
- **Auth:** email OTP + in-app `verifyOtp` (iPhone home-screen PWA parity with Wellness Tracker); localStorage-only fallback when build has no `VITE_SUPABASE_*`.
- **Docs:** README, CLAUDE, AGENTS, ROADMAP, LEARNING, ARCHITECTURE, CASE_STUDY, ADR 001; `vercel.json` no-cache headers.
- **Sign out** control (reloads after `auth.signOut()`).
