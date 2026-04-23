# SESSION_START — Spend Radar Web Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Spend Radar Web is a functional v0.1 CRA scaffold, not yet deployed.
**App:** Spend Radar Web
**Slug:** spend-radar-web
**One-liner:** Read-only CRA dashboard that reads the Spend Radar Google Sheet's published CSV and visualizes monthly/yearly subscription totals and cancel candidates.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The scaffold exists; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/spend-radar-web`
2. **BRANDING.md** — teal/cyan palette (matches Spend Radar backend), radar/scan metaphor
3. **PRODUCT_BRIEF.md** — distill from context below; note read-only, no write-back to Sheet
4. **PRD.md** — reflect v0.1 scaffold scope; V2 = deploy after CSV URLs are set
5. **APP_FLOW.md** — document the Sheet CSV fetch → subscription list → totals → cancel candidates flow
6. **SESSION_START_spend-radar-web.md** — stub only

Output paths: `portfolio/spend-radar-web/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** React CRA (Create React App) + localStorage
**Storage key:** `chase_spend_radar_web_v1`
**URL:** not deployed (local only; pending CSV URL setup)
**Entry:** `src/App.jsx`

**What this app is:**
A read-only companion dashboard for Spend Radar (the Google Apps Script backend). Reads the Spend Radar Google Sheet's published CSV endpoints and renders: monthly/yearly subscription totals, a list of active subscriptions with amounts, and a "cancel candidates" view (subscriptions not used recently or above a threshold).

**Data source:**
- Google Sheet published as CSV (two tabs: Subscriptions + Receipts)
- CSV URLs must be pasted into `src/constants.js` before deploy (not committed — sheet is private)
- No write-back to Sheet — read-only

**Relationship to Spend Radar:**
- `portfolio/spend-radar/` is the Apps Script backend (Gmail → Sheet)
- This app (`spend-radar-web`) is the visualization layer — reads the Sheet output

**Brand system:**
- Teal/cyan accent (`#06b6d4`) — matches Spend Radar backend branding
- Radar / scan metaphor: precision, signal-vs-noise
- Voice: analytical and direct — "here's what you're paying, here's what to cut"

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** Scaffold complete. Blocked on Spend Radar backend one-time setup (Sheet CSV URLs).
**Last touch:** 2026-04-21

**Deployment blocker:**
1. Complete Spend Radar one-time setup (create Sheet, set `SHEET_ID`, deploy Apps Script web app)
2. Grab the two published CSV URLs from the Sheet (File → Share → Publish to Web → CSV)
3. Paste URLs into `src/constants.js`
4. `npm run build` → `vercel --prod`

**Next after deploy:**
- Add date-range filter (last 30 / 90 / 180 days)
- Add per-merchant sparkline (months active)
- Link to Gmail Forge Review Queue for receipts that didn't match
