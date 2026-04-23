# SESSION_START — GMAT Mastery Web Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — GMAT Mastery Web exists as a functional scaffold, not yet deployed.
**App:** GMAT Mastery Web
**Slug:** gmat-mastery-web
**One-liner:** Interactive GMAT practice app — pick a section and difficulty, Claude generates a structured multiple-choice question via tool use, you answer, and Claude delivers a Socratic explanation; ends with a score/XP/streak summary.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is built; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/gmat-mastery-web`
2. **BRANDING.md** — derive palette, typography, voice from context below
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect actual V1 functional scope; Open Work items go in V2
5. **APP_FLOW.md** — document the question → answer → explanation → summary flow
6. **SESSION_START_gmat-mastery-web.md** — stub only

Output paths: `portfolio/gmat-mastery-web/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1 (initial scaffold — 2026-04-21)
**Stage:** Build — not yet deployed
**URL:** not deployed
**Entry:** `src/app/page.tsx`
**Storage:** in-memory React reducer (`src/store/useGameState.ts`) — state resets on reload. No persistence wired yet.
**Stack:** Next.js 16.2 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Framer Motion + `@anthropic-ai/sdk`
**API routes:**
- `POST /api/generate-question` — Claude tool use → structured MCQ
- `POST /api/generate-explanation` — Claude Socratic explanation
**LLM model:** `claude-3-7-sonnet-20250219` (hard-coded; should be bumped to current Sonnet)

**What this app is:**
An interactive GMAT practice app. The user picks a section and difficulty; Claude generates a multiple-choice question via tool use (structured output), the user answers, and Claude delivers a Socratic explanation. The end-of-session summary shows score, streak, XP, and per-topic performance. Core gameplay loop is functional; no accounts, no persistence, no deploy.

**Screens:**
- LandingScreen — section + difficulty picker
- QuestionScreen — question + choices + timer
- ExplanationScreen — per-question Socratic breakdown
- SummaryScreen — end-of-session recap (score, XP, streak, per-topic)

**State (in-memory only):** question flow, XP, streak, per-topic metrics — all in `useGameState.ts` reducer

**Environment:**
- `.env.local` must provide `ANTHROPIC_API_KEY` — both routes 500 without a real key
- Supabase dependency installed but not wired — treat as future work
- Not connected to GitHub or Vercel yet

**Open work to reach Ship:**
1. Real `ANTHROPIC_API_KEY` in `.env.local`
2. Vercel project + GitHub auto-deploy wired
3. Bump LLM model to current Sonnet in both API routes
4. Decide on persistence (Supabase or explicit session-only)
5. Remove dead `src/shared/sync.js` stub (CRA pattern, not compatible with Next)

---

## App context — README / current status

**Stage:** Build — in-memory, functional gameplay loop works locally.
**Not deployed.** State resets on reload.
**WIP note:** Per the portfolio playbook, WIP limit is one project in Build at a time. This being mid-Build while other projects are active is a known rule tension — not a bug in the app.
**Last touch:** 2026-04-21 (scaffold)
