# Session Start — Fairway iOS, next session after 2026-04-25 Phase 1 verification

> Copy everything in the fenced block below into a fresh Claude Code chat.

```
Read these in order before doing anything:
1. /Users/chase/Developer/chase/CLAUDE.md
2. /Users/chase/Developer/chase/portfolio/fairway-ios/CLAUDE.md
3. /Users/chase/Developer/chase/portfolio/fairway-ios/HANDOFF.md

Working directory: /Users/chase/Developer/chase/portfolio/fairway-ios

---

CONTEXT

Fairway iOS is a lawn OS for a 4-zone Rachio irrigation system in Vineyard, UT.
The 2026-04-25 KML reimport (Zone 3: 5→11 heads, Zone 4 reseed "East Side"→"Back Yard" 3→12 heads)
is FULLY COMPLETE — Swift code written, tests passing, app builds clean.

---

WHAT'S ALREADY DONE (do NOT redo)

✅ tools/rewrite-kml-labels.py — rewrites <name> tags in KML; ran clean, 41 placemarks
✅ docs/Sprinklers Google Earth (1).kml — all 41 <name> tags at Z*-S* labels
✅ docs/heads/RENAME_MAP.md — 41-row verification table
✅ Fairway/PreviewData.swift — zone3() = 11 heads Z3-S1..Z3-S11; zone4() = "Back Yard" + 12 Z4-S1..Z4-S12 + 3 pre-season problem stubs
✅ Fairway/FairwayStore.swift — applyPhase1ZoneMigrationIfNeeded() (sync, called from load() after Phase 0)
✅ FairwayTests/FairwayBlobTests.swift — test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard() passing
✅ Fairway/Views/PropertySettingsView.swift — @MainActor added (fixes Swift concurrency errors)
✅ Fairway/Models/HeadData.swift — custom init(from:) in extension (decodeIfPresent for photoPaths — fixes backward compat)
✅ Fairway/FairwayBlob.swift — custom init(from:) in extension (decodeIfPresent for observations/waterRuns/fertApplications — fixes backward compat)
✅ All tests passing: xcodebuild test on iPhone 15 simulator → EXIT:0

---

IMMEDIATE NEXT STEPS (in order)

1. SMOKE TEST on iPhone 12 Pro Max (Chase's primary device — id A0C65578-B1E0-4E96-A1EC-EEB8913BD11C):
   a. Delete and reinstall: verify Zone 3 = 11 heads Z3-S1..Z3-S11, Zone 4 = "Back Yard" + 12 heads Z4-S1..Z4-S12
   b. Over-existing-install: keep old app data, launch — verify migration runs and H3-* heads rename to Z3-S7..Z3-S11, Z4 reseeds to "Back Yard"
   c. Migration spot check: tap Zone 3 → head labeled Z3-S7 should still have the original nozzle/notes Chase entered as H3-1

   To build for the device (if not already done):
     xcodebuild build \
       -project Fairway.xcodeproj -scheme Fairway \
       -destination 'id=A0C65578-B1E0-4E96-A1EC-EEB8913BD11C' \
       CODE_SIGNING_ALLOWED=YES -allowProvisioningUpdates

   To install after build:
     xcrun devicectl device install app \
       --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C \
       <path-to-Fairway.app>
   (find the .app path in the build output under DerivedData/.../Fairway.app)

2. DOCS-SWEEP (separate task — do after smoke test):
   - docs/heads/PHOTO_AUDIT.md — nozzle ID, defects, arc/bearing per head (read photo-1 of each head folder)
   - docs/heads/COVERAGE_ANALYSIS.md — haversine spacing from sprinklers.json coords, flag gaps >20 ft
   - docs/heads/PROPERTY_PLACEMENT.md — cross-ref photo-2 landmarks + coords + property-overhead.jpg

3. PHASE 1 Map bug fix (first item in the 10-phase plan):
   Files: Fairway/Models/PropertySettings.swift, Fairway/Views/MapTabView.swift, Fairway/Views/PropertySettingsView.swift (partially done)
   See HANDOFF.md Phase 1 section for the full spec.

---

KEY FACTS IF YOU NEED THEM

- applyPhase1ZoneMigrationIfNeeded() in FairwayStore.swift:111 — sync, idempotent, called from load()
- Z3 photo counts: Z3-S1=2, Z3-S2=4, Z3-S11=4, others=3
- Z4 UUID preserved (fresh.id = zone.id before reseed)
- Chase's iPhone 12 Pro Max devicectl id: A0C65578-B1E0-4E96-A1EC-EEB8913BD11C
- Source of truth for all head coords: docs/heads/sprinklers.json

---

OUT OF SCOPE (don't drift)

- Z2-MATCH visual matching (separate task)
- HeadPinEditor MapKit work
- Phase 2+ of the 10-phase plan
- Any new feature work not listed in IMMEDIATE NEXT STEPS
```
