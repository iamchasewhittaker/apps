# Fairway (iOS) — Handoff

## State

| Field | Value |
|-------|-------|
| Version | v0.1 |
| Status | 🟡 Pre-Season Audit live. 41 heads audited from photos. BUILD SUCCEEDED. Device install needed. |
| Last session | 2026-04-25 (photo audit + PreSeasonAuditView shipped; all docs updated) |
| Focus | **Install on device + field walk with the audit**. 9 heads blocked (Z4-S1 highest priority — fully buried). |
| Bundle ID | `com.chasewhittaker.Fairway` |
| Storage key | `chase_fairway_ios_v1` |
| PBX prefix | `FW` |
| Xcode project | `Fairway.xcodeproj` |
| Plan | `/Users/chase/.claude/plans/i-have-a-new-cheeky-nova.md` |

---

## ✅ 2026-04-25 Verification Session — COMPLETE

All sim verification done. Three pre-existing production bugs found and fixed.

### Tests (iPhone 15 simulator) — EXIT:0

All tests pass including:
- `test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard`
- `testPreSeasonFlagsCorrect` (updated for new Z4 shape)
- `testHeadDataMissingGeoFieldsDecodes`
- `testV1BlobDecodesIntoV2WithDefaults`
- All 7 `RachioDecodeTests`

### Bugs fixed this session

| File | Bug | Fix |
|------|-----|-----|
| `Fairway/Views/PropertySettingsView.swift` | Swift concurrency errors — `@MainActor`-isolated store properties accessed from non-isolated `@ViewBuilder` contexts | Added `@MainActor` to struct declaration |
| `Fairway/Models/HeadData.swift` | `keyNotFound` for `photoPaths` — synthesized decoder requires non-optional keys even with default values; crashes on existing app data | Added `extension HeadData { init(from:) }` using `decodeIfPresent` for all newer fields |
| `Fairway/FairwayBlob.swift` | `keyNotFound` for `observations`/`waterRuns`/`fertApplications` — same synthesized-decoder issue on v1 blobs | Added `extension FairwayBlob { init(from:) }` using `decodeIfPresent` for all newer array fields |

### Device build (iPhone 12 Pro Max) — EXIT:0

Built at:
```
/Users/chase/Library/Developer/Xcode/DerivedData/Fairway-cyxzigzaafugeyglqvaezxwbmdxr/Build/Products/Debug-iphoneos/Fairway.app
```

### Device install + smoke test — ✅ COMPLETE (2026-04-25)

Installed on iPhone 12 Pro Max. Chase confirmed:
- Zone 3 = 11 heads Z3-S1..Z3-S11 ✅
- Zone 4 = "Back Yard" + 12 Z4-S1..Z4-S12 ✅

---

## 2026-04-25 KML Reimport — Zone 3 expansion + Zone 4 (Back Yard) seed

**Plan:** `/Users/chase/.claude/plans/i-have-a-new-cheeky-nova.md`
**Kickoff prompt for fresh chat:** [docs/SESSION_START_KML_REIMPORT.md](docs/SESSION_START_KML_REIMPORT.md)

Chase exported a new Google Earth KML at `docs/Sprinklers Google Earth (1).kml` (41 placemarks, replacing the old 23-pin `docs/Sprinklers.kml`):
- **Zone 2 unchanged** (18 pins — same 6 numbered park-strip + 12 color-named front yard)
- **Zone 3 grew 5 → 11** (red pins, side yard) — old 5 are at the same lat/lon, plus 6 new red pins further north
- **Zone 4 NEW = Back Yard** (12 white/no-color pins) — replaces the 3-head "East Side" placeholder

