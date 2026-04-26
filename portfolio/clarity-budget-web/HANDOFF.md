# Clarity Budget Web — HANDOFF

## State

| Field | Value |
|---|---|
| Focus | v1 Redesign — auth refactor (steps 1–2 of 10 done; password + GitHub OAuth shipped) |
| Status | Step 2 complete; password auth shipped (`72799f9`); GitHub OAuth button added to `/login` (uncommitted) |
| Last touch | 2026-04-25 |
| URL | clarity-budget-web.vercel.app (Session 2 / v0.4 live — Steps 1–2 deployed) |
| Branch | main |
| Manual TODO (auth) | **Supabase Dashboard:** (a) Auth → URL Configuration → Site URL = `https://clarity-budget-web.vercel.app`; Redirect URLs allowlist must include `https://clarity-budget-web.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`; remove `apps.chasewhittaker.com`. (b) Auth → Providers → GitHub → enable + paste Client ID + Secret from a new GitHub OAuth App (`github.com/settings/developers`, callback URL = `https://unqtnnxlltiadzbqpyhh.supabase.co/auth/v1/callback`). Until both are done, clicking "Continue with GitHub" will return a provider-not-enabled error. |

---

## Redesign context

Full plan: `plans/clarity-budget-web-redesign.md` (10-step implementation order).
Handoff doc that started this: `plans/clarity-budget-web-redesign-HANDOFF.md`.

**What the redesign adds:**
- Privacy.com payee-rename review queue (`/review`)
- Weirdness flags inbox (`/flags`)
- 15-min Vercel cron (server-side, no browser tab needed)
- Encrypted Supabase token storage (YNAB + Privacy.com keys)
- Supabase auth becomes required (magic link)
- Frontend IA restructure (no visual refresh)

**Money Companion (Phase 2):** deferred until v1 redesign ships.

---

## What was built — Session 3: Redesign step 1 (2026-04-23)

### New packages
- `@supabase/ssr ^0.10.2` — server client factory with cookie support
- `server-only 0.0.1` — prevents accidental client bundle inclusion

