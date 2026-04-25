# Fairway iOS — Changelog

## [Unreleased]

### Updated — 2026-04-25 — KML reimport: Phase 1 zone migration COMPLETE

All Swift edits, migration logic, and tests shipped. `xcodebuild` build/test still blocked by missing iOS 17.2 simulator runtime (install via Xcode → Settings → Platforms to unblock). All Swift source verified clean via `xcrun swiftc -parse`.

**`tools/rewrite-kml-labels.py` (NEW):**
- Stdlib-only script; reads `docs/heads/sprinklers.json` for `(lat, lon) → label` map.
- Walks all 41 `<Placemark>` elements in `docs/Sprinklers Google Earth (1).kml`, matches each by lat/lon within `±1e-7`, rewrites the `<name>` tag in place.
- Emits `docs/heads/RENAME_MAP.md` — 41-row markdown table: `| old_name | new_label | lat | lon | zone | color |`.
- Idempotent — first run reported 41 rewritten; second run reported 0.

**`docs/Sprinklers Google Earth (1).kml` (MODIFIED):**
- All 41 `<name>` tags rewritten to `Z*-S*` labels. Ready to re-import to Google Earth web.
- `grep "<name>Z3-S1</name>"` matches.

**`docs/heads/RENAME_MAP.md` (NEW):**
- 41 rows sorted by zone then label; old Google Earth names → new Fairway labels.

**`Fairway/PreviewData.swift` (MODIFIED):**
- `zone3()` (`private static` → `static`): now returns 11 heads `Z3-S1..Z3-S11`.
  - `Z3-S1..Z3-S6` — NEW; `headType: "Hunter"`, `nozzle: "TBD"`, `arcDegrees: 0`, `isConfirmed: false`, lat/lon + `notes: "KML pin: <kml_name>."`, `photoPaths` from manifest (Z3-S1=2, Z3-S2=4, rest=3).
  - `Z3-S7..Z3-S11` — copied from old H3-1..H3-5: arc, location, notes, isConfirmed preserved; only label and `photoPaths` strings updated.
  - Problem areas and schedule unchanged.
- `zone4()` (`private static` → `static`): zone renamed "East Side" → **"Back Yard"**; 3 H4-* placeholder heads replaced with 12 `Z4-S1..Z4-S12` entries (all 3 photos; lat/lon from manifest; `notes: "KML pin: <kml_name>."`). Old placeholder `problemAreas` (including the made-up H4-1 patio overspray) replaced with 3 pre-season stubs (`isPreSeason: true`): "Coverage gaps to verify", "Nozzle types unconfirmed", "Cycle time TBD pending PR test". Schedule shape preserved (Cycle & Soak).
- Added `static func phase1Z3NewHeads() -> [HeadData]` — public helper for the 6 new Z3-S1..Z3-S6 heads; used by migration.

**`Fairway/FairwayStore.swift` (MODIFIED):**
- `applyPhase1ZoneMigrationIfNeeded()` added as a sync `private func`; called from `load()` immediately after `applyPhase0MigrationIfNeeded()`. Three idempotent operations:
  1. **Zone 3 rename** — any head with `label.hasPrefix("H3-")` → `Z3-S{N+6}`; `photoPaths` strings rewritten in place.
  2. **Zone 3 add** — if no head with `label == "Z3-S1"` exists, appends the 6 new Z3-S1..Z3-S6 heads from `PreviewData.phase1Z3NewHeads()`. Skips by label individually to avoid duplicates.
  3. **Zone 4 replace** — only when `zone.name == "East Side"` AND every head has `label.hasPrefix("H4-")` (pristine placeholder fingerprint). Replaces zone with `PreviewData.zone4()`, preserving the original `id` UUID. Prints a warning and skips if the zone appears user-customized.
- Named `applyPhase1ZoneMigrationIfNeeded` (not `applyPhase1MigrationIfNeeded`) to avoid collision with the existing async `applyPhase1PropertyMigrationIfNeeded()` at line 110.

**`FairwayTests/FairwayBlobTests.swift` (MODIFIED):**
- `testPreSeasonFlagsCorrect` updated: removed assertion on the now-deleted H4-1 patio overspray problem; added `XCTAssertEqual(zone4.name, "Back Yard")` and check that all Z4 `problemAreas` have `isPreSeason == true`.
- `test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard()` (NEW): builds an old-shape blob (5 H3-* heads with custom notes/nozzles/photoPaths; Z4 "East Side" with 3 H4-* heads); injects via `UserDefaults`; calls `store.load()`; asserts:
  - Z3 has exactly 11 heads with labels Z3-S1..Z3-S11; no H3-* remain.
  - Z3-S7 carries the original custom notes/nozzle; photoPaths rewritten to `heads/Z3-S7/...`.
  - Z3-S9 preserves empty photoPaths array (input had 0 paths).
  - Z3-S1 has `isConfirmed: false`, `notes == "KML pin: b yellow."`.
  - Z4 name == "Back Yard"; 12 heads Z4-S1..Z4-S12; no H4-* remain; all `problemAreas.isPreSeason == true`.
  - Idempotency: second `store.load()` doesn't change head counts.

