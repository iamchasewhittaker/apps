# Shipyard — Roadmap

## Phase 1 — Complete (2026-04-16)

- Next.js 15 app scaffolded and deployed to Vercel via GitHub auto-deploy
- Full schema migrated (`supabase/migrations/0001_init.sql`)
- 8 pages built and live
- Local scanner CLI (`scripts/scan.ts`) scanning and upserting to Supabase
- 29 projects seeded from audit CSV; 28 live-scanned

## Phase 2 — Auth Gate + Editable Fleet (In Progress)

- [x] **Supabase RLS + auth gate** — `proxy.ts` redirects unauthenticated requests to `/login`; only owner email `chase.t.whittaker@gmail.com` can pass the gate. *(Fixed 2026-04-20: renamed export from `proxyConfig` → `config` so the matcher actually registers.)*
- [x] **Login page** — `src/app/login/page.tsx` using `signInWithPassword`. Magic link / OTP abandoned due to shared-Supabase redirect URL headaches.
- [ ] **Editable fields** — inline editing on Ship detail page (status, phase, notes, blockers)
- [ ] **Learnings ingestion** — parse `LEARNINGS.md` from each scanned project and upsert into `learnings` table
- [ ] **WIP enforcement** — wire up `wip_decisions` table to actively block picking a second active project
- [ ] **Review prompts** — surface the 6 shared review prompts dynamically from the review flow
- [ ] **Linear sync** — Harbor Master page: pull open issues from Linear API and map to ships

## Phase 3 — Automation

- [ ] **Auto-scan cron** — nightly scanner run (launchd or GitHub Actions) so the fleet stays fresh without manual `npx tsx scripts/scan.ts`
- [ ] **Drift alerts** — flag projects whose `last_commit_at` exceeds review cadence threshold
- [ ] **Public Fleet Showcase** — carve off `/portfolio` behind a separate public route (no auth gate) for the Fleet Showcase page

## Change Log

| Date | Change |
|------|--------|
| 2026-04-20 | Fixed auth gate (`config` export), switched login to email+password, switched `CLAUDE.md` URL to stable alias |
| 2026-04-18 | Sidebar logo + dynamic favicon |
| 2026-04-16 | Phase 1 shipped |
