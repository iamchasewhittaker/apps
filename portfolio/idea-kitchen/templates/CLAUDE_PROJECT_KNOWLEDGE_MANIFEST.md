# Claude Project Knowledge Manifest

> Files to upload as **Project Knowledge** in the Idea Kitchen Claude Project (claude.ai). Upload once, refresh monthly or when a file changes materially.

Paths are relative to `~/Developer/chase/` unless noted.

---

## Must upload (required for the Project to behave correctly)

1. `CLAUDE.md` — repo root. Portfolio tables, conventions, tech stack, storage rules.
2. `PRODUCT_BUILD_FRAMEWORK.md` — the 6-phase framework. The Project follows Phases 1, 2, 2.5, 3 explicitly.
3. `identity/direction.md` — Chase's committed career direction. Informs framing when identity is on.
4. `identity/voice-brief.md` — voice rules (no em-dashes, no hype, no consultant phrasing).
5. `identity/friend-feedback.md` — how people outside Chase describe him. Used for naming + brand tone.
6. `identity/kassie-notes.md` — operating doctrine, family-urgency framing.
7. `identity/strengths/` — CliftonStrengths Top 5 + all 34. Used for naming + brand voice.
8. `docs/templates/PORTFOLIO_APP_BRANDING.md` — branding template the Project fills in STEP 3.5.
9. `docs/templates/PORTFOLIO_APP_LOGO.md` — logo conventions the Project references in STEP 3.5.
10. `docs/templates/SESSION_START_MONOREPO.md` — kickoff prompt shape the Project follows in STEP 6 Block 6.
11. `portfolio/idea-kitchen/templates/APP_SHOWCASE_TEMPLATE.md` — SHOWCASE structure used in STEP 6 Block 5.
12. `.claude/projects/-Users-chase-Developer-chase/memory/MEMORY.md` — Chase's cross-session memory index.
13. `portfolio/idea-kitchen/templates/SESSION_START_EXISTING_APP.md` — retroactive doc template for already-shipped apps (skip pressure-test, focus on SHOWCASE).
14. `portfolio/idea-kitchen/templates/FEATURE_BRIEF_TEMPLATE.md` — feature-mode brief skeleton (STEP 2F).
15. `portfolio/idea-kitchen/templates/FEATURE_PRD_TEMPLATE.md` — feature-mode PRD skeleton with verdict-block placeholders (STEP 3F).
16. `portfolio/idea-kitchen/templates/FEATURE_DESIGN_TEMPLATE.md` — feature-mode design skeleton: screens, components, states, a11y, data delta (STEP 4F).
17. `portfolio/idea-kitchen/templates/FEATURE_IMPL_PLAN_TEMPLATE.md` — feature-mode Claude Code SESSION_START kickoff skeleton (STEP 5F output).

## Pre-filled app templates (upload when running retroactive docs for that app)

These are ready-to-paste session starts for specific apps. Upload the one you need before starting a retroactive session, then remove it when done (reduces noise).

**Web apps:**
- `portfolio/idea-kitchen/templates/SESSION_START_JOB_SEARCH_HQ.md`
- `portfolio/idea-kitchen/templates/SESSION_START_GMAT_MASTERY_WEB.md`
- `portfolio/idea-kitchen/templates/SESSION_START_SHIPYARD.md`
- `portfolio/idea-kitchen/templates/SESSION_START_WELLNESS_TRACKER.md`
- `portfolio/idea-kitchen/templates/SESSION_START_UNNAMED.md`
- `portfolio/idea-kitchen/templates/SESSION_START_ROLLERTASK_TYCOON_WEB.md`
- `portfolio/idea-kitchen/templates/SESSION_START_SPEND_RADAR.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_BUDGET_WEB.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_COMMAND.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_HUB.md`
- `portfolio/idea-kitchen/templates/SESSION_START_APP_FORGE.md`
- `portfolio/idea-kitchen/templates/SESSION_START_KNOWLEDGE_BASE.md`
- `portfolio/idea-kitchen/templates/SESSION_START_FUNDED_WEB.md`
- `portfolio/idea-kitchen/templates/SESSION_START_AI_DEV_MASTERY.md`
- `portfolio/idea-kitchen/templates/SESSION_START_ALIAS_LEDGER.md`
- `portfolio/idea-kitchen/templates/SESSION_START_ASH_READER.md`

