# Shipyard — Project Instructions

> Fleet command for your app portfolio.

- **Version:** v0.1
- **Status:** v0.1 — Phase 1 live
- **URL:** https://shipyard-l6ywr3psg-iamchasewhittakers-projects.vercel.app
- **Entry point:** src/app/page.tsx
- **Tech stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + Supabase + Vercel
- **Package manager:** npm

## Architecture

Local CLI scanner (`scripts/scan.ts`) reads ~/Developer/chase/portfolio/**, extracts project metadata, and upserts into Supabase. The Next.js app (deployed to Vercel) reads from Supabase and renders the dashboard.

```
Mac (local) → scripts/scan.ts → Supabase ← Next.js (Vercel)
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL    — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon key
LINEAR_API_KEY              — Linear API key (Phase 2)
DEVELOPER_ROOT              — Scanner root path (default: ~/Developer/chase/portfolio)
```

## File Structure

```
src/
  app/
    page.tsx              — Fleet dashboard (main)
    layout.tsx            — Root layout with sidebar nav
    ship/[slug]/page.tsx  — Ship detail view
    wip/page.tsx          — WIP / Drydock gate
    review/page.tsx       — Weekly/monthly/quarterly reviews
    learnings/page.tsx    — Captain's Log (learnings)
    themes/page.tsx       — Charts & Constellations (themes)
    portfolio/page.tsx    — Fleet Showcase (public portfolio)
    linear/page.tsx       — Harbor Master (Linear sync)
    api/
      wip/pick/route.ts   — POST pick active ship
      review/route.ts     — POST/GET reviews
  components/             — Shared UI components
  lib/
    supabase.ts           — Client factory
    types.ts              — All TypeScript types
    mvp-step.ts           — MVP step inference heuristics
    review-cadence.ts     — Review countdown math
scripts/
  scan.ts                 — Local filesystem scanner
  seed-from-audit.ts      — One-time CSV import
supabase/migrations/
  0001_init.sql           — Full schema
```

## Commands

```bash
npm run dev              # Local dev server
npm run build            # Production build
npx tsx scripts/scan.ts  # Scan portfolio and push to Supabase
npx tsx scripts/seed-from-audit.ts  # Import audit CSV (one-time)
```

## Nautical Theme

- Projects = Ships
- Build = Under Construction
- Ship/Launch = Launched
- Paused/Stalled = In Drydock
- Dashboard = Fleet
- Learnings = Captain's Log
- Themes = Charts & Constellations
- Linear = Harbor Master
- Portfolio = Fleet Showcase
- Review = Port Inspection
