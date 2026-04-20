# Shipyard — Handoff

## State

| Field      | Value                                                                 |
| ---------- | --------------------------------------------------------------------- |
| Focus      | Fleet dashboard working end-to-end (auth + data + render); auto-scan cron live |
| Next       | Editable Ship detail fields · fix `learnings` unique constraint so ingestion can enable |
| Last touch | 2026-04-19                                                            |

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

1. [x] **Auto-scan cron** — `com.chasewhittaker.shipyard-scan` launchd agent runs `scripts/scan-cron.sh` nightly at 3:00 AM local. Logs at `~/Library/Logs/shipyard-scan/`.
2. Editable Ship detail fields
3. Learnings ingestion (blocked on `learnings` unique constraint fix)

## Deploy

```bash
cd ~/Developer/chase/portfolio/shipyard
vercel --prod --archive=tgz
```

Stable alias updates automatically on each production deploy.

## Auto-Scan Cron

Schedule: **3:00 AM local, daily.** If the Mac is asleep at 3am, launchd fires on next wake.

Full walkthrough (trigger on demand, watch logs, change the schedule, troubleshoot): **[docs/AUTO_SCAN.md](docs/AUTO_SCAN.md)**.

Quick commands:

```bash
launchctl list | grep shipyard-scan              # status
launchctl start com.chasewhittaker.shipyard-scan # run now
tail -f ~/Library/Logs/shipyard-scan/scan.log    # watch logs
```
