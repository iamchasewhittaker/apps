# GMAT Mastery Web — Project Instructions

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


> See also: `/CLAUDE.md` at the monorepo root (`~/Developer/chase`) for portfolio-wide conventions.
> See also: `AGENTS.md` in this folder — **Next 16 has breaking changes** from model training data. Check `node_modules/next/dist/docs/` before writing App Router code.

## App Identity

- **Stage:** Build (per the 6-step MVP framework in `~/Developer/portfolio/CLAUDE.md`)
- **Version:** v0.1 (initial scaffold — 2026-04-21)
- **URL:** not deployed
- **Entry:** `src/app/page.tsx`
- **Storage:** React reducer at `src/store/useGameState.ts` with localStorage persistence (key: `gmat_mastery_state`). Per-browser only — no accounts, no cross-device sync.
- **API routes:**
  - `POST /api/generate-question` — `src/app/api/generate-question/route.ts`
  - `POST /api/generate-explanation` — `src/app/api/generate-explanation/route.ts`
- **LLM model:** `claude-haiku-4-5-20251001` (hard-coded in both routes — Haiku is sufficient given tool use enforces output structure)

## What This App Is

An interactive GMAT practice app. The user picks a section and difficulty; Claude generates a multiple-choice question via tool use (structured output), the user answers, and Claude delivers a Socratic explanation. The end-of-session summary shows score, streak, XP, and per-topic performance. Core gameplay loop is functional; no accounts, no persistence, no deploy.

## Tech Stack

- Next.js 16.2 (App Router) + React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion (screen transitions)
- `@anthropic-ai/sdk` (question + explanation generation with tool use)
- `@supabase/supabase-js` — **installed, not wired.** No auth, no DB.

## Vercel & Supabase

**Vercel:** not yet created. No `vercel.json` / `vercel.ts`. Not connected to GitHub. When shipping, follow the monorepo's standard (see `~/.claude/CLAUDE.md` "Vercel-Git Connection").

**Persistence (decided 2026-04-26):** Session-only via localStorage. State persists per-browser via `gmat_mastery_state` key. No accounts, no cross-device sync, no Supabase wiring. Revisit only if v2 needs cross-device or revenue gates. The `@supabase/supabase-js` dependency stays installed (cheap to leave) but is unused.

## Environment

`.env.local` (gitignored) must provide:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Currently holds a mock value. Both API routes will 500 without a real key.

## File Structure

```
src/
  app/
    layout.tsx              ← root layout (fonts, globals)
    page.tsx                ← shell: screen switcher driven by useGameState
    globals.css             ← Tailwind base
    api/
      generate-question/route.ts     ← Claude tool use → structured MCQ
      generate-explanation/route.ts  ← Claude Socratic explanation
  components/
    LandingScreen.tsx       ← section + difficulty picker
    QuestionScreen.tsx      ← question + choices + timer
    ExplanationScreen.tsx   ← per-question Socratic breakdown
    SummaryScreen.tsx       ← end-of-session recap (score, XP, per-topic)
  store/
    useGameState.ts         ← reducer: question flow, XP, streak, per-topic metrics; persists to localStorage
```

## Open Work (what's needed to reach Ship)

1. Real `ANTHROPIC_API_KEY` in `.env.local` (still mock)
2. First Vercel deploy: `vercel project add` → `vercel link` → `vercel git connect https://github.com/iamchasewhittaker/apps.git` → `vercel env add ANTHROPIC_API_KEY production` → `vercel --prod`
3. First self-use week (Step 5 — Ship): use it for a full prep session without daily fixes

## WIP = 1 Status

This app is the active WIP=1 Build slot as of 2026-04-26. RollerTask V1 was previously the focus and has been parked until GMAT ships. Parent playbook (`~/Developer/portfolio/CLAUDE.md`) reflects the swap.
