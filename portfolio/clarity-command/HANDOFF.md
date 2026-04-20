# Clarity Command — Handoff

> Read `CLAUDE.md` (this app) + `/CLAUDE.md` (repo root) before making changes.

## State

| Field | Value |
|-------|-------|
| **Focus** | Phase 1 complete — deployed live. Set Supabase env vars + layoff date to activate fully. |
| **Next** | 1. App is local only (Vercel project removed 2026-04-20). 2. Set layoff date in Settings locally. 3. Phase 2: see `docs/CLARITY_COMMAND_PHASE2.md`. |
| **Last touch** | 2026-04-20 — Vercel project removed; app runs locally via npm start |
| **Status** | ✅ Live · localStorage-only mode (no Supabase env vars yet) |

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Web app | ✅ Done | Morning mission + evening reflection + scoreboard + settings |
| 2 — Job Search HQ integration | ⏳ Next | Add daily action counter to FocusTab, write summary to Supabase |
| 3 — Wellness Tracker integration | ⏳ Pending | Morning/evening accountability prompts |
| 4 — iOS app integrations | ⏳ Later | Clarity Time, Budget, Growth |
| 5 — iOS native | ⏳ Later | Native Swift version of Command |

## Deploy Checklist
- [x] `npm install` — done
- [x] `npm run build` passes
- [x] Deployed → Vercel project removed 2026-04-20; runs locally via npm start
- [x] Added to root CLAUDE.md portfolio table
- [x] Added to CI workflow (`.github/workflows/portfolio-web-build.yml`)
- [x] **Supabase env vars set** — `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` on Production. App redeployed with sync active.
- [ ] **Set layoff date** in Settings (local dev)

## Notes
- Scripture and reminder rotation: day-of-year mod length. No seed needed — just changes daily automatically.
- Conviction panel only fires when yesterday's log exists AND has misses. First day = no conviction (grace).
- Layoff date must be set in Settings for the days-since counter to show.
- Auth gate: if no `.env`, app runs in local-only mode without login prompt.
