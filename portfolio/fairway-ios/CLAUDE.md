# Fairway (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) and `docs/BRANDING.md`.

## App Identity

- **Display name:** Fairway
- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.Fairway`
- **Storage key:** `chase_fairway_ios_v1`
- **Stack:** SwiftUI + iOS 17 + `@Observable` + `UserDefaults` + Codable — no SwiftData, no external deps
- **Xcode project prefix:** `FW` (UUIDs, build refs)
- **Xcode project:** `Fairway.xcodeproj` (hand-crafted `project.pbxproj`)
- **Per-app handoff:** [HANDOFF.md](HANDOFF.md)
- **Branding:** [docs/BRANDING.md](docs/BRANDING.md)

## What This App Is

A full lawn management OS for a 4-zone Rachio irrigation system in Vineyard, UT.
Masters grounds crew precision — every zone dialed in, every application tracked.

Covers: irrigation zones + sprinkler heads + problem areas + Rachio schedules +
fertilizer season plan + soil test data + product inventory + spreader calculator +
shrub bed upkeep + maintenance tasks + mow log.

Source documents in `docs/`: soil test (Jimmy Lewis, April 2026), Kentucky Bluegrass email chain.

## File Structure

```
Fairway.xcodeproj/
  project.pbxproj      ← hand-crafted, FW* UUID prefix

Fairway/
  FairwayApp.swift     ← @main, store init, environment injection
  FairwayBlob.swift    ← root Codable struct (all app data)
  FairwayConfig.swift  ← bundle ID, storage key, constants
  FairwayStore.swift   ← @Observable @MainActor store, load/save/seed
  FairwayTheme.swift   ← color tokens (Augusta green palette), badge helpers
  PreviewData.swift    ← mock FairwayBlob with all 4 zones pre-seeded
  Models/
    ZoneData.swift
    HeadData.swift
    ProblemData.swift
    ScheduleData.swift
    SoilTestData.swift
    FertilizerData.swift
    MaintenanceData.swift
    InventoryData.swift
    RachioState.swift          ← persisted Rachio snapshot: personId, deviceId, zones, scheduleRules, recentEvents, zoneLinks
  Services/
    RachioKeychain.swift     ← Security framework Keychain wrapper (service=com.chasewhittaker.Fairway, account=rachio_personal_access_token)
    RachioAPI.swift          ← async URLSession client for Rachio v1 API (fetchPersonInfo, fetchPerson, fetchEvents)
    RachioDTOs.swift         ← internal Codable wire types (RachioDTO namespace) — separate from persisted models
  Views/
    ContentView.swift        ← TabView: Zones / Lawn / Soil / Maintenance / More; "Integrations" section in MoreView
    ZoneListView.swift       ← 4 zone cards with status dots
    ZoneDetailView.swift     ← Heads/Problems/Schedule (+ Beds for Zone 1)
    HeadInventoryView.swift  ← head list + add/edit
    HeadDetailView.swift     ← full head record: issues, radius, GPM, season test toggle; toolbar pin button (HeadPinEditor)
    ProblemAreaView.swift    ← problem list + add/edit with PRE-SEASON badges
    ScheduleView.swift       ← Rachio params display + "Rachio says" mirror card (linked zones only)
    ShrubBedView.swift       ← Bed A/B/C with plants + upkeep tasks
    FertilizerView.swift     ← season plan timeline + product links + Shed inventory
    InventoryView.swift      ← products + equipment, stock log, service history
    SpreaderCalcView.swift   ← product + zone + spreader → lbs, bags, refills, dial
    SoilTestView.swift       ← nutrient bar chart + findings
    MaintenanceView.swift    ← task list + reminders + season test checklist
    MowLogView.swift         ← quick-add mow entries
    RachioSettingsView.swift ← SecureField token entry → Verify & Connect → zone-link pickers → Disconnect
    RachioHistoryView.swift  ← events grouped by day with zone pills + toolbar sync button
    HeadPinEditor.swift      ← WIP (MapKit) — drag-handle pin editor for bearing + arc sweep (committed, unverified)

FairwayTests/
  FairwayBlobTests.swift
  RachioDecodeTests.swift    ← 7 tests: PersonInfo, Person+device tree, schedule status, event mapping, legacy migration, zone-link lookup
```

## Architecture

- `@Observable @MainActor FairwayStore` — single store injected via `.environment(store)`
- `nonisolated init()` on the store for `@State private var store = FairwayStore()` in App
- `@Environment(FairwayStore.self)` in all views
- All data is `Codable` structs — never `[String: Any]`
- Single JSON blob at `UserDefaults` key `chase_fairway_ios_v1`
- `seedIfNeeded()` called on first launch to pre-populate all 4 zones

## Name Candidates Considered

Greenkeeper, **Fairway** (chosen), Verdant, Stripe

## Build Commands

```bash
# Build for simulator
xcodebuild build \
  -project Fairway.xcodeproj \
  -scheme Fairway \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO

# Run tests
xcodebuild test \
  -project Fairway.xcodeproj \
  -scheme FairwayTests \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO
```

## Key Business Rules

1. Any head/problem with `isPreSeason: true` must show amber "PRE-SEASON" badge
2. Confirmed problems show red "CONFIRMED" badge
3. Zone 1 detail has a 4th tab: "Beds" (Shrub beds A/B/C)
4. Grass zones (2/3/4) have 3 tabs: Heads / Problems / Schedule
5. Cycle & Soak is critical for Utah clay soil — all schedules default to it
6. Fertilizer date windows are calibrated for Vineyard, UT (zone 6b)
7. **Rachio token lives in Keychain only** — never in UserDefaults, FairwayBlob, logs, or committed files. Entered via SecureField, validated, then written with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`. On 401: Keychain cleared, last-known snapshot preserved.
8. **Z2 (Front yard + park strip) is a single valve** — any Z2 irrigation or fert application covers the park strip automatically. Always call this out explicitly.
9. **Spreader calculator is necessary but not sufficient** — always run 100 sq ft TARE calibration before applying any product. Log calibration result on `InventoryItem` before logging `FertApplication`.

## References

- Soil test: `docs/soil-test-april-2026.pdf`
- Jimmy Lewis email: `docs/jimmy-lewis-email-apr-2026.eml`
- Original irrigation spec: `docs/original-claude-spec.md`
- Original zone analysis: `docs/original-handoff.md`
- Store pattern: `portfolio/unnamed-ios/Unnamed/Services/AppStore.swift`
- Portfolio conventions: `/CLAUDE.md`
