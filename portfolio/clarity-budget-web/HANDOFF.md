# Clarity Budget Web — HANDOFF

## State

| Field | Value |
|---|---|
| Focus | Phase 1 — spending visibility |
| Status | Session 2 done; Session 3 next (Money Companion) |
| Last touch | 2026-04-20 |
| URL | local (`pnpm dev`) |
| Branch | main |

## What was built — Session 2 (2026-04-20)
- `lib/aggregations.ts` — `flattenSpendLines` (split-tx aware), `groupByCategory / Payee / Account / Week`, `totalSpent`, `outflowCount`, `dateRangeLabel`, `roleColor`
- `lib/filterState.ts` — `FilterState` shape + `applyFilters(lines, filters)` + `useUrlFilterState()` hook (URL-persisted via `useSearchParams` / `router.replace`, no history spam)
- `components/TransactionFilters.tsx` — collapsible; count badge + Clear; date range, payee (250ms debounced), amount min/max, multi-select categories + accounts
- `components/SpendingBreakdown.tsx` — tabs: By category / By payee / By week (top 8, total spent, count)
- `components/TransactionList.tsx` — sortable (date / amount / payee), role chip per row, inflow green, 50-row page + "Show more"
- `app/page.tsx` — wrapped `<HomeDashboard>` in `<Suspense>` (required by Next 15 for `useSearchParams`)
- `HomeDashboard.tsx` — removed inline spending memos; now builds `spendLines` once and feeds `filteredLines` into the three components

## What was built — Session 1 (2026-04-20)
- `lib/ynab.ts` — added `YNABTransaction`, `YNABSubTransaction` types + `fetchTransactions` (60-day window, split-tx aware)
- `lib/constants.ts` — added `YNAB_TX_KEY = "chase_budget_web_tx_v1"`
- `components/HomeDashboard.tsx` — transaction state, 15-min cache, `refreshTransactions`, "Where your money went" breakdown (later replaced in Session 2)

## Next session — Session 3: Money Companion
Claude-powered ambient reflection layer (WHI-73, 8pts):
1. Install `ai` SDK; wire Vercel AI Gateway (no direct `@ai-sdk/anthropic`)
2. `app/api/companion/route.ts` — streaming endpoint, accepts an **aggregates snapshot** (never raw transactions)
3. `lib/companion/context.ts` — build snapshot from `SpendLine[]` using `lib/aggregations.ts` (top categories, week-over-week delta, largest outflows by payee)
4. `lib/companion/prompts.ts` — question lenses (Surprise / Recurring / Drift / Wins / Faith)
5. `components/CompanionCard.tsx` — ambient question on dashboard
6. `components/CompanionDrawer.tsx` — on-demand chat panel
7. `lib/reflections.ts` + SQL migration — `clarity_budget_reflections` table (Supabase)

### Fresh session prompt — Clarity Budget Web Session 3
> Start Session 3 of Clarity Budget Web (WHI-73, Money Companion). Read `portfolio/clarity-budget-web/CLAUDE.md` + `HANDOFF.md` + `ROADMAP.md` first. Implement the Claude-powered ambient reflection layer per HANDOFF.md "Next session". Use the Vercel AI Gateway (plain `"provider/model"` strings via the `ai` SDK), not `@ai-sdk/anthropic`. Never send raw transactions — only aggregates built from `lib/aggregations.ts`. When done, update CHANGELOG, HANDOFF, ROADMAP, LEARNINGS, repo root `CLAUDE.md` + `ROADMAP.md`, and the Shipyard metadata row; mark Linear WHI-73 done.
