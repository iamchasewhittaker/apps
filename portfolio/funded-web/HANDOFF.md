# Handoff — Funded Web

## State (living)

| Field | Value |
|-------|-------|
| **Focus** | Parity with Funded iOS for income hints + categorization triage; local-only app |
| **Last updated** | 2026-04-20 |
| **Production** | Local only — Vercel project removed 2026-04-20 |
| **Status** | Shipped — `npm run build` green; runs locally via `npm start` |

## What’s in the tree (2026-04-15)

| Area | Detail |
|------|--------|
| **Income setup (step 4)** | Fetches YNAB this month → last month → Ready to Assign; loading + errors; prefill banner for income; informational card for RTA |
| **Categorization Review** | Dashboard card: uncategorized **outflows**; `CategorySuggestionEngine.js`; assign modal with notes / purchaser / necessary → merged YNAB memo + `categoryOverrides` + `transactionMetadata` in blob |
| **Blob** | `categoryOverrides`, `transactionMetadata`; `loadBlob()` merges `DEFAULT_YNAB` keys for older localStorage |
| **YNAB API** | `mapTransaction` includes `memo`, `category_name`; `updateTransactionCategory(..., memo)` optional |
| **iOS parity** | Same mental model as Funded iOS Bills flow + Income setup hints (see `portfolio/funded-ios`) |

## Deploy

- **Path:** `~/Developer/chase/portfolio/funded-web` (repo root is `~/Developer/chase`)
- **Build:** `npm run build`
- **Vercel:** **Removed 2026-04-20.** To re-add: `vercel project add funded-web --scope iamchasewhittakers-projects` → `vercel link` → `vercel git connect` → `scripts/vercel-add-env portfolio/funded-web` → `vercel --prod`.

## Auth

- App supports **email OTP** (`signInWithOtp` + `verifyOtp`) and **Sign in with Google** (OAuth).
- **Email OTP:** Supabase Dashboard → Authentication → Email Templates → Magic link must include **`{{ .Token }}`** in the body. If no email arrives: spam folder; rate limits; check `auth.audit_log_entries` in SQL Editor.
- **Google OAuth:** configured in Supabase → Authentication → Providers → Google (Client ID + Secret from Google Cloud Console). `redirectTo` uses `window.location.origin`. The local dev URL (`http://localhost:3000`) must be in Supabase → Authentication → URL Configuration → Redirect URLs.
- Shared Supabase project: **`unqtnnxlltiadzbqpyhh`** — same as other portfolio apps.

## Constraints (do not change)

- Storage key **`chase_hub_ynab_v1`**
- Supabase sync **`app_key` = `'ynab'`**
- YNAB token key **`chase_hub_ynab_token`**
- Keep **`src/shared/sync.js`** aligned with `portfolio/shared/sync.js` (copy)

## Next session prompt

```
Read chase/portfolio/funded-web/CLAUDE.md and HANDOFF.md.
Work only under chase/portfolio/funded-web unless touching shared sync.
Run npm run build before handoff; update CHANGELOG [Unreleased], HANDOFF, LEARNINGS if behavior or ops changed.
```

## Related

- **Funded iOS:** `portfolio/funded-ios` — native companion; SwiftData `TransactionMetadata` vs web blob `transactionMetadata`
- **Repo root:** `~/Developer/chase/CLAUDE.md` for monorepo conventions
