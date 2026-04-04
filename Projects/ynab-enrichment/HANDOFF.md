# Handoff — YNAB Enrichment + Budget (as of 2026-03-31)

## Current State

- Enrichment tool is **live** (`DRY_RUN=false`, `AUTO_CATEGORIZE=true`) and writing to YNAB
- Kassie's Gmail is **connected** and **fixed** — now properly authenticated to `kassie.e.whittaker@gmail.com` (was previously the wrong account: `kassiew@kidsvillage.net`)
- Venmo parser added — enriches "Paid X — memo" and "From X — memo" on Venmo transactions
- Walmart grocery delivery parser added — handles Kassie's Walmart delivery emails
- Budget dashboard fully built at `/Users/chase/Documents/Projects/Money/budget_dashboard.html`
- 6 subscriptions cancelled since last session — saving **$133.13/mo ($1,597/yr)**

---

## What Was Done This Session (2026-03-31)

### Kassie's Gmail — Fixed
- Discovered token was authenticated to `kassiew@kidsvillage.net` (work account) — that's why all Walmart/Target/Costco receipts from Kassie were returning 0 emails
- Added `login_hint="kassie.e.whittaker@gmail.com"` to `GmailClient.__init__()` in `gmail_client.py` so future auth flows pre-fill the correct address
- Deleted stale token and re-authenticated to correct personal account
- If this ever breaks again: `rm config/kassie_gmail_token.json && python src/main.py --auth-kassie`

### Walmart Grocery Delivery Parser — New
- Kassie's Walmart receipts are grocery delivery emails ("Thanks for your delivery order") — different format from standard Walmart.com orders
- Total lives in `"Includes all fees, taxes and discounts  $X.XX"` (not "Order Total")
- Individual items not present in confirmation email — memo is `"Grocery delivery (N items)"`
- Order ID extracted from `"Order number:#XXXXXXXXX"` pattern
- Detection uses subject line + body for `"delivery order|grocery|delivery from store"`
- Now matching: Feb 4 Walmart $16.93 and Feb 17 Walmart $33.18

### Venmo Parser — New
- Added `"venmo"` to `MERCHANTS` in `main.py` (sender: `venmo@venmo.com`, payee keyword: `venmo`)
- Handles sent payments, received payment requests, and direct received payments
- Memo extracted from HTML body between spaced amount (`$ 160 . 00`) and "See transaction"
- Skips bank transfer emails and monthly history emails
- Already matching: Mar 23 Venmo $-160.00 → `"Paid Jimmy Lewis — Soil test, consultation"`

### Inbox Audit — Chase's Receipt Label (March 2026)
Receipts reviewed and notable flags:
- **MatthewCassinelli.com** — receipt arrived Mar 25 (listed as cancelled). Likely final charge, not recurring.
- **Audible** — receipt Mar 31 (listed as cancelled). Likely final charge.
- **LinkedIn Premium** — cancelled Mar 31, access through Apr 12. No future charges expected.
- **Embryo Options** — $85 charged Mar 17; $85 upcoming Apr 17 (auto-bill for cryostorage).
- **Peak ENT** — payment receipt Mar 11 (outstanding medical bill).
- **Venmo** — paid Jimmy Lewis $160 (soil test, consultation) Mar 20.
- **Venmo** — received: Ryne Cardon $25.50, Nate & Meg Wallace $25.50, Bradley Campbell $25.50 (YouTube TV split Mar).
- **Venmo** — received: Danielle Cardon $52 "Hail Mary", Ann Whittaker $300 "🐕 I'm so sorry!"

---

## Confirmed Income

| Source | Monthly | Notes |
|---|---|---|
| Kassie — Kids Village | ~$5,580 | 2 paychecks, 5th & 20th via BambooHR |
| Basement Rent | $1,500 | Fixed |
| Mom's Car Loan Check | $794 | Monthly check deposit |
| **Total** | **$7,874/mo** | |

**Important:** UI benefits have stopped. Merrill Lynch ESPP is $0 (depleted). No other income sources.

---

## Budget Reality

- **Fixed expenses:** ~$4,136/mo (mortgage, tithing, insurance, debt, phone, security)
- **Left after fixed:** ~$3,738/mo for food, gas, subscriptions, shopping
- **Bare minimum income needed:** ~$5,236/mo
- **Comfortable target (with $500 savings):** ~$5,736/mo — current income exceeds this
- **Problem:** Variable spending (groceries + Amazon especially) is too high

