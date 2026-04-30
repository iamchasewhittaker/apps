# Handoff — GMAT Mastery Web

## State

| Field | Value |
|-------|-------|
| Focus | First Vercel deploy + real Anthropic API key |
| Next | `vercel project add gmat-mastery-web` + link + git connect + env add `ANTHROPIC_API_KEY` + `vercel --prod` |
| Last touch | 2026-04-26 — added `vercel.json` to declare Next.js framework; became WIP=1 Build slot |
| Blockers | None |

## Notes
Core gameplay loop is functional but untested with a real API key. Both `/api/generate-question` and `/api/generate-explanation` will 500 with the mock key. localStorage persistence (`gmat_mastery_state`) works for XP, streak, and per-topic metrics. Supabase is installed but not wired. No accounts, no cross-device sync by design (revisit in v2 if needed).
