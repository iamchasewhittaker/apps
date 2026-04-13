# Session Start — Job Search HQ Wave 2

Paste this into a new chat and say: *"Read CLAUDE.md and HANDOFF.md first."*

---

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/job-search-hq/CLAUDE.md and portfolio/job-search-hq/HANDOFF.md.

Goal: Continue Job Search HQ at portfolio/job-search-hq/ — Wave 2 features.

Current state: v8.5 — Wave 1 shipped + Wave 2 item #1 done (2026-04-13).

Wave 1 (shipped):
- Action queue on Focus tab (overdue/due-today next steps, prep needed, stale contacts)
- Next step dates + types on applications (nextStepDate, nextStepType, nextStepUrgency)
- URL paste quick-capture on Pipeline (callClaude extracts title/company/JD from any job URL)
- Outreach scenario chips on AI Tools (Connection Request + Follow-up generators)
- New logo: JOB/HQ mark (blue #3b82f6)

Wave 2 item #1 (shipped 2026-04-13):
- By Company view on ContactsTab — view toggle (List / By Company), company rows with expand/collapse, warm lead badges (amber, click pre-fills AppModal), ghost rows for apps with no contacts

Wave 2 remaining — pick from ROADMAP.md Wave 2 section:
2. "Who should I message today?" widget on FocusTab — prioritized outreach queue; see SESSION_START_JOB_SEARCH_WHO_TO_MESSAGE.md
3. Outreach cadence suggestions on ContactCard (day 3, day 7 follow-up nudges)
4. Structured prep framework — replace freetext prepNotes in PrepModal with sections: company research, role analysis, STAR stories, anticipated questions, your questions
5. STAR story bank — new starStories array on data, reusable stories tagged by competency, AI-assisted drafting from base resume

Follow existing patterns:
- constants.js for all data/config/styles — no React
- App.jsx is shell only: state, load/save, modals, nav
- Tabs are dumb components — props only, no persistent state
- Inline styles only via s.* from constants.js
- callClaude(system, user, maxTokens) for all AI calls

Verify: cd portfolio/job-search-hq && npm start (port 3001)

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```
