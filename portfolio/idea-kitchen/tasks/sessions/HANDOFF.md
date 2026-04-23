# Session Handoff

**Date**: 2026-04-21
**Status**: Ready to commit
**Focus Area**: Idea Kitchen post-ship refinements — DIFFERENTIATE levers + Obsidian vault sync

Two refinements were added to the Idea Kitchen Claude Project system prompt and propagated across all related docs: (1) STEP 1.5 DIFFERENTIATE verdicts now require 3-5 concrete levers instead of vague adjectives, and (2) every app produced by Idea Kitchen now gets an Obsidian hub note at `brain/02-Projects/<slug>/README.md`. Both changes were dogfooded: the PRD gained 5 concrete levers, and Idea Kitchen's own hub note was backfilled in the vault.

---

## What Was Completed

### Refinement 1 — DIFFERENTIATE levers made mandatory
- Added `Differentiation levers` line to the verdict block in `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md:90-91` — sits between Justification and Positioning, required when verdict is DIFFERENTIATE
- Extended the DIFFERENTIATE explanation at `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md:97` with "vague 'it'll feel different' is a fail mode"
- Backfilled dogfood `docs/PRD.md:41-47` with 5 concrete levers (dogfooded artifacts, portfolio-convention binding, Claude Code handoff pipeline, identity voice, low-vision a11y) — each names a specific competitor it beats

### Refinement 2 — Obsidian vault sync wired into the flow
- Added STEP 7.5 to the handoff checklist in `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` — creates the hub note at `brain/02-Projects/<slug>/README.md` before handoff is complete
- Added step 8.5 to the end-of-session ritual in `docs/BUILD_GUIDE.md` (Sections 4 and 6) — touch up hub note each session
- Added Obsidian contract to `CLAUDE.md` Constraints & Gotchas: hub notes are frontmatter + links only, never mirrored content; repo stays source of truth
- Backfilled Idea Kitchen's own hub note at `brain/02-Projects/idea-kitchen/README.md` (lives in iCloud, not tracked in git)

### Supporting doc updates
- `CHANGELOG.md` — second `[Unreleased]` bullet covering both refinements
- `HANDOFF.md` — Focus + Next + Last touch updated
- `LEARNINGS.md` — two new dated entries: one for DIFFERENTIATE levers, one for the Obsidian gap finding
- `ROADMAP.md` — Phase 1 retro extended with both refinement entries

**Key Files Modified**:
- `portfolio/idea-kitchen/prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` — verdict block shape, DIFFERENTIATE explanation, STEP 7.5 added
- `portfolio/idea-kitchen/docs/PRD.md` — 5 concrete differentiation levers backfilled into the Prior art & positioning section
- `portfolio/idea-kitchen/docs/BUILD_GUIDE.md` — Obsidian references in Sections 4, 6, 13
- `portfolio/idea-kitchen/CLAUDE.md` — Obsidian contract added to Constraints & Gotchas
- `portfolio/idea-kitchen/CHANGELOG.md` — second [Unreleased] bullet
- `portfolio/idea-kitchen/HANDOFF.md` — state updated
- `portfolio/idea-kitchen/LEARNINGS.md` — two new entries
- `portfolio/idea-kitchen/ROADMAP.md` — Phase 1 retro row added

**Recent Commits**:
```
bcbbf6e feat(job-search-hq): v8.15 — TargetCompanyBoard + buildCompanyBoard()
57f5a5a chore(idea-kitchen): add Linear project link + sync Shipyard
3087a93 feat(idea-kitchen): scaffold docs-only app for Project→Code handoff system
```

---

## What's In Progress

### Current Task: Commit the session's changes

All 8 repo files are modified but not yet committed. The Obsidian hub note (`brain/02-Projects/idea-kitchen/README.md`) is a new file in the iCloud vault — it is NOT tracked in git and does not need to be staged.

