# Idea Kitchen — Project Instructions

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Version:** v0.3
- **Storage key:** n/a (docs-only app, no runtime)
- **URL:** n/a (not deployed; docs are read in-repo)
- **Entry:** [`docs/BUILD_GUIDE.md`](docs/BUILD_GUIDE.md)

## Purpose
A reusable system that turns a raw idea into shipped portfolio work. Two modes:
- **Project mode** — new app from scratch. One Claude Project walks through Phases 1, 2, 2.5, and 3 of `PRODUCT_BUILD_FRAMEWORK.md`, produces six handoff docs, hands off to Claude Code with a kickoff prompt.
- **Feature mode** (v0.2) — adding a feature to an existing app. Deep-scans the full 39-app portfolio for duplication + runs a 4-layer competitor teardown (feature matrix, UX teardown, review mining, technical approach), produces four feature-scoped artifacts that live inside the target app.

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
  CLAUDE_PROJECT_IDEA_KITCHEN.md   <- THE prompt — pasted into a Claude Project's System Prompt (includes both project + feature modes as of v0.2)
scripts/
  install-docs                     <- project-mode: moves 6 downloaded artifacts from ~/Downloads to portfolio/<slug>/docs/
  install-feature-docs             <- feature-mode: unzips + files 4 artifacts to portfolio/<target>/docs/features/<feature>/ + wires ROADMAP/CHANGELOG/LEARNINGS/HANDOFF/Obsidian hub
templates/
  APP_SHOWCASE_TEMPLATE.md         <- SHOWCASE structure (Project fills this in STEP 6)
  CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md   <- one-time Project Knowledge upload list
  SESSION_START_NEW_APP_EXAMPLE.md <- filled-in example of STEP 6 Block 6
  SESSION_START_EXISTING_APP.md    <- retroactive docs template (blank, for any existing app)
  FEATURE_BRIEF_TEMPLATE.md        <- v0.2 feature-mode brief skeleton (STEP 2F)
  FEATURE_PRD_TEMPLATE.md          <- v0.2 feature-mode PRD skeleton with verdict blocks (STEP 3F)
  FEATURE_DESIGN_TEMPLATE.md       <- v0.2 feature-mode design skeleton (STEP 4F)
  FEATURE_IMPL_PLAN_TEMPLATE.md    <- v0.2 feature-mode Claude Code SESSION_START kickoff (STEP 5F)
  SESSION_START_JOB_SEARCH_HQ.md         <- pre-filled: Job Search HQ
  SESSION_START_GMAT_MASTERY_WEB.md      <- pre-filled: GMAT Mastery Web
  SESSION_START_FAIRWAY_IOS.md           <- pre-filled: Fairway iOS
  SESSION_START_SHIPYARD.md              <- pre-filled: Shipyard
  SESSION_START_WELLNESS_TRACKER.md      <- pre-filled: Wellness Tracker
  SESSION_START_UNNAMED.md               <- pre-filled: Unnamed (web)
  SESSION_START_ROLLERTASK_TYCOON_WEB.md <- pre-filled: RollerTask Tycoon Web
  SESSION_START_SPEND_RADAR.md           <- pre-filled: Spend Radar
  SESSION_START_CLARITY_BUDGET_WEB.md    <- pre-filled: Clarity Budget Web
  SESSION_START_CLARITY_COMMAND.md       <- pre-filled: Clarity Command (web)
  SESSION_START_CLARITY_HUB.md           <- pre-filled: Clarity Hub
  SESSION_START_APP_FORGE.md             <- pre-filled: App Forge
  SESSION_START_KNOWLEDGE_BASE.md        <- pre-filled: Knowledge Base
  SESSION_START_FUNDED_WEB.md            <- pre-filled: Funded Web
  SESSION_START_AI_DEV_MASTERY.md        <- pre-filled: AI Dev Mastery
  SESSION_START_ALIAS_LEDGER.md          <- pre-filled: Alias Ledger
  SESSION_START_ASH_READER.md            <- pre-filled: Ash Reader (web)
  SESSION_START_SPEND_CLARITY.md         <- pre-filled: Spend Clarity (Python CLI)
  SESSION_START_SPEND_RADAR_WEB.md       <- pre-filled: Spend Radar Web
  SESSION_START_GMAIL_FORGE.md           <- pre-filled: Gmail Forge
  SESSION_START_CLAUDE_USAGE_TOOL.md     <- pre-filled: Claude Usage Tool
  SESSION_START_SHORTCUT_REFERENCE.md    <- pre-filled: Shortcut Reference
  SESSION_START_CLARITY_UI.md            <- pre-filled: ClarityUI (Swift package)
  SESSION_START_CLARITY_CHECKIN_IOS.md   <- pre-filled: Clarity Check-in iOS
  SESSION_START_CLARITY_TRIAGE_IOS.md    <- pre-filled: Clarity Triage iOS
  SESSION_START_CLARITY_TIME_IOS.md      <- pre-filled: Clarity Time iOS
  SESSION_START_CLARITY_BUDGET_IOS.md    <- pre-filled: Clarity Budget iOS
  SESSION_START_CLARITY_GROWTH_IOS.md    <- pre-filled: Clarity Growth iOS
  SESSION_START_CLARITY_COMMAND_IOS.md   <- pre-filled: Clarity Command iOS
  SESSION_START_WELLNESS_TRACKER_IOS.md  <- pre-filled: Wellness Tracker iOS
  SESSION_START_JOB_SEARCH_HQ_IOS.md     <- pre-filled: Job Search HQ iOS
  SESSION_START_ROLLER_TASK_TYCOON_IOS.md <- pre-filled: RollerTask Tycoon iOS
  SESSION_START_FUNDED_IOS.md            <- pre-filled: Funded iOS
  SESSION_START_SHIPYARD_IOS.md          <- pre-filled: Shipyard iOS
  SESSION_START_ASH_READER_IOS.md        <- pre-filled: Ash Reader iOS
  SESSION_START_UNNAMED_IOS.md           <- pre-filled: Unnamed iOS
  SESSION_START_ROLLER_TASK_TYCOON_VITE.md <- pre-filled: RollerTask Tycoon Vite (archived)
  SESSION_START_GROWTH_TRACKER_ARCHIVED.md <- pre-filled: Growth Tracker (archived)
  SESSION_START_MONEY_ARCHIVED.md        <- pre-filled: Money (archived)
