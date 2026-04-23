# SESSION_START — Spend Clarity Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Spend Clarity is a functional v0.2.2 Python CLI.
**App:** Spend Clarity
**Slug:** spend-clarity
**One-liner:** Python CLI that enriches YNAB transactions from Gmail receipts and Privacy.com — reads raw bank imports, matches receipts, and patches YNAB with cleaned merchant names and categories.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The CLI is functional; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/spend-clarity`
2. **BRANDING.md** — developer-tool aesthetic, CLI/terminal framing, precision voice
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.2.2 shipped scope; next = LIVE_RUN on real transactions + Privacy.com
5. **APP_FLOW.md** — document the YNAB fetch → Gmail match → Privacy.com lookup → PATCH flow
6. **SESSION_START_spend-clarity.md** — stub only

Output paths: `portfolio/spend-clarity/docs/`

---

## App context — CLAUDE.md

**Version:** v0.2.2
**Stack:** Python 3 CLI — no React, no localStorage, no Supabase
**Storage:** none (YNAB token in `.env`; Gmail OAuth tokens in `config/` — gitignored)
**URL:** local Python (`python src/main.py`)
**Dependencies:** `python-dotenv`, `google-auth-oauthlib`, `requests`

**What this app is:**
A Python CLI that enriches YNAB transactions. Data flow:
1. Fetches unenriched YNAB transactions (last N days) via YNAB API
2. Matches each transaction to a Gmail receipt in `label:Receipt` (last 180 days)
3. Optionally looks up the charge in Privacy.com for merchant name clarification
4. Patches YNAB via API with enriched memo, merchant name, and category

**Key design decisions:**
- `DRY_RUN=true` by default — never writes to YNAB without explicit opt-in
- Category rules defined in `config/category_rules.yaml`
- Gmail OAuth tokens cached in `config/` (gitignored) — not re-auth on every run
- Intentionally separate from Spend Radar (different data source: bank transactions vs. receipts)

**6-module layout:**
- `src/main.py` — CLI entry, orchestration
- `src/gmail_client.py` — Gmail OAuth, thread fetch, receipt filtering
- `src/receipt_parser.py` — extract merchant, amount, date from email body
- `src/matcher.py` — fuzzy match YNAB tx to Gmail receipt
- `src/ynab_client.py` — YNAB API fetch + PATCH
- `src/privacy_client.py` — Privacy.com charge lookup (optional)

**Brand system:**
- Developer-tool aesthetic — terminal output, clear flags, dry-run safety
- Voice: precise and direct — "matched 14 of 23 transactions"

---

## App context — HANDOFF.md

**Version:** v0.2.2
**Focus:** DRY_RUN mode works end-to-end. LIVE_RUN not yet tested on real YNAB budget.
**Last touch:** 2026-04-21

**Next:**
1. Run in LIVE_RUN on a real YNAB budget (start with one week of transactions)
2. Wire Privacy.com integration (API key in `.env`)
3. Add pytest coverage for `matcher.py` edge cases
4. Consider a simple web UI (read-only review screen before patching)
