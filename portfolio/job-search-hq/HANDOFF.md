# Handoff — Job Search HQ

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v8.10 |
| **Branch** | `main` |
| **URL** | job-search-hq.vercel.app |
| **Storage key** | `chase_job_search_v1` |
| **Focus** | Wave 4 #3 shipped (v8.10): outreach cadence timeline — `outreachLog[]` on each contact, `OutreachTimeline` rendered on ContactCard, modal entry form + delete, quick-log on status-dropdown change, legacy `outreachDate`/`outreachStatus` seeded into one-entry log on load. |
| **Next** | Wave 4 #4: Offer comparison side-by-side mode. |
| **Blockers** | None. |
| **Last touch** | 2026-04-20 — v8.10: new `OutreachTimeline.jsx`; `OUTREACH_EVENT_TYPES`/`OUTREACH_METHODS`/`blankOutreachEntry`/`normalizeOutreachLog`/`normalizeContact` in constants.js; ContactsTab `updateStatus` appends log entry on meaningful status change; ContactModal "Outreach Log" section added. Verified modal-add and quick-log paths in browser; build clean. |

---

## What's Next

### Web — Wave 3 ✅ Complete
All four Wave 3 items shipped in v8.7:
- ✅ Logo redesign (outline, deep blue)
- ✅ Post-interview debrief log
- ✅ Application velocity dashboard
- ✅ Mock interview mode

**Next for web:** Wave 4 #4 — Offer comparison side-by-side mode. See ROADMAP.md.

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
