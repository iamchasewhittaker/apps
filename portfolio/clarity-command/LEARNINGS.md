# Clarity Command — Learnings

## 2026-04-27 — Phase 2 was already shipped, just needed `.env`

- The `LiveAppData` panel on Scoreboard, the `pull('job-search-daily', ...)` + `pull('wellness-daily', ...)` calls, and the matching push effects on Job Search HQ + Wellness Tracker were all coded in a previous session but never proven end-to-end because:
  1. The local apps were missing `.env` (so dev sync never fired)
  2. The Vercel project for Command was removed 2026-04-20 (so production stopped showing the panel)
- Verified via direct Supabase query that Job Search HQ has been pushing `job-search-daily` rows in production daily (latest 2026-04-27). The web pipeline works.
- Lesson: before assuming cross-app integration is unbuilt, query Supabase directly: `SELECT app_key, updated_at FROM user_data WHERE app_key IN (...)`. This saved hours.

## 2026-04-13 — Initial build
- Auth: if no `.env` is present, `createSync` returns null auth and the app auto-skips the login screen and runs in local-only mode. This is intentional — no crash on first run without Supabase config.
- Scripture rotation uses day-of-year mod array length. Works fine without any additional randomization.
- `upsertTodayLog` merges areas shallowly — use spread carefully if nesting gets deeper.
- Conviction panel fires only when yesterday's log exists. First-day users see no red flags (grace).
- `checkAllMet` is defined at the bottom of MissionTab — it's used by both MissionTab and the streak computation in ScoreboardTab via `computeStreak`. Keep these aligned when targets change.
- `shared/sync.js` must be copied to `src/shared/sync.js` — CRA forbids imports outside `src/`. Symlinks break on Vercel too. This is the same pattern as Wellness and Job Search. If the shared sync module is updated, re-copy it here.
- ESLint rule `react-hooks/exhaustive-deps` is not available in this CRA config — don't reference it in eslint-disable comments.