```

## Tech Stack
- Markdown only. No build, no bundler, no runtime.
- Read in-repo or via GitHub web view. Shipyard (Phase 2) will render `docs/SHOWCASE.md` at `/ship/idea-kitchen`.

## Data Shape
n/a — docs-only.

## Current Features (v0.3)
- Claude Project system prompt (`prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md`) with **two modes**:
  - **Project mode** — 10-step flow (intake → pressure-test → Phases 1, 2, 2.5, 3 → milestones → artifacts → handoff → WIP → pattern capture). Produces 6 artifacts under `portfolio/<slug>/docs/`.
  - **Feature mode (v0.2)** — STEPs 0F → 7F (intake → cross-portfolio duplication scan with `EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL` verdict → 4-layer competitor research → brief → PRD → design → impl plan → handoff). Produces 4 artifacts under `portfolio/<target-app>/docs/features/<feature-slug>/`.
- Master build guide (`docs/BUILD_GUIDE.md`) — now 13 sections with **section 4b dedicated to feature mode** including the sprinkler-map worked walkthrough.
- SHOWCASE template (`templates/APP_SHOWCASE_TEMPLATE.md`) — what Shipyard parses (project mode).
- 4 feature-mode templates (`templates/FEATURE_{BRIEF,PRD,DESIGN,IMPL_PLAN}_TEMPLATE.md`).
- Project Knowledge manifest (`templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md`) — one-time upload list (includes the 4 feature templates).
- Filled session-start example (`templates/SESSION_START_NEW_APP_EXAMPLE.md`) — reference shape.
- `scripts/install-docs` (project mode) + `scripts/install-feature-docs` (feature mode) — idempotent installers that file artifacts, wire every portfolio tracking surface, and create/update the Obsidian hub.
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
- **Pre-filled SESSION_START templates stay in sync with their source app.** When any app's `CLAUDE.md` or `HANDOFF.md` changes materially, update the corresponding `templates/SESSION_START_<SLUG>.md` and re-upload it to the live Claude Project. Full list of 39 pre-filled templates is in `templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md` under "Pre-filled app templates."
- Every new app produced by Idea Kitchen gets a hub note at `brain/02-Projects/<slug>/README.md` in the Obsidian vault (iCloud path: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/brain/`). Obsidian is the **index**, not a mirror — hub notes carry frontmatter + wikilinks; repo docs stay source of truth. Hub-note schema lives in the vault's own `CLAUDE.md`. Do not `git add` the Obsidian vault — it lives in iCloud, not the monorepo.
- **Feature mode (v0.2) Obsidian integration:** every feature produced by feature mode gets its own hub at `brain/02-Projects/<target>/features/<feature-slug>.md` (created automatically by `scripts/install-feature-docs`), and the parent app's Obsidian hub gets a `[[features/<slug>|<slug>]]` link under a `## Features` section. Same rule — do not `git add` the vault.
- **Feature mode does NOT add rows to the root `CLAUDE.md` portfolio table.** Features live under their parent app. Only app-level changes (new app, new platform variant, category/tagline change) trigger a root-table update + `npm run sync:projects`.

## How to Extend
1. Read `docs/BUILD_GUIDE.md` first.
2. Changes to the prompt → update `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md`. Bump the build-guide section references if the step numbers change.
3. Changes to the manifest → re-upload the named files to the live Claude Project.
4. New templates → add under `templates/`, document them in `docs/BUILD_GUIDE.md`. Feature-mode templates (v0.2) are `FEATURE_BRIEF_TEMPLATE.md`, `FEATURE_PRD_TEMPLATE.md`, `FEATURE_DESIGN_TEMPLATE.md`, `FEATURE_IMPL_PLAN_TEMPLATE.md`.
5. Changes to `scripts/install-feature-docs` → test idempotency (running twice must not duplicate ROADMAP/CHANGELOG/LEARNINGS/Obsidian-link entries).
6. Every session where you touch this app, update `CHANGELOG.md`, `HANDOFF.md`, `LEARNINGS.md`, and (if structure changed) `docs/SHOWCASE.md`.
