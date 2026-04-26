# Fairway iOS — Session Start (2026-04-25 current)

> Copy everything below the line into a new Claude Code chat.

---

Read `portfolio/fairway-ios/CLAUDE.md` and `portfolio/fairway-ios/HANDOFF.md` first, then continue from this context.

## What's done and on device (2026-04-25, four sessions)

- **Pre-Season Audit** live at `More → Pre-Season Audit` — 41 heads by zone, photo-audit observations, confidence badges, progress counter
- **Audit sheet** (tap any head) — pre-fills Nozzle/Arc/Radius/GPM from audit-derived estimates; "Still needed from field" shows gold estimated values; "Field Measurement Guide" (collapsible) explains arc°, radius, catch-cup PR test with nozzle reference table
- **GPM field** added to `HeadData.fieldGPM` (decodeIfPresent, backward compat)
- **Phase 2 + 3 migrations** — backfill `auditObservation`/`auditConfidence`; fix wrong seeded property center
- **Map camera** bumped to 200 m; per-zone convex-hull polygon overlays (dashed boundary, 10% fill) distinguish Z2/Z3/Z4 visually
- **Z2 Heads tab sub-grouping** — "PARK STRIP" (Z2-S1..S6 + Z2-MATCH-*) and "MAIN YARD" (Z2-S7..S18) as two sections; other zones unchanged
- **Problems — bullet actions** — `ProblemData.actions: [String]` field; Open section renders each action as a gold bullet point; Add/edit sheet has "Specific things needed" rows
- **Problems — shopping list** — "More — Shopping List" section in Problems tab per zone; sourced from head nozzle/fieldNozzle mismatches via `recommendedNozzleShoppingList(for:)` in `FairwayStore`
- **Pre-season seeds removed** — Dry park strip, Dry lawn center, Weed pressure park strip (Z2) + East fence coverage gap, Hardscape overspray (Z3) removed; Z2 lawn observation removed; Z4 problems gained action bullets
- **Schedule tab** — read-only banner ("Set schedule in Rachio app — Fairway plans, Rachio runs"); "?" info popover on every parameter row explaining what it does; recent-fertilizer card if any `FertApplication` within last 7 days on this zone
- **Linear project:** https://linear.app/whittaker/project/fairway-ios-674db91fc8d1
- **Build + tests:** 37/37 passing (3 new: `testProblemActionsBackwardCompat`, `testProblemActionsRoundTrip`, `testNozzleShoppingListForZ2`). App installed on iPhone 12 Pro Max.

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

1. **Field walk** — open `More → Pre-Season Audit` on iPhone, walk each zone. Audit sheet is pre-filled with estimates — just correct and save. Tap "Head cleared" when done. Z4-S1 first (buried, zero coverage).
2. **Map pin verification** — visually confirm convex-hull overlays on device: Z3 NW pins (Z3-S1..S6) should show inside the Z3 teal boundary, not blended with Z4 magenta.
3. **Seed cleanup** — after field walk, update `nozzle:` strings in `PreviewData.swift` with confirmed values; flip `confirmedBySeasonTest: true` for cleared heads.
4. **Visual matching Z2-MATCH-1st..6th → Z2-S1..S6** — once Chase field-confirms provisional matching (especially Z2-S5 anomaly), run `git mv docs/heads/Z2-MATCH-1st docs/heads/Z2-S1` etc. and update `photoPaths` in `phase0Z2Heads()`.

## Key invariants

- New HeadData fields must use `decodeIfPresent` in the extension `init(from:)` — missing key = crash for existing users
- New data fields pre-populated for existing users ALSO need a `FairwayStore.applyPhaseN...MigrationIfNeeded()` — PreviewData seed alone backfills fresh installs only
- Pre-fill form defaults: check saved field value first, skip "TBD…" placeholder strings, fall back to seed estimate
- Z2 is a single valve (park strip always irrigates with front yard)
- Rachio token: Keychain only, never in blob or logs
- Mount iOS 17.2 runtime DMG before any `xcodebuild` call (see root CLAUDE.md)

## Changed files (all four sessions)

`FairwayStore.swift` · `HeadData.swift` · `ProblemData.swift` · `PreviewData.swift` · `PreSeasonAuditView.swift` · `HeadInventoryView.swift` · `ProblemAreaView.swift` · `ScheduleView.swift` · `MapTabView.swift` · `ContentView.swift` · `FairwayBlobTests.swift` · `CLAUDE.md` · `project.pbxproj` · `docs/heads/PHOTO_AUDIT.md` · `CHANGELOG.md` · `LEARNINGS.md` · `HANDOFF.md` · `docs/SESSION_START_NEXT.md`

---

PRE-BUILD (run once per session before any xcodebuild call):
```bash
sudo hdiutil attach \
  /Library/Developer/CoreSimulator/Images/B3B0953C-8EEB-4DF1-8149-B9770CC90CC7.dmg \
  -mountpoint /Library/Developer/CoreSimulator/Volumes/iOS_21C62 \
  -readonly -noverify
```

BUILD COMMANDS:
```bash
xcodebuild test -project Fairway.xcodeproj -scheme FairwayTests \
  -destination 'platform=iOS Simulator,name=iPhone 15' CODE_SIGNING_ALLOWED=NO 2>&1; echo "EXIT:$?"

xcodebuild build -project Fairway.xcodeproj -scheme Fairway \
  -destination 'id=A0C65578-B1E0-4E96-A1EC-EEB8913BD11C' \
  CODE_SIGNING_ALLOWED=YES -allowProvisioningUpdates 2>&1; echo "EXIT:$?"
```

Chase's iPhone 12 Pro Max devicectl id: A0C65578-B1E0-4E96-A1EC-EEB8913BD11C

---

_End of paste block_

---

# (archive) Pre-session-4 prompt

See git history for previous session start content.
