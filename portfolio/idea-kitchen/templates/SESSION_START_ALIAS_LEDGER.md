# SESSION_START — Alias Ledger Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Alias Ledger is a live deployed v1.0 app.
**App:** Alias Ledger
**Slug:** alias-ledger
**One-liner:** Single-file HTML Hide My Email alias tracker — no build step, no framework; search, tag, and manage your Apple HME aliases from any browser.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is at v1.0 and live; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/alias-ledger`
2. **BRANDING.md** — minimal utility aesthetic, privacy/shield theme
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v1.0 shipped scope; note intentionally minimal by design
5. **APP_FLOW.md** — document the add alias → tag → search → mark active/inactive flow
6. **SESSION_START_alias-ledger.md** — stub only

Output paths: `portfolio/alias-ledger/docs/`

---

## App context — CLAUDE.md

**Version:** v1.0
**Stack:** Single-file HTML — no build step, no framework, no bundler
**Storage key:** `hme_alias_tracker_v1`
**URL:** alias-ledger.vercel.app
**Entry:** `index.html` (all HTML, CSS, and JS in one file)

**What this app is:**
A personal tracker for Apple Hide My Email (HME) aliases. Apple generates unique email addresses per service, but there's no built-in way to search or organize them. Alias Ledger stores the alias → service mapping, lets you tag and search aliases, and marks them active/inactive. Single-file HTML: no build, no framework, one file to deploy.

**Key features (v1.0):**
- Add/edit/delete aliases with service name, HME address, and tags
- Search across aliases, service names, and tags
- Mark aliases active or inactive
- Export as JSON (backup)
- All data in localStorage (`hme_alias_tracker_v1`)

**Design philosophy:**
- Intentionally zero-dependency — if Apple or Vercel changes something, there's nothing to update
- Single file: the entire app fits in one `index.html`
- Deployed to Vercel as a static asset (no build step)

**Brand system:**
- Shield / privacy metaphor — protecting identity, managing exposure
- Minimal palette — utility-first, nothing distracting
- Voice: matter-of-fact — "alias for Netflix. active. created 2025-06."

---

## App context — HANDOFF.md

**Version:** v1.0
**Focus:** Stable and live. Used regularly to track HME aliases.
**Last touch:** 2026-04-21

**Next (V2 candidates — low priority):**
- Add a "last used" timestamp (manually entered)
- Add bulk import from Apple's export format (if Apple ever adds one)
- Add a view to show aliases by tag (current: flat list with search)
