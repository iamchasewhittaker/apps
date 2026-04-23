# Fairway — Quick-Log FAB + Yard Map + Mow Presets

> Handoff plan for the next Claude Code session. Scope is Hybrid MVP + drag-wedge editor. No Rachio this round.

## 1. Goal

A user opens Fairway, taps a floating "+" on the bottom-right of any tab, and logs work without digging through menus. One tap gets them into a mow entry with a direction preset (N-S, E-W, two diagonals, checkerboard, or free text), a quick observation with a photo and optional map pin, a manual water run, or a fertilizer application that auto-decrements inventory. A new Map tab shows every sprinkler head pinned on the satellite image of their yard, color-coded by zone, with arc wedges showing spray coverage. Tapping a head opens a full-screen editor where the user drags the wedge edges to match what they see on the ground, pinches to set radius, then saves exact coordinates + arc + bearing back to the head record. A Settings → Property screen captures a real address and geocodes it once so the map opens centered on their actual yard. "Done" means a user standing in the backyard can log what they just did in under 15 seconds, and can visually place a head on the satellite within a few feet of its real position.

## 2. Scope decision

**Picked: Hybrid — MVP slice + drag-wedge editor. Rachio deferred to Round 2.**

Rationale: the Rachio Personal Access Token has not been generated yet, so any Rachio milestone would stall immediately. The drag-wedge editor is retained inside this round because it lets heads land with accurate coordinates + arc + bearing in a single pass, which makes the map feature useful on day one instead of shipping a decorative map that needs a follow-up to be functional. Cutting Rachio out of this round reduces the work by roughly half without touching the quality of what ships.

## 3. Decisions locked in

| Decision | Choice |
|---|---|
| FAB actions | Mow · Water run (manual) · Fertilizer app · Observation |
| FAB scope | Global. Same menu on every tab. |
| Map strategy | MapKit satellite + real GPS pins. Drag-wedge for arc + direction. |
| Map layout | One yard-wide map. Heads color-coded by zone. |
| Map tab placement | New primary tab. Soil moves into More → Tools to keep tab count at 5. |
| Mow direction | Preset picker + free-text fallback. Migration-safe. |
| Yard geocoding | Address entry in Settings. `CLGeocoder` once. No runtime location permission. |
| Observation shape | Text + zone + optional photo + optional map pin. |
| Rachio scope | **Deferred to Round 2.** User has not generated a PAT. |
| Photo storage | **Documents directory + UUID reference.** Never inline JPEG bytes in `FairwayBlob` / UserDefaults. |

## 4. Accessibility gate (blocks merge if violated)

- 44pt hit targets on drag handles, high-contrast against satellite green
- Every head pin has a visible text label (not color-only), respects Dynamic Type
- Map tab has a companion "List" toggle so every head and observation is reachable without gestures

## 5. Files to touch

- `Fairway/FairwayBlob.swift` (modified)
- `Fairway/FairwayStore.swift` (modified)
- `Fairway/FairwayConfig.swift` (modified)
- `Fairway/Views/ContentView.swift` (modified)
- `Fairway/Views/MowLogView.swift` (modified)
- `Fairway/Views/HeadDetailView.swift` (modified)
- `Fairway/Models/HeadData.swift` (modified)
- `Fairway/Models/MaintenanceData.swift` (modified — add `MowDirection` enum alongside existing `MowEntry`)
- `Fairway/PreviewData.swift` (modified)
- `Fairway/Models/ObservationData.swift` (new)
- `Fairway/Models/WaterRunData.swift` (new)
- `Fairway/Models/FertApplicationData.swift` (new)
- `Fairway/Models/PropertySettings.swift` (new)
- `Fairway/Services/Geocoder.swift` (new)
- `Fairway/Services/PhotoStore.swift` (new — writes JPEGs to Documents dir, returns UUID, reads by UUID, deletes on observation delete)
- `Fairway/Views/QuickLogFAB.swift` (new)
- `Fairway/Views/QuickLogSheet.swift` (new)
- `Fairway/Views/AddObservationSheet.swift` (new)
- `Fairway/Views/AddWaterRunSheet.swift` (new)
- `Fairway/Views/AddFertAppSheet.swift` (new)
- `Fairway/Views/MapTabView.swift` (new)
- `Fairway/Views/MapListToggleView.swift` (new — list fallback for accessibility)
- `Fairway/Views/HeadPinEditor.swift` (new)
- `Fairway/Views/PropertySettingsView.swift` (new)
- `Fairway/Views/SettingsView.swift` (new)
- `FairwayTests/FairwayBlobTests.swift` (modified — add v1→v2 decode tests)
- `FairwayTests/MowDirectionTests.swift` (new)
- `FairwayTests/PhotoStoreTests.swift` (new)
- `Fairway.xcodeproj/project.pbxproj` (modified — register every new Swift file with `FW*` UUID prefix)

## 6. Acceptance criteria

