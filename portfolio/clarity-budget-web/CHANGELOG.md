# Clarity Budget Web — CHANGELOG

## [Unreleased]

### Added — Session 2 (2026-04-20)
- `lib/aggregations.ts` — shared spending analytics: `flattenSpendLines` (split-tx aware), `groupByCategory/Payee/Account/Week`, `totalSpent`, `outflowCount`, `dateRangeLabel`, `roleColor`
- `lib/filterState.ts` — `FilterState` + `applyFilters` + `useUrlFilterState` hook (URL-persisted via `useSearchParams`/`router.replace`)
- `components/TransactionFilters.tsx` — collapsible filter bar with active-count badge, Clear, date range, payee search (debounced), amount min/max, multi-select categories + accounts
- `components/SpendingBreakdown.tsx` — tabbed breakdown (By category / By payee / By week) with total + top-8 bars; replaces the inline card
- `components/TransactionList.tsx` — sortable (date/amount/payee), paginated ("Show more"), role chips on each row, inflow highlighted green
- `app/page.tsx` — wrapped `HomeDashboard` in `<Suspense>` to satisfy Next.js 15 `useSearchParams` requirement

### Changed — Session 2
- `HomeDashboard.tsx` — inline `spendByCategory` / `totalSpent` / `txDateRange` / `outflowCount` `useMemo`s removed; replaced with `spendLines` + `useUrlFilterState` + `filteredLines` → fed to the three new components

### Added — Session 1 (2026-04-20)
- `fetchTransactions` in `lib/ynab.ts` — fetches last 60 days; handles split transactions via `subtransactions[]`
- `YNABTransaction` + `YNABSubTransaction` types in `lib/ynab.ts`
- `YNAB_TX_KEY = "chase_budget_web_tx_v1"` in `lib/constants.ts` (local-only, never synced to Supabase)
- Transaction cache layer (`TxCache { ts, data }`) with 15-min TTL in `HomeDashboard.tsx`
- `refreshTransactions(force?)` useCallback — skips fetch if cache is fresh; "Refresh numbers" forces it
- "Where your money went" spending breakdown section:
  - Total spent (60 days)
  - Top-8 categories by spend with relative bar widths
  - Transaction count + date range label
- Split-transaction awareness in `spendByCategory` and `totalSpent` useMemos
- Transactions hydrated from localStorage cache on mount (instant paint on revisit)
- Phase 0 docs: CLAUDE.md, HANDOFF.md, ROADMAP.md, CHANGELOG.md, LEARNINGS.md

## [v0.2.0] — pre-Session-1 baseline
- STS dashboard (month / week / day safe-to-spend)
- YNAB token + budget picker
- Category role mapping with auto-suggest
- Optional Supabase sync (BudgetBlob only)
