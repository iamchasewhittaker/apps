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
- [x] **Editable fields** — inline editing on Ship detail (status, next_action, blockers). *(Shipped 2026-04-21.)*
- [x] **Decommission Ship workflow** — UI + CLI + API + `src/lib/linear.ts`. Supabase migration 0003 adds `retired_at` + `retire_reason`; apply manually in SQL Editor (endpoint has fallback). *(Shipped 2026-04-21.)*
- [ ] **Learnings ingestion** — parse `LEARNINGS.md` from each scanned project and upsert into `learnings` table
- [ ] **WIP enforcement** — wire up `wip_decisions` table to actively block picking a second active project
- [ ] **Review prompts** — surface the 6 shared review prompts dynamically from the review flow
- [ ] **Linear sync** — Harbor Master page: pull open issues from Linear API and map to ships

## Phase 3 — Automation

- [x] **Auto-scan cron** — `com.chasewhittaker.shipyard-scan` launchd agent runs `scripts/scan-cron.sh` nightly at 3:00 AM local. *(Shipped 2026-04-19.)*
- [x] **Auto-populate themes table** — scanner detects Common Inputs (9 services) + Cross-App Patterns (8 stacks) from each app's `package.json`, `CLAUDE.md`, and `.env.example`; upserts to `themes` table nightly. *(Shipped 2026-04-26.)*
- [ ] **Narrative Threads** — deferred; requires structured format (e.g. `## Narrative` heading in CLAUDE.md) or manual entry UI
- [ ] **Drift alerts** — flag projects whose `last_commit_at` exceeds review cadence threshold
- [ ] **Public Fleet Showcase** — carve off `/portfolio` behind a separate public route (no auth gate) for the Fleet Showcase page

## Change Log

| Date | Change |
|------|--------|
| 2026-04-30 | Sidebar emojis (🚢🔨🏆); WIP page rebuilt with 3-col ShipCard grid + sort; dashboard trimmed to summary + 3 Recently Active cards; ShipCard extracted to shared component |
| 2026-04-30 | Sailboat logo on gold background + full page consistency pass (glass-card tokens across all 25 files, ModeHeading for Settings + Linear, display-font heading on ship detail) |
| 2026-04-26 | Analytics & Themes: heading fixed (mode-aware via `analyticsHeading` label), plain mode is now the default, scanner auto-populates Common Inputs + Cross-App Patterns (15 rows on first run), Portfolio Thesis inline editor |
| 2026-04-21 | Decommission Ship workflow + editable detail fields + clipboard dev link (replaces dead localhost link from 04-20) |
| 2026-04-20 | Local dev + Vercel access links — `local_port` column, scanner auto-detect, Ship detail header + Links section *(localhost link superseded 2026-04-21 — every CRA/Next app defaults to port 3000 so the link never reached the intended project; replaced by clipboard-copy button)* |
| 2026-04-20 | Nautical rebrand — helm SVG logo, 8-token palette, BigShoulders + DM Mono + Instrument Sans |
| 2026-04-19 | Auto-scan cron live — launchd agent runs nightly at 3:00 AM |
| 2026-04-20 | Fixed auth gate (`config` export), switched login to email+password, stable alias in docs |
| 2026-04-18 | Sidebar logo + dynamic favicon |
| 2026-04-16 | Phase 1 shipped |
