# YNAB Transaction Enrichment Tool — Claude Code Session

## Project Goal

Build a Python tool that enriches YNAB transactions with item-level detail by
parsing Gmail receipt emails. The tool matches Gmail receipts to YNAB
transactions by merchant, date, and amount, then writes descriptive memos and
correct categories back to YNAB via the API.

**Why this matters:** 6-12 months of transactions currently show as "Amazon"
with no memo and no useful category. This tool fixes that so we can understand
exactly where household money is going — income vs. expenses, overspent
categories, and subscription leaks.

---

## Starting Point

- No repo yet — create from scratch
- No Gmail API credentials yet — include setup instructions
- YNAB Personal Access Token: to be added to `.env` by user
- YNAB Budget ID: to be added to `.env` by user
- Python 3.11+, macOS (Apple Silicon or Intel)

---

## Phase 1 Scope — Merchant Priority

Build enrichment support for these merchants in this order:

1. **Amazon** — `ship-confirm@amazon.com` — highest volume, most opaque
2. **Apple** — `no_reply@email.apple.com` — subscriptions and app purchases
3. **Subscriptions** — Netflix, Spotify, Hulu, Disney+, etc. — recurring cost leaks
4. **DoorDash / Restaurants** — `no-reply@doordash.com` and restaurant receipts
5. **Walmart / Target / Costco** — online order confirmations

---

## Core Logic

### Step 1 — Fetch YNAB Transactions
- Pull all transactions from the last 12 months
- Filter to transactions where `memo` is blank or null
- Group by merchant/payee name
- Store as a local working list (do not modify YNAB yet)

### Step 2 — Fetch Gmail Receipts
- Use Gmail API (OAuth 2.0, read-only scope)
- Search by sender address and date range for each merchant
- Parse email body (HTML and plain text) to extract:
  - Item names and quantities
  - Order total
  - Order date
  - Order ID (for deduplication)
- Store parsed receipts in memory (keyed by amount + date)

### Step 3 — Match Receipts to Transactions
Matching rules (in priority order):
1. **Exact match** — same amount, date within ±1 day
2. **Fuzzy match** — amount within $0.50, date within ±6 days
3. **Split order match** — multiple YNAB transactions summing to one order total

Do NOT match if:
- Transaction already has a memo (non-blank)
- No receipt found within tolerance window
- Ambiguous match (two receipts equally close)

### Step 4 — Generate Memos
Format rules:
- Single item: `Item Name`
- Multiple items: `Item 1, Item 2, Item 3`
- More than 4 items: `Item 1, Item 2, Item 3 (+2 more)`
- Split order: `[Split $124.99 total] Item 1, Item 2`
- Max memo length: 200 characters (YNAB limit)

### Step 5 — Auto-Categorize (Optional, Configurable)
Use a keyword mapping config file (`category_rules.yaml`) to assign YNAB
category IDs based on item content. Examples:
```yaml
Electronics:
  - echo
  - kindle
  - airpods
  - usb
Groceries:
  - ziploc
  - paper towel
  - dish soap
Household:
  - lightbulb
  - batteries
  - trash bags
```
Category assignment is optional — default is memo-only with no category change.
User must opt in via config flag `AUTO_CATEGORIZE=true`.

### Step 6 — Write to YNAB
- Use bulk PATCH endpoint: `PATCH /plans/{plan_id}/transactions`
- Batch in groups of 100 (YNAB API limit consideration)
- Write memo field for all matched transactions
- Write category_id only if AUTO_CATEGORIZE=true and a rule matched
- Log every update: transaction ID, payee, amount, old memo, new memo

### Step 7 — Unmatched Report
After processing, generate a plain-text report:
```
=== UNMATCHED TRANSACTIONS ===
Date        Payee       Amount    Reason
2024-11-03  Amazon      $47.23    No receipt found in date window
2024-10-15  Amazon      $12.99    Ambiguous — 2 receipts matched
...

Total unmatched: 14 of 87 Amazon transactions
```
Save report to `output/unmatched_report.txt`

---

## Project Structure

```
ynab-enrichment/
├── CLAUDE.md               # Claude Code behavior rules
├── PROMPT.md               # This file
├── README.md               # Setup and usage instructions
├── .env                    # Secrets (gitignored)
├── .env.example            # Template for .env
├── .gitignore
├── requirements.txt
├── config/
│   └── category_rules.yaml # Keyword → YNAB category mapping
├── src/
│   ├── main.py             # Entry point / orchestrator
│   ├── gmail_client.py     # Gmail API auth and email fetching
│   ├── receipt_parser.py   # Per-merchant email parsing logic
│   ├── ynab_client.py      # YNAB API wrapper
│   ├── matcher.py          # Transaction ↔ receipt matching logic
│   ├── memo_formatter.py   # Memo string generation
│   └── categorizer.py      # Keyword-based category assignment
├── tests/
│   ├── test_matcher.py
│   ├── test_receipt_parser.py
│   └── test_memo_formatter.py
└── output/
    ├── unmatched_report.txt
    └── enrichment_log.txt
```

