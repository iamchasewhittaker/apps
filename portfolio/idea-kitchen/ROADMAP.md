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

### Phase 1 retro

- **2026-04-21** — Added **STEP 1.5 prior-art / existing-solution check** to the flow (between STEP 1 pressure-test and STEP 2 Phase 1 brief). Hybrid search + 3-verdict gate (`KILL | DIFFERENTIATE | PROCEED`); verdict block carries into PRD under new "Prior art & positioning" section. Dogfooded in Idea Kitchen's own PRD (verdict: DIFFERENTIATE). Prompt was the original 10-step ship; this was the first post-v0.1 refinement.
- **2026-04-21** — Refinement round: DIFFERENTIATE now requires 3–5 concrete levers (not single adjectives); Obsidian hub sync wired into STEP 7 + end-of-session ritual; Idea Kitchen's own hub backfilled at `brain/02-Projects/idea-kitchen/`.
- **2026-04-22** — Downloadable artifacts: STEP 6 switched from fenced blocks to `<antArtifact>` tags (each doc gets its own Download button in claude.ai). New `scripts/install-docs` handles zip + subdirectory + individual-file download shapes from claude.ai; cleans up zip after moving files. BUILD_GUIDE Section 14 added (Claude Project re-upload checklist with exact paths). 31 new SESSION_START templates written — full 39-app portfolio coverage. Fairway iOS all 5 foundation docs installed via the new flow.

## Phase 2 — Shipped (v0.2, 2026-04-22) · Feature Mode

- [x] **Feature mode** — second entry branch added to the Claude Project prompt. Triggered by "add X to `<target-app>`" phrasing.
- [x] **STEP 0F intake** — target app + feature sketch + appetite + identity.
- [x] **STEP 1F cross-portfolio duplication scan** — 4 checks, 4-verdict gate (`EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL`).
- [x] **STEP 1.5F 4-layer competitor research** — matrix + UX teardown + review mining + technical approach; DIFFERENTIATE requires 3–5 concrete levers tied to the layers.
- [x] **STEPs 2F → 5F** — Feature Brief / PRD / Design / Impl Plan.
- [x] **STEP 6F** — 4 `<antArtifact>` outputs (`FEATURE_BRIEF.md`, `FEATURE_PRD.md`, `FEATURE_DESIGN.md`, `FEATURE_IMPL_PLAN.md`).
- [x] **STEP 7F handoff** — single-command install via `scripts/install-feature-docs`.
- [x] **4 templates** — `FEATURE_BRIEF_TEMPLATE.md`, `FEATURE_PRD_TEMPLATE.md`, `FEATURE_DESIGN_TEMPLATE.md`, `FEATURE_IMPL_PLAN_TEMPLATE.md`.
- [x] **`scripts/install-feature-docs`** — idempotent installer. Files 4 artifacts + wires ROADMAP/CHANGELOG/LEARNINGS/HANDOFF + creates Obsidian feature hub + adds parent-hub link. Never `git add`s the vault.
- [x] **BUILD_GUIDE section 4b** — feature mode documented with the Fairway sprinkler-map worked walkthrough. Section 2 (Mental model) explains two modes; section 13 (Cheat sheet) gains a feature-mode variant.
- [x] **Knowledge manifest updated** — 4 new feature templates in Must-upload list; refresh cadence documented.
- [x] **CLAUDE.md bumped to v0.2** — Purpose, File Structure, Current Features, Constraints & Gotchas updated.

## Phase 2.5 — Shipped (v0.3, 2026-04-22) · Artifact reliability + paste fallback

