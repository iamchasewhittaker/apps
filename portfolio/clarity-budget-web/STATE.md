# State — Clarity Budget Web

> Last updated: 2026-04-29

## Current Phase
v1 Redesign — Steps 1-8 done, Step 9 next

## Status
YNAB-backed STS dashboard deployed at clarity-budget-web.vercel.app. Auth (password + GitHub OAuth), encrypted YNAB credentials, Privacy.com integration, AI auto-categorization, weirdness flags, and payee rename review all shipped. 49/49 vitest tests passing.

## Active Work
Step 8 (Privacy.com connector + card mapping) done locally, commit + push pending. Step 9 (split `HomeDashboard.tsx` into smaller components) is next.

## Blockers
None. `AI_GATEWAY_API_KEY` set in all 3 Vercel envs. Step 8 just needs push to deploy.

## Last Meaningful Activity
2026-04-28 — Step 8 implementation done: `/settings` Privacy connector + card mapping. AI Gateway mode fix (`mode=json`). All tests passing, build clean.

## Next Steps
- Push Step 8 to main and deploy
- Step 9: extract `StsCard`, `ShortfallBanner`, `LastUpdated`, `EmptyState` from `HomeDashboard.tsx`
- Production smoke test for `/categorize` end-to-end flow