Decisions locked in interview:
1. Zone 4 = "Back Yard" (replace 3 H4 placeholders with 12 KML pins)
2. Standardize labels to `Z*-S*` — existing `H3-*` rename to `Z3-S*`, `H4-*` rename to `Z4-S*`. Z2 keeps `Z2-S*`.
3. Renumber Zone 3 N→S — old `H3-1..H3-5` slide to `Z3-S7..Z3-S11`
4. Rewrite KML `<name>` tags + emit a `RENAME_MAP.md` for human verification before Chase re-imports to Google Earth

### LANDED 2026-04-25 (do NOT redo)

- ✅ **`tools/import-kml.py` rewritten:**
  - Source switched to `docs/Sprinklers Google Earth (1).kml`
  - New color rule: `red` → Z3, `no-color` → Z4, else → Z2
  - New label scheme: `Z3-S1..Z3-S11`, `Z4-S1..Z4-S12` (sorted N→S by lat); Z2 unchanged
  - Idempotent legacy folder migration: renames `docs/heads/H3-{1..5}` → `docs/heads/Z3-S{7..11}` before downloads
- ✅ **`python3 tools/import-kml.py` ran clean** — 41 placemarks parsed: Z2 front-yard=12, Z2 park-strip=6, Z3=11, Z4=12. All 5 legacy `H3-*` photo folders moved to `Z3-S{7..11}/`. 6 new `Z3-S{1..6}/` folders + 12 new `Z4-S{1..12}/` folders downloaded fresh (3 photos each = 54 new photos). Manifest regenerated at `docs/heads/sprinklers.json` (41 heads, 126 photos total).
- ✅ **`Fairway/CLAUDE.md` updated** — Sprinkler Head Data section rewritten: new KML source + color/zone rule + `Z*-S*` label scheme + legacy `H3-N`↔`Z3-S{N+6}` map; file-tree under `docs/` updated to show new folder layout.

### COMPLETED 2026-04-25 (continuation session) ✅

- ✅ **`tools/rewrite-kml-labels.py` written + run** — 41 placemarks rewritten, `RENAME_MAP.md` has 41 rows, second run is a no-op.
- ✅ **`Fairway/PreviewData.swift`** — `zone3()` expanded to 11 heads `Z3-S1..Z3-S11` (photo counts from manifest: Z3-S1=2, Z3-S2=4, rest=3). `zone4()` renamed "Back Yard", 12 Z4-S* heads, 3 pre-season problem stubs (H4-1 overspray made-up problem removed).
- ✅ **`Fairway/FairwayStore.swift`** — `applyPhase1ZoneMigrationIfNeeded()` added (sync, called from `load()` after Phase 0). Three idempotent ops: H3→Z3-S rename, Z3-S1..S6 append, Z4 "East Side" reseed with UUID preservation.
- ✅ **`FairwayTests/FairwayBlobTests.swift`** — `test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard()` added; `testPreSeasonFlagsCorrect` updated to match new Z4 shape.

### STILL NEEDED

1. **Connect iPhone 12 Pro Max** → run install command above → manual smoke test (see SESSION_START_NEXT.md)
2. **Google Earth re-import (Chase manual):** open `docs/Sprinklers Google Earth (1).kml` in Google Earth web → confirm all 41 pins show `Z*-S*` labels.
3. **Docs-sweep** (future session): PHOTO_AUDIT.md, COVERAGE_ANALYSIS.md, PROPERTY_PLACEMENT.md
4. **Phase 1 Map bug fix** — PropertySettings.swift + MapTabView.swift (spec in Phase 1 section below)

### Reference data — final label assignments

