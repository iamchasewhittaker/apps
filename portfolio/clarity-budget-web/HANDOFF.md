# Clarity Budget Web — HANDOFF

## State

| Field | Value |
|---|---|
| Focus | **Unblock `/categorize` smoke test, commit 7 uncommitted files, then Step 5 (cron + vercel.json)** |
| Status | typecheck ✅ · lint ✅ · 49/49 vitest ✅ · dev-server unauth probes ✅. Signed-in smoke **blocked** — see "Blocker" below. 7 files uncommitted. |
| Last touch | 2026-04-27 |
| URL | clarity-budget-web.vercel.app (Steps 1–2 deployed; AI categorize + credentials fix NOT deployed) |
| Branch | `feat/job-search-v8.16` (HANDOFF previously said `feature/ai-categorize` — that was wrong) |
| Step 4 (reconcile) | ✅ DONE — `lib/reconcile/{fingerprint,match,propose-rename,detect-weirdness}.ts` + 4 vitest files already on disk |
| Blocker | `/categorize` → "no YNAB budget selected": `clarity_budget_credentials.default_budget_id` is NULL and `user_data.data.ynabBudgetId` is also null. **Fix: go to `/settings` → YNAB card → re-enter PAT (token was cleared from localStorage by MigrationBanner) → pick budget → writes `default_budget_id` to Supabase directly.** See LEARNINGS.md 2026-04-27 for full diagnosis. |
| Manual TODO (0 — do first) | `/settings` → YNAB card → enter token → pick budget → confirm `clarity_budget_credentials.default_budget_id` written in Supabase Studio. This unblocks the smoke. |
| Manual TODO (smoke, after 0) | (a) `/categorize` → Run → expect success + `default_budget_id` populated. (b) `/` Dashboard → "Category roles" section, no token input. (c) Change budget in Settings → Supabase row updates. |
| Manual TODO (categorize deploy) | (a) `supabase db push` → applies `0003_categorization_suggestions.sql`. (b) Add `AI_GATEWAY_API_KEY=...` to `.env.local` + Vercel preview env. (c) Sign in → `/categorize` → Run → verify YNAB. (d) Re-run for idempotency. (e) Merge to main. |
| Manual TODO (auth) | Supabase Dashboard: Site URL = `https://clarity-budget-web.vercel.app`; add `/auth/callback` + `localhost:3000/auth/callback` to Redirect URLs; remove `apps.chasewhittaker.com`. GitHub OAuth: enable provider + paste Client ID/Secret (callback = `https://unqtnnxlltiadzbqpyhh.supabase.co/auth/v1/callback`). |

---

## What was built — Session N: Categorize fix + Settings connector (2026-04-26)

### Problem
`/categorize` threw `"default_budget_id not set on credentials row"`. The `clarity_budget_credentials` row had the encrypted YNAB token but `default_budget_id` was always NULL — no UI had ever written it. The selected budget lived only in `user_data.data.ynabBudgetId` (app_key="clarity_budget"), which server-side categorize endpoints never read.

### Fix — shared credentials loader with self-heal fallback

**New:** `lib/categorize/credentials.ts` — `loadYnabCredentials(supabase, userId)`:
1. Read `clarity_budget_credentials` row.
2. If token ciphertext missing → throw `"ynab token not configured"`.
3. If `default_budget_id` set → decrypt + return immediately.
4. Fall back: read `user_data` where `app_key = SUPABASE_APP_KEY`, pull `data.ynabBudgetId`.
5. If found → fire-and-forget backfill of `default_budget_id`, decrypt + return.
6. If still missing → throw `"no YNAB budget selected — open Settings and pick one"`.

**Modified:** `lib/categorize/run.ts` — removed local `loadYnabCreds()` (was lines 40–75); imported shared loader. Both call sites updated.

**Modified:** `app/api/categorize/apply/route.ts` — removed local `loadCredentials()` (was lines 28–59); imported shared loader. All three call sites updated.

