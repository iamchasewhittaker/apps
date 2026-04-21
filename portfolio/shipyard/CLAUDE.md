# Shipyard — Project Instructions

<!-- auto-start: overview -->
> Fleet command for Chase's app portfolio. A local CLI scanner walks every portfolio app and upserts metadata into Supabase; the deployed Next.js dashboard surfaces project health, compliance scores, MVP steps, a WIP priority queue, weekly reviews, learning logs, and thematic analysis.

- **Version:** v0.1
- **Status:** Phase 2 in progress — auth gate + data live; 48 projects synced; nautical rebrand shipped 2026-04-19
- **URL:** https://shipyard-iamchasewhittakers-projects.vercel.app (stable alias)
- **Entry point:** `src/app/page.tsx`
- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Supabase + Vercel
- **Package manager:** npm
<!-- auto-end: overview -->

## Quick Reference

<!-- auto-start: quick-reference -->
| | |
|---|---|
| **Language** | TypeScript 5 |
| **Framework** | Next.js 16.2.4 (App Router) |
| **UI** | React 19.2.4 + Tailwind CSS v4 |
| **Backend** | Supabase (shared project `unqtnnxlltiadzbqpyhh`) |
| **Deploy** | Vercel (GitHub auto-deploy on push to `main`) |
| **Package Manager** | npm |

**Key Commands**:
```
npm run dev                         # Local dev server (port 3000)
npm run build                       # Production build (runs prebuild branding step)
npm run start                       # Start production server
npm run lint                        # ESLint
npm run sync:projects               # Sync portfolio metadata from root CLAUDE.md
npm run build:branding              # Extract brand tokens → src/data/branding.json
npm run smoke                       # Route smoke test (set BASE_URL to target prod)
npx tsx scripts/scan.ts             # Scan portfolio and push to Supabase
npx tsx scripts/seed-from-audit.ts  # Import audit CSV (one-time)
```
<!-- auto-end: quick-reference -->

## Architecture

<!-- auto-start: architecture -->
Local CLI scanner (`scripts/scan.ts`) reads `~/Developer/chase/portfolio/**`, extracts project metadata, and upserts into Supabase. The Next.js app (deployed to Vercel) reads from Supabase and renders the dashboard.

```
Mac (local) → scripts/scan.ts → Supabase ← Next.js (Vercel)
```

**Auto-scan cron:** `com.chasewhittaker.shipyard-scan` launchd agent runs `scripts/scan-cron.sh` nightly at 3:00 AM local. Logs at `~/Library/Logs/shipyard-scan/`.

**Auth / RLS Note**: `middleware.ts` is a no-op stub (`matcher: []`). `proxy.ts` exists but is not wired as Next.js middleware. `createServerClient()` in `src/lib/supabase.ts` uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for server-side reads — deliberate for a single-user personal dashboard. Do not bundle `supabase.ts` into client code.
<!-- auto-end: architecture -->

## Environment Variables

<!-- auto-start: env -->
```
NEXT_PUBLIC_SUPABASE_URL      — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon key (browser client)
SUPABASE_SERVICE_ROLE_KEY     — Service role key (server-only; bypasses RLS for reads)
LINEAR_API_KEY                — Linear API key (Phase 2)
DEVELOPER_ROOT                — Scanner root path (default: ~/Developer/chase/portfolio)
```
<!-- auto-end: env -->

## Project Structure

