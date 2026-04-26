# Clarity Budget Web — CHANGELOG

## [Unreleased]

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
