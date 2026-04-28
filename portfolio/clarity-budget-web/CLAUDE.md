# Clarity Budget Web — CLAUDE.md

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


## What This App Is

YNAB-backed Safe-to-Spend (STS) dashboard showing how much is safe to spend today, this week, and this month — plus a 60-day transaction spending breakdown by category. Phase 2 adds a Claude-powered money companion that questions you about spending patterns.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (optional sync)

## What it does
STS (Safe-to-Spend) dashboard backed by YNAB. Fetches month-level category aggregates + 60 days of individual transactions. Shows safe-to-spend (month / week / day) and a "Where your money went" breakdown by category. Phase 2: Claude-powered money companion.

## Storage keys
| Key | Contents | Synced to Supabase? |
|---|---|---|
| `chase_budget_web_v1` | BudgetBlob (YNAB mappings, category roles, `_syncAt`) | ✅ Yes |
| `chase_budget_web_ynab_token` | YNAB personal access token | ❌ Never |
| `chase_budget_web_tx_v1` | `{ ts: number, data: YNABTransaction[] }` (60-day cache) | ❌ Never |

## Key files
- `components/HomeDashboard.tsx` — STS UI, category roles, spending breakdown (token/budget picker removed)
- `components/settings/YnabConnectorCard.tsx` — YNAB token + budget picker; "stored ✓ / Replace" mode when encrypted row exists
- `components/settings/MigrationBanner.tsx` — one-shot banner (localStorage → Supabase); hidden when `hasEncryptedYnabToken=true`
- `app/(app-shell)/settings/page.tsx` — async server component; queries `clarity_budget_credentials` presence; passes `hasEncryptedYnabToken` prop
- `app/api/ynab/budgets/route.ts` — server-side budget listing for migrated users (decrypts token, calls YNAB)
- `app/api/credentials/route.ts` — POST/DELETE encrypted credential upsert
- `lib/ynab.ts` — YNAB API client (fetchBudgets, fetchCategories, fetchMonth, fetchTransactions, fetchUncategorizedTransactions, bulkUpdateTransactions)
- `lib/blob.ts` — BudgetBlob type, defaultBlob, mergeBlob, loadLocalBlob, saveLocalBlob
- `lib/crypto.ts` — AES-256-GCM encrypt/decrypt (server-only)
- `lib/supabase-server.ts` — createRouteClient() (RLS, cookie-bound) + createServiceClient() (service-role, cron only)
- `lib/categorize/credentials.ts` — loadYnabCredentials(supabase, userId); self-heals default_budget_id from user_data fallback
- `lib/categorize/run.ts` — runCategorization() orchestrator (batch LLM + PATCH YNAB)
- `lib/ai/gateway.ts` — generateObject() wrapper around Vercel AI Gateway
- `lib/metrics.ts` — STS math (buildBalances, safeToSpend, safePerDay, safePerWeek)
- `lib/constants.ts` — STORE_KEY, YNAB_TOKEN_KEY, YNAB_TX_KEY, T (theme tokens)

## Supabase sync rules (privacy)
- YNAB token → `clarity_budget_credentials.ynab_token_ciphertext` (AES-256-GCM, server-only) + localStorage (legacy compat for HomeDashboard client-side calls — do NOT clear it)
- Raw transactions → `chase_budget_web_tx_v1` localStorage only, **never** Supabase
- BudgetBlob (mappings, roles) → Supabase `user_data`, `app_key = "clarity_budget"`
- AI suggestions → `clarity_budget_categorization_suggestions` (server-side only)

## Conventions
- No Redux, no component libraries — all styles via `T` theme tokens in `constants.ts`
- STS math lives in `metrics.ts` — don't duplicate in components
- Transaction amounts are **milliunits**; divide by 1000 for dollars everywhere
- Negative `amount` = outflow (spending); positive = inflow
- Split transactions: parent has `subtransactions[]`; use sub amounts for category breakdown
- Transaction cache: 15-minute TTL; force-bypass via "Refresh numbers" button (passes `force=true`)

## Running
```
pnpm install
pnpm dev
```
For AI categorization locally, ensure `AI_GATEWAY_API_KEY` is set. If `vercel env pull` left it empty, run `pnpm run env:pull-local` (merges Production + Development pulls into `.env.local`).

Supabase is optional. Without `NEXT_PUBLIC_SUPABASE_*` env vars, app runs fully local.

## Roadmap phases
- **Phase 1 (current):** Transactions + spending breakdown → filters + full transaction list (Session 2)
- **Phase 2:** Claude-powered money companion — ambient card + chat drawer (Session 3)
