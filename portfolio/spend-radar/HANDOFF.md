# Spend Radar — Handoff

## Quick State

| Field | Value |
|---|---|
| **Focus** | Initial setup — needs new Apps Script project created at script.google.com |
| **Last touch** | Apr 16, 2026 — extracted from Inbox Zero; project scaffolded |
| **Next** | Create Apps Script project → paste subscriptions.gs → set SHEET_ID → run setupOnOpenTrigger() |
| **Script ID** | not yet created |
| **Sheet** | https://docs.google.com/spreadsheets/d/1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54/edit |

---

## Status

- [x] Code extracted from Inbox Zero into `apps-script/subscriptions.gs`
- [x] CLAUDE.md written
- [ ] Apps Script project created at script.google.com
- [ ] `.clasp.json` created with Script ID
- [ ] `SHEET_ID` set in Script Properties
- [ ] `setupOnOpenTrigger()` run once
- [ ] "Spend Radar" menu confirmed in Sheet
- [ ] `debugSubscriptions()` run to confirm Receipt label has data

---

## First-time setup steps

1. Go to [script.google.com](https://script.google.com) → **New project** → rename to "Spend Radar"
2. Delete the default `Code.gs` file
3. Create a new file `subscriptions.gs` → paste contents of `apps-script/subscriptions.gs`
4. **Settings → Script Properties** → add row: `SHEET_ID` = `1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54`
5. Select function **`setupOnOpenTrigger`** → Run → authorize Gmail + Sheets scopes
6. Open the [Sheet](https://docs.google.com/spreadsheets/d/1OT1Jtrp2jaVPVUCZGKnFwf8NwAK0h3PA447VZHYJP54/edit) → reload → **Spend Radar** menu appears
7. Copy the Script ID from the URL (`/d/<SCRIPT_ID>/edit`) → create `apps-script/.clasp.json`:
   ```json
   {"scriptId":"PASTE_ID_HERE","rootDir":"."}
   ```
8. Future deploys: `cd apps-script && npx clasp push --force`
