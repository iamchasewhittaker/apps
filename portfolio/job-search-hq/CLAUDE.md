# Job Search HQ — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

**Project tracking:** [Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)

## App Identity
- **Version:** v8.5 (Wave 2 complete; Wave 3 #1 Chrome extension shipped)
- **Storage key:** `chase_job_search_v1` (data) · `chase_anthropic_key` (API key — separate)
- **URL:** job-search-hq.vercel.app
- **Entry:** `src/App.jsx`
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — palette, typography, component patterns; do not restate in session prompts.

> *"For Reese. For Buzz. Forward — no excuses."*

## File Structure
```
.claude/
  launch.json      ← Claude Code dev registry (port 3001; other `.claude/*` gitignored)
extension/         ← Chrome MV3 MVP: LinkedIn capture + HQ badge (see extension/README.md)
src/
  App.jsx          ← shell (~280 lines): state, load/save, helpers, modals, nav
  constants.js     ← ALL data/config/styles — no React (import from here first)
  ErrorBoundary.jsx
  tabs/
    FocusTab.jsx       ← daily focus blocks + weekly rhythm
    PipelineTab.jsx    ← application pipeline + stage bar
    ContactsTab.jsx    ← contacts list
    AITab.jsx          ← all AI tools: resume, cover, kit, jobs, LinkedIn (~636 lines)
    ResourcesTab.jsx   ← resources grid + backup/restore
  components/
    Field.jsx          ← generic form field (text/textarea/select/date)
    AIResult.jsx       ← result display box with copy button
    ApiKeyModal.jsx    ← Anthropic API key entry
    AppCard.jsx        ← pipeline application card
    AppModal.jsx       ← add/edit application modal
    ContactCard.jsx    ← contact display card
    ContactModal.jsx   ← add/edit contact modal
    ProfileModal.jsx   ← master profile + base resume editor
    PrepModal.jsx      ← interview prep generator modal
```

## What Lives Where

### `constants.js` — import from here, don't duplicate
- `STORAGE_KEY`, `API_KEY_STORAGE`, `BACKUP_FOLDER_KEY`
- `STAGES`, `STAGE_COLORS`
- `CHASE_CONTEXT`, `JOB_SEARCH_QUERIES`
- `RESUME_TEMPLATE_PM`, `RESUME_TEMPLATE_AE`
- `defaultData`, `generateId`, `getApiKey`, `callClaude`
- `blankApp()`, `blankContact()`, `blankStarStory()`, `normalizeStarStories()`, `blankPrepSections()`, `normalizePrepSections()`
- `buildOutreachPriorityList()`, `getOutreachCadenceNudge()`, `getOutcomeAnalytics()`
- `DAILY_BLOCKS`, `RESOURCES`
- `s` (all styles), `css` (global CSS string)
- `backupData()`, `restoreData()`

### `App.jsx` — shell only
Owns: `data`, `tab`, `apiKey`, `showApiKeyModal`, `appModal`, `contactModal`, `profileModal`, `prepModal`, `kitApp`, `resumeTab`, `expandedBlock`, `completedBlocks`, `errorToast`

Functions: `saveApp`, `deleteApp`, `saveContact`, `deleteContact`, `saveProfile`, `saveApiKey`, `showError`, `handleClaudeCall`, `runInterviewPrep`, `profileContext`, `saveStarStories`

**URL / hash imports (Chrome extension):** After Supabase session + `hasLoaded`, consumes `?importContact=1`, `?importJob=1`, or `#importJob=<encodeURIComponent(JSON)>` once (`importUrlConsumed` ref) so modals open only when logged in.

### `AITab.jsx` — owns all its AI state locally
Owns all loading/result state (resumeType, jd, resumeResult, coverResult, loadingResume, all LinkedIn state, etc.)
Receives from shell: `data`, `apiKey`, `hasApiKey`, `profileComplete`, `kitApp`, `setKitApp`, `resumeTab`, `setResumeTab`, `setTab`, `saveApp`, `saveStarStories`, `showError`, `setShowApiKeyModal`, `setProfileModal`

## Data Shape
```js
{
  applications: [{
    id, company, title, stage, appliedDate, url,
    nextStep, nextStepDate, nextStepType, // next-step scheduling (v8.5)
    jobDescription, notes,
    prepNotes,   // legacy string; hydrated from prepSections where needed
    prepSections // structured interview prep (companyResearch, roleAnalysis, starStories, questionsToAsk)
  }],
  contacts: [{
    id, name, company, role, email, linkedin, lastContact, notes, appIds,
    type, outreachStatus, outreachDate, source, companySize, industry, isHiring // networking (v8.4+)
  }],
  starStories: [{ id, title, competency, situation, task, action, result, takeaway }], // STAR bank (Wave 2 #5)
  baseResume: "...",
  profile: { name, email, phone, linkedin, location, targetRoles, targetIndustries, yearsExp, topAchievements, salaryTarget, notes }
}
```

## Key Behaviours to Preserve
- API key stored separately under `chase_anthropic_key`, never in the main data blob
- API key migration: if old data has `parsed.apiKey`, move it to separate key on load
- `handleClaudeCall` in App.jsx covers `runInterviewPrep` (called by PrepModal)
- `handleClaudeCall` in AITab covers all AI tool calls (local copy — same logic)
- `kitApp` + `resumeTab` live in App shell because Pipeline sets them when navigating to AI tab
- `completedBlocks` resets on page reload (intentional — daily tracker)
- Optional **Chrome extension** (`extension/`) opens HQ with import query params; app defers handling until auth is ready (see `extension/README.md`)

## Claude API Usage
```js
import { callClaude, getApiKey } from './constants';
// callClaude(systemPrompt, userMessage, maxTokens=1000) → string
// Always wrap in handleClaudeCall for error handling
```
Model: `claude-sonnet-4-20250514` (hardcoded in constants.js — update when upgrading)

## Supabase Sync — LIVE ✅ (wired in v8.1; email OTP auth in v8.3)

Sync is fully wired. Files involved:
- `src/sync.js` — calls `createSync()` with `process.env.REACT_APP_*` vars, exports `push`, `pull`, `auth`, `APP_KEY = 'job-search'`
- `src/shared/sync.js` — real file copy of `/portfolio/shared/sync.js` (NOT a symlink — symlinks break on Vercel when only the app repo is cloned)
- `src/App.jsx` — auth gate (email OTP + `verifyOtp` LoginScreen), `pull()` in load useEffect, `push()` in save useEffect, `_syncAt` stamped on every save
- `.env` — `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` (not committed)
- `.env.example` — template (committed)

**NOTE:** This is Create React App, NOT Vite. Env vars use `REACT_APP_` prefix and `process.env.*` (not `VITE_` / `import.meta.env`).

**Same Supabase project as Wellness Tracker.** Data is separated by `app_key = 'job-search'` in the shared `user_data` table.

**Auth flow:** Same passwordless email flow as Wellness — enter the **code** from the sign-in email (`verifyOtp` with `type: 'email'`) so the session persists on iPhone home-screen PWA; magic link in email still works in Safari. `auth.onAuthStateChange()` handles PKCE redirect when URL contains `code=` or `access_token`.

**Email template (required — codes are not sent by default):** Edit **Authentication → Email Templates → Magic link** in the Supabase dashboard and include `{{ .Token }}` in the body (same shared project as Wellness). Keep `{{ .ConfirmationURL }}` for link-based sign-in. See Wellness `CLAUDE.md` or [Supabase OTP docs](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp).

**Sync flow:** On load → `pull()` checks if remote is newer than `_syncAt`, re-hydrates if so. On save → `_syncAt: Date.now()` stamped, then `push()` fires in background after localStorage write.

**Fallback:** If `.env` is missing or incomplete, `createSync()` returns no-op stubs and the app runs in localStorage-only mode (no crash).

**Important:** The Anthropic API key (`chase_anthropic_key`) is stored in localStorage only and is never included in the synced data blob.

## Pending Work (from ROADMAP)
- Wave 3 #2+: stage-specific prep templates, deeper interview tooling — see `ROADMAP.md`
- AITab is large — could split into sub-components per tool if it grows further

## CI (GitHub Actions)
This app is built by **`.github/workflows/portfolio-web-build.yml`** on **Node 20** (`npm ci` then `npm run build`). Keep **`package-lock.json`** in sync with `package.json` using **Node 20’s npm** — see repo root **[`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`](../../docs/templates/SESSION_START_FIX_CI_LOCKFILES.md)**.

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
