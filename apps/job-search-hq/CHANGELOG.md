# Changelog

## v8.3 — 2026-04-03 — Email OTP login (match Wellness / iPhone PWA)

- **Sign-in:** same flow as Wellness Tracker — `signInWithOtp` + `auth.verifyOtp({ type: 'email' })` so the session persists in the home-screen Web app’s `localStorage`
- **Login UI:** code entry step, resend cooldown, change email; shared Supabase project — one account still covers both apps
- **Supabase (dashboard):** same as Wellness — **Magic link** email template must include `{{ .Token }}` for in-app OTP (see Wellness `CLAUDE.md`)
- **Docs / UX:** `CLAUDE.md` cross-ref; login screen hint for link-only emails; portfolio docs updated
- **Chore:** `.claude/launch.json` (port 3001); `.gitignore` keeps only `launch.json` under `.claude/`

## [Unreleased]

_(No entries.)_

## v8.2 — 2026-03-24 — Auth fix: wrong Supabase project

- **Fixed:** `.env` was pointing to a separate Supabase project (`uwlfhxzeeleebjpiimrg`) instead of the shared wellness project — magic links were redirecting to `wellnes-tracker.vercel.app` because that project's Site URL was set to the wellness URL
- **Fixed:** Updated `.env` to use wellness Supabase project credentials (`unqtnnxlltiadzbqpyhh`) — both apps now share one project; one magic-link session covers both
- **Fixed:** Added `https://job-search-hq.vercel.app`, `http://localhost:3000`, `http://localhost:3001` to the shared Supabase project's redirect URL allowlist
- **Fixed:** `.env.example` had wrong `VITE_` prefix — corrected to `REACT_APP_` (this is CRA, not Vite)

## v8.1 — 2026-03-24 — Supabase sync live

- Wired Supabase sync using same pattern as Wellness Tracker
- Created `src/sync.js` (APP_KEY = `'job-search'`, `REACT_APP_*` env vars, offline-first fallback)
- Copied `shared/sync.js` as `src/shared/sync.js` — real file copy, not symlink (symlinks break on Vercel since only the app repo is cloned)
- `push()` wired into save useEffect with `_syncAt` stamp; `pull()` wired into load useEffect
- Magic-link auth gate added (same `LoginScreen` pattern as Wellness)
- Same Supabase project as Wellness Tracker — data separated by `app_key = 'job-search'` in shared `user_data` table
- Anthropic API key remains in `localStorage` only — never synced
- Fallback: if `.env` missing, app runs in localStorage-only mode (no crash)

## v8 — Hardening: error handling, error boundaries, restore UI, API key safety

### Task 5 — API key safety
- Updated ApiKeyModal security notice: "Your key is stored locally on this device only and sent directly to Anthropic. It never passes through any server. Do not use this app on shared computers."
- Added migration on load: if API key is found in `chase_job_search_v1` (old location), it is automatically moved to `chase_anthropic_key` and removed from the main data store

### Task 6 — Error handling for Claude API calls
- `callClaude()` now catches network failures and throws `NETWORK_ERROR`, checks HTTP 401 → `AUTH_ERROR`, HTTP 529 → `OVERLOADED` before parsing JSON
- `handleClaudeCall()` routes each error type to a specific user message
- `searchJobs()` updated with the same network/401/529 handling
- Added `showError(msg)` helper that sets a fixed-position red error toast that auto-dismisses after 6 seconds
- Error messages: network error, overloaded (30s retry), 401 clears key + opens ApiKeyModal, other errors show the message from `json.error.message`

### Task 7 — Error boundaries
- Added `ErrorBoundary` class component (same pattern as Wellness Tracker, dark theme)
- Wraps each of the 5 main tabs: Daily Focus, Pipeline, Contacts, AI Tools, Resources
- Shows error message + "Try again" button without crashing the whole app

### Task 8 — Backup restore UI
- Added `restoreData()` function: opens a file picker, parses JSON, validates `{ applications: [] }` shape, `window.confirm()` guard, then writes to localStorage and reloads
- Restore button added next to backup button in Resources tab → Data Backup section
- Button styled in secondary (dark) style to visually distinguish from the backup action

