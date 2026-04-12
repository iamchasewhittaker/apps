# Learnings — Wellness Tracker

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

### 2026-04-12 — “Spend Clarity logo” has no repo asset
**What happened:** Wellness branding was asked to match Spend Clarity; Spend Clarity is a Python CLI with no checked-in logo raster.
**Root cause:** Product naming overlap (“Clarity” family vs Spend Clarity CLI).
**Fix / lesson:** Document palette source as **YNAB Clarity** `ClarityTheme.swift` in `docs/BRANDING.md` and Spend Clarity `HANDOFF.md`; regenerate Wellness mark from those tokens.
**Tags:** branding, docs, monorepo
