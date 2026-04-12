# MVP Audit — Money (Transaction Enricher)
*Audit date: 2026-04-12 · Framework: 6-step MVP (Capture → Validate → Define → Build → Ship → Learn)*

*Status: Archived — superseded by Spend Clarity (Python CLI), which handles the same enrichment problem with a more robust architecture.*

---

**What it is:** React SPA that enriches bank CSV exports with Amazon, Apple, and Privacy.com transaction data — auto-detects CSV structure, matches by date + amount, provides inline editing, persistent category rules, and confidence scoring.

**Current step (per the framework):** Archived (was at Step 4 — Build, Steps 1–4 complete)

**Evidence for that step:** CLAUDE.md documents a clear 4-step development roadmap with Steps 1–4 marked complete. CSV upload, transaction matching engine, merchant enrichment (Amazon/Apple/Privacy.com), category rule system (20 built-in defaults), and export filtering all built and working. Dark monospace theme. Supabase/deployment step was skipped. No deployment URL. No Step 5/6 docs.

**What's missing to legitimately be at this step:** The project was archived before Ship. It was functional as a local tool but never deployed. The Step 5 scope decision was listed as "TBD" and never made.

**Biggest risk/red flag:** The same enrichment problem this solved is now being tackled by Spend Clarity (Python CLI). Two tools, same problem — one had to go. Money was the right one to archive: no deployment, no tests, React SPA is harder to maintain for a data-processing use case than a Python CLI.

**Recommended next action:** No action needed. Code is preserved as a reference implementation. If Spend Clarity needs UI inspiration for an eventual frontend, this is the place to look. The category rule system and confidence scoring are worth studying.
