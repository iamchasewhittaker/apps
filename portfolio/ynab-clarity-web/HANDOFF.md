# Handoff — YNAB Clarity Web

## State

| Field | Value |
|-------|-------|
| **Focus** | Stable v1.0 — fully functional YNAB dashboard |
| **Next** | Ship + monitor; potential improvements: save-to-spend notifications, multi-budget support |
| **Last touch** | 2026-04-13 — created as standalone app split from clarity-hub; deployed to Vercel |
| **Status** | ✅ Deployed · https://ynab-clarity-web.vercel.app |

## What Shipped (Session 1 — 2026-04-13)

- Full app split from `clarity-hub` — standalone CRA with single-blob state
- `src/theme.js` — T palette, `chase_hub_ynab_v1` storage key, YNAB token helpers, format helpers
- `src/sync.js` — `pushYnab` / `pullYnab` using `app_key = 'ynab'`
- `src/App.jsx` — auth gate (email OTP), settings modal (token update + re-run setup + sign out), gear icon nav
- `src/tabs/YnabTab.jsx` — full YNAB tab: setup flow + dashboard
- `src/engines/` — MetricsEngine.js, CashFlowEngine.js, YNABClient.js (copied from clarity-hub)
- CI job added to `.github/workflows/portfolio-web-build.yml`
- Deployed to https://ynab-clarity-web.vercel.app

## Key Constraints

- Storage key `chase_hub_ynab_v1` — must never change (existing user data)
- Supabase `app_key = 'ynab'` — must never change (iOS sync)
- YNAB token key `chase_hub_ynab_token` — must never change (shared with clarity-hub)

## Quick-start prompt

```
Read CLAUDE.md and portfolio/ynab-clarity-web/HANDOFF.md first.
Goal: Work on YNAB Clarity Web at portfolio/ynab-clarity-web/.
Run checkpoint before edits; update CHANGELOG / ROADMAP / HANDOFF when done.
```
