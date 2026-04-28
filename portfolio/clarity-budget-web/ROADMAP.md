# Clarity Budget Web — ROADMAP

> **v1 Redesign in progress.** Phase 2 (Money Companion) deferred. Active plan: `plans/clarity-budget-web-redesign.md` (10 steps). Progress: Steps 1–7 ✅ done + deployed (2026-04-28). Step 8 (`/settings` Privacy connector + card mapping) is next.
>
> **Parallel workstream — AI auto-categorization.** v0 on main as of 2026-04-28 (commit `7a461b6`). Migration `0003` pushed. `AI_GATEWAY_API_KEY` set in production. Settings migration loop fixed. `/categorize` should now work end-to-end (pending production promotion + signed-in smoke test). Plan: `~/.claude/plans/whats-the-next-step-fluffy-wadler.md`.

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

## Phase 1.5 — AI auto-categorization (feature/ai-categorize, 2026-04-26)

- [x] `supabase/migrations/0003_categorization_suggestions.sql` (table + RLS + sync_state CHECK widening)
- [x] `lib/ynab.ts` — `fetchUncategorizedTransactions`, `bulkUpdateTransactions`
- [x] `lib/ai/gateway.ts` — Vercel AI Gateway wrapper (default `openai/gpt-4o-mini`)
- [x] `lib/categorize/{types,prompt,logic,persist,run}.ts` — full pipeline w/ allowlist filter, confidence threshold (0.85), prompt-hash idempotency, splits-aware PATCH
- [x] `lib/categorize/__tests__/{prompt,classify}.test.ts` — 20 vitest cases
- [x] `app/api/categorize/{run,apply}/route.ts` — POST endpoints (run: orchestrate; apply: per-row apply/dismiss/undo)
- [x] `app/(app-shell)/categorize/page.tsx` + `components/categorize/{CategorizeQueue,CategorizeRow}.tsx` — review queue UI
- [x] `components/shell/NavBar.tsx` — `Categorize` nav link
- [x] **Manual: push migration** `supabase db push` — applied 2026-04-28
- [x] **Manual: set `AI_GATEWAY_API_KEY`** in `.env.local` + Vercel production env — done 2026-04-28 (preview env: set via dashboard or upgrade CLI)
- [x] **Settings migration loop fix** — commit `7a461b6` on main (2026-04-28)
- [ ] **Smoke: production** sign in → `/settings` (should show "Token stored ✓") → `/categorize` → Run → confirm auto-applied + queued counts; verify idempotent re-run
- [ ] Add `AI_GATEWAY_API_KEY` to Vercel **preview** env (blocked by CLI 50.x bug; use dashboard or `pnpm add -g vercel@latest`)
- [ ] Promote preview deployment `clarity-budget-nb9nu9ctb-iamchasewhittakers-projects.vercel.app` to production (or wait for next push)
- [ ] Stretch: cron auto-run via `/api/cron/sync` once smoke passes

## Phase 2 — Money Companion

### Session 3 — Claude AI layer
- [ ] `app/api/companion/route.ts` — streaming endpoint (aggregates context, no raw tx)
- [ ] `lib/companion/prompts.ts` — question lenses (Surprise, Recurring, Drift, Wins, Faith)
- [ ] `lib/companion/context.ts` — tx → aggregate snapshot builder
- [ ] `components/CompanionCard.tsx` — ambient question card on dashboard
- [ ] `components/CompanionDrawer.tsx` — on-demand chat drawer
- [ ] `lib/reflections.ts` — Supabase CRUD for answered questions
- [ ] SQL migration — `clarity_budget_reflections` table
- [ ] _(reuse `lib/ai/gateway.ts` from Phase 1.5 instead of re-installing the SDK)_

## Backlog / Ideas
- Historical trends: compare current month vs last month vs 3-month average
- Weekly sparkline chart (last 8 weeks of spending)
- "Unusual" spend detection — flag categories > 20% over average
- Export to CSV
- iOS parity: push aggregates to Supabase so iOS app can read companion context
- Deploy to Vercel (currently local-only)