**Pending (manual):**
- Install iOS 17.2 simulator runtime → run `xcodebuild test` + `xcodebuild build`.
- Chase re-imports `docs/Sprinklers Google Earth (1).kml` to Google Earth web → confirm all 41 pins show `Z*-S*` labels.
- Install Fairway on device (fresh install + over-existing-install) to smoke test migration.

---

### Updated — 2026-04-25 — KML reimport: tooling + photos LANDED (prior session)

**`tools/import-kml.py` rewritten:**
- Source switched from `docs/Sprinklers.kml` (23 pins, archived) to `docs/Sprinklers Google Earth (1).kml` (41 pins).
- Color → zone rule: `red d32f2f` → Zone 3, `no/unknown color` → Zone 4 (NEW), every other color → Zone 2. Was `red → Z3, else → Z2`.
- Label scheme standardized to `Z*-S*`: `Z3-S1..Z3-S11` (sorted N→S, was `H3-1..H3-5`), `Z4-S1..Z4-S12` (sorted N→S, NEW).
- Idempotent legacy migration: renames `docs/heads/H3-{1..5}/` → `docs/heads/Z3-S{7..11}/` before downloads.

**Photos / manifest regenerated:**
- `python3 tools/import-kml.py` ran clean: `41 placemarks: Z2 front-yard=12, Z2 park-strip=6, Z3=11, Z4=12`.
- All 5 legacy `H3-*` photo folders moved to `Z3-S{7..11}/`.
- 6 new `Z3-S{1..6}/` folders + 12 new `Z4-S{1..12}/` folders downloaded (54 photos). `docs/heads/sprinklers.json` regenerated — 41 heads, 126 photos total.

**`Fairway/CLAUDE.md` updated:** Sprinkler Head Data section rewritten with new KML source, color/zone rule, `Z*-S*` label scheme, legacy migration map.

---

### Updated — 2026-04-24 (session 2) — KML ingestion source edits landed

**PreviewData.swift:**
- `phase0Z2Heads()` now returns **18 heads** (was 6). Z2-S1..S6 rewritten with lat/lon + `photoPaths` (sourced from `docs/heads/Z2-MATCH-1st/`..`Z2-MATCH-6th/`); Z2-S7..S18 appended (front-yard, generic Hunter Pro-Spray bodies, nozzle "TBD — confirm during season test", arc 180°, `isConfirmed: false`, KML pin name in `notes`, lat/lon/photoPaths from `sprinklers.json`).
- **Z2-S1 corrected** — nozzle "Rain Bird VAN yellow", `radiusFeet: 4` (was "Brass adjustable", radius 0). Photo-1 evidence.
- **Z2-S3 refined** — nozzle "Rain Bird 1555 fixed spray (dark nozzle)" (was "Brass radius-screw").
- **Z2-S5 corrected** — `isConfirmed: false`, nozzle "TBD — nozzle slot empty in photo (dirt-packed)", `issues: [.cloggedNozzle]`. Note explicitly calls out that the previous "MP Rotator confirmed" seed claim was wrong (photo-1 of `Z2-MATCH-5th/` shows empty dirt-packed slot).
- `phase0Z2MixedPrecipProblem()` — description rewritten to drop the "S5 already MP Rotator" premise. Reframes around 3 nozzle families across S1–S6 (VAN yellow ~0.5 in/hr at 4 ft, 1555 fixed spray ~1.5 in/hr, S5 empty slot).
- `zone3()` H3-1..H3-5 each gained `latitude`/`longitude`/`photoPaths` (final names `heads/H3-N/photo-N.jpg`) + KML pin name in notes. Existing labels, locations, and issues preserved.

**FairwayTests/FairwayBlobTests.swift:**
- `testHeadDataPhotoPathsRoundTrip` — encode/decode HeadData with 3 photoPaths, asserts equal.
- `testZone2HasEighteenSeededHeads` — asserts `phase0Z2Heads().count == 18`, first label `Z2-S1`, last `Z2-S18`, all heads have coordinates, all heads have non-empty photoPaths.

**Decisions locked (session 2):**
- Park-strip photo dirs stay as `Z2-MATCH-1st/`..`Z2-MATCH-6th/` (NOT renamed to `Z2-S1/`..`Z2-S6/`). Rationale: provisional matching needs Chase field confirmation; renaming now is destructive if matching changes. One `git mv` per dir is the cleanup once confirmed. Z2-S7..S18 + H3-1..H3-5 already use final names.
- Photo evidence overrides seed claims — Z2-S5's "MP Rotator confirmed" seed was wrong; photo-1 of the matched pin shows empty slot. Seed updated to reflect reality, not the original spec.

