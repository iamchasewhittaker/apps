# Handoff — Idea Kitchen

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v0.1 |
| **Branch** | `main` |
| **URL** | n/a (docs-only) |
| **Storage key** | n/a |
| **Focus** | Phase 1 shipped — scaffold, prompt, build guide, templates, dogfood docs in place |
| **Next** | Test end-to-end: open Claude Project, paste prompt, run a real idea through STEPs 0–9, fix friction |
| **Linear** | https://linear.app/whittaker/project/idea-kitchen-1115a17b711a |
| **Blockers** | None |
| **Last touch** | 2026-04-21 — scaffolded Idea Kitchen app (16 files) + root CLAUDE.md rows + root ROADMAP Change Log row |

---

## What's in v0.1

- Claude Project system prompt (10-step flow: intake → pressure-test → Phases 1/2/2.5/3 → milestones → 6 fenced artifact blocks → handoff checklist → WIP summary → pattern capture).
- Master build guide — 13 sections.
- APP_SHOWCASE_TEMPLATE.md — Shipyard-parseable structure.
- CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md — one-time upload list.
- SESSION_START_NEW_APP_EXAMPLE.md — filled reference.
- Dogfooded PRODUCT_BRIEF / PRD / APP_FLOW / BRANDING / SHOWCASE for Idea Kitchen itself.
- Standard portfolio docs: CLAUDE.md, HANDOFF.md, LEARNINGS.md, CHANGELOG.md, ROADMAP.md, README.md.
- Row added to root `CLAUDE.md` Portfolio Overview + metadata tables.
- Row added to root `ROADMAP.md` Change Log.

---

## Fresh session prompt

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/idea-kitchen/CLAUDE.md and portfolio/idea-kitchen/HANDOFF.md.

Goal: Continue Idea Kitchen at portfolio/idea-kitchen/.

Current state: v0.1 shipped — prompt + build guide + templates + dogfood docs + Shipyard row.

Pick next work from portfolio/idea-kitchen/ROADMAP.md. Most likely next: end-to-end test or Phase 2 (Shipyard SHOWCASE rendering).

Dogfood rule: any convention this app teaches must be visible in this app's own files. Keep it consistent.

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```

---

## Key files

| File | Purpose |
|------|---------|
| `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` | THE prompt — System Prompt of the Claude Project |
| `docs/BUILD_GUIDE.md` | THE master doc — read first |
| `docs/SHOWCASE.md` | Rendered by Shipyard (Phase 2) — section headers are load-bearing |
| `templates/APP_SHOWCASE_TEMPLATE.md` | Shape for every future app's SHOWCASE |
| `templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md` | One-time upload list |
| `templates/SESSION_START_NEW_APP_EXAMPLE.md` | Reference for STEP 6 Block 6 |
| `docs/PRODUCT_BRIEF.md` / `PRD.md` / `APP_FLOW.md` / `BRANDING.md` | Dogfood — this app's own Phase 1/2/2.5/3 |

## Critical gotchas

- Section headers in `SHOWCASE.md` are parsed by Shipyard — never rename.
- When the prompt's step numbers change, update references in `docs/BUILD_GUIDE.md`.
- Keep Project Knowledge fresh — monthly refresh or when upstream files change materially.
- Any new convention in the prompt must be visible in this app's own files (dogfood).
