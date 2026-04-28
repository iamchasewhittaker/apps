# Clarity Command — Handoff

> Read `CLAUDE.md` (this app) + `/CLAUDE.md` (repo root) before making changes.

## State

| Field | Value |
|-------|-------|
| **Focus** | Phase 2 cross-app reads — web fully wired (verified via Supabase); iOS twin shipped same day. |
| **Next** | Verify on physical iPhone that the new `LIVE APP DATA` section on Scoreboard renders correctly when signed in. |
| **Last touch** | 2026-04-27 — Local `.env` added; iOS Command now pulls + renders `job-search-daily` + `wellness-daily` |
| **Status** | ✅ Live · cross-app pipeline active in production (Job Search HQ pushed `job-search-daily` 2026-04-27) |

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Web app | ✅ Done | Morning mission + evening reflection + scoreboard + settings |
| 2 — Job Search HQ integration | ✅ Done | Daily action counter + summary blob (`job-search-daily`) consumed by web Scoreboard `LiveAppData` and iOS `LiveAppDataView` |
| 3 — Wellness Tracker integration | ⏳ Active | `wellness-daily` blob produced by Wellness Tracker; web + iOS render it. Awaiting first per-user push for verification on iOS. |
| 4 — iOS app integrations | ⏳ Later | Clarity Time, Budget, Growth |
| 5 — iOS native | ✅ Done | `portfolio/clarity-command-ios` ships v0.2 with cross-app reads |

## Deploy Checklist
- [x] `npm install` — done
- [x] `npm run build` passes
- [x] Deployed → Vercel project removed 2026-04-20; runs locally via npm start
- [x] Added to root CLAUDE.md portfolio table
- [x] Added to CI workflow (`.github/workflows/portfolio-web-build.yml`)
- [x] **Supabase env vars set** — `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` on Production. App redeployed with sync active.
- [x] **Local `.env` files** — `clarity-command`, `job-search-hq`, `wellness-tracker` all have copies of `.env.supabase` (2026-04-27)
- [ ] **Set layoff date** in Settings (local dev)

## Notes
- Scripture and reminder rotation: day-of-year mod length. No seed needed — just changes daily automatically.
- Conviction panel only fires when yesterday's log exists AND has misses. First day = no conviction (grace).
- Layoff date must be set in Settings for the days-since counter to show.
- Auth gate: if no `.env`, app runs in local-only mode without login prompt.
