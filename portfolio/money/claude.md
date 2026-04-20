# Transaction Enricher — Project Instructions

## What This Is
A single-page React app that takes a bank account CSV export and cross-references it with Amazon order history, Apple purchase history, and Privacy.com transaction exports. It resolves generic payee names into real merchant names, adds item-level memos, and suggests spending categories.

## Current Features
- Auto-detects bank CSV column structure (date, amount, payee)
- Matches transactions by date + amount using a configurable day window (0–7 days, default 3) with ±$0.01 tolerance
- Enriches Amazon, Apple, and Privacy.com charges
- Viewable enriched transaction list in-app
- Click any transaction row to inline-edit payee, memo, and category
- Edited rows show a badge; edits are reflected in both CSV downloads
- Stats row tracks Total / Enriched / Unmatched / Auto-Cat / Edited counts
- Persistent category rules: auto-assign categories based on payee patterns; add/delete rules in settings panel; 20 built-in defaults
- Configurable date match window (0–7 days) with per-match confidence scores (0–100%)
- Confidence pill on each enriched row (color-coded green/yellow/red) with hover tooltip showing date offset and amount difference
- Avg confidence summary bar across all matched rows
- **Export filter bar**: filter by match status (All / Enriched / Unmatched) and date range before downloading; live row count shows how many rows will export; CLEAR button resets filters; filter resets automatically when re-enriching
- Download buttons show filtered row count inline (e.g. "↓ YNAB CSV (42)")
- Downloads as YNAB-formatted CSV or full enriched CSV — both respect active export filters
- Full CSV includes Confidence column
- All settings (rules + day window) persisted in localStorage

## What This App Is

A React app that cross-references bank CSV exports against Amazon, Apple, and Privacy.com transaction history to resolve generic payee names into real merchant names and add item-level memos. Superseded by Spend Clarity (Python CLI) for enrichment depth, but still useful for ad-hoc CSV enrichment without any setup.

## Aesthetic
- Dark monospace theme
- Font: DM Mono / Fira Mono
- Accent: `#4ade80` (green)
- Background: `#0f1117`
- Surface: `#1a1d27`
- Always preserve this aesthetic when adding features

## How Each Session Works
1. User says "let's work on step X" or "next step"
2. User pastes the current artifact code (or it's attached as a file)
3. We implement exactly one step — no scope creep
4. Output is the full updated artifact, ready to paste back
5. Create new output files at the end of each session (see After Each Session)

## Development Roadmap

### ✅ Completed
- **Initial build** — CSV upload, column detection, matching engine, enrichment, download
- **Step 1 — Inline Editing** — click any row to edit payee, memo, category; edited badge; Enter/Escape shortcuts; edits reflected in downloads
- **Step 2 — Persistent Category Rules** — auto-apply categories via payee pattern matching; settings panel to add/delete rules; 20 built-in defaults; persisted in localStorage; ⚡ badge on auto-categorized rows
- **Step 3 — Improved Date Matching** — configurable 0–7 day window slider in settings (persisted); confidence scoring per match (55% date proximity + 45% amount exactness); confidence pill with mini bar on each row; avg confidence summary bar; confidence column in full CSV export
- **Step 4 — Export Improvements** — filter bar above download buttons; toggle All / Enriched / Unmatched; date range from/to pickers; live filtered row count; CLEAR button; download buttons show filtered count; both CSVs export only filtered rows; filter resets on re-enrich

### ⏭️ Skipped
- **Privacy.com API Integration** — skipped; user will continue uploading Privacy.com CSV exports manually

### 🔲 Step 5 — (TBD)
See ROADMAP.md for the full list of recommended future steps and ideas.

## After Each Session
- Mark the completed step as ✅ in this file
- Update the "Current Features" section with anything new
- Update memory with what was completed
- Create the following output files for easy download and project update:
  - `claude.md` — updated project instructions (this file)
  - `ROADMAP.md` — updated future roadmap with any new ideas or reprioritization
  - `TransactionEnricher.jsx` — updated artifact code (only when code changed)
