# Funded Web

Standalone YNAB budget dashboard (React CRA) — web companion to **Funded iOS**. Syncs config (mappings, income sources, overrides) via Supabase; live YNAB data is fetched in the browser.

**Live:** local only (Vercel project removed 2026-04-20 — run with `npm start`)

## Docs (read order)

| Doc | Purpose |
|-----|---------|
| [CLAUDE.md](CLAUDE.md) | Structure, conventions, auth, commands |
| [HANDOFF.md](HANDOFF.md) | Current state and session handoff |
| [LEARNINGS.md](LEARNINGS.md) | Gotchas and fixes from real sessions |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [ROADMAP.md](ROADMAP.md) | Planned work |
| [docs/BRANDING.md](docs/BRANDING.md) | Logo / palette |

## Run locally

From the machine’s Developer folder, the repo root is **`chase`** (not `Developer` itself):

```bash
cd ~/Developer/chase/portfolio/funded-web
cp .env.example .env   # REACT_APP_SUPABASE_* + auth canonical vars
npm install
npm start
```

Build:

```bash
npm run build
```

## Monorepo path

Full path: **`~/Developer/chase/portfolio/funded-web`**.  
If you `cd ~/Developer` first, use **`cd chase/portfolio/funded-web`** — not `cd portfolio/...` at the top level.

## Project tracking

[Linear — portfolio / Funded](https://linear.app/whittaker) (search “Funded” or web YNAB as needed).
