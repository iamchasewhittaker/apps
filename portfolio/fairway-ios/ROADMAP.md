# Fairway iOS — Roadmap

## Phase 1 — MVP (current)
- [x] All data models + FairwayBlob
- [x] FairwayStore with seedIfNeeded()
- [x] 5-tab layout
- [x] Zone dashboard + detail (Heads/Problems/Schedule/Beds)
- [x] PRE-SEASON / CONFIRMED badge system
- [x] Fertilizer season plan with date windows + product links
- [x] Inventory management (products + equipment + stock log)
- [x] Spreader calculator
- [x] Soil test display
- [x] Shrub bed tracking
- [x] Maintenance tasks + mow log
- [x] **Overview tab (v0.2, shipped 2026-04-27)** — weather + alerts + pre-emergent tracker + audit progress + Rachio status + schedule sanity + mow streak + quick-log row. Open-Meteo (soil temp at 6cm, free, no API key). 58 tests passing.

## Phase 2 — Polish
- [ ] App icon (1024×1024 — Augusta green + white sprinkler arc)
- [ ] Local notifications for maintenance reminders (UNUserNotificationCenter)
- [ ] Empty state illustrations
- [ ] Onboarding flow (first-launch instructions)

## Phase 3 — Field Tools
- [ ] Camera integration for head photos
- [ ] QR/barcode scanner for product lookup
- [x] Map/satellite zone layout view — `HeadPinEditor.swift` WIP on `main` (MapKit + drag handles for bearing/arc)

## Phase 4 — Cloud
- [ ] iCloud or Supabase sync stub
- [ ] Export to PDF (season report)

## Rachio Integration

- [x] v1 read-only (shipped 2026-04-24): Keychain-secured token, fetch person/device/zones/schedule rules/events, auto-link zones by number, zone-link picker, ScheduleView "Rachio says" mirror card, Watering History view
- [ ] v1 runtime verification — install iOS 17.2 simulator runtime; run `xcodebuild test`; first-run Connect flow; sync; zone-link; bad-token; persistence; migration
- [ ] v2 — manual zone start/stop + pause controls (write operations, requires separate scope)
- [ ] v2 — background sync (BGAppRefreshTask) so watering history fills without open-app taps
- [ ] v2 — derive real precip rate per zone from Rachio "nozzle precip" field and stamp onto HeadData

## Active Remediation (post 2026-04-23 over-application)

- [x] Data entry per companion plan — IFA inventory, fert app log, 6 Z2 heads (Z2-S1..S6), mixed-precip ProblemArea, 9 maintenance tasks (shipped 2026-04-24)
- [x] Migration helper `applyPhase0MigrationIfNeeded()` in FairwayStore — backfills existing installs (shipped 2026-04-24)
- [x] KML ingestion source edits — `phase0Z2Heads()` 6 → 18 heads with lat/lon/photoPaths; Z2-S1 + Z2-S5 corrections from photo evidence; `phase0Z2MixedPrecipProblem()` text rewrite; H3-1..H3-5 lat/lon/photoPaths; +2 tests (shipped 2026-04-24, session 2)
- [x] Copy Z2-S1..S6 lat/long from Google Earth into HeadData — done via KML manifest (`docs/heads/sprinklers.json`), photoPaths point at `Z2-MATCH-Nth/` until field confirmation
- [ ] xcodebuild build + test — blocked: install iOS 17.2 simulator runtime (Xcode → Settings → Platforms)
- [ ] Measure park strip width (4-6 ft → MP800SR; 6-8 ft → MP1000) — due 2026-04-26
- [ ] Verify Z2-S5 MP Rotator cap color (blue=MP1000, purple=MP800SR) — due 2026-04-26
- [ ] Order 5× MP Rotator nozzles (~$50) — due 2026-04-27
- [ ] Dig out + raise Z2-S6 with swing pipe — due 2026-04-25
- [ ] Install 5× MP Rotator nozzles + tune Z2 run-time (~3× longer than sprays) — due 2026-05-04

## Approved Multi-Phase Rebuild (plan: `on-fairway-the-map-stateless-plum.md`)

