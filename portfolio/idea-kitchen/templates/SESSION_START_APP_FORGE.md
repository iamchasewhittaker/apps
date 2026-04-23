# SESSION_START — App Forge Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — App Forge is a stable v8.1 app.
**App:** App Forge
**Slug:** app-forge
**One-liner:** Web workbench for building and auditing new portfolio apps — the predecessor to Shipyard; still in use for rapid app scaffolding and review.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is stable; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/app-forge`
2. **BRANDING.md** — forge/workshop metaphor, portfolio tooling aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below; note the Shipyard succession story
4. **PRD.md** — reflect v8.1 shipped scope; note App Forge's role vs. Shipyard going forward
5. **APP_FLOW.md** — document the app scaffolding and audit workflow
6. **SESSION_START_app-forge.md** — stub only

Output paths: `portfolio/app-forge/docs/`

---

## App context — CLAUDE.md

**Version:** v8.1
**Stack:** React CRA + inline styles + localStorage
**Storage key:** `chase_forge_v1`
**URL:** local only (not deployed)
**Entry:** `src/App.jsx` (monolith — not yet refactored)

**What this app is:**
A portfolio audit and build workbench. Used before Shipyard existed to track app status, scaffolding decisions, and build progress across the portfolio. Still useful for rapid prototyping and app-level decision tracking.

**Architecture:**
- Monolith: `App.jsx` is a single large file (not yet split into tabs/components)
- `chase_forge_v1` localStorage blob holds all state
- No Supabase sync
- No auth gate

**Relationship to Shipyard:**
App Forge was the manual predecessor. Shipyard (`portfolio/shipyard/`) is the automated fleet command center with Supabase-backed project data, Vercel integrations, and a polished UI. App Forge is kept as a local scratchpad.

**Brand system:**
- Forge / workshop metaphor — building tools for building tools
- Minimal branding; utility-first aesthetic

---

## App context — HANDOFF.md

**Version:** v8.1
**Focus:** Stable. Used locally as a scratchpad; Shipyard is now the canonical portfolio view.
**Last touch:** 2026-04-21

**Next:**
No active development planned. May be archived once Shipyard covers all App Forge use cases. If archived, move to `portfolio/archive/app-forge/`.
