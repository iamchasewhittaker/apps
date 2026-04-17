# Changelog — Unnamed (iOS)

## [Unreleased]

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
