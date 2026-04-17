# Spend Radar (web) — Handoff

## Quick State

| Field | Value |
|---|---|
| **Focus** | CRA scaffold complete. Awaiting CSV_URLS from Spend Radar Sheet + Vercel deploy. |
| **Last touch** | 2026-04-16 — initial scaffold (package.json, public/, src/App.jsx, constants.js, ErrorBoundary.jsx, favicon) |
| **Next** | User: publish Sheet tabs to CSV → paste into `src/constants.js` → deploy to Vercel |
| **URL** | not yet deployed |
| **Storage key** | `chase_spend_radar_web_v1` |

---

## Status

- [x] `package.json` — CRA + lucide-react + React 18
- [x] `public/index.html` — DM Sans preload, `#0b1220` theme color
- [x] `public/manifest.json` — PWA manifest
- [x] `public/favicon.svg` — teal radar-sweep mark
- [x] `src/index.js` — React 18 `createRoot`
- [x] `src/App.jsx` — header, metrics row, subscription card grid by category, cancel candidates, recent receipts table
- [x] `src/constants.js` — palette, style tokens, tiny CSV parser, amount helpers, localStorage cache
- [x] `src/ErrorBoundary.jsx` — standard portfolio boundary
- [x] `CLAUDE.md`, `ROADMAP.md`, `LEARNINGS.md`, `CHANGELOG.md`, `docs/BRANDING.md`
- [ ] `CSV_URLS` pasted into `src/constants.js` (user)
- [ ] `npm install && npm start` verified locally (user)
- [ ] Vercel project + git connection (user)
- [ ] Deployed URL pasted into Spend Radar `DASHBOARD_URL` Script Property (user)

---

## User setup steps

1. In the dedicated "Spend Radar" Sheet: `File → Share → Publish to web` → choose the **Subscriptions** tab → CSV format → copy URL.
2. Repeat for the **Receipts** tab.
3. Paste both URLs into `src/constants.js` → `CSV_URLS.subscriptions` + `CSV_URLS.receipts`.
4. `cd portfolio/spend-radar-web && npm install && npm start` — verify it loads.
5. Deploy (global CLAUDE.md Vercel-Git Connection):
   ```bash
   vercel project add spend-radar-web --scope iamchasewhittakers-projects
   vercel link --project spend-radar-web --scope iamchasewhittakers-projects --yes
   vercel git connect https://github.com/iamchasewhittaker/apps.git --yes
   vercel --prod
   ```
6. Paste final URL into Spend Radar Apps Script `Script Properties → DASHBOARD_URL`.

---

## Verification

| Check | How |
|---|---|
| Loads without error | Open `/`; header + Brand visible |
| Metrics populated | Monthly/Yearly/Active/Lapsed show real numbers |
| Category cards render | Each active category has a band with dot + count + $/mo total |
| Cancel candidates show | If any lapsed/irregular subs exist, red-tinted cards appear |
| Recent receipts table | 30-day window, sortable by Date desc |
| Refresh button | Spinner rotates; fetches both CSVs in parallel |
| Cache | Reload shows data instantly from `localStorage`; then refetches |
