# Handoff — Idea Kitchen

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v0.2 |
| **Branch** | `main` |
| **URL** | n/a (docs-only) |
| **Storage key** | n/a |
| **Focus** | **Feature mode shipped** — second entry branch for adding features to existing portfolio apps. STEPs 0F → 7F, 4 artifact templates, `install-feature-docs` installer, BUILD_GUIDE section 4b with sprinkler-map worked walkthrough. |
| **Next** | (1) Re-paste updated System Prompt into the live Idea Kitchen Claude Project; (2) upload 4 new feature templates to Project Knowledge; (3) dogfood feature mode end-to-end with the Fairway sprinkler-map scenario; (4) verify `install-feature-docs` idempotency with a second run. |
| **Linear** | https://linear.app/whittaker/project/idea-kitchen-1115a17b711a |
| **Blockers** | None |
| **Last touch** | 2026-04-22 — v0.2 feature mode shipped: prompt (STEPs 0F–7F), 4 templates (FEATURE_BRIEF / FEATURE_PRD / FEATURE_DESIGN / FEATURE_IMPL_PLAN), `scripts/install-feature-docs` (idempotent, wires ROADMAP/CHANGELOG/LEARNINGS/HANDOFF + Obsidian feature hub + parent-hub link), BUILD_GUIDE section 4b with Fairway sprinkler-map walkthrough, knowledge manifest updated, CHANGELOG bumped. |

---

## What's in v0.2

**New (v0.2):**
- **Feature mode.** Second entry branch activated by "add X to `<target-app>`" phrasing. Parallel to project mode, shares STEP 0 intake shell + STEP 8 WIP + STEP 9 pattern capture.
- **STEPs 0F → 7F** — intake, cross-portfolio duplication scan (`EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL`), 4-layer competitor research (`KILL | DIFFERENTIATE | PROCEED` with 3–5 levers), Feature Brief, Feature PRD, Feature Design, Implementation Plan, 4-artifact generation, handoff.
- **4 feature-mode templates** — `FEATURE_BRIEF_TEMPLATE.md`, `FEATURE_PRD_TEMPLATE.md`, `FEATURE_DESIGN_TEMPLATE.md`, `FEATURE_IMPL_PLAN_TEMPLATE.md`.
- **`scripts/install-feature-docs`** — idempotent installer that files 4 artifacts, wires target app's ROADMAP / CHANGELOG / LEARNINGS / HANDOFF, creates Obsidian feature hub + parent-hub link.
- **BUILD_GUIDE section 4b** — feature mode walkthrough with the Fairway sprinkler-map scenario worked end-to-end.

**Existing (v0.1, unchanged):**
- Claude Project system prompt — 10-step project-mode flow (intake → pressure-test → prior-art → Phases 1/2/2.5/3 → milestones → 6 downloadable artifacts → handoff checklist → WIP summary → pattern capture).
- Master build guide — 13 sections.
- `APP_SHOWCASE_TEMPLATE.md` — Shipyard-parseable structure.
- `CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md` — one-time upload list.
- `SESSION_START_NEW_APP_EXAMPLE.md` — filled reference.
- 39 pre-filled SESSION_START templates — full portfolio coverage.
- Dogfooded PRODUCT_BRIEF / PRD / APP_FLOW / BRANDING / SHOWCASE for Idea Kitchen itself.
- Standard portfolio docs: CLAUDE.md, HANDOFF.md, LEARNINGS.md, CHANGELOG.md, ROADMAP.md, README.md.
- Row in root `CLAUDE.md` Portfolio Overview + metadata tables.
- Row in root `ROADMAP.md` Change Log.

---

## Fresh session prompt

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/idea-kitchen/CLAUDE.md and portfolio/idea-kitchen/HANDOFF.md.

Goal: Continue Idea Kitchen at portfolio/idea-kitchen/.

Current state: v0.2 shipped — two modes (project + feature). Feature mode STEPs 0F→7F complete, 4 templates + install-feature-docs installer + BUILD_GUIDE section 4b.

Pick next work from portfolio/idea-kitchen/ROADMAP.md. Most likely next:
- Dogfood feature mode with Fairway sprinkler-map (live Claude Project run + install-feature-docs + Claude Code Milestone 0).
- Phase 2 (Shipyard SHOWCASE rendering).
- Project Knowledge re-upload on claude.ai (new prompt + 4 feature templates).

Dogfood rule: any convention this app teaches must be visible in this app's own files. Keep it consistent.

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```

---

## Key files

| File | Purpose |
|------|---------|
| `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` | THE prompt — System Prompt of the Claude Project (project + feature modes) |
| `docs/BUILD_GUIDE.md` | THE master doc — read first. Section 4 = project mode, section 4b = feature mode. |
| `docs/SHOWCASE.md` | Rendered by Shipyard (Phase 2) — section headers are load-bearing |
| `templates/APP_SHOWCASE_TEMPLATE.md` | Shape for every future app's SHOWCASE (project mode) |
| `templates/FEATURE_BRIEF_TEMPLATE.md` | v0.2 feature-mode — 5-line brief (STEP 2F) |
| `templates/FEATURE_PRD_TEMPLATE.md` | v0.2 feature-mode — PRD with verdict blocks (STEP 3F) |
| `templates/FEATURE_DESIGN_TEMPLATE.md` | v0.2 feature-mode — design skeleton (STEP 4F) |
| `templates/FEATURE_IMPL_PLAN_TEMPLATE.md` | v0.2 feature-mode — Claude Code kickoff (STEP 5F) |
| `templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md` | One-time upload list (includes v0.2 feature templates) |
| `templates/SESSION_START_NEW_APP_EXAMPLE.md` | Reference for STEP 6 Block 6 (project mode) |
| `scripts/install-docs` | Project-mode installer — 6 artifacts → target app + ObsidianHub |
| `scripts/install-feature-docs` | v0.2 feature-mode installer — 4 artifacts + all audit wiring |
| `docs/PRODUCT_BRIEF.md` / `PRD.md` / `APP_FLOW.md` / `BRANDING.md` | Dogfood — this app's own Phase 1/2/2.5/3 |

## Critical gotchas

- Section headers in `SHOWCASE.md` are parsed by Shipyard — never rename.
- When the prompt's step numbers change, update references in `docs/BUILD_GUIDE.md`.
- Keep Project Knowledge fresh — monthly refresh or when upstream files change materially. After v0.2 ship, re-upload the prompt + the 4 feature templates.
- Any new convention in the prompt must be visible in this app's own files (dogfood).
- **Feature mode features don't add portfolio-table rows** — they live under their parent app. Only app-level metadata changes trigger `npm run sync:projects`.
- `install-feature-docs` is idempotent — running twice for the same `<target> <feature>` must not duplicate ROADMAP / CHANGELOG / LEARNINGS / Obsidian-link entries. Test this with a second run after changes.
- **Never `git add` the Obsidian vault** — it lives in iCloud, not the monorepo. Script enforces this.
