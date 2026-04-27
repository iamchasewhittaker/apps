# Job Search HQ — Project Instructions

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

**Project tracking:** [Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) — includes **iOS companion** milestones (`../job-search-hq-ios/`); update Linear when iOS ships user-visible slices.

## App Identity
- **Version:** v8.18 (Gmail Inbox Feed: Focus-tab `InboxPanel` between `MorningLaunchpad` and `TargetCompanyBoard`. Browser Gmail OAuth via Google Identity Services popup (`src/inbox/oauth.js`) → server-side token exchange in `api/gmail/exchange.js` (refresh token AES-256-GCM-encrypted, stored in a separate Supabase row `app_key='job-search:gmail'` — never localStorage). Browser fetches `gmail.googleapis.com` directly with the access token. `src/inbox/classifier.js` buckets messages into recruiter / ats_update / interview_invite / linkedin / other via regex + sender-domain rules; recruiter branch delegates to existing `parseRecruiterEmail`. Review-first queue with one-click Save Contact + App / Bump stage / Set interview + open prep / Dismiss / Snooze 24h. Auto-logs wins on actioned recruiter pings + interview invites. Read-only — replies stay in Gmail.) · v8.17 Daily Flow Option E (Morning Launchpad) · v8.16 Discovery Sprint + Apply Wizard · v8.15 TargetCompanyBoard · v8.14 Today's 5 queue + Outreach Autopilot · v8.13 Confidence Bedrock · Wave 4 #1–#6 all shipped · Wave 3 complete · Apply Tools = copy prompts + external assistants.
- **Storage key:** `chase_job_search_v1` (data) + Supabase `user_data` row `app_key='job-search:gmail'` (encrypted refresh token, server-only — not in localStorage)
- **URL:** https://job-search-hq.vercel.app
- **Entry:** `src/App.jsx`
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — palette, typography, component patterns; do not restate in session prompts.

> *"For Reese. For Buzz. Forward — no excuses."*

## What This App Is

An AI-assisted job search cockpit managing the full pipeline from application tracking to interview prep, with a contact CRM, STAR story bank, AI-powered drafting tools, and a Chrome MV3 extension for one-click LinkedIn capture. Everything needed to run a disciplined, high-output search lives in one app — pipeline stages, weekly review rhythm, prep templates, and job search queries.

