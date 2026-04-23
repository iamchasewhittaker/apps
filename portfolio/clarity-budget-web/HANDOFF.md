# Clarity Budget Web — HANDOFF

## State

| Field | Value |
|---|---|
| Focus | v1 Redesign — backend foundation (step 1 of 10 done) |
| Status | Step 1 complete; Step 2 (auth refactor) is next |
| Last touch | 2026-04-23 |
| URL | clarity-budget-web.vercel.app |
| Branch | main |

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

### Migrations NOT yet applied
Run in Supabase SQL editor for project `unqtnnxlltiadzbqpyhh`:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_rls.sql`

---

## Remaining steps (2–10 from the plan)

| # | Step | Key files |
|---|---|---|
| **2** | **Auth refactor** | `app/login/page.tsx`, `app/(app-shell)/layout.tsx` auth gate, YNAB token migration banner in `/settings` |
| 3 | Privacy integration | `lib/privacy/client.ts`, `lib/privacy/sync.ts`, `lib/privacy/types.ts` |
| 4 | Reconcile logic + first unit tests | `lib/reconcile/match.ts`, `propose-rename.ts`, `detect-weirdness.ts`, `fingerprint.ts`, `__tests__/` |
| 5 | Cron endpoints + `vercel.json` | `app/api/cron/sync/route.ts`, `app/api/cron/backfill/route.ts`, `vercel.json` |
| 6 | `/review` UI | `app/review/page.tsx`, `components/review/ProposalList.tsx`, `ProposalRow.tsx` |
| 7 | `/flags` UI | `app/flags/page.tsx`, `components/flags/FlagList.tsx`, `FlagRow.tsx` |
| 8 | `/settings` UI | `app/settings/page.tsx`, `components/settings/ConnectorCard.tsx`, `CardMappingTable.tsx` |
| 9 | Split `HomeDashboard.tsx` | Extract into `components/dashboard/{StsCard,ShortfallBanner,LastUpdated,EmptyState}.tsx`; move `SpendingBreakdown`, `TransactionList`, `TransactionFilters` under `components/dashboard/` |
| 10 | Migration banner + first run | End-to-end on real data; all 11 acceptance criteria from `plans/clarity-budget-web-redesign.md` |

---

## Step 2 — what to build next

**Auth refactor.** Three pieces:

1. **`app/login/page.tsx`** — magic-link sign-in. Use `supabase.auth.signInWithOtp({ email })`. Show a confirmation screen after submit. Keep it in the existing dark theme using `T` tokens from `lib/constants.ts`.

2. **`app/(app-shell)/layout.tsx`** — Server Component that calls `createRouteClient()` + `supabase.auth.getUser()`. If no user, redirect to `/login`. If user, render the top nav (`components/shell/NavBar.tsx` + `UserMenu.tsx`) wrapping `{children}`. Move `app/page.tsx` (dashboard) into `app/(app-shell)/` so it's gated.

3. **YNAB token migration banner** (lives in `/settings` but scaffolded in step 2 so the gate can be tested). On first load after login, if `localStorage["chase_budget_web_ynab_token"]` exists, show a yellow banner: "Move your YNAB token to encrypted Supabase storage." One-click button: reads the key, POSTs to `/api/credentials`, clears localStorage **only after** the POST succeeds. Banner unmounts after clear.

**Nav components** needed in step 2:
- `components/shell/NavBar.tsx` — links: Dashboard / Review / Flags / Settings; active state via `usePathname()`.
- `components/shell/UserMenu.tsx` — shows email + sign-out button (calls `supabase.auth.signOut()`, redirects to `/login`).

**What doesn't change in step 2:**
- `lib/crypto.ts`, `lib/supabase-server.ts`, migrations — untouched.
- Dashboard data fetching — still reads YNAB token from localStorage (migration banner is one-shot, not a full migration).
- `components/HomeDashboard.tsx` — untouched until step 9.

---

## Fresh session prompt — Step 2 (auth refactor)

```
Read plans/clarity-budget-web-redesign-HANDOFF.md, then portfolio/clarity-budget-web/HANDOFF.md,
then plans/clarity-budget-web-redesign.md. Run checkpoint before touching anything.

Implement step 2 of the redesign: auth refactor.

Files to create:
- app/login/page.tsx — magic-link sign-in (OTP, email input, confirm screen). Use T tokens from
  lib/constants.ts for styling. No new component libraries.
- app/(app-shell)/layout.tsx — Server Component auth gate. createRouteClient() from
  lib/supabase-server.ts, getUser(), redirect to /login if missing. Renders NavBar + UserMenu
  from components/shell/ wrapping {children}.
- components/shell/NavBar.tsx — top nav: Dashboard / Review / Flags / Settings links.
  Active state via usePathname(). T tokens for colors. 'use client'.
- components/shell/UserMenu.tsx — email display + sign-out. 'use client'.

Move app/page.tsx into app/(app-shell)/page.tsx so it falls under the auth gate.
(The current app/page.tsx is a thin Suspense wrapper — move it as-is.)

Add the YNAB token migration banner (inline in app/(app-shell)/settings/page.tsx or as a
MigrationBanner component). Reads localStorage["chase_budget_web_ynab_token"], POSTs to
/api/credentials, clears localStorage ONLY after confirmed success.

Verify: hit / unauthenticated → redirect to /login. Sign in with magic link → land on dashboard.
Dashboard still loads STS + spending breakdown from YNAB. Migration banner appears once if
the old localStorage key is present.

Stop after step 2 and show the diff before moving on.
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
