# Clarity Budget Web — Redesign v1

**Created:** 2026-04-23
**Status:** Approved, ready to implement
**Target app:** `portfolio/clarity-budget-web/`
**Linear project:** https://linear.app/whittaker/project/clarity-budget-web-b40f3edb4be0

---

## Goal

Turn Clarity Budget Web from a single-page YNAB dashboard into a watchdog that works without the user sitting on the tab. Three new capabilities on top of what already works:

1. **Privacy.com payee renames** surfaced as a review queue (one card per merchant is already locked, so rename is high-signal).
2. **Weirdness flags inbox** for duplicate transactions and orphan Privacy charges.
3. **Server-side 15-minute Vercel cron** so flags and proposals land without the user opening the app.

Also: restructure the frontend IA (not a visual refresh) to make room for those new surfaces, and redesign the backend (API routes, encrypted server-side tokens, new Supabase tables) because client-side-only doesn't support cron.

---

## Decisions locked in

- **Target app:** `portfolio/clarity-budget-web/`. Not a new app. Section 5.3 of `portfolio/STRATEGY.md` already lists this exact scope for Clarity Budget Web's monetization plan.
- **Spend Clarity Python CLI:** untouched. Keeps writing informational memos on its own cadence. The two tools will converge naturally as Clarity Budget Web absorbs the CLI's reconcile logic.
- **Frontend scope:** IA restructure only. Same palette (`T` tokens in `lib/constants.ts`), same Geist fonts, same dark theme. Full brand pass tracked in the ROADMAP backlog for a future session.
- **Token storage:** encrypted in Supabase, new `clarity_budget_credentials` table. `TOKEN_ENCRYPTION_KEY` env var in Vercel.
- **Money Companion (Claude chat layer, Phase 2):** deferred. Pick up after this ships. The new server-side Supabase data will make Companion easier.
- **Cron cadence:** `*/15 * * * *`.
- **Backfill window:** last 90 days on first sync.
- **Write mode:** queue for review. YNAB writes only fire on explicit approval.
- **Users:** Chase only for v1. Supabase auth becomes required (was optional).
- **Kill criteria:** if the review queue or flags inbox goes untouched for 7 consecutive days after v1 ships, stop. Don't build v2.

---

## Frontend IA restructure

Current: one route (`app/page.tsx → <HomeDashboard />`) with a 750-line god component.

Target route tree under `app/`:

```
app/
  layout.tsx                       # unchanged (Geist fonts, globals.css)
  page.tsx                         # dashboard — STS + spending breakdown (moved from HomeDashboard)
  review/page.tsx                  # payee-rename proposals
  flags/page.tsx                   # weirdness inbox
  settings/page.tsx                # connectors (YNAB, Privacy), card mapping
  (app-shell)/
    layout.tsx                     # nav bar + user menu + sign-out; wraps all four pages
  login/page.tsx                   # magic-link sign-in (required now, was optional)
  api/
    cron/sync/route.ts             # Vercel cron target
    cron/backfill/route.ts         # manual POST, 90-day
    proposals/[id]/approve/route.ts
    proposals/[id]/dismiss/route.ts
    flags/[id]/ack/route.ts
    credentials/route.ts           # POST to encrypt+store token, DELETE to revoke
```

Component restructure under `components/`:

```
components/
  dashboard/
    StsCard.tsx                    # "This month / week / today" card
    ShortfallBanner.tsx            # yellow warning when shortfall > 0
    LastUpdated.tsx                # "Updated <ts>" line
    EmptyState.tsx                 # "Connect YNAB" empty case
  review/
    ProposalList.tsx
    ProposalRow.tsx                # "Privacy.com → Uber Eats" with Approve/Dismiss
  flags/
    FlagList.tsx
    FlagRow.tsx                    # duplicate pair, orphan, etc.
  settings/
    ConnectorCard.tsx              # reused for YNAB and Privacy
    CardMappingTable.tsx           # edit Privacy card → YNAB payee
  shell/
    NavBar.tsx                     # top nav: Dashboard / Review / Flags / Settings
    UserMenu.tsx
  TransactionFilters.tsx           # unchanged, moved under components/dashboard/
  SpendingBreakdown.tsx            # unchanged, moved under components/dashboard/
  TransactionList.tsx              # unchanged, moved under components/dashboard/
```

