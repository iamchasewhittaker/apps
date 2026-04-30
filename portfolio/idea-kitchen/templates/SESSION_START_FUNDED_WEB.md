# Session Start — Funded Web (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-13** — v0.1 scaffold created via `scripts/new-app`
- **2026-04-13** — v1.0 launched: full app split from clarity-hub with single-blob state, YNAB dashboard (4-step setup, safe-to-spend, bills, income gap, cash flow, fund write-back), auth gate (email OTP), Supabase sync
- **2026-04-13** — Logo standardization: `logo.svg` (YNAB green / CLARITY white), favicon, PNGs, manifest
- **2026-04-14** — Shared auth bootstrap (`src/shared/auth.js`), refactored sync, auth diagnostics, favicon white-corner fix
- **2026-04-14** — CI lockfile fix: pinned `typescript@4.9.5` to match `react-scripts@5` peer
- **2026-04-15** — Income setup (YNAB hint banner + RTA fallbacks) and Categorization Review (uncategorized outflows, suggestions, triage fields, YNAB memo PATCH, `categoryOverrides` + `transactionMetadata` in blob)
- **2026-04-20** — Renamed Conto to Funded; Vercel project removed (local-only); Google OAuth added

---

## Still needs action

- Vercel project removed 2026-04-20; app runs locally via `npm start`. To redeploy: `vercel project add funded-web` + `vercel link` + `vercel git connect` + `scripts/vercel-add-env` + `vercel --prod`
- Some PATCH error paths use modal-only error display (should surface inline everywhere)

---

## Funded Web state at a glance

| Field | Value |
|-------|-------|
| Version | v1.0+ |
| URL | local only (Vercel project removed 2026-04-20) |
| Storage key | `chase_hub_ynab_v1` + `chase_hub_ynab_token` (YNAB token, never synced) |
| Stack | React (CRA), inline styles, localStorage + Supabase blob sync (`app_key: ynab`), YNAB REST API |
| Linear | [Linear](https://linear.app/whittaker/project/funded-web-f17432cff6d6) |
| Last touch | 2026-04-20 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/funded-web/CLAUDE.md | App-level instructions, blob shape, auth details |
| portfolio/funded-web/HANDOFF.md | Session state + deploy instructions |
| portfolio/funded-web/src/App.jsx | Shell: auth gate, single-blob state, settings modal |
| portfolio/funded-web/src/tabs/YnabTab.jsx | Full YNAB dashboard: setup flow, safe-to-spend, bills, categorization review |
| portfolio/funded-web/src/engines/YNABClient.js | YNAB fetch + PATCH (transactions with optional memo) |
| portfolio/funded-web/src/engines/MetricsEngine.js | Safe-to-spend and bills balance calculations |

---

## Suggested next actions (pick one)

1. Add PWA offline banner for stale YNAB data (iOS has a 24h stale pattern to match)
2. Surface PATCH errors inline everywhere (some paths still use modal-only display)
3. Re-deploy to Vercel for remote access
