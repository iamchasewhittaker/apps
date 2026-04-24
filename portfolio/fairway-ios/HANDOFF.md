# Fairway (iOS) — Handoff

## State

| Field | Value |
|-------|-------|
| Version | v0.1 |
| Status | 🟡 Plan approved, data entry pending — execute in new chat |
| Last session | 2026-04-23 |
| Focus | Logging today's IFA fertilizer over-application + cataloging 6 Z2 park-strip heads |
| Bundle ID | `com.chasewhittaker.Fairway` |
| Storage key | `chase_fairway_ios_v1` |
| PBX prefix | `FW` |
| Xcode project | `Fairway.xcodeproj` |

## Active plan — execute in next chat

📋 **`/Users/chase/.claude/plans/what-went-wrong-here-playful-lemur.md`** (approved 2026-04-23)

Two workstreams sharing `FairwayBlob` writes:

**A. Over-application post-mortem (2026-04-23)**
- IFA Crabgrass Preventer + Lawn Food (23-3-8) applied to Z2/Z3/Z4
- Skipped calibration → applied 17.8 lb (target ~11 lb) = **62% over** at 6.5 lb/1,000 sq ft
- Recovery: tonight 75-min Quick Run + AM 30-min top-off; daily burn-check 04-24 → 05-03; no aerate until 07-16; next fert late June at half rate

**B. Z2 park-strip head catalog**
- 6 Hunter Pro-Spray bodies on single valve (front yard + park strip)
- Mixed nozzles (~3-5× precip-rate spread) is the long-standing reason the strip struggles
- Z2-S5 already converted to MP Rotator (canary); plan to swap remaining 5
- Z2-S6 buried in 4-5″ erosion pit — needs dig-out + swing-pipe raise

### Resume prompt (paste at top of new chat)

> Read `/Users/chase/Developer/chase/CLAUDE.md`, `/Users/chase/Developer/chase/portfolio/fairway-ios/CLAUDE.md`, this `HANDOFF.md`, and `/Users/chase/.claude/plans/what-went-wrong-here-playful-lemur.md` first. The plan is approved. Execute the 14 steps under "Steps (execute tomorrow morning after watering completes)" — this is data entry into `FairwayBlob` (no schema changes). After execution, run `checkpoint` and update `CHANGELOG.md`/`ROADMAP.md`/`HANDOFF.md`/`LEARNINGS.md` per `/Users/chase/Developer/chase/CLAUDE.md` "Documentation Auto-Update Rule".

### Preconditions for the new chat
1. Tonight's 75-min Quick Run on Z2/Z3/Z4 has completed
2. Tomorrow AM 30-min top-off completed
3. Google Earth screenshots available to copy lat/long for the 6 Z2-S* heads (only data not in plan)

### Open environment issue (separate)
- iOS 17.2 simulator runtime uninstalled — `xcodebuild` shows no destinations available. Install via Xcode → Settings → Platforms before running verification builds. Doesn't block data entry.

### Pre-existing uncommitted WIP on `main`
- `Fairway/Views/HeadPinEditor.swift` (new file, 270 lines) — MapKit-based pin editor with drag handles for bearing + arc sweep
- `Fairway/Views/HeadDetailView.swift` modified — toolbar pin button + `.fullScreenCover` integration
- `Fairway.xcodeproj/project.pbxproj` modified — pbxproj entry for HeadPinEditor

These are unrelated to the active plan. Commit or stash before data entry so the diff stays clean.

## Shipped Scope (v0.1)

- [x] All models (ZoneData, HeadData, ProblemData, ScheduleData, SoilTestData, FertilizerData, MaintenanceData, InventoryData)
- [x] FairwayBlob + FairwayStore with seedIfNeeded()
- [x] 5-tab ContentView (Zones / Lawn / Soil / Maintenance / More)
- [x] ZoneListView with 4 pre-seeded zone cards
- [x] ZoneDetailView (Heads/Problems/Schedule, +Beds for Zone 1)
- [x] HeadInventoryView + HeadDetailView (PRE-SEASON badges, issue flags)
- [x] ProblemAreaView (PRE-SEASON amber / CONFIRMED red)
- [x] ScheduleView (Rachio params, Cycle & Soak display)
- [x] ShrubBedView (Beds A/B/C with plants + upkeep tasks)
- [x] FertilizerView (6 season applications, date windows, product links)
- [x] InventoryView (products + equipment, stock log, service history)
- [x] SpreaderCalcView (lbs needed, bags to buy, spreader fills, dial)
- [x] SoilTestView (13 nutrients, bar chart, findings)
- [x] MaintenanceView (task list, reminders, season test checklist)
- [x] MowLogView
- [x] FairwayBlobTests (encode/decode/seed)
- [x] xcodebuild passes clean (BUILD SUCCEEDED) — pre simulator-runtime issue

## Property Context

- Location: 345 E 170 N, Vineyard, UT 84059
- Controller: Rachio (4 zones)
- Soil: Utah clay, pH 6.75, N+K low, micronutrients broadly low
- Consultant: Jimmy Lewis (jimmylewismows.com) — soil test April 2026

## Zone Summary (corrected 2026-04-23)

| # | Name | Sq Ft | Type | Notes |
|---|------|-------|------|-------|
| 1 | Flower beds | 106 | Drip emitters | No granular fert ever |
| 2 | Front yard + park strip | 1,028 | KBG cool season | **Single valve** — strip on same line |
| 3 | West Side Backyard | 998 | Cool season | |
| 4 | East Side Backyard | 711 | KBG cool season | |

Total grass (Z2+Z3+Z4): 2,737 sq ft

## Verification Before New Sessions

```bash
cd /Users/chase/Developer/chase/portfolio/fairway-ios
xcodebuild build -project Fairway.xcodeproj -scheme Fairway \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO
```

(Currently blocked by missing iOS 17.2 simulator runtime — see Open environment issue above.)
