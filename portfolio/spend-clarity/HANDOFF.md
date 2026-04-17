# HANDOFF — Spend Clarity

> Current session state for Claude Code / Cursor. Update before ending a session.

---

## State

| Field | Value |
|-------|-------|
| **Focus** | Privacy.com API path + optional Gmail; YNAB memo/category enrichment |
| **Status** | v0.2.2 — conditional Gmail init for Privacy-only runs; `PRIVACY_API_KEY` placeholder strip; test suite 90/90 |
| **Last touch** | 2026-04-16 |
| **Next** | Add real `PRIVACY_API_KEY` to `.env` (https://privacy.com/developer), then `python src/main.py --dry-run --merchants privacy` → live with `DRY_RUN=false`. Optional: `LOOKBACK_DAYS=30` + `AUTO_CATEGORIZE=false` for a narrow memo-only pass. |

---

## What this is

Standalone Python CLI that enriches YNAB transactions with item-level detail from Gmail receipt emails (Amazon, Apple, DoorDash, etc.) and from the **Privacy.com API** for virtual-card charges. Optionally auto-categorizes by payee (Step 4.5). Personal tool; runs locally.

Run from `portfolio/spend-clarity/`:

```bash
source .venv/bin/activate   # or: python3 -m venv .venv && pip install -r requirements.txt
python src/main.py --dry-run
```

---

## 2026-04-16 — Privacy-only without Gmail

**Problem:** `main.py` always called `gmail.authenticate()` before YNAB/Privacy work, so `--merchants privacy` with `PRIVACY_API_KEY` still required `config/gmail_credentials.json` + OAuth, contradicting the README (“API replaces email for Privacy”).

**Change:**

- `_email_merchants_for_step2()` — merchants that still use Gmail; when `PRIVACY_API_KEY` is set, `privacy` is excluded from the Gmail loop.
- Chase Gmail is initialized only when `args.pipeline_auto` **or** there is at least one merchant still using email (`email_merchants_precalc` non-empty).
- Kassie Gmail: unchanged — only connects when `KASSIE_GMAIL_TOKEN_FILE` is set **and** an active merchant is in `KASSIE_MERCHANTS` and still on the email list.
- `PRIVACY_API_KEY` values starting with `your_` (`.env.example` placeholders) are treated as unset.

**Testing:** `PYTHONPATH=<repo>/portfolio/spend-clarity pytest tests/ -q` → 90 passed. Dry-run/live against YNAB succeed without local Gmail files when a non-placeholder Privacy key is supplied via env.

---

## Architecture (current)

```
portfolio/spend-clarity/
  src/
    main.py              — entry: optional Gmail, YNAB fetch, Privacy API or Gmail receipts, match, memo, Step 4.5 categorize, PATCH
    gmail_client.py      — Gmail API + OAuth; receipt search uses label:Receipt (Gmail Forge alignment)
    privacy_client.py    — Privacy.com API → ParsedReceipt
    receipt_parser.py    — per-merchant email HTML/text
    matcher.py           — receipt ↔ YNAB txn matching + unmatched diagnostics
    ynab_client.py       — reads + bulk PATCH memos/categories
    memo_formatter.py
    categorizer.py       — overrides → payee rules → keywords
    payee_formatter.py
    pipeline_state.py    — --pipeline-auto dedupe
  config/
    category_rules.yaml
    category_overrides.yaml
  output/
    enrichment_log.txt
    unmatched_report.txt
  scripts/               — launchd install
  tests/                 — 90 tests (run with PYTHONPATH=project root)
```

---

## Environment quick reference

| Variable | Role |
|----------|------|
| `YNAB_API_TOKEN` | Required |
| `YNAB_BUDGET_ID` | Required |
| `PRIVACY_API_KEY` | Required for Privacy **API** path; omit or placeholder → Gmail fallback for `support@privacy.com` (needs OAuth) |
| `DRY_RUN` | Default `true`; set `false` for live YNAB writes |
| `AUTO_CATEGORIZE` | Default `true`; Step 4.5 categorizes **all** remaining blank-memo txns — set `false` for memo-only / tighter tests |
| `LOOKBACK_DAYS` | Default `365`; lower for faster runs |

---

## How to correct a miscategorization

1. Run with `DRY_RUN=true` first; check logs + `output/unmatched_report.txt`.
2. Add a row to `config/category_overrides.yaml` (pattern substring on cleaned payee → `category_id`).
3. Overrides win over payee rules and keyword rules.

---

## Key decisions

- **Dry run default:** `DRY_RUN=true` — no YNAB writes without explicit opt-in.
- **Step 4.5:** With `AUTO_CATEGORIZE=true`, every blank-memo transaction that matches a rule gets a category PATCH — not only receipt-matched rows. Narrow tests: `AUTO_CATEGORIZE=false`.
- **Privacy vs Gmail:** API preferred when key is valid; Gmail Forge `Receipt` label still matters for non-Privacy merchants.
- **Never overwrite an existing memo** (transactions with blank memos only are fetched for enrichment — see `ynab_client` / `CLAUDE.md` safety notes).

---

## Related

- Gmail Forge: `portfolio/gmail-forge/` — Receipt label contract: [`integrations/receipt-to-spend-clarity.md`](../gmail-forge/integrations/receipt-to-spend-clarity.md)
- YNAB Clarity iOS: `portfolio/ynab-clarity-ios/` — shared mental model for payee cleanup / overrides (separate codebase)
- Monorepo: `chase/CLAUDE.md`, `chase/HANDOFF.md`

---

## Session prompts

- New chat bootstrap: [`prompts/SESSION_START.md`](prompts/SESSION_START.md)
- Legacy full spec: [`PROMPT.md`](PROMPT.md) (historical MVP spec; prefer HANDOFF + README for current behavior)
