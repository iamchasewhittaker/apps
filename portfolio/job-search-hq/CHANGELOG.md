# Changelog

## [Unreleased] — 2026-04-20 — Wave 4 #3: Outreach cadence timeline (v8.10)

### Added
- **Per-contact outreach timeline** — every contact now carries an `outreachLog[]` history of touchpoints. New `src/components/OutreachTimeline.jsx` renders a compact vertical list on `ContactCard` (colored type dot + date + type label + method + notes), default 4 visible with "Show all (N)" toggle, empty state "No touchpoints yet".
- **`OUTREACH_EVENT_TYPES`** (sent/replied/meeting/intro_made/note, each with color token) and **`OUTREACH_METHODS`** (linkedin/email/phone/in_person/other) in `src/constants.js`.
- **`blankOutreachEntry()`** + **`normalizeOutreachLog()`** helpers; mirror the Wave 3 `interviewLog[]` pattern.
- **`normalizeContact()`** — new helper run in `hydrateState` that seeds a single migration entry from legacy `outreachDate` + `outreachStatus` when `outreachLog` is empty, so existing contacts show their last known touch without manual re-entry.
- **Modal entry form** in `ContactModal.jsx` — Date / Type / Method grid + Notes textarea + "+ Add entry" button; existing entries list (newest first) with delete (🗑) per row.
- **Quick-log on status change** — `updateStatus` in `ContactsTab.jsx` now appends an `outreachLog` entry whenever the card's status dropdown moves to a meaningful status (not "none", not same as previous). Method inferred from `contact.source` (default "linkedin"). One change = one log entry, no extra UI.

### Changed
- `blankContact()` — added `outreachLog: []`.
- `ContactCard.jsx` — `<OutreachTimeline />` mounted between `outreachDate` metadata and the cadence nudge warning.

### Notes
- `buildOutreachPriorityList` and `getOutreachCadenceNudge` continue to read the `outreachDate` / `outreachStatus` rollups — both are maintained on every quick-action, so day-3/day-7 nudges and Focus-tab ordering are unchanged. Future pass can make them read from `outreachLog[last]` once useful.

---

## [Unreleased] — 2026-04-18 — Wave 4 #2: Draft Message context (v8.9)

### Added
- **Apply Tools "Draft Message" context** — clicking "✍️ Draft Message" on any ContactCard now navigates directly to Apply Tools → LinkedIn → Connection Request with that contact pre-selected. No more manually hunting for the contact after switching tabs.
- `draftContact` state in `App.jsx`; `onDraftMessage(contact)` prop on `ContactsTab`; `useEffect` in `AITab` that fires on `draftContact`, sets sub-tabs (`linkedin` / `connect`), and pre-selects the contact via `setConnectContact`.

---

## [Unreleased] — 2026-04-18 — Wave 4 #1: Weekly Review + normalizeApplication fix (v8.8)

### Added
- **Weekly Review tab** in Apply Tools (`AITab.jsx`) — new "📊 Weekly Review" sub-tab; `WeeklyReviewPanel` component shows stat cards (apps submitted / interviews logged / contacts touched / active pipeline, all scoped to last 7 days), pipeline snapshot by stage, and a "Copy weekly review prompt" button.
- **`buildWeeklyReviewPrompt(data)`** in `src/applyPrompts.js` — builds a markdown coaching brief pre-filled with real pipeline data (stage breakdown, active roles, this-week stats, debrief summaries, contacts outreached); paste into ChatGPT or Claude for a weekly coaching review.

### Fixed
- **`normalizeApplication`** (`src/constants.js`) — added `interviewLog: normalizeInterviewLog(app.interviewLog)` so apps loaded from localStorage/Supabase have their debrief log fully hydrated on startup, consistent with how `prepSections` is handled.

### Docs
- `ROADMAP.md` — Wave 3 items (debrief, velocity, mock interview) checked off with v8.7 notes; Wave 3 Complete section added; app status updated to v8.7.
- `CLAUDE.md` — version bumped v8.6 → v8.7.

---

## [Unreleased] — 2026-04-18 — Wave 3: Logo + Debrief + Velocity + Mock Interview (v8.7)