**What stays identical:**
- Palette tokens (`T` in `lib/constants.ts`).
- Geist Sans + Geist Mono.
- `lib/metrics.ts`, `lib/aggregations.ts`, `lib/filterState.ts`, `lib/suggestRole.ts`, `lib/ynabCategoryMerge.ts`, `lib/blob.ts`.
- `lib/ynab.ts` read functions (`fetchBudgets`, `fetchCategories`, `fetchMonth`, `fetchTransactions`). They gain a server-side caller but the functions themselves don't change.
- `SpendingBreakdown`, `TransactionList`, `TransactionFilters` components.
- URL-persisted filter state.

**Deferred to the full brand pass (future):**
- New palette / logo / typography.
- `docs/BRANDING.md`.
- Empty-state illustrations.
- Mobile refinement.

Add a one-line note under ROADMAP's backlog: "Full brand pass — palette, logo, BRANDING.md" so it doesn't get forgotten.

---

## Backend redesign

### API routes (all under `app/api/`)

- **`cron/sync/route.ts`** — GET. Vercel cron hits this every 15 min. Rejects without `Authorization: Bearer $CRON_SECRET`. For each user with credentials, in order: YNAB delta sync → Privacy delta sync → match → propose renames → detect weirdness. All upserts are idempotent.
- **`cron/backfill/route.ts`** — POST. Same logic but forces a 90-day window. Requires user session (protects from abuse).
- **`proposals/[id]/approve/route.ts`** — POST. Reads proposal, decrypts YNAB token, calls `PUT /budgets/{id}/transactions/{txn_id}` with `{ transaction: { payee_id, payee_name } }`, marks proposal `approved`, writes `clarity_budget_audit_log` row.
- **`proposals/[id]/dismiss/route.ts`** — POST. Marks proposal `dismissed`, audit log.
- **`flags/[id]/ack/route.ts`** — POST. Marks flag `acknowledged`, audit log.
- **`credentials/route.ts`** — POST to encrypt and store `{ ynab_token, privacy_token, default_budget_id }`. DELETE to revoke.

All routes except `cron/sync` require a Supabase session. `cron/sync` runs with the service-role key.

### Auth becomes required

- `login/page.tsx` handles magic-link sign-in.
- `(app-shell)/layout.tsx` calls `supabase.auth.getUser()` server-side; redirect to `/login` if missing.
- YNAB token field moves from in-dashboard input to `/settings`.
- Existing users who had tokens in localStorage: one-time migration banner on `/settings` reads `localStorage[chase_budget_web_ynab_token]`, offers to upload to Supabase (encrypted), clears localStorage on success.

### Encrypted token storage

- New lib module `lib/crypto.ts`: `encrypt(plaintext, key) → { iv, ciphertext, tag }` and `decrypt(...)`. Node `crypto` module, AES-256-GCM, 96-bit IV, auth tag appended.
- `TOKEN_ENCRYPTION_KEY` env var: 32-byte base64 string, only read server-side.
- Tokens never cross the wire after storage. UI shows last-4 chars only (`•••••abcd`).
- Leave a `key_version` column for future rotation (migration itself is out of v1 scope).

### Supabase schema additions

All new tables prefixed `clarity_budget_` (matches the existing `app_key = "clarity_budget"` naming and signals the app that owns them). All RLS'd on `user_id = auth.uid()`. Write migrations under a new `supabase/migrations/` folder (doesn't exist yet — `0001_init.sql` creates them, `0002_rls.sql` adds policies).

