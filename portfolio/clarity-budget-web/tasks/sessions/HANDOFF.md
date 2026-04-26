# Session Handoff — clarity-budget-web

**Date**: 2026-04-25
**Status**: Ready for next session
**Focus Area**: v1 Redesign Step 3 complete — Privacy.com sync layer shipped; Step 4 (reconcile logic) is next

This session completed Step 3 of the 10-step clarity-budget-web v1 redesign. The Privacy.com sync layer (`lib/privacy/sync.ts`) was fully rewritten from an incomplete scaffold. TypeScript, lint, and build all pass clean. Manual smoke test is pending (requires `SUPABASE_SERVICE_ROLE_KEY` + real Privacy.com token).

---

## What Was Completed

### Step 3 — Privacy.com sync layer

- `lib/privacy/types.ts` — existed from prior checkpoint; no changes needed
- `lib/privacy/client.ts` — existed from prior checkpoint; no changes needed
- `lib/privacy/sync.ts` — **fully rewritten**. Added `loadPrivacyToken()`, `upsertInChunks()`, `recordSyncSuccess()`, `recordSyncFailure()`, `recordAudit()` helpers. `pullCards(userId)` and `pullTransactions(userId, since?)` both decrypt the Privacy token from `clarity_budget_credentials`, call `createPrivacyClient()`, pre-fetch existing rows to preserve user-owned columns (`linked_payee_id` on cards, `matched_ynab_txn_id` on transactions), upsert in chunks of 500, stamp `clarity_budget_sync_state` (`source='privacy'`), emit `clarity_budget_audit_log` rows, and rethrow on failure.
- `CHANGELOG.md` — Step 3 entry added
- `ROADMAP.md` — Steps 1–3 marked done, Step 4 is next
- `HANDOFF.md` — Step 3 section + Step 4 "what to build next" + fresh session prompt
- `LEARNINGS.md` — four entries: `api-key` vs Bearer auth, `source` CHECK constraint forcing v1 simplification, user-owned column preservation pattern, endpoint plurality unverified
- Root `CLAUDE.md` portfolio table — clarity-budget-web status updated
- Root `HANDOFF.md` — next item updated
- Root `ROADMAP.md` — Change Log row added
- `.gitignore` — `.claude/` added

**Recent Commits**:
```
3e813fe feat(clarity-budget-web): step 3 — Privacy.com sync layer with observability
0a96922 fix(clarity-budget-web): remove dead inline sign-in panel + unify on cookie-aware Supabase client
04d4c8c fix(clarity-budget-web): restore middleware + harden setAll for Server Components
```

**Verification**:
| Check | Result |
|---|---|
| `pnpm exec tsc --noEmit` | clean |
| `pnpm lint` | clean |
| `pnpm build` | clean — route table unchanged from Step 2 (pure lib code) |
| Manual smoke test | PENDING |

---

## What's In Progress

### Nothing actively in-flight

Step 3 is committed and clean. No staged or unstaged changes at session close.

---

## Next Steps

### Immediate Actions (Priority Order)

1. **Manual smoke test for Step 3** (Chase, prerequisite before wiring into cron)
   - Paste `SUPABASE_SERVICE_ROLE_KEY` into `.env.local` (Supabase dashboard → project settings → API)
   - Write throwaway `scripts/test-privacy-sync.ts` calling `pullCards(userId)` then `pullTransactions(userId)`
   - Probe `clarity_budget_privacy_cards`, `clarity_budget_privacy_transactions`, `clarity_budget_sync_state` (check for `source='privacy'` row with `last_success_at`), and `clarity_budget_audit_log` (check for `privacy_sync_cards` + `privacy_sync_transactions` entries)
   - Rerun to confirm idempotency (only `updated_at` advances)
   - Confirm endpoint plurality: if 404s appear, `/card` → `/cards` and `/transaction` → `/transactions` in `lib/privacy/client.ts:35,57` is the one-line fix

2. **Step 4 — Reconcile logic + first vitest suite**
   - [ ] `lib/reconcile/fingerprint.ts` — deterministic hash for `clarity_budget_flags.fingerprint` unique constraint
   - [ ] `lib/reconcile/match.ts` — fuzzy-match Privacy tx to YNAB tx (date window + amount + payee similarity); return confidence score
   - [ ] `lib/reconcile/propose-rename.ts` — on match, derive proposed YNAB payee rename, write `clarity_budget_proposals` row (type `payee_rename`, status `pending`)
   - [ ] `lib/reconcile/detect-weirdness.ts` — emit `clarity_budget_flags` rows for `duplicate_txn`, `orphan_privacy_charge`, `orphan_ynab_privacy_payee` (idempotent via fingerprint unique constraint)
   - [ ] `lib/reconcile/__tests__/*` — vitest suite; `vitest ^4.1.5` already in devDependencies
   - Do NOT wire into cron, route handler, or UI — that's Steps 5–7

3. **Vercel env var fix (before any redesign deploy)**
   - Add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel (Production + Preview)
   - The currently deployed v0.4 uses `REACT_APP_SUPABASE_*` prefixes from the pre-Next.js era

### Blockers / Questions

- `SUPABASE_SERVICE_ROLE_KEY` is blank in `.env.local` — Step 3 smoke test and all subsequent server-side Supabase calls (cron, Step 4 integration tests against real DB) are blocked until pasted
- Privacy.com endpoint plurality (`/card` vs `/cards`) — unverified; one-line fix if 404s appear during smoke
- GitHub OAuth not yet working in production: Supabase Dashboard still needs Provider enabled + Client ID/Secret + Redirect URLs allowlist updated (tracked in `HANDOFF.md` State table, line 12)

### Related Work

