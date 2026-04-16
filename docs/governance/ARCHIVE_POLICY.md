# Archive Policy — Portfolio Lifecycle Governance

> Defines how retired, paused, and absorbed projects are classified and managed.
> Every project in `portfolio/archive/` must have an explicit class.

---

## Archive Classes

### Frozen Reference
**What:** Code and docs preserved read-only. No maintenance, no updates.
**When to use:** Project is complete or superseded. Kept for historical reference and institutional memory.
**Review cadence:** Never (unless a strategic gap reopens).
**Marker:** Add to project README: `> Archive class: Frozen Reference (YYYY-MM-DD)`

### Revivable Candidate
**What:** Code preserved and could be restarted with effort. Not actively maintained but not fully retired.
**When to use:** Project has potential but was paused due to priority, capacity, or timing.
**Review cadence:** Quarterly — ask "Has the strategic gap this would fill opened up?"
**Marker:** Add to project README: `> Archive class: Revivable Candidate (YYYY-MM-DD) — Review: YYYY-QN`

### Merge Candidate
**What:** Concept was absorbed into an active app. Archive exists to document the lineage.
**When to use:** Features or patterns from this project now live in another app.
**Review cadence:** Once — confirm absorption is complete, then promote to Frozen Reference.
**Marker:** Add to project README: `> Archive class: Merge Candidate — Absorbed into: [app-name]`

### Full Retirement
**What:** Project is done. No strategic value, no revival case. Hidden from active views.
**When to use:** Experiment that ran its course, tool that was replaced, or project that never launched.
**Review cadence:** Annual — confirm it should stay retired.
**Marker:** Add to project README: `> Archive class: Full Retirement (YYYY-MM-DD)`

---

## Current Archive Inventory

| Project | Location | Recommended Class | Rationale |
|---------|----------|-------------------|-----------|
| Growth Tracker | `portfolio/archive/growth-tracker/` | Merge Candidate | Absorbed into Wellness GrowthTab |
| RollerTask Tycoon (web PWA) | `portfolio/archive/roller-task-tycoon/` | Frozen Reference | Replaced by RollerTask Tycoon Web (CRA) |
| Money (Transaction Enricher) | `portfolio/archive/money/` | Merge Candidate | Superseded by Spend Clarity |
| Wellness Tracker iOS | `portfolio/wellness-tracker-ios/` | Active | Unarchived 2026-04-14; companion to web + Command cross-read |
| Claude Usage Tool | `projects/archive/claude-usage-tool/` | Full Retirement | Retired fork, no active use |

> Update this table when archiving or reclassifying projects.

---

## Kill Criteria — When to Archive an Active Project

Trigger an archive review when **any** criterion is sustained for 30+ days:

1. **No strategic fit** — doesn't map to a defined product line
2. **No traction** — no commits, no usage, no progress after agreed runway
3. **Maintenance > value** — time spent maintaining exceeds benefit delivered
4. **Security burden** — compliance or security cost exceeds expected benefit
5. **Better alternative exists** — another active app does the same job better

**Action options:** Retire (archive), Merge (absorb features elsewhere), Pause (revivable candidate), Re-scope (narrow focus and continue).

---

## Process

1. Identify candidate via kill criteria or Product hat review
2. Classify using the archive classes above
3. Add marker to project README
4. Update this inventory table
5. Remove from active ROADMAP.md and root CLAUDE.md portfolio table
6. Update Linear — close project or mark as Canceled with note
7. Commit with message: `archive: classify [project] as [class]`
