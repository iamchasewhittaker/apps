# LEARNINGS — Job Search HQ iOS

## 2026-04-15

- **Springboard icon cache:** After replacing `AppIcon` assets, iOS can show the previous icon until the app is **deleted** and reinstalled (or a clean install via `devicectl`). Same symptom if the first icon was too low-contrast on navy — prefer a Clarity-style band + glyph so the tile reads at a glance.

## 2026-04-14

- **Swift 5.0 / Xcode project `SWIFT_VERSION = 5.0`:** trailing commas in call argument lists (e.g. `Text("...", )`, `.overlay(..., )`) are rejected — remove trailing commas before `)`.
- **`@MainActor` store + `@State` default init:** `@State private var store = JobSearchStore()` fails if `JobSearchStore()` is MainActor-isolated; Check-in uses `nonisolated init()` on the store. Here we dropped `@MainActor` from the store for the same ergonomics (v1 UI is main-thread only anyway).
- **Simulator `xcodebuild test`:** new bundle id needs a development profile or `-allowProvisioningUpdates`; document ⌘U in Xcode for first run.
