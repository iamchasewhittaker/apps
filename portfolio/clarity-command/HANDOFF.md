# Clarity Command — Handoff

> Read `CLAUDE.md` (this app) + `/CLAUDE.md` (repo root) before making changes.

## State

| Field | Value |
|-------|-------|
| **Focus** | Phase 1 complete — full web app built. Ready to deploy + use. |
| **Next** | 1. Deploy to Vercel (set REACT_APP_SUPABASE_* env vars). 2. Set layoff date in Settings. 3. Phase 2: Job Search HQ daily action counter integration. |
| **Last touch** | 2026-04-13 — initial build (all three tabs, LDS scripture bank, wife's reminders, conviction system) |
| **Status** | ✅ Built, needs deploy |

## Phase Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Web app | ✅ Done | Morning mission + evening reflection + scoreboard + settings |
| 2 — Job Search HQ integration | ⏳ Next | Add daily action counter to FocusTab, write summary to Supabase |
| 3 — Wellness Tracker integration | ⏳ Pending | Morning/evening accountability prompts |
| 4 — iOS app integrations | ⏳ Later | Clarity Time, Budget, Growth |
| 5 — iOS native | ⏳ Later | Native Swift version of Command |

## Deploy Checklist
- [ ] `npm install` in `portfolio/clarity-command/`
- [ ] Create `.env` from `.env.example` — use same Supabase project as Wellness/Job Search
- [ ] `npm run build` passes
- [ ] `vercel --prod` or connect GitHub → Vercel
- [ ] Set env vars in Vercel dashboard
- [ ] Add to root CLAUDE.md portfolio table URL column

## Notes
- Scripture and reminder rotation: day-of-year mod length. No seed needed — just changes daily automatically.
- Conviction panel only fires when yesterday's log exists AND has misses. First day = no conviction (grace).
- Layoff date must be set in Settings for the days-since counter to show.
- Auth gate: if no `.env`, app runs in local-only mode without login prompt.
