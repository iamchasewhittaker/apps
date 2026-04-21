# Changelog

## [Unreleased]

### Fixed — 2026-04-20 (RSC boundary + smoke test)
- **`/portfolio` 500 fix.** `ShowcaseCard` and `LinkChip` were inline in the async Server Component `portfolio/page.tsx`. `LinkChip` had `onClick`, which RSC can't serialize — every request to `/portfolio` returned 500 in prod. Extracted both into `src/app/portfolio/ShowcaseCard.tsx` with `'use client'`.
- **Route smoke test.** Added `scripts/smoke.ts` (`npm run smoke`). Auto-discovers all routes under `src/app/**`, resolves `[slug]` from Supabase, curls each, exits 1 on any non-2xx. Use before `git push`; `BASE_URL=https://...` targets prod.

### Added — 2026-04-20 (Polish pass — all 7 pieces)
- **Contrast fix.** Lifted `--dim` (#346090 → #7AA6D6) and `--dimmer` (#141A4C → #2A3A7A) so nav text is legible against dark surface; grid stroke updated to rgba(122,166,214,0.18).
- **Gold nav separators.** `/` dividers between nav items changed from `text-steel` → `text-gold`.
- **Theme toggle (nautical ↔ regular labels).** `src/lib/labels.ts` central mapping, `src/lib/theme-mode.ts` hook, `ModeProvider` context, `/settings` page. Nav items, section headings, and MVP step labels all use `useLabel()`. Persists in `localStorage` (`shipyard_theme_mode`).
- **Fleet Showcase rebuild.** Filter changed from `mvp_step ≥ 5 + has_live_url` to `status != archived`. All ~38 apps visible. Cards show category pill, tagline, JTBD, tech pills, and Live/GitHub/Linear chips. iOS apps show "Local Xcode" badge. Each card links to `/portfolio/[slug]`.
- **Per-app design detail page.** `/portfolio/[slug]` server page: hero with icon (from `public/branding/`), tagline, links; About panel with category + full summary; Design System panel with palette swatches + font chips; Tech Details grid.
- **`build-branding.ts` prebuild script.** Walks `portfolio/*/docs/BRANDING.md`; extracts hex colors + known font families; copies AppIcon to `public/branding/<slug>/icon.png`; writes `src/data/branding.json`. Runs as `npm run build:branding`.
- **Drydock Gate — full queue + manual ranking.** Removed `mvp_step_actual = 4` filter; shows all active/stalled apps. Sort dropdown (Priority / Last Updated / MVP Step / Name) persists to localStorage. Active Focus ship pinned at top. `@dnd-kit` drag-to-reorder in Priority mode writes `priority_rank` via server action. `QueueList.tsx` + `QueueRow.tsx` client components; `actions.ts` server actions (`updateRanks`, `seedRanksByCommit`).
- **Category + tagline + summary per app.** Supabase migration adds three columns; sync script reads CLAUDE.md metadata table + `## What This App Is` from each app's CLAUDE.md. All 38 rows synced with category, tagline, summary, github_url, linear_project_url, live_url.
- **`## What This App Is` sections.** Added to all 33 portfolio app CLAUDE.md files.
- **`scripts/sync-projects.ts`.** Parses `### Portfolio metadata (Shipyard sync)` table from root CLAUDE.md; matches rows by name or derived slug (`SLUG_OVERRIDES` map for edge cases); upserts category, tagline, github_url, linear_project_url, summary, live_url into Supabase.

### Changed — 2026-04-20 (nautical rebrand)
- **Full brand system.** Replaced transitional palette + SY monogram with canonical 8-token set: bg `#07101E`, surface `#0C1A34`, white `#F2EEE6`, steel `#4A90DE`, gold `#D7AA3A`, dim `#346090`, dimmer `#141A4C`, ghost `#0D1A34`.
- **Typography.** Swapped Geist/Geist Mono for BigShoulders Bold (display), DM Mono Regular (labels), Instrument Sans Regular/Bold (body) via `next/font/google`.
- **Helm logo.** `src/components/LogoIcon.tsx` rewritten as inline SVG ship's helm (8 spokes, 4 cardinal handles, 4 steel dots). Exports `LogoIcon` + `LogoLockup`.
- **Favicon.** `src/app/icon.tsx` renders helm mark at 28×28 on `#07101E`.
- **Chart grid.** `.chart-grid` background utility — 40px horizontal rules in `--dimmer` across main content area.
- Removed all hardcoded hex values across pages; replaced with Tailwind token utilities (`bg-bg`, `text-white`, `border-dimmer`, `text-steel`, `text-gold`).

### Added — 2026-04-19 (auto-scan cron)
- **Nightly scanner via launchd.** New `scripts/scan-cron.sh` wrapper invoked by `~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist` at 3:00 AM local daily. Logs to `~/Library/Logs/shipyard-scan/scan.{log,err}`. Fleet data stays fresh without manual `npx tsx scripts/scan.ts` runs.
- First cron-triggered scan: 36 projects upserted in 10.5s, 0 errors.
- **Known pre-existing bug surfaced:** `learnings` upsert fails with "no unique or exclusion constraint matching the ON CONFLICT specification" — the scanner expects a `(project_slug, source, raw_source_ref)` unique constraint that the schema doesn't have. Projects still upsert cleanly; learnings ingestion remains an open Phase 2 item.

### Fixed — 2026-04-20 (auth / login debugging session)
- **Auth gate now actually runs.** `proxy.ts` was exporting `proxyConfig` instead of `config` — Next.js 16 requires `export const config` for the matcher to register, so the middleware was silently disabled. Renamed export to `config`, gate now intercepts every request as intended.
- **Empty dashboard root cause.** The deployed URL tracked in `CLAUDE.md` was an immutable 3-day-old pre-Phase-2 hash URL. Switched to the stable project alias `shipyard-iamchasewhittakers-projects.vercel.app`. The `projects` table had all 43 rows the whole time — the problem was never data, always auth + a stale URL.
- **Login swapped to email + password.** Magic-link / OTP flow was brittle on the shared Supabase project (`unqtnnxlltiadzbqpyhh`): redirect-URL whitelist conflicts across every portfolio app, and the email template was OTP-only. Replaced `src/app/login/page.tsx` with a plain `signInWithPassword` form. Owner user created manually in the Supabase Auth dashboard.
- Deployed to production alias 3x via `vercel --prod --archive=tgz`.

### Changed (superseded by 2026-04-20 rebrand)
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