### YNAB connector moved to Settings

**New:** `components/settings/YnabConnectorCard.tsx` — client component with:
- YNAB token input: read/write localStorage `YNAB_TOKEN_KEY`; on change, POST `/api/credentials { ynab_token }`.
- Budget picker: read/write `BudgetBlob.ynabBudgetId` via `loadLocalBlob` / `saveLocalBlob` / `pushBlob`; on change, POST `/api/credentials { default_budget_id }`.
- Budget list populated from `fetchBudgets(token)`.

**Modified:** `app/(app-shell)/settings/page.tsx` — renders `MigrationBanner` + `YnabConnectorCard` (was a stub with a placeholder).

**Modified:** `components/HomeDashboard.tsx`:
- Removed: token input `<section>`, `BudgetPicker` component definition, `persistToken` function.
- Removed: `fetchBudgets` import (only used by BudgetPicker).
- Moved `loadLocalBlob` / `saveLocalBlob` to `lib/blob.ts` as exports (shared by YnabConnectorCard).
- YNAB section renamed "Category roles"; wrapped in `{ynabReady && (...)}`.
- Empty state now links to `/settings` instead of "pick a budget below".

**Modified:** `lib/blob.ts` — added exported `loadLocalBlob()` and `saveLocalBlob()` with SSR guard.

### Verification results
| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ clean |
| `next lint` | ✅ clean |
| `vitest run` | ✅ 49/49 pass |
| `next build --turbopack` | ✅ all routes compile |
| API routes (no auth) | ✅ 401 (no runtime errors) |

### Still needs manual verification in signed-in browser
See "Manual TODO (verify this session)" in State table above.

---

## Fresh session prompt — verify this session's changes

```
Read CLAUDE.md and HANDOFF.md first.

Continuing work on: clarity-budget-web (portfolio/clarity-budget-web)
Branch: feature/ai-categorize

## What was just completed (2026-04-26)

### 1. Fixed `default_budget_id not set on credentials row` on /categorize

Root cause: `clarity_budget_credentials.default_budget_id` was never written by any UI. The
selected budget lived in `user_data.data.ynabBudgetId` (app_key="clarity_budget") but
server-side endpoints never read it.

Fix:
- Created `lib/categorize/credentials.ts` — shared `loadYnabCredentials(supabase, userId)`
  that falls back to `user_data.data.ynabBudgetId` when `default_budget_id` is null,
  self-heals by backfilling `clarity_budget_credentials.default_budget_id`, throws
  "no YNAB budget selected — open Settings and pick one" if neither has a value.
- Updated `lib/categorize/run.ts` and `app/api/categorize/apply/route.ts` to import the
  shared loader (removed their local duplicates).

### 2. Moved YNAB token + budget picker from Dashboard to Settings

- Created `components/settings/YnabConnectorCard.tsx` — token input + budget picker.
  On token change: localStorage + POST /api/credentials { ynab_token }.
  On budget change: localStorage blob + pushBlob + POST /api/credentials { default_budget_id }.
- Updated `app/(app-shell)/settings/page.tsx` to render MigrationBanner + YnabConnectorCard.
- Updated `components/HomeDashboard.tsx`: removed token input, BudgetPicker, persistToken;
  YNAB section renamed "Category roles"; empty state links to /settings.
- Moved `loadLocalBlob` / `saveLocalBlob` from HomeDashboard to `lib/blob.ts` as exports.

### Verified (pre-auth)
- `npx tsc --noEmit` clean
- `next lint` clean
- `vitest run` — 49/49 pass
- `next build --turbopack` — all routes compile
- API routes return 401 (no runtime errors)

### Needs verification in your signed-in browser
1. `/categorize` → Run categorization → should succeed. Check Supabase:
   `clarity_budget_credentials.default_budget_id` should now be populated (self-heal).
2. `/settings` → YNAB card shows current token + budget picker with correct selection.
3. `/` Dashboard → metrics still render; section reads "Category roles" with Settings link;
   token input + budget picker are gone.
4. Change budget in Settings → verify `clarity_budget_credentials.default_budget_id` updates.

## Key files
- `lib/categorize/credentials.ts` — new shared credentials loader (core fix)
- `lib/blob.ts` — now exports `loadLocalBlob` / `saveLocalBlob`
- `components/settings/YnabConnectorCard.tsx` — new YNAB connector UI
- `app/(app-shell)/settings/page.tsx` — settings page (no longer a stub)
- `components/HomeDashboard.tsx` — YNAB section stripped to category roles only

Let me know what to work on next.
```

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