### Biggest Fixes Available
1. Groceries: $1,072/mo avg → target $600 = **saves $472/mo**
2. Amazon: $862/mo avg → target $200 = **saves $662/mo**
3. Subscriptions: $606/mo active → target $150 = **saves $456/mo**

### Subscription Audit (as of 2026-03-31)

**Active — $606.03/mo:**
| Subscription | Cost/mo | Status |
|---|---|---|
| YouTube TV | $100.98 | Review — went up from $89 |
| Embryo | $85.00 | Keep — active fertility |
| Banner Life Insurance | $110.00 | Keep — fixed |
| Vivint Security | $70.13 | Keep |
| Seed.com | $38.61 | Review |
| Fern CFO LLC | $50.00 | ⚠️ UNKNOWN — investigate |
| Coursera | $52.65 | Review — may be one-time |
| Apple (services) | $40.00 | Review |
| Claude.ai | $21.49 | Keep |
| Canva | $15.00 | Review |
| Google One | $10.73 | Keep or cut |
| Grammarly | $5.00 | Keep (~$60/yr) |
| Oura Ring | $6.44 | Review |

**Cancelled — saving $133.13/mo ($1,597/yr):**
- Xbox Game Pass: $16.11/mo ✓
- LinkedIn Premium: $42.97/mo ✓
- getinboxzero: $20.00/mo ✓
- MatthewCassinelli.com: $10.00/mo ✓
- Audible: $14.20/mo ✓
- FlexJobs: $29.85/mo ✓

### Fern CFO LLC ($50/mo) — UNRESOLVED
User does not recognize this charge. Shows up via Privacy.com. Log into Privacy.com dashboard to identify and cancel.

---

## Citibank Card (dead card, paying off)

- Balance: $8,874 as of Mar 2026
- Payment: $300/mo ($150 autopay × 2)
- Interest: ~$160/mo → only ~$140/mo reducing principal
- No new charges — confirmed not in use
- Payoff at current rate: ~Jun 2031 (~$8k more in interest)
- **Deferred:** Citi payoff tracker widget not yet built — future update

---

## YNAB Budgets

| Budget | ID | Purpose |
|---|---|---|
| ✱ ynab-enrichment | `583fdbca-5148-4ebf-8b36-ebb75c3e7d1b` | **Current enrichment target** (switched 2026-03-31) |
| F1 Final | `bac7c9ee-eb6c-4032-a6f1-1c26f4308412` | Old budget — no longer used |

### Existing Categories (already in ynab-enrichment budget)

| Group | Categories |
|---|---|
| Bills | Rent/Mortgage, Electric, Water, Internet, Cellphone |
| Frequent | Groceries ✓, Eating Out, Transportation |
| Non-Monthly | Home Maintenance, Auto Maintenance, Gifts |
| Goals | Vacation, Education, Home Improvement |
| Quality of Life | Hobbies, Entertainment, Health & Wellness |

### Still Needed in YNAB UI
The YNAB API does not support creating categories. These still need to be created manually:

**Add to Bills group:** Security — Vivint ($70)

**New groups:**
- **INCOME:** Kids Village Payroll, Basement Rent, Car Loan Repayment (Mom), Other Income
- **INSURANCE:** Life Insurance ($110), Auto/Home Insurance ($154)
- **DEBT PAYMENTS:** Student Loan ($198), Citizens Bank LOC ($29), Citi Card Payoff ($300)
- **DONATIONS:** Tithing ($787)
- **SHOPPING:** Shopping (Electronics/Clothing/Pets remap here once created)
- **KIDS:** Kids Activities ($100)

After creating them: `python src/setup_categories.py` — auto-updates `category_rules.yaml` UUIDs.

### Current category_rules.yaml Interim Mappings
Until Shopping/Kids categories are created, these route to temporary buckets:
- Electronics → Entertainment
- Clothing → Hobbies
- Kids → Hobbies
- Pets → Health & Wellness

---

## Dashboard

**Location:** `/Users/chase/Documents/Projects/Money/budget_dashboard.html`
**Script:** `/Users/chase/Documents/Projects/Money/analyze.py`

```bash
cd /Users/chase/Documents/Projects/Money && python3 analyze.py
```

