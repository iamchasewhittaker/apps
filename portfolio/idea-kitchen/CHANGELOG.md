# Changelog — Idea Kitchen

## [Unreleased]

### Changed — v0.3 artifact reliability + paste fallback

- **Prompt hardening: artifacts vs code blocks.** Added a top-of-prompt rule under "How to behave" explicitly forbidding fenced code-block output for STEP 6 / STEP 6F deliverables. Rewrote both STEP 6 and STEP 6F in `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` to use imperative artifact-creation language ("Artifact titled `<FILENAME>`") instead of raw `<antArtifact>` XML examples — the raw XML was being echoed as literal text by claude.ai in some sessions, masking the artifact tool entirely. Each STEP now ends with an explicit Fallback subsection describing the `--- FILE: <name> ---` delimiter protocol.
- **`scripts/install-docs --paste <file>` + `--paste-clipboard`** — fallback when the artifact tool fails and Claude pastes the 6 docs inline. Splits a single concatenated `.md` on `--- FILE: <name> ---` delimiter lines, discards preamble, files each section to `portfolio/<slug>/docs/` exactly as the zip path would. Works with `pbpaste` on macOS via `--paste-clipboard`. BSD awk compatible (no gawk dependency). Unit-tested + error-path (empty paste) verified.
- **`scripts/install-feature-docs --paste <file>` + `--paste-clipboard`** — same fallback for feature mode's 4 artifacts.
- **Portfolio-wide SESSION_START template sweep** — 40 pre-filled templates + `SESSION_START_EXISTING_APP.md` + `SESSION_START_NEW_APP_EXAMPLE.md` all normalized from "All six STEP 6 **blocks**" to "All six STEP 6 **artifacts** (downloadable panels, not code blocks in chat)." The word "blocks" was latent reinforcement of the wrong fallback behavior — consistency across past and future runs matters.
- **`docs/BUILD_GUIDE.md` §4, §4b, §11** — documents the fallback path. §11 troubleshooting table gains a row for the "STEP 6 produced code blocks instead of artifacts" failure mode with the exact `install-docs <slug> --paste <file>` remedy.

### Added — v0.2 Feature Mode