- `clarity_budget_credentials` — `user_id pk`, `ynab_token_ciphertext`, `ynab_token_iv`, `ynab_token_tag`, `privacy_token_ciphertext`, `privacy_token_iv`, `privacy_token_tag`, `default_budget_id`, `key_version`, `updated_at`.
- `clarity_budget_privacy_cards` — `token pk`, `user_id`, `memo`, `state`, `type`, `linked_payee_id`, `updated_at`. `linked_payee_id` is nullable; seeded by fuzzy-matching card memo against YNAB payees, user can override.
- `clarity_budget_privacy_transactions` — `token pk`, `user_id`, `card_token`, `merchant_descriptor`, `merchant_city`, `amount_cents`, `status`, `created`, `settled`, `matched_ynab_txn_id` nullable, `updated_at`. Index `(user_id, created desc)`.
- `clarity_budget_proposals` — `id uuid pk`, `user_id`, `type text` (v1: `"payee_rename"`), `status text` (`pending|approved|dismissed`), `ynab_txn_id`, `privacy_txn_token`, `current_payee_name`, `proposed_payee_name`, `proposed_payee_id`, `confidence numeric`, `reason text`, `created_at`, `resolved_at`, `resolved_by_action`. Unique on `(user_id, ynab_txn_id, type)` to prevent duplicate proposals. Index `(user_id, status, created_at desc)`.
- `clarity_budget_flags` — `id uuid pk`, `user_id`, `type text` (`duplicate_txn | orphan_privacy_charge | orphan_ynab_privacy_payee`), `status text` (`open|acknowledged`), `severity text`, `related_ids jsonb`, `details jsonb`, `created_at`, `acknowledged_at`. Unique on `(user_id, type, fingerprint)` where `fingerprint` is a deterministic hash of related IDs, so re-runs don't create duplicate flags.
- `clarity_budget_audit_log` — `id uuid pk`, `user_id`, `actor text` (`user | cron | system`), `action text`, `entity_type`, `entity_id`, `payload jsonb`, `created_at`.
- `clarity_budget_sync_state` — `(user_id, source) pk` where source is `ynab|privacy`, `cursor text`, `last_run_at`, `last_success_at`, `last_error text`.
- **Cached YNAB data:** NOT moved to Supabase. Keep `lib/ynab.ts` client reads + 15-min localStorage cache for the dashboard. Cron runs its own YNAB fetch server-side and writes directly to `clarity_budget_proposals` and `clarity_budget_flags`. Avoids duplicating the whole YNAB dataset across storage tiers.

### lib additions

```
lib/
  crypto.ts                        # AES-GCM encrypt/decrypt
  supabase-server.ts               # createServerClient() using service role for cron
  privacy/
    client.ts                      # fetch wrapper, `Authorization: api-key <key>`
    sync.ts                        # incremental pull by created timestamp
    types.ts
  ynab/
    write.ts                       # PUT transaction (payee rename) — server-side
    server.ts                      # server-side read wrapper that reuses lib/ynab.ts functions
  reconcile/
    match.ts                       # Privacy txn ↔ YNAB txn (amount equal, date ±3d)
    propose-rename.ts              # build payee_rename proposals
    detect-weirdness.ts            # duplicates + orphans
    fingerprint.ts                 # deterministic hash for flag dedup
```

`lib/reconcile/*` written as pure functions taking plain data in, plain data out. Easy to test — first unit tests in this app.

### Reconcile logic

- **Match** (`lib/reconcile/match.ts`): Privacy transaction → YNAB transaction when Privacy `amount_cents * 10 === -1 * YNAB amount` (YNAB stores outflow as negative milliunits) AND `|Privacy created - YNAB date| <= 3 days`. Ties broken by preferring same-day match, then by YNAB payee containing "Privacy".
- **Propose rename** (`propose-rename.ts`): for each matched pair where YNAB payee name contains "Privacy" or is the Privacy descriptor placeholder, emit a `payee_rename` proposal suggesting `privacy_cards.linked_payee_id`. Skip if a proposal already exists (unique constraint).
- **Weirdness** (`detect-weirdness.ts`):
  - `duplicate_txn`: two YNAB transactions same account, same amount, dates within 1 day, both cleared.
  - `orphan_privacy_charge`: Privacy `settled` > 48h ago with no `matched_ynab_txn_id`.
  - `orphan_ynab_privacy_payee`: YNAB transaction with "Privacy" in payee and no matching Privacy charge found within ±3 days.

### Env vars

Add to `.env.example` and Vercel (production + preview):

