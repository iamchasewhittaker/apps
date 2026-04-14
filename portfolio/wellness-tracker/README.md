# Wellness Tracker

Personal daily wellness PWA (Create React App). One localStorage blob + optional Supabase sync (`app_key` `wellness`).

## Run locally

```bash
cd portfolio/wellness-tracker
cp .env.example .env   # add REACT_APP_SUPABASE_* for sync
npm install
npm start              # http://localhost:3000
npm run build
```

## Shared login configuration

Use canonical-host auth settings in `.env`:

- `REACT_APP_AUTH_CANONICAL_ORIGIN=https://apps.chasewhittaker.com`
- `REACT_APP_AUTH_APP_PATH=/wellness`
- `REACT_APP_SUPABASE_STORAGE_KEY=chase_portfolio_auth_token`

Supabase should allow redirects for the canonical app URL and local dev URL.

## Monorepo

Path from repo root: **`portfolio/wellness-tracker`**. Copy of shared sync lives in `src/shared/sync.js` — keep aligned with `portfolio/shared/sync.js`.

## Branding

Logo and icon specs: [docs/BRANDING.md](docs/BRANDING.md). Favicon, Apple touch icon, and PWA manifest live in `public/`. Palette aligns with **YNAB Clarity** `ClarityTheme` (Spend Clarity is CLI-only — see BRANDING for rationale).

## Handoff (this app)

[HANDOFF.md](HANDOFF.md) — Wellness web + iOS session state; use with repo-root [`HANDOFF.md`](../../HANDOFF.md) for monorepo-wide continuity.

## Docs

- [HANDOFF.md](HANDOFF.md) — per-app session state (web + iOS branding + assets)
- [CLAUDE.md](CLAUDE.md) — app-specific behavior and file map
- [PROJECT_INSTRUCTIONS.md](PROJECT_INSTRUCTIONS.md) — session starter for AI
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/LEARNING.md](docs/LEARNING.md)

## Project tracking

[Linear — Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7)

[Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37)

## Deploy

Production: **https://wellnes-tracker.vercel.app** — set Vercel **Root Directory** to `portfolio/wellness-tracker` when deploying from this monorepo.
