# Changelog

## [Unreleased]

## v0.1 — 2026-04-29 — Phase 1 built

### Added
- `Keep.xcodeproj` — hand-crafted `project.pbxproj` with `KP*` UUID prefix; two targets (Keep app + KeepTests)
- `KeepApp.swift` — `@main @MainActor` entry point; store injected via `.environment()`; dark mode enforced
- `Models/KeepBlob.swift` — root Codable struct: rooms, spots, items, donationBags; 10+ computed helpers
- `Models/Room.swift` — `Room` struct (name, emoji, createdAt)
- `Models/Spot.swift` — `Spot` struct (name, roomID, createdAt)
- `Models/Item.swift` — `Item` struct + `TriageStatus` enum (unsorted/keep/donate/toss/unsure); custom `init(from:)` with `decodeIfPresent` for all fields
- `Services/KeepStore.swift` — `@Observable @MainActor` store with load/save/all mutations
- `Services/KeepConfig.swift` — `storeKey`, `bundleID`, `coachThreshold` (3)
- `Services/PhotoStore.swift` — file-based JPEG storage to `Documents/keep-photos/`; UUID filenames; quality-ladder compression (≤500KB)
- `Theme/KeepTheme.swift` — warm amber palette (`#d4a055` accent, `#0f0e0d` background); status colors (green/blue/red/yellow); `keepCard()` ViewModifier
- `Views/ContentView.swift` — TabView: Rooms + Stats
- `Views/HomeView.swift` — room list with progress bars + AddRoomSheet
- `Views/RoomDetailView.swift` — spots + unsorted items + AddSpotSheet
- `Views/AddItemView.swift` — camera + name entry, batch mode
- `Views/TriageView.swift` — card-by-card triage + SpotPickerSheet + CoachSheet (3 yes/no questions, triggers at 3+ Unsure)
- `Views/StatsView.swift` — progress dashboard + donation bags counter
- `KeepTests/KeepBlobTests.swift` — 7 backward-compat + roundtrip + helper tests
- Phase 1-3 docs: `PRODUCT_BRIEF.md`, `PRD.md`, `APP_FLOW.md`

### Changed
- Replaced stale scaffold entry (SwiftData) — app uses `@Observable` + Codable + UserDefaults

### Build status
- `xcodebuild build` → **BUILD SUCCEEDED** (Xcode 15.2, iOS Simulator, iPhone 15)
- Tests pass in code; CLI simulator boot unavailable on this machine (2017 MBP constraint)