```
NEXT_PUBLIC_SUPABASE_URL=         # existing
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # existing
SUPABASE_SERVICE_ROLE_KEY=        # NEW — server-only, for cron
CRON_SECRET=                      # NEW — random 32-byte, protects /api/cron/sync
TOKEN_ENCRYPTION_KEY=             # NEW — 32-byte base64, for lib/crypto.ts
```

Generate the two new secrets: `openssl rand -base64 32` each.

### Vercel cron

`vercel.json` (new file):

```json
{
  "crons": [
    { "path": "/api/cron/sync", "schedule": "*/15 * * * *" }
  ]
}
```

---

## File paths to touch

### New files
- `plans/clarity-budget-web-redesign.md` (this doc)
- `portfolio/clarity-budget-web/vercel.json`
- `portfolio/clarity-budget-web/supabase/migrations/0001_init.sql`
- `portfolio/clarity-budget-web/supabase/migrations/0002_rls.sql`
- `portfolio/clarity-budget-web/app/(app-shell)/layout.tsx`
- `portfolio/clarity-budget-web/app/login/page.tsx`
- `portfolio/clarity-budget-web/app/review/page.tsx`
- `portfolio/clarity-budget-web/app/flags/page.tsx`
- `portfolio/clarity-budget-web/app/settings/page.tsx`
- `portfolio/clarity-budget-web/app/api/cron/sync/route.ts`
- `portfolio/clarity-budget-web/app/api/cron/backfill/route.ts`
- `portfolio/clarity-budget-web/app/api/credentials/route.ts`
- `portfolio/clarity-budget-web/app/api/proposals/[id]/approve/route.ts`
- `portfolio/clarity-budget-web/app/api/proposals/[id]/dismiss/route.ts`
- `portfolio/clarity-budget-web/app/api/flags/[id]/ack/route.ts`
- `portfolio/clarity-budget-web/components/dashboard/{StsCard,ShortfallBanner,LastUpdated,EmptyState}.tsx`
- `portfolio/clarity-budget-web/components/review/{ProposalList,ProposalRow}.tsx`
- `portfolio/clarity-budget-web/components/flags/{FlagList,FlagRow}.tsx`
- `portfolio/clarity-budget-web/components/settings/{ConnectorCard,CardMappingTable}.tsx`
- `portfolio/clarity-budget-web/components/shell/{NavBar,UserMenu}.tsx`
- `portfolio/clarity-budget-web/lib/crypto.ts`
- `portfolio/clarity-budget-web/lib/supabase-server.ts`
- `portfolio/clarity-budget-web/lib/privacy/{client,sync,types}.ts`
- `portfolio/clarity-budget-web/lib/ynab/{write,server}.ts`
- `portfolio/clarity-budget-web/lib/reconcile/{match,propose-rename,detect-weirdness,fingerprint}.ts`
- `portfolio/clarity-budget-web/lib/reconcile/__tests__/*.test.ts` (first tests in this app)

### Modified
- `portfolio/clarity-budget-web/app/page.tsx` — swap `<HomeDashboard />` for the extracted dashboard tree.
- `portfolio/clarity-budget-web/components/HomeDashboard.tsx` — delete after extraction, or shrink to ~150-line shell.
- `portfolio/clarity-budget-web/components/{SpendingBreakdown,TransactionList,TransactionFilters}.tsx` — move under `components/dashboard/`.
- `portfolio/clarity-budget-web/.env.example` — add three new keys.
- `portfolio/clarity-budget-web/package.json` — likely add `@supabase/ssr` if not already present.
- `portfolio/clarity-budget-web/CLAUDE.md`, `HANDOFF.md`, `LEARNINGS.md`, `ROADMAP.md`, `CHANGELOG.md` — per auto-update rule.
- Root `CLAUDE.md` — bump Clarity Budget Web row to v0.5 with new summary.
- Root `ROADMAP.md` — add Change Log row.
- `portfolio/shipyard` metadata via `npm run sync:projects`.

