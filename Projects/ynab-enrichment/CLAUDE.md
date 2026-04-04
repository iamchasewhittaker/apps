# CLAUDE.md — YNAB Enrichment Tool

## Behavior Rules

1. **DRY_RUN=true by default.** Never write to YNAB unless `DRY_RUN=false` is explicitly set in `.env`. When dry run is active, print what would be written instead of writing it.

2. **Never overwrite a non-blank memo.** Only enrich transactions where `memo` is null or empty string `""`. Skip all others.

3. **Never delete transactions.** This tool is read + update only. No deletes, no creates.

4. **Log everything.** Every API call, every match decision, every write (or dry-run write) goes to `output/enrichment_log.txt`.

5. **Idempotent.** Running the tool twice must produce the same result. Do not duplicate memos or re-match already-enriched transactions.

6. **Batch YNAB writes.** Use the bulk PATCH endpoint in groups of 100 max.

7. **Never commit secrets.** `.env`, `config/gmail_token.json`, and `config/kassie_gmail_token.json` are gitignored — keep them that way.

## Setup Gotchas (learned during initial setup)

- **`python` not found on macOS** — macOS does not alias `python` by default. Activate the venv first (`source .venv/bin/activate`) so `python` works, or use `python3` outside the venv.
- **Credentials file renamed with colon** — macOS sometimes saves `config/gmail_credentials.json` as `config:gmail_credentials.json`. Fix: `mv config/'config:gmail_credentials.json' config/gmail_credentials.json`
- **"Access blocked" during OAuth** — The Google app is in testing mode. You must add your Gmail address as a test user: Google Cloud Console → OAuth consent screen → Test users → Add users. Then re-run `--auth`.
- **"Advanced" link during OAuth** — Even after adding yourself as a test user, Google shows a warning screen. Click **Advanced** → **Go to YNAB Enrichment (unsafe)** to proceed. This is expected for unverified personal apps.
- **Kassie's Gmail auth** — Same gotchas apply. Add `kassie.e.whittaker@gmail.com` as a test user in Google Cloud Console before running `--auth-kassie`. Token saved to `config/kassie_gmail_token.json`.
- **Kassie's Gmail wrong account** — `--auth-kassie` will open a browser. If Google auto-selects her work account (`kassiew@kidsvillage.net`), click "Use another account" and sign in as `kassie.e.whittaker@gmail.com`. The `login_hint` parameter in `GmailClient` pre-fills the email, but Google may still offer the wrong account if it's the active session. If the token ends up on the wrong account, delete it and re-auth: `rm config/kassie_gmail_token.json && python src/main.py --auth-kassie`.

## Project Structure

```
src/main.py           — orchestrator, CLI entry point
src/gmail_client.py   — Gmail OAuth + email fetching
src/receipt_parser.py — per-merchant HTML/text parsing
src/privacy_client.py — Privacy.com REST API client (replaces email parsing for Privacy.com)
src/ynab_client.py    — YNAB REST API wrapper
src/matcher.py        — receipt ↔ transaction matching
src/memo_formatter.py — memo string generation
src/categorizer.py    — keyword → category assignment
config/category_rules.yaml — keyword → YNAB category ID mapping (fully populated)
output/               — generated reports (gitignored)
```

## Supported Merchants

| Merchant | Source | Also Kassie's Gmail? | YNAB payee keywords |
|---|---|---|---|
| Amazon | Chase Gmail | ✓ | `amazon` |
| Audible | Chase Gmail | — | `audible`, `amazon` |
| Apple | Chase Gmail | — | `apple` |
| DoorDash | Chase Gmail | ✓ | `doordash`, `doordas` |
| Privacy.com | API (fallback: email) | — | `privacy`, `privacycom` |
| Netflix | Chase Gmail | — | `netflix` |
| Spotify | Chase Gmail | — | `spotify` |
| Hulu | Chase Gmail | — | `hulu` |
| Disney+ | Chase Gmail | — | `disney` |
| Walmart | Chase Gmail | **✓** | `walmart` |
| Target | Chase Gmail | **✓** | `target` |
| Costco | Chase Gmail | **✓** | `costco` |
| Venmo | Chase Gmail | — | `venmo` |

Kassie's account is searched for merchants in `KASSIE_MERCHANTS` set in `src/main.py`.
- To add a merchant to Kassie's search: add its name to `KASSIE_MERCHANTS`.
- Kassie's Gmail is **connected** — token at `config/kassie_gmail_token.json`.
- Re-auth if token expires: `python src/main.py --auth-kassie`
- **Kassie's Gmail must be her personal account** (`kassie.e.whittaker@gmail.com`), not her work account (`kassiew@kidsvillage.net`). The `login_hint` in `GmailClient` enforces this during auth, but if the token is ever replaced manually, double-check which account it's for.

## Matching Logic (`matcher.py`)

Three-tier match priority, per merchant:
1. **Exact** — same amount (±$0.00), date within ±1 day
2. **Fuzzy** — amount within ±$0.50, date within ±6 days
3. **Split** — 2–4 YNAB transactions summing to one receipt total (disabled for `privacy` and `audible` to prevent false positives)

Ambiguous matches (two receipts equally close) are skipped and logged. Already-matched transactions (`used_txn_ids`) and receipts (`used_receipt_ids`) are not reused.

## Auto-Categorization (`categorizer.py`)

Enabled with `AUTO_CATEGORIZE=true` in `.env`. Scans receipt item names against keywords in `config/category_rules.yaml` and writes the matching YNAB `category_id` alongside the memo update.

