# Product Brief — Shipyard

**App summary.** Shipyard is a fleet command center for Chase's app portfolio — a local CLI scanner upserts project metadata into Supabase, and a deployed Next.js dashboard surfaces health, WIP queue, reviews, learnings, and thematic analysis.

**Target user.** Chase — the person who built and maintains the portfolio.

**Main pain.** No single place to see which projects are alive, what's blocked, what needs attention, and what was learned — context lives scattered across CLAUDE.md files, Linear, and memory.

**Core value.** One dashboard that tells Chase what's shipping, what's stuck, and what patterns keep recurring — so he spends zero time reconstructing state at session start.

**V1 scope.**
- Fleet dashboard: all projects with status, compliance score, and WIP banner
- Ship detail: editable status, next action, blockers, decommission flow
- Drydock Gate (WIP queue): priority list with drag-to-reorder
- Port Inspection: weekly review form
- Captain's Log: learnings aggregated from all apps
