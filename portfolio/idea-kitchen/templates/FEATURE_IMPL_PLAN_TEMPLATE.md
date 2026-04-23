# Feature Implementation Plan — <FeatureName>

> Lives at: `portfolio/<target-app>/docs/features/<feature-slug>/FEATURE_IMPL_PLAN.md`
> Output of STEP 5F in the Idea Kitchen Claude Project flow (feature mode).
> **This file is formatted as a Claude Code SESSION_START prompt. Paste it into a fresh Claude Code session in `~/Developer/chase`.**

---

## Session kickoff

**Read first:**

1. `portfolio/<target-app>/CLAUDE.md` — target app conventions, stack, storage, constraints
2. `portfolio/<target-app>/HANDOFF.md` — current state
3. `portfolio/<target-app>/docs/features/<feature-slug>/FEATURE_BRIEF.md` — 5-line summary
4. `portfolio/<target-app>/docs/features/<feature-slug>/FEATURE_PRD.md` — V1 scope, constraints, portfolio scan, competitor findings
5. `portfolio/<target-app>/docs/features/<feature-slug>/FEATURE_DESIGN.md` — screens, components, states, a11y, data delta
6. `CLAUDE.md` at repo root — portfolio conventions

**Goal:** Scaffold Milestone 0 — then stop and wait for sign-off.

**Workspace:** `~/Developer/chase/portfolio/<target-app>/`

**Target app Linear:** `<Linear URL from root CLAUDE.md portfolio metadata table, or "none yet — create one">`

---

## Scope (from FEATURE_PRD.md)

- <V1 feature 1>
- <V1 feature 2>
- …

## NOT in scope (from FEATURE_PRD.md)

- <Deferred item 1>
- <Deferred item 2>
- …

---

## Milestones

### Milestone 0 — Scaffold inside target

**Goal:** get the feature's files + entry point into the target app without breaking anything.

**Create:**
- `<path/to/new-file.ext>` — <purpose, stub contents>
- `<path/to/new-component.ext>` — <purpose, stub contents>

**Modify:**
- `<path/to/existing-file.ext>` — <what to add, where, why>
- `<path/to/nav-or-routing.ext>` — <add entry point to new screen>

**Wire up:**
- <e.g. "add new MapTab to ContentView TabView as tab 6">
- <e.g. "extend HeadData with optional coordinate field, default nil">

**Verify Milestone 0:**
- <e.g. "xcodebuild clean build succeeds">
- <e.g. "app launches, new tab is visible but empty">

**Stop after Milestone 0 — wait for sign-off before Milestone 1.**

### Milestone 1 — One full vertical slice

**Goal:** the primary flow from FEATURE_DESIGN.md, end to end, even if ugly.

- <Step 1 of the primary flow → implementation>
- <Step 2 → implementation>
- …

**Verify Milestone 1:**
- <e.g. "on Chase's iPhone: open MapTab, tap zone 1, tap to place a head, see it saved after app restart">

### Milestone 2+

Remaining V1 features, one slice at a time. Each gets: goal, steps, verification.

---

## End-of-session checklist (run after each milestone, not just the final one)

```
 1. checkpoint
 2. Update portfolio/<target-app>/CHANGELOG.md under ## [Unreleased]            # MANDATORY
 3. Update portfolio/<target-app>/ROADMAP.md — mark feature queue item progress
 4. Update root ROADMAP.md Change Log row (one line)
 5. Update portfolio/<target-app>/HANDOFF.md — State, Focus, Next, Last touch
 6. Update portfolio/<target-app>/LEARNINGS.md                                  # MANDATORY — at least one line
 6.5. If user-visible state changed: update portfolio/<target-app>/docs/SHOWCASE.md
 7. Linear — heartbeat comment on the target app's Linear project + close done issues
 8. If root CLAUDE.md portfolio table changed:
       cd portfolio/shipyard && npm run sync:projects
 8.5. Update brain/02-Projects/<target-app>/features/<feature-slug>.md
       (Obsidian feature hub — bump frontmatter, add dated log entry; do not git-add — iCloud, not monorepo)
       On Milestone 1 ship: flip status: active → status: shipped, fill shipped: YYYY-MM-DD
 9. git add portfolio/<target-app>/...
10. git commit -m "<type>(<target-app>): <summary>"             # conventional commits
11. git push
12. Report: what shipped / what's next / any blockers.
```

## Security checklist

```
- Public repo. Never commit secrets, real financial figures, or real names tied to private data.
- .env gitignored. .env.example template only.
- Supabase RLS on every table. anon key OK in client; service-role server-only.
- Parameterized queries only.
- No dangerouslySetInnerHTML. HTTPS only. No user-controlled redirects.
- npm audit --production before each release.
- If a secret is committed: rotate immediately, then purge history.
- AI keys server-side only. Prompt-injection resistance on any tool-use path.
- Run /secure before first push.
```

## Best-practices checklist

```
1. Vertical slice: Milestone 0 scaffold, Milestone 1 one full flow.
2. Verify in browser or on device before claiming done.
3. <platform-appropriate build check> locally before push.
4. Small diffs. Conventional commits.
5. Empty + error states on every screen.
6. Accessibility from day one. Chase has low vision.
7. Portfolio table + Shipyard metadata stay in sync.
8. HANDOFF.md = resume context. Linear + git = shipped truth.
9. Honor kill criteria.
10. /audit before push on non-trivial changes.
11. No speculative abstractions.
12. 15-minute stuck rule: if stuck 15 min, change approach or ask.
```
