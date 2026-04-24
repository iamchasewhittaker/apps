# Fairway iOS — Changelog

## [Unreleased]

### Planned (approved 2026-04-23 — execute in next chat)
- Log IFA Crabgrass Preventer + Lawn Food (23-3-8) inventory item with calibration-failure note
- Log 2026-04-23 `FertApplication` (17.8 lb on Z2/Z3/Z4) flagging the 62% over-application
- Append usage entry decrementing IFA stock to 7.2 lb
- Catalog 6 Z2 park-strip Hunter Pro-Spray heads (Z2-S1 through Z2-S6) with GPS coordinates from Google Earth
- Add `ProblemArea` on Z2: "Mixed precip rate (3-5× spread)"
- Add 9 `MaintenanceTask` entries: water-in, no-aerate-12wk, daily-burn-check, late-June half rate, October overseed, measure-strip + verify S5 cap, order MP nozzles, S6 dig-out, MP install + tune
- Reference: `/Users/chase/.claude/plans/what-went-wrong-here-playful-lemur.md`

### WIP on `main` (uncommitted, separate session)
- `Fairway/Views/HeadPinEditor.swift` (new, 270 lines) — MapKit-based pin editor with drag handles for bearing + arc sweep
- `Fairway/Views/HeadDetailView.swift` — toolbar pin button + `.fullScreenCover` integration
- `Fairway.xcodeproj/project.pbxproj` — registers HeadPinEditor

## [0.1.0] — 2026-04-18

### Added
- Initial project scaffold
- All data models: ZoneData, HeadData, ProblemData, ScheduleData, SoilTestData, FertilizerData, MaintenanceData, InventoryData
- FairwayBlob root Codable struct
- FairwayStore @Observable store with seedIfNeeded()
- FairwayTheme with Augusta green palette
- Pre-seeded data: all 4 zones, heads, problems, schedules, soil test, fertilizer plan, inventory, maintenance tasks
- 5-tab layout: Zones / Lawn / Soil / Maintenance / More
- PRE-SEASON (amber) and CONFIRMED (red) badge system
- Spreader calculator: product + zone → lbs needed, bags to buy, HHS100 fills
- Soil test nutrient display with 13 readings
- Shrub bed tracking for Zone 1 (Beds A, B, C)
- Inventory management with stock log and service history
- Fertilizer season timeline with Vineyard UT date windows
- Maintenance task list with season test checklist
- Mow log
- xcodebuild BUILD SUCCEEDED (fixed @MainActor isolation + specifier: String format errors)
