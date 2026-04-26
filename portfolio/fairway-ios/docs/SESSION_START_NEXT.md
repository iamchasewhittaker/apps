# Fairway iOS — Session Start (2026-04-25 current)

> Copy everything below the line into a new Claude Code chat.

---

Read `portfolio/fairway-ios/CLAUDE.md` and `portfolio/fairway-ios/HANDOFF.md` first, then continue from this context.

## What's done and on device (2026-04-25)

- **Pre-Season Audit** live at `More → Pre-Season Audit` — 41 heads by zone, photo-audit observations, confidence badges, detail sheet with field-entry inputs, progress counter
- **Phase 2 audit migration** (`applyPhase2AuditDataMigrationIfNeeded` in `FairwayStore.load()`) — backfills `auditObservation`/`auditConfidence` for existing blobs that predate the audit fields. Without this, the audit list showed heads with no observations. Fixed and shipped.
- **Linear project:** https://linear.app/whittaker/project/fairway-ios-674db91fc8d1
- **Build + install:** EXIT:0, installed on iPhone 12 Pro Max. App opens, Pre-Season Audit nav visible, audit data shows on each head.

## Blocked heads (physical work required before season test)

| Head | Failure | Action |
|------|---------|--------|
| **Z4-S1** | Fully buried in mud | Dig out completely — **zero coverage now** |
| Z2-S6 | Buried in erosion pit | Dig out + swing-pipe raise |
| Z2-S5, S8, S11 | Empty/dirt-packed nozzle slots | Clear slot, install nozzle |
| Z2-S18 | Encrusted slot | Clear slot, re-photo |
| Z2-S14 | Conflicting photos | Field re-photo while running |
| Z2-S17 | Conflicting photos | Field re-photo + running confirmation |
| Z4-S7 | Partly buried | Clear soil, re-photo |

## Next steps (priority order)

1. **Field walk** — open `More → Pre-Season Audit` on iPhone, walk each zone, enter field data (arc°, radius, confirmed nozzle), tick "Head cleared". Z4-S1 first.
2. **Seed cleanup** — after field walk, update `nozzle:` strings in `PreviewData.swift` with confirmed values; flip `confirmedBySeasonTest: true`
3. **Phase 1 Map bug fix** — `MapTabView` renders Atlantic Ocean at (0,0) coords. Spec in `HANDOFF.md § Phase 1`.
4. **Tests** — new HeadData audit fields need a backward-compat decode test (TODO from previous session)

## Key invariants

- New HeadData fields must use `decodeIfPresent` in the extension `init(from:)` — missing key = crash for existing users
- New data fields also need a `FairwayStore.applyPhaseN...MigrationIfNeeded()` to backfill existing blobs — PreviewData seed alone is not enough
- Z2 is a single valve (park strip always irrigates with front yard)
- Rachio token: Keychain only, never in blob or logs
- Mount iOS 17.2 runtime DMG before any `xcodebuild` call (see root CLAUDE.md)

## Changed files this session (both commits)

`FairwayStore.swift` · `HeadData.swift` · `PreviewData.swift` · `PreSeasonAuditView.swift` (NEW) · `ContentView.swift` · `project.pbxproj` · `docs/heads/PHOTO_AUDIT.md` (NEW) · `CHANGELOG.md` · `LEARNINGS.md` · `HANDOFF.md` · `docs/SESSION_START_NEXT.md`

---

_End of paste block_

---

# (archive) Original 2026-04-25 smoke-test session start

