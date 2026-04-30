# State — GMAT Mastery Web

> Last updated: 2026-04-29

## Current Phase
Build (Step 4 of 6-step MVP framework). Active WIP=1 slot.

## Status
Core gameplay loop functional: section/difficulty picker, Claude-generated MCQs via tool use, Socratic explanations, end-of-session summary with XP/streak/per-topic metrics. Not deployed. Anthropic API key is still mock.

## Active Work
None in progress. Next work is deployment and real API key setup.

## Blockers
Real `ANTHROPIC_API_KEY` needed in `.env.local` before generation works. No Vercel project created yet.

## Last Meaningful Activity
2026-04-26 — Added `vercel.json` to declare Next.js framework; became active WIP=1 Build slot (replacing RollerTask).

## Next Steps
- Add real `ANTHROPIC_API_KEY` to `.env.local`
- First Vercel deploy: `vercel project add` + `vercel link` + `vercel git connect` + env setup + `vercel --prod`
- Complete one full self-use prep session without daily fixes (Step 5: Ship)