**CLI / desktop / other:**
- `portfolio/idea-kitchen/templates/SESSION_START_SPEND_CLARITY.md`
- `portfolio/idea-kitchen/templates/SESSION_START_SPEND_RADAR_WEB.md`
- `portfolio/idea-kitchen/templates/SESSION_START_GMAIL_FORGE.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLAUDE_USAGE_TOOL.md`
- `portfolio/idea-kitchen/templates/SESSION_START_SHORTCUT_REFERENCE.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_UI.md`

**iOS apps:**
- `portfolio/idea-kitchen/templates/SESSION_START_FAIRWAY_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_CHECKIN_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_TRIAGE_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_TIME_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_BUDGET_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_GROWTH_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_CLARITY_COMMAND_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_WELLNESS_TRACKER_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_JOB_SEARCH_HQ_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_ROLLER_TASK_TYCOON_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_FUNDED_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_SHIPYARD_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_ASH_READER_IOS.md`
- `portfolio/idea-kitchen/templates/SESSION_START_UNNAMED_IOS.md`

**Archived apps (use when documenting history):**
- `portfolio/idea-kitchen/templates/SESSION_START_ROLLER_TASK_TYCOON_VITE.md`
- `portfolio/idea-kitchen/templates/SESSION_START_GROWTH_TRACKER_ARCHIVED.md`
- `portfolio/idea-kitchen/templates/SESSION_START_MONEY_ARCHIVED.md`

> **Keep these current:** When an app's `CLAUDE.md` or `HANDOFF.md` changes materially, regenerate its `SESSION_START_<SLUG>.md` so the pre-filled content stays accurate. See `portfolio/idea-kitchen/CLAUDE.md` → Constraints & Gotchas.

## Nice to upload (helpful, not required)

- `ROADMAP.md` (repo root) — current priorities across the portfolio.
- `HANDOFF.md` (repo root) — what's in flight right now.
- `identity/patterns.md` — captured patterns from prior Idea Kitchen sessions.

## Do NOT upload

- `.env*`, `.env.supabase`, any file containing secrets.
- Archived app folders (`portfolio/archive/*`) — noise.
- iOS xcodeproj bundles (binary, won't help the Project).
- Database dumps, CSVs, SQL migrations — the Project doesn't need them.

---

## Refresh cadence

| File | When to re-upload |
|---|---|
| `CLAUDE.md` | Monthly, or when portfolio tables change materially |
| `PRODUCT_BUILD_FRAMEWORK.md` | When the framework itself is revised |
| `identity/*` | When voice, direction, or strengths framing evolves |
| Templates (project + feature) | When the template shape changes |
| `FEATURE_*_TEMPLATE.md` (4 files) | When feature-mode structure evolves (v0.2+) |
| `MEMORY.md` | Monthly |
| `SESSION_START_<SLUG>.md` (pre-filled) | When the app's `CLAUDE.md` or `HANDOFF.md` changes materially |

## How to upload

1. Open the Idea Kitchen Claude Project on claude.ai.
2. Click **Project Knowledge** → **Add files**.
3. Drag the files from Finder (or use the upload dialog).
4. Save.
5. Test: start a new chat and ask *"What's in your Project Knowledge?"* — the Project should name the files.

## Verification

When the Project is set up correctly, it should:

- Know the portfolio table without asking.
- Know Chase's voice rules without being reminded.
- Reference the 6-phase framework by number.
- Follow the SHOWCASE template shape exactly in STEP 6.

If any of those fail, re-upload the corresponding file and retest.
