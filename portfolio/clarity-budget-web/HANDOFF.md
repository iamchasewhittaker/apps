# Clarity Budget Web — HANDOFF

## State

| Field | Value |
|---|---|
| Focus | Phase 1 — spending visibility |
| Status | Session 1 done; Session 2 next |
| Last touch | 2026-04-20 |
| URL | local (`pnpm dev`) |
| Branch | main |

## What was built — Session 1 (2026-04-20)
- `lib/ynab.ts` — added `YNABTransaction`, `YNABSubTransaction` types + `fetchTransactions` (60-day window, split-tx aware)
- `lib/constants.ts` — added `YNAB_TX_KEY = "chase_budget_web_tx_v1"`
- `components/HomeDashboard.tsx` — added:
  - Transaction state + 15-min cache (`TxCache` in `chase_budget_web_tx_v1`)
  - `refreshTransactions(force?)` useCallback
  - `refreshMetrics` now calls `refreshTransactions`; "Refresh numbers" passes `force=true`
  - `spendByCategory`, `totalSpent`, `txDateRange`, `outflowCount` useMemos
  - "Where your money went" spending breakdown section (total spent + top-8 category bars)
  - Transactions hydrated from cache on mount (shows instantly on revisit)
- Phase 0 docs: CLAUDE.md, HANDOFF.md, ROADMAP.md, CHANGELOG.md, LEARNINGS.md

## Next session — Session 2
Build the full spending visibility layer:
1. `lib/aggregations.ts` — reusable group-by helpers (by payee, by week, by account)
2. `components/SpendingBreakdown.tsx` — by category / by payee / by week tabs
3. `lib/filterState.ts` — filter shape + URL-param persistence
4. `components/TransactionFilters.tsx` — date range, category, account, payee search, amount
5. `components/TransactionList.tsx` — filterable, sortable transaction list with inline role tags
6. Wire filters: breakdown + list both read from shared filter state

## Session 3 — Money Companion
- Install `ai` SDK, create `app/api/companion/route.ts` (streaming, aggregates-only context)
- `components/CompanionCard.tsx` — ambient generated question on dashboard
- `components/CompanionDrawer.tsx` — on-demand chat panel
- Supabase `clarity_budget_reflections` table for answered questions
