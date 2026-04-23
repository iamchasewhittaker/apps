# SESSION_START — Money (Archived) Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.
> Note: Money is archived. Its functionality was superseded by Spend Clarity (Python CLI) and Spend Radar (Apps Script). Document as retired.

---

**Mode:** Retroactive documentation — Money is archived; superseded by Spend Clarity and Spend Radar.
**App:** Money
**Slug:** money
**One-liner:** Retired two-part expense tool — a React Transaction Enricher (web UI for categorizing bank CSV imports) and a Python Budget Dashboard; superseded by Spend Clarity and Spend Radar on 2026-04-20.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is archived; all decisions are historical.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/money` (marked archived)
2. **BRANDING.md** — basic finance aesthetic; note superseded by Spend Clarity / Spend Radar brands
3. **PRODUCT_BRIEF.md** — distill from context below; frame as a retired iteration
4. **PRD.md** — reflect the retired scope; note what migrated to which successor
5. **APP_FLOW.md** — document the CSV import → categorize → budget dashboard flow (archived version)
6. **SESSION_START_money.md** — stub only

Output paths: `portfolio/archive/money/docs/` (note: archive path, not portfolio/)

---

## App context

**Status:** Archived — retired and superseded
**Archive path:** `portfolio/archive/money/`
**Retired on:** 2026-04-20
**Superseded by:**
- `portfolio/spend-clarity/` (Python CLI — YNAB + Gmail + Privacy.com enrichment)
- `portfolio/spend-radar/` (Apps Script — Gmail label:Receipt → subscription detection)
**Storage key (historical):** `chase_money_v1`
**Version (historical):** v0.1

**What this app was:**
A two-part tool:
1. **Transaction Enricher** (React web app) — import bank CSV exports, manually categorize transactions, export enriched CSV back to YNAB or a spreadsheet
2. **Budget Dashboard** (Python script) — read enriched data, generate spending summary, category breakdowns, monthly trends

The React portion let Chase paste raw bank transaction CSV, tag each row with a category, and flag subscriptions. The Python portion consumed the output and produced reports.

**Why archived:**
- Manual CSV categorization was tedious and didn't scale
- The new approach (Spend Clarity + YNAB API) is fully automated — no manual CSV tagging
- Spend Radar covers the subscription detection use case automatically via Gmail
- The architecture (CSV → manual tag → export) was replaced by API-first automation

**What migrated to successors:**
- Transaction enrichment → `portfolio/spend-clarity/` (Python CLI, YNAB API, Gmail match)
- Subscription detection → `portfolio/spend-radar/` (Apps Script, Gmail label:Receipt)
- Budget visualization → `portfolio/clarity-budget-web/` + `portfolio/clarity-budget-ios/`

**Stack (historical):**
- React CRA (Transaction Enricher web app)
- Python 3 script (Budget Dashboard — not a full CLI, just a report generator)
- localStorage (`chase_money_v1`) for the React portion
- No Supabase, no API calls — all manual/local

---

## App context — HANDOFF.md (historical)

**Status:** Archived
**Focus:** No active development. Retired 2026-04-20.
**Successors:**
- Spend Clarity (`portfolio/spend-clarity/`) — automated YNAB enrichment
- Spend Radar (`portfolio/spend-radar/`) — automated receipt/subscription detection
