# Spend Radar — Claude Instructions

## Project
Standalone subscription tracker. Scans Gmail `label:Receipt` emails, detects recurring charges, and surfaces them in a Google Sheet "Subscriptions" tab.

Intentionally separate from Inbox Zero — same Sheet, different Apps Script project.

**Owner:** chase.t.whittaker@gmail.com
**Sheet:** https://docs.google.com/spreadsheets/d/1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54/edit
**Apps Script:** `apps-script/subscriptions.gs` (deploy via clasp or paste into script.google.com)

---

## Architecture

```
Gmail label:Receipt (last 180d)
  ↓ group by sender email
  ↓ keep ≥2 receipts (recurring signal)
  ↓ extract amount, cadence, next charge estimate
  → write "Subscriptions" tab in Google Sheet
```

Runs only when triggered manually via the Sheet menu: **Spend Radar → Refresh Subscriptions**.

---

## Script Properties

| Property | Value | Notes |
|---|---|---|
| `SHEET_ID` | `1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54` | Same Sheet as Inbox Zero |

---

## Setup (new machine / new project)

1. Go to script.google.com → New project → name it "Spend Radar"
2. Delete default `Code.gs`, paste `apps-script/subscriptions.gs`
3. Settings → Script Properties → add `SHEET_ID`
4. Run `setupOnOpenTrigger()` once → authorize Gmail + Sheets
5. Open the Sheet → "Spend Radar" menu appears
6. Update `.clasp.json` with the new Script ID for future `clasp push` deploys

---

## Deploy via clasp

```bash
cd apps-script
npm install
# First time: create project at script.google.com, get Script ID, create .clasp.json
# echo '{"scriptId":"YOUR_SCRIPT_ID","rootDir":"."}' > .clasp.json
npx clasp push --force
```

---

## Columns (Subscriptions tab)

| Column | Description |
|---|---|
| Service | Pretty name (Spotify, Anthropic, etc.) |
| Sender Domain | e.g. spotify.com |
| Sender Email | Full sender address |
| Last Amount | $ extracted from subject/body |
| Cadence | Weekly / Monthly / Quarterly / Yearly / Irregular (~Nd) |
| Last Charge | Date of most recent receipt |
| Est. Next Charge | Last Charge + median cadence |
| Receipts (180d) | Count in window |
| Status | Active / Lapsed? |

---

## Related projects

- **Inbox Zero** (`../inbox-zero/`) — labels mail as `Receipt`; those labels are what this project reads
- **Spend Clarity** (`../spend-clarity/`) — Python CLI that enriches YNAB transactions from the same `label:Receipt` pool
