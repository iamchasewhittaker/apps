# Fairway (iOS) — Project Instructions

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


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

docs/
  Sprinklers Google Earth (1).kml  ← CURRENT 41-pin Google Earth export (2026-04-25)
  Sprinklers.kml                   ← legacy 23-pin export (2026-04-24, archived)
  heads/
    property-overhead.jpg          ← Google Earth top-down screenshot with original 23 pins labeled
    sprinklers.json                ← generated manifest (run tools/import-kml.py)
    Z2-S7..Z2-S18/                 ← 12 front-yard color-named pins
    Z2-MATCH-1st..6th/             ← 6 numbered park-strip pins (visual match pending)
    Z3-S1..Z3-S11/                 ← 11 side-yard red pins, N→S
    Z4-S1..Z4-S12/                 ← 12 back-yard no-color pins, N→S
    <label>/
      photo-1.jpg                  ← top-down nozzle close-up
      photo-2.jpg                  ← placement-wide shot
      photo-3.jpg                  ← sprinkler running (arc + direction)
    PHOTO_AUDIT.md                 ← nozzle ID, defects, arc/bearing per head (pending)
    COVERAGE_ANALYSIS.md           ← haversine spacing analysis (pending)
    PROPERTY_PLACEMENT.md          ← cross-reference coords + photos + overhead (pending)
    RENAME_MAP.md                  ← KML rename mapping for Google Earth re-import (pending — see SESSION_START_KML_REIMPORT.md)
  SESSION_START_KML_REIMPORT.md    ← copy-paste kickoff prompt for fresh chat to finish 2026-04-25 work

tools/
  import-kml.py                    ← parses current KML → migrates legacy folders → downloads photos → writes manifest
  rewrite-kml-labels.py            ← rewrites <name> tags in current KML for Google Earth re-import (pending)
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

> **Pre-build (2017 MBP · Ventura · Xcode 15.2):** Mount the iOS 17.2 runtime DMG once per session before any `xcodebuild` call — see root `CLAUDE.md § iOS Build Prerequisite`.

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
10. **Heads are irrigation hardware only** — never store per-head fertilizer history on `HeadData`. Fertilizer applications live at the zone or product level (`InventoryItem.usageLog`, `FertApplication.zoneNumbers`). Don't add fert fields to head detail UI.

## Sprinkler Head Data — KML Source

Chase exported every sprinkler head location + photos from Google Earth into a single KML file. The newest export (2026-04-25) is the source of truth.

**Source files:**
- **`docs/Sprinklers Google Earth (1).kml`** — **CURRENT source, 41 placemarks** (Zone 2: 18, Zone 3: 11, Zone 4: 12). Source for `import-kml.py`.
- `docs/Sprinklers.kml` — legacy 23-placemark export (2026-04-24); kept for archival reference only, no longer parsed.
- `docs/heads/property-overhead.jpg` — Google Earth top-down screenshot with the original 23 pins labeled.
- `docs/heads/sprinklers.json` — generated manifest (run `tools/import-kml.py` to regenerate).
- `docs/heads/<label>/photo-N.jpg` — downloaded head photos (run `tools/import-kml.py`).

**Zone assignment rule:**
- RED pins (`#d32f2f`) → Zone 3 (side yard)
- No-color / unknown-color pins → Zone 4 (back yard)
- Every other color (black, blue, grey, yellow, green) → Zone 2 (front yard + park strip, single valve)

**Label scheme — standardized to `Z*-S*` (2026-04-25):**
- Zone 2 numbered park-strip pins (`1st Sprinkler`..`6th Sprinkler`) → `Z2-MATCH-1st..6th` *(visual matching to seeded `Z2-S1..Z2-S6` heads still pending — see anchors below)*
- Zone 2 color-named front-yard pins → `Z2-S7..Z2-S18`, sorted N→S by latitude. KML name stored in `notes` as `"KML pin: <name>"`.
- Zone 3 red side-yard pins → `Z3-S1..Z3-S11`, sorted N→S. Legacy migration: `H3-N` ↔ `Z3-S{N+6}`, i.e. `H3-1`→`Z3-S7`, `H3-2`→`Z3-S8`, `H3-3`→`Z3-S9`, `H3-4`→`Z3-S10`, `H3-5`→`Z3-S11`.
- Zone 4 no-color back-yard pins → `Z4-S1..Z4-S12`, sorted N→S. Replaces the original 3-head `H4-1..H4-3` "East Side" placeholder (which never matched a real valve).

**Visual anchors for Z2-MATCH numbered-pin matching:**
- `Z2-S5` = MP Rotator blue cap (distinctive; only head with blue nozzle color on it)
- `Z2-S6` = erosion pit / buried head (bowl-shaped depression, head sits ~4-5" low)

**Photo carousel convention (3 photos per head, Z2 confirmed):**
1. Top-down close-up of nozzle (for hardware ID)
2. Wider shot showing placement against house / sidewalk / driveway / park strip
3. Sprinkler running with visible water spray (for arc + direction)

**Photo download:** `earth.usercontent.google.com` URLs are publicly accessible — no auth needed. Use s1024 size for nozzle-marking legibility. Run `python3 tools/import-kml.py` from `portfolio/fairway-ios/`. The script:
- Migrates legacy `H3-{1..5}` photo folders to `Z3-S{7..11}` (idempotent — safe to re-run)
- Skips already-downloaded photos
- Regenerates `docs/heads/sprinklers.json` every run

**HeadData.photoPaths:** `[String]` field. Bundle-relative paths, e.g. `"heads/Z3-S7/photo-1.jpg"`. Default empty array — Codable migration automatic.

**Known corrections / TODOs:**
- Z2-S1 seed nozzle = "Brass adjustable" → photo 1 shows Rain Bird VAN yellow (4 ft radius). Fix in PreviewData.swift during photo audit.
- All 6 new Z3 heads (`Z3-S1..Z3-S6`) and all 12 Z4 heads (`Z4-S1..Z4-S12`) need per-head nozzle/arc/GPM data filled via in-app head detail editor.
- Visual matching of `Z2-MATCH-1st..6th` → `Z2-S1..Z2-S6` still pending.

## References

- Soil test: `docs/soil-test-april-2026.pdf`
- Jimmy Lewis email: `docs/jimmy-lewis-email-apr-2026.eml`
- Original irrigation spec: `docs/original-claude-spec.md`
- Original zone analysis: `docs/original-handoff.md`
- KML data (current): `docs/Sprinklers Google Earth (1).kml`
- KML data (legacy, archived): `docs/Sprinklers.kml`
- 2026-04-25 KML reimport plan: `/Users/chase/.claude/plans/i-have-a-new-cheeky-nova.md`
- 2026-04-25 reimport handoff + kickoff prompt: `docs/SESSION_START_KML_REIMPORT.md`
- KML import tool: `tools/import-kml.py`
- Store pattern: `portfolio/unnamed-ios/Unnamed/Services/AppStore.swift`
- Portfolio conventions: `/CLAUDE.md`
