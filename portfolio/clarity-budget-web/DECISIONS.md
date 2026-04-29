# Decisions — Clarity Budget Web

> Architecture and design decisions for this app.
> Each entry records what was decided, why, and what was considered.
> Read alongside LEARNINGS.md (what went wrong) and CHANGELOG.md (what shipped).
>
> See also: `/PATTERNS.md` (reusable code recipes) at repo root.

---

## 2026-04-26 — Separate Supabase row for OAuth tokens

**Context:** YNAB integration requires storing refresh tokens. Needed to decide where tokens live relative to the main app data blob.

**Options considered:**
1. **Store tokens in the main BudgetBlob** — simple, same sync path
2. **Separate `user_data` row with `app_key='clarity_budget_credentials'`** — isolated from blob sync

**Decision:** Separate Supabase row — tokens never touch the sync blob.

**Why:** The main blob round-trips through localStorage → Supabase daily. Storing tokens there makes them visible to XSS and backed up alongside non-sensitive data. Separate row with server-side AES-256-GCM encryption keeps tokens out of the client entirely.

**Revisit when:** N/A — this is a security architecture decision. Same pattern used by Job Search HQ for Gmail OAuth.

> **Chase:**

---

## 2026-04-20 — Transactions in separate localStorage key (never Supabase)

**Context:** The app caches 60 days of YNAB transaction data. Needed to decide whether to sync transaction cache to Supabase.

**Options considered:**
1. **Sync transactions to Supabase** — enables multi-device, but exposes merchant-level PII
2. **Local-only `chase_budget_web_tx_v1` key** — no cloud exposure, single-device only

**Decision:** Local-only — raw transactions stay in localStorage, never synced.

**Why:** Raw YNAB transactions contain merchant-level PII (store names, amounts, dates). PII filtering would be manual and error-prone. Keeping them local-only prevents cloud data leakage entirely. Multi-device access is not a requirement for this app.

**Revisit when:** Multi-device becomes a real need AND a reliable PII-stripping pipeline exists.

> **Chase:**

---

## 2026-04-20 — Transaction amounts as milliunits throughout

**Context:** YNAB API returns amounts in milliunits (integers). Needed to decide whether to convert to dollars on ingestion or keep as milliunits.

**Options considered:**
1. **Convert to dollars (floats) on ingestion** — human-readable in storage, but floating-point arithmetic errors in finance
2. **Keep as milliunits (integers) throughout** — divide by 1000 only for display

**Decision:** Milliunits throughout — all `amount` fields are integers, divided by 1000 at display time only.

**Why:** Floating-point arithmetic errors in financial calculations are a classic bug source. Integer math is exact. The division-for-display pattern is a well-known best practice in fintech.

**Revisit when:** N/A — this is a fundamental correctness decision.

> **Chase:**

---

## 2026-04-20 — Flatten early, filter late for split transactions

**Context:** YNAB has split transactions where a parent has `subtransactions[]`. Every consumer needed to handle the branching logic.

**Options considered:**
1. **Branch on `subtransactions.length` in every consumer** — duplicated logic everywhere
2. **Flatten once at data-entry boundary** — single `flattenSpendLines()` emits one `SpendLine` per subtransaction

**Decision:** Flatten at the boundary — all downstream code operates on the flat list.

**Why:** Eliminates repeated branching logic in filters, groupBy, list rendering. One normalize pass; all consumers work on a uniform shape.

**Revisit when:** N/A — this is strictly better than the alternative.

> **Chase:**

---

## 2026-04-26 — LLM allowlist filter for hallucinated category IDs

**Context:** AI categorization suggests YNAB category IDs for uncategorized transactions. Needed validation beyond Zod shape checking.

**Options considered:**
1. **Zod validation only** — validates structure (`{ categoryId: string | null }`) but not semantics
2. **Zod + allowlist filter** — check `categoryId` against `Set<string>` of valid YNAB categories

**Decision:** Zod + allowlist — Zod for shape, allowlist for semantic validity.

**Why:** Hallucinated UUIDs pass Zod shape validation and would corrupt YNAB data if applied. The allowlist catches IDs that don't exist in the user's actual category list. Defense-in-depth: validate shape, then validate meaning.

**Revisit when:** N/A — this is a correctness safeguard. Remove it and hallucinated IDs will corrupt data.

> **Chase:**

---

## 2026-04-28 — Server-side YNAB proxy with self-heal fallback

**Context:** After migrating tokens from localStorage to Supabase row, the client-side YNAB fetch broke because `localStorage[YNAB_TOKEN_KEY]` was stale/empty.

**Options considered:**
1. **Client-side fetch with localStorage token** — breaks after migration
2. **Server-side proxy that decrypts Supabase token** — with self-heal fallback to `user_data.data.ynabBudgetId`

**Decision:** Server-side proxy at `GET /api/ynab/budgets` — decrypts token server-side, calls YNAB, returns data to client.

**Why:** After migration, localStorage token may be stale or empty. Server-side proxy is the single source of truth for credentials. Self-heal fallback gracefully handles the transition period.

**Revisit when:** N/A — server-side credential access is the permanent architecture.

> **Chase:**

---

## 2026-04-27 — Hobby plan cron: once-per-day limit

**Context:** Auto-categorization cron was set to `*/15 * * * *` (every 15 minutes). Vercel Hobby plan restricts this.

**Options considered:**
1. **Upgrade to Pro plan** — removes frequency limit, adds cost
2. **Daily cron + manual endpoint** — `0 6 * * *` with `/api/cron/backfill` for ad-hoc runs

**Decision:** Daily cron + manual endpoint — stay on Hobby plan.

**Why:** Hobby plan forbids >1/day frequency. Manual endpoint covers ad-hoc needs. Pro upgrade not justified until revenue exists.

**Revisit when:** App generates revenue OR daily frequency is insufficient for user experience.

> **Chase:**
