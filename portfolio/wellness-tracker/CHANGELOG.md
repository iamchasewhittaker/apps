# Changelog

## v15.10 — 2026-04-03 — Email OTP login (iPhone home-screen PWA)

- **Sign-in:** `signInWithOtp` + `auth.verifyOtp({ type: 'email' })` — user enters the code from email in-app so the Supabase session is stored in the **same** `localStorage` as the home-screen Web app (Safari and standalone PWA do not share storage; magic links opened from Mail usually complete in Safari only)
- **Removed** the previous `navigator.standalone` / `display-mode: standalone` auth bypass so the login gate reflects a real session and `push`/`pull` behave consistently
- **Login UI:** second step for code entry, resend cooldown (45s), change email; copy explains iPhone PWA vs Safari + link
- **Supabase (dashboard):** sign-in email template must include the one-time token (e.g. `{{ .Token }}` in the **Magic link** template — default is link-only) so users receive a code to type — see [Supabase passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- **Docs / UX:** `CLAUDE.md` step-by-step + sample HTML for the Magic link template; portfolio root `CLAUDE.md` + `ROADMAP.md` Change Log; login screen explains link-only emails
- **Chore:** `.gitignore` — ignore `.claude/*` except `launch.json`

## [Unreleased]

- **Branding / PWA:** corrected master + derived icons to **1024×1024** square (fixes Xcode App Icon validation when syncing from non-square sources).
- **Branding / PWA:** unified **W + sunrise** mark recolored to **Clarity family** palette (`#0e1015` canvas, blue horizon, amber sun — tokens per YNAB Clarity `ClarityTheme`; Spend Clarity CLI has no logo in-repo); refreshed `public/logo-*.png`, `apple-touch-icon`, `favicon-32`, `manifest.json` (`theme_color` / `background_color` `#0e1015`), `index.html` `theme-color`. Specs in `docs/BRANDING.md`. Added per-app [HANDOFF.md](HANDOFF.md).
- **Monorepo:** app path is `portfolio/wellness-tracker` under `~/Developer/chase`; README, ROADMAP, AGENTS, `docs/ARCHITECTURE`, `docs/LEARNING`; Linear project linked in docs.
- **Native iOS (Phase 1):** companion app at [`portfolio/wellness-tracker-ios`](../wellness-tracker-ios) — morning/evening check-in, **`chase_wellness_ios_*`** UserDefaults, **no cloud sync**; see that folder’s `CLAUDE.md` / `README.md`.
- **Docs:** `src/shared/sync.js` header lists known `app_key` values (kept in sync with `portfolio/shared/sync.js`).

## v15.9 — 2026-03-24 — Supabase sync live

- Supabase sync fully wired: magic-link auth gate, `push()` in save useEffect, `pull()` in load useEffect
- Created `src/sync.js` (APP_KEY = `'wellness'`, `REACT_APP_*` env vars, offline-first fallback)
- Copied `shared/sync.js` as `src/shared/sync.js` — real file copy, not symlink (symlinks break on Vercel)
- `@supabase/supabase-js` installed
- Supabase env vars (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`) added to Vercel — deployed app at `wellnes-tracker.vercel.app` now has live sync
- Site URL and redirect URL allowlist confirmed set in Supabase dashboard; login verified on live URL
- `_syncAt: Date.now()` stamped on every `save()` for last-write-wins sync comparison
- Fallback: if `.env` missing or incomplete, app runs in localStorage-only mode (no crash)
- Fixed `.env.example` prefix from `VITE_` → `REACT_APP_` (this is CRA, not Vite)

## v15.8 — 2026-03-24
- **Task 3: User-configurable meds list**
  - Added `MED_STORE`, `DEFAULT_MEDS`, `loadMeds`, `saveMeds` to `theme.js` (stored separately as `chase_wellness_meds_v1`)
  - App.jsx: `meds` state initialized from `DEFAULT_MEDS`, loaded via `loadMeds()` on startup, persisted via dedicated `useEffect`
  - `meds` / `setMeds` props threaded from App → TrackerTab → MorningStartSection and MedCheckinSection
  - `MorningStartSection`: "Medications taken this morning" chip list now driven by `meds` prop (no more hardcoded names)
  - `MedCheckinSection`: added ⚙️ gear icon in header; expands inline panel to add/remove med chips — no modal, same MultiChip style
- **Task 4: Backup restore UI**
  - `HistoryTab.jsx`: added "📥 Restore from Backup" section below the backup panel
  - Hidden `<input type="file" accept=".json">` triggered by button click
  - Validates that parsed JSON contains at least one of `{ entries, budget, tasks, growthLogs }` — shows alert if not
  - `window.confirm` before overwrite; on confirm calls `save(parsed)` then `window.location.reload()`
  - Styled amber/outline to visually distinguish from the solid-amber backup button

## v15.7 — 2026-03-24
- Added per-tab error boundaries (`src/ErrorBoundary.jsx`)
  - Class component with "Try again" reset button
  - Wraps all 6 tabs in App.jsx (Check-In, Tasks, Time, Budget, Growth, History)
  - A crash in one tab no longer takes down the whole app
- Fixed DST midnight edge case in TimeTrackerTab.jsx
  - `elapsed` now checks `new Date(active.startTime).toDateString() === todayStr` before computing `now - startTime`
  - Cross-midnight sessions (e.g. started 11pm, DST change night) show 0 elapsed instead of inflated/negative value
  - `allSessions` active-duration entry uses the same guarded `elapsed` — totals chart also protected

## v15.6 — 2026-03-23
- Refactored monolith: split 5,485-line App.jsx into 8 focused source files
  - `src/theme.js` — T theme object, storage keys, load/save/draft helpers
  - `src/ui.jsx` — 9 shared UI primitives (Card, Rating, ChoiceButton, etc.)
  - `src/tabs/TrackerTab.jsx` — all daily check-in sections + quotes (exported QUOTES array)
  - `src/tabs/TasksTab.jsx` — Tasks, GmatTracker, IdeasInTasks, WIN_CATEGORIES, LIFE_AREAS
  - `src/tabs/TimeTrackerTab.jsx` — TimeTrackerTab, TIME_CATEGORIES, BACKGROUND_OPTIONS, fmt helpers
  - `src/tabs/BudgetTab.jsx` — BudgetTool (default) + WantsTracker (named)
  - `src/tabs/GrowthTab.jsx` — GrowthTab + all subcomponents + GROWTH_AREAS helpers
  - `src/tabs/HistoryTab.jsx` — HistoryView (default) + WinLogger, PatternsView, PatternAlerts, DoctorPrepView, AIMonthlySummary
  - `src/App.jsx` reduced from 302 KB to ~16 KB — thin shell with state, effects, NavTabs, floating buttons
  - Build passes clean with zero errors
- Added `.claude/launch.json` — dev server registry for Claude Code
  - wellness-tracker :3000, job-search-hq :3001, app-forge :3002, growth-tracker :3003
  - Enables `preview_start` (screenshot, console, network inspection from Claude Code)

## v15.5 — 2026-03-23
- Upgraded JSON backup to folder-aware save using File System Access API
  - First tap prompts user to pick or create a folder (e.g. "Wellness Backups" in iCloud)
  - Folder handle persisted in localStorage (chase_wellness_backup_folder) — subsequent taps save directly with no prompt
  - Each backup saved as a separate dated file: wellness-backup-YYYY-MM-DD.json
  - "Change backup folder" link clears saved handle to re-prompt on next tap
  - Falls back to standard download on Safari/Firefox (showDirectoryPicker not yet supported)

## v15.4 — 2026-03-23
- Added JSON backup button to History tab (below CSV export)
  - Downloads full chase_wellness_v1 as wellness-backup-YYYY-MM-DD.json
  - Protects against Safari clearing localStorage — save to Files or iCloud
  - Orange styling to visually distinguish from blue CSV export

## v15.3 — 2026-03-23
- Fixed white double-line below header: removed duplicate borderBottom from sticky header wrapper (NavTabs already has its own border)
- Fixed Safari zoom/layout glitch: removed position:sticky + zIndex from NavTabs (was double-sticky inside already-sticky parent)
- Fixed History tab cut off on iPhone: NavTabs now uses overflowX:auto with flex:0 0 auto per tab + minWidth:52 so all 6 tabs always fit and are scrollable

## v15.2 — 2026-03-23
- Connected Growth tab Job Search card to Job Search HQ app
  - getJobPipelineSummary() reads chase_job_search_v1 — shows active app count + overdue follow-ups
  - "Open Job Tracker →" deep-link button on Job Search card → job-search-hq.vercel.app
  - JOB_TRACKER_URL constant at top of file for easy URL updates
  - Plain function (not hook) to avoid React rules-of-hooks violation

## v15.1 — 2026-03-23
- Fixed Time Tracker timer displaying -1:-1
  - Clamped elapsed to Math.max(0, now - startTime) to prevent negative values
  - fmtHHMM now guards against negative ms input
  - Session duration totals also clamped

## v15 — 2026-03-23
- Merged Growth Tracker into Wellness as new 🌱 Growth tab (replaces Ideas tab)
  - 7 areas: GMAT prep, Job search, AI learning, Project mgmt (PMP), Learning Claude, Book of Mormon, Come Follow Me
  - Session logging: area picker, minutes slider, milestone chips, background options, notes
  - Per-area streak badges (green 1-2 days, amber/fire 3-6, teal/lightning 7+)
  - Week activity bar chart across all areas
  - Stats row: total sessions, total hours, active streaks count
  - Area grid (2-col) with done-today indicator (green top bar + border highlight)
  - Session history with per-area filter, last 30 sessions
  - growthLogs stored in chase_wellness_v1 — Growth Tracker app can now be retired
- Ideas tab content moved into Tasks tab as 💡 Ideas sub-view (secondary nav)
  - Capture, Pressure Test, Explore all preserved intact
  - GMAT sub-tab removed from Ideas (GMAT now tracked in Growth tab)
- Tab bar stays at 6 — no layout changes on iPhone
- ideasData/setIdeasData now passed as props through TasksTab

## v14 — 2026-03-22
- Added daily Book of Mormon + Come Follow Me habit badges to Time Tracker tab
- Added Patterns charts to History → Patterns tab (PatternsView component)
- Added Sunday weekly review auto-surface in Tasks today view
- Added AI Monthly Summary sub-tab to History (Summary tab, Anthropic API)

## v13 — 2026-03-22
- Added Oura scores to morning Sleep section (Readiness, Sleep, HRV)
- Scripture streak persists across days as {count, lastDate} in chase_wellness_v1
- Sunday Come Follow Me reminder added to Time Tracker

## v12 — 2026-03-22
- Added Time Tracker tab (6th tab, between Tasks and Budget)
- 11 categories, multi-select tags, background toggle, active timer, Today's Log sub-tab
- Midnight auto-reset, timeData in unified save

## v11 — 2026-03-21
- Removed OCD, Mood & Wellbeing, ADHD, Side Effects from evening check-in
- New evening flow: Daily Tracker → Health & Lifestyle → End of Day

## v10 — 2026-03-19
- Numbered all check-in questions; moved GMAT to History tab; Ideas trimmed to 3 sub-tabs

## v9 — 2026-03-19
- Added Med Check-In evening section; added Pulse Check floating button + modal

## v8 — pre-deploy script + framework update
## v7 — audit.sh rollout
## v6 — git config fix + cache headers (vercel.json)
## v5 — OCD example hints
## v4 — Triage system + export + tomorrow focus
## v3 — Tasks tab redesign (capacity-first)
## v2 — Evening check-in restructure
## v1 — Initial build