## v7 — Data Backup
- Added 💾 Data Backup block to the Resources tab
- Chrome/Mac: first tap picks a folder (e.g. iCloud "Job Search Backups") — saves there automatically on future taps
- Safari/iPhone: falls back to standard file download
- Saves as job-search-backup-YYYY-MM-DD.json — one dated file per backup, nothing overwritten
- "Change backup folder" link to reset the saved destination
- BACKUP_FOLDER_KEY constant added at top of file (chase_job_search_backup_folder)

## v6 — Interview Prep
- Added 🎯 Prep button on pipeline cards in Phone Screen, Interview, and Final Round stages
- Clicking Prep opens a modal that generates 5 interview questions with talking points
  - Behavioral (STAR format), role-specific/technical sales, company fit, and compensation question types
  - Talking points anchored to real Authorize.Net experience, 98% resolution rate, KPI overachievement
  - If JD is saved on the card, questions are tailored to that specific role
  - If no JD saved, generates based on role title + Chase's background with a warning shown
- Results saved to app.prepNotes — persists in localStorage, viewable anytime without regenerating
- "✓ Interview prep saved" indicator appears on card after first generation
- Regenerate button available inside modal after first generation
- Uses maxTokens: 1500 for full 5-question output

## v5 — 2026-03-23
- Connected to Wellness Tracker (chase_wellness_v1 integration)
  - Added logSessionToWellness() — writes job search session to wellness growthLogs
  - "✓ Done + Log to Wellness" button on every Daily Focus block
  - Minutes auto-estimated per block type (apply=40, research=20, network=20, followup=15, skills=25)
  - Green toast confirmation after logging: "✓ Session logged to Wellness Tracker"
  - WELLNESS_KEY constant references chase_wellness_v1 — must never change
- Added ← Wellness back-link in header pointing to wellnes-tracker.vercel.app

## v4 — 2026-03-23
- Deployed to Vercel at job-search-hq.vercel.app
- Added vercel.json for cache busting
- Added public/index.html with no-cache meta tags and PWA meta tags
- Git repo created at github.com/iamchasewhittaker/job-search-hq

## v3 — 2026-03-23
- Added Daily Focus tab (🎯) with 5 ADHD-friendly work blocks
  - Research block (20 min), Application block (30-45 min), Networking block (15-20 min)
  - Follow-up block (15 min), Skill building block (20-30 min)
  - Each block has step-by-step guide + ADHD tip + Mark done toggle
  - Weekly rhythm grid (Mon-Sun)
- Added Resources tab (📚)
  - Certifications: Asana Academy, HubSpot, Google PM Certificate, Jira, Salesforce Trailhead
  - LinkedIn quick wins: Open to Work, About section update
  - Job search ground rules (cap active apps, follow up at 7 days, lead with Authorize.Net, etc.)

## v2 — 2026-03-23
- Added AI Tools tab (✨) with 5 sub-tabs
  - Tailor Resume: PM track (Implementation/CS) and AE track (inbound Account Executive)
  - Cover Letter: 3-paragraph, human-sounding, anchored to Authorize.Net results
  - Apply Kit: one-click tailored resume + cover letter from saved application
  - Find Jobs: web search via Claude API + web_search_20250305 tool
  - LinkedIn: headline + About rewrite, keyword optimizer, connection request, follow-up message
- PM/AE resume type toggle persists across sub-tabs
- Quick-fill JD from saved applications
- Anti-AI writing rules baked into all prompts (no buzzwords, plain verbs only)
- CHASE_CONTEXT and RESUME_TEMPLATE_PM / RESUME_TEMPLATE_AE constants

## v1 — 2026-03-23
- Initial build
- Pipeline tab: application cards with stage badges, stage summary bar, archived collapse
  - Stages: Interested, Applied, Phone Screen, Interview, Final Round, Offer, Rejected, Withdrawn
  - Per-card: company, role, applied date, next step, linked contacts, Apply Kit shortcut
- Contacts tab: recruiter/HM cards linked to applications by appIds array
- Master profile modal: name, email, phone, LinkedIn, location, target roles/industries, achievements, salary target
- Base resume stored in localStorage (two templates: PM track and AE track)
- Anthropic API key stored separately in chase_anthropic_key
- Storage key: chase_job_search_v1
- Dark theme locked