---

## Environment Variables

```bash
# .env
YNAB_API_TOKEN=your_personal_access_token_here
YNAB_BUDGET_ID=your_budget_id_here

# Gmail OAuth (populated after running auth setup)
GMAIL_CREDENTIALS_FILE=config/gmail_credentials.json
GMAIL_TOKEN_FILE=config/gmail_token.json

# Processing config
LOOKBACK_DAYS=365
DATE_TOLERANCE_DAYS=6
AMOUNT_TOLERANCE_DOLLARS=0.50
AUTO_CATEGORIZE=false
DRY_RUN=true  # Set to false when ready to write to YNAB
```

---

## Gmail API Setup Instructions

Include in README.md:

1. Go to https://console.cloud.google.com
2. Create a new project: "YNAB Enrichment"
3. Enable the Gmail API
4. Go to "OAuth consent screen" → External → fill in app name
5. Go to "Credentials" → Create OAuth 2.0 Client ID → Desktop App
6. Download the JSON file → save as `config/gmail_credentials.json`
7. Run `python src/main.py --auth` to complete OAuth flow
8. A browser window will open → authorize read-only Gmail access
9. Token saved to `config/gmail_token.json` — do not commit this file

Scope required: `https://www.googleapis.com/auth/gmail.readonly`

---

## Merchant Parsing Notes

### Amazon
- Sender: `ship-confirm@amazon.com`
- Subject contains: "Your Amazon.com order"
- Extract: item names from order summary table, order total, order date
- Watch for: digital orders come from `digital-no-reply@amazon.com`
- Watch for: multiple shipments per order

### Apple
- Sender: `no_reply@email.apple.com`
- Subject contains: "Your receipt from Apple"
- Extract: app/subscription name, amount, purchase date
- Common items: iCloud+, Apple One, App Store purchases, Apple TV+

### DoorDash
- Sender: `no-reply@doordash.com`
- Subject contains: "Your DoorDash receipt"
- Extract: restaurant name, order total
- Memo format: `DoorDash — Chick-fil-A`

### Subscriptions (Netflix, Spotify, etc.)
- Match by sender domain
- Extract: service name, plan name if available, amount
- These will often already have a clear payee in YNAB — enrich memo with plan detail

### Walmart / Target / Costco
- Match online order confirmation emails
- Extract: item names from order summary
- In-store purchases won't have Gmail receipts — skip gracefully

---

## Safety Rules

1. **DRY_RUN=true by default** — the tool must never write to YNAB unless
   explicitly set to false. Print what would be written instead.
2. **Never overwrite a non-blank memo** — only enrich transactions where
   `memo` is null or empty string.
3. **Never delete transactions** — read and update only.
4. **Log everything** — every API call, every match decision, every write.
5. **Idempotent** — running the tool twice should produce the same result,
   not duplicate memos.

---

## Reference Repos

These were reviewed during research and contain useful patterns:

- https://github.com/GraysonCAdams/amazon-ynab-sync — IMAP-based Gmail
  matching logic, fuzzy date/amount tolerance, blank-memo guard
- https://github.com/DanielKarp/YNAmazon — two-payee system, split order
  handling, memo format patterns (see WoosterTech fork for active version)
- https://github.com/davidz627/AmazonSyncForYNAB — Python, same goal,
  author commercialized as acemybudget.com

---

## Success Criteria for Phase 1

- [ ] Gmail OAuth working and fetching emails
- [ ] Amazon receipts parsed and matched to YNAB transactions
- [ ] Memos written to YNAB (DRY_RUN=false confirmed working)
- [ ] Apple receipts parsed and matched
- [ ] Unmatched report generated
- [ ] 6-12 months of history enriched
- [ ] Subscription receipts parsed
- [ ] DoorDash/restaurant receipts parsed
- [ ] Walmart/Target/Costco parsed
- [ ] category_rules.yaml populated with household-relevant keywords
- [ ] All tests passing

---

## What Comes Next (Phase 2 & 3)

Phase 1 output feeds directly into:

- **Phase 2** — Category audit using YNAB MCP + Claude: once transactions
  have clean memos, review whether categories reflect reality and identify
  the top spending leaks
- **Phase 3** — Weekly digest: income in, total spent, top 5 categories,
  monthly burn rate, and runway remaining — delivered somewhere the whole
  household can see it without logging into YNAB