### New files
- `lib/crypto.ts` — AES-256-GCM `encrypt` / `decrypt` / `maskToken`. Reads `TOKEN_ENCRYPTION_KEY` (32-byte base64). `KEY_VERSION = 1` for future rotation tracking. `server-only` guarded.
- `lib/supabase-server.ts` — two factories: `createRouteClient()` (cookie-bound via `@supabase/ssr` for route handlers) and `createServiceClient()` (service-role, no session, for cron). `server-only` guarded.
- `supabase/migrations/0001_init.sql` — 7 tables: `clarity_budget_credentials`, `clarity_budget_privacy_cards`, `clarity_budget_privacy_transactions`, `clarity_budget_proposals`, `clarity_budget_flags`, `clarity_budget_audit_log`, `clarity_budget_sync_state`. Distinct trigger function name `clarity_budget_update_updated_at()` avoids collision with Shipyard's trigger in the shared Supabase project.
- `supabase/migrations/0002_rls.sql` — RLS on all 7 tables; `owner_all` policies scoped to `auth.uid() = user_id`.
- `app/api/credentials/route.ts` — `POST` (encrypt-and-upsert only provided fields, write audit log) + `DELETE` (remove row, audit log). Returns 401 before body parse if no session.
- `.env.local.example` updated — `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `TOKEN_ENCRYPTION_KEY` added.
- `.env.local` created (gitignored) — freshly generated `TOKEN_ENCRYPTION_KEY` + `CRON_SECRET`. **`SUPABASE_SERVICE_ROLE_KEY` is blank** — paste from Supabase dashboard → project settings → API before step 5 (cron).

### Verification results
| Check | Result |
|---|---|
| `pnpm exec tsc --noEmit` | ✅ clean |
| `pnpm lint` | ✅ clean |
| `pnpm build` | ✅ `/api/credentials` shows as `ƒ` dynamic |
| Crypto round-trip (encrypt → decrypt) | ✅ matches; tamper correctly rejected |
| `curl POST /api/credentials` (unauthenticated) | ✅ 401 |
| `curl DELETE /api/credentials` (unauthenticated) | ✅ 401 |

### Migrations applied 2026-04-24
Both migrations now live on remote project `unqtnnxlltiadzbqpyhh` via `supabase db push`. All 7 `clarity_budget_*` tables confirmed present (HTTP 200 on `/rest/v1/<table>?select=*&limit=0`).

> Note: `supabase migration repair --status reverted 0001 0002` was required first — the tracker thought both were applied even though the DDL had never run. Re-push then succeeded.

---

## What was built — Session 3 / Redesign step 2 (2026-04-24)

### New packages
None — reused `@supabase/ssr` added in step 1.

### New files
- `lib/supabase-browser.ts` — singleton `getSupabaseBrowserClient()` via `@supabase/ssr`'s `createBrowserClient`. Cached in module scope so every `'use client'` call reuses the same client.
- `middleware.ts` (repo root) — Supabase SSR cookie refresher. Runs on every non-asset route and calls `supabase.auth.getUser()` so the auth cookie stays fresh across server renders.
- `app/login/page.tsx` — client component; email input → `signInWithOtp` with `emailRedirectTo: <origin>/auth/callback`. Swaps to "Check your email" confirmation after POST. "Use a different email" button resets to idle.
- `app/auth/callback/route.ts` — reads `?code=`, calls `exchangeCodeForSession`, redirects to `/` on success or `/login?error=callback` on failure.
- `app/(app-shell)/layout.tsx` — Server Component. `createRouteClient()` → `getUser()` → `redirect('/login')` if no user; otherwise renders `<NavBar email={user.email}/>` wrapping `{children}`.
- `components/shell/NavBar.tsx` — client; Dashboard / Settings links with active state via `usePathname()`.
- `components/shell/UserMenu.tsx` — client; email + Sign out button (signs out, routes to `/login`, calls `router.refresh()` so the server layout re-runs its auth check).
- `app/(app-shell)/settings/page.tsx` — server page; renders `<MigrationBanner />` + Step-8 placeholder.
- `components/settings/MigrationBanner.tsx` — client; reads `localStorage[YNAB_TOKEN_KEY]` in a `useEffect`, shows yellow banner if present, `fetch('/api/credentials', POST)`, clears localStorage **only** on 2xx. Inline error on failure (localStorage untouched).

### Moves
- `app/page.tsx` → `app/(app-shell)/page.tsx` (unchanged contents).

### Verification results
| Check | Result |
|---|---|
| `supabase db push` (after repair) | ✅ both migrations applied |
| All 7 `clarity_budget_*` tables exist (REST probe) | ✅ HTTP 200 each |
| `pnpm exec tsc --noEmit` | ✅ clean |
| `pnpm lint` | ✅ clean |
| `pnpm build` | ✅ `/` `ƒ`, `/login` `○`, `/settings` `ƒ`, middleware compiled (89.7 kB) |
| `GET /` unauthed | ✅ 307 → `/login` |
| `GET /settings` unauthed | ✅ 307 → `/login` |
| `GET /login` | ✅ 200 |
| `POST /api/credentials` unauthed | ✅ 401 |
| `GET /auth/callback` no code | ✅ 307 → `/login?error=callback` |
| Login form submit (real Supabase) | ✅ POST to `/auth/v1/otp` → 200; UI switched to "Check your email" |

### Superseded 2026-04-25 — login switched to password

The OTP/magic-link flow was replaced with `signInWithPassword` (commit `72799f9`). Reason: magic-link emails were redirecting to the dead `apps.chasewhittaker.com` domain (deferred shared-login canonical host) — see `LEARNINGS.md` 2026-04-25 for the full postmortem. `app/auth/callback/route.ts` is left in place as harmless dead code; it'll only fire if OTP is reintroduced.

### Still needs manual verification
- With a pre-seeded YNAB token in localStorage, visit `/settings` → banner appears → Migrate → localStorage key gone, row in `clarity_budget_credentials`, audit log row with `action = 'credentials_upsert'`

---

## Remaining steps (3–10 from the plan)

| # | Step | Key files |
|---|---|---|
| 3 | Privacy integration | `lib/privacy/client.ts`, `lib/privacy/sync.ts`, `lib/privacy/types.ts` |
| 4 | Reconcile logic + first unit tests | `lib/reconcile/match.ts`, `propose-rename.ts`, `detect-weirdness.ts`, `fingerprint.ts`, `__tests__/` |
| 5 | Cron endpoints + `vercel.json` | `app/api/cron/sync/route.ts`, `app/api/cron/backfill/route.ts`, `vercel.json` |
| 6 | `/review` UI | `app/review/page.tsx`, `components/review/ProposalList.tsx`, `ProposalRow.tsx` |
| 7 | `/flags` UI | `app/flags/page.tsx`, `components/flags/FlagList.tsx`, `FlagRow.tsx` |
| 8 | `/settings` UI | `app/settings/page.tsx`, `components/settings/ConnectorCard.tsx`, `CardMappingTable.tsx` |
| 9 | Split `HomeDashboard.tsx` | Extract into `components/dashboard/{StsCard,ShortfallBanner,LastUpdated,EmptyState}.tsx`; move `SpendingBreakdown`, `TransactionList`, `TransactionFilters` under `components/dashboard/` |
| 10 | Migration banner + first run | End-to-end on real data; all 11 acceptance criteria from `plans/clarity-budget-web-redesign.md` |

---

## Step 3 — what to build next

**Privacy.com integration.** Pulls the user's Privacy virtual cards + transactions so `lib/reconcile` (step 4) has something to match against YNAB transactions.

Key files:
- `lib/privacy/types.ts` — shape of Privacy card + transaction API responses
- `lib/privacy/client.ts` — fetch wrapper, takes a decrypted `privacy_token`, returns typed responses
- `lib/privacy/sync.ts` — pull cards into `clarity_budget_privacy_cards`, pull transactions into `clarity_budget_privacy_transactions`; uses `createServiceClient()` (requires `SUPABASE_SERVICE_ROLE_KEY` to be set first)

**Open items before step 5 (cron):**
- `SUPABASE_SERVICE_ROLE_KEY` is blank in `.env.local` — paste from Supabase dashboard → project settings → API
- Vercel env vars still say `REACT_APP_SUPABASE_*`; before deploying Step 2, add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel (Production + Preview)

---

## Fresh session prompt — Step 3 (Privacy integration)

```
Read portfolio/clarity-budget-web/HANDOFF.md then plans/clarity-budget-web-redesign.md.
Run checkpoint before touching anything.