- [x] **Prompt hardening** — top-of-prompt "artifacts are artifacts, not code blocks" rule under "How to behave." STEP 6 + STEP 6F rewritten to use imperative filename language ("Artifact titled `PRODUCT_BRIEF.md`") instead of raw `<antArtifact>` XML examples. Explicit Fallback subsections added to both steps.
- [x] **`scripts/install-docs --paste <file>` + `--paste-clipboard`** — fallback when claude.ai pastes docs inline instead of creating artifact panels. Splits `--- FILE: <name> ---` delimited single-file markdown. Preamble discarded. BSD awk compatible (no gawk dependency). `find`-based zero-match check avoids `set -e` trip.
- [x] **`scripts/install-feature-docs --paste <file>` + `--paste-clipboard`** — same fallback for feature-mode's 4 artifacts.
- [x] **Portfolio-wide SESSION_START template sweep** — 40 pre-filled templates + `SESSION_START_EXISTING_APP.md` + `SESSION_START_NEW_APP_EXAMPLE.md` normalized: "All six STEP 6 **blocks**" → "All six STEP 6 **artifacts** (downloadable panels, not code blocks in chat)." Latent reinforcement of wrong fallback removed.
- [x] **`docs/BUILD_GUIDE.md` §4, §4b, §11** — fallback path documented; §11 gains a troubleshooting row for the "STEP 6 pasted blocks instead of artifacts" failure mode.
- [x] **Splitter + error-path unit-tested** — `/tmp/fake.md` with preamble + two delimited docs installed cleanly; empty paste exits with "no `--- FILE:` delimiters found" message.
- [x] **CLAUDE.md bumped to v0.3.**

## Phase 3 — Next

- [ ] **Re-upload Project Knowledge** — updated system prompt + 40 swept SESSION_START templates + 4 feature templates to the live Idea Kitchen Claude Project on claude.ai.
- [ ] **Live artifact check** — re-run the Shipyard retroactive-docs session on claude.ai after re-upload. Expect 6 artifact panels with Download buttons. Run `install-docs shipyard` to confirm.
- [ ] **Live paste-fallback check** — if any session still pastes blocks, save the chat message to `~/Downloads/<app>.md` and run `install-docs <slug> --paste <file>`. Confirm all 6 files land correctly.
- [ ] **Dogfood feature mode end-to-end** — run the Fairway sprinkler-map scenario through the live Claude Project, install via `install-feature-docs`, scaffold Milestone 0 in Claude Code. Log friction in `LEARNINGS.md`.
- [ ] **Script idempotency smoke test** — run `install-feature-docs fairway-ios sprinkler-map` twice; verify no duplicated ROADMAP / CHANGELOG / LEARNINGS / Obsidian-link entries.
- [ ] End-to-end test of project mode (still pending from v0.1): create a Claude Project, upload Knowledge per manifest, run one real idea through STEPs 0–9, log friction.
- [ ] Enhance `portfolio/shipyard/src/app/ship/[slug]/page.tsx` to render each app's `docs/SHOWCASE.md`. Section headers (from `APP_SHOWCASE_TEMPLATE.md`) are the parsing contract.
- [ ] Add a `/showcase` slash command that generates a static HTML minisite from a SHOWCASE.md (optional second surface).

## Phase 4 — Later

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
- **2026-04-22** — v0.2 adds feature mode as a parallel branch, not a replacement. Project mode still handles new apps; feature mode handles features on existing apps. STEP 0 routes by phrasing.
- **2026-04-22** — Feature artifacts live at `portfolio/<target>/docs/features/<slug>/`, not in a new portfolio row. Features inherit the parent app's row in root `CLAUDE.md`.
- **2026-04-22** — STEP 1F scan uses 4 checks (target / siblings / shared-package / architecture-fit), not just target overlap. The sibling pass is the one that catches "this should be in `ClarityUI` instead."
- **2026-04-22** — STEP 1.5F runs 4 research layers (matrix / UX / reviews / tech), not a summary. Feature-level decisions are fine-grained enough to need all four.
- **2026-04-22** — Handoff must be a single idempotent script, not a checklist. `install-feature-docs` wires all 7 touchpoints in one run.
- **2026-04-22 (v0.3)** — Never put raw tool-invocation markup inside fenced code blocks in a system prompt. Imperative behavior description ("Create an artifact titled X") beats showing the markup. Showing `<antArtifact>` XML as an example caused claude.ai to emit it as literal text.
- **2026-04-22 (v0.3)** — When hardening a prompt against a failure mode, sweep the entire corpus of supporting files too. The "blocks" word in 40 SESSION_START templates was latent reinforcement of the wrong behavior — the fix had to be portfolio-wide, not just prompt-local.
- **2026-04-22 (v0.3)** — `--paste` fallback is opt-in, not auto-detected. Silent auto-parse of random clipboard content on empty `~/Downloads` would produce confusing failure modes; explicit flag makes the intent unambiguous.
