# Fairway iOS — Changelog

## [Unreleased]

### Added — 2026-04-25 (session 4) — Zone-menu refinements: actions, shopping list, Z2 sub-grouping, schedule explainers, map zone-hulls

- **`ProblemData.actions: [String]`** — new field for "specific things needed" bullets per problem. Codable extension with `decodeIfPresent` and default `[]` (Codable Rule #1, #2). Backward-compat decode test added.
- **`HeadInventoryView`** — when zone is Z2, sectioned into **Park Strip** (Z2-S1..S6 + Z2-MATCH-*) and **Main Yard** (Z2-S7..S18). Other zones unchanged.
- **`ProblemAreaView`** — Open section now renders a bullet list of `actions` under each problem (gold • markers). New **More — Shopping List** section after Resolved, derived from `FairwayStore.recommendedNozzleShoppingList(for:)`.
- **`FairwayStore.recommendedNozzleShoppingList(for zoneID:)`** — produces `[NozzleShoppingItem]` grouped by short-radius (≤5 ft → MP800 SR) vs. standard (zone target nozzle). Mismatch heuristic: head's `nozzle`/`fieldNozzle` doesn't contain the zone schedule's `nozzleType`.
- **`AddProblemSheet`** — new "Specific things needed" section with add/remove rows, lets users seed action bullets when logging a problem.
- **`ScheduleView`** — added **Read-only mirror** banner at top (Fairway plans, Rachio runs); **info popovers** ("?" button) on every parameter row explaining cycle length, soak between, cycles, precip rate, grass, nozzle; **Recent fertilizer** card if any `FertApplication` in the last 7 days for this zone (water-in window status).
- **`MapTabView`** — per-zone **convex-hull polygon overlay** (Andrew's monotone-chain) drawn under the head pins. Translucent fill + dashed stroke. Makes zone boundaries unambiguous when individual head pins are physically close at borders (e.g., Z3 NW corner abutting Z4).

### Changed — 2026-04-25 (session 4) — Pre-season problem cleanup

Dropped speculative pre-season problems across all zones (no irrigation signal yet):

- **Z2:** removed `Dry park strip`, `Dry lawn center`, `Weed pressure park strip`. Kept `phase0Z2MixedPrecipProblem()` (real, confirmed) — now seeded with 4 action bullets covering the swap plan.
- **Z3:** removed `East fence coverage gap` (dry strip) and `Hardscape overspray`. Kept `Misdirected head near foundation` and `Nozzle type unconfirmed` — both reseeded with action bullets.
- **Z4:** kept all three audit-task problems but reseeded with action bullets (coverage walk, nozzle ID, tuna-can PR test).
- **Observations:** removed Z2 lawn observation `"Dry patch near Z2-S3, likely overspray"` (speculation). Z4 grub-activity observation kept.

### Documented — 2026-04-25 (session 4) — Per-head fertilizer rule

- `Fairway/CLAUDE.md` Key Business Rules — new rule #10: "Heads are irrigation hardware only — never store per-head fertilizer history on `HeadData`. Fert applications live at the zone or product level (`InventoryItem.usageLog`, `FertApplication.zoneNumbers`)."

### Added — 2026-04-25 (session 3) — Audit sheet: pre-filled estimates, GPM field, measurement guide

- **`HeadData.fieldGPM: Double?`** — new optional field for catch-cup-tested GPM per head; uses `decodeIfPresent` (backward compat).
- **`HeadAuditSheet`** — pre-fills Confirmed Nozzle, Arc°, Radius, GPM from audit-derived estimates when the field hasn't been set yet (arc/radius from seed; nozzle from audit if not "TBD"; GPM from nozzle-type table). User sees a useful starting value instead of blank forms.
- **"Still needed from field"** section now shows estimated values in gold (e.g. "~0.4–0.8 GPM", "8–15 ft") derived from the photo audit observation text. Falls back to descriptive hint text where no estimate is available.
- **"Field Measurement Guide"** — collapsible DisclosureGroup at bottom of sheet explaining arc°, radius, and GPM catch-cup test (15-min run, flat tuna cans, depth × 4 = in/hr). Includes MP Rotator and Rain Bird nozzle reference table.

### Fixed — 2026-04-25 (session 3) — Map showing wrong property location

**Root cause:** Seeded `PropertySettings.latitude` was `40.3330` — ~3.6 km north of the actual house. The correct center (centroid of all 41 KML-sourced heads) is `40.3004`.

**Fix:** Updated seed to `40.3004, -111.7456`. Added `applyPhase3PropertyCoordsMigrationIfNeeded()` in `FairwayStore.load()` — detects the exact wrong value and patches it on next launch; guard condition is tight (matches only the original wrong seed), so manually-adjusted coords are never overwritten. Also bumped map camera distance 120→200 m for full-property coverage.

### Fixed — 2026-04-25 — Phase 2 audit data migration (on-device audit observations blank)

**Root cause:** `auditObservation` and `auditConfidence` were seeded in `PreviewData.swift` but the existing on-device UserDefaults blob was written before these fields existed. `decodeIfPresent` correctly decoded them as `""` — no crash — but the audit list showed heads with no observations and the detail sheet showed "No audit data for this head".

**Fix:** Added `applyPhase2AuditDataMigrationIfNeeded()` to `FairwayStore.load()`. Iterates all grass-zone heads; for any head with empty `auditObservation`, looks up `PreviewData.auditData(for: head.label)` and backfills both fields. Idempotent — skips heads that already have data (field-entered nozzle data is preserved).

- **`Fairway/FairwayStore.swift`** — `applyPhase2AuditDataMigrationIfNeeded()` added, called from `load()` after Phase 1.

### Added — 2026-04-25 — Pre-Season Audit view + photo audit data

**New feature: More → Pre-Season Audit**

A head-by-head pre-season checklist for walking the property before opening the season.

- **`Fairway/Views/PreSeasonAuditView.swift`** (NEW) — list of all 41 heads across Z2/Z3/Z4 grouped by zone. Each head shows the photo-audit observation, confidence badge (CONFIRMED / LIKELY / UNCLEAR / BLOCKED), and field-entered confirmed nozzle. Progress indicator per zone + overall. Tap any head → detail sheet.
- **`HeadAuditSheet`** (inline in view file) — per-head sheet showing: photo-audit finding with confidence dot, "still needed from field" items (arc°, radius, GPM, nozzle re-confirm for unclear heads), required action for blocked heads, editable fields for confirmed nozzle / arc° / radius ft / notes, and a "Head cleared" toggle.
- **`Fairway/Models/HeadData.swift`** — 6 new audit fields: `auditObservation`, `auditConfidence`, `preSeasonChecked`, `fieldNozzle`, `fieldArcDegrees`, `fieldRadiusFeet`. All use `decodeIfPresent` in the existing extension to maintain backward-compat. Added `auditIsBlocked` and `auditNeedsFieldWork` computed helpers.
- **`Fairway/FairwayStore.swift`** — `updateHead(_:)` helper for saving single-head edits from the audit sheet.
- **`Fairway/PreviewData.swift`** — `auditData(for:)` static lookup populated for all 41 heads from the 2026-04-25 photo audit. All head initializers now pass `auditObservation` + `auditConfidence`. Z3 legacy heads and Z4 back-yard heads refactored to array/map pattern to stay DRY.
- **`docs/heads/PHOTO_AUDIT.md`** (NEW) — full 41-head photo audit: nozzle ID, cap color, confidence, blocked-action table, cross-reference with CLAUDE.md TODOs.

**Blocked heads requiring physical work (9 of 41):**
Z2: S5 (empty slot), S6 (erosion pit), S8 (empty slot), S11 (empty slot), S14 (field re-photo), S17 (conflicting signals), S18 (encrusted slot)
Z4: S1 (fully buried — highest priority), S7 (partly buried)

### Verified — 2026-04-25 — Build + test + device install COMPLETE

All tests pass on iPhone 15 simulator (EXIT:0). Device build succeeded for iPhone 12 Pro Max. App installed and smoke-tested on device: Zone 3 = 11 heads Z3-S1..Z3-S11, Zone 4 = "Back Yard" + 12 Z4-S1..Z4-S12.

**Three production bugs found and fixed during verification:**

`Fairway/Views/PropertySettingsView.swift`:
- Added `@MainActor` to struct declaration. Without it, `@ViewBuilder` helper properties and `Button` action closures calling `store.blob`, `store.propertyLocationIssue`, and `store.clearProperty()` produced Swift concurrency errors (main actor-isolated property accessed from non-isolated context).

`Fairway/Models/HeadData.swift`:
- Added `extension HeadData { init(from:) }` using `decodeIfPresent` for all fields. Swift's synthesized `init(from:)` requires a JSON key for every non-optional property even when that property has a Swift default value (`= []`, `= false`, etc.). Any existing user blob without `"photoPaths"` in the JSON would crash on launch. **This class of bug applies to every Codable struct in every iOS app in the portfolio.**
- Custom decoder placed in an `extension`, NOT in the struct body. Reason: putting `init(from:)` inside the struct body suppresses Swift's synthesized memberwise initializer, breaking every callsite that constructs a `HeadData(label:, headType:, ...)`.

`Fairway/FairwayBlob.swift`:
- Added `extension FairwayBlob { init(from:) }` using `decodeIfPresent` for `observations`, `waterRuns`, `fertApplications`, and all other array fields. Same root cause as above — v1 blobs without these keys would crash on decode when upgrading.

**Tests — all passing (iPhone 15 simulator):**
- `test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard`
- `testPreSeasonFlagsCorrect`
- `testHeadDataMissingGeoFieldsDecodes`
- `testV1BlobDecodesIntoV2WithDefaults`
- All 7 `RachioDecodeTests`

---

### Updated — 2026-04-25 — KML reimport: Phase 1 zone migration COMPLETE (Swift)

**`tools/rewrite-kml-labels.py` (NEW):**
- Stdlib-only script; reads `docs/heads/sprinklers.json` for `(lat, lon) → label` map.
- Walks all 41 `<Placemark>` elements in `docs/Sprinklers Google Earth (1).kml`, matches each by lat/lon within `±1e-7`, rewrites the `<name>` tag in place.
- Emits `docs/heads/RENAME_MAP.md` — 41-row markdown table: `| old_name | new_label | lat | lon | zone | color |`.
- Idempotent — first run reported 41 rewritten; second run reported 0.

**`docs/Sprinklers Google Earth (1).kml` (MODIFIED):**
- All 41 `<name>` tags rewritten to `Z*-S*` labels. Ready to re-import to Google Earth web.

**`docs/heads/RENAME_MAP.md` (NEW):** 41 rows sorted by zone then label.

**`Fairway/PreviewData.swift` (MODIFIED):**
- `zone3()` expanded to 11 heads `Z3-S1..Z3-S11`. Z3-S1..S6 new; Z3-S7..S11 carry over H3-1..H3-5 data.
- `zone4()` renamed "East Side" → "Back Yard"; 12 Z4-S1..Z4-S12 heads seeded; 3 pre-season problem stubs.
- `phase1Z3NewHeads()` added as public helper for migration.

**`Fairway/FairwayStore.swift` (MODIFIED):**
- `applyPhase1ZoneMigrationIfNeeded()` — sync, idempotent, 3 ops: H3→Z3-S rename + photoPaths rewrite, Z3-S1..S6 append, Z4 "East Side" reseed with UUID preservation.

**`FairwayTests/FairwayBlobTests.swift` (MODIFIED):**
- `testPreSeasonFlagsCorrect` updated for new Z4 shape.
- `test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard()` added — covers rename, data preservation, append, Z4 reseed, idempotency.

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
