# Session Start — GMAT Mastery Web (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **v0.1 (2026-04-21)** — Initial scaffold: Next.js 16.2 + React 19 + TypeScript + Tailwind 4 + Framer Motion. Claude API question generation via tool use (structured MCQ output). Socratic explanation engine. 4-screen flow: Landing, Question, Explanation, Summary. Game state reducer with localStorage persistence (XP, streak, level, per-topic metrics).
- **2026-04-26** — Added `vercel.json` to declare Next.js framework for Vercel deployment. Became active WIP=1 Build slot (replacing RollerTask). Persistence decision: session-only via localStorage, no Supabase.

---

## Still needs action

- Real `ANTHROPIC_API_KEY` in `.env.local` (currently mock; both API routes 500 without it)
- First Vercel deploy: `vercel project add gmat-mastery-web` + link + git connect + env add `ANTHROPIC_API_KEY` + `vercel --prod`
- Complete one full self-use prep session without daily fixes (Step 5: Ship)

---

## GMAT Mastery Web state at a glance

| Field | Value |
|-------|-------|
| Version | v0.1 |
| URL | not deployed |
| Storage key | `gmat_mastery_state` |
| Stack | Next.js 16.2 (App Router) + React 19 + TypeScript + Tailwind 4 + Framer Motion + `@anthropic-ai/sdk` (claude-haiku-4-5-20251001) |
| Linear | [GMAT Mastery Web](https://linear.app/whittaker/project/gmat-mastery-web-7599a39fd355) |
| Last touch | 2026-04-26 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/gmat-mastery-web/CLAUDE.md | App-level instructions |
| portfolio/gmat-mastery-web/HANDOFF.md | Session state + notes |
| portfolio/gmat-mastery-web/src/app/page.tsx | Shell: screen switcher driven by useGameState |
| portfolio/gmat-mastery-web/src/store/useGameState.ts | Reducer: question flow, XP, streak, per-topic metrics; localStorage persistence |
| portfolio/gmat-mastery-web/src/app/api/generate-question/route.ts | Claude tool use producing structured MCQ |
| portfolio/gmat-mastery-web/src/app/api/generate-explanation/route.ts | Claude Socratic explanation |
| portfolio/gmat-mastery-web/src/components/LandingScreen.tsx | Section + difficulty picker (entry point) |

---

## Suggested next actions (pick one)

1. Add a real `ANTHROPIC_API_KEY` to `.env.local` and run first end-to-end question generation locally
2. First Vercel deploy: create project, link, git connect, add env var, deploy to production
3. Add Lemon Squeezy payment integration and rate limiting (100 questions/day)
