# Spend Radar — Claude Instructions

## Project
Standalone subscription + receipt tracker. Scans Gmail `label:Receipt` emails (last 180d), detects recurring charges and parses per-receipt merchant/item/amount, and writes two tabs to a dedicated Google Sheet.

Companion web dashboard lives at [`portfolio/spend-radar-web/`](../spend-radar-web/) — read-only, reads the Sheet's published CSV.

Intentionally separate from Gmail Forge — same `label:Receipt` source, different Apps Script project, different Sheet.

- **Owner:** chase.t.whittaker@gmail.com
- **Sheet:** dedicated — create via `createDedicatedSheet()` from the editor on first setup
- **Apps Script:** `apps-script/*.gs` (6 files — deploy via clasp or paste into script.google.com)
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — teal/cyan accent; do not restate full rules in session prompts.

---

## Architecture

```
Gmail label:Receipt (last 180d)
  ↓ per-thread first message
  ├─→ extraction.gs           (SENDER_RULES + heuristic fallback, API-free)
  │     ↓
  │     { merchant, item, amount, category, source }
  ↓
  ├─→ refreshSubscriptions()  → "Subscriptions" tab (aggregated recurring ≥2 receipts)
  └─→ refreshReceipts()       → "Receipts" tab (one row per thread)

auditLastRun()                → "Audit" tab (rules-based flags; shades home-tab rows yellow)
refreshAllApps()              → Spend Radar + Gmail Forge autoSort() via tokenized UrlFetchApp
```

Runs only when triggered manually via the Sheet menu: **Spend Radar → …**.

---

## File layout (apps-script/)

| File | Owns |
|------|------|
| `subscriptions.gs` | `onOpen`, `setupOnOpenTrigger`, `createDedicatedSheet`, `refreshSubscriptions`, `summarizeSubscription_`, `debugSubscriptions`, `healthCheck`, Subscriptions tab headers |
| `receipts.gs` | `refreshReceipts`, Receipts tab headers |
| `extraction.gs` | `SENDER_RULES` table, `extractReceipt_`, prioritized amount regex, fallback heuristics |
| `audit.gs` | `auditLastRun`, Audit tab headers, flag rules, yellow-row shading |
| `triggers.gs` | `refreshAll`, `refreshAllApps`, `openDashboard` |
| `helpers.gs` | `extractEmail_`, `extractDomain_`, `extractDisplayName_`, `medianGapDays_`, `cadenceLabelForDays_`, `monthlyEquivalent_`, `parseDollarAmount_`, `formatDollar_`, `gmailThreadLink_` |

---

## Script Properties

| Property | Required | Value / Notes |
|---|---|---|
| `SHEET_ID` | ✅ | Dedicated Spend Radar Sheet. Create via `createDedicatedSheet()`, paste logged ID here. |
| `GMAIL_FORGE_WEB_APP_URL` | optional | Deployed `doGet` URL from `portfolio/gmail-forge/apps-script/`. Required for `Refresh All Apps`. |
| `GMAIL_FORGE_TRIGGER_TOKEN` | optional | Shared secret (UUID) — must match `TRIGGER_TOKEN` in Gmail Forge's Script Properties. |
| `DASHBOARD_URL` | optional | `spend-radar-web.vercel.app` — wired into the `Open Dashboard` menu item. |

> **Security:** `GMAIL_FORGE_TRIGGER_TOKEN` is a shared secret between Gmail Forge and Spend Radar. Never commit. Rotate (regenerate UUID, update both Script Properties) if leaked.

---

## Setup (new machine / new project)

1. Go to [script.google.com](https://script.google.com) → New project → name it "Spend Radar"
2. Delete default `Code.gs`; paste all 6 `.gs` files from `apps-script/`
3. Run `createDedicatedSheet()` once → copy logged ID
4. Settings → Script Properties → add `SHEET_ID` = <copied ID>
5. (Optional) Add `GMAIL_FORGE_WEB_APP_URL`, `GMAIL_FORGE_TRIGGER_TOKEN`, `DASHBOARD_URL`
6. Run `setupOnOpenTrigger()` once → authorize Gmail + Sheets + UrlFetch
7. Open the Sheet → "Spend Radar" menu appears
8. Update `.clasp.json` with the new Script ID for future `clasp push` deploys

---

## Deploy via clasp

```bash
cd apps-script
npm install
# First time: create project at script.google.com, get Script ID, create .clasp.json
# cp .clasp.json.example .clasp.json && edit
npx clasp push --force
```

---

## Columns

### Subscriptions tab
| Column | Description |
|---|---|
| Service | Pretty name from `SENDER_RULES`; fallback to From display name or domain root |
| Category | Streaming / AI Tools / Software / Utilities / Retail / Food / Transport / Finance / Insurance / Other |
| Sender Domain | e.g. spotify.com |
| Sender Email | Full sender address |
| Last Amount | $ extracted from subject/body |
| Cadence | Weekly / Monthly / Quarterly / Yearly / Irregular (~Nd) |
| Last Charge | Date of most recent receipt |
| Est. Next Charge | Last Charge + median cadence |
| Receipts (180d) | Count in window |
| Status | Active / Lapsed? |

Two summary rows appended (bold): `Monthly est.` and `Yearly est.` (Active only, normalized).

### Receipts tab
| Column | Description |
|---|---|
| Date | Message date |
| Merchant | From `SENDER_RULES` (rule) or From display name (fallback) |
| Item | Parsed via `itemRe` (rule) or first `$`-adjacent line (fallback) |
| Amount | `Total:` / `Amount charged:` / `You paid` / `Grand total` / last `$X.XX` in body |
| Category | From `SENDER_RULES.category` (rule) or `Other` (fallback) |
| Sender Email | Full address |
| Source | `rule` or `fallback` — drives Audit's "unknown-sender needs a rule" flag |
| Gmail Link | Opens the source thread |

### Audit tab
| Column | Description |
|---|---|
| Timestamp | Run time |
| Source Tab | `Subscriptions` or `Receipts` |
| Row Ref | e.g. `Row 7` |
| Merchant | For triage |
| Amount | For triage |
| Flags | `;`-separated rule hits |
| Gmail Link | Receipts-tab rows only |

Flag rules: missing amount · unknown-sender needs a rule · system sender · recurring unknown (add a rule) · large charge > $500 · stale subscription.

---

## Growing SENDER_RULES

The Audit tab is the worklist. After each `Refresh All` → `Audit Last Run`:
1. Open Audit tab, sort by `Flags` column
2. For rows flagged `recurring unknown — add a rule` or `unknown-sender needs a rule`:
   - Click Gmail Link → inspect subject + body
   - Add an entry to `SENDER_RULES` in `extraction.gs`
3. `clasp push` (or paste) → re-run `Refresh All` → `Audit Last Run`
4. Target: second run surfaces far fewer unknowns

---

## Related projects

- **Gmail Forge** (`../gmail-forge/`) — labels mail as `Receipt`; those labels are what this project reads. Also exposes a `doGet` endpoint for `Refresh All Apps`.
- **Spend Clarity** (`../spend-clarity/`) — Python CLI that enriches YNAB transactions from the same `label:Receipt` pool.
- **Spend Radar (web)** (`../spend-radar-web/`) — companion CRA dashboard, reads the Sheet's published CSV.
- **Clarity Budget** (`../clarity-budget-ios/`, `../clarity-budget-web/`) — future bridge at top of `ROADMAP.md`: Spend Radar's `Receipts` rows → Supabase → Clarity Budget.