**Files Being Modified**:
- `portfolio/idea-kitchen/prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` — +64 lines net; verdict block now has `Differentiation levers` field, DIFFERENTIATE explanation tightened, STEP 7.5 (Obsidian hub creation) added before handoff complete, Block 6 checklist step 8.5 added — Status: complete
- `portfolio/idea-kitchen/docs/PRD.md` — +20 lines; Prior art & positioning block now has 5 concrete levers each naming the competitor they beat — Status: complete
- `portfolio/idea-kitchen/docs/BUILD_GUIDE.md` — +~17 lines; Sections 4, 6, 13 reference Obsidian step — Status: complete
- `portfolio/idea-kitchen/CLAUDE.md` — +1 line; Obsidian contract in Constraints & Gotchas — Status: complete
- `portfolio/idea-kitchen/CHANGELOG.md` — +5 lines; second [Unreleased] bullet — Status: complete
- `portfolio/idea-kitchen/HANDOFF.md` — +6 lines; state current — Status: complete
- `portfolio/idea-kitchen/LEARNINGS.md` — +30 lines; two new entries — Status: complete
- `portfolio/idea-kitchen/ROADMAP.md` — +5 lines; Phase 1 retro row — Status: complete

**Staged Changes**:
```
(none — nothing staged yet)
```

**Unstaged Changes**:
```
 M portfolio/idea-kitchen/CHANGELOG.md
 M portfolio/idea-kitchen/CLAUDE.md
 M portfolio/idea-kitchen/HANDOFF.md
 M portfolio/idea-kitchen/LEARNINGS.md
 M portfolio/idea-kitchen/ROADMAP.md
 M portfolio/idea-kitchen/docs/BUILD_GUIDE.md
 M portfolio/idea-kitchen/docs/PRD.md
 M portfolio/idea-kitchen/prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md
```

**Why These Changes**:

The DIFFERENTIATE lever requirement came from a mental replay of how past apps (Shipyard, Job Search HQ) would have produced plausible-sounding one-sentence DIFFERENTIATE justifications that, weeks later, nobody could point to and name three actual features that differentiate the app. The verdict block was shaped to look decisive while being hand-wavy. Adding a required `Differentiation levers` line (3-5 bullets, each naming a competitor and the specific angle) closes that gap. "DIFFERENTIATE without levers is a softer KILL" is the rule captured in LEARNINGS.

The Obsidian sync gap was discovered by counting: of ~40 portfolio apps, only 5 had hub notes in `brain/02-Projects/`. Idea Kitchen — the system that teaches portfolio conventions — had zero Obsidian integration in v0.1. Hub notes are strictly frontmatter + links (never mirrored PRD content) so there's no drift risk. The vault is the discovery surface; the repo is the source of truth.

---

## Next Steps

### Immediate Actions (Priority Order)

1. **Commit the repo changes**
   - [ ] Stage all 8 modified files in `portfolio/idea-kitchen/`
   - [ ] Commit with message: `feat(idea-kitchen): DIFFERENTIATE levers + Obsidian vault sync`
   - [ ] No Obsidian vault file to stage — it lives in iCloud, not git

2. **Re-upload the updated prompt to the live Claude Project**
   - [ ] Open claude.ai > Idea Kitchen project > System Prompt
   - [ ] Replace with contents of `portfolio/idea-kitchen/prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md`
   - [ ] Verify STEP 7.5 and the `Differentiation levers` line are visible in the saved prompt

3. **End-to-end test with a DIFFERENTIATE-shaped idea**
   - [ ] Paste a real idea into the Idea Kitchen Claude Project
   - [ ] Walk through STEP 0 → STEP 1 → STEP 1.5
   - [ ] Verify the verdict block produces concrete levers (not single adjectives)
   - [ ] Log friction in `LEARNINGS.md`

4. **Update Linear heartbeat**
   - [ ] Post brief activity comment on https://linear.app/whittaker/project/idea-kitchen-1115a17b711a summarizing what shipped

### Blockers / Questions

- The live Claude Project on claude.ai still has the old prompt (no `Differentiation levers` line, no STEP 7.5). Until the prompt is re-uploaded, any idea run through the Project will use the old flow.

### Related Work

- `identity/patterns.md` may be worth updating if the DIFFERENTIATE lever rule or the Obsidian index rule are considered portfolio-wide patterns worth capturing there

