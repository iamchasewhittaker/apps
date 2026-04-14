# Handoff — RollerTask Tycoon Web

## State

| Field | Value |
|-------|-------|
| **Focus** | Stable v1.0 — fully functional task/points tracker |
| **Next** | Ship + monitor; potential improvements: task categories filter, ledger pagination |
| **Last touch** | 2026-04-13 — created as standalone app split from clarity-hub; deployed to Vercel |
| **Status** | ✅ Deployed · https://rollertask-tycoon-web.vercel.app |

## What Shipped (Session 1 — 2026-04-13)

- Full app split from `clarity-hub` — standalone CRA with single-blob state
- `src/theme.js` — T palette, `chase_hub_rollertask_v1` storage key, `DEFAULT_ROLLERTASK`
- `src/sync.js` — `pushRollertask` / `pullRollertask` using `app_key = 'rollertask'`
- `src/App.jsx` — auth gate (email OTP), settings modal (sign out), gear icon nav
- `src/tabs/RollerTaskTab.jsx` — full gamified task tracker (copied from clarity-hub)
- CI job added to `.github/workflows/portfolio-web-build.yml`
- Deployed to https://rollertask-tycoon-web.vercel.app

## Key Constraints

- Storage key `chase_hub_rollertask_v1` — must never change (existing user data)
- Supabase `app_key = 'rollertask'` — must never change (iOS sync)

## Quick-start prompt

```
Read CLAUDE.md and portfolio/rollertask-tycoon-web/HANDOFF.md first.
Goal: Work on RollerTask Tycoon Web at portfolio/rollertask-tycoon-web/.
Run checkpoint before edits; update CHANGELOG / ROADMAP / HANDOFF when done.
```
