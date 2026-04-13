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
| **Focus** | Wave 2 — company intel view, structured prep framework, STAR story bank |
| **Next** | See `ROADMAP.md` Wave 2 section |
| **Blockers** | None |
| **Last touch** | 2026-04-13 — Wave 1 shipped: action queue, next step dates/types, URL paste capture, scenario chips, logo |

---

## Fresh session prompt

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/job-search-hq/CLAUDE.md and portfolio/job-search-hq/HANDOFF.md.

Goal: Continue Job Search HQ at portfolio/job-search-hq/.

Current state: v8.5 — Wave 1 shipped. Action queue on Focus tab, next step dates on pipeline cards, URL paste quick-capture, outreach scenario chips on AI Tools. New logo (JOB/HQ mark).

Pick next work from portfolio/job-search-hq/ROADMAP.md Wave 2 section.

Follow existing patterns:
- constants.js for all data/config/styles — no React
- App.jsx is shell only: state, load/save, modals, nav
- Tabs are dumb components — props only, no persistent state
- Inline styles only via s.* from constants.js

Verify: cd portfolio/job-search-hq && npm start (port 3001)

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```

---

## Key files

| File | Purpose |
|------|---------|
| `src/constants.js` | ALL data models, enums, styles, helpers, AI call wrapper |
| `src/App.jsx` | Shell: state, load/save, modals, tab routing |
| `src/tabs/FocusTab.jsx` | Action queue + daily blocks |
| `src/tabs/PipelineTab.jsx` | Application cards + URL paste capture |
| `src/tabs/ContactsTab.jsx` | Contact list + stats + filter |
| `src/tabs/AITab.jsx` | All AI tools: resume, cover, kit, jobs, LinkedIn |
| `src/components/AppModal.jsx` | Add/edit application (next step date + type added v8.5) |
| `src/components/AppCard.jsx` | Pipeline card (urgency badge added v8.5) |
| `src/components/PrepModal.jsx` | Interview prep modal |

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
```
