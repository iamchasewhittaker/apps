# Changelog — Clarity Command (iOS)

## [Unreleased]

### Fixed (2026-04-28)
- **`CommandStore` Swift 6 concurrency warnings:** removed `nonisolated` from `init()` — the class is `@Observable @MainActor`, so all stored properties are MainActor-isolated; the nonisolated init was flagging 10 "cannot access property in non-isolated initializer" warnings that will become hard errors in Swift 6. Construction site (`@State private var store = CommandStore()` in `App`) already runs on MainActor in iOS 17+, so no callsite changes needed. Build is now warning-clean.

### Added (2026-04-27) — Phase 2 cross-app scoreboard
- **Cross-app reads:** `CommandCloudSync.pull(into:)` now also fetches `job-search-daily` and `wellness-daily` rows from Supabase in parallel after the main `command` pull. New private `fetchAppData(appKey:token:)` helper + generic `decodedSummary` powering both reads.
- **Models:** `JobSearchDaily` and `WellnessDaily` Codable structs (`Models/CrossAppDaily.swift`) — both use `decodeIfPresent` for forward compatibility.
- **Store:** `CommandStore.jobSearchDaily` + `wellnessDaily` (Observable) + `applyJobSearchDaily/applyWellnessDaily` setters.
- **UI:** new `LiveAppDataView` on Scoreboard tab — mirrors web `LiveAppData` panel; shows Job Search count + Wellness sun/moon/run icons; auto-hides when both summaries are nil. VoiceOver combines each row into a single announcement.
- **Auto-pull:** `ClarityCommandApp` `.task` modifier bootstraps the session and fires `pull(into:)` on launch when signed in (previously only manual via Settings).

### Changed
- `pull(into:)` is now resilient: a failed `command` pull no longer blocks the cross-app summaries from being fetched.

## [v0.2 sync slice]

- **Supabase v0.2:** `CommandSupabaseConfig` + `CommandCloudSync` (OTP, pull, push, debounced push on `CommandStore.save`) — `app_key = command`, same project as web.
- **UI:** `CommandSyncSection` in Settings; `ContentView` / `SettingsTabView` take `CommandCloudSync`.
- **Blob parity:** `CommandBlob` encodes `syncAt` as `_syncAt` for JSON matching web `theme.js`.
- **App icon:** `tools/generate_app_icon.py` (opaque RGB PNG + PNG signature); interim suite-style tile until final glyph.
- **Docs:** `docs/DEVICE_QA.md` physical-device checklist.

## v0.1 — 2026-04-14 — Initial source

- Models: CommandBlob, DayEntry, MorningCommit, EveningReflection, Target
- CommandConfig: UserDefaults keys (`chase_command_ios_v1`), default targets
- CommandPalette: Gold accent (`#c8a84b`) color system extending ClarityPalette
- CommandStore: @Observable, load/save, target tracking, streak calculation, daily scoring
- ContentView: 3-tab layout (Mission, Scoreboard, Settings) with gold accent tab bar
- MissionTabView: morning commit + evening reflection flow container
- TargetListView: daily target checklist with completion toggles
- ConvictionPanel: faith + family urgency display ("For Reese. For Buzz.")
- CounterBanner: day counter since commitment date
- ScriptureCard: daily scripture rotation (Book of Mormon, D&C, KJV)
- HerWordsCard: motivational words display
- JobActionLogger: job search action tracking
- EveningReflectionView: evening review form with daily score
- ScoreboardTabView: streaks, stats, and calendar overview
- WeekGridView: 7-day completion grid
- MonthCalendarView: monthly heatmap calendar
- AreaStreaksView: per-area streak counters
- StatsRow: summary statistics row
- SettingsTabView: preferences, data reset, about section
- GoldButton: reusable gold-accented action button component
- StatusBadge: morning/evening status indicator component
- TargetRow: single target row with checkbox component
- Scriptures.swift: daily scripture rotation constants
- Reminders.swift: motivational reminder and conviction phrase constants
- CommandBlobTests: encode/decode, scoring, streak logic unit tests
- `ClarityCommand.xcodeproj` generated programmatically + shared scheme
- ClarityUI linked as local SPM package (`../clarity-ui`)
