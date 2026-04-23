# Wellness Tracker

> Comprehensive daily wellness PWA — morning/evening check-ins, tasks, time, budget, and growth habits in one place.

**Status:** Active
**Version:** v15.10
**Stack:** React CRA + inline styles + localStorage + Supabase
**Updated:** 2026-04-22

---

## Problem

Tracking sleep, mood, tasks, time, spending, and habits across separate apps creates friction and data silos. The day never has a clean start, a clean end, or a coherent story.

## Solution

A single PWA that handles the full daily loop — morning check-in to evening review — with all data in one Supabase-synced blob Chase owns and controls.

## Who it's for

Chase — daily, every morning and evening.

---

## Key features (V1)

- **Morning/evening check-in** — log sleep, mood, energy, supplements, meds, and notes in under 2 minutes
- **Task + time management** — today's tasks and focus timer in one tab
- **Budget monitoring** — spending log and wants tracker without a separate finance app
- **90-day history + AI summary** — see patterns and export data on demand
- **Growth habit logging** — streaks and wins log across 6 growth areas

---

## Primary flow

1. Chase opens app; Supabase pulls latest state
2. Tracker tab loads today's empty check-in form
3. Chase fills morning fields and taps Save
4. Data writes to localStorage and pushes to Supabase
5. Chase navigates tabs throughout the day (tasks, timer, budget)
6. Evening: Chase returns to Tracker, fills evening fields, saves
7. Day is logged; History tab shows the entry tomorrow

---

## Screens

| Screen | Purpose | Empty state | Error state |
|--------|---------|-------------|-------------|
| Tracker | Morning/evening check-in | Prompt to start first check-in | Form disabled, error banner |
| Tasks | Task list + ideas | "No tasks yet" | Last known state shown |
| Time | Focus timer + scripture streak | Timer 0:00, streak 0 | Timer resets, streak preserved |
| Budget | Spending + wants tracker | "No entries this month" | Cached totals shown |
| History | 90-day log, analytics, AI summary, export | "No history yet" | Export still available |
| Growth | Habit logging, streaks, wins | "Log your first win" | Prior entries preserved |

---

## Milestones

- [x] **M0 — Scaffold** — React CRA + Supabase wiring, builds clean
- [x] **M1 — Tracker tab** — morning/evening check-in, save/load, Supabase push/pull
- [x] **M2 — Tasks + Time** — task CRUD, ideas, focus timer, scripture streak
- [x] **M3 — Budget + Growth** — spending log, wants tracker, habit logging, streaks
- [x] **M4 — History** — 90-day log, analytics, AI summary, CSV export
- [x] **M5 — v15.10** — logos updated, iOS parity foundation, build verified
- [ ] **M6 — HistoryTab split** — 58 KB monolith → sub-components (V2)

---

## Links

- **GitHub:** [apps](https://github.com/iamchasewhittaker/apps) (monorepo path: `portfolio/wellness-tracker/`)
- **Linear:** https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7
- **Live:** local (`npm start`)
- **Shipyard:** [/ship/wellness-tracker](https://shipyard-sandy-seven.vercel.app/ship/wellness-tracker)

---

## Why it exists

Chase needed one app that handles the full daily loop — not four. The data stack (`chase_wellness_v1`) is Chase-owned, Supabase-synced, and cross-platform with the iOS companion. Every check-in builds a personal health record no third-party app holds.

*For Reese. For Buzz. Forward — no excuses.*
