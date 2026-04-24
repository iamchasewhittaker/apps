# Clarity Budget Web — LEARNINGS

## 2026-04-24 — Step 2 auth refactor

**Supabase migration tracker can lie.** First `supabase db push` returned "Remote database is up to date" and `migration list` showed both `0001` and `0002` as applied — but the REST API returned HTTP 404 for `clarity_budget_credentials`. The tracker had rows in `supabase_migrations.schema_migrations` but the DDL had never actually run. `supabase migration repair --status reverted 0001 0002` + `db push` fixed it. **Lesson:** after every `db push`, probe a concrete table via the REST API before trusting the tracker.

**`createBrowserClient` singleton.** `@supabase/ssr`'s browser factory must be called exactly once per tab — instantiating new clients per component fragments auth state and breaks session listeners. `lib/supabase-browser.ts` caches it in module scope, keyed by the first call. Server-side has its own per-request factory (`createRouteClient()` in `lib/supabase-server.ts`).

**`middleware.ts` is mandatory for SSR auth.** Without the middleware calling `supabase.auth.getUser()` on every request, the auth cookie goes stale and the server layout's `getUser()` call returns `null` even when the browser has a valid session. The matcher excludes `_next/static`, `_next/image`, and common image extensions so middleware doesn't run on every asset fetch.

**Route groups (`(app-shell)`) don't affect URLs.** Moving `app/page.tsx` → `app/(app-shell)/page.tsx` keeps the URL as `/` but puts it under the `(app-shell)/layout.tsx` auth gate. `/login` stays outside the group so it's reachable when signed out.

**`router.refresh()` after sign-out.** `router.push('/login')` alone won't re-run the server `(app-shell)/layout.tsx` and drop the NavBar — the client router will just swap the page. Calling `router.refresh()` after `push` forces the server layout to re-evaluate `getUser()`.

**Test API routes via curl when the client can't carry a session.** For the auth gate + 401 checks, `curl -w '%{http_code}' http://localhost:$PORT/route` is faster and more reliable than programmatic browser eval (Chrome's inspector drops the eval promise mid-await when the page navigates).

**Stale `.next` cache after route moves.** Moving `app/page.tsx` into a route group broke `pnpm exec tsc --noEmit` (it referenced `../../app/page.js` from `.next/types/validator.ts`). `rm -rf .next` + re-typecheck is the fix.

## 2026-04-20 — Transaction architecture

**Decision:** Transactions stored in a separate `chase_budget_web_tx_v1` localStorage key rather than inside `BudgetBlob`. This keeps the Supabase sync clean — `pushBlob` never needs to strip transactions before syncing, and there's no risk of merchant-level PII leaking to the cloud.

**YNAB split transactions:** Parent transactions with `subtransactions.length > 0` have no `category_name` on the parent. Always iterate `subtransactions` for category attribution. Missing this gives misleading "Uncategorized" totals.

**Cache dependency order:** `refreshTransactions` is a dep of `refreshMetrics` (not the other way). Changing token or budgetId invalidates both. The `force` flag bypasses the 15-min cache when user explicitly clicks "Refresh numbers".

**useMemo for spending analytics:** Computed inline in HomeDashboard for now. When Session 2 extracts `SpendingBreakdown.tsx`, move these memos into that component or into `lib/aggregations.ts`.

## 2026-04-20 — Session 2: filters + breakdown + list

**Flatten early, filter late.** The Session 1 code special-cased split transactions in every aggregator (`spendByCategory` + `totalSpent` both had to branch on `subtransactions.length`). Session 2 replaces that with a single `flattenSpendLines(txs, mappings)` pass that emits one `SpendLine` per subtransaction (or per whole tx if not split). All downstream code (filters, `groupBy*`, the transaction list) runs on a flat shape. **Lesson:** when a data structure has optional-child arrays that every consumer must handle, flatten once at the boundary — don't push that branching into each caller.

**Next.js 15 + `useSearchParams` + Suspense.** Calling `useSearchParams()` inside a client component that sits under a statically-rendered route will fail the build (or emit a CSR-bailout warning) unless wrapped in a `<Suspense>` boundary. Fix in `app/page.tsx`: `<Suspense><HomeDashboard /></Suspense>`. No fallback needed for this case because the initial render is cheap.

**URL as filter store.** `router.replace(pathname + "?" + qs, { scroll: false })` (not `push`) is the right primitive for filter UIs — otherwise every keystroke in the payee search would bloat the back-button history. The `useUrlFilterState` hook returns `[filters, setFilters]` — same signature as `useState`, so `HomeDashboard` didn't need any other wiring changes.

**Session 3 unblock.** Because aggregates now live in `lib/aggregations.ts` (not inline in a component), the Money Companion can import the same helpers to build its Claude prompt context without duplicating the split-tx logic or risking divergence between what the user sees and what the LLM sees.
