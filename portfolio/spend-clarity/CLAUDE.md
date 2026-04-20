# CLAUDE.md — Spend Clarity

Python CLI at `portfolio/spend-clarity/` in the monorepo (`chase/`). Enriches YNAB transactions with memos (receipt items / Privacy descriptors) and optional category assignments.

## What This App Is

A Python CLI that enriches YNAB transactions with real merchant names and item-level memos sourced from Gmail receipts and Privacy.com virtual card data. Runs dry-mode by default and writes back to YNAB only when explicitly enabled, making it safe to iterate without touching live budget data.

## Before starting

1. Read **`HANDOFF.md`** — live state, env, recent changes.
2. Read **`LEARNINGS.md`** — gotchas (category IDs, Step 4.5, security).
3. Use **`prompts/SESSION_START.md`** for new-chat bootstrap text.

## Layout (actual)

```
src/
  main.py           — orchestrator (YNAB → receipts → match → memo → categorize → PATCH)
  gmail_client.py   — OAuth + Gmail search (`label:Receipt` alignment with Gmail Forge)
  privacy_client.py — Privacy.com API
  ynab_client.py    — GET transactions / PATCH bulk
  matcher.py, memo_formatter.py, categorizer.py, receipt_parser.py, payee_formatter.py
config/
  category_rules.yaml, category_overrides.yaml
tests/              — pytest; use PYTHONPATH=project root (see README)
output/             — enrichment_log.txt, unmatched_report.txt
```

Legacy references to `ynab-enrich`, `src/ynab_enrich/`, or Keychain-only secrets in old drafts are obsolete — this project uses **`.env`** + gitignored JSON for Gmail (see `.env.example`).

## Safety

- **`DRY_RUN=true` default** — no YNAB writes until `DRY_RUN=false` or CLI implies live (no `--dry-run` with env false).
- **Blank memos only** for enrichment fetch — do not overwrite existing memos (enforced in client/logic; confirm when touching `ynab_client`).
- **Secrets:** never commit `.env`, tokens, or real category/budget identifiers in YAML comments.

## Stack

- Python 3.11+ (3.14 tested). `requirements.txt` + venv.
- Run tests: `PYTHONPATH=$(pwd) pytest tests/ -q` from project directory.

## Out of scope

Hosted service, multi-tenant UI, scraping beyond email/API parsers — local CLI only.

## Related repos

- **`portfolio/gmail-forge/`** — Receipt label filters; keep sender lists aligned with `MERCHANTS` in `main.py`.
- **`portfolio/ynab-clarity-ios/`** — companion app; payee display rules conceptually aligned, not shared code.
