# Fairway (iOS) — Handoff

## State

| Field | Value |
|-------|-------|
| Version | v0.1 |
| Status | 🟡 KML ingestion source edits DONE — `xcodebuild` build/test still blocked (iOS 17.2 sim runtime missing); 3 photo-audit docs not yet generated |
| Last session | 2026-04-24 (interrupted mid-flow for docs sweep) |
| Focus | PreviewData.swift Z2 6→18 + Z3 coords + Z2-S1/S5 corrections shipped; FairwayBlobTests +2 new tests. Build verification deferred until iOS 17.2 simulator runtime is installed. |
| Bundle ID | `com.chasewhittaker.Fairway` |
| Storage key | `chase_fairway_ios_v1` |
| PBX prefix | `FW` |
| Xcode project | `Fairway.xcodeproj` |

---

## ⚠️ Environment Blocker

iOS 17.2 simulator runtime is **not installed**. `xcodebuild` cannot build or test.

**Fix:** Xcode → Settings → Platforms → install iOS 17.2.

This blocks `xcodebuild build` and `xcodebuild test`. It does NOT block editing. All source changes in this session are syntactically valid (verified by file inspection). Verify build after runtime install.

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
| 3 | West Side Backyard | 998 | Cool season | H3-* heads, nozzle type TBD |
| 4 | East Side Backyard | 711 | KBG cool season | H4-* heads, fixed spray |

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

```
Read the following in order:
1. /Users/chase/Developer/chase/CLAUDE.md
2. /Users/chase/Developer/chase/portfolio/fairway-ios/CLAUDE.md
3. /Users/chase/Developer/chase/portfolio/fairway-ios/HANDOFF.md

Continuing Fairway iOS — KML ingestion source edits LANDED last session.
Do NOT re-edit PreviewData.swift, FairwayBlobTests.swift, HeadData.swift,
or re-run tools/import-kml.py. Read HANDOFF.md "KML Ingestion Progress
(2026-04-24, second session)" for the full landed state.

What's already done (don't redo):
- PreviewData.phase0Z2Heads() returns 18 heads (Z2-S1..S18) with lat/lon/photoPaths.
- Z2-S1 corrected: Rain Bird VAN yellow, 4 ft.
- Z2-S5 corrected: isConfirmed: false, "TBD — nozzle slot empty".
- phase0Z2MixedPrecipProblem() text updated (drops S5-MP claim).
- zone3() H3-1..H3-5 have lat/lon/photoPaths.
- FairwayBlobTests.swift +2 tests:
  testHeadDataPhotoPathsRoundTrip + testZone2HasEighteenSeededHeads.

Pick up here (in order):
1. ⚠️ ENVIRONMENT: install iOS 17.2 simulator runtime if still missing
   (Xcode → Settings → Platforms). Do NOT bypass by lowering deployment
   target or changing destinations.
2. Run xcodebuild build + xcodebuild test from portfolio/fairway-ios/.
   If any test fails or build errors, fix before generating docs.
3. Generate docs/heads/PHOTO_AUDIT.md — read photo-1/2/3 of all 23 heads
   via Read tool (Read accepts JPG natively). Per head: nozzle brand/model,
   visible defects (clogging, tilt, burial, missing parts), spray arc
   inference (from photo-3 if water visible), placement context (from
   photo-2). Group by zone: Z2 park strip (Z2-S1..S6, source dirs
   Z2-MATCH-1st..6th/) → Z2 front yard (Z2-S7..S18) → Z3 west side
   (H3-1..H3-5).
4. Generate docs/heads/COVERAGE_ANALYSIS.md — haversine distance from
   sprinklers.json lat/lon between each pair of heads in same zone.
   Flag gaps (adjacent N→S distance > 20 ft) and overlaps (< 5 ft).
   Park-strip expected spacing ~6–8 ft; front yard ~10–15 ft.
5. Generate docs/heads/PROPERTY_PLACEMENT.md — cross-reference photo-2
   landmarks + property-overhead.jpg + coords. Per-head placement
   description (e.g., "Z2-S7: front yard NW corner, mulched bed edge,
   3 ft from sidewalk"). Becomes source of truth for refining `location`
   strings on a future PreviewData pass.
6. Chase field-confirm provisional Z2 matching (see "Provisional seed
   matching" table in HANDOFF.md). Especially Z2-S5 — does the empty
   nozzle slot in 5th Sprinkler photo-1 actually correspond to seeded
   Z2-S5, or is matching wrong?
7. Once Z2 matching is confirmed in field: run
   `git mv docs/heads/Z2-MATCH-1st docs/heads/Z2-S1` (and 5 more), then
   update photoPaths in phase0Z2Heads() to drop the MATCH names.

Provisional seed matching (NEEDS Chase field confirmation, esp. Z2-S5):
  1st Sprinkler → Z2-S1  |  6th → Z2-S2  |  2nd → Z2-S3
  4th Sprinkler → Z2-S4  |  5th → Z2-S5  |  3rd → Z2-S6
```
