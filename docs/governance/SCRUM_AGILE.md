# Scrum / Agile Conventions — Whittaker Portfolio

> All apps, projects, and future builds follow these conventions.
> Linear is the single source of truth for sprint and issue tracking.

---

## Mission

> **"For Reese. For Buzz. Forward — no excuses."**
>
> Every sprint, every issue, every commit moves the family forward.
> Work with urgency. Ship with quality.

---

## Issue Format — User Stories

All Linear issues must be written as User Stories:

```
As a [type of user],
I want [to do something],
so that [I get some benefit / outcome].
```

**Example:**
```
As a job seeker,
I want to see companies grouped by industry in the pipeline view,
so that I can prioritize my outreach by sector.
```

Every issue must also include:

| Field | Required? | Format |
|-------|-----------|--------|
| **Title** | Yes | Short imperative: "Add company grouping to pipeline" |
| **Description** | Yes | Full User Story (As a / I want / So that) |
| **Acceptance Criteria** | Yes | "Done when: [specific, testable conditions]" |
| **Story Points** | Yes | Fibonacci: 1, 2, 3, 5, 8, 13 |
| **Priority** | Yes | Urgent / High / Medium / Low |
| **Cycle (Sprint)** | When active | Assign to current or next sprint |

**Done when…** examples:
- "Done when: clicking a company row opens its detail view with all contacts visible"
- "Done when: `npm test` passes with 0 failures on the pipeline filter logic"
- "Done when: the feature is deployed to Vercel production and visually confirmed"

---

## Sprint Structure — Linear Cycles

- **Sprint length:** 2 weeks
- **Sprint cadence:** Starts Monday, ends Sunday
- **Platform:** Linear → Project → Cycles tab

### Sprint Events

| Event | When | What |
|-------|------|------|
| Sprint Planning | Sprint start (Monday) | Pull from backlog, assign points, set goal |
| Daily Standup | Each working day | What did I do / what will I do / blockers |
| Sprint Review | Last day (Sunday) | Demo what shipped; mark issues Done |
| Retrospective | Sprint end | What went well / what to improve — log in Linear project update |

### Sprint Goal Format

Every sprint must have a one-sentence goal posted in the Linear cycle description:
```
Sprint N Goal: Ship [feature/milestone] so that [outcome for user/family].
```

**Example:**
```
Sprint 4 Goal: Ship Job Search HQ Wave 2 so that pipeline management
takes under 5 minutes per day.
```

---

## Epics — Linear Milestones

Large features or phases are tracked as **Milestones** in Linear:

- Each Milestone = one deliverable phase (e.g., "Clarity Hub v0.2 — standalone YNAB")
- Issues belong to a Milestone when they're part of that phase
- Milestone is marked complete when all child issues are Done and it's deployed

---

## Story Point Guide

| Points | Effort | Examples |
|--------|--------|---------|
| 1 | Trivial — < 30 min | Fix a typo, update a color, add a link |
| 2 | Small — ~1 hr | Add a field to a form, update a doc |
| 3 | Medium — half day | New component, new tab, API integration |
| 5 | Large — full day | New feature with state + UI + tests |
| 8 | XL — 2-3 days | New app screen, major refactor, new sync pattern |
| 13 | Epic slice — 1 week | Full app phase, complex multi-file feature |

---

## Backlog Hygiene

- All new ideas go into Linear as issues immediately (even rough ones)
- Backlog items must be estimated before they can be pulled into a sprint
- Issues older than 3 sprints without activity are marked `Canceled` or `Blocked`
- No orphan issues — every issue belongs to a project

---

## Labels (Linear)

Standard labels used across all projects:

| Label | Use |
|-------|-----|
| `bug` | Something broken |
| `feature` | New capability |
| `chore` | Maintenance, deps, docs |
| `ux` | UI/design improvement |
| `perf` | Performance |
| `infra` | CI/CD, build, deploy |
| `blocked` | Waiting on external or another issue |
| `ios` | iOS-specific work |
| `web` | Web app work |

---

## Definition of Done

An issue is Done when ALL of:
- [ ] Code committed and pushed to `main`
- [ ] Feature works as described in acceptance criteria
- [ ] If web: deployed to Vercel production
- [ ] If iOS: builds clean to simulator AND physical device
- [ ] If it touches shared files: health check passes (`scripts/portfolio-health-check --fast`)
- [ ] CHANGELOG.md updated under `## [Unreleased]`
- [ ] Linear issue marked Done

---

## Velocity Tracking

At the end of each sprint:
1. Sum story points of all issues marked Done in that cycle
2. Record in Linear project update: `Sprint N: X points completed`
3. Use 3-sprint rolling average as capacity estimate for next sprint

---

## New Project Checklist

When creating a new app or project:

- [ ] Linear project created with description + mission line
- [ ] First milestone defined (MVP scope)
- [ ] First sprint created with sprint goal
- [ ] At least 5 issues seeded in backlog (User Story format)
- [ ] CLAUDE.md includes Linear project link
- [ ] ROADMAP.md includes sprint/milestone structure

---

*Last updated: 2026-04-14 · Owner: Chase Whittaker · Team: Whittaker (WHI)*