**Zone 3 (red, N→S)** — 11 heads, 5 inherit existing data:
| Label | KML pin | lat | lon | Was |
|-------|---------|-----|-----|-----|
| Z3-S1  | b yellow | 40.3005347 | -111.7457402 | NEW |
| Z3-S2  | b yellow | 40.3005192 | -111.7456873 | NEW |
| Z3-S3  | b black  | 40.3004960 | -111.7457237 | NEW |
| Z3-S4  | B black  | 40.3004951 | -111.7456180 | NEW |
| Z3-S5  | B Black  | 40.3004731 | -111.7456258 | NEW |
| Z3-S6  | b black  | 40.3004648 | -111.7456645 | NEW |
| Z3-S7  | b blue   | 40.3004549 | -111.7457087 | H3-1 |
| Z3-S8  | b red    | 40.3004432 | -111.7456787 | H3-2 |
| Z3-S9  | b red    | 40.3003941 | -111.7456939 | H3-3 |
| Z3-S10 | b red    | 40.3003882 | -111.7456666 | H3-4 |
| Z3-S11 | B bred   | 40.3003639 | -111.7456812 | H3-5 |

**Zone 4 (no-color, N→S)** — 12 heads, all NEW:
| Label | KML pin | lat | lon |
|-------|---------|-----|-----|
| Z4-S1  | b       | 40.3005814 | -111.7455280 |
| Z4-S2  | b       | 40.3005727 | -111.7455550 |
| Z4-S3  | b       | 40.3005673 | -111.7455952 |
| Z4-S4  | b       | 40.3005565 | -111.7456476 |
| Z4-S5  | b black | 40.3005493 | -111.7456776 |
| Z4-S6  | b red   | 40.3005471 | -111.7455115 |
| Z4-S7  | b black | 40.3005394 | -111.7455526 |
| Z4-S8  | b red   | 40.3005263 | -111.7455313 |
| Z4-S9  | b black | 40.3005193 | -111.7455873 |
| Z4-S10 | b red   | 40.3005121 | -111.7456198 |
| Z4-S11 | b black | 40.3005096 | -111.7455064 |
| Z4-S12 | b black | 40.3004866 | -111.7455012 |

### Out of scope (separate plans)

- Visual matching of `Z2-MATCH-1st..6th` → `Z2-S1..Z2-S6` (still pending; see 2026-04-24 session below)
- Per-head nozzle/arc/GPM data for the new 17 heads (Chase fills via in-app head detail editor as he walks the property)
- HeadPinEditor MapKit work (separate WIP)
- Rachio zone-link reconfiguration (zones unchanged in count — still 4)

---

## Active Plan (10 phases, approved 2026-04-24)

**Full plan:** `/Users/chase/.claude/plans/on-fairway-the-map-stateless-plum.md`

**Companion data plan:** `/Users/chase/.claude/plans/what-went-wrong-here-playful-lemur.md`

### Phase 0 — Data entry ✅ DONE (2026-04-24)

All 14 steps from companion plan executed. Changes in:
- `Fairway/PreviewData.swift` — Phase 0 public helpers + updated seed
- `Fairway/FairwayStore.swift` — `applyPhase0MigrationIfNeeded()` called from `load()`

**What shipped:**
- `phase0Z2Heads()` — 6-head catalog Z2-S1..S6 replacing legacy H2-1..H2-6 seed
- `phase0Z2MixedPrecipProblem()` — High severity, confirmed 2026-04-23
- `phase0IFAItem(id:)` — IFA Crabgrass Preventer + Lawn Food 23-3-8; 25 lb bag; 7.2 lb remaining; Spyker HHS100 dial 3.5 setting (with over-app warning); usage log 17.8 lb on 2026-04-23
- `phase0IFAApplication(ifaID:)` — FertApplication 2026-04-23, 62% over-app notes
- `phase0RecoveryTasks()` — 9 tasks: water-in, no-aerate barrier, daily burn check, late-June half-rate, October overseed, measure-strip, order nozzles, S6 dig-out, MP install + tune
- `FairwayStore.applyPhase0MigrationIfNeeded()` — idempotent backfill for Chase's existing install (seeded: true)

### KML Ingestion Progress (2026-04-24, second session)