**Data source:** `/Users/chase/Documents/Projects/Money/MACU Transaction.csv`
- 15 months of data (Jan 2025 – Mar 2026)
- Analysis window: Apr 2025 – Mar 2026 (12 months)
- Re-export from MACU online banking to refresh

---

## Enrichment Tool

### Running
```bash
cd /Users/chase/Documents/Projects/ynab-enrichment
source .venv/bin/activate
python src/main.py
```

### Dry run (safe to test)
```bash
python src/main.py --dry-run
python src/main.py --dry-run --merchants walmart target amazon doordash costco venmo
```

### Auth
```bash
python src/main.py --auth           # Chase's Gmail
python src/main.py --auth-kassie    # Kassie's Gmail (must use kassie.e.whittaker@gmail.com)
```

### If Kassie's token authenticates the wrong account
```bash
rm config/kassie_gmail_token.json
python src/main.py --auth-kassie
# Browser will open pre-filled with kassie.e.whittaker@gmail.com
# If it shows kidsvillage.net, click "Use another account"
```

### Kassie's Gmail — CONNECTED ✓
- Token: `config/kassie_gmail_token.json`
- Address: **kassie.e.whittaker@gmail.com** (personal, not work)
- Merchants searched: Walmart, Target, Amazon, DoorDash, Costco
- Target/Costco/DoorDash returning 0 emails — Kassie shops in-store for those, receipts don't go to her personal email

### Key Files

| File | Purpose |
|---|---|
| `src/main.py` | Orchestrator — `MERCHANTS` config, `KASSIE_MERCHANTS` set |
| `src/privacy_client.py` | Privacy.com API + `_DESCRIPTOR_ALIASES` |
| `src/receipt_parser.py` | Per-merchant HTML email parsers (incl. Walmart grocery + Venmo) |
| `src/matcher.py` | Exact → fuzzy → split matching |
| `src/ynab_client.py` | YNAB API wrapper |
| `src/memo_formatter.py` | Memo string generation (200-char limit) |
| `src/categorizer.py` | Keyword → YNAB category ID |
| `src/gmail_client.py` | Gmail OAuth — accepts `login_hint` to lock account during auth |
| `config/category_rules.yaml` | Keyword → category UUID mapping (fully populated) |
| `.env` | Secrets — gitignored |
| `config/gmail_token.json` | Chase's OAuth token — gitignored |
| `config/kassie_gmail_token.json` | Kassie's OAuth token — gitignored |

### Privacy.com Descriptor Aliases (`src/privacy_client.py`)
```python
_DESCRIPTOR_ALIASES = {
    "linkedinprea": "LinkedIn Premium",
    "xbox game pa": "Xbox Game Pass",
}
```
Add more as discovered in `output/unmatched_report.txt`.

---

## Asana Project

Project "YNAB Enrichment Tool" was previewed via Asana MCP with 4 sections / 15 tasks.

Sections:
- **Immediate (This Week):** Kassie Gmail auth ✓, YNAB category setup, Fern CFO investigation, switch to new budget
- **Short Term (April):** Venmo parser ✓, Citi payoff tracker, email reports, subscription cleanup
- **Next Quarter:** More merchants (Uber Eats, Instacart, Chewy), auto-schedule enrichment
- **Budget Goals:** Groceries ≤$600, Amazon ≤$200, subscriptions ≤$150, build $3k emergency fund

---

## Known Next Steps

### Immediate
- [ ] **Investigate Fern CFO LLC** ($50/mo) — log into Privacy.com, find and cancel
- [x] **Switch enrichment to new budget** — done, `YNAB_BUDGET_ID=583fdbca-5148-4ebf-8b36-ebb75c3e7d1b`
- [ ] **Create remaining categories in YNAB UI** — see "Still Needed" list above, then run `python src/setup_categories.py`
- [ ] **Run enrichment live** — `python src/main.py` (7 transactions ready: 4 Amazon, 2 Walmart, 1 Venmo)

### Short Term
- [ ] Build Citi card payoff tracker in dashboard
- [ ] Set up weekly email spending report
- [ ] Review active subscriptions: YouTube TV $101, Seed.com $39, Canva $15, Coursera $53, Fern CFO $50

### Longer Term
- [ ] Add merchants: Uber Eats, Instacart, Chewy, eBay
- [ ] Schedule enrichment tool to run weekly (launchd or cron)
- [ ] Improve Walmart grocery delivery: fetch order detail page for actual item names (currently shows "Grocery delivery (N items)")