```
Read these in order before doing anything:
1. /Users/chase/Developer/chase/CLAUDE.md
2. /Users/chase/Developer/chase/portfolio/fairway-ios/CLAUDE.md
3. /Users/chase/Developer/chase/portfolio/fairway-ios/HANDOFF.md

Working directory: /Users/chase/Developer/chase/portfolio/fairway-ios

---

CONTEXT

Fairway iOS is a lawn OS for a 4-zone Rachio irrigation system in Vineyard, UT.
The 2026-04-25 KML reimport (Zone 3: 5→11 heads, Zone 4 "East Side"→"Back Yard" 3→12 heads)
is FULLY COMPLETE — Swift code written, all tests passing (EXIT:0), app installed and
smoke-tested on Chase's iPhone 12 Pro Max.

Codable safety rules for this app are documented in CLAUDE.md § iOS Codable Safety Rules.
Every Codable struct that has had new fields added has a custom init(from:) extension
using decodeIfPresent. Do not remove or shortcut these.

---

WHAT'S ALREADY DONE (do NOT redo)

✅ tools/rewrite-kml-labels.py — rewrites <name> tags in KML; ran clean, 41 placemarks
✅ docs/Sprinklers Google Earth (1).kml — all 41 <name> tags at Z*-S* labels
✅ docs/heads/RENAME_MAP.md — 41-row verification table
✅ Fairway/PreviewData.swift — zone3() = 11 heads Z3-S1..Z3-S11; zone4() = "Back Yard" + 12 Z4-S1..Z4-S12 + 3 pre-season problem stubs
✅ Fairway/FairwayStore.swift — applyPhase1ZoneMigrationIfNeeded() (sync, called from load() after Phase 0)
✅ FairwayTests/FairwayBlobTests.swift — test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard() passing
✅ Fairway/Views/PropertySettingsView.swift — @MainActor on struct (Swift concurrency fix)
✅ Fairway/Models/HeadData.swift — extension HeadData { init(from:) } using decodeIfPresent (backward compat)
✅ Fairway/FairwayBlob.swift — extension FairwayBlob { init(from:) } using decodeIfPresent (backward compat)
✅ All tests passing: xcodebuild test on iPhone 15 simulator → EXIT:0
✅ Device build: xcodebuild build for iPhone 12 Pro Max → EXIT:0
✅ Device smoke test on iPhone 12 Pro Max: Zone 3=11 heads, Zone 4="Back Yard"+12 ✅

---

PICK ONE: IMMEDIATE NEXT STEPS

OPTION A — Docs-sweep (read-only, no code changes):
  1. docs/heads/PHOTO_AUDIT.md — read photo-1 of each head folder; record nozzle type, defects, arc/bearing estimate
  2. docs/heads/COVERAGE_ANALYSIS.md — haversine spacing from sprinklers.json; flag gaps >20 ft, overlaps <5 ft
  3. docs/heads/PROPERTY_PLACEMENT.md — cross-ref photo-2 landmarks + coords + property-overhead.jpg

OPTION B — Phase 1 Map bug fix (first item in the 10-phase plan):
  Files: Fairway/Models/PropertySettings.swift, Fairway/Views/MapTabView.swift, Fairway/Views/PropertySettingsView.swift
  See HANDOFF.md § Phase 1 for the full spec.
  Summary: MapTabView initializes camera once in onAppear — renders Atlantic Ocean when (0,0) coords.
  Fix: hasValidCoordinates guard + empty state + reactive camera + drag-to-adjust pin flow.

---

KEY FACTS IF YOU NEED THEM

- applyPhase1ZoneMigrationIfNeeded() in FairwayStore.swift:111 — sync, idempotent, called from load()
- Z3 photo counts: Z3-S1=2, Z3-S2=4, Z3-S11=4, others=3
- Z4 UUID preserved (fresh.id = zone.id before reseed)
- Chase's iPhone 12 Pro Max devicectl id: A0C65578-B1E0-4E96-A1EC-EEB8913BD11C
- Source of truth for all head coords: docs/heads/sprinklers.json

PRE-BUILD (run once per session before any xcodebuild call):
  sudo hdiutil attach \
    /Library/Developer/CoreSimulator/Images/B3B0953C-8EEB-4DF1-8149-B9770CC90CC7.dmg \
    -mountpoint /Library/Developer/CoreSimulator/Volumes/iOS_21C62 \
    -readonly -noverify

BUILD COMMANDS:
  xcodebuild test -project Fairway.xcodeproj -scheme FairwayTests \
    -destination 'platform=iOS Simulator,name=iPhone 15' CODE_SIGNING_ALLOWED=NO 2>&1; echo "EXIT:$?"

  xcodebuild build -project Fairway.xcodeproj -scheme Fairway \
    -destination 'id=A0C65578-B1E0-4E96-A1EC-EEB8913BD11C' \
    CODE_SIGNING_ALLOWED=YES -allowProvisioningUpdates 2>&1; echo "EXIT:$?"

---

OUT OF SCOPE (don't drift)

- Z2-MATCH visual matching (separate task)
- HeadPinEditor MapKit work
- Phase 2+ of the 10-phase plan
- Any new feature work not listed above
```