## What was built — Session 3 / Redesign step 3 (2026-04-25)

### New files
- `lib/privacy/types.ts` — Privacy.com REST response shapes: `PrivacyCard`, `PrivacyTransaction` (with nested `card: PrivacyCardRef` + `merchant: PrivacyMerchant`), `PrivacyPage<T>`, plus `PrivacyCardState` / `PrivacyCardType` / `PrivacyTxStatus` string unions.
- `lib/privacy/client.ts` — `createPrivacyClient(token)` factory. Internal `paginate<T>` walks `page` 1..N (50/page) until `data.length === 0` or `page >= total_pages`. Auth header is `Authorization: api-key <token>` (Privacy's scheme — not Bearer like YNAB). 401 → `"Privacy token invalid or expired."`; other non-2xx → `"Privacy API error: ${status}"`. `server-only` guarded. Endpoints currently `/card` + `/transaction` (singular) — verify against live API during smoke test.
- `lib/privacy/sync.ts` — `pullCards(userId)` + `pullTransactions(userId, since?)`. Both use `createServiceClient()` (no user session) and decrypt the user's `privacy_token_*` from `clarity_budget_credentials` via `lib/crypto.ts`. Each function:
  - Pre-fetches existing rows so user-owned columns survive re-syncs (`linked_payee_id` on cards, `matched_ynab_txn_id` on transactions — never written from sync)
  - Upserts in chunks of 500 with `onConflict: "token"`
  - Stamps `clarity_budget_sync_state` (`source='privacy'`) with `last_run_at` + `last_success_at` on success, `last_error` on failure (truncated to 500 chars)
  - Inserts a `clarity_budget_audit_log` row (`actor='system'`, `entity_type='privacy_sync'`, action `privacy_sync_cards` / `privacy_sync_transactions` on success or `*_failed` on error)
  - Returns `{ fetched, upserted }`; rethrows after recording failure
  - Note: schema CHECK constraint forces `source` ∈ {`ynab`, `privacy`}. Decision: both card + transaction syncs share `source='privacy'`; the cron caller (Step 5) will orchestrate cards-then-transactions atomically. Cursor stays null in v1.

### Verification results
| Check | Result |
|---|---|
| `pnpm exec tsc --noEmit` | ✅ clean |
| `pnpm lint` | ✅ clean |
| `pnpm build` | ✅ clean — route table unchanged from Step 2 (no new routes; pure lib code) |

### Still needs manual verification
- With `SUPABASE_SERVICE_ROLE_KEY` set + a real Privacy.com token upserted via `/api/credentials`: write a one-off `scripts/test-privacy-sync.ts` that calls `pullCards(userId)` then `pullTransactions(userId)`. Probe `clarity_budget_privacy_cards` + `clarity_budget_privacy_transactions` for rows, `clarity_budget_sync_state` for a `source='privacy'` row with `last_success_at`, `clarity_budget_audit_log` for the two `privacy_sync_*` entries. Rerun to confirm idempotency (only `updated_at` advances).
- During that smoke, confirm whether Privacy's current API uses `/card` + `/transaction` (singular — what we wrote) or `/cards` + `/transactions` (plural). Both are in the wild; swap the two strings in `client.ts` if 404s appear.

---

## Remaining steps

| # | Step | Status | Key files |
|---|---|---|---|
| 4 | Reconcile logic + unit tests | ✅ DONE | `lib/reconcile/{fingerprint,match,propose-rename,detect-weirdness}.ts` + `__tests__/` |
| 5 | Cron endpoints + `vercel.json` | ⬜ next | `app/api/cron/sync/route.ts`, `app/api/cron/backfill/route.ts`, `vercel.json` |
| 6 | `/review` UI | ⬜ | `app/(app-shell)/review/page.tsx`, `components/review/{ProposalList,ProposalRow}.tsx` |
| 7 | `/flags` UI | ⬜ | `app/(app-shell)/flags/page.tsx`, `components/flags/{FlagList,FlagRow}.tsx` |
| 8 | `/settings` Privacy connector + card mapping | ⬜ | `components/settings/{PrivacyConnectorCard,CardMappingTable}.tsx` |
| 9 | Split `HomeDashboard.tsx` | ⬜ | Extract `components/dashboard/{StsCard,ShortfallBanner,LastUpdated,EmptyState}.tsx` |
| 10 | First-run + acceptance criteria | ⬜ | End-to-end on real data; all 11 criteria |

---

## Fresh session prompt — unblock smoke + commit + Step 5

```
Read portfolio/clarity-budget-web/CLAUDE.md and portfolio/clarity-budget-web/HANDOFF.md first.
Run checkpoint before touching anything.

Continuing: clarity-budget-web, branch feat/job-search-v8.16

## State coming in (2026-04-27)

7 files are uncommitted — credentials fix + YNAB connector moved to Settings.
`/categorize` smoke is blocked by a Supabase data gap. Fix it manually first, then commit.

### Step 0 — manual Supabase fix (you do this, not Claude)
1. Open http://localhost:3000 (or run `cd portfolio/clarity-budget-web && pnpm dev`)
2. Sign in → go to /settings
3. In the YNAB card: re-enter your personal access token (token was cleared from localStorage by
   MigrationBanner even though it's in Supabase — the card reads localStorage, not Supabase).
4. Pick your budget from the dropdown.
5. Confirm in Supabase Studio: clarity_budget_credentials.default_budget_id is now populated.
6. Then try /categorize → Run categorization — expect success.

If you need Claude's help debugging this step, describe what you see in /settings.

### Uncommitted files to commit after smoke passes
New:
- portfolio/clarity-budget-web/lib/categorize/credentials.ts
- portfolio/clarity-budget-web/components/settings/YnabConnectorCard.tsx

Modified:
- portfolio/clarity-budget-web/lib/categorize/run.ts
- portfolio/clarity-budget-web/app/api/categorize/apply/route.ts
- portfolio/clarity-budget-web/lib/blob.ts
- portfolio/clarity-budget-web/components/HomeDashboard.tsx
- portfolio/clarity-budget-web/app/(app-shell)/settings/page.tsx

### After committing, the next task is Step 5 — cron + vercel.json
Files to create:
- app/api/cron/sync/route.ts — POST, validates Authorization: Bearer $CRON_SECRET,
  calls pullCards + pullTransactions (Privacy sync) then runs reconcile (match + propose + detect).
  Returns { ok, cards, transactions, proposals, flags }.
- app/api/cron/backfill/route.ts — one-shot POST to seed historical data (same logic, no schedule).
- vercel.json — crons: [{ path: "/api/cron/sync", schedule: "*/15 * * * *" }]

Prerequisites before Step 5 runs on the server:
- SUPABASE_SERVICE_ROLE_KEY in .env.local (paste from Supabase dashboard → project settings → API)
- CRON_SECRET in .env.local (already there from Step 1; copy to Vercel env too)
- Privacy.com token upserted via POST /api/credentials { privacy_token: "..." }

Stop after Step 5 and show the diff before moving on.
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
