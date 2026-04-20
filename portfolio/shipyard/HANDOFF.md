# Shipyard — Handoff

## State

| Field      | Value                                                                 |
| ---------- | --------------------------------------------------------------------- |
| Focus      | Fleet dashboard working end-to-end (auth + data + render)             |
| Next       | Run scanner regularly; set up auto-scan cron (nightly launchd job)   |
| Last touch | 2026-04-20                                                            |

## Production URL

**Stable alias (always use this):** https://shipyard-iamchasewhittakers-projects.vercel.app

> Never link hash-specific `*-abc123.vercel.app` URLs in docs — they are immutable snapshots and will go stale the next deploy.

## Phase 1 — Complete

- Next.js 15 app scaffolded and deployed to Vercel via GitHub auto-deploy
- Full schema migrated (`supabase/migrations/0001_init.sql`): projects, blockers, scans, wip_decisions, review_cadence, reviews, learnings, themes
- 8 pages built and live: Fleet dashboard, Ship detail, WIP/Drydock gate, Weekly/Monthly/Quarterly review flow, Captain's Log, Charts & Constellations, Fleet Showcase, Harbor Master
- Local scanner CLI (`scripts/scan.ts`) reads ~/Developer/chase/portfolio and upserts to Supabase
- Seed script (`scripts/seed-from-audit.ts`) imported the Apr 15 audit CSV (29 projects)
- 28 additional projects live-scanned and upserted

## Phase 2 — In Progress

- [x] **Supabase RLS + auth gate** — `proxy.ts` with owner-email check; fixed 2026-04-20 (the `config` export name bug)
- [x] **Login page** — email + password via `signInWithPassword`; owner user seeded in Supabase Auth dashboard
- [ ] Editable fields on Ship detail
- [ ] Learnings ingestion from each project's `LEARNINGS.md`
- [ ] WIP enforcement via `wip_decisions`
- [ ] Dynamic review prompts
- [ ] Linear Harbor Master sync

## Phase 3 — Next Up

1. **Auto-scan cron** — nightly run so fleet data never goes stale (`launchd` plist or GitHub Actions)
2. Editable Ship detail fields
3. Learnings ingestion

## Deploy

```bash
cd ~/Developer/chase/portfolio/shipyard
vercel --prod --archive=tgz
```

Stable alias updates automatically on each production deploy.