- **Feature mode — second entry branch for adding features to existing portfolio apps.** Triggered by "add X to `<target-app>`" phrasing. Runs cross-portfolio duplication scan + 4-layer competitor teardown + full 4-artifact generation scoped to the target app. New-project mode preserved exactly as-is.
- **STEP 0F intake** — 4 questions (target app, feature sketch, appetite, identity on/off). Target app must match root `CLAUDE.md` portfolio table.
- **STEP 1F cross-portfolio duplication scan** — 4 checks (target overlap, sibling overlap across all 39 apps via SESSION_START pre-fills, shared-package candidacy, architecture fit). Verdict: `EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL`. `NEW_APP` re-routes to project mode.
- **STEP 1.5F deep competitor research (4 layers)** — feature matrix, UX/design teardown, review mining (Reddit / App Store / G2), technical approach. Produces 3–5 differentiation levers tied to specific research (not vibes). Verdict: `KILL | DIFFERENTIATE | PROCEED`.
- **STEPs 2F → 5F** — Feature Brief (5 lines), Feature PRD (V1 + NOT-in-V1 + both verdicts verbatim + constraints + success + risks), Feature Design (screens, components, states, a11y per-screen, theme tokens, data delta), Implementation Plan (Milestone 0 scaffold → Milestone 1 vertical slice → verify).
- **STEP 6F** — 4 `<antArtifact>` outputs: `FEATURE_BRIEF.md`, `FEATURE_PRD.md`, `FEATURE_DESIGN.md`, `FEATURE_IMPL_PLAN.md`. Impl plan is itself a Claude Code SESSION_START kickoff.
- **STEP 7F handoff** — single-command install via `scripts/install-feature-docs <target-slug> <feature-slug>`.
- **`templates/FEATURE_BRIEF_TEMPLATE.md`** — 5-line brief skeleton (summary / user / pain / value / V1 scope).
- **`templates/FEATURE_PRD_TEMPLATE.md`** — PRD skeleton with verbatim verdict-block placeholders for STEP 1F and STEP 1.5F.
- **`templates/FEATURE_DESIGN_TEMPLATE.md`** — design skeleton: new screens + modified screens, new/reused components, states (loading/empty/error/success/offline), per-screen accessibility table, theme tokens, Swift + TS data-delta examples, primary flow, alternate flows.
- **`templates/FEATURE_IMPL_PLAN_TEMPLATE.md`** — Claude Code SESSION_START shape with read-first list (target `CLAUDE.md`, `HANDOFF.md`, 3 feature docs, root `CLAUDE.md`), Milestones 0/1/2+, end-of-session checklist (feature-mode variant with Obsidian hub bump at step 8.5), security + best-practices checklists.
- **`scripts/install-feature-docs`** — idempotent bash installer. Usage: `install-feature-docs <target-slug> <feature-slug>`. In one run: unzips artifacts from `~/Downloads`, files the 4 docs to `portfolio/<target>/docs/features/<feature>/`, appends feature-queue entry to `ROADMAP.md`, appends bullet to `CHANGELOG.md` under `## [Unreleased]`, appends dated line to `LEARNINGS.md`, updates `HANDOFF.md` Last-touch row, creates Obsidian feature hub at `brain/02-Projects/<target>/features/<feature>.md` with frontmatter + `file://` links, adds `[[features/<slug>\|<slug>]]` under `## Features` in the Obsidian parent hub (creates section or stub hub if missing). Never `git add`s the Obsidian vault.
- **`docs/BUILD_GUIDE.md` section 4b — "Feature mode — adding features to existing apps"** — full documentation with the Fairway sprinkler-map worked walkthrough. Section 2 (Mental model) updated to explain the two modes. Section 13 (Cheat sheet) gains a feature-mode variant.
- **Knowledge manifest updated** — 4 new feature templates added to "Must upload" list. Refresh cadence table gains a `FEATURE_*_TEMPLATE.md` row.
- **`CLAUDE.md` bumped to v0.2** — Purpose, File Structure, Current Features, Constraints & Gotchas all updated to document both modes.

### Added — prior to v0.2

- **`scripts/install-docs`** — new bash script: after downloading artifacts from the Idea Kitchen Claude Project, `install-docs <slug>` moves all 6 `.md` files from `~/Downloads` to `portfolio/<slug>/docs/` and the SESSION_START to `idea-kitchen/templates/`. Prints a Claude Project re-upload reminder on completion.
- **STEP 6 artifact format** — updated `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` to produce each of the 6 docs as a separate `<antArtifact>` in claude.ai (downloadable panel with Download button) instead of a single message with six fenced blocks. STEP 7 handoff checklist updated to reference `install-docs`. Cheat sheet in `docs/BUILD_GUIDE.md` updated to match.
- **Section 14 — Claude Project re-upload checklist** in `docs/BUILD_GUIDE.md`: exact file paths for every scenario that requires re-uploading to the live Claude Project (post-install-docs, per-app changes, monthly refresh).
- **Pre-filled SESSION_START templates for 39 apps (full portfolio coverage).** All ready to paste into the Idea Kitchen Claude Project with no edits needed. Organized in manifest by category (web / CLI+desktop / iOS / archived).
  - *Original 8:* Job Search HQ, GMAT Mastery Web, Fairway iOS, Shipyard, Wellness Tracker, Unnamed, RollerTask Tycoon Web, Spend Radar
  - *Web apps (9 new):* Clarity Budget Web, Clarity Command, Clarity Hub, App Forge, Knowledge Base, Funded Web, AI Dev Mastery, Alias Ledger, Ash Reader
  - *CLI / desktop / other (6 new):* Spend Clarity, Spend Radar Web, Gmail Forge, Claude Usage Tool, Shortcut Reference, ClarityUI
  - *iOS (14 new):* Clarity Check-in iOS, Clarity Triage iOS, Clarity Time iOS, Clarity Budget iOS, Clarity Growth iOS, Clarity Command iOS, Wellness Tracker iOS, Job Search HQ iOS, RollerTask Tycoon iOS, Funded iOS, Shipyard iOS, Ash Reader iOS, Unnamed iOS (+ previously listed Fairway iOS)
  - *Archived (3 new):* RollerTask Tycoon Vite PWA, Growth Tracker, Money
  - Manifest updated: manifest pre-filled section reorganized into Web / CLI+desktop / iOS / Archived subsections. Sync rule in `CLAUDE.md` Constraints & Gotchas covers all 39.