- `xcodebuild build -project Fairway.xcodeproj -scheme Fairway -destination 'platform=iOS Simulator,name=iPhone 15' CODE_SIGNING_ALLOWED=NO` succeeds.
- `xcodebuild test -project Fairway.xcodeproj -scheme FairwayTests -destination 'platform=iOS Simulator,name=iPhone 15' CODE_SIGNING_ALLOWED=NO` passes. Tests must include: v1 blob JSON (missing new fields) round-trips into v2 with all new fields defaulting to nil/empty; v2 blob round-trips; `MowDirection.other("custom")` serializes through `MowEntry.stripeDirection` without data loss; `PhotoStore` writes → reads → deletes a JPEG from the Documents directory.
- FAB is visible bottom-right on all 5 tabs. Tapping opens a sheet with 4 actions. Sheet dismisses cleanly. FAB hides while any sheet is presented.
- Logging a mow with the `Diagonal NE-SW` preset saves, reloads after app restart, and displays the correct label in `MowLogView`. Any pre-existing free-text entry on device survives migration as `.other(<original string>)` and renders in the picker's "Other" slot.
- Adding an observation with a photo writes the JPEG to the app's Documents directory. The `Observation` record stores only the UUID. Deleting the observation deletes the file. Re-launching the app reloads the photo from disk.
- Observation photos are JPEG-compressed to ≤500 KB before write.
- Settings → Property: entering `345 E 170 N, Vineyard, UT 84059` geocodes to valid lat/lng and persists. Property address entry is the only path to set map center. No runtime location permission is requested.
- Map tab opens centered on the property. If `PropertySettings` is nil, Map shows an empty state with a "Set property address" CTA that deep-links to Settings → Property. Does not default to Apple Park.
- Zone filter chips show all 4 zones. Head pins render tinted by zone. Static arc wedges render for heads that have coords + arc data. Heads missing coords appear in the List toggle with a "Place on map" CTA.
- Map List toggle reveals every head (label, zone, coords) and every observation (date, zone, text preview, optional photo thumbnail). Works with VoiceOver enabled and Dynamic Type at XXL without layout breaking.
- Head pin editor: drop pin on tap, rotate both wedge edges independently, pinch to set radius. Save writes `latitude`, `longitude`, `arcDegrees`, `startBearingDegrees`, and `radiusFeet` to the head. Numeric fields at the bottom stay editable and reflect the gesture state live.
- Accessibility: drag handles are 44pt+ with high contrast against green satellite tiles. Every head pin has a visible text label respecting Dynamic Type. Map tab has a working List toggle. These three are merge blockers.
- Existing v1 blobs on device migrate cleanly. No data loss. No crash on first launch after update.
- Tab bar reads Zones / Lawn / Map / Maintenance / More. Soil is reachable from More → Tools.

## 7. Out of scope

- All Rachio integration: PAT, Keychain, device/zone sync, run history polling, "Run zone now", zone mapping UI. Deferred to Round 2.
- Auto-logged water runs from Rachio events. Manual-only this round.
- Webhook server.
- Historic backfill of Rachio runs.
- Head photos. Observation photos only this round. Head photos are a later retrofit using the same `PhotoStore`.
- Multi-property support.
- Mow direction analytics or rotation suggestions.
- Offline queue for any cloud action.
- Apple Watch app or "Run zone now" complication.
- iCloud sync.

## 8. Open risks + gotchas

- **Rachio PAT is not yet generated.** Round 2 is blocked on the user generating a Personal Access Token at `account.rach.io`. The next session should not start Rachio work assuming a PAT exists. When the user is ready for Round 2, they will generate the PAT first, then a dedicated session picks up Rachio.
- **Photo storage must use Documents directory + UUID reference.** Never inline JPEG bytes into `FairwayBlob` or UserDefaults. `PhotoStore` owns writes, reads, and deletes. Deleting an observation must delete its file. Tests cover this.
- **Map center coordinate bootstrap.** If `PropertySettings` is nil, Map tab shows an empty state with a "Set property address" CTA. Do not default the map to Apple Park or to device location. No `CLLocationManager` in this round.
- **Satellite imagery accuracy at yard scale is the riskiest assumption.** Verify on real device early. If heads are not visually identifiable within 3 feet of ground truth on Apple satellite tiles in Vineyard UT, fall back to the "upload aerial photo" strategy. The head coordinate fields can be reused either way, so this is a rendering swap, not a data change.
- **Tab bar count.** Holding at 5 by demoting Soil into More → Tools. Any future new primary tab forces iOS into "More" overflow.
- **Existing v1 blobs on device must decode into v2** with all new fields defaulting to nil/empty. Codable defaults handle this implicitly but tests must cover it.
- **`MowEntry.stripeDirection` stays `String`.** The new `MowDirection` enum is UI-only. `.other(custom)` round-trips through the raw string. Existing free-text entries migrate by landing in `.other(<string>)`.
- **Drag-wedge math.** `startBearingDegrees` is clockwise from North (0–359). `arcDegrees` is the sweep size (0–360). The trailing wedge edge sits at `startBearingDegrees + arcDegrees` mod 360. Render as a `MapPolygon` approximating the sector. If perf is rough with 14+ wedges, switch to a single `Canvas` overlay.
- **Photo size cap.** Compress to ≤500 KB before writing. Reject unreasonably large inputs with a clear error.
- **PhotosPicker permission.** `PhotosPicker` from SwiftUI does not require `NSPhotoLibraryUsageDescription` for read access via the picker. Camera capture would require `NSCameraUsageDescription`. Picker-only this round.
- **`MowLogView` currently lives inside More → Tools.** Do not move it. Just swap the direction field.

## 9. Starting prompt for next session

> Read `docs/plans/fairway-quicklog-map.md` and implement it. Scope is Hybrid MVP + drag-wedge editor, no Rachio. Ask before deviating from scope. Accessibility gate blocks merge. Start with the model layer, then FAB shell, then mow presets, then observations (including PhotoStore), then Property/geocoding, then Map tab (read-only), then drag-wedge editor. Run the build + tests after each milestone. Commit at each green milestone with a conventional commit message. Do not touch Rachio.
