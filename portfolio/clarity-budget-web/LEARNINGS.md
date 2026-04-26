# Clarity Budget Web — LEARNINGS

## 2026-04-25 — Step 3: Privacy.com integration

**Privacy.com auth is `api-key`, not Bearer.** `lib/ynab.ts` uses `Authorization: Bearer <token>` (YNAB convention). Privacy.com uses `Authorization: api-key <token>`. Copying ynab.ts as the template for `lib/privacy/client.ts` would silently send Bearer headers and Privacy would 401 every request. **Lesson:** when modeling a new third-party client on an existing one, the structure transfers but the auth scheme + request shape don't — verify the target API's auth header explicitly, don't assume.

**`source` CHECK constraint forced a v1 simplification.** `clarity_budget_sync_state.source` has `check (source in ('ynab','privacy'))` (0001_init.sql:118). The plan originally wanted distinct sub-sources (`privacy_cards` vs `privacy_transactions`) so cron could track each separately. The CHECK forbids that, so both `pullCards` and `pullTransactions` write the same `source='privacy'` row — last writer wins. The cron caller (Step 5) must orchestrate cards-then-transactions atomically and report at the boundary; the audit log carries the per-call breakdown. Could have widened the CHECK in a new migration but not worth it for v1.

**Preserve user-owned columns on upsert by reading first.** `clarity_budget_privacy_cards.linked_payee_id` and `clarity_budget_privacy_transactions.matched_ynab_txn_id` are written by users (Step 8) and reconcile (Step 4), respectively — never by sync. The simple solution is "don't include those columns in the upsert payload," but Postgres `upsert` will still null them on conflict if they're listed in the column set... or will it? Testing TBD, but the safe pattern (used here): pre-fetch existing rows via `.in("token", tokens)`, build a `Map<token, value>`, and explicitly re-apply existing values to the upsert payload. Costs one extra round-trip per sync; eliminates the "did upsert reset that column?" question entirely.

**Files were already partially scaffolded.** `lib/privacy/{types,client,sync}.ts` existed from a 2026-04-24 checkpoint commit (`839e861`) but were never finished — `sync.ts` was missing the `clarity_budget_sync_state` + `clarity_budget_audit_log` writes, and `pullTransactions` required `since` instead of making it optional. **Lesson when picking up a redesign:** always `git log` the touched directory before assuming files don't exist. The HANDOFF said "Step 3 — what to build next" because the scaffolding was uncommitted-to-main but the on-disk files were further along than the doc claimed.

**Endpoint plurality is unverified.** Privacy.com's REST API has used both `/card` + `/transaction` (singular) and `/cards` + `/transactions` (plural) at various points; current docs aren't pinned in this codebase. Code ships with singular paths matching the prior scaffold; smoke test will reveal if 404s appear and a one-line swap is needed.

## 2026-04-25 — OTP callback route is reusable for OAuth without modification

`app/auth/callback/route.ts` was originally written for the magic-link OTP flow — reads `?code=`, calls `exchangeCodeForSession`, redirects to `next ?? "/"`. When adding GitHub OAuth, no callback route changes were needed: PKCE OAuth uses the **same** `?code=` exchange. The only code change for OAuth was a button on `app/login/page.tsx` calling `signInWithOAuth({ provider: 'github', options: { redirectTo: ${origin}/auth/callback?next=/ } })`.

**Reminder reinforcing the 2026-04-25 redirect-allowlist trap below:** OAuth has the same silent-fallback failure mode as OTP. If the deploy domain's `/auth/callback` isn't on the Supabase Redirect URLs allowlist, the entire OAuth round-trip will land on Site URL with no error.

## 2026-04-25 — Magic-link redirect to dead `apps.chasewhittaker.com`

**Symptom.** Sign-in attempt resulted in a magic-link email (despite the user wanting password auth) whose link redirected to `https://apps.chasewhittaker.com/...` — a domain that has **no DNS record** (`DNS_PROBE_FINISHED_NXDOMAIN`). URL pattern: `https://unqtnnxlltiadzbqpyhh.supabase.co/auth/v1/verify?token=pkc...&type=magiclink&redirect_to=https://apps.chasewhittaker.com`.

**Three stacked causes** (any one is enough to break sign-in):

1. **Code** — `app/login/page.tsx` was refactored from `signInWithOtp` → `signInWithPassword` on 2026-04-24, but the diff sat uncommitted. Production was still on the OTP path.
2. **Supabase Site URL** — set to `https://apps.chasewhittaker.com` from the deferred `SHARED_LOGIN_STRATEGY.md` plan. That domain was never DNS-configured.
3. **Supabase Redirect URLs allowlist** — did not contain `clarity-budget-web.vercel.app/auth/callback`. When the OTP code passed `emailRedirectTo: window.location.origin + "/auth/callback"`, Supabase **silently** ignored it (because not on allowlist) and fell back to Site URL. This is the exact failure mode `funded-web` documented on 2026-04-16.

**Fix.**
- Committed + pushed the password-auth refactor (commit `72799f9`).
- Manual: in Supabase Dashboard → Auth → URL Configuration, set Site URL to `https://clarity-budget-web.vercel.app` and add the deploy domain (+ `localhost:3000`) to Redirect URLs. Remove `apps.chasewhittaker.com`.

**The trap to remember.** Supabase's `emailRedirectTo` parameter is **silently ignored** if the URL isn't on the Redirect URLs allowlist. No error, no warning — it just falls back to Site URL. If you ever reintroduce `signInWithOtp` (or `signInWithOAuth`, or `resetPasswordForEmail`) here, **the deploy domain MUST be in the allowlist first**.

**Decision: `apps.chasewhittaker.com` is not used by this app.** This app is at `clarity-budget-web.vercel.app` and uses password auth. `SHARED_LOGIN_STRATEGY.md` (canonical-host login) is deferred indefinitely — until/unless someone actually buys + DNS-configures that domain.

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