<!-- auto-start: structure -->
```
src/
  app/
    page.tsx                  — Fleet dashboard (main)
    layout.tsx                — Root layout with sidebar nav + ModeProvider
    globals.css               — Tailwind v4 + nautical tokens + chart-grid utility
    icon.tsx                  — Dynamic favicon (helm mark at 28×28)
    ship/[slug]/page.tsx      — Ship detail view (amber localhost + green prod URL)
    wip/                      — Drydock Gate (full queue + drag-to-reorder)
      page.tsx, QueueList.tsx, QueueRow.tsx, WipActions.tsx, actions.ts
    review/                   — Port Inspection
      page.tsx, ReviewForm.tsx
    learnings/page.tsx        — Captain's Log
    themes/page.tsx           — Charts & Constellations
    portfolio/                — Fleet Showcase (public portfolio)
      page.tsx, ShowcaseCard.tsx, PortfolioActions.tsx, [slug]/page.tsx
    linear/page.tsx           — Harbor Master (Linear sync)
    settings/page.tsx         — Nautical ↔ plain label mode toggle
    login/page.tsx            — Email + password sign-in (unused — no active auth gate)
    auth/confirm/route.ts     — OTP confirm handler (legacy magic-link path)
    api/
      wip/pick/route.ts       — POST pick active ship
      review/route.ts         — POST/GET reviews
      ship/[slug]/
        route.ts              — GET/PATCH ship
        blockers/route.ts     — POST blocker
        blockers/[id]/route.ts— DELETE blocker
  components/
    ModeHeading.tsx           — Shared display-font page heading (gold-rule underline)
    ModeProvider.tsx          — Nautical/plain label mode context
    NavItem.tsx               — Sidebar nav link
    ShipCard.tsx, StatsBar.tsx, FilterBar.tsx, WipBanner.tsx
    ComplianceChecklist.tsx, EditableField.tsx
    ReviewCountdownChips.tsx, LogoIcon.tsx, LogoLabel.tsx
  lib/
    supabase.ts               — Server client factory (service role key)
    supabase-browser.ts       — Browser client factory (anon key)
    types.ts                  — All TypeScript types
    labels.ts                 — Nautical/plain label mappings
    mvp-step.ts               — MVP step inference heuristics
    review-cadence.ts         — Review countdown math
    theme-mode.ts             — Mode toggle storage helpers
  data/
    branding.json             — Per-app brand tokens (built by scripts/build-branding.ts)

scripts/
  scan.ts                     — Local filesystem scanner (nightly + manual)
  scan-cron.sh                — Nightly launchd wrapper
  seed-from-audit.ts          — One-time CSV import
  sync-projects.ts            — Sync portfolio metadata from root CLAUDE.md
  build-branding.ts           — Prebuild step for brand assets
  run-migration.ts            — Apply SQL migrations
  smoke.ts                    — Route smoke test (auto-discovers src/app/**)
  migrations/                 — Migration helper scripts

supabase/migrations/
  0001_init.sql               — Full schema
  0002_rls.sql                — RLS policies

design/                       — Static brand mockups
public/branding/              — Per-app AppIcons (built from portfolio/*/docs/BRANDING.md)
```
<!-- auto-end: structure -->

## Tech Stack

<!-- auto-start: tech-stack -->
**Core**:
- Next.js 16.2.4 (App Router, RSC + Server Actions)
- React 19.2.4
- TypeScript 5
- Tailwind CSS v4 (`@tailwindcss/postcss`)

**Data**:
- `@supabase/supabase-js` ^2.103 — server + browser clients
- `@supabase/ssr` ^0.10 — SSR helpers (login flow)
- `csv-parse` — audit CSV import

**UX**:
- `@dnd-kit/core` + `sortable` + `utilities` — drag-to-reorder priority queue

**Dev**:
- `tsx` — run TypeScript scripts directly
- `dotenv` — load `.env.local` in scripts
- ESLint 9 + `eslint-config-next`
<!-- auto-end: tech-stack -->

## Brand System (Nautical rebrand · 2026-04-19)

<!-- auto-start: brand -->
**8 canonical design tokens** (Tailwind utilities in `globals.css`):

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#07101E` | App background |
| `surface` | `#0C1A34` | Cards, sidebar surface |
| `ghost` | `#0D1A34` | Subtle surface variant |
| `dimmer` | `#2A3A7A` | Borders, grid strokes (post-polish contrast fix) |
| `dim` | `#7AA6D6` | Muted text (post-polish contrast fix) |
| `steel` | `#4A90DE` | Secondary accent / links |
| `gold` | `#D7AA3A` | Primary accent, rule underline, nav dividers |
| `white` | `#F2EEE6` | Primary text (sail cream) |

**Typography** (via `next/font/google`):
- **Display:** Big Shoulders Display Bold — page headings (`ModeHeading`)
- **Labels / mono:** DM Mono Regular — badges, chips, stats
- **Body:** Instrument Sans Regular/Bold