### Critical files to read before coding
- `portfolio/clarity-budget-web/components/HomeDashboard.tsx` — the god component to split
- `portfolio/clarity-budget-web/lib/ynab.ts` — functions to reuse server-side
- `portfolio/clarity-budget-web/lib/metrics.ts` — STS math stays
- `portfolio/clarity-budget-web/lib/blob.ts` — BudgetBlob type, do not change shape
- `portfolio/clarity-budget-web/lib/sync.ts` — existing Supabase pattern
- `portfolio/clarity-budget-web/lib/constants.ts` — T tokens, reuse
- `portfolio/clarity-budget-web/HANDOFF.md` + `ROADMAP.md` — current focus
- `portfolio/spend-clarity/src/privacy_client.py` — reference for Privacy API shapes
- `portfolio/spend-clarity/src/ynab_client.py` — reference for YNAB PATCH shapes
- `portfolio/shipyard/supabase/migrations/0001_init.sql` — migration format reference

---

## Migration path for existing user (Chase)

1. Before deploy: back up `chase_budget_web_v1` localStorage to Supabase (current code already syncs `BudgetBlob` via `lib/sync.ts`, so only YNAB token needs moving).
2. After deploy, sign in on `/login` with magic link.
3. Visit `/settings`. A banner reads "Move your YNAB token to encrypted Supabase storage" with a one-click button. It reads `localStorage[chase_budget_web_ynab_token]`, POSTs to `/api/credentials`, clears localStorage on success.
4. Paste Privacy API key in the Privacy connector card.
5. Trigger `/api/cron/backfill` (button on settings) to populate 90 days.
6. Existing dashboard keeps working. New `/review` and `/flags` start populating after the first cron run.

---

## Acceptance criteria (run end-to-end before declaring v1 shipped)

1. **Auth gate:** hit `/`, `/review`, `/flags`, `/settings` unauthenticated. All redirect to `/login`.
2. **Token migration:** confirm existing YNAB token moves from localStorage to Supabase; localStorage key is cleared; dashboard still loads categories + month.
3. **Privacy connector:** paste key, refresh cards table. Card nicknames visible in `/settings` card-mapping table.
4. **Backfill:** POST `/api/cron/backfill`. Verify `clarity_budget_privacy_transactions` row count matches Privacy's last-90-days count.
5. **Match:** known Privacy charge has `matched_ynab_txn_id` set to the correct YNAB transaction.
6. **Proposal flow:** `/review` shows `"Privacy.com" → "Uber Eats"`. Approve. Verify YNAB web UI shows the rename on that specific transaction. Row moves to `approved` in Supabase.
7. **Flag flow:** intentionally duplicate a YNAB transaction. Re-run cron. `/flags` shows the duplicate pair. Acknowledge. Row moves to `acknowledged`.
8. **Cron heartbeat:** wait 15 min. `clarity_budget_sync_state.last_success_at` updates. `clarity_budget_audit_log` has a new `cron` row.
9. **Idempotency:** trigger cron twice in a row via curl. No duplicate proposals or flags.
10. **Dashboard unaffected:** `/` still shows STS cards + spending breakdown, filters still URL-persisted, transaction list still sortable.
11. **Spend Clarity CLI unaffected:** run it manually. Memos still write correctly. Approving a payee rename in Clarity Budget Web and then running Spend Clarity on the same transaction does not fight.

---

## Gotchas discussed

