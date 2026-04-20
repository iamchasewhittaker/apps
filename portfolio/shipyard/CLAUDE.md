# Shipyard — Project Instructions

> Fleet command for your app portfolio.

- **Version:** v0.1
- **Status:** v0.1 — Phase 2 complete (data live, 48 projects synced, typography polished, no auth gate)
- **URL:** https://shipyard-sandy-seven.vercel.app
- **Entry point:** src/app/page.tsx
- **Tech stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Supabase + Vercel
- **Package manager:** npm

## What This App Is

The fleet command center for Chase's entire app portfolio — a local CLI scanner reads every portfolio app's metadata and upserts it into Supabase, while the deployed Next.js dashboard surfaces project health, compliance scores, MVP step tracking, a WIP priority queue, weekly reviews, learning logs, and thematic analysis. It is Shipyard's own management surface; the app you are reading this from.

## Architecture

Local CLI scanner (`scripts/scan.ts`) reads ~/Developer/chase/portfolio/**, extracts project metadata, and upserts into Supabase. The Next.js app (deployed to Vercel) reads from Supabase and renders the dashboard.

```
Mac (local) → scripts/scan.ts → Supabase ← Next.js (Vercel)
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL      — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon key (browser client)
SUPABASE_SERVICE_ROLE_KEY     — Service role key (server-only; bypasses RLS for reads)
LINEAR_API_KEY                — Linear API key (Phase 2)
DEVELOPER_ROOT                — Scanner root path (default: ~/Developer/chase/portfolio)
```

### Auth / RLS Note

`middleware.ts` is a no-op stub (`matcher: []`) and `proxy.ts` is not wired up as Next.js middleware, so no auth session is established. `createServerClient()` in `src/lib/supabase.ts` uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for server-side reads. This is deliberate for a single-user personal dashboard — do not bundle `supabase.ts` into client code.

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
    settings/page.tsx     — Settings / mode toggle
    login/page.tsx        — Login (unused — no auth gate active)
    api/
      wip/pick/route.ts   — POST pick active ship
      review/route.ts     — POST/GET reviews
  components/
    ModeHeading.tsx       — Shared display-font page heading (used on Review, Log, Drydock Gate)
    ModeProvider.tsx      — Nautical/plain label mode context
    NavItem.tsx           — Sidebar nav link
    ShipCard.tsx, StatsBar.tsx, FilterBar.tsx, WipBanner.tsx,
    ComplianceChecklist.tsx, EditableField.tsx,
    ReviewCountdownChips.tsx, LogoIcon.tsx, LogoLabel.tsx
  lib/
    supabase.ts           — Server client factory (service role key)
    supabase-browser.ts   — Browser client factory (anon key)
    types.ts              — All TypeScript types
    labels.ts             — Nautical/plain label mappings
    mvp-step.ts           — MVP step inference heuristics
    review-cadence.ts     — Review countdown math
    theme-mode.ts         — Mode toggle storage helpers
scripts/
  scan.ts                 — Local filesystem scanner
  scan-cron.sh            — Nightly launchd wrapper
  seed-from-audit.ts      — One-time CSV import
  sync-projects.ts        — Sync portfolio metadata table from root CLAUDE.md
  build-branding.ts       — Prebuild step for brand assets
  run-migration.ts        — Apply SQL migrations
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

## Typography & Headings

- **All page headings** use the shared `ModeHeading` component — Big Shoulders display font at `text-4xl`/`5xl` with the `gold-rule` underline.
- **Typography baseline** (post Phase 2 polish):
  - Nav items: `text-sm` (was 11px — too small on dark navy)
  - Stats: `text-4xl` (was `text-3xl`)
  - Body / badges: `text-xs` / `text-sm` (was 10px)
- **Never use 10-11px type on the dark navy bg** — unreadable. `text-xs` is the floor.
- **`.chart-grid` lined-paper background was removed** from `globals.css` and `<main>` in `layout.tsx` — was distracting across every page.