**Logo:** Ship's helm — 8 spokes, 4 cardinal handles, 4 steel dots. `src/components/LogoIcon.tsx` (inline SVG). Favicon rendered from `src/app/icon.tsx`.

**Typography floor:** `text-xs` — never use 10-11px type on the dark navy bg. Nav items `text-sm`, stats `text-4xl`, body/badges `text-xs`/`text-sm`.

**`.chart-grid` lined-paper background was removed** from `globals.css` and `<main>` in `layout.tsx` — was distracting across every page.
<!-- auto-end: brand -->

## Nautical Theme Labels

<!-- auto-start: labels -->
Labels toggle between nautical and plain via `ModeProvider` + `src/lib/labels.ts`; persisted in `localStorage` (`shipyard_theme_mode`).

| Plain | Nautical |
|---|---|
| Projects | Ships |
| Build | Under Construction |
| Ship/Launch | Launched |
| Paused/Stalled | In Drydock |
| Dashboard | Fleet |
| Learnings | Captain's Log |
| Themes | Charts & Constellations |
| Linear | Harbor Master |
| Portfolio | Fleet Showcase |
| Review | Port Inspection |
<!-- auto-end: labels -->

## Patterns & Conventions

<!-- auto-start: patterns -->
**Routing:** App Router only. Server Components by default; `'use client'` only when needed (e.g. `ShowcaseCard`, `QueueList`, `PortfolioActions`). RSC serialization pitfall: never inline `onClick` components in async server pages — extract to a client file.

**Data access:**
- Server reads → `createServerClient()` in `src/lib/supabase.ts` (service role key bypasses RLS)
- Browser reads → `src/lib/supabase-browser.ts` (anon key)
- Never import `supabase.ts` from client components

**Types:** All shared types in `src/lib/types.ts`. `Project` is the canonical fleet row shape.

**Server Actions:** WIP priority ranking uses server actions in `src/app/wip/actions.ts` (`updateRanks`, `seedRanksByCommit`).

**Headings:** All page headings use the shared `ModeHeading` component — Big Shoulders display at `text-4xl`/`5xl` with the `gold-rule` underline.

**Labels:** Always use `useLabel()` hook from `ModeProvider` rather than hardcoding nautical strings — keeps the mode toggle working.

**Commits:** Conventional-style prefixes — `feat(shipyard):`, `fix(shipyard):`, `docs(shipyard):`, `chore(shipyard):`. Follows portfolio-wide convention.

**Deploy:** `git push origin main` — Vercel auto-deploys. Direct `vercel --prod` is unreliable because of monorepo rootDirectory conflicts.
<!-- auto-end: patterns -->

## Retire Project Workflow

Retiring a ship archives it in Supabase and optionally cancels its Linear project.

**UI:** Ship detail page (`/ship/[slug]`) → "Danger Zone" → "Decommission Ship" button. Only shown for non-archived projects.

**CLI:** `npx tsx scripts/retire-project.ts <slug> [reason]`
```
npx tsx scripts/retire-project.ts money "Superseded by Spend Clarity"
npx tsx scripts/retire-project.ts growth-tracker "Merged into Wellness GrowthTab"
```

**API:** `POST /api/ship/[slug]/retire` — body: `{ reason?: string }`

**What it automates:**
- Supabase: `status → archived`, `retired_at`, `retire_reason` set
- Linear: calls `archiveProject()` if `LINEAR_API_KEY` is set and `linear_project_url` is populated

**What remains manual (shown in post-retirement checklist):**
- `git mv portfolio/<slug> portfolio/archive/<slug>`
- Update root `CLAUDE.md` + `ROADMAP.md` status rows
- Vercel: unlink/delete the project if desired

**Linear API key:** Set `LINEAR_API_KEY` in `.env.local`. Currently empty — Linear step skipped gracefully until configured.

**Migration required:** Run this SQL in Supabase SQL Editor once before using retired_at/retire_reason:
```sql
alter table projects add column if not exists retired_at timestamptz;
alter table projects add column if not exists retire_reason text;
```

## Notes

> User-owned section. Reserve for ad-hoc notes, gotchas, and reminders that shouldn't be auto-regenerated.
