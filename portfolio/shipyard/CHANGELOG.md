# Changelog

## [Unreleased]

### Added — 2026-04-19 (auto-scan cron)
- **Nightly scanner via launchd.** New `scripts/scan-cron.sh` wrapper invoked by `~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist` at 3:00 AM local daily. Logs to `~/Library/Logs/shipyard-scan/scan.{log,err}`. Fleet data stays fresh without manual `npx tsx scripts/scan.ts` runs.
- First cron-triggered scan: 36 projects upserted in 10.5s, 0 errors.
- **Known pre-existing bug surfaced:** `learnings` upsert fails with "no unique or exclusion constraint matching the ON CONFLICT specification" — the scanner expects a `(project_slug, source, raw_source_ref)` unique constraint that the schema doesn't have. Projects still upsert cleanly; learnings ingestion remains an open Phase 2 item.

### Fixed — 2026-04-20 (auth / login debugging session)
- **Auth gate now actually runs.** `proxy.ts` was exporting `proxyConfig` instead of `config` — Next.js 16 requires `export const config` for the matcher to register, so the middleware was silently disabled. Renamed export to `config`, gate now intercepts every request as intended.
- **Empty dashboard root cause.** The deployed URL tracked in `CLAUDE.md` was an immutable 3-day-old pre-Phase-2 hash URL. Switched to the stable project alias `shipyard-iamchasewhittakers-projects.vercel.app`. The `projects` table had all 43 rows the whole time — the problem was never data, always auth + a stale URL.
- **Login swapped to email + password.** Magic-link / OTP flow was brittle on the shared Supabase project (`unqtnnxlltiadzbqpyhh`): redirect-URL whitelist conflicts across every portfolio app, and the email template was OTP-only. Replaced `src/app/login/page.tsx` with a plain `signInWithPassword` form. Owner user created manually in the Supabase Auth dashboard.
- Deployed to production alias 3x via `vercel --prod --archive=tgz`.

### Changed
- Sidebar logo replaced: anchor emoji → `LogoIcon` component (SY monogram, nautical blue `#1e3a5f`, P6 style)
- Added `src/components/LogoIcon.tsx` with sm/md/lg size variants
- Added `src/app/icon.tsx` dynamic favicon (32×32 nautical blue SY badge)

## [0.1.0] — 2026-04-16

Initial release.

- Next.js 15 (App Router) + TypeScript + Tailwind CSS scaffold
- Full Supabase schema: projects, blockers, scans, wip_decisions, review_cadence, reviews, learnings, themes
- 8 pages: Fleet dashboard, Ship detail, WIP/Drydock gate, Review flow, Captain's Log, Charts & Constellations, Fleet Showcase, Harbor Master
- Local scanner CLI (`scripts/scan.ts`) — scans ~/Developer/chase/portfolio and upserts to Supabase
- Seed script (`scripts/seed-from-audit.ts`) — one-time import from Apr 15 audit CSV
- 29 projects seeded from audit CSV; 28 live-scanned into Supabase
- Deployed to Vercel via GitHub auto-deploy (monorepo rootDirectory = portfolio/shipyard)
