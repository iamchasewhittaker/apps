# Session Start: New App Creation

Paste one of these prompts at the start of a new chat to create a new portfolio app.

---

## Full Brief (Recommended)

```
Read CLAUDE.md and HANDOFF.md first.

I want to create a new app called "[APP_NAME]".

**What it does:** [1-2 sentence description]

**Why I'm building it:** [motivation/problem it solves]

**Target user:** [who uses it / what's their goal]

**Primary tech:** [web/iOS/both/other]

**Key features (Phase 1):** 
- Feature 1
- Feature 2
- Feature 3

Go ahead and scaffold it with scripts/new-app, then we'll design Phase 1 together.
```

---

## Quick Brief (Minimal)

Use this if you know exactly what you want and just need scaffolding + design.

```
Read CLAUDE.md and HANDOFF.md first.

Create a new app: [APP_NAME] — [one sentence description]
```

---

## What Happens Next

After you paste:

1. **Scaffold** — `scripts/new-app <name> "<description>"` creates the folder structure
2. **Auto-files** — `CLAUDE.md`, `HANDOFF.md`, `LEARNINGS.md`, `CHANGELOG.md`, `ROADMAP.md`, `DECISIONS.md` (from template)
3. **Linear** — New project created under Whittaker team
4. **Shipyard** — App added to fleet dashboard
5. **Design** — We work through Phase 1 (Product Definition → PRD → UX Flow → Architecture)
6. **Session end** — Step 6b captures decisions, patterns, vocabulary, and your reflection

---

## Tips

- **App names:** lowercase, hyphens (e.g., `job-search-hq`, `clarity-budget-web`)
- **Descriptions:** Keep it to one clear sentence (used in portfolio metadata table, Linear, Shipyard)
- **Tech choice:** Check [CLAUDE.md — Tech Stack](../../CLAUDE.md#tech-stack-all-apps) for conventions
- **Phase 1 scope:** 3-5 features max; rest goes to ROADMAP for future phases

---

**Reference:** [LEARNING_GUIDE.md](../../LEARNING_GUIDE.md) explains the learning capture system that runs at every session end.
