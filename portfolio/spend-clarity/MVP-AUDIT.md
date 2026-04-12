# MVP Audit — Spend Clarity
*Audit date: 2026-04-12 · Framework: 6-step MVP (Capture → Validate → Define → Build → Ship → Learn)*

---

**What it is:** Python CLI that enriches YNAB transactions with item-level detail from Gmail receipts (Amazon, Apple) and Privacy.com merchant data.

**Current step (per the framework):** Step 4 — Build (early Build)

**Evidence for that step:** 9 source files, 3 test files, documented architecture. CHANGELOG shows v0.1.2 (March 30) with Privacy.com client and parser improvements. Requirements.txt exists. HANDOFF has a 3-phase roadmap. Recent commit was a security scrub (real financial data accidentally committed to public repo — since remediated).

**What's missing to legitimately be at this step:** The project docs reference `pyproject.toml` but the repo uses `requirements.txt` — gap between documentation and reality. Only 2 commits visible in the monorepo (consolidated recently from separate projects). No evidence it's been run end-to-end successfully post-consolidation.

**Biggest risk/red flag:** The security incident. Real financial data was committed to a public GitHub repo. It was scrubbed, but this is a process failure that should trigger a change — and it did (prevention rules added). Deeper risk: this tool touches real money APIs (YNAB writes, Privacy.com) with `DRY_RUN=true` as the only safety net. One config mistake writes real data.

**Recommended next action:** Run it. `python src/main.py` with `DRY_RUN=true`. Confirm it works end-to-end in the new monorepo location. If it does, document that it works and push toward Ship. If it doesn't, fix it first.
