# PRD — Idea Kitchen

## V1 features

1. **Claude Project system prompt** — `prompts/CLAUDE_PROJECT_IDEA_KITCHEN.md` with 10 numbered steps.
   **Done when:** a fresh Project chat can take a raw idea through STEPs 0–9 and produce 6 fenced artifact blocks in STEP 6 without re-asking context already in Project Knowledge.

2. **Master build guide** — `docs/BUILD_GUIDE.md` explaining the whole workflow.
   **Done when:** a new user (or future-Chase) can read the guide end-to-end and set up + run one idea without any other context.

3. **Three templates** — SHOWCASE, Knowledge Manifest, SESSION_START example.
   **Done when:** the prompt's STEP 6 references these templates by path, and the templates have no `<placeholder>` tokens without a clear replacement rule.

4. **Dogfooded foundation docs** — Idea Kitchen carries its own Phase 1/2/2.5/3 outputs.
   **Done when:** `docs/PRODUCT_BRIEF.md`, `docs/PRD.md`, `docs/BRANDING.md`, `docs/APP_FLOW.md`, `docs/SHOWCASE.md` exist and are internally consistent with the app's actual state.

5. **Portfolio integration** — Idea Kitchen appears in root `CLAUDE.md` tables + Shipyard.
   **Done when:** Portfolio Overview row added, Shipyard metadata row added, `npm run sync:projects` succeeds and `/ship/idea-kitchen` renders (tile, even pre-Phase-2).

## NOT in V1

- Shipyard rendering `SHOWCASE.md` at `/ship/<slug>` — Phase 2.
- Static HTML minisite generator — Phase 2.
- Migrating existing apps to carry `SHOWCASE.md` — Phase 3.
- Auto-scaffolding scripts that run the whole STEP 7 checklist end-to-end — Phase 3.
- Vercel deploy for Idea Kitchen itself — docs-only, no runtime.
- Linear auto-project creation at scaffold time — Phase 3 idea.
- Pre-commit hook enforcing CHANGELOG / LEARNINGS / SHOWCASE freshness — Phase 3 idea.
- Versioned prompt releases (v0.2, v0.3 branches) — not yet needed.

## Constraints

- **Platform:** markdown only. No build, no bundler, no runtime.
- **Storage:** files in the monorepo. No database. No localStorage.
- **Stack defaults from repo root `CLAUDE.md`:** this app doesn't use them (docs-only), but the apps it produces do.
- **Public repo:** everything tracked is world-readable. No secrets, no real financial data, no real names tied to private data.
- **Accessibility:** docs render fine in any reader. Nothing fancy that breaks VoiceOver or low-vision reading.

## Success metrics

- **Primary:** Chase uses Idea Kitchen for at least 2 new apps in the next 30 days without falling back to ad-hoc prompting.
- **Secondary:** Average session token count for "create new app" drops by ≥30% compared to prior ad-hoc flow.

## Risks

- **Prompt rot.** The system prompt assumes Project Knowledge stays fresh. If uploads drift, the Project starts re-asking context.
  **Mitigation:** `templates/CLAUDE_PROJECT_KNOWLEDGE_MANIFEST.md` includes refresh cadence (monthly). `docs/BUILD_GUIDE.md` calls it out in the setup section.

- **Shipyard parsing contract.** `SHOWCASE.md` section headers are load-bearing. If someone renames them, Shipyard (once Phase 2 ships) breaks.
  **Mitigation:** document the contract in `APP_SHOWCASE_TEMPLATE.md` header comment + `CLAUDE.md` Constraints & Gotchas.

- **Dogfood drift.** If Idea Kitchen's own docs get out of sync with what it teaches, the system stops being trustworthy.
  **Mitigation:** end-of-session checklist applies to Idea Kitchen itself. Session 0 (this one) is the example.