---

## Key Context to Preserve

### Architectural Decisions

1. Hub notes in Obsidian are frontmatter + links only — never mirror PRD, APP_FLOW, or CHANGELOG content into the vault. Repo is the source of truth; Obsidian is the discovery surface. Creating drift here is the main failure mode.
2. The verdict block from STEP 1.5 carries **verbatim** into STEP 3 PRD under "Prior art & positioning." This is intentional — PRD should be able to explain the build rationale without re-running the research.
3. `STEP 7.5` Obsidian hub creation is part of the **handoff checklist** (STEP 7), not the end-of-session ritual (STEP 8). This means the hub note is created before the repo is handed to Claude Code, not after.

### Coding Patterns

- Docs-only app — no runtime, no build, no `npm install`. All "changes" are markdown edits.
- Section headers in `docs/SHOWCASE.md` are load-bearing (Shipyard parses them). Do not rename.
- Prompt step numbers are referenced by name in `docs/BUILD_GUIDE.md`. If step numbers change, update both files.
- Dogfood rule is hard: any convention the prompt teaches must be visibly followed in this app's own files. Check it after every prompt edit.

### Technical Constraints

- This is a public repo. The Obsidian vault (iCloud) is private and not tracked in git. Never `git add` vault files.
- The Claude Project on claude.ai must be manually updated when the prompt file changes — there is no auto-sync between the repo and the Project.
- Project Knowledge refresh cadence: monthly or when `CLAUDE.md`, `identity/*`, or `PRODUCT_BUILD_FRAMEWORK.md` changes materially.

### Lessons Learned

- DIFFERENTIATE without 3-5 concrete levers (each naming a competitor) is a softer KILL. Vague "it'll feel different" justifications look decisive but produce drift six weeks later.
- Obsidian is an index, not a mirror. If you find yourself pasting PRD content into a hub note, you're creating drift — stop.
- The live Claude Project prompt is separate from the repo file. Changes here do not propagate automatically; re-upload is always a manual step.

---

## Reference Links

### Key Files

- `/Users/chase/Developer/chase/portfolio/idea-kitchen/prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` — THE prompt; system prompt of the live Claude Project; STEP 7.5 is the new Obsidian hub creation step
- `/Users/chase/Developer/chase/portfolio/idea-kitchen/docs/PRD.md:41-48` — dogfooded Prior art & positioning block with 5 concrete DIFFERENTIATE levers
- `/Users/chase/Developer/chase/portfolio/idea-kitchen/docs/BUILD_GUIDE.md` — master doc; Sections 4, 6, 13 have the Obsidian integration instructions
- `/Users/chase/Developer/chase/portfolio/idea-kitchen/CLAUDE.md` — Constraints & Gotchas has the Obsidian contract (hub-note schema, iCloud path, "index not mirror" rule)
- `/Users/chase/Library/Mobile Documents/iCloud~md~obsidian/Documents/brain/02-Projects/idea-kitchen/README.md` — Idea Kitchen's own vault hub note (iCloud, not git)

### Documentation

- `portfolio/idea-kitchen/CLAUDE.md` — Constraints & Gotchas section for the Obsidian contract
- `portfolio/idea-kitchen/docs/BUILD_GUIDE.md` — Sections 4 (per-idea workflow) and 6 (end-of-session ritual) for Obsidian steps
- Root `CLAUDE.md` — Portfolio Overview table (Idea Kitchen row: `v0.1, n/a, local, Active`)

### Related Items

- Linear project: https://linear.app/whittaker/project/idea-kitchen-1115a17b711a

---

## How to Resume

1. **Load this handoff**: Review "What's In Progress" section above
2. **First action is a commit**: Stage all 8 modified files in `portfolio/idea-kitchen/` and commit
3. **Then re-upload the prompt**: The live Claude Project on claude.ai still has the old prompt
4. **Run an end-to-end test**: Pick a real idea, walk it through STEP 1.5, verify levers come out concrete
5. **Verify environment**: This is docs-only — no build or type-check needed; `git status` is enough

---

**Last Updated**: 2026-04-21
**Generated By**: `/handoff` command
