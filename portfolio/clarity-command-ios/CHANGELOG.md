# Changelog — Clarity Command (iOS)

## [Unreleased]

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
