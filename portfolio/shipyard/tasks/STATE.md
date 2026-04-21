# State

**Active**: 02_PHASE_2_DATA_AND_AUTH
**File**: tasks/plans/PLAN_02_PHASE_2_DATA_AND_AUTH.md
**Phase**: 2
**Status**: In Progress
**Updated**: 2026-04-20T00:00:00Z

---

## Overview

| # | Plan | File | Status | Progress |
|---|------|------|--------|----------|
| 01 | PHASE_1_SCAFFOLD | PLAN_01_PHASE_1_SCAFFOLD.md | Complete | 5/5 tasks |
| 02 | PHASE_2_DATA_AND_AUTH | PLAN_02_PHASE_2_DATA_AND_AUTH.md | In Progress | 3/7 tasks |
| 03 | PHASE_3_AUTOMATION | PLAN_03_PHASE_3_AUTOMATION.md | In Progress | 1/3 tasks |
| 04 | NAUTICAL_REBRAND | PLAN_04_NAUTICAL_REBRAND.md | Complete | 7/7 tasks |
| 05 | POLISH_PASS | PLAN_05_POLISH_PASS.md | Complete | 8/8 tasks |

---

## Plans

### PLAN_01_PHASE_1_SCAFFOLD

#### Phase 1: Foundation — Complete

| Task | Status |
|------|--------|
| Next.js 15 app scaffolded and deployed to Vercel via GitHub auto-deploy | Complete |
| Full schema migrated (`supabase/migrations/0001_init.sql`) | Complete |
| 8 pages built and live (Fleet, Ship, WIP, Review, Log, Themes, Showcase, Linear) | Complete |
| Local scanner CLI (`scripts/scan.ts`) scanning and upserting to Supabase | Complete |
| 29 projects seeded from audit CSV; 28 live-scanned | Complete |

### PLAN_02_PHASE_2_DATA_AND_AUTH

#### Phase 2: Auth Gate + Editable Fleet — In Progress

| Task | Status |
|------|--------|
| Supabase RLS + auth gate (proxy.ts `config` export fix) | Complete |
| Login page with `signInWithPassword` | Complete |
| Service role key for server reads (bypass RLS) | Complete |
| Editable fields on Ship detail (status, phase, notes, blockers) | Pending |
| Learnings ingestion from each project's LEARNINGS.md | Pending |
| WIP enforcement via `wip_decisions` table | Pending |
| Linear Harbor Master sync | Pending |

### PLAN_03_PHASE_3_AUTOMATION

#### Phase 3: Automation — In Progress

| Task | Status |
|------|--------|
| Auto-scan cron (`com.chasewhittaker.shipyard-scan` launchd agent, nightly 3am) | Complete |
| Drift alerts — flag projects past review cadence | Pending |
| Public Fleet Showcase behind separate unauth route | Pending |

### PLAN_04_NAUTICAL_REBRAND

#### Rebrand: 8-token palette + helm logo + typography — Complete 2026-04-19

| Task | Status |
|------|--------|
| 8 canonical design tokens in globals.css (bg/surface/steel/gold/dim/dimmer/ghost/white) | Complete |
| BigShoulders + DM Mono + Instrument Sans via next/font/google | Complete |
| Ship's-helm SVG LogoIcon component (8 spokes, 4 handles, 4 dots) | Complete |
| Dynamic favicon at `src/app/icon.tsx` | Complete |
| `.chart-grid` lined-paper background utility (later removed for noise) | Complete |
| All pages de-hardcoded: hex values → Tailwind token utilities | Complete |
| Sidebar + ModeHeading + gold-rule underline | Complete |

### PLAN_05_POLISH_PASS

#### Polish: contrast + theme toggle + showcase rebuild — Complete 2026-04-20

| Task | Status |
|------|--------|
| Contrast fix — lifted `--dim` and `--dimmer` for legibility | Complete |
| Gold nav separators between sidebar items | Complete |
| Theme toggle (nautical ↔ regular labels) via ModeProvider + /settings | Complete |
| Fleet Showcase rebuild — all ~38 apps visible, category pills + tech chips | Complete |
| Per-app design detail page at `/portfolio/[slug]` with palette + fonts | Complete |
| `build-branding.ts` prebuild script extracts brand tokens into branding.json | Complete |
| Drydock Gate full queue + `@dnd-kit` drag-to-reorder priority mode | Complete |
| `scripts/sync-projects.ts` parses root CLAUDE.md metadata table | Complete |
