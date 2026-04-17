# Shipyard — Handoff

## State

| Field      | Value                                                              |
| ---------- | ------------------------------------------------------------------ |
| Focus      | Phase 1 live                                                       |
| Next       | Set up Supabase RLS + Phase 2 (editable fields + learnings ingestion) |
| Last touch | 2026-04-16                                                         |

## Phase 1 — Complete

- Next.js 15 app scaffolded and deployed to Vercel via GitHub auto-deploy
- Full schema migrated (`supabase/migrations/0001_init.sql`): projects, blockers, scans, wip_decisions, review_cadence, reviews, learnings, themes
- 8 pages built and live: Fleet dashboard, Ship detail, WIP/Drydock gate, Weekly/Monthly/Quarterly review flow, Captain's Log, Charts & Constellations, Fleet Showcase, Harbor Master
- Local scanner CLI (`scripts/scan.ts`) reads ~/Developer/chase/portfolio and upserts to Supabase
- Seed script (`scripts/seed-from-audit.ts`) imported the Apr 15 audit CSV (29 projects)
- 28 additional projects live-scanned and upserted

## Phase 2 — What's Next

1. **Supabase RLS** — lock down all tables; add auth gate (email OTP or Supabase Magic Link)
2. **Editable fields** — inline editing on Ship detail page (status, phase, notes, blockers)
3. **Learnings ingestion** — parse `LEARNINGS.md` from each scanned project and upsert into `learnings` table
4. **WIP enforcement** — wire up `wip_decisions` table to actively block picking a second active project
5. **Review prompts** — surface the 6 shared review prompts dynamically from the review flow
6. **Linear sync** — Harbor Master page: pull open issues from Linear API and map to ships
