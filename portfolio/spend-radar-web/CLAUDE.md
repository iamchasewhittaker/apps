# Spend Radar (web) — Claude Instructions

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


> Read-only dashboard for the Spend Radar Google Sheet.
> CRA + React 18 + inline styles. No auth, no Supabase.
> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App identity

| Field | Value |
|-------|-------|
| **Version** | v0.1 |
| **Storage key** | `chase_spend_radar_web_v1` (localStorage — cached CSV blob + `_syncAt`) |
| **URL** | TBD (deploy to Vercel after Phase E user setup) |
| **Entry** | `src/App.jsx` |
| **Branding** | [`../spend-radar/docs/BRANDING.md`](../spend-radar/docs/BRANDING.md) — shared teal/cyan identity |

## Purpose

A lightweight read-only dashboard for Spend Radar's Google Sheet output:
- **Monthly / yearly / active / lapsed** metrics at the top
- **Subscriptions by Category** card grid
- **Cancel candidates** — Lapsed + Irregular cadences, red-tinted
- **Recent receipts (30d)** — table from the Sheet's `Receipts` tab

## What This App Is

A lightweight read-only React dashboard that fetches Spend Radar's Google Sheet CSV exports and surfaces monthly/yearly spend totals, a subscription grid by category, and lapsed or irregular charges flagged as cancel candidates. No auth, no Supabase — the Sheet is the source of truth, cached locally for offline viewing.

## Data flow

```
Google Sheet (dedicated "Spend Radar" sheet)
  ├── Subscriptions tab  → Publish to web (CSV) → CSV_URLS.subscriptions
  └── Receipts tab       → Publish to web (CSV) → CSV_URLS.receipts

App loads → reads localStorage cache → fetches CSVs → updates view + cache
```

No Supabase. No server component. The Sheet is the source of truth.

## File layout

```
package.json         ← CRA (react-scripts 5.0.1) + lucide-react
public/
  index.html
  manifest.json
  favicon.svg        ← teal/cyan radar mark
src/
  index.js
  App.jsx            ← everything: header, metrics, category grids, receipts table
  constants.js       ← CSV_URLS, palette, styles, CSV parser, cache helpers
  ErrorBoundary.jsx  ← standard portfolio boundary
CLAUDE.md, HANDOFF.md, LEARNINGS.md, ROADMAP.md, CHANGELOG.md
docs/BRANDING.md     ← pointer back to spend-radar/docs/BRANDING.md (single source)
```

## Setup after code lands

1. In the Sheet, **File → Share → Publish to web** → choose each tab individually, format **Comma-separated values (.csv)**. Copy both URLs.
2. Paste into `src/constants.js`:
   ```js
   export const CSV_URLS = {
     subscriptions: "https://docs.google.com/.../pub?gid=...&single=true&output=csv",
     receipts:      "https://docs.google.com/.../pub?gid=...&single=true&output=csv",
   };
   ```
3. `npm install && npm start` — verify it loads locally.
4. Deploy (global CLAUDE.md Vercel-Git Connection steps):
   ```bash
   vercel project add spend-radar-web --scope iamchasewhittakers-projects
   vercel link --project spend-radar-web --scope iamchasewhittakers-projects --yes
   vercel git connect https://github.com/iamchasewhittaker/apps.git --yes
   vercel --prod
   ```
5. Paste the deployed URL back into Spend Radar Script Properties `DASHBOARD_URL` so the Sheet's `Open Dashboard` menu item works.

## Constraints

- Preserve the dark palette (`#0b1220` base, `#14b8a6`/`#06b6d4` accents) — see `../spend-radar/docs/BRANDING.md`
- No TypeScript, no component libs, no Tailwind — inline styles via `s` in `constants.js`
- No Supabase — the Sheet's published CSV is the whole data path
- `parseCSV` is a ~30-line local parser; do not swap in PapaParse
- `CSV_URLS` must stay empty in committed code — fill in once per deployment, do not commit real URLs if the Sheet contains sensitive data (global CLAUDE.md sensitive-data rules apply)

## Related

- **`../spend-radar/`** — Apps Script backend that writes the Sheet tabs
- **`../knowledge-base/`** — reference implementation for dark-palette CRA dashboard layout
