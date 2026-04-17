# Roadmap — Spend Radar

> Google Apps Script backend + companion web dashboard (`spend-radar-web`).
> Scans Gmail `label:Receipt` emails → writes `Subscriptions` and `Receipts` tabs to a dedicated Google Sheet.

---

## Current state — v0.1

| Area | Status |
|------|--------|
| Apps Script `refreshSubscriptions()` — aggregated recurring detector | ✅ Done (extracted from Gmail Forge) |
| Sheet menu via installable `onOpen` trigger | ✅ Done |
| `debugSubscriptions()` + `healthCheck()` diagnostics | ✅ Done |
| Apps Script split into 6 files (subscriptions/receipts/extraction/audit/triggers/helpers) | 🔲 Phase B |
| `Receipts` tab — per-receipt rows w/ merchant, item, amount, category | 🔲 Phase B |
| Rule-based extraction (`SENDER_RULES` + heuristic fallback) | 🔲 Phase B |
| `Subscriptions` tab — add Category column + Monthly/Yearly totals | 🔲 Phase B |
| Rules-based Audit tab — flags rows needing review | 🔲 Phase B |
| `createDedicatedSheet()` helper — migrate off Gmail Forge Sheet | 🔲 Phase C |
| clasp prep (`.clasp.json.example`, `.gitignore`) | 🔲 Phase D |
| `spend-radar-web` — CRA dashboard reading published CSV | 🔲 Phase E |
| Portfolio table rows in root CLAUDE.md | 🔲 Phase F |
| Cross-project "Refresh All Apps" button (Gmail Forge + Spend Radar) | 🔲 Phase G |

---

## V1 Backlog (next up)

| # | Priority | Task | Why |
|---|----------|------|-----|
| 1 | 🔴 High | **Clarity Budget bridge** — sync `Receipts` rows to Supabase so `clarity-budget-web` + iOS can show enriched receipts alongside YNAB transactions | The whole point of extracting cleaned receipts: feeding them into the budgeting surface. Start: new `spend_radar_receipts` table; Apps Script pushes on each refresh; Clarity Budget reads; iOS follows. |
| 2 | 🟡 Medium | Expand `SENDER_RULES` — grow from Audit tab worklist (unknown recurring senders get rules) | Each run surfaces new senders; rule count is the growth metric. |
| 3 | 🟡 Medium | Amazon multi-item parsing — one order = multiple line items; extract each SKU/price pair | Amazon currently collapses to a single order-ID string; losing item-level detail. |
| 4 | 🟢 Low | YNAB cross-reference — mark `Receipts` rows that matched a YNAB transaction (via `spend-clarity` shared logic) | Closes the loop: see which receipts were enriched vs sitting unattached. |
| 5 | 🟢 Low | Retry / rate-limit handling for `GmailApp.search` with >500 threads | Current cap is 500; real inbox will exceed this within ~18 months. |

---

## V2 Ideas (parked)

| # | Idea | Notes |
|---|------|-------|
| V2-1 | PWA install for `spend-radar-web` | Add manifest + icon pack, standalone launcher on phone. |
| V2-2 | Price-change alerts — notify when a subscription amount increases | Apps Script compares last amount vs previous; send email / toast. |
| V2-3 | Cancel-candidate score | Weighted: amount × recency × usage signals (last login, last activity from email). |
| V2-4 | Category editing in Sheet | Changes in `Receipts` tab flow back to overrides for that sender. |
| V2-5 | Export monthly summary CSV for partner review | Runs on schedule, drops into Drive. |

---

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-16 | API-free extraction (no Claude API) | Zero cost, zero latency, no secret to manage; rule set grows from Audit worklist. |
| 2026-04-16 | Separate Google Sheet from Gmail Forge | Different lifecycle, different UX, different reader expectations. |
| 2026-04-16 | Companion web dashboard reads published CSV (no Supabase for Spend Radar itself) | Spend Radar is read-only for viewers; CSV export is free and the Sheet already has the source of truth. |
| 2026-04-16 | Clarity Budget bridge deferred to ROADMAP top (not bundled into initial extraction plan) | Ship Spend Radar + web dashboard standalone first; bridge is a follow-up with its own Supabase schema. |
| 2026-04-16 | Tokenized web app for cross-project refresh | Only safe way to call Gmail Forge's `autoSort()` from another Apps Script project; shared secret in Script Properties. |
