# Clarity Budget (web)

Next.js **15** (App Router) companion to [**Clarity Budget iOS**](../clarity-budget-ios) — **safe to spend** (month / week / today) from the YNAB API, same metrics as Funded’s engine and the iOS `BudgetMetricsEngine`.

## What you get

- **Dashboard** (`components/HomeDashboard.tsx`) — “Safe to spend” hero aligned with iOS **Today**: month (“Full pool”), week and day cards with the same captions, obligations shortfall strip, loading skeleton, optional empty state when YNAB is not configured.
- **Math** — `lib/metrics.ts` (pace / shortfall / STS), `lib/ynab.ts` (budgets + categories + month), `lib/blob.ts` (merge + `defaultBlob`).
- **Sync** — optional Supabase email/password; `user_data` row with **`app_key` = `clarity_budget`** (see `lib/constants.ts`). Merge helpers in `lib/sync.ts`.
- **Privacy** — YNAB personal access token is stored only in **`localStorage`** (`chase_budget_web_ynab_token`), never in Supabase.

## Env

Copy [`.env.local.example`](.env.local.example) to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Without these, the app runs for local-only YNAB + `localStorage` blob; Supabase sign-in is disabled with an inline message.

## Scripts

```bash
npm install
npm run dev
npm run build
```

Uses **Turbopack** (`next dev` / `next build --turbopack`). If monorepo tooling warns about multiple lockfiles, set `turbopack.root` in [`next.config.ts`](next.config.ts) or keep this app’s `package-lock.json` as the only lockfile in scope.

## Parity with iOS

| Topic | Location |
|-------|----------|
| Blob shape | `lib/blob.ts` ↔ iOS `BudgetBlob` + `_syncAt` |
| STS + pace | `lib/metrics.ts` ↔ `BudgetMetricsEngine.swift` |
| Supabase app key | `SUPABASE_APP_KEY` = `clarity_budget` (also in `portfolio/funded-web/src/shared/sync.js` known list) |
| Category roles | **iOS** Settings + **web** YNAB section (grouped, name suggestions, per-group “Auto from names”) — same blob fields as iOS; optional Supabase merge |

## Typography

**Geist** / **Geist Mono** from `next/font/google` in `app/layout.tsx`; `app/globals.css` applies `--font-geist-sans` on `body`.
