# Changelog — Unnamed (iOS)

## [Unreleased]

## [0.1.2] — 2026-04-25

### Changed — UX parity with web
- **Inbox edit/delete:** each inbox row now shows a pencil + trash button (44pt, accessibility-labeled). Pencil enters an inline edit mode with Save/Cancel; trash triggers a 3-second confirm-delete row (red tint, Keep/trash, auto-reverts). Second trash tap calls `store.deleteItem(id:)`. New `InboxRowView` struct with `RowMode` enum (`view | edit | confirmDelete`). New store methods: `updateItemText(id:text:)` and `deleteItem(id:)`.
- **Sort lane help sheet:** each lane row now has an ⓘ `Button` on the right in a separate `HStack` column — clean tap-area separation, no gesture conflicts. Tapping ⓘ sets `@State var helpLane: Lane?` and presents `LaneHelpSheet` via `.sheet(item: $helpLane)`. Sheet shows lane summary, bulleted examples, italic rule, and a "Sort into [Lane]" CTA that dismisses and assigns. Requires `Lane: Identifiable` (added to `Lanes.swift`).
- **Lane help content:** `Lanes.swift` gains `summary: String`, `examples: [String]`, and `rule: String` computed properties on `Lane` — mirrors `LANE_HELP` from the web `types.ts`.
- **Check clarification:** new `LockedLanesHeader` view shows today's locked lanes as colored chips (or "No lanes locked today." if absent). Shared by `CheckFormView` and `CheckDoneView`. Q1 reworded: "Did you produce something today?" → "Did you finish at least one thing today?" with helper. Q2 reworded: "Did you stay in your lanes?" → "Did your effort mostly stay in today's two lanes?" with conditional helper. Result label updated: "Produced:" → "Finished a thing:".
- **New file:** `Views/Check/LockedLanesHeader.swift` — registered in `project.pbxproj` (UN01…012 / UN02…014).

## [0.1.1] — 2026-04-25

### Fixed
- Build unblocked: mounted iOS 17.2 simulator runtime DMG (`sudo hdiutil attach ... iOS_21C62`) so actool can resolve `runtimeBundlePath` — `BUILD SUCCEEDED`
- Installed and launched v0.1 on iPhone 12 Pro Max (iOS 26.4.1) via `xcrun devicectl`

## [0.1.0] — 2026-04-17

### Added
- All 5 flows: Capture, Sort, Today (Lane Lock), Today (Focus), Check
- `@Observable @MainActor AppStore` with UserDefaults persistence (`unnamed_ios_v1`)
- `AppState`, `Item`, `DailyLock`, `DailyCheck`, `Lane`, `ItemStatus` — all Codable
- `StorageHelpers` — thin UserDefaults/JSONCoder wrapper (no external deps)
- `DateHelpers.todayString` — YYYY-MM-DD in local time; `isToday()`
- Lane metadata and colors via `Lane` extensions in `Lanes.swift`
- `Color(hex:)` initializer extension
- Bottom tab navigation with inbox count badge, lock dot, check dot
- Lane lock guard — irreversible until midnight
- One-at-a-time focus view (skip cycles item to end of array)
- Check result phrases: "Solid day." / "Halfway there." / "Rest day. That counts too."
- Haptic feedback: `.medium` on lane lock, `.light` on Done
- AppIcon: amber triangle (▲) on near-black background, 1024×1024 PNG
- Hand-crafted `Unnamed.xcodeproj` (UN* UUID prefix, no xcodegen)
- `UnnamedTests` — 10 unit tests (encode/decode, lock irreversibility, daily check, date format)
- Built and installed on iPhone 12 Pro Max
