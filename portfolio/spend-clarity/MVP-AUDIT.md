# MVP Audit — Spend Clarity

*Audit date: 2026-04-16 · Framework: 6-step MVP (Capture → Validate → Define → Build → Ship → Learn)*

---

**What it is:** Python CLI that enriches YNAB transactions with item-level detail from Gmail receipts (Amazon, Apple, etc.) and from the Privacy.com API for virtual-card spend; optional payee-based categorization (Step 4.5).

**Current step:** Step 5 — Ship / Learn (tool is in daily use; iteration on matchers and category rules continues)

**Evidence:** `requirements.txt`, 90 passing tests (`PYTHONPATH=$(pwd) pytest tests/ -q`), `CHANGELOG.md`, live YNAB + API integration paths documented in `HANDOFF.md`. Privacy-only runs no longer require local Gmail OAuth when `PRIVACY_API_KEY` is a real developer key.

**What would move it to “fully shipped” for V1:** Reliable end-to-end enrichment for top merchants on a schedule (`launchd` script exists); user habit of reviewing `output/unmatched_report.txt`; optional summary stats at end of run (roadmap #7).

**Biggest risk:** Real-money writes (`DRY_RUN=false`) and category PATCHes (Step 4.5). Mitigations: dry-run default, `AUTO_CATEGORIZE` toggle, overrides file, startup category-ID validation.

**Recommended next action:** Keep `PRIVACY_API_KEY` in `.env` for Privacy imports; run `python src/main.py --dry-run` before live; align Inbox Zero Receipt filters when adding merchants (`portfolio/inbox-zero/integrations/receipt-to-spend-clarity.md`).
