# Handoff — Job Search HQ

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v8.19 |
| **Branch** | `main` |
| **URL** | job-search-hq.vercel.app |
| **Storage key** | `chase_job_search_v1` (data) + Supabase `user_data` row `app_key='job-search:gmail'` (encrypted refresh token, server-only — never localStorage) |
| **Focus** | **Dashboard tab shipped (2026-04-30):** Shipyard-style glass cockpit as the default landing page. Stats bar (day N, apps/outreach daily progress, active pipeline), Today's Progress + Pipeline Health featured panels, Kassie card, 2×2 lower grid (target companies, wins, inbox, action queue). Focus tab loses Status zone (UrgencyHeader/DailyMinimums/KassieCard) and starts at Morning Routine. |
| **Next** | iOS Phase 2 (Supabase sync + email OTP). Dashboard polish: seed with real data after sign-in to validate all cards at scale. |
| **Blockers** | None. |
| **Last touch** | 2026-04-30 — Dashboard tab (v8.19): new DashboardTab.jsx, ~35 style tokens in constants.js, App.jsx routing + nav, FocusTab cleanup. Deployed to Vercel. |

---

## Activation steps (one-time, Chase-side)

1. **GCP project** — `console.cloud.google.com` → New project "Job Search HQ" → enable Gmail API.
2. **OAuth consent screen** — External, status Testing, add `chase.t.whittaker@gmail.com` as test user.
3. **OAuth client** — Web application. Authorized JavaScript origins: `http://localhost:3001` + `https://job-search-hq.vercel.app`. Authorized redirect URIs: `http://localhost:3001` + `https://job-search-hq.vercel.app` (popup mode uses `postmessage`, but Google still requires the JS origin to be listed).
4. **Local `.env`** — add `REACT_APP_GOOGLE_CLIENT_ID=<client_id>` (next to the existing `REACT_APP_SUPABASE_*` lines).
5. **Vercel env (Production + Preview)** — `cd portfolio/job-search-hq` then:
   ```
   vercel env add REACT_APP_GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add GMAIL_TOKEN_ENC_KEY            # value: openssl rand -base64 32
   vercel env add SUPABASE_SERVICE_ROLE_KEY      # from Supabase Settings → API
   ```
   Add to both Production and Preview when prompted.
6. **Gmail filters** — open the running app's Inbox panel → "Show one-time Gmail setup" expands the filter recipe (label `JobSearch`, senders `linkedin.com` / `*.greenhouse.io` / `hire.lever.co` / `myworkday.com` / `ashbyhq.com`, subject `interview OR schedule OR availability`).
7. **Connect** — click Connect Gmail in the panel → consent screen ("Job Search HQ wants to read your Gmail") → Advanced → continue → Allow. Token lands in Supabase encrypted.

---

## What's Next

### Web — Wave 4 + Daily Flow A/B/C/D/E ✅ Complete
- ✅ Wave 4 #1–#6 all shipped (Weekly Review, Draft Message, Outreach cadence, Offer compare, Email parse, PWA share)
- ✅ Confidence Bedrock layer (v8.13): direction frame, Kassie urgency, Wins log, Direction tracker
- ✅ Daily Flow Option A — Today's 5 + Outreach Autopilot (v8.14)
- ✅ TargetCompanyBoard (v8.15)
- ✅ Daily Flow Option B + C — Discovery Sprint + Apply Wizard (v8.16)
- ✅ Daily Flow Option E — Morning Launchpad (v8.17)

**Next for web:** Email/LinkedIn notification feed (Gmail OAuth or forward-to-alias) — deferred next-wave, bigger lift.

### iOS — Phase 2
1. **Supabase sync + email OTP** — replace `NoOpJobSearchRemoteSync` per `docs/SYNC_PHASE2.md`
2. **Profile editor** — full CRUD for `JobProfile` in More tab
3. **STAR stories UI** — list + editor for `starStories[]` bank
4. **Import JSON from web backup** — paste web export blob, merge into local store
5. **AI tools + Keychain API key storage** — Anthropic key in iOS Keychain (never in synced blob)

---

## Fresh session prompt

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/job-search-hq/CLAUDE.md and portfolio/job-search-hq/HANDOFF.md.

Goal: Continue Job Search HQ at portfolio/job-search-hq/.

