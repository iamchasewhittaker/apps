# Funded Web — Project Instructions

> See also: [`/CLAUDE.md`](../../CLAUDE.md) (repo root) for portfolio-wide conventions. Monorepo root: **`~/Developer/chase`**.
> Quick links: [`README.md`](README.md) · [`HANDOFF.md`](HANDOFF.md) · [`LEARNINGS.md`](LEARNINGS.md) · [`CHANGELOG.md`](CHANGELOG.md)

- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md)

## App Identity

- **Version:** v1.0+
- **Storage key:** `chase_hub_ynab_v1` (localStorage — shared naming lineage with clarity-hub)
- **YNAB token key:** `chase_hub_ynab_token` (localStorage, never synced to Supabase)
- **Supabase `app_key`:** `ynab` (must not change — iOS sync depends on it)
- **URL:** local only (Vercel project removed 2026-04-20 — run with `npm start`)
- **Supabase project:** `unqtnnxlltiadzbqpyhh` — shared with other portfolio apps
- **Entry:** `src/App.jsx`

## Purpose

Standalone YNAB budget dashboard — web companion to **`funded-ios`**. Split from Clarity Hub for focused access.

## What This App Is

A standalone YNAB budget dashboard answering the four questions YNAB's own UI answers poorly: Are bills covered this month? How much am I short? How much can I safely spend today/week/month? When will the mortgage be fully funded? Web companion to Funded iOS, sharing the same Supabase blob via `app_key = ynab`.

## Tech Stack

React (CRA) · localStorage + Supabase blob sync · inline styles · no TypeScript · YNAB REST API from browser (CORS)

## File Structure

```
src/
  App.jsx                    — shell: auth gate, single-blob state, settings modal
  theme.js                   — T palette, loadBlob/saveBlob (merges DEFAULT_YNAB keys), YNAB token helpers
  sync.js                    — pushYnab/pullYnab + auth
  shared/auth.js             — canonical host, portfolio auth client
  shared/sync.js             — copy of portfolio/shared/sync.js (not symlink)
  ErrorBoundary.jsx
  engines/
    MetricsEngine.js         — safe-to-spend, bills balances
    CashFlowEngine.js        — timeline
    YNABClient.js            — YNAB fetch + PATCH (transactions include optional memo, snake_case category_id)
    CategorySuggestionEngine.js — payee → role → category suggestions (parity with iOS)
  tabs/
    YnabTab.jsx              — setup flow, dashboard, categorization review, income hints
```

## Blob shape (`chase_hub_ynab_v1`)

Synced via Supabase (`app_key: ynab`):

| Field | Purpose |
|-------|---------|
| `categoryMappings` | YNAB category roles + due days |
| `incomeSources` | Paycheck schedule for gap / timeline |
| `preferences` | `activeBudgetID`, `setupComplete`, `taxRate`, … |
| `categoryOverrides` | Learned payee substring → category (after assign) |
| `transactionMetadata` | `{ [transactionId]: { purchaserName, isNecessary, updatedAt } }` |

Live YNAB month + transactions are **not** stored in the blob — refetched on load/refresh.

## Auth (email OTP + Google OAuth)

- `App.jsx`: email OTP via `signInWithOtp` → user enters **code** → `verifyOtp({ type: "email" })`; Google OAuth via `signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })`.
- **Critical — Supabase email template:** Dashboard → **Authentication → Email Templates → Magic link** must include **`{{ .Token }}`** in the HTML body. Without it, users get a link but no code. See [Passwordless email / OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp).
- **Critical — Google OAuth redirect:** Dashboard → **Authentication → URL Configuration → Redirect URLs** must include the local URL (e.g. `http://localhost:3000`). Also configure Google provider (Client ID + Secret) under Authentication → Providers → Google.
- **No email received:** spam; built-in email rate limits; wrong Supabase project in env; query `auth.audit_log_entries` after a send.
- **`emailRedirectTo`:** set via shared auth + `REACT_APP_AUTH_*` envs. For OAuth, use `window.location.origin` — not `emailRedirectTo`.

## Commands

```bash
# From repo root ~/Developer/chase
cd portfolio/funded-web

npm start          # dev server (default port 3000)
npm run build      # required before deploy

# No production deploy — app runs locally. To re-add to Vercel fleet, re-link + `vercel git connect`.
```

**Path note:** On disk, `portfolio/funded-web` is relative to **`~/Developer/chase`**, not `~/Developer` alone.

## Constraints

- Do **not** change `chase_hub_ynab_v1`, `chase_hub_ynab_token`, or Supabase `app_key` string `ynab`.
- Keep `src/shared/sync.js` aligned with `portfolio/shared/sync.js` (copy).
- No TypeScript in this app.

## Linear

Project work under team **Whittaker (WHI)** — link PRs and notable doc-only updates if they reflect shipped or operational changes.
