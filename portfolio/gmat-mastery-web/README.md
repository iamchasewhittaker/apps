# GMAT Mastery Web

Interactive GMAT practice with Claude-generated questions and Socratic explanations. Next.js 16 (App Router) + React 19 + Tailwind 4.

## Quick start

```bash
npm install
# Create .env.local with:
#   ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Both `/api/generate-question` and `/api/generate-explanation` 500 without a real key |

## Status

Stage: **Build**. Not deployed. State is in-memory and resets on reload. See [`CLAUDE.md`](./CLAUDE.md) for the full identity, what's missing for Ship, and a Next 16 gotcha warning (`AGENTS.md`).

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint
