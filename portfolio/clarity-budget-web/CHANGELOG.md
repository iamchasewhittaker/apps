# Clarity Budget Web — CHANGELOG

## [Unreleased]

### Added — 2026-04-26 — AI auto-categorization (feature/ai-categorize branch)
- `supabase/migrations/0003_categorization_suggestions.sql` — new `clarity_budget_categorization_suggestions` table (id, user_id, ynab_txn_id, status, category_id, category_name, confidence, reasoning, model_id, prompt_hash, subtransactions jsonb, txn_snapshot jsonb, audit timestamps). Unique on (user_id, ynab_txn_id). RLS `owner_all`. Widens `clarity_budget_sync_state.source` CHECK to include `'ynab_categorize'`.
- `lib/ynab.ts` — `fetchUncategorizedTransactions(token, budgetId)` (GET `/transactions?type=uncategorized`), `bulkUpdateTransactions(token, budgetId, updates)` (PATCH `/transactions`), shared `patchJson` helper, new types `YNABTransactionUpdate` + `YNABUpdateSubTransaction`.
- `lib/ai/gateway.ts` + `lib/ai/index.ts` — single `generateObject<T>` wrapper around the Vercel AI Gateway. Default model `"openai/gpt-4o-mini"` (string, not provider SDK). Reads `AI_GATEWAY_API_KEY`. Normalized `TokenUsage`. Nothing else in the codebase imports `ai` directly.
- `lib/categorize/types.ts` — `Suggestion`, `RunSummary`, `CategoryAllowlistEntry`, `FewShotExample`, `CategorizableTxn`, `SuggestionStatus`, `CONFIDENCE_THRESHOLD = 0.85`.
- `lib/categorize/prompt.ts` — `buildPrompt(input)` deterministic: alphabetical category sort, lowercase-payee dedupe with cap of 30 few-shot examples, splits-aware system block, SHA-256 hash for idempotency.
- `lib/categorize/logic.ts` — pure helpers (`buildAllowlist`, `buildFewShots`, `toCategorizable`, `classifySuggestion`, `buildPatchBody`). Test-friendly (no `server-only`).
- `lib/categorize/persist.ts` — `buildSuggestionRow`, `upsertSuggestions`, `fetchPendingHashes`, `markStatus`. Conflict on `(user_id, ynab_txn_id)`.
- `lib/categorize/run.ts` — `runCategorization(userId)` orchestrator. Fetch uncategorized + categories + 90-day history → batch (size 20) → `generateObject` → allowlist filter → split-aware classification → upsert → bulk PATCH high-confidence → audit + sync_state. Hard rollback on PATCH failure (auto-applied rows revert to pending). Idempotent via prompt_hash.
- `lib/categorize/__tests__/{prompt,classify}.test.ts` — 20 vitest cases covering prompt determinism, few-shot dedupe + cap, hash sensitivity, allowlist enforcement, confidence threshold, split parent invariants, PATCH body shape (sub amount preservation, original sub IDs), `buildAllowlist` exclusions, `buildFewShots` split expansion.
- `app/api/categorize/run/route.ts` — POST, `runtime = "nodejs"`, `maxDuration = 60`. 401 unauth → calls `runCategorization` → returns `{ ok, summary }`. 400 on token-not-configured.
- `app/api/categorize/apply/route.ts` — POST `{ suggestion_id, action: "apply"|"dismiss"|"undo", override_category_id? }`. Verifies ownership via `createRouteClient` (RLS), applies via `createServiceClient` + bulk PATCH. Splits require full sub coverage.
- `app/(app-shell)/categorize/page.tsx` + `components/categorize/{CategorizeQueue,CategorizeRow}.tsx` — review queue page. Header card shows last-run timestamp + last-error + "Run categorization" button. Rows show payee, amount, suggested category, confidence color (green ≥75%, amber ≥50%, red <50%), reasoning, sub breakdown for splits. Apply / Dismiss buttons → POST `/api/categorize/apply` → `router.refresh()`.
- `components/shell/NavBar.tsx` — added `Categorize` nav link between Dashboard and Settings.

**Deps added:** `ai@6.0.168`, `zod@4.3.6`.

**Verification (this branch):** `pnpm exec tsc --noEmit` ✅ · `pnpm lint` ✅ · `pnpm test` ✅ (49 pass · 6 files) · `pnpm build` ✅ — `/categorize` 2.19 kB / `/api/categorize/run` ƒ / `/api/categorize/apply` ƒ. Runtime smoke: `/categorize` 307→`/login` unauth'd, `/login` 200, `POST /api/categorize/run` 401 unauth'd. No server compile errors.

**Manual smoke required before merge:**
1. Push migration: `cd portfolio/clarity-budget-web && supabase db push` (applies `0003_categorization_suggestions.sql`).
2. Set `AI_GATEWAY_API_KEY` in `.env.local` and Vercel preview env (Settings → Environment Variables).
3. Sign in → `/categorize` → click **Run categorization**.
4. Expect HTTP 200 + `{ summary: { fetched, autoApplied, queued, ... } }`. High-confidence rows now show categories + green checks in YNAB. Re-running yields `cached > 0`.
5. Inspect `clarity_budget_audit_log` for `categorize_run_succeeded` with token `usage`. Sanity-check cost (< $0.01 for ~100 txns on `openai/gpt-4o-mini`).
6. Hallucination guard: manually edit a suggestion's `category_id` to a non-existent UUID → re-run → row marks `invalid`, never PATCHes YNAB.