**Source edits — DONE this session:**
- `Fairway/PreviewData.swift` — `phase0Z2Heads()` now returns 18 heads:
  - **Z2-S1..S6** rewritten with lat/lon/photoPaths from `Z2-MATCH-1st`..`Z2-MATCH-6th/`
  - **Z2-S1** corrected: nozzle "Rain Bird VAN yellow", `radiusFeet: 4` (was "Brass adjustable")
  - **Z2-S3** refined: nozzle "Rain Bird 1555 fixed spray (dark nozzle)" (was "Brass radius-screw")
  - **Z2-S5** corrected: `isConfirmed: false`, nozzle "TBD — nozzle slot empty in photo (dirt-packed)", `issues: [.cloggedNozzle]`, note explains prior MP Rotator claim was wrong (was `isConfirmed: true`, MP Rotator)
  - **Z2-S7..S18** appended (12 new heads): generic Hunter Pro-Spray, nozzle "TBD — confirm during season test", arc 180°, `isConfirmed: false`, KML pin name in `notes`, lat/lon/photoPaths from `sprinklers.json`
- `phase0Z2MixedPrecipProblem()` description updated — drops the "S5 already MP Rotator" premise; reframes around 3 nozzle families across S1–S6 (VAN yellow / 1555 fixed spray / empty slot)
- `zone3()` H3-1..H3-5 each gained lat/lon/photoPaths from `sprinklers.json` + KML pin name in notes (all 5 use final `H3-N/photo-N.jpg` paths)
- `FairwayTests/FairwayBlobTests.swift` +2 tests:
  - `testHeadDataPhotoPathsRoundTrip` — encode/decode HeadData with 3 photoPaths, asserts equal
  - `testZone2HasEighteenSeededHeads` — asserts `phase0Z2Heads().count == 18`, first label `Z2-S1`, last `Z2-S18`, all have coordinates + photoPaths

**Decisions locked this session:**
- **Photo dir naming for park strip stays `Z2-MATCH-1st..6th/`** (NOT renamed to `Z2-S1/`..`Z2-S6/`). Rationale: provisional matching needs Chase field confirmation, especially the Z2-S5 anomaly. Renaming now is destructive if matching changes; one `git mv` per dir is the cleanup once confirmed.
- **Z2-S5 corrected from photo evidence** — photo-1 of `Z2-MATCH-5th/` shows Hunter Pro-Spray with empty dirt-packed nozzle slot, no MP Rotator. Seed claim overridden.

**⚠️ Anomaly — Z2-S5 MP Rotator:** Seed previously claimed "already confirmed MP Rotator (blue cap)" but photo-1 shows empty nozzle slot. Now reflected in seed (`isConfirmed: false`, nozzle "TBD — nozzle slot empty"). Field-confirm to either restore confirmation (with correct nozzle) or update mapping if 5th Sprinkler ≠ Z2-S5.

**Build/test status:**
- `xcrun simctl list devices available` confirmed iOS 17.2 simulator runtime still unavailable on this machine — same blocker as last session.
- All edits verified via inspection (HeadData memberwise initializer arg order matches struct declaration). No `xcodebuild build` or `xcodebuild test` run.

**Still needed (next session):**
- Install iOS 17.2 simulator runtime → `xcodebuild build` + `xcodebuild test`
- Generate `docs/heads/PHOTO_AUDIT.md` (read photo-1/2/3 of all 23 heads via Read tool — nozzle ID, defects, arc inference, placement context)
- Generate `docs/heads/COVERAGE_ANALYSIS.md` (haversine spacing from `sprinklers.json` lat/lon; flag gaps >20 ft, overlaps <5 ft)
- Generate `docs/heads/PROPERTY_PLACEMENT.md` (cross-ref photo-2 landmarks + overhead + coords; per-head placement description)
- Chase field-confirm provisional Z2 matching, especially Z2-S5
- Once Z2 matching confirmed: `git mv docs/heads/Z2-MATCH-1st docs/heads/Z2-S1` (etc.) + update `photoPaths` in `phase0Z2Heads()`

