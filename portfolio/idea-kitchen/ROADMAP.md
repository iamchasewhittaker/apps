# Roadmap — Idea Kitchen

Docs-only app. Ship one phase at a time. Nothing here is committed until it's pulled into "Now."

## Vision

One reusable loop that takes any raw idea and walks it to a shipped portfolio app, with the same artifacts, the same Claude Code kickoff, the same Shipyard tile, and teaches the user along the way so repetition drops over time.

## Phase 1 — Shipped (v0.1, 2026-04-21)

- [x] Scaffolded `portfolio/idea-kitchen/` as a docs-only portfolio app.
- [x] `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` — 10-step system prompt.
- [x] `docs/BUILD_GUIDE.md` — 13-section master doc.
- [x] Three templates: SHOWCASE, Knowledge Manifest, SESSION_START example.
- [x] Dogfooded PRODUCT_BRIEF / PRD / APP_FLOW / BRANDING / SHOWCASE for this app.
- [x] Standard portfolio docs (CLAUDE, HANDOFF, LEARNINGS, CHANGELOG).
- [x] Root `CLAUDE.md` Portfolio Overview + Shipyard metadata rows.
- [x] Root `ROADMAP.md` Change Log row.
- [x] Seeded `identity/patterns.md`.

## Phase 2 — Next

- [ ] End-to-end test: create a Claude Project, upload Knowledge per manifest, run one real idea through STEPs 0–9, log friction in `LEARNINGS.md`.
- [ ] Enhance `portfolio/shipyard/src/app/ship/[slug]/page.tsx` to render each app's `docs/SHOWCASE.md`. Section headers (from `APP_SHOWCASE_TEMPLATE.md`) are the parsing contract.
- [ ] Add a `/showcase` slash command that generates a static HTML minisite from a SHOWCASE.md (optional second surface).
- [ ] Refine the prompt based on friction found in the end-to-end test. Bump to v0.2.

## Phase 3 — Later

- [ ] Migrate existing high-value portfolio apps to carry `docs/SHOWCASE.md` (one PR per app, starting with Wellness Tracker and Job Search HQ).
- [ ] Optional: `scripts/idea-kitchen` CLI — prints next steps, opens the prompt file, opens the Claude Project URL.
- [ ] Consider a pre-commit hook enforcing CHANGELOG / LEARNINGS / SHOWCASE updates when touching an app folder.

## Ideas / backlog (not committed)

- Versioned prompt releases (v0.2, v0.3) — so past apps know which prompt shape produced their docs.
- A "repro from SHOWCASE" command that regenerates a PRD skeleton from a SHOWCASE.md when the PRD is lost.
- Integration with Linear — auto-create project + M0/M1 issues at scaffold time.
- Project-Knowledge diff tool — tells you which files drifted since last upload.

## Decisions log

- **2026-04-21** — Chose "portfolio app" shape over a loose `docs/` folder. Dogfood rule: the system must follow its own conventions.
- **2026-04-21** — Six artifacts + kickoff prompt, not one giant pasteable prompt. Artifacts survive context compaction; prompts don't.
- **2026-04-21** — Branding at Phase 2.5 (between PRD and UX). Needs PRD context, must precede UX language.
- **2026-04-21** — Identity via Project Knowledge, not embedded prompt text. Files evolve; prompts rot.