Implement step 3 of the redesign: Privacy.com integration.

Files to create:
- lib/privacy/types.ts — API response shapes (Card, Transaction)
- lib/privacy/client.ts — fetch wrapper; takes a decrypted privacy_token string; paginates
- lib/privacy/sync.ts — pullCards(userId) + pullTransactions(userId, since); uses
  createServiceClient() + clarity_budget_credentials row to decrypt the token

Do NOT wire this into a cron or UI yet — that's steps 5 and 6.

Stop after step 3 and show the diff before moving on.
```

---

## Sessions 1–2 history (pre-redesign)

<details>
<summary>Session 2 (2026-04-20) — URL-persisted filters + transaction list</summary>

- `lib/aggregations.ts` — `flattenSpendLines`, `groupByCategory/Payee/Account/Week`, `totalSpent`, `outflowCount`, `dateRangeLabel`, `roleColor`
- `lib/filterState.ts` — `FilterState` + `applyFilters` + `useUrlFilterState()` hook
- `components/TransactionFilters.tsx` — collapsible; date range, payee, amount, multi-select categories/accounts
- `components/SpendingBreakdown.tsx` — tabs: By category / By payee / By week
- `components/TransactionList.tsx` — sortable, role chips, 50-row page
- `app/page.tsx` — Suspense wrapper for Next 15 `useSearchParams`
- `HomeDashboard.tsx` — builds `spendLines` once, feeds `filteredLines` to components
</details>

<details>
<summary>Session 1 (2026-04-20) — YNAB transactions + spending breakdown</summary>

- `lib/ynab.ts` — `YNABTransaction`, `YNABSubTransaction` types + `fetchTransactions` (60-day, split-tx aware)
- `lib/constants.ts` — added `YNAB_TX_KEY`
- `components/HomeDashboard.tsx` — transaction state, 15-min cache, "Where your money went"
</details>
