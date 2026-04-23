# SESSION_START — Spend Radar Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Spend Radar is code-complete and awaiting one-time user setup.
**App:** Spend Radar
**Slug:** spend-radar
**One-liner:** Google Apps Script tool that scans Gmail `label:Receipt` emails (last 180 days), detects recurring subscriptions via rule-based sender matching, and writes structured data to a Google Sheet — no AI, no paid tools; companion CRA web dashboard visualizes the output.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is code-complete; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/spend-radar`
2. **BRANDING.md** — teal/cyan accent palette (see Brand System below)
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect actual shipped scope (Phases A–G); next phases in V2
5. **APP_FLOW.md** — document the Gmail → Apps Script → Sheet → web dashboard flow
6. **SESSION_START_spend-radar.md** — stub only

Output paths: `portfolio/spend-radar/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** Google Apps Script (6 `.gs` files) + dedicated Google Sheet + companion CRA web dashboard (`portfolio/spend-radar-web/`)
**Deploy:** Apps Script deployed via clasp or paste into script.google.com
**Owner:** chase.t.whittaker@gmail.com
**Script Properties:** `SHEET_ID`, `GMAIL_FORGE_WEB_APP_URL` (optional), `GMAIL_FORGE_TRIGGER_TOKEN` (optional), `DASHBOARD_URL` (optional)

**What this app is:**
A Google Apps Script tool that scans Gmail `label:Receipt` emails (last 180 days), detects recurring subscriptions via rule-based sender matching (`SENDER_RULES`), and writes structured data to a dedicated Google Sheet — no AI parsing, no paid tools. Runs on-demand from the Sheet menu. A read-only CRA web dashboard (`spend-radar-web`) reads the Sheet's published CSV and visualizes monthly/yearly totals and cancel candidates.

**Data flow:**
```
Gmail label:Receipt (last 180d)
  ↓ per-thread first message
  ├─→ extraction.gs  (SENDER_RULES + heuristic fallback, API-free)
  │     ↓ { merchant, item, amount, category, source }
  ├─→ refreshSubscriptions() → "Subscriptions" tab (recurring ≥2 receipts)
  └─→ refreshReceipts()     → "Receipts" tab (one row per thread)

auditLastRun()    → "Audit" tab (rules-based flags; yellow row shading)
refreshAllApps()  → Spend Radar + Gmail Forge autoSort() via tokenized UrlFetchApp
```

**6-file Apps Script layout:**
- `subscriptions.gs` — menu, triggers, `refreshSubscriptions`, `createDedicatedSheet`
- `receipts.gs` — `refreshReceipts` + Receipts tab
- `extraction.gs` — `SENDER_RULES` (17+ merchants) + heuristic fallback + amount regex
- `audit.gs` — `auditLastRun` + 6 flag rules + yellow row shading
- `triggers.gs` — `refreshAll`, `refreshAllApps` (tokenized), `openDashboard`
- `helpers.gs` — shared utilities (email/domain extraction, cadence math, amount parsing)

**Web dashboard (`spend-radar-web`):**
- CRA app reading the Sheet's published CSV
- Monthly/yearly totals, cancel candidates view
- Read-only — no write-back to Sheet
- Storage key: `chase_spend_radar_web_v1`

**Brand system:**
- Teal/cyan accent palette (see `docs/BRANDING.md`)
- Radar / scan metaphor — precision, signal-vs-noise
- Voice: analytical and direct — "here's what you're paying, here's what to cut"

**Intentionally separate from Gmail Forge** — same `label:Receipt` source, different Apps Script project, different Sheet.

---

## App context — HANDOFF.md

**Focus:** Code complete through Phase G. Awaiting user one-time setup.
**Last touch:** 2026-04-16 — Phases A–G landed (docs, 6-file script split, Receipts/Audit tabs, cross-project button, spend-radar-web CRA scaffold)

**One-time setup (user action required):**
1. Create dedicated Sheet via `createDedicatedSheet()` from editor
2. Set `SHEET_ID` in Script Properties
3. Deploy Apps Script as web app, set `DASHBOARD_URL`
4. Optionally: set `GMAIL_FORGE_WEB_APP_URL` + `GMAIL_FORGE_TRIGGER_TOKEN` for cross-app Refresh All

**Next after setup:** Verify `Refresh All` + `Audit Last Run` → deploy `spend-radar-web` to Vercel once CSV URLs are pasted into `src/constants.js`