---

### Phase 1 — Map bug fix (NEXT)

**Root cause:** `MapTabView` initializes `cameraPosition` once in `onAppear`. No validation on `(0,0)` coordinates → renders Atlantic Ocean when `PropertySettings.latitude == 0`.

**Files to change:**

| File | Change |
|------|--------|
| `Fairway/Models/PropertySettings.swift` | Add `var hasValidCoordinates: Bool { abs(latitude) > 0.0001 && abs(longitude) > 0.0001 && abs(latitude) <= 90 && abs(longitude) <= 180 }` |
| `Fairway/Services/Geocoder.swift` | Reject `(0,0)` results — bubble error instead of silently saving |
| `Fairway/Views/MapTabView.swift` | Guard `property.hasValidCoordinates` before rendering; empty state + "Re-geocode" button when invalid; `.onChange(of: store.blob.property?.latitude)` + longitude to recompute camera reactively; extract `makeRegion(for:)` helper |
| `Fairway/Views/PropertySettingsView.swift` | Post-geocode preview card; "Drag to adjust" mode (reuse `HeadPinEditor` pattern) to fine-tune pin before save |
| `Fairway/FairwayStore.swift` | Self-heal in `seedIfNeeded()`: if `property != nil && !property.hasValidCoordinates`, attempt re-geocode; on failure, null out coords and surface persistent banner |

**Expected behavior after fix:**
- Opening map with invalid coordinates → empty state with "Re-geocode address" button, not Atlantic Ocean
- Editing address in Settings → map tab reflects new location without app restart
- Confirm-pin preview lets Chase drag to exact rooftop before save

---

### Phase 2 — Zone 2 sub-zone concept

**Goal:** Separate park strip from main grass within Z2's single valve. Sub-zones share the valve runtime but get their own precip rate, target minutes, heads, and problems.

**New file:** `Fairway/Models/GrassSubZoneData.swift`
```swift
struct GrassSubZone: Codable, Identifiable, Hashable {
    var id: UUID = UUID()
    var label: String               // "Park strip", "Main grass"
    var squareFootage: Int
    var microclimate: Microclimate = .standard
    var headIDs: [UUID] = []        // references into ZoneData.heads
    var problemAreas: [ProblemData] = []
    var targetRunMinutes: Int?      // nil → inherit zone default
    var precipRateInPerHour: Double?
    var notes: String = ""
}
enum Microclimate: String, Codable { case standard, parkStrip, slope, shade }
```

**Modified files:**
- `ZoneData.swift` — add `var subZones: [GrassSubZone] = []`
- `PreviewData.swift` — seed Z2 with two sub-zones: "Main grass" (~700 sq ft, S1) and "Park strip" (~328 sq ft, S2–S6, parkStrip microclimate, +30% target run vs main)
- `ZoneDetailView.swift` — segmented picker "All / Main grass / Park strip"; filter heads + problems by sub-zone
- `ScheduleView.swift` — per-sub-zone target minutes + `max(subZones.target)` valve runtime + amber callout on over-watered sub-zones
- `MapTabView.swift` — different stroke color per sub-zone; filter dropdown

**Key invariant:** Z2 is a single valve. Effective runtime = `max(subZones.targetRunMinutes ?? 0)`. Separate "schedules" don't exist at the hardware level.

---

### Phase 3 — Schedule: hybrid ET + manual override

**New service:** `Fairway/Services/ETCalculator.swift`
- Requires WeatherKit capability + entitlement (`com.apple.developer.weatherkit`) in `Fairway.entitlements`
- Hargreaves ET₀: `0.0023 × Ra × (T_mean + 17.8) × sqrt(T_max - T_min)`
- Crop coefficient Kc: KBG 0.70 spring / 0.80 peak summer / 0.65 fall
- Runtime: `(ET₀ × Kc × 7d - effective_rainfall) ÷ precip_rate × 60`, split across cycles
- Cache by zip + ISO week; refresh on first open each Monday

