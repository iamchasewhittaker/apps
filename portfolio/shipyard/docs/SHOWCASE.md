# Shipyard

> Fleet command center for Chase's app portfolio — one dashboard to see what's shipping, what's stuck, and what was learned.

**Status:** Active
**Version:** v0.1
**Stack:** Next.js 16.2 + React 19 + TypeScript + Tailwind CSS v4 + Supabase + Vercel
**Updated:** 2026-04-22

---

## Problem

Chase has 48+ portfolio projects. Their status, blockers, and learnings live in per-project files, Linear, and memory. Every dev session starts with a slow manual reconstruction of what's alive and what needs attention.

## Solution

A local CLI scanner reads portfolio metadata from CLAUDE.md and related files and upserts it into Supabase. A deployed dashboard reads that data and surfaces project health, WIP queue, weekly reviews, learnings, and thematic analysis in one place.

## Who it's for

Chase — the person who built and maintains the portfolio.

---

## Key features (V1)

- **Fleet dashboard** — all 48+ projects in one view with status, compliance score, and WIP flag
- **Ship detail** — inline-editable status, next action, and blockers per project
- **Drydock Gate** — drag-to-reorder WIP priority queue that persists across sessions
- **Captain's Log** — learnings aggregated from every project's LEARNINGS.md file
- **Port Inspection** — structured weekly review form that saves to Supabase

---

## Primary flow

1. Chase navigates to the deployed dashboard.
2. Auth gate redirects to login; Chase enters email + password.
3. Fleet dashboard loads — all projects visible with live status.
4. Chase clicks a project card with a WIP flag.
5. Ship detail opens — Chase edits next_action inline; change persists on blur.
6. Chase navigates to Drydock Gate, reorders priorities, closes the tab.

---

## Screens

| Screen | Purpose | Empty state | Error state |
|--------|---------|-------------|-------------|
| Fleet dashboard | All projects at a glance | "No ships found — run scan" | "Failed to load fleet" + retry |
| Ship detail | Per-project metadata + edit | n/a | "Ship not found" + back |
| Drydock Gate | WIP priority queue | "No active WIP" | "Failed to load queue" + retry |
| Port Inspection | Weekly review form | Pre-filled date | "Save failed — try again" |
| Captain's Log | Aggregated learnings | "No learnings yet" | "Failed to load log" + retry |

---

## Milestones

- [x] **M0 — Scaffold** — Next.js app scaffolded, deployed to Vercel via GitHub auto-deploy
- [x] **M1 — Fleet dashboard + data** — 48 projects synced; all 8 pages live
- [x] **M2 — Auth + editable fields** — RLS, login gate, inline edit on Ship detail, decommission flow
- [ ] **M3 — Learnings ingestion** — LEARNINGS.md files parsed and loaded into Captain's Log
- [ ] **M4 — WIP enforcement** — wip_decisions table drives Drydock Gate behavior
- [ ] **M5 — Linear Harbor Master** — Linear sync via API

---

## Links

- **GitHub:** [apps](https://github.com/iamchasewhittaker/apps) (monorepo path: `portfolio/shipyard/`)
- **Linear:** —
- **Live:** [shipyard-iamchasewhittakers-projects.vercel.app](https://shipyard-iamchasewhittakers-projects.vercel.app)
- **Shipyard:** [/ship/shipyard](https://shipyard-iamchasewhittakers-projects.vercel.app/ship/shipyard)

---

## Why it exists

Every portfolio project carries state that matters: what it is, where it's stuck, what was learned building it. That state was invisible without digging through files. Shipyard makes it visible without any manual upkeep — the scanner does the work, the dashboard surfaces the signal.
