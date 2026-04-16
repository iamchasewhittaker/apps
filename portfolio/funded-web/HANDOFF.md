# Handoff — Funded Web

## State (living)

| Field | Value |
|-------|-------|
| **Focus** | Parity with Funded iOS for income hints + categorization triage; stable production deploy |
| **Last updated** | 2026-04-16 |
| **Production** | https://funded-web.vercel.app |
| **Status** | Shipped — `npm run build` green; Vercel prod deploy verified |

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
- **Vercel:** `npx vercel --prod` from app dir (project linked) — aliases **funded-web.vercel.app**

If Vercel **Root Directory** is set to `portfolio/funded-web` or `chase/portfolio/funded-web`, match that when using the CLI (running from the wrong cwd can double the path — see LEARNINGS).

## Auth

- App supports **email OTP** (`signInWithOtp` + `verifyOtp`) and **Sign in with Google** (OAuth).
- **Email OTP:** Supabase Dashboard → Authentication → Email Templates → Magic link must include **`{{ .Token }}`** in the body. If no email arrives: spam folder; rate limits; check `auth.audit_log_entries` in SQL Editor.
- **Google OAuth:** configured in Supabase → Authentication → Providers → Google (Client ID + Secret from Google Cloud Console). `redirectTo` uses `window.location.origin`. **Critical:** `https://funded-web.vercel.app` must be in Supabase → Authentication → URL Configuration → Redirect URLs — without this, Google auth redirects to the Site URL instead.
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