**Model changes:**
- `ScheduleData.swift` — add `etTargetMinutes`, `etLastComputedAt`, `userOverrideMinutes`, computed `effectiveMinutes`

**View changes:**
- `ScheduleView.swift` — "Why this number?" expander: ET₀, Kc, rainfall, precip rate, total minutes, cycles; override slider ±50%

---

### Phase 4 — Problem auto-detection

**New service:** `Fairway/Services/ProblemDetector.swift`

7 detection rules (idempotent, titles prefixed `[auto]`):
1. Mixed precip rate — heads spanning nozzle families with >2× ratio
2. Buried/tilted head — `issues.contains(.tiltedHead || .buriedHead)`
3. Coverage gap symptom ring — `issues.contains(.coverageGap)`
4. Overspray onto hardscape
5. Nozzle type unknown post-season-test
6. GPM vs zone size mismatch (<0.3 or >2.5 in/hr)
7. Head count vs coverage (<1 head per 200 sq ft)

**View changes:**
- `ProblemAreaView.swift` — `[auto]` problems show wand icon + "Auto-detected" chip; dismissal sets `acknowledged: true`
- `ZoneDetailView.swift` — "Run detection" button + last-scanned timestamp

**Model changes:**
- `ProblemData.swift` — add `isAutoDetected: Bool = false`, `acknowledged: Bool = false`, `ruleID: String? = nil`

---

### Phase 5 — Maintenance templates

**New files:**
- `Fairway/Models/MaintenanceTemplate.swift`
- `Fairway/Services/MaintenanceTemplateLibrary.swift`
- `Fairway/Views/TemplatedTaskSheet.swift`

**Library items to seed:** season-test-run (8 steps), fertilizer-round (calibration-first), pre-emergent-water-in, burn-check (daily), aeration-dethatch (post-barrier), mp-rotator-swap, mow (1/3 rule), sprinkler-winterize, sprinkler-spring-start.

**Model changes:**
- `MaintenanceData.swift` — add `templateID`, `stepStates`, `runs: [MaintenanceTaskRun]`

**View changes:**
- `MaintenanceView.swift` — Season Test Run sheet → `TemplatedTaskSheet(template:)` with progress bar, step body, red flags, per-zone pre-fill from existing heads/problems
- "Suggested from your state" top card (e.g. recent fert app → suggest burn-check)

---

### Phase 6 — Spreader calc + inventory

**Model changes:**
- `InventoryData.swift` — add `calibrationLog: [CalibrationEntry]`

```swift
struct CalibrationEntry: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date
    var spreaderModel: String
    var dialSetting: String
    var targetLbsPer100SqFt: Double
    var actualLbsApplied: Double
    var passed: Bool        // within ±15% of target
    var notes: String = ""
}
```

**New views:**
- `CalibrationWizardSheet.swift` — walks 100 sq ft TARE test; saves `CalibrationEntry`; optionally updates `SpreaderSetting` default

**View changes to `SpreaderCalcView.swift`:**
- "Last used" card — reads `usageLog.last`; amber if last run >15% off target
- Next-round recommendation — if recent passing `CalibrationEntry` → "Use dial X.X"; otherwise gate "Log application" until calibration runs
- "What we learned yesterday" banner — if `FertApplication` in last 72h, show over-app stats + jump link

**View changes to `InventoryView.swift`:**
- Prominent "+ Add Product" FAB
- Quick-add presets (IFA, Scotts, Yard Mastery, ProPeat)

---

### Phase 7 — Soil test history

**Blob change:** `FairwayBlob.swift`
- Replace `var soilTest: SoilTestData?` with `var soilTests: [SoilTestData] = []`
- Decode migration: if old field present in JSON, wrap in array

**Model changes:**
- `SoilTestData.swift` — add `var id: UUID = UUID()`

