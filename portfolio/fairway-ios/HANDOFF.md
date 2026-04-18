# Fairway (iOS) — Handoff

## State

| Field | Value |
|-------|-------|
| Version | v0.1 |
| Status | 🟡 Phase 1 complete — build succeeds |
| Last session | 2026-04-18 |
| Focus | All models, views, pre-seeded data written; build passes |
| Bundle ID | `com.chasewhittaker.Fairway` |
| Storage key | `chase_fairway_ios_v1` |
| PBX prefix | `FW` |
| Xcode project | `Fairway.xcodeproj` |

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
- [x] xcodebuild passes clean (BUILD SUCCEEDED)

## Property Context

- Location: 345 E 170 N, Vineyard, UT 84059
- Controller: Rachio (4 zones)
- Soil: Utah clay, pH 6.75, N+K low, micronutrients broadly low
- Consultant: Jimmy Lewis (jimmylewismows.com) — soil test April 2026

## Zone Summary

| # | Name | Sq Ft | Type |
|---|------|-------|------|
| 1 | Shrubs | 106 | Shrubs/Bubblers |
| 2 | Front Yard | 1,028 | KBG cool season |
| 3 | West Side Backyard | 998 | Cool season |
| 4 | East Side Backyard | 711 | KBG cool season |

Total grass: 2,737 sq ft

## Verification Before New Sessions

```bash
cd /Users/chase/Developer/chase/portfolio/fairway-ios
xcodebuild build -project Fairway.xcodeproj -scheme Fairway \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO
```

## Roadmap

- Phase 2: App icon (1024×1024, Augusta green + sprinkler arc)
- Phase 3: Local notifications for maintenance reminders
- Phase 4: Photo attachment for sprinkler heads (camera integration)
- Phase 5: iCloud sync stub
