# Fairway

> iOS lawn management OS for a 4-zone Rachio system — every zone, every product, every soil reading in one local app.

**Status:** Active
**Version:** v0.1
**Stack:** SwiftUI + iOS 17 + `@Observable` + UserDefaults + Codable
**Updated:** 2026-04-22

---

## Problem

Managing a Rachio irrigation system, a Utah clay soil profile, and a seasonal fertilizer plan requires juggling the Rachio app, fertilizer bag labels, a soil test PDF, and memory. Nothing connects the zones to the soil to the spreader dial setting.

## Solution

Fairway puts every zone, every sprinkler head, every problem area, every fertilizer application window, and every soil reading in one structured local app. It does the spreader math so Chase doesn't have to.

## Who it's for

Chase — homeowner in Vineyard, UT with a 4-zone Rachio controller and a grounds-crew standard for his own lawn.

---

## Key features (V1)

- **Zone detail** — 4 zone cards with heads, problem areas, Rachio schedule, and Cycle & Soak values; Zone 1 includes Beds A/B/C.
- **Fertilizer plan** — 6 season applications with date windows calibrated for zone 6b; product links built in.
- **Spreader calculator** — enter lawn area, get lbs needed, bag count, refill count, and dial setting.
- **Soil test** — 13-nutrient bar chart from the April 2026 soil test; findings and ideal ranges visible at a glance.
- **Maintenance + inventory** — task list, mow log, season checklist, and a full product/equipment inventory with stock and service logs.

---

## Primary flow

1. Launch app — ZoneList renders 4 zone cards with status dots.
2. Tap a zone — detail view opens with Heads, Problems, Schedule tabs.
3. Review heads with PRE-SEASON badges and problems with CONFIRMED badges.
4. Navigate to Lawn tab — view fertilizer plan for the current season window.
5. Open Spreader Calc — enter area, read dial setting and bag count.
6. Navigate to Soil tab — review nutrient chart and April 2026 findings.

---

## Screens

| Screen | Purpose | Empty state | Error state |
|--------|---------|-------------|-------------|
| ZoneList | 4 zone cards, status dots | "No zones." (seed fail only) | — |
| ZoneDetailView | Heads / Problems / Schedule / Beds | Placeholder text per tab | — |
| FertilizerView | 6-application season plan | — | — |
| SpreaderCalcView | Area → lbs / bags / dial | Outputs show 0 until area entered | — |
| SoilTestView | 13-nutrient bar chart | — | — |
| MaintenanceView | Tasks + mow log | "No tasks." / "No entries." | — |
| InventoryView | Products + equipment | "No items." | — |

---

## Milestones

- [x] **M0 — Scaffold** — Xcode project, bundle ID, FairwayStore, FairwayBlob, seedIfNeeded
- [x] **M1 — Phase 1 complete** — all models, all views, all seeded data; xcodebuild passes clean; installed on device
- [ ] **M2 — Phase 1 validation** — use for a full spring setup; correct seeded data in-app; identify any missing fields
- [ ] **M3 — Edit flows** — CRUD on heads, problems, tasks, and inventory from within the app
- [ ] **M4 — Phase 2 features** — TBD after Phase 1 validation is complete

---

## Links

- **GitHub:** [apps](https://github.com/iamchasewhittaker/apps) (monorepo path: `portfolio/fairway-ios/`)
- **Linear:** —
- **Live:** local (Xcode / on-device)
- **Shipyard:** [/ship/fairway-ios](https://shipyard-sandy-seven.vercel.app/ship/fairway-ios)

---

## Why it exists

Rachio tells Chase when to water. Nothing tells him what was applied to each zone, what the soil needs, how much fertilizer to load in the spreader, or which heads to check before spring startup. Fairway is that missing ops log — specific to this property, this soil, this controller.