**New service:** `Fairway/Services/SoilProjection.swift`
- Pure function: `projectCurrentState(from:, applications:, as:) -> ProjectedSoilState`
- N: sum applied lbs × 0.23 / zone sqft; decay ~3%/week for cool-season
- P/K: roughly stable between tests (no decay)

**New view:** `Fairway/Views/AddSoilTestSheet.swift`

**View changes to `SoilTestView.swift`:**
- Timeline with each test as dot + dashed projected-current dot
- Per-nutrient mini-chart: solid historical, dashed projection
- "Add retest" button

---

### Phase 8 — Rachio intelligence

**New service:** `Fairway/Services/RachioIntelligence.swift`

4 rules operating on `RachioState` + `ScheduleData` + WeatherKit history:

1. **Event-history analysis** — skip patterns, short runs, rain-delay overrides; chips in `RachioHistoryView`
2. **Schedule diff** — ET target vs Rachio rule duration; >20% delta → copy-ready recommendation
3. **Weather alerts** — ran during rain (>0.25" in 24h window) or Flex skipped when dry (ET - rainfall > 0.5")
4. **Zone-link health** — Fairway head count/GPM vs Rachio metadata; >30% mismatch → flag

**View changes:**
- `RachioSettingsView.swift` + `RachioHistoryView.swift` — "Intelligence" section with severity badges
- `ContentView.swift` MoreView — badge count for open Rachio insights

---

### Phase 9 — Unified ApplicationLogger

**New service:** `Fairway/Services/ApplicationLogger.swift`

Single function consolidating 3 logging paths:
```swift
func logApplication(inventoryItemID:, zones:, amountLbs:, date:,
                    spreaderDial:, notes:, markPlanEntryComplete:)
```
Side effects: appends `FertApplication` + `UsageEntry` + decrements stock + optionally marks `FertilizerEntry.isCompleted` + runs `ProblemDetector` if over-app + auto-schedules burn-check task.

---

### Phase 10 — Today card

Small top-of-MoreView card with:
- WeatherKit current conditions
- 7-day forecast summary
- This week's ET₀
- Water needed this week

New file: `Fairway/Views/TodayCardView.swift`

---

## New Files Required (not yet created)

```
Fairway/Models/GrassSubZoneData.swift          ← Phase 2
Fairway/Models/MaintenanceTemplate.swift        ← Phase 5
Fairway/Services/ETCalculator.swift             ← Phase 3
Fairway/Services/ProblemDetector.swift          ← Phase 4
Fairway/Services/MaintenanceTemplateLibrary.swift ← Phase 5
Fairway/Services/SoilProjection.swift           ← Phase 7
Fairway/Services/RachioIntelligence.swift       ← Phase 8
Fairway/Services/ApplicationLogger.swift        ← Phase 9
Fairway/Views/AddSoilTestSheet.swift            ← Phase 7
Fairway/Views/TemplatedTaskSheet.swift          ← Phase 5
Fairway/Views/CalibrationWizardSheet.swift      ← Phase 6
Fairway/Views/TodayCardView.swift               ← Phase 10
FairwayTests/ETCalculatorTests.swift
FairwayTests/ProblemDetectorTests.swift
FairwayTests/SoilProjectionTests.swift
FairwayTests/RachioIntelligenceTests.swift
FairwayTests/ApplicationLoggerTests.swift
```

All new files need corresponding entries in `Fairway.xcodeproj/project.pbxproj` using the `FW03E+` UUID range.

---

## Pre-existing WIP on `main` (uncommitted, unrelated to plan)

- `Fairway/Views/HeadPinEditor.swift` (270 lines) — MapKit-based pin editor with drag handles for bearing + arc sweep
- `Fairway/Views/HeadDetailView.swift` — toolbar pin button + `.fullScreenCover` integration
- `Fairway.xcodeproj/project.pbxproj` — pbxproj entry for HeadPinEditor

