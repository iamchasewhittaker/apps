# Session Start — Fairway iOS, next session after 2026-04-25 Phase 1

> Copy everything in the fenced block below into a fresh Claude Code chat.

```
Read these in order before doing anything:
1. /Users/chase/Developer/chase/CLAUDE.md
2. /Users/chase/Developer/chase/portfolio/fairway-ios/CLAUDE.md
3. /Users/chase/Developer/chase/portfolio/fairway-ios/HANDOFF.md

Working directory: /Users/chase/Developer/chase/portfolio/fairway-ios

---

CONTEXT

Fairway iOS is a lawn OS for a 4-zone Rachio irrigation system.
The 2026-04-25 KML reimport is FULLY WIRED IN SWIFT — all code is written.
No import scripts need to be run. No Swift editing needed unless build fails.

---

WHAT'S ALREADY DONE (do NOT redo)

✅ tools/rewrite-kml-labels.py — rewrites <name> tags in the KML + emits RENAME_MAP.md
✅ docs/Sprinklers Google Earth (1).kml — all 41 <name> tags rewritten to Z*-S* labels
✅ docs/heads/RENAME_MAP.md — 41-row markdown table (old_name → new_label)
✅ Fairway/PreviewData.swift — zone3() has 11 heads Z3-S1..Z3-S11; zone4() = "Back Yard" with 12 Z4-S1..Z4-S12 heads + 3 pre-season problem stubs
✅ Fairway/FairwayStore.swift — applyPhase1ZoneMigrationIfNeeded() added (sync, called from load() after Phase 0)
✅ FairwayTests/FairwayBlobTests.swift — test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard() added; testPreSeasonFlagsCorrect updated

---

ENVIRONMENT BLOCKER

iOS 17.2 simulator runtime is NOT installed on this machine.
xcodebuild build and xcodebuild test cannot run.

Fix: Xcode → Settings → Platforms → install iOS 17.2.

Once installed, run:

  xcodebuild test \
    -project Fairway.xcodeproj -scheme FairwayTests \
    -destination 'platform=iOS Simulator,name=iPhone 15' \
    CODE_SIGNING_ALLOWED=NO

  xcodebuild build \
    -project Fairway.xcodeproj -scheme Fairway \
    -destination 'platform=iOS Simulator,name=iPhone 15' \
    CODE_SIGNING_ALLOWED=NO

If iPhone 15 isn't available, fall back to whatever simulator runtime exists:
  xcrun simctl list devices available

Do NOT lower the iOS deployment target.

---

IMMEDIATE NEXT STEPS (in order)

1. CHECK if simulator runtime is now installed:
     xcrun simctl list devices available | grep iPhone
   If iPhone 15 or later shows up → proceed to step 2.
   If nothing useful → tell me which runtimes are available.

2. RUN xcodebuild test — verify all tests pass including the new migration test.
   Expected: test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard() PASSES.

3. RUN xcodebuild build — verify clean compile.

4. If any test or build fails, read the failing source file and fix.
   Key files to read if something breaks:
     Fairway/PreviewData.swift
     Fairway/FairwayStore.swift
     FairwayTests/FairwayBlobTests.swift

5. SMOKE (manual on simulator — do once build passes):
   a. Fresh install (delete app first): Zone 3 = 11 heads Z3-S1..Z3-S11; Zone 4 = "Back Yard" + 12 Z4-S1..Z4-S12
   b. Migration smoke: seed a UserDefaults blob with old H3-* shape via lldb or by running the migration test manually — confirm Z3-S7 carries original notes, Z4 becomes Back Yard

6. AFTER tests pass — proceed to docs-sweep if scope allows:
   - docs/heads/PHOTO_AUDIT.md — nozzle ID, defects, arc/bearing per head
   - docs/heads/COVERAGE_ANALYSIS.md — haversine spacing, flag gaps >20 ft
   - docs/heads/PROPERTY_PLACEMENT.md — cross-ref photos + overhead + coords
   These are separate tasks; don't mix them with the build fix work.

---

KEY MIGRATION FACTS (if you need to read the code)

- applyPhase1ZoneMigrationIfNeeded() is in FairwayStore.swift, called from load() after applyPhase0MigrationIfNeeded()
- Named "ZoneMigration" (not "Phase1Migration") to avoid collision with existing async applyPhase1PropertyMigrationIfNeeded() at line ~110
- Zone 3 photo counts: Z3-S1=2, Z3-S2=4, Z3-S11=4, rest=3 (from sprinklers.json)
- Zone 4 UUID is preserved from original zone when reseeding (fresh.id = zone.id)
- Source of truth for all head coords: docs/heads/sprinklers.json

---

OUT OF SCOPE for this session (don't drift)

- Visual matching Z2-MATCH-1st..6th → Z2-S1..Z2-S6 (separate task)
- HeadPinEditor MapKit work
- Phase 1 Map bug fix (Phases 2+ of the 10-phase plan)
- Any new feature work
```