**Where this fits in the roadmap:** This is a parallel-track workstream off the v1 redesign main line (which still has Steps 4-10 ahead). Plan target: merge before Step 9 so the dashboard split can surface "Uncategorized to review" as a first-class card. See `~/.claude/plans/whats-the-next-step-fluffy-wadler.md` for the full design rationale.

### Added — Session 3 / Step 3 (2026-04-25) — Privacy.com integration
- `lib/privacy/types.ts` — `PrivacyCard`, `PrivacyTransaction`, `PrivacyMerchant`, `PrivacyCardRef`, `PrivacyPage<T>`; state/type/status string unions matching Privacy.com REST shapes.
- `lib/privacy/client.ts` — `createPrivacyClient(token)` factory exposing `listCards()` + `listTransactions({ begin? })`. Uses Privacy's `Authorization: api-key <token>` scheme (not Bearer). Internal `paginate<T>` loops `page` until `total_pages` (50/page). `server-only` guarded.
- `lib/privacy/sync.ts` — `pullCards(userId)` + `pullTransactions(userId, since?)` using `createServiceClient()`. Decrypts `privacy_token_*` from `clarity_budget_credentials` via `lib/crypto.ts`. **Preserves user-owned columns** on upsert: never writes `linked_payee_id` (cards) or `matched_ynab_txn_id` (transactions) — pre-fetches existing rows and re-applies their values. Stamps `clarity_budget_sync_state` (`source='privacy'`) with `last_run_at` + `last_success_at` on success, `last_error` on failure. Emits `clarity_budget_audit_log` rows (`actor='system'`, `action='privacy_sync_cards' | 'privacy_sync_transactions'` + `*_failed` variants). Idempotent — rerun advances only `updated_at` via the `clarity_budget_update_updated_at` trigger.

**Verification:** `pnpm exec tsc --noEmit` ✅ · `pnpm lint` ✅ · `pnpm build` ✅ (route output unchanged from Step 2 — pure lib code).

**Manual smoke pending:** requires `SUPABASE_SERVICE_ROLE_KEY` + a real Privacy.com token upserted via `/api/credentials`. Author throwaway `scripts/test-privacy-sync.ts` that calls `pullCards(userId)` then `pullTransactions(userId)`; probe both `clarity_budget_privacy_*` tables, `clarity_budget_sync_state` for the `source='privacy'` row, and `clarity_budget_audit_log` for `privacy_sync_*` rows; rerun to verify idempotency. Will also confirm whether Privacy's endpoints are `/card`+`/transaction` (singular, current code) or `/cards`+`/transactions` (plural) — flag if 404s appear.

**Out of scope (later steps):** Step 4 reconcile logic, Step 5 `vercel.json` cron, Steps 6–8 `/review` + `/flags` + `/settings` UI, Phase 2 Money Companion.

### Added — 2026-04-25 — GitHub OAuth on /login
- `app/login/page.tsx` — "Continue with GitHub" button above the email/password form (with "or" divider). Calls `supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: <origin>/auth/callback?next=/ } })`. Reuses the existing `app/auth/callback/route.ts` from the OTP era — PKCE OAuth uses the same `?code=` exchange.
- New `oauthBusy` state gates against double-submit; password submit also disables while OAuth is busy.

**Manual prereqs (not code, must be done in dashboards before the button works):**
- GitHub OAuth App created at github.com/settings/developers (callback URL = `https://unqtnnxlltiadzbqpyhh.supabase.co/auth/v1/callback`)
- GitHub provider enabled in Supabase Dashboard → Authentication → Providers (paste Client ID + Secret)
- Site URL + Redirect URLs allowlist fixed in Supabase Dashboard (still tracked in `HANDOFF.md` line 12)

### Added — Session 3 / Step 2 (2026-04-24) — auth refactor
- `lib/supabase-browser.ts` — singleton `getSupabaseBrowserClient()` via `@supabase/ssr` `createBrowserClient`
- `middleware.ts` — Supabase SSR cookie refresher; runs on every non-asset route so `getUser()` sees a fresh session
- `app/login/page.tsx` — magic-link sign-in (`signInWithOtp` with `emailRedirectTo`); idle → sending → "Check your email" states; reset-email button
- `app/auth/callback/route.ts` — `exchangeCodeForSession(code)` → redirect to `/` (or `/login?error=callback`)
- `app/(app-shell)/layout.tsx` — Server Component auth gate; `createRouteClient()` + `getUser()` + `redirect('/login')`; wraps children with `<NavBar />`
- `components/shell/NavBar.tsx` — Dashboard / Settings links with active state via `usePathname()`
- `components/shell/UserMenu.tsx` — email + sign-out (routes to `/login`, calls `router.refresh()`)
- `app/(app-shell)/settings/page.tsx` — minimal settings page with `<MigrationBanner />` + Step-8 placeholder
- `components/settings/MigrationBanner.tsx` — one-shot YNAB token migration from localStorage → `POST /api/credentials` → clears localStorage only on 2xx

### Changed — Session 3 / Step 2
- `app/page.tsx` → `app/(app-shell)/page.tsx` (content identical; now behind the auth gate)

### Infra — Session 3 / Step 2
- Applied `0001_init.sql` + `0002_rls.sql` to Supabase project `unqtnnxlltiadzbqpyhh`. All 7 `clarity_budget_*` tables live with RLS.
- Required `supabase migration repair --status reverted 0001 0002` first; the tracker had the migrations registered but the DDL had never executed.

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
