# Clarity Budget Web — ROADMAP

> **v1 Redesign in progress.** Phase 2 (Money Companion) deferred. Active plan: `plans/clarity-budget-web-redesign.md` (10 steps). Progress: Step 1 (backend foundation, 2026-04-23) + Step 2 (auth refactor, 2026-04-24) + Step 3 (Privacy.com integration, 2026-04-25) ✅ done. Step 4 (reconcile logic + first unit tests) up next.

## Phase 1 — Spending Visibility

### Session 1 ✅ Done (2026-04-20)
- [x] `fetchTransactions` in `lib/ynab.ts` (60-day window, split-tx aware)
- [x] Transaction cache in `chase_budget_web_tx_v1` (15-min TTL, never synced)
- [x] "Where your money went" card — top-8 categories by spend + total spent
- [x] Phase 0 docs (CLAUDE.md, HANDOFF.md, ROADMAP.md, CHANGELOG.md, LEARNINGS.md)

### Session 2 ✅ Done (2026-04-20)
- [x] `lib/aggregations.ts` — `flattenSpendLines`, `groupByCategory/Payee/Account/Week`, `totalSpent`, `outflowCount`, `roleColor`
- [x] `lib/filterState.ts` — `FilterState`, `applyFilters`, `useUrlFilterState` hook (URL persistence)
- [x] `components/TransactionFilters.tsx` — collapsible bar, count badge, Clear, debounced payee search
- [x] `components/SpendingBreakdown.tsx` — tabbed breakdown (category / payee / weekly)
- [x] `components/TransactionList.tsx` — sortable list with role chips + inflow highlighting + "Show more"

## Phase 2 — Money Companion

### Session 3 — Claude AI layer
- [ ] Install `ai` SDK; configure Vercel AI Gateway
- [ ] `app/api/companion/route.ts` — streaming endpoint (aggregates context, no raw tx)
- [ ] `lib/companion/prompts.ts` — question lenses (Surprise, Recurring, Drift, Wins, Faith)
- [ ] `lib/companion/context.ts` — tx → aggregate snapshot builder
- [ ] `components/CompanionCard.tsx` — ambient question card on dashboard
- [ ] `components/CompanionDrawer.tsx` — on-demand chat drawer
- [ ] `lib/reflections.ts` — Supabase CRUD for answered questions
- [ ] SQL migration — `clarity_budget_reflections` table

## Backlog / Ideas
- Historical trends: compare current month vs last month vs 3-month average
- Weekly sparkline chart (last 8 weeks of spending)
- "Unusual" spend detection — flag categories > 20% over average
- Export to CSV
- iOS parity: push aggregates to Supabase so iOS app can read companion context
- Deploy to Vercel (currently local-only)
