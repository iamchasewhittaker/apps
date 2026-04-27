# GMAT Mastery Web

Personal GMAT practice tool. Claude generates multiple-choice questions via tool use, the user answers, then Claude returns a 3-bullet Socratic explanation. Solo project, single user (me).

Stack: Next.js 16.2 (App Router) + React 19 + TypeScript + Tailwind 4 + Framer Motion + `@anthropic-ai/sdk`. Both API routes call `claude-haiku-4-5-20251001` (Haiku is fine — tool use enforces the output schema).

## Quick start

```bash
npm install
# Edit .env.local — replace the mock value with a real key:
#   ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Open http://localhost:3000.

The committed `.env.local` ships with a mock Anthropic key, so both `/api/generate-question` and `/api/generate-explanation` will 500 until a real key is in place.

## Environment

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Used by both API routes. Mock value crashes generation. |
| `NEXT_PUBLIC_SUPABASE_URL` | no | Present in `.env.local` but unused — Supabase isn't wired. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | no | Same — installed dependency, no runtime use. |

## Persistence

localStorage only, key `gmat_mastery_state`. Per-browser, no accounts, no cross-device sync. State is loaded on mount and rewritten on every reducer change in `src/store/useGameState.ts`. Clearing site data resets XP, level, streak, and per-topic performance.

## Status

Stage **Build** per the 6-step playbook (`~/Developer/portfolio/CLAUDE.md`). Active WIP=1 slot as of 2026-04-26. Not deployed. To reach Ship: real Anthropic key, first Vercel deploy, one self-use prep session without daily fixes. See [`CLAUDE.md`](./CLAUDE.md) for the full identity and remaining open work, and [`AGENTS.md`](./AGENTS.md) for the Next 16 gotcha (training-data drift).

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint
