# Changelog

## [Unreleased]

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
