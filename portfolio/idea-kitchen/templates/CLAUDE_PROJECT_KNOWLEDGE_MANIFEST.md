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
| Templates | When the template shape changes |
| `MEMORY.md` | Monthly |

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
