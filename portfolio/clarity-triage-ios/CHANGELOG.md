# Changelog — Clarity Triage (iOS)

## [Unreleased]

*(nothing yet)*

## v0.1 — 2026-04-12 — Phase 2 MVP

- **Models:** `TriageBlob`, `TriageTask`, `TriageIdea`, `TriageWin` (Codable, UserDefaults JSON via `StorageHelpers`)
- **Config:** `TriageConfig` — store key `chase_triage_ios_v1`, categories, sizes, win categories, capacity→slots table
- **Store:** `TriageStore` — `@Observable @MainActor`, `nonisolated init()`, daily capacity reset, size-weighted slot usage, tasks / ideas / wins CRUD
- **Views:** TabView (Tasks · Ideas · Wins); capacity picker + task list + quote banner; ideas pipeline (three stages); win logger + today list
- **Quotes:** `triageQuotes` — execution, focus, discipline, priority, momentum themes
- **Tests:** `TriageBlobTests` — encode/decode, date guard, slot math, idea stage cap
- **Project:** `ClarityTriage.xcodeproj` generated programmatically — `CT*` PBX IDs, local SPM `../clarity-ui`, scheme `ClarityTriage`
- **Verify:** `xcodebuild build` and `xcodebuild test` on **iPhone 15 (iOS 17.2) simulator** with `CODE_SIGNING_ALLOWED=NO` (this machine has no “iPhone 16” simulator runtime; a physical-device destination picked `iphoneos` and failed install without signing)
