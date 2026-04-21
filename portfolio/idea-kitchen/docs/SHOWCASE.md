# Idea Kitchen

> A reusable system that turns a raw idea into a shipped portfolio app.

**Status:** Active
**Version:** v0.1
**Stack:** Markdown-only (no runtime). Consumed by Claude Project (claude.ai) + Claude Code (CLI) + Shipyard.
**Updated:** 2026-04-21

---

## Problem

Every new idea costs the same re-explanation: portfolio conventions, voice rules, security rules, scaffold commands. Plans drift from code. There's no visual surface that says "this is what I'm making right now." Tokens get burned answering questions the system already knows.

## Solution

One loop. A Claude Project with a 10-step system prompt walks an idea through Phases 1, 2, 2.5, and 3 of the product build framework, emits six handoff artifacts in a single message, and hands off to Claude Code via a ready-to-paste kickoff prompt. Same conventions every time. Patterns get captured so the next loop is cheaper.

## Who it's for

Chase — solo builder running the `~/Developer/chase/` portfolio.

---

## Key features (V1)

- **Claude Project system prompt** — 10 numbered steps, one message per phase, produces 6 fenced artifact blocks.
- **Master build guide** — 13 sections covering setup, workflow, end-of-session ritual, security, best practices, troubleshooting.
- **Three templates** — SHOWCASE structure, Project Knowledge upload manifest, filled SESSION_START example.
- **Dogfood docs** — Idea Kitchen carries its own Phase 1/2/2.5/3 outputs.
- **Portfolio integration** — appears in root `CLAUDE.md` tables + Shipyard fleet view.

---

## Primary flow

1. Open the Claude Project, paste a raw idea.
2. Answer STEP 0 intake (scope / identity / appetite) in one message.
3. Walk STEPs 1 → 5 one message at a time, signing off at each gate.
4. Copy the 6 fenced blocks from STEP 6 into real files.
5. Run STEP 7's scaffold + commit + CLAUDE.md + Shipyard-sync checklist.
6. Open fresh Claude Code, paste `SESSION_START_<SLUG>.md`, scaffold Milestone 0, commit, stop.

---

## Screens

| Surface | Purpose | Empty state | Error state |
|---|---|---|---|
| `README.md` | Entry → pointer to BUILD_GUIDE | n/a | Broken link → fix path |
| `docs/BUILD_GUIDE.md` | Master doc | n/a | Stale file refs → update |
| `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` | Live system prompt | n/a | Step numbers drifted → update BUILD_GUIDE refs |
| Claude Project (claude.ai) | Ideation | First-run setup in BUILD_GUIDE | Lost context → refresh Knowledge |
| Claude Code session | Build | SESSION_START_<SLUG>.md | Kickoff fails → fall back to CLAUDE.md + HANDOFF.md |

---

## Milestones

- [x] **M0 — Scaffold** — 16 files created, standard portfolio docs in place, root CLAUDE.md + ROADMAP updated, Shipyard row added.
- [ ] **M1 — End-to-end test** — open Claude Project, upload Knowledge, run one real idea through STEPs 0–9, log friction in LEARNINGS.
- [ ] **M2 — Shipyard SHOWCASE render** — enhance `portfolio/shipyard/src/app/ship/[slug]/page.tsx` to parse each app's `docs/SHOWCASE.md`.
- [ ] **M3 — Existing-app migration** — add `docs/SHOWCASE.md` to high-value portfolio apps (Wellness, Job Search, Clarity Hub first).

---

## Links

- **GitHub:** [apps](https://github.com/iamchasewhittaker/apps) (monorepo path: `portfolio/idea-kitchen/`)
- **Linear:** [Idea Kitchen](https://linear.app/whittaker/project/idea-kitchen-1115a17b711a)
- **Live:** n/a (docs-only)
- **Shipyard:** [/ship/idea-kitchen](https://shipyard-sandy-seven.vercel.app/ship/idea-kitchen)

---

## Why it exists

Chase has shipped over 30 portfolio apps. Every new one cost the same half-hour of re-explaining conventions, re-deciding palette, re-writing the scaffold prompt, re-discovering the same mistakes. Idea Kitchen turns that half-hour into a one-message answer plus a checklist. The system also teaches — every repeated correction becomes a pattern in `identity/patterns.md`, so next time is cheaper.

*"For Reese. For Buzz. Forward — no excuses."*