Full plan at `/Users/chase/.claude/plans/on-fairway-the-map-stateless-plum.md` — 10 phases approved 2026-04-24.

- [x] Phase 0 — Data entry (IFA inventory, Z2 catalog, migration) — shipped 2026-04-24
- [x] Phase 1 — Map bug fix (`hasValidCoordinates`, reactive `onChange`, self-heal re-geocode, confirm-pin preview) — shipped 2026-04-27
- [x] Phase 2 — Zone 2 sub-zones (`GrassSubZone` model, chip filter in ZoneDetailView, per-sub-zone run-time card in ScheduleView) — shipped 2026-04-28 · 62 tests
- [ ] Phase 3 — Schedule ET hybrid (`ETCalculator` + WeatherKit, Hargreaves ET₀, Kc KBG, "Why this number?" card, weekly refresh)
- [ ] Phase 4 — Problem auto-detection (`ProblemDetector` service, 7 rules, `[auto]` chip in ProblemAreaView)
- [ ] Phase 5 — Maintenance templates (`MaintenanceTemplateLibrary`, `TemplatedTaskSheet`, Season Test Run rewrite)
- [ ] Phase 6 — Spreader calc + inventory (`CalibrationEntry`, calibration wizard, last-used card, add-product FAB)
- [ ] Phase 7 — Soil test history (`soilTests: [SoilTestData]`, `SoilProjection` service, timeline + projected state)
- [ ] Phase 8 — Rachio intelligence (4 rules: event analysis, schedule diff, weather alerts, zone-link health)
- [ ] Phase 9 — Unified `ApplicationLogger` service (consolidate 3 logging paths)
- [ ] Phase 10 — Today card on MoreView (WeatherKit current + 7-day + week ET₀)

## KML / Photo Analysis Backlog (2026-04-24)

- [x] `tools/import-kml.py` — written + run; 23 pins, ~70 photos at s1024 in `docs/heads/`; manifest at `docs/heads/sprinklers.json`
- [x] View photo-2 (placement shot) for all 6 numbered KML pins → matched to Z2-S1..S6 (provisional, see HANDOFF.md table; Z2-S5 anomaly logged)
- [x] Correct Z2-S1 nozzle: "Rain Bird VAN yellow", `radiusFeet: 4` (was "Brass adjustable") — landed in `phase0Z2Heads()` 2026-04-24
- [x] Correct Z2-S5: `isConfirmed: false`, "TBD — nozzle slot empty in photo (dirt-packed)" — landed in `phase0Z2Heads()` 2026-04-24
- [ ] `docs/heads/PHOTO_AUDIT.md` — read photo-1/2/3 for all 23 heads; nozzle ID, defects, arc/bearing per head
- [ ] `docs/heads/COVERAGE_ANALYSIS.md` — haversine distances from sprinklers.json; flag gaps >20 ft + overlaps <5 ft
- [ ] `docs/heads/PROPERTY_PLACEMENT.md` — cross-reference photo-2 landmarks + property-overhead.jpg + KML coords
- [ ] Field-confirm provisional Z2 matching (esp. Z2-S5: does empty-slot photo correspond to seeded Z2-S5?)
- [ ] Once Z2 matching confirmed: `git mv docs/heads/Z2-MATCH-Nth/` → `docs/heads/Z2-S{1..6}/`, update photoPaths in `phase0Z2Heads()`

## Ideas Backlog
- ~~Weather integration (manual rainfall entry)~~ — shipped via Open-Meteo in Overview tab (v0.2)
- Push spreader support (when HHS100 is replaced)
- Zone coverage map (draw spray arcs on satellite image) — partially addressed by `HeadPinEditor`
- **Schema bump:** add `precipRateInPerHour: Double?` to `HeadData` — would be the right home for the precip-mismatch story
- **Schema bump:** add `photos: [URL]` to `HeadData` so head photos don't have to live in Photos/Google Earth
- **Calibration log:** structured calibration entries on `InventoryItem` (date, dial, target lb, actual lb, pass/fail) so the calibration discipline is enforced by the data model
