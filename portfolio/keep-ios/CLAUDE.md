# Keep (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Display name:** Keep
- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.Keep`
- **Storage key:** `chase_keep_ios_v1`
- **Stack:** SwiftUI + iOS 17 + `@Observable` + `UserDefaults` + Codable — no SwiftData, no external deps
- **Xcode project prefix:** `KP` (UUIDs, build refs)
- **Xcode project:** `Keep.xcodeproj` (hand-crafted `project.pbxproj`)
- **Per-app handoff:** [HANDOFF.md](HANDOFF.md)

## What This App Is

Home inventory and organization for Chase (and eventually Kassie). Two-phase flow:
1. **Triage:** Pick up items, decide Keep / Donate / Toss / Unsure
2. **Zone:** Assign kept items to rooms and spots

The name works on two levels: "Do I keep this?" (the triage question) and "The Keep" (a fortress — what you protect and value).

> *"For Reese. For Buzz. Forward — no excuses."*

## File Structure

```
Keep.xcodeproj/
  project.pbxproj      ← hand-crafted, KP* UUID prefix

Keep/
  KeepApp.swift        ← @main, store init, .environment(), .preferredColorScheme(.dark)
  Models/
    KeepBlob.swift     ← root Codable struct (rooms, spots, items, donationBags)
    Room.swift         ← Room struct (name, emoji)
    Spot.swift         ← Spot struct (name, roomID)
    Item.swift         ← Item struct (name, photoID, status, roomID, spotID) + TriageStatus enum
  Services/
    KeepStore.swift    ← @Observable @MainActor store — load/save/all mutations
    KeepConfig.swift   ← storeKey, bundleID, coachThreshold
    PhotoStore.swift   ← file-based JPEG storage (Documents/keep-photos/)
  Theme/
    KeepTheme.swift    ← warm amber palette + card modifier + status colors
  Views/
    ContentView.swift  ← TabView: Rooms + Stats
    HomeView.swift     ← rooms list + stats banner + AddRoomSheet
    RoomDetailView.swift ← spots + unsorted items + AddSpotSheet
    AddItemView.swift  ← camera + name entry (batch mode)
    TriageView.swift   ← card-by-card triage + SpotPickerSheet + CoachSheet
    StatsView.swift    ← progress dashboard + donation bags counter

KeepTests/
  KeepBlobTests.swift  ← backward-compat decode + roundtrip + computed helpers
```

## Architecture

- `@Observable @MainActor KeepStore` — single store injected via `.environment(store)`
- `@Environment(KeepStore.self)` in all views
- All data is `Codable` structs — never `[String: Any]`
- Single JSON blob at `UserDefaults` key `chase_keep_ios_v1`
- Photos stored as JPEG files in `Documents/keep-photos/` (UUID filenames)
- Photo references stored as `UUID?` (`photoID`) in Item — not raw `Data` in the blob

## Key Behaviors

- Triage has 4 options: Keep / Donate / Toss / Unsure
- If Keep → spot picker appears (if spots exist for that room)
- Coach triggers after 3+ consecutive Unsure decisions in a session
- Coach asks 3 yes/no questions, then suggests Keep or Let Go (user still decides)
- Donation bags counter is manual (tap to increment)
- Camera falls back to photo library on simulator

## Build Commands

> **Pre-build (2017 MBP · Ventura · Xcode 15.2):** Mount the iOS 17.2 runtime DMG once per session before any `xcodebuild` call — see root `CLAUDE.md § iOS Build Prerequisite`.

```bash
# Build for simulator
xcodebuild build \
  -project Keep.xcodeproj \
  -scheme Keep \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO

# Run tests
xcodebuild test \
  -project Keep.xcodeproj \
  -scheme Keep \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO
```

## How to Extend

1. Read the ROADMAP.md before adding anything new.
2. If a feature changes the data shape, add `decodeIfPresent` in the custom decoder.
3. Write a backward-compat test for every new field (see KeepBlobTests).
4. Photos go to filesystem via PhotoStore — never store image data in UserDefaults.

## References

- Store pattern: `portfolio/fairway-ios/Fairway/FairwayStore.swift`
- Photo pattern: `portfolio/fairway-ios/Fairway/Services/PhotoStore.swift`
- Theme pattern: `portfolio/fairway-ios/Fairway/FairwayTheme.swift`
- Portfolio conventions: `/CLAUDE.md`
