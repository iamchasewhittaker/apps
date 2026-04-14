# Session Start — Job Search HQ (post–Wave 2)

Paste this into a new chat and say: *"Read CLAUDE.md and HANDOFF.md first."*

> **Template note:** Wave 2 (#1–#6) is **complete**. Use this prompt for general continuation; for a specific archived build spec, see `SESSION_START_JOB_SEARCH_WHO_TO_MESSAGE.md` or `SESSION_START_JOB_SEARCH_COMPANY_INTEL.md` (both marked shipped).

---

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/job-search-hq/CLAUDE.md and portfolio/job-search-hq/HANDOFF.md.

Goal: Continue Job Search HQ at portfolio/job-search-hq/.

Current state: v8.5 — Wave 2 complete (#1–#6). Wave 3 #1 shipped: Chrome MV3 extension in `extension/` (see `extension/README.md`) — LinkedIn profile/job import, post-login URL/hash import on the web app, Action Queue toolbar badge.

Next work: pick from `portfolio/job-search-hq/ROADMAP.md` **Wave 3** (e.g. stage-specific prep templates).

Wave 2 shipped summary:
- By Company on ContactsTab; Focus “who to message” outreach queue; ContactCard cadence nudges
- Structured `prepSections` + PrepModal; STAR story bank in AITab; Pipeline win/loss analytics

Follow existing patterns:
- constants.js for all data/config/styles — no React
- App.jsx is shell only: state, load/save, modals, nav
- Tabs are dumb components — props only, no persistent tab-local persistence for domain data
- Inline styles only via s.* from constants.js
- callClaude(system, user, maxTokens) for all AI calls
- Extension changes: document in CHANGELOG and keep `extension/README.md` accurate

Verify: cd portfolio/job-search-hq && npm start (port 3001)

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```