These are already on `main` but uncommitted. They're the UX that will let Chase fill in Z2-S1..S6 lat/long. Commit or stash before starting Phase 1 work so the diff stays clean.

---

## Verification Steps (run after sim runtime installed)

```bash
cd /Users/chase/Developer/chase/portfolio/fairway-ios

# Build
xcodebuild build \
  -project Fairway.xcodeproj \
  -scheme Fairway \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO

# Test
xcodebuild test \
  -project Fairway.xcodeproj \
  -scheme FairwayTests \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO
```

**Phase 0 spot checks (once app runs):**
- Inventory → IFA item present, `currentStockLbs = 7.2`, dial 3.5 setting, usage log 17.8 lb
- Z2 detail → 6 heads (Z2-S1..S6); Z2-S3 has coverageGap badge; Z2-S6 has tiltedHead + coverageGap; Z2-S5 is confirmed
- Z2 problems → "Z2 mixed precip rate (3-5× spread)" listed first (High severity, confirmed)
- Maintenance → 9 recovery tasks present (water-in, no-aerate, burn-check, etc.)
- Fertilizer log → 2026-04-23 application: 17.8 lb, zones [2,3,4], 62% over-app notes

**Migration check:** Install over existing seeded blob → all Phase 0 data should appear without re-seeding.

---

## Property Context

- Location: 345 E 170 N, Vineyard, UT 84059 (lat 40.3330, lng -111.7550)
- Controller: Rachio 4-zone
- Grass: Kentucky Bluegrass (cool-season), zone 6b
- Soil: Utah clay, pH 6.75, N+K deficient, micronutrients broadly low
- Consultant: Jimmy Lewis (jimmylewismows.com) — soil test April 2026
- Spreader: Spyker HHS100 handheld (only spreader owned)

## Zone Summary

| # | Name | Sq Ft | Type | Notes |
|---|------|-------|------|-------|
| 1 | Flower beds (shrubs) | 106 | Drip emitters | No granular fert ever |
| 2 | Front yard + park strip | 1,028 | KBG cool season | **Single valve** — park strip on same line; Z2-S1..S6 cataloged |
| 3 | West Side | 998 | Cool season | `Z3-S1..Z3-S11` (11 heads); `H3-1..H3-5` migrated → `Z3-S7..Z3-S11` via `applyPhase1ZoneMigrationIfNeeded()`. PreviewData + migration both ✅. |
| 4 | Back Yard | TBD | KBG cool season | `Z4-S1..Z4-S12` (12 heads); replaced 3 H4 "East Side" placeholders via migration. PreviewData + migration both ✅. |

Total grass (Z2+Z3+Z4): 2,737 sq ft

## Key Business Rules

1. Z2 is a **single valve** — irrigating Z2 always waters the park strip too. Always call this out explicitly.
2. Pre-emergent applied 2026-04-23: no aerate/dethatch until 2026-07-16.
3. Next fert: late June, HALF RATE (2 lb/1,000 sq ft), calibrate first.
4. Rachio token: Keychain only — never in blob, logs, or committed files.
5. Any head/problem with `isPreSeason: true` shows amber "PRE-SEASON" badge.
6. Confirmed problems show red "CONFIRMED" badge.

---

## Session Start Prompt (use this next session)

The kickoff prompt for the **next session** lives at:

**[docs/SESSION_START_NEXT.md](docs/SESSION_START_NEXT.md)**

Open that file, copy its contents, paste into the new chat. It covers:
- What to read first (CLAUDE.md + HANDOFF.md)
- What's already done (don't redo)
- Next immediate steps: install runtime → build/test → smoke test → docs-sweep

The earlier 2026-04-24 docs-sweep prompt (PHOTO_AUDIT, COVERAGE_ANALYSIS, PROPERTY_PLACEMENT) is valid follow-on work after build/test passes.
