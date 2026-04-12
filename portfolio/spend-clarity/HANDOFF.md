# HANDOFF — Spend Clarity

> Current session state for Claude Code / Cursor. Update before ending a session.

---

## State

| Field | Value |
|-------|-------|
| **Focus** | Python CLI: YNAB + Gmail + Privacy.com transaction enrichment |
| **Status** | Working CLI; Gmail client updated with `label:Receipt` pre-filter |
| **Last touch** | 2026-04-12 |
| **Next** | Phase 2 iteration: test `label:Receipt` filter on real Gmail data; add Privacy.com client |

---

## What this is

Standalone Python CLI that enriches YNAB transactions with item-level detail from Gmail receipt emails (Amazon, Apple) and merchant data from Privacy.com. Personal tool, runs locally. Not a plugin, not a service.

**Note:** This repo has **no logo asset**. **Wellness Tracker** branding intentionally uses **YNAB Clarity** `ClarityTheme` colors for cross-tool visual consistency; see `portfolio/wellness-tracker/docs/BRANDING.md`.

Run: `python src/main.py`

---

## Recent changes (2026-04-12)

**`src/gmail_client.py` — `search_emails()` updated:**
- Query is now prefixed with `label:Receipt` before the sender filter
- Old: `from:{sender} after:{since_str}`
- New: `label:Receipt from:{sender} after:{since_str}`
- Why: aligns with Inbox Zero's Gmail filter taxonomy (`portfolio/inbox-zero/`), which applies the `Receipt` label to all known receipt senders via XML filters
- Benefit: faster, more accurate queries; Gmail indexes labels efficiently; pre-filtered before any sender matching

---

## Architecture (current)

```
portfolio/spend-clarity/
  src/
    main.py            — entry point
    gmail_client.py    — Gmail API + OAuth (UPDATED: label:Receipt pre-filter)
    receipt_parser.py  — extract transaction data from email HTML/text
    matcher.py         — match receipts to YNAB transactions (amount ± $0.01, date ± 1 day)
    ynab_client.py     — YNAB API reads + memo writes
  config/
    category_rules.yaml  — category keyword rules
    gmail_token.json     — OAuth token (gitignored)
    gmail_credentials.json — OAuth client (gitignored)
  tests/               — pytest suite
  .env                 — YNAB_TOKEN, YNAB_BUDGET_ID (gitignored)
  requirements.txt
```

---

## Key decisions

- **`label:Receipt` as pre-filter:** Inbox Zero manages which senders get the Receipt label. Spend Clarity trusts that taxonomy rather than maintaining its own sender list.
- **Dry run default:** `DRY_RUN=true` — never writes to YNAB without explicit opt-in.
- **No Privacy.com yet:** client is planned, not implemented. Gmail-only for now.
- **Match rule:** amount (exact) + date (± 1 day). Ambiguous matches are skipped + logged.
- **YNAB_BUDGET_ID:** set manually in `.env` — auto-detection from YNAB's `last-used` is a V2 item.

---

## Relationship to Inbox Zero

`portfolio/inbox-zero/` maintains `gmail-filters.xml` — the XML that applies `Receipt` label in Gmail.
All known receipt senders (Apple, PayPal, Costco, Target, Uber, DoorDash, Spotify, Google Play, Rocky Mountain Power, Chewy, Enbridge Gas, FASTEL, Nike, and more) are already in the XML as of Apr 12, 2026 (68 total filters).

When a new receipt sender is found that doesn't have a `Receipt` label, the workflow is:
1. Add a filter to `inbox-zero/gmail-filters.xml`
2. Import updated XML in Gmail
3. The sender will then appear in `label:Receipt` queries

---

## Related

- Inbox Zero: `portfolio/inbox-zero/` — source of truth for Receipt label filters
- YNAB Clarity (iOS): `portfolio/ynab-clarity-ios/` — V2 will add Gmail-based categorization to iOS (deferred; iOS V1 uses keyword matching only)
- Monorepo CLAUDE.md: `~/Developer/chase/CLAUDE.md`
