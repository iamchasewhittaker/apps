# Session Start — Money (Archived) (2026-04-29)

> This app is **archived**. This template exists for historical reference only.

---

## Journey

- **v0.1 — Initial build** — Single-page React app: bank CSV upload, column auto-detection, matching engine, enrichment against Amazon/Apple/Privacy.com exports, YNAB-formatted CSV download.
- **Step 1 — Inline Editing** — Click any row to edit payee, memo, category. Edited badge. Enter/Escape shortcuts.
- **Step 2 — Persistent Category Rules** — Auto-apply categories via payee pattern matching. Settings panel with 20 built-in defaults. Persisted in localStorage.
- **Step 3 — Improved Date Matching** — Configurable 0-7 day window. Confidence scoring per match (55% date proximity + 45% amount exactness). Confidence pill on each row.
- **Step 4 — Export Improvements** — Filter bar (All / Enriched / Unmatched + date range). Live filtered row count. Both CSVs respect active filters.
- **Privacy.com API Integration** — Skipped; manual CSV upload kept.
- **2026-04-20** — Archived. Superseded by Spend Clarity (Python CLI) for automated YNAB enrichment and Spend Radar (Apps Script) for subscription detection. Budget visualization moved to Clarity Budget (web + iOS).

---

## Archived state

| Field | Value |
|-------|-------|
| Version | v0.1 (Steps 1-4 shipped) |
| Storage key | `chase_money_v1` |
| Superseded by | Spend Clarity (`portfolio/spend-clarity/`), Spend Radar (`portfolio/spend-radar/`), Clarity Budget (`portfolio/clarity-budget-web/` + `portfolio/clarity-budget-ios/`) |
| Archive date | 2026-04-20 |
| Location | portfolio/archive/money |
| Stack | React (CRA) + localStorage (Transaction Enricher) / Python 3 (Budget Dashboard) |
| Aesthetic | Dark monospace, DM Mono / Fira Mono, accent `#4ade80`, bg `#0f1117` |