- **YNAB amount sign.** YNAB stores outflow as a negative milliunit integer. Privacy stores amount as positive cents. Match logic must flip sign AND scale by 10.
- **Privacy "pending" vs "settled" states.** Only flag orphans on `settled` and wait 48h — pending charges sometimes disappear.
- **Merchant descriptor drift.** A card can show different descriptors over time as Privacy's enrichment improves. Don't over-match on descriptor text; match on `card_token` + amount + date window.
- **Unique constraint on proposals.** `(user_id, ynab_txn_id, type)` — without this, every cron run creates a new proposal for the same transaction.
- **Flag fingerprint.** `clarity_budget_flags` needs a deterministic hash (e.g., sorted related IDs joined + sha256) so re-runs hit the unique constraint instead of piling up flags.
- **Supabase service role key.** Never cross the wire to the client. Only used inside `cron/*` routes.
- **CRON_SECRET.** Vercel cron hits the URL publicly — verify the bearer header server-side or anyone can trigger.
- **TOKEN_ENCRYPTION_KEY rotation.** Column `key_version` is added now even though rotation isn't implemented; leaves a door open without scope creep.
- **Migration folder does not exist yet.** `portfolio/clarity-budget-web/supabase/migrations/` has to be created. Use `portfolio/shipyard/supabase/migrations/0001_init.sql` as format reference.
- **Existing Supabase project shared.** Uses project `unqtnnxlltiadzbqpyhh` (the portfolio-wide one). New tables are prefixed `clarity_budget_` to avoid colliding with other apps' tables.
- **`BudgetBlob` shape must not change.** Existing users have it in localStorage + `syncs` table. Any schema changes to it break backward compat.
- **localStorage migration banner is one-shot.** After the user clicks it, the banner unmounts and the localStorage key is cleared. Make sure the POST to `/api/credentials` is atomic — don't clear localStorage until Supabase write is confirmed.
- **STRATEGY.md 60-day freeze.** No new apps until 2026-06-22. This work lives inside existing Clarity Budget Web, which satisfies the freeze.
- **Root CLAUDE.md auto-update rule.** Must bump the portfolio table, sync Shipyard, update ROADMAP Change Log after ship. See "Documentation Auto-Update Rule" in root CLAUDE.md.

---

## Out of scope (explicit cut list)

- Visual refresh / brand pass (palette, logo, typography, illustrations). Tracked in ROADMAP backlog.
- `docs/BRANDING.md`. Deferred with the brand pass.
- Gmail OAuth + Amazon receipt parsing.
- Category suggestions for uncategorized transactions.
- Amazon split proposals.
- Money Companion (Claude AI chat layer). Deferred to Phase 2.
- Multi-user billing (Stripe, plan gating). Tracked separately under `portfolio/STRATEGY.md` 5.3.
- iOS companion parity with these new surfaces.
- Historical trends, sparklines, charts beyond what `SpendingBreakdown` already shows.
- CSV export.
- Key rotation implementation (column is added, logic isn't).
- Migrating the full YNAB transaction cache into Supabase. Cron fetches fresh server-side; client keeps its 15-min localStorage cache.
- Modifying the Spend Clarity Python CLI.

---

## Implementation order (so scope stays honest)

1. **Backend foundation:** `lib/crypto.ts`, `lib/supabase-server.ts`, `supabase/migrations/0001_init.sql` + `0002_rls.sql`, `/api/credentials`.
2. **Auth refactor:** `login/page.tsx`, `(app-shell)/layout.tsx` auth gate, migrate-YNAB-token banner.
3. **Privacy integration:** `lib/privacy/*`, sync logic.
4. **Reconcile:** `lib/reconcile/*`, pure functions, add unit tests (first tests in this app).
5. **Cron:** `app/api/cron/sync/route.ts` + `backfill`, `vercel.json`.
6. **Review queue UI:** `/review` page + components.
7. **Flags inbox UI:** `/flags` page + components.
8. **Settings redesign:** `/settings` page, connector cards, card mapping.
9. **Dashboard split:** extract `HomeDashboard` into `components/dashboard/*`, move to `app/page.tsx`.
10. **Migration banner + first run**.

---

## Portfolio tracking updates (after ship)

Per root `CLAUDE.md` auto-update rule:

1. Bump `Clarity Budget (web)` row in root `CLAUDE.md` portfolio table to v0.5 with new feature summary.
2. Update Shipyard metadata table tagline.
3. Add Change Log row to root `ROADMAP.md`.
4. `cd portfolio/shipyard && npm run sync:projects`.
5. Update `portfolio/clarity-budget-web/HANDOFF.md`, `CHANGELOG.md`, `LEARNINGS.md`, `ROADMAP.md`.
6. Update Linear project (https://linear.app/whittaker/project/clarity-budget-web-b40f3edb4be0) with summary.
7. Add note to `portfolio/clarity-budget-web/ROADMAP.md` backlog: "Full brand pass — new palette, logo, `docs/BRANDING.md`".
