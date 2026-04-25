# Copy-Paste Prompt for Next Chat

> Open a fresh Claude Code session **with `cwd = ~/Developer/chase`** (the monorepo root, not `portfolio/unnamed/`) so the deploy commands resolve relative to the repo's `scripts/`. Then paste everything below the line.

---

Read these in order, then continue:

1. `CLAUDE.md` (repo root) — portfolio conventions, especially the **Vercel-Git Connection** section
2. `portfolio/unnamed/CLAUDE.md` — Unnamed app rules (4 lanes, anti-features, Phase 1 7-day rule)
3. `portfolio/unnamed/HANDOFF.md` — current State table

## Context

I just finished a web/iOS parity audit on Unnamed. Three divergences were fixed locally on 2026-04-24:

1. Sort flow gained a Skip button.
2. `skipItem` in `src/lib/store.ts` rewritten to cycle the item to the end of `state.items` (was marking `status: "skipped"`).
3. FocusView in `src/app/today/page.tsx` rewritten to read `state.items` directly (was `lanes.flatMap(...)` which broke the visible Skip cycle).

All 5 flows (capture, sort, lock, focus, check) verified end-to-end in the dev preview. `pnpm build` clean. Source edits are committed (or about to be — check `git log -3 -- portfolio/unnamed/`).

**The only thing left is Vercel deploy.** Phase 1 is localStorage-only — no env vars needed.

## What to do

From `~/Developer/chase`, do these in order:

1. **Build sanity check** — confirm the build still passes:
   ```
   cd portfolio/unnamed && pnpm install && pnpm build
   ```
2. **Create Vercel project** (skip if it already exists):
   ```
   vercel project add unnamed --scope iamchasewhittakers-projects
   ```
3. **Link the local folder to the project**:
   ```
   vercel link --project unnamed --scope iamchasewhittakers-projects --yes
   ```
4. **Connect GitHub for auto-deploy** (idempotent — safe to re-run):
   ```
   vercel git connect https://github.com/iamchasewhittaker/apps.git --yes
   ```
5. **No env vars needed** — Phase 1 is localStorage-only. Skip `scripts/vercel-add-env`.
6. **Deploy to production**:
   ```
   vercel --prod
   ```
   Capture the production URL from the output.
7. **Smoke-test the URL** using preview tools (no manual browser checks):
   - Visit the URL with `preview_start`.
   - `/manifest.json` returns 200.
   - `/icon-192.png` and `/icon-512.png` return 200 (these may not exist yet — flag if missing).
   - Capture → Sort (Skip cycles, then assign) → Today (lock 2 lanes) → Focus (Skip cycles, Done all) → Check (Yes/Yes → "Solid day." ▲).
   - localStorage persists after a reload.
8. **Verify Git connection**:
   ```
   scripts/vercel-check-git
   ```
   Confirm `unnamed` is listed as connected.

## After deploy succeeds

Per repo-root `CLAUDE.md` "Documentation Auto-Update Rule":

1. **Update repo-root `CLAUDE.md`** — Portfolio Overview row for "Unnamed (web)": replace `local (deploy pending)` with the actual Vercel URL; bump status note to remove "Vercel deploy queued" and add "✅ deployed".
2. **Update `portfolio/unnamed/CHANGELOG.md`** — under `## [Unreleased]`, add a "Deployed — Web (2026-04-25)" line with the production URL.
3. **Update `portfolio/unnamed/HANDOFF.md`** — State table: Focus = "Web v0.1 deployed; 7-day usage clock running on iOS + web." Last touch = 2026-04-25. Next = "Use both daily for 7 days; no new features."
4. **Update `portfolio/unnamed/ROADMAP.md`** — Change Log row for the deploy.
5. **Update `portfolio/unnamed/LEARNINGS.md`** — append anything notable from the deploy (build quirks, manifest validation, etc.).
6. **Update repo-root `ROADMAP.md`** — Change Log row for the deploy.
7. **Shipyard sync** — `cd portfolio/shipyard && npm run sync:projects` so the fleet command center reflects the new URL.
8. **Run `checkpoint`** — single command, saves a clean rollback point.
9. **Commit the doc updates** with a message like `docs(unnamed): deploy to Vercel + sync portfolio docs`.

## Don't add features

Phase 1 rule: no new features until I've used the app for 7 consecutive days. If something seems "missing" (PWA icons at 192/512, history view, Supabase sync), note it in `ROADMAP.md` under Phase 2 — don't build it.

If the build fails or anything is unexpected, stop and surface it before continuing.