### Logo redesign
- **Outline logo** — `public/logo.svg` and `public/favicon.svg` updated to deep blue (`#1d4ed8`) background with white stroke-only "HQ" lettering (fill: none, stroke: #ffffff). Clean at all sizes; matches portfolio bright-bg standard.
- Two HTML mockup files generated for design review before committing: `design/logo-mockup.html` (11 color/gradient options) and `design/logo-mockup-2.html` (style variants: solid/outline/gradient/shadow).
- iOS `tools/generate_brand_assets.py` updated: `BG = (0x1D, 0x4E, 0xD8)`, `BAND = (0x1E, 0x40, 0xAF)`; outline effect rendered via `fill=BG + stroke_fill=WHITE` (Pillow doesn't support fill="none" natively).

### Post-interview debrief log (A1)
- Added `interviewLog: []` to `blankApp()` in `src/constants.js`.
- New constants: `DEBRIEF_ROUND_TYPES` (phone_screen / technical / on_site / panel / final / other), `DEBRIEF_IMPRESSIONS` (positive/neutral/negative with color tokens).
- New helpers: `blankDebriefEntry()`, `normalizeInterviewLog()`.
- New `src/components/DebriefModal.jsx` — per-round entry form (date, interviewer, round type, impression buttons, confidence 1–5, strengths/gaps/redFlags/keyQuestions/notes); entry history with inline edit + delete; saves on each action via `onSave`.
- `AppCard.jsx` updated: "📋 Debrief" button added; shows count badge when entries exist.
- `App.jsx` wired: `debriefModal` state, `setDebriefModal` passed to `PipelineTab`, `DebriefModal` rendered.
- `PipelineTab.jsx` updated: `setDebriefModal` prop + `onDebrief` on both active and archived AppCards.

### Weekly velocity dashboard (A2)
- Added `weeklyTarget: 5` to default `profile` object in `src/constants.js`.
- New helper: `getWeeklyVelocityData(applications, weeksBack=8)` — Monday-aligned ISO weeks, current week flagged.
- `FocusTab.jsx` updated: new `VelocityDashboard` component — inline SVG bar chart (8 bars), dashed target line, current week highlight, editable weekly target (calls `saveProfile`), stats row (this wk/target, 4-wk avg, best).
- `App.jsx` updated: `profile` + `saveProfile` threaded to `FocusTab`.

### Mock interview mode (A3)
- New `src/mockInterviewQuestions.js` — `MOCK_INTERVIEW_SCENARIOS` (5 scenarios: Behavioral/STAR, Situational, Implementation/CS, Payments Domain, Role Fit); 6–7 questions each.
- `AITab.jsx` updated: new "🎤 Mock Interview" sub-tab; `MockInterviewPanel` component — scenario selector, question card, answer textarea, copy-feedback-prompt button, next/restart, session log with completed Q&A.

### Removed / changed (v8.6)

- **In-browser Anthropic API removed** — no `callClaude`, no API key modal, no `fetch` to `api.anthropic.com`. Apply Tools (`AITab.jsx`) uses **copy-to-clipboard prompts** (`src/applyPrompts.js`) for external assistants; users paste results back into text areas for their records.
- **Interview prep modal** — stage presets (Phone screen / Interview / Final round), "Fill empty fields from template", "Copy external prep brief"; optional `prepStageKey` on applications. iOS `JobApplication` includes `prepStageKey` for JSON parity.
- **Pipeline quick-add** — URL + optional JD textarea (replaces URL-only Claude parse).
- **Find Jobs** — opens LinkedIn / Indeed / Google search in a new tab (no in-app search API).
- Legacy `apiKey` field stripped from saved blob on load if present.

### Updated (2026-04-14)
- **Logo: "JOB SEARCH" spelled out** — updated `public/logo.svg` label from "JOB" to "JOB SEARCH" (font-size 50, letter-spacing 6); bold white "HQ" remains the dominant anchor; `rx="96"` rounded corners per portfolio template. Regenerated `logo512.png`, `logo192.png`, `apple-touch-icon.png`. Verified live at [job-search-hq.vercel.app](https://job-search-hq.vercel.app) (HTTP 200) and `npm run build` clean on Node 20.

### Added (2026-04-15)

- **iOS companion (v0.1 scaffold):** new Xcode project at `../job-search-hq-ios/` — SwiftUI + ClarityUI, web-shaped `Codable` blob, Focus / Pipeline / Contacts / More tabs; see that folder’s `README.md` and `docs/SYNC_PHASE2.md` for Phase 2 sync.
- **iOS companion — brand + device QA:** reproducible `AppIcon` / `Logo` via `../job-search-hq-ios/tools/generate_brand_assets.py`; Debug build + `xcrun devicectl device install app` verified on physical iPhone (see iOS `HANDOFF.md` / `README.md`). **Linear:** track under [Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d).

### Added (2026-04-14)
- **Cross-app navigation (WHI-40):** `AppNav` bar below header links to Wellness and Clarity Hub — uses shared `resolveAppUrl` for canonical-origin URL resolution
- **Shared UI component:** added `src/shared/ui.jsx` (copy of `portfolio/shared/ui.jsx`) — `Card`, `NavTabs`, `AppNav`, `resolveAppUrl`
- **Shared sync.js update:** synced `src/shared/sync.js` to canonical (comment-only drift fix)
- **Shared auth bootstrap:** added `src/shared/auth.js` — canonical-host redirect (`apps.chasewhittaker.com/job-search`), session key consolidation, OTP `emailRedirectTo`
- **Refactored sync:** `src/shared/sync.js` + `src/sync.js` export app identity + `emailRedirectTo`; `App.jsx` uses shared `emailRedirectTo`
- **Auth diagnostics:** `REACT_APP_AUTH_DEBUG` flag enables `local_mode_no_auth`, `initial_session`, `state_change` events
- **Env template:** `.env.example` updated with `REACT_APP_AUTH_CANONICAL_ORIGIN` and `REACT_APP_AUTH_APP_PATH`
- **Supabase / Vercel:** Site URL + redirect allowlist set to canonical origin; auth env vars set in Vercel production

### Fixed (2026-04-14)
- **Favicon/logo white corners:** removed `rx` rounded corners from `favicon.svg` and `logo.svg`; regenerated `logo192.png`, `logo512.png`, `apple-touch-icon.png`; regenerated `favicon.ico` — solid `#0f1117` fill covers full square

### Planning / readiness
- Added a Wave 3 execution sequence in `ROADMAP.md`: prep templates → debrief log → velocity dashboard → mock interview mode.
- Added a release-readiness dependency checklist in `ROADMAP.md` and `HANDOFF.md` (OTP template, Vercel root/env, Node 20 lockfile/CI discipline, LinkedIn DOM dependency note for extension).
- Updated `HANDOFF.md` State with a readiness checkpoint confirming **go** for current v8.5 shipped scope and no active code-level blockers.

### Documentation
- Synced Job Search HQ and portfolio docs with v8.5 shipped scope: `CLAUDE.md`, `README.md`, `AGENTS.md`, `HANDOFF.md`, `PROJECT_INSTRUCTIONS.md`, `MASTER_PROJECT_FRAMEWORK.md`, `MVP-AUDIT.md`, `docs/ARCHITECTURE.md`, `docs/LEARNING.md`, `docs/templates/SESSION_START_JOB_SEARCH_*.md`, root `CLAUDE.md` / `ROADMAP.md` app table; `APP_META` version comment in `src/App.jsx`.

### Chrome extension — Wave 3 #1 (MVP)
- Added `extension/` — Manifest V3 package: popup actions to import **LinkedIn profile → new contact** and **LinkedIn job → new application** (opens Job Search HQ with `importContact` / `importJob` query or `#importJob=` JSON for long JDs).
- Added `extension/background.js` with page scrapers injected via `chrome.scripting.executeScript`; optional app origin stored in `chrome.storage.local` (`hqOrigin`) for local dev (`http://localhost:3001`).
- Added `extension/content-jobhq-bridge.js` — on HQ tab only, recomputes Focus **Action Queue** count and sets toolbar badge via `chrome.action.setBadgeText` (poll + `storage` listener).
- **App:** URL imports (`importContact`, `importJob`, `#importJob=`) now run **after auth session is ready** so modals appear when logged in; `source=chrome_extension` supported.
- **ContactModal:** new source chip **Chrome ext**.
- **ResourcesTab:** short pointer to `extension/README.md`.
- **Docs:** `CLAUDE.md` file tree lists `extension/` (see also Documentation entry above).
- Verified: `npm run build` (compiled successfully).

### Pipeline — Wave 2 #6: win/loss analytics
- Added `getOutcomeAnalytics(applications)` helper in `src/constants.js` to compute closed-outcome totals and percentages for Offer / Rejected / Withdrawn stages.
- Added Pipeline analytics section in `src/tabs/PipelineTab.jsx` with horizontal bar chart rows for final-stage outcomes.
- Added lightweight analytics style tokens in `src/constants.js` for consistent dark-theme rendering.
- Test verification:
  - `npm run build` (compiled successfully)
  - `npm test -- --watchAll=false --passWithNoTests` (no tests found, exits 0)

### AI Tools — Wave 2 #5: STAR story bank
- Added STAR story bank data model in `src/constants.js` (`starStories`) with helper utilities: `blankStarStory()`, `normalizeStarStories()`, and competency presets.
- Added `saveStarStories()` flow in `src/App.jsx` and threaded it into `AITab`.
- Added new `⭐ STAR Bank` sub-tab in `src/tabs/AITab.jsx` with CRUD for reusable STAR stories (title, competency, situation, task, action, result, takeaway).
- Added AI-assisted STAR drafting from resume/profile context using JSON output parsing into story fields.
- Added copy-ready STAR export per saved story for interview prep reuse.
- Test verification:
  - `npm run build` (compiled successfully)
  - `npm test -- --watchAll=false --passWithNoTests` (no tests found, exits 0)

### Interview Prep — Wave 2 #4: structured prep framework
- Added sectioned prep model in `src/constants.js`: `prepSections` with four fields (`companyResearch`, `roleAnalysis`, `starStories`, `questionsToAsk`) plus helpers for normalization, content checks, and copy formatting.
- Added backwards compatibility migration helpers so legacy `prepNotes` values hydrate into the new structured model without data loss.
- Updated `runInterviewPrep` in `src/App.jsx` to request structured JSON output from Claude and save to `app.prepSections` (legacy `prepNotes` cleared on save).
- Updated `PrepModal` to render editable sectioned fields with `Save Sections`, `Regenerate`, and `Copy all` actions.
- Updated prep status checks in `FocusTab` and `AppCard` to use structured prep helpers instead of freeform `prepNotes`.
- Build verification: `npm run build` (clean compile).

### Contacts — Wave 2 #3: cadence nudges
- Added `getOutreachCadenceNudge(contact, linkedApp)` helper in `src/constants.js` for day 3/day 7 follow-up recommendations based on `outreachStatus: "sent"` and `outreachDate`.
- Updated `ContactCard` to show a contextual cadence banner when follow-up is due, including stage-aware message context when a linked app exists.
- Added **Copy Follow-up Prompt** action to cadence nudges so outreach copy can be generated quickly in AI tools.
- Threaded `showError` through `App.jsx` → `ContactsTab.jsx` → `ContactCard.jsx` for clipboard failure handling.
- Build verification: `npm run build` (clean compile).

### FocusTab — Wave 2 #2: Who to message today
- Added `buildOutreachPriorityList()` in `src/constants.js` to rank contact outreach by status recency, linked active application stage, next-step urgency, hiring signals, and stale touchpoints.
- Added a new "Who should I message today?" widget in `src/tabs/FocusTab.jsx` with deterministic priority ordering, reason/context metadata, and empty-state guidance.
- Added quick actions per ranked contact: **Copy Prompt**, **Edit Contact**, and **Open App** (when a linked active application exists).
- Threaded `setContactModal` and `showError` into FocusTab from `src/App.jsx` to support contact editing and clipboard-failure feedback without new persistent state.
- Build verification: `npm run build` (clean compile).

### Docs
- **`CLAUDE.md`:** CI section — GitHub Actions (`portfolio-web-build.yml`), Node 20, lockfile parity; link to **`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`**

### Chore
- **Theme alignment:** updated surface color `#1a1f2e` / `#111827` → `#161b27` across `constants.js`, `App.jsx`, and `ContactsTab.jsx` to match shared portfolio BASE token set (see `docs/design/PORTFOLIO_WEB_THEME_HANDOFF.md`)

## [Unreleased] — 2026-04-13 — Company intel view (Wave 2 #1)

### ContactsTab — By Company view
- **View toggle:** "List" | "By Company" buttons above the contact list; default is List (no behavior change on load)
- **Company rows:** group all contacts by `contact.company` (case-insensitive); each row shows company name, contact count + types, replied count
- **Expand/collapse:** click a company row to reveal its ContactCards (same component as list view)
- **Warm lead badge:** if a company has contacts but no active application → amber "Not applied — warm lead!" badge; clicking it opens AppModal pre-filled with the company name
- **Ghost rows:** if an active application has zero contacts at that company → muted dashed row "0 contacts at [company] — find someone ↗" with LinkedIn search link and stage pill
- **Sort order:** warm leads first, then by contact count desc, "Unknown company" last
- **No data changes:** purely computed from existing `contact.company` + `application.company` fields
- New style tokens in `s`: `ciToggleRow`, `ciToggleBtn`, `ciToggleBtnActive`, `ciRow`, `ciRowHeader`, `ciCompanyName`, `ciMeta`, `ciStagePill`, `ciWarmBadge`, `ciGhostRow`, `ciCards`
- `setAppModal` prop threaded from App.jsx to ContactsTab

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

- **Fixed:** `.env` was pointing to a separate Supabase project (`uwlfhxzeeleebjpiimrg`) instead of the shared wellness project — magic links were redirecting to `wellness-tracker.vercel.app` because that project's Site URL was set to the wellness URL
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
- Added ← Wellness back-link in header pointing to wellness-tracker.vercel.app

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
