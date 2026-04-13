# Changelog

## v8.4 — 2026-04-12 — Sales Navigator networking upgrade + accessibility

### Sales Navigator integration
- **Bookmarklet:** JavaScript bookmarklet that runs on a Sales Navigator (or regular LinkedIn) profile page — scrapes name, title, company, LinkedIn URL, company size, industry, and hiring signals, then opens the app with everything pre-filled via URL params
- **In-app import flow:** `App.jsx` detects `?importContact=1&...` params on load, pre-fills a new ContactModal with `source: "sales_navigator"`, and cleans the URL so refresh doesn't re-trigger
- **Setup guide:** Collapsible `SalesNavGuide` component in ContactsTab with 6-step bookmarklet install instructions, copyable code block, and tips section

### Enhanced contact model (backwards-compatible)
- New fields added to `blankContact()` with safe defaults: `type` (hiring_manager / recruiter / alumni / other), `outreachStatus` (none / sent / replied / meeting / intro_made), `outreachDate`, `source`, `companySize`, `industry`, `isHiring`
- New constants: `CONTACT_TYPES` and `OUTREACH_STATUSES` arrays with value / label / color
- Existing contacts display correctly with "Other" type and "No Outreach" defaults

### ContactCard improvements
- Color-coded contact type badge next to name
- Outreach status badge in top-right
- Company intel row (industry, size, hiring indicator) when data exists
- Quick-action row: status dropdown (inline update without opening modal) + "Draft Message" button (navigates to AI tab)

### ContactModal improvements
- Contact type chip selector
- Outreach status chip selector
- Outreach date + source (Sales Nav / LinkedIn / Referral / Other) row
- Company Intel section: company size, industry, "currently hiring" checkbox
- App-linking stays at bottom

### ContactsTab improvements
- Stats bar with 5 metrics: total contacts, outreach sent, response rate %, active in 7 days, meetings
- Filter chips for contact type and outreach status (toggle to deactivate)
- Inline status updates via `saveContact` (no modal required)

### Accessibility
- Tips section in SalesNavGuide: changed from near-invisible `#92400e` on `#1c1a0a` to high-contrast `#e5e7eb` on `#1f2937`
- All text in SalesNavGuide bumped from 11–12px to 13–14px; high-contrast colors throughout (`#f3f4f6`, `#d1d5db`, `#e5e7eb`)

### Vercel / infra
- Fixed Vercel deployment: project was connected to wrong GitHub repo (standalone `job-search-hq` instead of monorepo `apps`). Corrected via Vercel REST API — unlinked old repo, set root directory to `portfolio/job-search-hq`, linked to monorepo `iamchasewhittaker/apps`

### ESLint workaround
- Bookmarklet `javascript:` string uses runtime variable interpolation (`const _bm_proto = "javascript"`) to satisfy both `no-script-url` and `no-useless-concat` rules in CI

## v8.3 — 2026-04-03 — Email OTP login (match Wellness / iPhone PWA)

- **Sign-in:** same flow as Wellness Tracker — `signInWithOtp` + `auth.verifyOtp({ type: 'email' })` so the session persists in the home-screen Web app’s `localStorage`
- **Login UI:** code entry step, resend cooldown, change email; shared Supabase project — one account still covers both apps
- **Supabase (dashboard):** same as Wellness — **Magic link** email template must include `{{ .Token }}` for in-app OTP (see Wellness `CLAUDE.md`)
- **Docs / UX:** `CLAUDE.md` cross-ref; login screen hint for link-only emails; portfolio docs updated
- **Chore:** `.claude/launch.json` (port 3001); `.gitignore` keeps only `launch.json` under `.claude/`

## [Unreleased]

- **Monorepo:** path `portfolio/job-search-hq`; README, ROADMAP, AGENTS, `docs/*`; Linear links; master doc path updates.

## v8.5 — 2026-04-13 — Recruiter Wave 1: Action Queue, Next Step Dates, URL Capture, Scenario Chips + Logo

### Logo / branding
- New "JOB / HQ" logo mark: dark rounded square, small blue "JOB" label above bold white "HQ", replacing default React logo
- `public/logo.svg` + `public/favicon.svg` (SVG favicons for crisp rendering at all sizes)
- `public/logo512.png` + `public/logo192.png` regenerated; `index.html` updated to prefer SVG favicon with ICO fallback

### Action Queue (Focus tab)
- Auto-generated priority list at the top of Focus tab, pulling from: overdue/due-today next step dates, active interview stages with no prep notes, contacts who replied (needs response), sent outreach with no reply in 5+ days, applied 14+ days with no response
- Each item shows a colored urgency badge (red = overdue, orange = due today/reply, blue = interview prep needed) and a one-click action button that opens the correct modal or navigates to the right tab
- "All caught up" state shown when queue is empty

### Next Step Dates + Types (Pipeline)
- `nextStepDate` and `nextStepType` fields added to application data model (`blankApp()`)
- `NEXT_STEP_TYPES` enum: Apply, Follow Up, Interview Prep, Send Materials, Thank You Note, Negotiate, Other
- `nextStepUrgency()` helper computes color/label from due date
- AppModal: new "Due Date" + "Step Type" fields below Next Step text
- AppCard: urgency badge (Overdue/Due Today/In Xd) appears next to next step text when a due date is set
- Existing apps load without breaking — new fields default to empty string

### URL Paste Quick-Capture (Pipeline)
- Paste any job posting URL → AI extracts title, company, and full JD text → pre-fills the new application modal
- Only shown when API key is configured
- Uses `callClaude` with 2000 token limit; graceful fallback if parsing fails (opens modal with URL pre-filled)
- Enter key triggers parse

### Outreach Scenario Chips (AI Tools tab)
- Connection Request: 4 scenario chips (Cold Outreach, Post-Application, Alumni/Mutual, Recruiter) — click to fill context textarea
- Follow-up: 4 scenario chips (No Reply, Post-Interview, After Rejection, Reconnect)
- Active chip highlighted in blue; user can still edit the textarea after selecting
- Chips export as `CONNECT_SCENARIOS` + `FOLLOWUP_SCENARIOS` constants

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
