# Transaction Enricher — Future Roadmap

Last updated: 2026-03-28

---

## 🔲 Step 5 — Smarter Unmatched Resolution
Help the user deal with the transactions that didn't match any enrichment source.

- Group unmatched transactions by payee pattern and let the user bulk-assign a payee name + category to all of them at once
- "Did you mean...?" suggestions based on fuzzy matching against existing enriched payees
- One-click "add as rule" from any unmatched row — captures the payee pattern directly into Settings without opening the panel

---

## 🔲 Step 6 — Split Transactions
Support splitting a single bank transaction into multiple line items for YNAB.

- Click "split" on any transaction row to divide it into 2+ sub-transactions
- Each split gets its own payee, memo, category, and amount
- Amounts must sum to the original; real-time validation with remainder indicator
- Splits exported as separate rows in both CSVs

---

## 🔲 Step 7 — Recurring Transaction Detection
Automatically identify subscriptions and recurring charges.

- Flag transactions that appear on a regular cadence (monthly, weekly, annual) with a 🔁 badge
- Show a "Recurring" summary section with estimated monthly cost
- Optionally auto-apply a "Subscriptions" category to detected recurring charges

---

## 🔲 Step 8 — Multi-Account Support
Handle more than one bank CSV at a time.

- Upload multiple bank CSVs (e.g. checking + credit card) and merge into a single enriched view
- Account label on each row (user-named, e.g. "Chase Checking", "Citi Visa")
- Account filter in the export filter bar
- Each account stored and re-enrichable independently

---

## 🔲 Step 9 — Duplicate Detection
Flag potential duplicate transactions before exporting to YNAB.

- Detect rows with same amount + same/similar payee within a configurable day window
- Highlight duplicates with a ⚠️ badge; let user dismiss or merge
- Useful when bank CSV and enrichment source both contain the same charge

---

## 🔲 Step 10 — Export Presets
Save and reuse export filter configurations.

- Name and save a filter combination (e.g. "Last month enriched only")
- One-click to apply a saved preset
- Presets persisted in localStorage alongside rules

---

## 💡 Smaller Quality-of-Life Ideas
These don't need a full step — could be bundled into any session:

- **Undo last edit** — Ctrl+Z to revert the most recent inline edit
- **Keyboard navigation** — Tab between rows, arrow keys to move up/down
- **Search / filter bar** on the transaction list (separate from export filter) — type to find a specific payee
- **Sort controls** — sort transaction list by date, amount, or match status
- **Category summary** — collapsible breakdown of total spend per category after enriching
- **Re-upload without losing edits** — warn before clearing results if there are unsaved edits
- **Dark/light theme toggle** — for users who prefer light mode
