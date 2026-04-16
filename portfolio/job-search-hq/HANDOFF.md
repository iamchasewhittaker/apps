# Handoff — Job Search HQ

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v8.5 |
| **Branch** | `main` |
| **URL** | job-search-hq.vercel.app |
| **Storage key** | `chase_job_search_v1` |
| **Focus** | Wave 3 #2 — stage-specific prep templates (phone screen / interview / final round presets) |
| **Next** | Web Wave 3: prep templates → debrief log → velocity dashboard → mock interview. iOS Phase 2: Supabase sync + email OTP → profile editor → STAR stories → JSON import → AI + Keychain |
| **Blockers** | None (code-level). External dependency: LinkedIn DOM stability for extension capture. |
| **Last touch** | 2026-04-14 — verified web live (200 OK), web build clean, iOS BUILD SUCCEEDED. Fixed logo SVGs (rx rounded corners) + regenerated PNGs. |

---

## What's Next

### Web — Wave 3 (in order)
1. **Stage-specific prep templates** ← next ship target
   - Preset selector in prep flows: `phone_screen` / `interview` / `final_round`
   - Different question emphasis and prep prompts per stage
   - Keep existing `prepSections` structure (backward-compatible; no data migration needed)
   - Legacy `prepNotes` migration behavior must remain unchanged
   - Smoke test: App card prep button → modal generate/regenerate → save sections → Focus/Pipeline indicators

2. **Post-interview debrief log**
   - Add `interviewLog[]` array to application data model
   - Capture outcome quality per stage while prep context is fresh
   - Depends on stable stage templates

3. **Application velocity dashboard**
   - Weekly targets + trend line
   - Uses application stage flow + debrief signal quality for visibility
   - Depends on debrief log data

4. **Mock interview mode**
   - AI-driven Q&A in AI Tools tab
   - Depends on stabilized stage templates + debrief data for higher-quality simulations

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

Current state: v8.5 — Wave 2 complete (#1–#6). Wave 3 #1 done: Chrome extension MVP in `extension/` (see `extension/README.md`).

Next: Wave 3 item #2 — stage-specific prep templates (Phone Screen vs Interview vs Final Round).
- Add stage preset selector in PrepModal + prep generation prompt
- Backward-compatible with existing prepSections structure
- See HANDOFF.md "What's Next" section for full scope

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
| `extension/*` | Chrome MV3: LinkedIn scrape → HQ import; `content-jobhq-bridge.js` sets Action Queue badge |

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
