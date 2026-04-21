# Idea Kitchen — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Version:** v0.1
- **Storage key:** n/a (docs-only app, no runtime)
- **URL:** n/a (not deployed; docs are read in-repo)
- **Entry:** [`docs/BUILD_GUIDE.md`](docs/BUILD_GUIDE.md)

## Purpose
A reusable system that turns a raw idea into a shipped portfolio app. One Claude Project walks through Phases 1, 2, 2.5, and 3 of `PRODUCT_BUILD_FRAMEWORK.md`, produces six handoff docs, and hands off to Claude Code with a ready-to-paste kickoff prompt.

> *"For Reese. For Buzz. Forward — no excuses."*

## What This App Is

Docs-only. No runtime code. The app is a prompt + a build guide + templates + a dogfooded set of foundation docs. It's a portfolio app so that it follows its own conventions, shows up in Shipyard, and can be edited from Claude Code like any other app.

## File Structure
```
README.md                          <- entry: "start with docs/BUILD_GUIDE.md"
CLAUDE.md                          <- this file
HANDOFF.md                         <- State / Focus / Next / Last touch
LEARNINGS.md                       <- per-project mistakes, fixes, aha moments
CHANGELOG.md                       <- version history
ROADMAP.md                         <- Phase 1 (done), Phase 2 (Shipyard render), Phase 3 (migrate existing apps)
docs/
  BUILD_GUIDE.md                   <- THE master doc — read first
  BRANDING.md                      <- from PORTFOLIO_APP_BRANDING.md template
  SHOWCASE.md                      <- rendered by Shipyard (Phase 2)
  PRODUCT_BRIEF.md                 <- dogfood: this app's Phase 1
  PRD.md                           <- dogfood: this app's Phase 2
  APP_FLOW.md                      <- dogfood: this app's Phase 3
prompts/
  CLAUDE_PROJECT_IDEA_KITCHEN.md   <- THE prompt — pasted into a Claude Project's System Prompt
templates/
  APP_SHOWCASE_TEMPLATE.md         <- SHOWCASE structure (Project fills this in STEP 6)
  CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md   <- one-time Project Knowledge upload list
  SESSION_START_NEW_APP_EXAMPLE.md <- filled-in example of STEP 6 Block 6
```

## Tech Stack
- Markdown only. No build, no bundler, no runtime.
- Read in-repo or via GitHub web view. Shipyard (Phase 2) will render `docs/SHOWCASE.md` at `/ship/idea-kitchen`.

## Data Shape
n/a — docs-only.

## Current Features (v0.1)
- Claude Project system prompt (`prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md`) with 10-step flow (intake → pressure-test → Phases 1, 2, 2.5, 3 → milestones → artifacts → handoff → WIP → pattern capture).
- Master build guide (`docs/BUILD_GUIDE.md`) — 13 sections covering mental model, setup, per-idea workflow, security, best practices, troubleshooting, FAQ, and cheat sheet.
- SHOWCASE template (`templates/APP_SHOWCASE_TEMPLATE.md`) — what Shipyard parses.
- Project Knowledge manifest (`templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md`) — one-time upload list.
- Filled session-start example (`templates/SESSION_START_NEW_APP_EXAMPLE.md`) — reference shape.
- Dogfooded foundation docs — this app carries its own PRODUCT_BRIEF, PRD, and APP_FLOW.

## Commands
n/a (docs-only). To "run" the app: open a new Claude Project, paste `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` as the System Prompt, upload Knowledge per manifest.

## CI (GitHub Actions)
Not in `portfolio-web-build.yml` — no code to build. If `docs/` changes, the repo-wide lint / link checks still apply.

## Constraints & Gotchas
- This app is docs-only. Don't add runtime code here. If it needs code, it's a different app.
- `SHOWCASE.md` section headers are parsed by Shipyard — do not rename them.
- Project Knowledge refresh cadence: monthly, or when `CLAUDE.md` / `PRODUCT_BUILD_FRAMEWORK.md` / `identity/*` changes materially.
- The Claude Project prompt references files by name. When those file paths change, update the prompt (`prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md`) AND the manifest (`templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md`).
- Dogfood rule: any convention this app teaches must be visible in this app's own files. If the guide says "every app has a CHANGELOG," this app has a CHANGELOG.

## How to Extend
1. Read `docs/BUILD_GUIDE.md` first.
2. Changes to the prompt → update `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md`. Bump the build-guide section references if the step numbers change.
3. Changes to the manifest → re-upload the named files to the live Claude Project.
4. New templates → add under `templates/`, document them in `docs/BUILD_GUIDE.md`.
5. Every session where you touch this app, update `CHANGELOG.md`, `HANDOFF.md`, `LEARNINGS.md`, and (if structure changed) `docs/SHOWCASE.md`.