**Pending (next session):**
- Install iOS 17.2 simulator runtime → run `xcodebuild build` + `xcodebuild test`. Build/test still blocked by missing runtime; source edits verified by inspection only.
- Generate `docs/heads/PHOTO_AUDIT.md`, `docs/heads/COVERAGE_ANALYSIS.md`, `docs/heads/PROPERTY_PLACEMENT.md`.
- Chase field-confirm provisional Z2 matching (especially Z2-S5).

---

### In Progress — 2026-04-24 (session 1) — KML sprinkler head ingestion

**Context:** Chase exported all 23 sprinkler head locations + photos from Google Earth to `docs/Sprinklers.kml`.

- `HeadData.swift` — added `photoPaths: [String] = []` field. Codable migration automatic (default empty array). Schema ready to receive bundle-relative paths like `"heads/Z2-S1/photo-1.jpg"`.

**Also completed in session 1:**
- `tools/import-kml.py` — written and run; stdlib only (ElementTree + subprocess/curl)
- `docs/heads/sprinklers.json` — manifest written: 23 entries with lat/lon/alt/photo_paths
- `docs/heads/` — ~70 photos downloaded at s1024 (H3-1..H3-5, Z2-S7..S18, Z2-MATCH-1st..6th)
- `docs/heads/property-overhead.jpg` — Chase-provided Google Earth overhead with all 23 pins labeled
- Photo-2 placement shots reviewed for all 6 park-strip pins; provisional matching recorded
- All 6 park-strip heads confirmed as Hunter Pro-Spray bodies; nozzle findings:
  - 1st + 4th Sprinkler: Rain Bird VAN yellow (4 ft radius)
  - 2nd Sprinkler: Rain Bird 1555 fixed spray
  - 3rd Sprinkler: heavily clogged + erosion pit (matches Z2-S6 description)
  - 5th Sprinkler: nozzle MISSING / empty slot — contradicts "MP Rotator confirmed" in seed
  - 6th Sprinkler: heavily buried/clogged

**Decisions locked (session 1, 2026-04-24):**
- 12 new Zone 2 heads labeled Z2-S7..S18, KML name stored in `notes` field
- Z3 mapping: b blue→H3-1, b red(21)→H3-2, b red(22)→H3-3, b red(20)→H3-4, B bred→H3-5
- Photo carousel: 3 photos per Z2 head — (1) top-down nozzle, (2) placement-wide, (3) sprinkler running
- Photo size: s1024 (higher quality for nozzle marking readability; URLs publicly accessible)
- KML "1st Sprinkler" is NOT Z2-S1 — match 6 numbered pins to seed heads via photo-2 visual context

---

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

### Added — 2026-04-24 — Phase 0: IFA over-application data entry + Z2 head catalog
- `PreviewData.swift` — new public Phase 0 helpers (`phase0Z2Heads`, `phase0Z2MixedPrecipProblem`, `phase0IFAItem`, `phase0IFAApplication`, `phase0RecoveryTasks`) used by both fresh seed and migration
- Z2 head catalog replaced: old H2-1..H2-6 MP Rotator seed → Z2-S1..Z2-S6 (brass adjustable / TBD / brass radius-screw / brass adjustable / MP Rotator confirmed / buried)
  - Z2-S3: `coverageGap` issue (dormant ring)
  - Z2-S6: `tiltedHead + coverageGap` (buried 4–5" erosion pit)
  - Z2-S5: confirmed, already on MP Rotator (canary)
  - All others: `isConfirmed: false`, lat/long TBD via HeadPinEditor
- Z2 `ProblemArea` added: "Z2 mixed precip rate (3-5× spread)" — High severity, confirmed 2026-04-23
- Inventory item: "IFA Crabgrass Preventer + Lawn Food 23-3-8" — 25 lb bag, 7.2 lb remaining, Spyker HHS100 dial 3.5 setting (with calibration-failure warning), usage log entry 17.8 lb on 2026-04-23
- `FertApplication` logged: 2026-04-23, 17.8 lb on Z2/Z3/Z4, notes include 62% over-app + park strip warning + recovery plan
- 9 maintenance tasks added: water-in (due 2026-04-24), no-aerate barrier (due 2026-07-16), daily burn check (due 2026-05-03), late-June half-rate (due 2026-06-23), October overseed (due 2026-09-15), measure strip + verify S5 cap (due 2026-04-26), order nozzles (due 2026-04-27), S6 dig-out (due 2026-04-25), install + tune MP Rotators (due 2026-05-04)
- `seedObservations()`: "H2-3" reference updated to "Z2-S3"
- `FairwayStore.applyPhase0MigrationIfNeeded()` — called from `load()`, idempotently backfills all Phase 0 data into existing installs that were seeded before this change. Checks by name/title before inserting; replaces Z2 heads only if still on the H2-* legacy pattern.

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
