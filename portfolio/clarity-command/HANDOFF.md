# Clarity Command — Handoff

> Read `CLAUDE.md` (this app) + `/CLAUDE.md` (repo root) before making changes.

## State

| Field | Value |
|-------|-------|
| **Focus** | Phase 3 cross-app reads — Scoreboard now pulls from 5 apps (Job Search, Wellness, Time, Budget, Growth). |
| **Next** | Verify Wellness E2E on physical iPhone. Remove archived `roller-task-tycoon` Vercel project to free git connect slot. |
| **Last touch** | 2026-04-29 — Redeployed to Vercel; added Time/Budget/Growth blob pulls from Clarity Hub; fixed `today()` import bug |
| **Status** | ✅ Live at clarity-command.vercel.app · 5-app Scoreboard · CI enabled |

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Web app | ✅ Done | Morning mission + evening reflection + scoreboard + settings |
| 2 — Job Search HQ integration | ✅ Done | Daily action counter + summary blob (`job-search-daily`) consumed by web Scoreboard `LiveAppData` and iOS `LiveAppDataView` |
| 3 — Wellness Tracker integration | ✅ Done (web) | `wellness-daily` blob produced by Wellness Tracker; web renders it. iOS awaiting E2E verification on physical device. |
| 4 — Clarity Hub integrations | ✅ Done (web) | `clarity-time-daily`, `clarity-budget-daily`, `clarity-growth-daily` blobs pushed by Clarity Hub; web Scoreboard renders all three. iOS not yet updated. |
| 5 — iOS native | ✅ Done | `portfolio/clarity-command-ios` ships v0.2 with cross-app reads |

## Deploy Checklist
- [x] `npm install` — done
- [x] `npm run build` passes
- [x] Deployed → https://clarity-command.vercel.app (redeployed 2026-04-29; git connect pending — Vercel 10-project limit on apps.git)
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
