# Changelog — Clarity Time (iOS)

## [Unreleased]

- **App icon:** **User-selected** clock mark (`docs/design/app-icon-source-user-1024.png`) → `AppIcon.appiconset/AppIcon.png` (1024×1024); `docs/design/app-icon-mockup-wide.png` = same art centered on `#E6E7EB` 1376×768 for decks; `Contents.json` universal iOS slot unchanged
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) (from portfolio template); `CLAUDE.md` links branding + shared icon spec

## v0.1 — 2026-04-12 — Phase 3 MVP

- **Models:** `TimeBlob`, `TimeSession`, `ActiveTimerState`, `ScriptureDayEntry`; streak helper on blob; `TimeTimerMath` for testable timer elapsed
- **Config:** `TimeConfig` — store key `chase_time_ios_v1`, categories
- **Store:** `TimeStore` — `@Observable @MainActor`, `nonisolated init()`, timer start/pause/resume/stop/discard, manual sessions, scripture upsert, `StorageHelpers` persistence
- **Views:** TabView (Time · Scripture); timer + manual log + session list + quote banner; streak + today toggle + optional reference
- **Quotes:** `timeQuotes` — focus, rhythm, presence, scripture themes
- **Tests:** `TimeBlobTests` — encode/decode, streak rules, timer math
- **Project:** `ClarityTime.xcodeproj` generated programmatically — `CX*` PBX IDs, local SPM `../clarity-ui`, scheme `ClarityTime`
- **Verify:** `xcodebuild build` + `xcodebuild test` on **iPhone 15 (iOS 17.2) simulator** with `CODE_SIGNING_ALLOWED=NO` (use `-showdestinations` to pick an installed runtime)
