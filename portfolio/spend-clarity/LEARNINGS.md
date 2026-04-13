# Learnings — Spend Clarity

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | react | git | deploy | supabase | python | api | ...

---

## Entries

### 2026-04-12 — All category IDs were wrong (pointed to a deleted budget)
**What happened:** Every `category_rules.yaml` entry had IDs from budget `583fdbca` ("ynab-enrichment") — a budget that no longer existed. The actual working budget is `ab0a40fe`. Every categorization write since the tool was created was writing invalid IDs and silently failing.
**Root cause:** The project was consolidated from `projects/ynab-enrichment/` which had its own test budget. When the code was migrated to `portfolio/spend-clarity/`, the YAML was never updated with real budget IDs. No validation step checked whether IDs were valid at startup.
**Fix / lesson:** (1) Fetched real category list via `curl -H "Authorization: Bearer {token}" https://api.ynab.com/v1/budgets/{id}/categories` to get ground-truth IDs. (2) Rewrote all 9 entries. (3) Added a `# Budget:` comment pointing to `.env` (not the ID itself). Future: add a startup validation step that checks at least one category ID resolves against the live budget.
**Tags:** ynab, api, config, gotcha

### 2026-04-12 — YNAB category names have emoji suffixes that break name matching
**What happened:** `setup_categories.py` tried to match names like "Groceries" but the YNAB API returned "Groceries 🥕". Name lookups failed silently, leaving category IDs unresolved.
**Root cause:** YNAB allows emoji in category names. The Python-side name matching assumed plain ASCII strings.
**Fix / lesson:** Added `strip_emojis(s)` using `re.sub(r'[^\x00-\u024F]', '', s)` applied before building the name-to-ID lookup dict. Also added group-qualified keys (`"NEEDS/Clothing"`) to handle duplicate base names across category groups.
**Tags:** python, ynab, api, gotcha

### 2026-04-12 — 80% of transactions never got categorized (receipt-only flow)
**What happened:** The original `main.py` only attempted categorization after receipt email matching. Since most transactions have no receipt email, they were silently skipped.
**Root cause:** Categorization was wired into the receipt-matching step, not as a separate pass. The assumption was "you need a receipt to know the category" — but payee name alone is sufficient for most merchants (Netflix, Starbucks, Chevron, etc.).
**Fix / lesson:** Added Step 4.5 in `main.py` — after receipt matching, iterate ALL blank-memo transactions and apply `categorize_transaction(payee=display_payee(raw))`. This immediately handles subscriptions, dining, gas, pharmacy, and other predictable merchants with no email receipt.
**Tags:** python, categorization, gotcha

### 2026-04-11 — Real financial data pushed to public GitHub
**What happened:** `analyze.py` and `budget_dashboard.html` from the old `projects/Money/` folder contained real income ($7,874/mo), employer name (Kids Village), mortgage amount ($2,411), Citibank balance ($8,874), and 12 months of spending history. These were committed and pushed to `origin/main` on a **public** GitHub repo (`iamchasewhittaker/apps`).
**Root cause:** The repo is public and no one realized it. When the Money project was archived into `portfolio/archive/money/`, the sensitive scripts came along. There was no `.gitignore` blocking `.py` and `.html` files in the archive folder, and the "What NOT to Do" rules in `CLAUDE.md` didn't mention financial data.
**Fix / lesson:** (1) Backed up files to `~/Desktop/money-backup/`. (2) Scrubbed all 9 file paths from full git history with `git filter-repo --invert-paths`. (3) Force-pushed all branches. (4) Added `portfolio/archive/.gitignore` blocking `*.py`, `*.html`, `*.csv`, `*.xlsx`. (5) Added "Sensitive Data — Never Commit" section to root `CLAUDE.md`. Never move financial analysis scripts into a tracked directory without checking if the repo is public.
**Tags:** git, security, data-loss
