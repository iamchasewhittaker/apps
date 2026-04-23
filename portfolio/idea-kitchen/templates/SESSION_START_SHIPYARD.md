# SESSION_START — Shipyard Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Shipyard exists and is deployed.
**App:** Shipyard
**Slug:** shipyard
**One-liner:** Fleet command center for Chase's app portfolio — a local CLI scanner upserts metadata into Supabase, and a deployed Next.js dashboard surfaces project health, WIP queue, reviews, learnings, and thematic analysis.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is live and Phase 2 is in progress.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/shipyard` (yes, it renders its own card)
2. **BRANDING.md** — Nautical rebrand, deep navy palette, Big Shoulders Display (see Brand System below)
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect Phase 1 (complete) + Phase 2 (in progress); Phase 3 in V2
5. **APP_FLOW.md** — document the Fleet dashboard → Ship detail → WIP queue flow
6. **SESSION_START_shipyard.md** — stub only

Output paths: `portfolio/shipyard/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Status:** Phase 2 in progress — auth gate + data live; 48 projects synced
**URL:** https://shipyard-iamchasewhittakers-projects.vercel.app
**Entry:** `src/app/page.tsx`
**Stack:** Next.js 16.2 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Supabase + Vercel
**Deploy:** GitHub auto-deploy on push to `main` (use `git push`, not `vercel --prod`)

**What this app is:**
Fleet command center for Chase's app portfolio. A local CLI scanner (`scripts/scan.ts`) reads `~/Developer/chase/portfolio/**`, extracts project metadata, and upserts into Supabase. The Next.js dashboard (deployed to Vercel) reads from Supabase and renders project health, compliance scores, MVP steps, a WIP priority queue, weekly reviews, a learnings log, and thematic analysis.

```
Mac (local) → scripts/scan.ts → Supabase ← Next.js (Vercel)
```

**Auto-scan cron:** `com.chasewhittaker.shipyard-scan` launchd agent runs `scripts/scan-cron.sh` nightly at 3:00 AM.

**8 pages:**
- Fleet dashboard (main) — project cards with status, compliance, WIP banner
- Ship detail (`/ship/[slug]`) — editable status, next action, blockers, decommission
- Drydock Gate (`/wip`) — full WIP queue + drag-to-reorder
- Port Inspection (`/review`) — weekly review form
- Captain's Log (`/learnings`) — learnings aggregated from all apps
- Charts & Constellations (`/themes`) — thematic analysis
- Fleet Showcase (`/portfolio`) — public portfolio view
- Harbor Master (`/linear`) — Linear sync (Phase 2)

**Brand system (Nautical rebrand · 2026-04-19):**
- Background `#07101E`, surface `#0C1A34`, gold accent `#D7AA3A`, steel `#4A90DE`, sail cream text `#F2EEE6`
- Display: Big Shoulders Display Bold; Labels/mono: DM Mono Regular; Body: Instrument Sans
- Logo: ship's helm (8 spokes, 4 cardinal handles, 4 steel dots) — `LogoIcon.tsx`
- Nautical ↔ plain label toggle: Projects/Ships, Dashboard/Fleet, Learnings/Captain's Log, etc.

**Nautical theme labels (important for SHOWCASE copy):**
- Projects → Ships · Build → Under Construction · Launch → Launched · Paused → In Drydock
- Dashboard → Fleet · Learnings → Captain's Log · Themes → Charts & Constellations
- Linear → Harbor Master · Portfolio → Fleet Showcase · Review → Port Inspection

**Key commands:**
```
npm run dev                  # Local dev (port 3000)
npm run sync:projects        # Sync portfolio metadata from root CLAUDE.md
npx tsx scripts/scan.ts      # Manual scan → Supabase
npm run smoke                # Route smoke test
```

---

## App context — HANDOFF.md

**Version:** v0.1
**Status:** Phase 2 in progress — auth gate + data live; 48 projects synced
**Last touch:** 2026-04-21

**Phase 1 complete:**
- Next.js app scaffolded + deployed via GitHub auto-deploy
- Full schema migrated (`0001_init.sql`): projects, blockers, scans, wip_decisions, reviews, learnings, themes
- 8 pages built and live
- Local scanner CLI + seed script (29 + 28 additional projects live-scanned)

**Phase 2 in progress:**
- ✅ Supabase RLS + auth gate
- ✅ Login page (email + password)
- ✅ Editable fields on Ship detail (status, next_action, blockers)
- ✅ Decommission Ship workflow (UI + CLI + API + Linear helper)
- ✅ Auto-scan cron (nightly launchd)
- ⬜ Learnings ingestion from LEARNINGS.md files
- ⬜ WIP enforcement via wip_decisions
- ⬜ Linear Harbor Master sync

**Next:** Apply `0003_add_retirement.sql` manually in Supabase SQL Editor · fix learnings unique constraint · Linear sync.
