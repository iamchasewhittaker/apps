# Fairway iOS — Changelog

## [Unreleased]

### Added — 2026-04-24 — Rachio API Integration (v1, read-only)
- `Services/RachioKeychain.swift` — Security framework wrapper, service `com.chasewhittaker.Fairway`, account `rachio_personal_access_token`, `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`
- `Services/RachioAPI.swift` — async URLSession client for Rachio v1 (`https://api.rach.io/1/public`): `fetchPersonInfo`, `fetchPerson(id:)`, `fetchEvents(deviceId:from:to:)`; typed `RachioError` (unauthorized/noDevices/http/network/decoding/missingToken)
- `Services/RachioDTOs.swift` — internal Codable response types (`RachioDTO` namespace) kept separate from app models so upstream shape changes don't corrupt persisted blobs
- `Models/RachioState.swift` — persisted snapshot: `personId`, `deviceId`, `deviceName`, `lastSyncAt`, `zones`, `scheduleRules`, `flexScheduleRules`, `recentEvents`, `zoneLinks` (Fairway zone number → Rachio zone id); computed `allScheduleRules`, `rachioZoneId(forFairwayZone:)`, `scheduleRules(forRachioZoneId:)`
- `Views/RachioSettingsView.swift` — SecureField token entry → `Verify & Connect` → device picker (single device auto-selects) → connected view with device info, sync button, zone-link pickers (Fairway Z1–Z4 ↔ Rachio zones), Disconnect
- `Views/RachioHistoryView.swift` — events grouped by day, zone-number pills, duration formatting, relative last-sync label, toolbar sync button
- `FairwayConfig.swift` — `rachioAPIBase`, `rachioInitialHistoryDays = 90`, `rachioMaxStoredEvents = 500`
- `FairwayBlob.swift` — `var rachio: RachioState? = nil` (optional → legacy blobs decode unchanged)
- `FairwayStore.swift` — observable `rachioSyncing`, `rachioLastError`; `hasRachioToken`, `rachioIsConnected`, `verifyRachioToken`, `completeRachioConnection`, `syncRachio`, `disconnectRachio`, `setRachioZoneLink`; auto-links matching zone numbers on connect; 1-day overlap window on incremental sync; event dedup by id, sorted DESC, capped at 500
- `Views/ContentView.swift` — "Integrations" section in MoreView with NavigationLinks to Rachio Sync + Watering History
- `Views/ScheduleView.swift` — read-only "Rachio says" mirror card showing live schedule rules (name, status badge, start time, run minutes, schedule type) when the Fairway zone is linked
- `FairwayTests/RachioDecodeTests.swift` — 7 tests: PersonInfo decode, Person device tree decode, schedule status labels, event mapping + fallback id, legacy blob migration (no `rachio` field), zone-link lookup
- `Fairway.xcodeproj/project.pbxproj` — 7 new files registered under FW037–FW03D

### Security
- Token is entered only via `SecureField`, validated via `/person/info`, then written to Keychain. Never persisted in `UserDefaults`, `FairwayBlob`, logs, or committed files.
- On 401: Keychain cleared, `rachioLastError` surfaced for reconnect, last-known snapshot preserved.

### Verification
- Swift typecheck clean across all sources (`xcrun swiftc -typecheck`) — MainActor isolation resolved by annotating `RachioSettingsView` + `RachioHistoryView` structs `@MainActor`
- `xcodebuild build` not runnable on this machine (iOS 17.2 simulator runtime not installed); runtime verification steps 2–7 (first-run flow, sync, zone linking, bad token, persistence, migration) deferred to a machine with simulator installed

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
