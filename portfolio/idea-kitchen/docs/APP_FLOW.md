# App Flow — Idea Kitchen

This is a docs-only app. The "flow" is how a user moves through the reading and execution, not a UI flow.

## Primary flow — start a new idea

1. **User:** opens the Claude Project on claude.ai.
2. **System (Project):** greets, references Project Knowledge.
3. **User:** pastes a raw idea (one sentence is fine).
4. **System:** runs STEP 0 intake — asks 3 questions (scope / identity / appetite).
5. **User:** answers in one message.
6. **System:** confirms back, moves to STEP 1.
7. **Loop** — STEPs 1 → 5, one message per phase, user signs off at each gate.
8. **System (STEP 6):** emits 6 fenced markdown blocks in a single message.
9. **User:** copies each block into the correct file path (5 under `portfolio/<slug>/docs/`, 1 at repo root as `SESSION_START_<SLUG>.md`).
10. **System (STEP 7):** shows the numbered scaffold + commit + CLAUDE.md + Shipyard-sync checklist.
11. **User:** runs the commands, opens a fresh Claude Code session.
12. **User:** pastes `SESSION_START_<SLUG>.md` into Claude Code.
13. **Claude Code:** reads context, runs Milestone 0, commits, stops.
14. **User:** reviews. Runs end-of-session 12-step checklist.
15. **User (optional):** returns to the Project for STEP 8 (WIP summary) and STEP 9 (pattern capture).

## Alternate flows

**Resume a paused idea.** Paste the WIP summary from STEP 8 into a fresh Project chat. The Project picks up from the named step. No re-litigation.

**Bring-your-own-idea with a partial plan.** Skip STEP 0 scope/identity (say "assume portfolio + identity on"). Still run STEP 1 pressure-test. Don't skip that.

**Kill at Milestone 1.** If the kill criterion from STEP 1 hits, stop building. Update `ROADMAP.md` with "Killed — reason." Move folder to `portfolio/archive/<slug>/`. Commit. Record the lesson in `LEARNINGS.md`.

**First-run setup (one-time).** Create the Claude Project, paste `CLAUDE_PROJECT_IDEA_KITCHEN.md` as System Prompt, upload Knowledge per manifest. Save. Test with a trivial idea to confirm the Project names Project Knowledge files when asked.

**Error flow — Project asks for context already in Knowledge.** Signal: Knowledge upload failed or stale. Fix: re-upload the named file, or paste a one-line reminder and re-ask.

## "Screens" (reading surfaces)

| Surface | Purpose | Empty state | Error state |
|---|---|---|---|
| `README.md` | Entry point. One paragraph → pointer to BUILD_GUIDE. | n/a (always populated) | Broken link → update path. |
| `docs/BUILD_GUIDE.md` | Master doc. Read once end-to-end; skim thereafter. | n/a | If a section references a file that no longer exists, update the path. |
| `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` | The live Project System Prompt. | n/a | If step numbering changes, update BUILD_GUIDE references. |
| `docs/SHOWCASE.md` | Shipyard tile + overview. | n/a (always populated) | Section headers renamed → Shipyard parsing breaks. |
| Claude Project (claude.ai) | The ideation surface. | First-run setup section of BUILD_GUIDE | Project forgot context → refresh Knowledge. |
| Claude Code session | The build surface. | SESSION_START_<SLUG>.md is the entry | If kickoff fails, paste just `CLAUDE.md` + `HANDOFF.md` and re-run. |

## Accessibility notes

- All artifacts are markdown — no custom rendering that could break VoiceOver or Dynamic Type readers.
- `docs/BUILD_GUIDE.md` uses H2 section headers consistently so jump-to-section works in any reader.
- Code blocks are fenced with a language hint where useful; not decorative.
- No emoji load-bearing on meaning.
- Contrast / font size are the reader's choice (native markdown rendering).

## Data model sketch

```
/portfolio/idea-kitchen/
  README.md, CLAUDE.md, HANDOFF.md, LEARNINGS.md, CHANGELOG.md, ROADMAP.md
  prompts/  CLAUDE_PROJECT_IDEA_KITCHEN.md
  docs/     BUILD_GUIDE.md, BRANDING.md, SHOWCASE.md,
            PRODUCT_BRIEF.md, PRD.md, APP_FLOW.md
  templates/ APP_SHOWCASE_TEMPLATE.md,
             CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md,
             SESSION_START_NEW_APP_EXAMPLE.md

/identity/patterns.md                 ← cross-portfolio pattern log (seeded here)
/ (repo root)                         ← CLAUDE.md + ROADMAP.md get one row each
```

No runtime state. No persistence layer. Every file is human-readable markdown.
