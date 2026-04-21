# GMAT Mastery Web — Project Instructions

> See also: `/CLAUDE.md` at the monorepo root (`~/Developer/chase`) for portfolio-wide conventions.
> See also: `AGENTS.md` in this folder — **Next 16 has breaking changes** from model training data. Check `node_modules/next/dist/docs/` before writing App Router code.

## App Identity

- **Stage:** Build (per the 6-step MVP framework in `~/Developer/portfolio/CLAUDE.md`)
- **Version:** v0.1 (initial scaffold — 2026-04-21)
- **URL:** not deployed
- **Entry:** `src/app/page.tsx`
- **Storage:** in-memory React reducer at `src/store/useGameState.ts` — state resets on reload. No persistence wired yet.
- **API routes:**
  - `POST /api/generate-question` — `src/app/api/generate-question/route.ts`
  - `POST /api/generate-explanation` — `src/app/api/generate-explanation/route.ts`
- **LLM model:** `claude-3-7-sonnet-20250219` (hard-coded in both routes; should be bumped to current Sonnet — tracked as follow-up)

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

**Supabase:** dependency installed, not used. If/when persistence is added, follow the monorepo pattern — the app-agnostic sync layer lives at `~/Developer/chase/portfolio/shared/sync.js`. A copy at `src/shared/sync.js` was dropped in but **does not currently work** here: it imports `./auth` (not present) and uses `REACT_APP_*` env vars (CRA pattern, not Next). Treat as dead code until wired properly — Next routes should use `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` via a server-side client.

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
    useGameState.ts         ← reducer: question flow, XP, streak, per-topic metrics
  shared/
    sync.js                 ← copied from monorepo, NOT wired (see note above)
```

## Open Work (what's needed to reach Ship)

1. Real `ANTHROPIC_API_KEY` in `.env.local`
2. `vercel.ts` + `vercel git connect` to `iamchasewhittaker/apps`
3. Bump `claude-3-7-sonnet-20250219` → current Sonnet in both API routes
4. Decide on persistence: either wire Supabase properly (delete the stub `sync.js`, add Next-compatible client) or explicitly ship as session-only
5. Remove or fix the dead `src/shared/sync.js` stub
6. First self-use week (Step 5 — Ship): use it for a full prep session without breaking

## WIP = 1 Note

Per the parent playbook (`~/Developer/portfolio/CLAUDE.md`), the stated focus is **RollerTask V1** and the WIP limit is one project in Build at a time. This app being mid-Build is a rule violation the user needs to resolve explicitly — not a bug in this app. See `~/Developer/portfolio/audits/gmat-mastery-web.md` for the full snapshot.