- All category IDs are populated with real UUIDs — no setup needed.
- Keywords are matched case-insensitively; first match wins.
- To add a new rule: add a section to `category_rules.yaml` with a `category_id` and `keywords` list.
- Category UUIDs can be looked up by running the tool with a temporary debug print, or by fetching `GET /budgets/{id}/categories` from the YNAB API.

## Walmart Parser (`receipt_parser.py`)

Kassie uses Walmart grocery delivery — her emails come from `help@walmart.com` and use a **different format** than standard Walmart.com orders:

- **Grocery delivery** ("Thanks for your delivery order, Kassie"): total is in `"Includes all fees, taxes and discounts  $X.XX"`. Individual item names are NOT in the confirmation email — memo is written as `"Grocery delivery (N items)"`.
- **Standard orders**: total is in `"Order Total  $X.XX"`.
- Delivery notification emails ("Delivered:", "Your delivery should arrive") do not contain totals and are skipped.
- Order ID extracted from `"Order number:#2000146-41987434"` pattern.

## Venmo Parser (`receipt_parser.py`)

Venmo emails come from `venmo@venmo.com`. Three subject patterns are handled:

| Subject pattern | Memo produced |
|---|---|
| `You paid <Person> $X.XX` | `Paid Jimmy Lewis — Soil test, consultation` |
| `<Person> paid your $X.XX request` | `From Ryne Cardon — YouTube February` |
| `<Person> paid you $X.XX` | `From Ann Whittaker — 🐕 I'm so sorry!` |

- Transaction memo is extracted from the HTML body between the spaced amount (`$ 160 . 00`) and "See transaction".
- Bank transfer emails ("Your Venmo Standard transfer has been initiated") and monthly history emails are skipped.
- Received payments often go to Venmo balance first and are then transferred as a lump sum — those individual received payments may not match any YNAB transaction. Sent payments funded directly from a bank account will match.

## Privacy.com Descriptor Normalization (`privacy_client.py`)

Payment network descriptors go through three normalization steps:
1. **`*` separator handling** — if suffix after `*` is a token code (all caps/digits), drop it (`Audible*DZ4065L83` → `Audible`); if suffix is a product name, use it (`GOOGLE *YouTube TV` → `YouTube TV`)
2. **ALL CAPS → title case** — only if the entire string is uppercase (leaves mixed-case like `YouTube` untouched)
3. **Alias map** — `_DESCRIPTOR_ALIASES` in `privacy_client.py` expands known truncated descriptors:
   - `linkedinprea` → `LinkedIn Premium`
   - `xbox game pa` → `Xbox Game Pass`
   - Add more as discovered in `output/unmatched_report.txt`

## Budget Dashboard

**Location:** `/Users/chase/Documents/Projects/Money/budget_dashboard.html`
**Script:** `/Users/chase/Documents/Projects/Money/analyze.py`

Regenerate after exporting a new CSV from MACU:
```bash
cd /Users/chase/Documents/Projects/Money && python3 analyze.py
```

Data source: `MACU Transaction.csv` (export from MACU online banking).
Update `START`/`END` date range in `analyze.py` when a new export covers a different period.

### Subscription Tracking in `analyze.py`
Subscriptions are defined in the `SUBSCRIPTIONS` list as 5-tuples:
```python
("Name", monthly_cost, "Category", "Note", cancelled_bool)
```
- `cancelled=True` renders with strikethrough + green "Cancelled ✓" note
- `CANCELLED_SAVINGS` and `ACTIVE_SUBS_TOTAL` are auto-computed
- Dashboard shows a 🎉 savings row at the bottom of the subscription table

**Currently saving $133.13/mo ($1,597/yr)** from cancelled subscriptions:
Xbox Game Pass, LinkedIn Premium, getinboxzero, MatthewCassinelli.com, Audible, FlexJobs

## YNAB Budgets

| Budget | ID | Status |
|---|---|---|
| ✱ ynab-enrichment | `583fdbca-5148-4ebf-8b36-ebb75c3e7d1b` | **Active enrichment target** |
| F1 Final | `bac7c9ee-eb6c-4032-a6f1-1c26f4308412` | Old budget — no longer used |

To switch budgets: update `YNAB_BUDGET_ID` in `.env`. No new API token needed.

### Categories Still Needed in YNAB UI
The following categories don't yet exist in the `ynab-enrichment` budget. Until created, Electronics/Clothing/Kids/Pets items auto-categorize to interim buckets (see `config/category_rules.yaml` comments). After creating them in YNAB, run `python src/setup_categories.py` to pull the correct UUIDs.

**Add to Bills group:** Security — Vivint

**New groups to create:**
- **INCOME:** Kids Village Payroll, Basement Rent, Car Loan Repayment (Mom), Other Income
- **INSURANCE:** Life Insurance, Auto/Home Insurance
- **DEBT PAYMENTS:** Student Loan, Citizens Bank LOC, Citi Card Payoff
- **DONATIONS:** Tithing
- **SHOPPING:** Shopping (for Amazon/online purchases — Electronics, Clothing, Pets will remap here)
- **KIDS:** Kids Activities

## Confirmed Income (as of Mar 2026)

- Kids Village (Kassie): ~$5,580/mo (paychecks 5th & 20th)
- Basement rent: $1,500/mo
- Mom's car loan check: $794/mo
- **Total: $7,874/mo**

UI benefits have ended. Merrill Lynch ESPP depleted. No other income sources.
