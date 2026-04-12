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

### 2026-04-11 — Real financial data pushed to public GitHub
**What happened:** `analyze.py` and `budget_dashboard.html` from the old `projects/Money/` folder contained real income ($7,874/mo), employer name (Kids Village), mortgage amount ($2,411), Citibank balance ($8,874), and 12 months of spending history. These were committed and pushed to `origin/main` on a **public** GitHub repo (`iamchasewhittaker/apps`).
**Root cause:** The repo is public and no one realized it. When the Money project was archived into `portfolio/archive/money/`, the sensitive scripts came along. There was no `.gitignore` blocking `.py` and `.html` files in the archive folder, and the "What NOT to Do" rules in `CLAUDE.md` didn't mention financial data.
**Fix / lesson:** (1) Backed up files to `~/Desktop/money-backup/`. (2) Scrubbed all 9 file paths from full git history with `git filter-repo --invert-paths`. (3) Force-pushed all branches. (4) Added `portfolio/archive/.gitignore` blocking `*.py`, `*.html`, `*.csv`, `*.xlsx`. (5) Added "Sensitive Data — Never Commit" section to root `CLAUDE.md`. Never move financial analysis scripts into a tracked directory without checking if the repo is public.
**Tags:** git, security, data-loss