- Step 5 (cron) needs `vercel.json` + `CRON_SECRET` set in Vercel env — already generated in `.env.local`
- Step 4 reconcile logic can be written + unit-tested with synthetic fixtures even if the Step 3 smoke is blocked

---

## Key Context to Preserve

### Architectural Decisions

1. Both `pullCards` and `pullTransactions` share `source='privacy'` in `clarity_budget_sync_state` — the `source` CHECK constraint (`ynab | privacy`) prevents distinct sub-source tracking. Last writer wins; the audit log carries per-call detail.
2. User-owned columns (`linked_payee_id`, `matched_ynab_txn_id`) are preserved on upsert by pre-fetching existing rows and re-applying values in the upsert payload. This costs one round-trip per sync but eliminates the Postgres upsert nulling question entirely.
3. `createServiceClient()` (service-role, no user session) is the right Supabase client for all sync functions — they run server-side (cron context), not in a user request.
4. `cursor` for incremental sync is null in v1 — `since` parameter for `pullTransactions` is the only incremental path; full card pulls every time.
5. Magic-link OTP is replaced by password auth (commit `72799f9`). `app/auth/callback/route.ts` is harmless dead code left in place; it'll activate if OTP or GitHub OAuth lands.

### Coding Patterns

- `server-only` guard on all `lib/privacy/*` and `lib/supabase-server.ts` — these must never reach the client bundle
- All Privacy token crypto goes through `lib/crypto.ts` `decrypt()` — never inline
- Chunked upserts via `upsertInChunks()` (500 rows) — Supabase has a payload size limit; never send all rows in one call for unbounded lists
- `onConflict: "token"` for both card and transaction upserts — Privacy `token` is the stable unique identifier
- Audit log writes are fire-and-forget (log-warn on failure, don't rethrow) — observability must not break the sync path
- `sync_state` writes are also fire-and-forget for the same reason, but both success and failure paths write to it

### Technical Constraints

- Supabase project is shared (`unqtnnxlltiadzbqpyhh`) with Shipyard and other apps — all DDL uses `clarity_budget_` prefix; trigger function is `clarity_budget_update_updated_at()` to avoid collision
- `TOKEN_ENCRYPTION_KEY` is AES-256-GCM, 32 bytes base64. Already generated in `.env.local`. Must be added to Vercel env before deploying any redesign step that calls `/api/credentials`
- Next.js 15 App Router — all sync lib files are server-only; client components in `app/(app-shell)/**` cannot import from `lib/privacy/*` or `lib/supabase-server.ts`

### Lessons Learned

- Privacy.com auth header is `Authorization: api-key <token>` — not Bearer like YNAB. Don't copy auth schemes from existing clients without verifying the target API.
- Supabase migration tracker can report migrations as applied when the DDL never ran. After every `db push`, probe a concrete table via REST to confirm.
- `emailRedirectTo` / OAuth `redirectTo` are silently ignored by Supabase if the URL is not on the Redirect URLs allowlist — no error, silent fallback to Site URL.
- Files may be further along on disk than `HANDOFF.md` claims — always `git log` the touched directory before assuming files don't exist when picking up a redesign.

---

## Reference Links

### Key Files

- `/Users/chase/Developer/chase/portfolio/clarity-budget-web/lib/privacy/sync.ts` — core of Step 3; `pullCards` at line 119, `pullTransactions` at line 179
- `/Users/chase/Developer/chase/portfolio/clarity-budget-web/lib/privacy/client.ts` — `createPrivacyClient`; endpoint strings at lines 35 and 57 (verify plurality during smoke)
- `/Users/chase/Developer/chase/portfolio/clarity-budget-web/lib/crypto.ts` — `encrypt` / `decrypt` / `maskToken`; used by sync to decrypt stored Privacy token
- `/Users/chase/Developer/chase/portfolio/clarity-budget-web/lib/supabase-server.ts` — `createServiceClient()` used by all sync functions; `createRouteClient()` used by route handlers
- `/Users/chase/Developer/chase/portfolio/clarity-budget-web/supabase/migrations/0001_init.sql` — all 7 `clarity_budget_*` table definitions; `source` CHECK constraint at line 118
- `/Users/chase/Developer/chase/portfolio/clarity-budget-web/HANDOFF.md` — ongoing app handoff; Step 4 fresh session prompt at bottom
- `/Users/chase/Developer/chase/portfolio/clarity-budget-web/plans/clarity-budget-web-redesign.md` — full 10-step plan with acceptance criteria

### Documentation

- `CLAUDE.md` at app root — storage keys, key files, privacy rules, conventions
- `LEARNINGS.md` at app root — Step 3 postmortem entries (Privacy auth, CHECK constraint, user-owned columns, endpoint plurality)

### Related Items

- Linear: https://linear.app/whittaker/project/clarity-budget-web-b40f3edb4be0
- Commit: `3e813fe feat(clarity-budget-web): step 3 — Privacy.com sync layer with observability`

---

## How to Resume

1. Read `/Users/chase/Developer/chase/portfolio/clarity-budget-web/HANDOFF.md` — the "Step 4 — what to build next" section has the full file list and a ready-to-paste fresh session prompt
2. Run `checkpoint` before touching anything
3. If smoke testing Step 3 first: paste `SUPABASE_SERVICE_ROLE_KEY` into `.env.local`, write `scripts/test-privacy-sync.ts`
4. For Step 4 (reconcile): start with `lib/reconcile/fingerprint.ts` (no dependencies), then `match.ts`, then `propose-rename.ts` + `detect-weirdness.ts`, then `__tests__/*`
5. Do not wire Step 4 into any cron, route, or UI — that's Steps 5–7

---

**Last Updated**: 2026-04-25
**Generated By**: /handoff command