## File Structure
```
.claude/
  launch.json      ← Claude Code dev registry (port 3001; other `.claude/*` gitignored)
api/               ← Vercel serverless functions (v8.18+; CRA + api/ deploys natively on Vercel)
  _lib/
    crypto.js      ← AES-256-GCM helpers (encrypt/decrypt refresh tokens)
    supabase.js    ← service-role server client + getUserFromAuthHeader (validates JWT) + read/write/delete helpers for the `app_key='job-search:gmail'` row
  gmail/
    exchange.js    ← POST /api/gmail/exchange — code → tokens, encrypt refresh, store in Supabase
    refresh.js     ← POST /api/gmail/refresh — read encrypted refresh, return new access token
    disconnect.js  ← POST /api/gmail/disconnect — revoke refresh + delete row
extension/         ← Chrome MV3 MVP: LinkedIn capture + HQ badge (see extension/README.md)
src/
  App.jsx          ← shell: state, load/save, helpers, modals, nav, inbox handlers
  applyPrompts.js  ← markdown prompts + PREP_STAGE_PRESETS (no network)
  constants.js     ← ALL data/config/styles — no React (import from here first)
  ErrorBoundary.jsx
  inbox/             ← Gmail Inbox Feed (v8.18)
    oauth.js         ← GIS popup loader, /api/gmail/exchange + /api/gmail/refresh client, in-memory access-token cache
    gmailClient.js   ← Gmail REST helpers (CORS-direct from browser); MIME walk + base64url decode
    classifier.js    ← classifyMessage({...}) → { kind, confidence, parsed }; ATS_SENDER_DOMAINS, LINKEDIN_DOMAINS, SCHEDULING_URL_PATTERNS
    syncInbox.js     ← runInboxSync({ existingInbox, labelName }) → { newItems, labelMissing }
  tabs/
    FocusTab.jsx       ← daily focus blocks + weekly rhythm; mounts <InboxPanel /> between MorningLaunchpad and TargetCompanyBoard
    PipelineTab.jsx    ← application pipeline + stage bar + URL/JD paste
    ContactsTab.jsx    ← contacts list
    AITab.jsx          ← Apply Tools: copy prompts, STAR bank, job search links
    ResourcesTab.jsx   ← resources grid + backup/restore
  components/
    Field.jsx          ← generic form field (text/textarea/select/date)
    AIResult.jsx       ← result display box with copy button
    AppCard.jsx        ← pipeline application card
    AppModal.jsx       ← add/edit application modal (now supports modal.onAfterSave callback)
    ContactCard.jsx    ← contact display card
    ContactModal.jsx   ← add/edit contact modal (now supports modal.onAfterSave callback)
    ProfileModal.jsx   ← master profile + base resume editor
    PrepModal.jsx      ← interview prep: stage templates + external prep brief copy
    InboxPanel.jsx     ← Gmail-derived notification feed; not-connected/connected/error/label-missing states
    InboxItem.jsx      ← single notification card; per-kind action buttons
```

## What Lives Where

### `constants.js` — import from here, don't duplicate
- `STORAGE_KEY`, `BACKUP_FOLDER_KEY`
- `STAGES`, `STAGE_COLORS`
- `CHASE_CONTEXT`, `JOB_SEARCH_QUERIES`
- `RESUME_TEMPLATE_IC` (IC/SE roles), `RESUME_TEMPLATE_AE` (AE roles — equal lane, not backup), `RESUME_TEMPLATE_PM` (legacy)
- `defaultData` (now includes `inbox: []`), `generateId`
- `blankApp()` (now includes `track: "IC"`), `blankContact()`, `blankStarStory()`, `normalizeStarStories()`, `blankPrepSections()`, `normalizePrepSections()`
- `blankWin()`, `normalizeWins()`, `WIN_TYPES`
- `INBOX_KINDS`, `INBOX_STATUSES`, `inboxKindMeta(kind)`, `normalizeInboxItems(items)`, `isInboxPending(item, now)`, `matchAppFromInboxItem(item, applications)` — Gmail Inbox Feed helpers (v8.18)
- `buildOutreachPriorityList()`, `getOutreachCadenceNudge()`, `getOutcomeAnalytics()`, `getDirectionSplit()`
- `DIRECTION`, `DIRECTION_TRACKS`, `STRENGTHS_SUMMARY`, `FRIEND_FEEDBACK`, `FRIEND_FEEDBACK_CONSENSUS`, `KASSIE_EXCERPTS`
- `LAYOFF_DATE`, `daysSinceLayoff()`, `DAILY_MINIMUMS`
- `getDailyDiscoveryQueries(now)`, `getLaunchpadProgress(applications, dailyActions, now)` — Daily Flow helpers (rotation + 3-stage launchpad state)
- `DAILY_BLOCKS`, `RESOURCES`
- `s` (all styles, now including 28 inbox tokens), `css` (global CSS string)
- `backupData()`, `restoreData()`

### Direction, Strengths & Voice — Confidence Bedrock layer
- **Single source of truth (identity):** `/Users/chase/Developer/chase/identity/direction.md` + `strengths/` + `friend-feedback.md` + `voice-brief.md` + `kassie-notes.md`. Don't duplicate content in this app — mirror it via `constants.js` exports.
- **Direction = Implementation Consultant / Sales Engineer OR Account Executive at payments-adjacent companies** (Stripe, Adyen, Checkout.com, Finix, Rainforest Pay, Spreedly, Fiserv, FIS, NMI, Worldpay, Braintree, Global Payments). Equal lanes (revised 2026-04-24 from original 2026-04-21). Dev-tools SE is the backup if both primary lanes go silent at week 10.
- **Voice rules (`applyPrompts.js` → `VOICE_DIRECTION_FOOTER`):** no em-dashes, no rule-of-threes, no hype, no consultant phrasing ("leverages", "unlocks", "compounds", "synergy"). Warm, direct, short sentences. Strengths show through (Harmony / Developer / Consistency / Context / Individualization) — never name-dropped. Footer is appended to every drafting prompt in `applyPrompts.js`.
- **Kassie urgency layer (FocusTab):** `UrgencyHeader` = "Day N since Visa" (reads `LAYOFF_DATE`), `DailyMinimums` (5 apps + 3 outreach + rest floor), `KassieCard` (rotates an excerpt from `KASSIE_EXCERPTS`, per-day dismissal via `chase_js_kassie_dismiss_v1`). These are non-negotiable operating doctrine, not decorations.
- **Wins Log:** `addWin`/`removeWin` in `App.jsx`; auto-log on stage progression and debrief entry in `saveApp`, on `outreachStatus → replied` in `saveContact`. `autoLogged: true` distinguishes them from manual entries.
- **Direction Tracker:** every app has `track: "IC" | "SE" | "AE" | "Other"` (default IC). `getDirectionSplit(applications)` powers the Focus tab card — market-feedback, not deliberation.

### `App.jsx` — shell only
Owns: `data`, `tab`, `appModal`, `contactModal`, `profileModal`, `prepModal`, `kitApp`, `resumeTab`, `expandedBlock`, `completedBlocks`, `errorToast`

Functions: `saveApp`, `deleteApp`, `saveContact`, `deleteContact`, `saveProfile`, `showError`, `saveStarStories`

**URL / hash imports (Chrome extension):** After Supabase session + `hasLoaded`, consumes `?importContact=1`, `?importJob=1`, or `#importJob=<encodeURIComponent(JSON)>` once (`importUrlConsumed` ref) so modals open only when logged in.

### `AITab.jsx` — Apply Tools (copy prompts only)
Owns local UI state (resumeType, jd, pasted results, LinkedIn fields, STAR bank, etc.)
Receives from shell: `data`, `profileComplete`, `kitApp`, `setKitApp`, `resumeTab`, `setResumeTab`, `saveStarStories`, `showError`, `setProfileModal`

## Data Shape
```js
{
  applications: [{
    id, company, title, stage, appliedDate, url,
    nextStep, nextStepDate, nextStepType, // next-step scheduling (v8.5)
    jobDescription, notes,
    prepNotes,   // legacy string; hydrated from prepSections where needed
    prepSections, // structured interview prep
    prepStageKey, // optional: phone_screen | interview | final_round
    interviewLog, // array of debrief entries (v8.7)
    offerDetails: { // structured offer capture (v8.11)
      receivedDate, baseSalary, bonusTarget, bonusType, // target|guaranteed|discretionary
      signOnBonus, equity, equityNotes,
      ptoWeeks, benefitsNotes, startDate, decisionBy,
      location, remoteFlex, notes
    },
    track, // 'IC' | 'SE' | 'AE' | 'Other' — Direction Tracker (v8.13)
  }],
  wins: [{ id, date, type, source, title, note, autoLogged }], // Wins Log (v8.13) — auto on progression/reply/debrief, manual via Focus tab
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
- On load: strip legacy `parsed.apiKey` from saved blob if present (do not store keys in data)
- `kitApp` + `resumeTab` live in App shell because Pipeline sets them when navigating to Apply Tools tab
- `completedBlocks` resets on page reload (intentional — daily tracker)
- Optional **Chrome extension** (`extension/`) opens HQ with import query params; app defers handling until auth is ready (see `extension/README.md`)

## Apply Tools (v8.6+)
Prompts live in `src/applyPrompts.js`. Users copy markdown into ChatGPT, Claude, or another assistant; optional paste-back into text areas. No `fetch` to LLM providers from the app.

## Gmail Inbox Feed (v8.18)
Browser → server-side OAuth exchange → encrypted refresh token in Supabase → browser-direct Gmail REST. Read-only.

- **Browser:** `src/inbox/oauth.js` lazy-loads Google Identity Services (`accounts.google.com/gsi/client`), runs `initCodeClient` in popup mode with `access_type: offline` + `prompt: consent`. Auth code POSTs to `/api/gmail/exchange`. Access token kept in module-memory closure only — never `localStorage`. Auto-refreshes 5 min before expiry via `/api/gmail/refresh`. Throws `code: "reconnect_required"` on Google `invalid_grant` so the panel can prompt re-consent.
- **Server (Vercel functions):** `api/gmail/exchange.js` validates the caller via Supabase access-token JWT, exchanges code with Google using `GOOGLE_CLIENT_SECRET`, AES-256-GCM-encrypts the refresh token (key from `GMAIL_TOKEN_ENC_KEY`), stores in `user_data` row keyed `app_key='job-search:gmail'` (separate from the data blob — uses `SUPABASE_SERVICE_ROLE_KEY`). `api/gmail/refresh.js` mirrors this for refresh; `api/gmail/disconnect.js` revokes the grant + deletes the row. All three live in CRA-on-Vercel native `api/` directory.
- **Fetching + classification:** `src/inbox/gmailClient.js` calls `gmail.googleapis.com` directly from the browser (CORS-enabled). `src/inbox/classifier.js` is regex + sender-domain heuristics (no LLM): branches by sender domain (`linkedin.com` → linkedin; `*.greenhouse.io` / `hire.lever.co` / `myworkday.com` / `ashbyhq.com` / others → ats_update); calendar-attachment or scheduling-link in body → interview_invite; recruiter branch delegates to existing `parseRecruiterEmail` when ≥3 of name/email/company/role are extractable from a non-personal-provider domain. ATS sub-kinds: `auto_reject` / `application_received` / `assessment` / `next_step` with suggested target stage.
- **Data:** `inbox: []` array on the main data blob. Items normalized via `normalizeInboxItems` on load. Idempotent merge on `gmailMessageId`. Items ride the existing `chase_job_search_v1` Supabase sync, so iOS Phase 2 picks them up free.
- **UI:** `InboxPanel` mounted between `MorningLaunchpad` and `TargetCompanyBoard` in `FocusTab`. Pending items render as cards; per-kind action buttons (Save Contact + App / Bump stage / Set interview + open prep / Dismiss / Snooze 24h) chain through existing modals via the new `modal.onAfterSave` callback. Wins auto-logged for actioned recruiter pings + interview invites.
- **Activation:** see `HANDOFF.md` "Activation steps" section. New env vars (`REACT_APP_GOOGLE_CLIENT_ID` browser-safe + `GOOGLE_CLIENT_SECRET` / `GMAIL_TOKEN_ENC_KEY` / `SUPABASE_SERVICE_ROLE_KEY` server-only) + GCP OAuth client + Gmail label `JobSearch` with filter rules.
- **Local dev:** `npm start` serves the CRA on :3001 but does NOT serve the `api/` functions. Use `vercel dev` instead when exercising the OAuth flow locally, or test on a Vercel preview URL.

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

## Pending Work (from ROADMAP)
- Wave 3+: debrief log, velocity dashboard, mock interview mode — see `ROADMAP.md`
- Deferred in-app LLM options — see `ROADMAP.md` "Deferred — in-app LLM"

## CI (GitHub Actions)
This app is built by **`.github/workflows/portfolio-web-build.yml`** on **Node 20** (`npm ci` then `npm run build`). Keep **`package-lock.json`** in sync with `package.json` using **Node 20’s npm** — see repo root **[`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`](../../docs/templates/SESSION_START_FIX_CI_LOCKFILES.md)**.

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
