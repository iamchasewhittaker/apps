# Handoff — Funded Web

## State

| Field | Value |
|-------|-------|
| **Focus** | Stable v1.0 — fully functional YNAB dashboard |
| **Next** | Monitor; potential improvements: save-to-spend notifications, multi-budget support |
| **Last touch** | 2026-04-15 — rename Conto → Funded; FUNDED logo; AppIcon; deployed https://funded-web.vercel.app |
| **Status** | ✅ Deployed · https://funded-web.vercel.app |

## Release scope (deploy 2026-04-15)

| Area | Detail |
|------|--------|
| **Build / CI** | Pinned **TypeScript 4.9.5** so `package-lock.json` matches `react-scripts@5` peer (`^3 \|\| ^4`); `npm ci` + `npm run build` green locally and on Vercel |
| **Already in tree** | Shared auth (`src/shared/auth.js`), sync refactor (`src/shared/sync.js` + `src/sync.js`), canonical OTP redirect envs (see `.env.example`) |
| **Smoke** | `GET /` → 200, `title` = Funded; JS bundle loads from `/static/js/` |
| **Deploy** | `cd portfolio/funded-web && vercel deploy --prod` (requires Vercel CLI + linked project) |

## What Shipped (Session 1 — 2026-04-13)

- Full app split from `clarity-hub` — standalone CRA with single-blob state
- `src/theme.js` — T palette, `chase_hub_ynab_v1` storage key, YNAB token helpers, format helpers
- `src/sync.js` — `pushYnab` / `pullYnab` using `app_key = 'ynab'`
- `src/App.jsx` — auth gate (email OTP), settings modal (token update + re-run setup + sign out), gear icon nav
- `src/tabs/YnabTab.jsx` — full YNAB tab: setup flow + dashboard
- `src/engines/` — MetricsEngine.js, CashFlowEngine.js, YNABClient.js (copied from clarity-hub)
- CI job added to `.github/workflows/portfolio-web-build.yml`
- Deployed to https://funded-web.vercel.app

## Key Constraints

- Storage key `chase_hub_ynab_v1` — must never change (existing user data)
- Supabase `app_key = 'ynab'` — must never change (iOS sync)
- YNAB token key `chase_hub_ynab_token` — must never change (shared with clarity-hub)

## Quick-start prompt

```
Read CLAUDE.md and portfolio/funded-web/HANDOFF.md first.
Goal: Work on Funded Web at portfolio/funded-web/.
Run checkpoint before edits; update CHANGELOG / ROADMAP / HANDOFF when done.
```
