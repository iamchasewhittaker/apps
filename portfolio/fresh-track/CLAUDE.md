# Fresh Track — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Version:** v0.1
- **Storage key:** `chase_fresh_track_v1` (localStorage)
- **URL:** fresh-track.vercel.app (pending first deploy)
- **Entry:** `src/app/page.tsx`

## Purpose
Grocery freshness tracker for Chase + Kassie. Captures perishable grocery items, auto-applies expiration dates via USDA FoodKeeper data, and generates a printable fridge list grouped by urgency.

> *"For Reese. For Buzz. Forward — no excuses."*

## Tech Stack
Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + localStorage + pnpm

## Commands
- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm lint` — lint

## Phase 1 Scope
- Manual item entry with FoodKeeper autocomplete
- Fridge + freezer inventory view with urgency badges
- Mark items used or wasted (waste tracking)
- Printable fridge list + 7-day "eat this first" suggestions

## Not in Phase 1
- Receipt scanning (Phase 1.5: Claude Vision API)
- Email receipt parsing (Phase 2: Gmail OAuth)
- Supabase sync / multi-device
- iOS app
- Barcode scanning

## Constraints
- Dark mode only (`#09090b` base)
- One feature per iteration. Ship, test, then move on.

## Tailwind 4 Pattern
```css
@import "tailwindcss";
```

## How to Extend
1. Read the ROADMAP.md before adding anything new.
2. If a feature changes the data shape, migrate existing data.
