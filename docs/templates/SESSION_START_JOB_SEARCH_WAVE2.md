# Session Start — Job Search HQ Wave 2

Paste this into a new chat and say: *"Read CLAUDE.md and HANDOFF.md first."*

---

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/job-search-hq/CLAUDE.md and portfolio/job-search-hq/HANDOFF.md.

Goal: Continue Job Search HQ at portfolio/job-search-hq/ — Wave 2 features.

Current state: v8.5 — Wave 1 shipped.
- Action queue on Focus tab (overdue/due-today next steps, prep needed, stale contacts)
- Next step dates + types on applications (nextStepDate, nextStepType, nextStepUrgency)
- URL paste quick-capture on Pipeline (callClaude extracts title/company/JD from any job URL)
- Outreach scenario chips on AI Tools (Connection Request + Follow-up generators)
- New logo: JOB/HQ mark (blue #3b82f6)

Wave 2 targets — pick from ROADMAP.md Wave 2 section:
1. Company intel view — group contacts by company in ContactsTab; show gap ("0 contacts at X"); surface warm leads (have contact, haven't applied)
2. "Who should I message today?" widget on FocusTab — prioritized outreach queue (replied-no-response, active-interview hiring managers, no-reply recruiters, uncontacted alumni)
3. Structured prep framework — replace freetext prepNotes in PrepModal with sections: company research, role analysis, STAR stories, anticipated questions, your questions
4. STAR story bank — new starStories array on data, reusable stories tagged by competency, AI-assisted drafting from base resume
5. Win/loss analytics — simple stage-outcome bar chart (rejection funnel) on ResourcesTab or new Analytics section

Follow existing patterns:
- constants.js for all data/config/styles — no React
- App.jsx is shell only: state, load/save, modals, nav
- Tabs are dumb components — props only, no persistent state
- Inline styles only via s.* from constants.js
- callClaude(system, user, maxTokens) for all AI calls

Verify: cd portfolio/job-search-hq && npm start (port 3001)

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```
