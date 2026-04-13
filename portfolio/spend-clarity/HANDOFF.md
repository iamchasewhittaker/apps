# HANDOFF — Spend Clarity

> Current session state for Claude Code / Cursor. Update before ending a session.

---

## State

| Field | Value |
|-------|-------|
| **Focus** | Transaction analysis overhaul: payee cleanup, auto-categorization, learning system |
| **Status** | v0.2.0 shipped — 57/57 tests passing; `xcodebuild` green on iOS side |
| **Last touch** | 2026-04-12 |
| **Next** | Run `python src/main.py --dry-run` against real YNAB data to verify output; tune `category_overrides.yaml` for any mismatches; optionally add `venv` + `requirements.txt` install notes |

---

## What this is

Standalone Python CLI that enriches YNAB transactions with item-level detail from Gmail receipt emails (Amazon, Apple) and merchant data from Privacy.com. Also auto-categorizes transactions by payee. Personal tool, runs locally.

Run: `python3 src/main.py` (from `portfolio/spend-clarity/`)

---

## Recent changes (2026-04-12)

### Categorization — root cause fix
All 9 category IDs in `config/category_rules.yaml` were pointing to the wrong YNAB budget (`583fdbca` "ynab-enrichment"). Every prior categorization attempt was writing invalid IDs. All IDs updated to the correct budget (`ab0a40fe`).

### New modules
- **`src/payee_formatter.py`** — `display_payee(raw)` cleans bank-format payee strings → merchant names. Four stages: leading bank noise strip (ACH/withdrawal/debit/POS patterns) → known merchant map (50+) → trailing noise strip (`*ALPHANUM`, `#digits`) → ALL CAPS → title case.
- **`config/category_overrides.yaml`** — user-editable corrections. Pattern + category_id + note. Checked first in every categorization run. Edit this file to fix mismatches.

### Categorization pipeline (new three-tier system)
1. **User overrides** (`category_overrides.yaml`) — checked first, highest priority
2. **Payee rules** (`category_rules.yaml` > `payee_rules:`) — 50+ merchant patterns across 12 groups
3. **Item keyword rules** (`category_rules.yaml` keyword sections) — receipt-based matching

### main.py additions
- **Step 4.5** — after receipt matching, ALL remaining blank-memo transactions are now categorized by payee (not just receipt-matched ones). Netflix, Spotify, gas stations, restaurants, pharmacies, etc. get auto-categorized even with no email receipt.
- Uses `display_payee()` in unmatched report output for cleaner names

---

## Architecture (current)

```
portfolio/spend-clarity/
  src/
    main.py              — entry point (7 steps; Step 4.5 added)
    payee_formatter.py   — NEW: cleans raw bank payee strings → merchant names
    categorizer.py       — REWRITTEN: three-tier Categorizer class
    gmail_client.py      — Gmail API + OAuth (label:Receipt pre-filter)
    receipt_parser.py    — extract transaction data from email HTML/text
    matcher.py           — match receipts to YNAB transactions
    ynab_client.py       — YNAB API reads + memo/category writes
    setup_categories.py  — YNAB category ID resolution (emoji-stripping added)
  config/
    category_rules.yaml  — keyword rules + payee_rules (FIXED: correct budget IDs)
    category_overrides.yaml  — NEW: user corrections (edit to fix mismatches)
    gmail_token.json     — OAuth token (gitignored)
    gmail_credentials.json — OAuth client (gitignored)
  tests/
    test_payee_formatter.py  — 37 tests
    test_categorizer.py      — 20 tests
    test_matcher.py          — 9 tests (pre-existing)
    test_receipt_parser.py   — 9 tests (pre-existing; requires bs4)
    test_memo_formatter.py   — 10 tests (pre-existing)
  .env                   — YNAB_TOKEN, YNAB_BUDGET_ID (gitignored)
  requirements.txt
```

---

## How to correct a miscategorization

1. Run with `DRY_RUN=true` first; check the output
2. If a transaction was assigned the wrong category, add to `config/category_overrides.yaml`:
   ```yaml
   overrides:
     - pattern: "costco gas"
       category_id: "3c8e117f-11ca-4202-9d4a-fc83f40a0913"
       note: "Gas, not Groceries"
   ```
3. The pattern is case-insensitive and matched as a substring of the cleaned payee name
4. Overrides are checked before payee rules and keyword rules — they always win

---

## Key decisions

- **Dry run default:** `DRY_RUN=true` — never writes to YNAB without explicit opt-in.
- **Three-tier categorization:** overrides → payee rules → keyword rules. First match wins.
- **AUTO_CATEGORIZE defaults true:** payee-based categorization is safe and high-confidence.
- **Amazon excluded from payee rules:** Amazon purchases vary too much (groceries, electronics, household). Rely on receipt email parsing for Amazon categorization.
- **Emoji stripping in code:** YNAB category names have emoji suffixes (💸, 🔒, etc.); `strip_emojis()` in `setup_categories.py` normalizes before matching rather than renaming in YNAB.
- **Budget ID in .env only:** `YNAB_BUDGET_ID` stays in `.env` (gitignored); removed from `category_rules.yaml` comment to avoid public repo exposure.

---

## Relationship to YNAB Clarity iOS

`portfolio/ynab-clarity-ios/` is the companion iOS dashboard. The two apps share:
- Same YNAB budget and category IDs
- Same merchant pattern lists (iOS has `PayeeDisplayFormatter.swift`; Python has `payee_formatter.py`)
- Same override concept (iOS has `CategoryOverride` SwiftData model; Python has `category_overrides.yaml`)

They are separate codebases (different languages/runtimes) and do not share code.

---

## Related

- YNAB Clarity iOS: `portfolio/ynab-clarity-ios/`
- Inbox Zero: `portfolio/inbox-zero/` — source of truth for Gmail Receipt label filters
- Monorepo CLAUDE.md: `~/Developer/chase/CLAUDE.md`
