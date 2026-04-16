# Session start — Spend Clarity

Copy into a **new** chat with `portfolio/spend-clarity/` as the workspace (or monorepo root).

---

Read first:

1. [`HANDOFF.md`](../HANDOFF.md) — current state, env table, what changed last
2. [`LEARNINGS.md`](../LEARNINGS.md) — project gotchas
3. [`README.md`](../README.md) — setup, Privacy vs Gmail, dry-run commands

---

## Default goal

Maintain or extend the Python CLI that enriches **YNAB** transactions (memos + optional categories) using **Gmail** receipts and/or the **Privacy.com API**. Respect `DRY_RUN=true` until the user explicitly opts into writes.

---

## Commands reference

```bash
cd portfolio/spend-clarity
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Tests (from repo: PYTHONPATH must include project root for `from src.…` imports in tests)
PYTHONPATH=$(pwd) pytest tests/ -q

# OAuth (only if using Gmail merchants — not needed for Privacy-only when PRIVACY_API_KEY is set)
python src/main.py --auth

# Preview
python src/main.py --dry-run --merchants privacy

# Live writes
DRY_RUN=false python src/main.py --merchants privacy
```

---

## Constraints

- Do not commit `.env`, `config/gmail_token.json`, or real API keys.
- Step 4.5 can categorize many payees when `AUTO_CATEGORIZE=true`; call out when suggesting production runs.
- After behavior changes, update `HANDOFF.md`, `CHANGELOG.md` `[Unreleased]`, and append non-obvious fixes to `LEARNINGS.md`.
