# Session Start — Fairway iOS, 2026-04-25 KML Reimport (continuation)

> Copy everything in the fenced block below into a fresh Claude Code chat.

```
Read these in order before doing anything:
1. /Users/chase/Developer/chase/CLAUDE.md
2. /Users/chase/Developer/chase/portfolio/fairway-ios/CLAUDE.md
3. /Users/chase/Developer/chase/portfolio/fairway-ios/HANDOFF.md  (especially the "2026-04-25 KML Reimport" section near the top)
4. /Users/chase/.claude/plans/i-have-a-new-cheeky-nova.md  (the approved plan)

Working directory: /Users/chase/Developer/chase/portfolio/fairway-ios

---

CONTEXT

I'm continuing the 2026-04-25 KML reimport for Fairway iOS. A new Google Earth
KML at docs/Sprinklers Google Earth (1).kml has 41 placemarks (vs the old 23):
  • Zone 2 unchanged (18 pins)
  • Zone 3 grew 5 → 11 red pins (old 5 still at same lat/lon, plus 6 new further north)
  • Zone 4 NEW = "Back Yard" (12 white/no-color pins) — replaces a 3-head "East Side" placeholder

Decisions already locked (do not re-litigate):
  1. Zone 4 = "Back Yard" — wipe placeholders, use 12 KML pins
  2. Standardize labels to Z*-S*  — rename existing H3-* → Z3-S* and H4-* → Z4-S*. Z2 unchanged.
  3. Renumber Z3 N→S — old H3-1..H3-5 slide to Z3-S7..Z3-S11
  4. Rewrite KML <name> tags + emit a RENAME_MAP.md for human verification

---

ALREADY SHIPPED in the previous chat (do NOT redo)

✅ tools/import-kml.py — switched source KML, added Zone 4 (no-color → Z4),
   switched to Z3-S* / Z4-S* labels (sorted N→S), idempotent migration that
   renames docs/heads/H3-{1..5}/ → docs/heads/Z3-S{7..11}/.
✅ python3 tools/import-kml.py ran clean. Output: "41 placemarks: Z2
   front-yard=12, Z2 park-strip=6, Z3=11, Z4=12". All 5 legacy H3-* photo
   folders moved. 6 new Z3-S{1..6}/ + 12 new Z4-S{1..12}/ folders downloaded
   (3 photos each = 54 fresh photos). docs/heads/sprinklers.json regenerated
   with all 41 heads.
✅ Fairway/CLAUDE.md — Sprinkler Head Data section rewritten with new KML
   source, color/zone rule, label scheme + legacy migration map.

DO NOT run import-kml.py again. DO NOT touch the docs/heads/ folder layout.

---

EXECUTE THESE 7 STEPS IN ORDER

1. WRITE tools/rewrite-kml-labels.py (new file, stdlib only)
   - Reads docs/heads/sprinklers.json for the (lat, lon) → label mapping
   - Walks every <Placemark> in docs/Sprinklers Google Earth (1).kml,
     matches by (lat, lon) within ±1e-7, rewrites the <name> child
     element in place (preserve all other XML formatting)
   - Writes docs/heads/RENAME_MAP.md — markdown table with one row per
     placemark: | old_name | new_label | lat | lon | zone | color |
   - Idempotent — re-running produces identical output
   - Use xml.etree.ElementTree (same pattern as import-kml.py)

2. RUN python3 tools/rewrite-kml-labels.py
   - Verify console reports 41 placemarks rewritten
   - Inspect docs/heads/RENAME_MAP.md (should have 41 rows)
   - Spot-check the KML file: grep "<name>Z3-S1</name>" should match
   - Run it a SECOND time — no changes should occur

3. EDIT Fairway/PreviewData.swift
   - zone3() at line 420 — KEEP the existing problemAreas + schedule.
     Replace zone.heads = [...] with 11 entries Z3-S1..Z3-S11:
       • Z3-S1..Z3-S6 are NEW. Use:
           headType: "Hunter", nozzle: "TBD", arcDegrees: 0,
           isConfirmed: false, latitude/longitude from sprinklers.json,
           notes: "KML pin: <kml_name>.",
           photoPaths: ["heads/Z3-S<n>/photo-1.jpg", ".../photo-2.jpg",
                        ".../photo-3.jpg"]
       • Z3-S7..Z3-S11 COPY existing data from old H3-1..H3-5 (lines
         432–508 of current file): preserve arc, location, notes,
         isConfirmed, lat/lon. Change only label + photoPaths.
   - zone4() at line 533:
       • Rename name: "East Side" → name: "Back Yard"
       • Update notes (e.g., "Back yard rectangle along rear fence.")
       • Replace 3 placeholder heads with 12 entries Z4-S1..Z4-S12:
           headType: "Hunter Pro-Spray", nozzle: "TBD", arcDegrees: 0,
           isConfirmed: false, lat/lon from sprinklers.json,
           notes: "KML pin: <kml_name>.", photoPaths: ["heads/Z4-S<n>/...."]
       • Replace placeholder problemAreas (lines 549–554) with pre-season
         stubs (e.g., "Coverage gaps to verify", "Nozzle types unconfirmed").
         Drop the H4-1-specific patio overspray line — it was made up.
       • Schedule: keep Cycle & Soak; PR TBD.

4. ADD applyPhase1MigrationIfNeeded() to Fairway/FairwayStore.swift
   - Call it from load() right after applyPhase0MigrationIfNeeded() (line 38)
   - Follow the idempotent pattern from applyPhase0MigrationIfNeeded
     (lines 47–100 in the same file)
   - Zone 3 rename: locate zone.number == 3. For any head with
     label.hasPrefix("H3-"), rename label to "Z3-S\(N+6)" and rewrite
     each photoPaths string from "heads/H3-N/..." to "heads/Z3-S\(N+6)/...".
   - Zone 3 add: if no head with label == "Z3-S1" exists in zone 3,
     append the 6 new heads (Z3-S1..Z3-S6) from PreviewData. Skip if
     any of them are already present (user-customized).
   - Zone 4 replace: locate zone.number == 4. If zone.name == "East Side"
     AND every head has label.hasPrefix("H4-"), this is the untouched
     placeholder → wipe the zone and re-seed from PreviewData.zone4().
     If zone.name != "East Side" OR any head has a non-"H4-" label,
     SKIP and print a warning to stdout (user customized — do not destroy).
   - Set changed = true; call save() once at the end if changed.

5. ADD a migration test to FairwayTests/FairwayBlobTests.swift
   - test_phase1Migration_renames_H3_to_Z3S_and_seeds_Z4_back_yard()
     1. Build a FairwayBlob containing the OLD seed shape: 5 H3-* heads
        in zone 3 with non-default data (unique notes), zone 4 named
        "East Side" with 3 H4-* heads.
     2. Inject into a fresh FairwayStore, call .load() (which runs
        Phase 0 then Phase 1).
     3. Assert: zone 3 has exactly 11 heads with labels Z3-S1..Z3-S11,
        the 5 old heads landed at Z3-S7..Z3-S11 with their original
        notes/isConfirmed preserved, photoPaths now use the Z3-S{N+6}
        path. Zone 4 has name == "Back Yard" and 12 heads Z4-S1..Z4-S12.

6. BUILD + TEST
   xcodebuild test \
     -project Fairway.xcodeproj -scheme FairwayTests \
     -destination 'platform=iOS Simulator,name=iPhone 15' \
     CODE_SIGNING_ALLOWED=NO

   xcodebuild build \
     -project Fairway.xcodeproj -scheme Fairway \
     -destination 'platform=iOS Simulator,name=iPhone 15' \
     CODE_SIGNING_ALLOWED=NO

   ⚠️ If iOS 17.2 simulator runtime is missing (HANDOFF.md "Environment
   Blocker" section), tell me — do not lower deployment target.

7. UPDATE DOCS + COMMIT
   - Append entries to portfolio/fairway-ios/CHANGELOG.md (## [Unreleased]),
     ROADMAP.md (mark KML reimport done), HANDOFF.md State row, LEARNINGS.md
     (anything surprising about the migration).
   - Update root /Users/chase/Developer/chase/ROADMAP.md Change Log row.
   - Run `checkpoint` (script at repo root) to snapshot.
   - Stage + commit only the Fairway changes (do NOT commit drivemind or
     other repo cross-talk visible in git status).

---

REFERENCE — final label assignments (locked, mirrored in HANDOFF.md)

Zone 3 (red, N→S) — 11 heads, 5 inherit existing data:
  Z3-S1   "b yellow" 40.3005347, -111.7457402  NEW
  Z3-S2   "b yellow" 40.3005192, -111.7456873  NEW
  Z3-S3   "b black"  40.3004960, -111.7457237  NEW
  Z3-S4   "B black"  40.3004951, -111.7456180  NEW
  Z3-S5   "B Black"  40.3004731, -111.7456258  NEW
  Z3-S6   "b black"  40.3004648, -111.7456645  NEW
  Z3-S7   "b blue"   40.3004549, -111.7457087  was H3-1
  Z3-S8   "b red"    40.3004432, -111.7456787  was H3-2
  Z3-S9   "b red"    40.3003941, -111.7456939  was H3-3
  Z3-S10  "b red"    40.3003882, -111.7456666  was H3-4
  Z3-S11  "B bred"   40.3003639, -111.7456812  was H3-5

Zone 4 (no-color, N→S) — 12 heads, all NEW:
  Z4-S1   "b"        40.3005814, -111.7455280
  Z4-S2   "b"        40.3005727, -111.7455550
  Z4-S3   "b"        40.3005673, -111.7455952
  Z4-S4   "b"        40.3005565, -111.7456476
  Z4-S5   "b black"  40.3005493, -111.7456776
  Z4-S6   "b red"    40.3005471, -111.7455115
  Z4-S7   "b black"  40.3005394, -111.7455526
  Z4-S8   "b red"    40.3005263, -111.7455313
  Z4-S9   "b black"  40.3005193, -111.7455873
  Z4-S10  "b red"    40.3005121, -111.7456198
  Z4-S11  "b black"  40.3005096, -111.7455064
  Z4-S12  "b black"  40.3004866, -111.7455012

(Source: docs/heads/sprinklers.json — load that for exact lat/lon, kml_name,
and photo_paths if you need them programmatically.)

---

OUT OF SCOPE for this session (don't drift)

- Visual matching Z2-MATCH-1st..6th → Z2-S1..Z2-S6 (separate task)
- PHOTO_AUDIT.md / COVERAGE_ANALYSIS.md / PROPERTY_PLACEMENT.md (the
  2026-04-24 docs-sweep — comes after this lands)
- Filling per-head nozzle/arc/GPM data for the 17 new heads (Chase will
  do this in-app as he walks the property)
- HeadPinEditor MapKit work
- Any of the 10-phase Active Plan beyond this KML reimport

When all 7 steps are done, give me one paragraph summary: tests passing,
build passing, what to do in Google Earth web with the rewritten KML.
```