Current state: v8.7 — Wave 3 fully shipped (logo, debrief log, velocity dashboard, mock interview).
Build is clean. Ready to deploy or start Wave 4.

Follow existing patterns:
- constants.js for all data/config/styles — no React
- App.jsx is shell only: state, load/save, modals, nav
- Tabs are dumb components — props only, no persistent state
- Inline styles only via s.* from constants.js

Verify: cd portfolio/job-search-hq && npm start (port 3001)

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```

---

## Readiness checkpoint (2026-04-13)

- **Go/No-Go:** Go for the currently shipped v8.5 scope.
- **Waiting on:** no active code blockers.
- **Operational checks to keep green:**
  - Supabase email template includes `{{ .Token }}` for OTP code flow (documented in `.env.example` / `CLAUDE.md`).
  - Vercel root directory is `portfolio/job-search-hq` (documented in `README.md`).
  - `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` remain configured in Vercel env (required by `.env.example` + deploy docs).
  - CI path remains Node 20 lockfile-compatible (`.github/workflows/portfolio-web-build.yml` uses Node 20, `npm ci`, `npm run build`).
  - Local readiness check: `npm run build` succeeds (warning only: unused `handleQuickAdd` in `src/tabs/FocusTab.jsx`).

---

## Key files

| File | Purpose |
|------|---------|
| `src/constants.js` | ALL data models, enums, styles, helpers, AI call wrapper |
| `src/App.jsx` | Shell: state, load/save, modals, tab routing |
| `src/tabs/FocusTab.jsx` | Action queue + daily blocks + prioritized outreach (“who to message”) |
| `src/tabs/PipelineTab.jsx` | Application cards + URL paste capture + win/loss outcome analytics |
| `src/tabs/ContactsTab.jsx` | Contact list + stats + filter + By Company view |
| `src/tabs/AITab.jsx` | All AI tools + STAR story bank sub-tab |
| `src/components/AppModal.jsx` | Add/edit application (next step date + type + structured prep) |
| `src/components/AppCard.jsx` | Pipeline card (urgency + prep status from `prepSections`) |
| `src/components/PrepModal.jsx` | Interview prep — sectioned `prepSections` + regenerate |
| `src/components/DebriefModal.jsx` | Post-interview debrief log — per-round entry form + history list |
| `src/mockInterviewQuestions.js` | Static question bank for mock interview mode (5 scenarios) |
| `src/components/ApplyWizardModal.jsx` | 7-step Apply Wizard (v8.16) — JD paste, copy tailor + cover prompts, Mark Applied + auto-log |
| `extension/*` | Chrome MV3: LinkedIn scrape → HQ import; `content-jobhq-bridge.js` sets Action Queue badge |

## Data model additions (v8.7)

```js
// New field on every application (blankApp):
interviewLog: []   // array of debrief entries (see blankDebriefEntry)

// New helpers:
blankDebriefEntry()      // { id, date, interviewerName, roundType, impression, confidence, strengths, gaps, redFlags, keyQuestions, notes }
normalizeInterviewLog(entries)  // normalizes/migrates saved entries
getWeeklyVelocityData(applications, weeksBack=8)  // → [{ weekStart, label, count, isCurrent }]

// New constants:
DEBRIEF_ROUND_TYPES     // array of { value, label }
DEBRIEF_IMPRESSIONS     // array of { value, label, color }

// Profile field:
weeklyTarget: 5         // weekly application target for velocity dashboard
```

## Data model additions (v8.5)

```js
// New fields on every application (blankApp):
nextStepDate: ""      // ISO date string "YYYY-MM-DD"
nextStepType: ""      // "apply" | "follow_up" | "prep" | "send_materials" | "thank_you" | "negotiate" | "other"

// New helpers:
nextStepUrgency(nextStepDate)  // → { label, color, bg } | null

// New constants:
NEXT_STEP_TYPES       // array of { value, label }
CONNECT_SCENARIOS     // array of { label, text } — for connection request chips
FOLLOWUP_SCENARIOS    // array of { label, text } — for follow-up message chips

// Wave 2 #4–#6 (see constants.js for exact shapes):
prepSections on applications   // structured prep; legacy prepNotes still migrates
starStories on data root       // STAR bank for AI Tools
getOutcomeAnalytics(applications) // Pipeline closed-outcome bar chart
```