- **`templates/SESSION_START_EXISTING_APP.md`** — retroactive foundation-doc template for already-shipped apps. Skips STEP 0 / 1.5 / 2; targets SHOWCASE.md + BRANDING.md. Referenced in `docs/BUILD_GUIDE.md` Section 4a and `templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md` (item 13). Obsidian reference note at `brain/02-Projects/idea-kitchen/session-start-existing-app.md`.
- **STEP 1.5 — Prior-art / existing-solution check** in the Claude Project flow (`prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md`). Hybrid search (Claude proposes queries + likely candidates; Chase confirms) produces a 3-verdict gate: `KILL | DIFFERENTIATE | PROCEED`. The full verdict block carries forward verbatim into STEP 3 PRD under a new "Prior art & positioning" section. Flow diagram, STEP 3 PRD bullet list, `docs/BUILD_GUIDE.md` (Sections 4, 8, 13), and the dogfood `docs/PRD.md` all updated to match.
- **DIFFERENTIATE verdicts now require 3–5 concrete levers.** Verdict block gains a `Differentiation levers` line between `Justification` and `Positioning`; DIFFERENTIATE explanation bullet extended with "vague 'it'll feel different' is a fail mode." Dogfood `docs/PRD.md` backfilled with 5 concrete levers (dogfooded artifacts / portfolio-convention binding / Claude Code handoff pipeline / identity voice / low-vision a11y).
- **Obsidian vault sync.** Every app produced by Idea Kitchen now gets a hub note at `brain/02-Projects/<slug>/README.md` in the iCloud Obsidian vault (frontmatter + links, index only — repo stays source of truth). Wired into STEP 7 handoff checklist (new step 7.5) and the end-of-session ritual (new step 8.5) in both the prompt and `docs/BUILD_GUIDE.md` (Sections 4, 6, 13). Idea Kitchen's own hub note backfilled at `brain/02-Projects/idea-kitchen/`. `CLAUDE.md` Constraints & Gotchas documents the contract.

## [0.1.0] — 2026-04-21

### Added
- Scaffolded Idea Kitchen as a docs-only portfolio app at `portfolio/idea-kitchen/`.
- `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` — 10-step Claude Project system prompt (intake → pressure-test → Phases 1/2/2.5/3 → milestones → 6 fenced artifact blocks → handoff → WIP summary → pattern capture).
- `docs/BUILD_GUIDE.md` — master build guide, 13 sections (mental model, setup, per-idea workflow, foundation docs, end-of-session ritual, security, best practices, minisite, token efficiency, troubleshooting, FAQ, cheat sheet).
- `templates/APP_SHOWCASE_TEMPLATE.md` — Shipyard-parseable SHOWCASE structure.
- `templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md` — one-time Project Knowledge upload list with refresh cadence.
- `templates/SESSION_START_NEW_APP_EXAMPLE.md` — filled-in reference for STEP 6 Block 6.
- Dogfooded Phase 1/2/2.5/3 docs for Idea Kitchen itself: `docs/PRODUCT_BRIEF.md`, `docs/PRD.md`, `docs/BRANDING.md`, `docs/APP_FLOW.md`, `docs/SHOWCASE.md`.
- Standard portfolio docs: `CLAUDE.md`, `HANDOFF.md`, `LEARNINGS.md`, `ROADMAP.md`, `README.md`.
- Added Portfolio Overview row + Shipyard metadata row in root `CLAUDE.md`.
- Added Change Log row in root `ROADMAP.md`.
- Seeded `identity/patterns.md` (cross-portfolio pattern log).
