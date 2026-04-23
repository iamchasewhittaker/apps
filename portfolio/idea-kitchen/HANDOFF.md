# Handoff — Idea Kitchen

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v0.3 |
| **Branch** | `main` |
| **URL** | n/a (docs-only) |
| **Storage key** | n/a |
| **Focus** | **Artifact reliability + paste fallback shipped.** Prompt hardened to prevent claude.ai emitting `<antArtifact>` XML as literal fenced code. `--paste <file>` + `--paste-clipboard` added to both installers. Portfolio-wide SESSION_START sweep (40 files) normalized "blocks" → "artifacts." |
| **Next** | (1) Re-upload updated System Prompt + 40 swept SESSION_START templates to the live Claude Project; (2) re-run Shipyard retroactive-docs session on claude.ai to confirm artifact panels appear (not fenced blocks); (3) if they still paste, verify `install-docs shipyard --paste <file>` handles the fallback; (4) dogfood feature mode with Fairway sprinkler-map (pending from v0.2). |
| **Linear** | https://linear.app/whittaker/project/idea-kitchen-1115a17b711a |
| **Blockers** | None |
| **Last touch** | 2026-04-22 — v0.3 artifact reliability: prompt top-rule + STEP 6 / STEP 6F rewritten (no more `<antArtifact>` XML examples that claude.ai echoes as text); `install-docs` + `install-feature-docs` gained `--paste <file>` / `--paste-clipboard` with `--- FILE: <name> ---` delimiter splitter (BSD awk compatible); 40 SESSION_START templates swept "blocks" → "artifacts"; BUILD_GUIDE §4/§4b/§11 documented the fallback path. Splitter + error-path unit-tested. |

---

## What's in v0.3

**New (v0.3):**
- **Prompt hardening.** Top-of-prompt "artifacts are artifacts, not code blocks" rule under "How to behave." STEP 6 + STEP 6F rewritten to use imperative filename language; raw `<antArtifact>` XML examples removed (they were getting echoed verbatim by claude.ai in some sessions). Explicit fallback subsections added to both steps.
- **`scripts/install-docs --paste <file>` / `--paste-clipboard`** — fallback when Claude pastes docs as fenced code blocks. Splits `--- FILE: <name> ---` delimited single-file markdown. Preamble discarded. BSD awk compatible. Splitter + error-path unit-tested.
- **`scripts/install-feature-docs --paste <file>` / `--paste-clipboard`** — same fallback for the 4 feature artifacts.
- **Portfolio-wide SESSION_START sweep (40 files).** Normalized "All six STEP 6 **blocks**" → "All six STEP 6 **artifacts** (downloadable panels, not code blocks in chat)." Latent reinforcement of wrong behavior removed. Includes pre-filled templates + `SESSION_START_EXISTING_APP.md` + `SESSION_START_NEW_APP_EXAMPLE.md`.
- **`docs/BUILD_GUIDE.md` §4, §4b, §11** — documents the paste fallback path and gains a troubleshooting row for the failure mode.

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

Current state: v0.3 shipped — artifact reliability + paste fallback. Prompt hardened, both installers take `--paste <file>` / `--paste-clipboard`, 40 SESSION_START templates swept.

Pick next work from portfolio/idea-kitchen/ROADMAP.md. Most likely next:
- Re-upload updated prompt + 40 swept SESSION_START templates to live Claude Project.
- Re-run Shipyard retroactive-docs on claude.ai to confirm artifact panels render (not fenced blocks).
- Dogfood feature mode with Fairway sprinkler-map (pending from v0.2).
- Phase 2 (Shipyard SHOWCASE rendering).

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
