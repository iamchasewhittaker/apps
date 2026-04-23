# SESSION_START — Funded Web Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Funded Web is a stable v1.0 app.
**App:** Funded Web
**Slug:** funded-web
**One-liner:** Standalone YNAB dashboard split from Clarity Hub — view budget categories, track spending vs. target, and assign funds; companion to Funded iOS.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is at v1.0; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/funded-web`
2. **BRANDING.md** — YNAB green + clean finance aesthetic, "funded" confidence framing
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v1.0 shipped scope; V2 = add YNAB category assign (Fund) flow
5. **APP_FLOW.md** — document the YNAB fetch → category view → fund assignment flow
6. **SESSION_START_funded-web.md** — stub only

Output paths: `portfolio/funded-web/docs/`

---

## App context — CLAUDE.md

**Version:** v1.0
**Stack:** React CRA + inline styles + localStorage
**Storage key:** `chase_hub_ynab_v1`
**URL:** local only (not deployed)
**Entry:** `src/App.jsx`

**What this app is:**
A standalone YNAB budget companion split from the Budget tab in Clarity Hub. Shows current month's YNAB budget categories, spending vs. target, and available amounts. Designed to eventually support the Fund flow (assign money to categories, same as Funded iOS).

**YNAB integration:**
- Personal Access Token stored in localStorage (not committed)
- Reads current month's budget categories via YNAB API
- Does NOT write back to YNAB yet (V2 goal)

**Relationship to other apps:**
- Shares `chase_hub_ynab_v1` storage key with the Budget tab in Clarity Hub (for continuity)
- iOS companion: `portfolio/funded-ios/` — has YNAB read + PATCH assign (Fund) with Keychain auth
- Web will eventually match iOS functionality

**Brand system:**
- Green accent (`#22c55e`) — YNAB association, "funded" confidence
- Clean, numbers-first — category name, available, activity, budgeted
- Voice: calm, factual — "here is where you stand"

---

## App context — HANDOFF.md

**Version:** v1.0
**Focus:** Stable. YNAB read works; Fund (write) flow not yet implemented.
**Last touch:** 2026-04-21

**Next (V2 candidates):**
- Add YNAB category assign (Fund) flow — matches Funded iOS capability
- Deploy to Vercel once Fund flow is in place
- Add "available to assign" total at the top
- Pull in YNAB account balances for a full snapshot
