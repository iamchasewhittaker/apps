# Clarity Command (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App Identity
- **Version:** v0.1
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — gold accent, icon spec, suite table; do not restate full rules in session prompts. **Change launcher (any Clarity app):** paste [`docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md`](../../docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md) in a new chat.
- **Bundle ID:** `com.chasewhittaker.ClarityCommand`
- **Storage key:** `chase_command_ios_v1`
- **Entry:** `ClarityCommand/ClarityCommandApp.swift`
- **Shared package:** `../clarity-ui` from this app folder (local SPM — `ClarityUI`; see `project.pbxproj` `XCLocalSwiftPackageReference`)
- **PBX GUID prefix:** `CD`
- **DEVELOPMENT_TEAM:** `9XVT527KP3`

## Purpose
Daily accountability hub — morning mission commit, evening reflection, scoreboard streaks, and faith-driven urgency. Native iOS port of the Clarity Command web app.

> *"For Reese. For Buzz. Forward — no excuses."*

## Tech Stack
SwiftUI + iOS 17 + `@Observable` + UserDefaults + Codable structs. Gold accent (`#c8a84b`) via app-local `CommandPalette`. No SwiftData, no external dependencies beyond ClarityUI.

## Commands
- Open `ClarityCommand.xcodeproj` in Xcode → ⌘B to build, ⌘R to run
- Tests: ⌘U (`CommandBlobTests`)
- Build check (no signing): `xcodebuild build -scheme ClarityCommand -destination 'platform=iOS Simulator,name=iPhone 16' CODE_SIGNING_ALLOWED=NO`

## File Structure
```
ClarityCommand/
  Assets.xcassets/              — AppIcon (1024 master) + AccentColor
  ClarityCommandApp.swift       — @main entry, store init, .environment()
  Models/
    CommandBlob.swift            — CommandBlob, DayEntry, MorningCommit, EveningReflection, Target
  Services/
    CommandConfig.swift          — UserDefaults keys enum + defaults
    CommandPalette.swift         — Gold accent color system (app-local, extends ClarityPalette)
    CommandStore.swift           — @Observable store (load, save, targets, streaks, scoring)
  Constants/
    Scriptures.swift             — Daily scripture rotation (BoM, D&C, KJV)
    Reminders.swift              — Motivational reminders and conviction phrases
  Views/
    ContentView.swift            — Root: tab bar (Mission, Scoreboard, Settings)
    Mission/
      MissionTabView.swift       — Morning/evening flow container
      TargetListView.swift       — Daily target checklist
      ConvictionPanel.swift      — Faith + family urgency panel
      CounterBanner.swift        — Day counter since commitment
      ScriptureCard.swift        — Daily scripture display
      HerWordsCard.swift         — Motivational words card
      JobActionLogger.swift      — Job search action log
      EveningReflectionView.swift — Evening review and scoring
    Scoreboard/
      ScoreboardTabView.swift    — Streaks, stats, calendar overview
      WeekGridView.swift         — 7-day grid with completion indicators
      MonthCalendarView.swift    — Monthly calendar heatmap
      AreaStreaksView.swift       — Per-area streak counters
      StatsRow.swift             — Summary stats row
    Settings/
      SettingsTabView.swift      — Preferences, reset, about
    Components/
      GoldButton.swift           — Gold-accented action button
      StatusBadge.swift          — Morning/evening status indicator
      TargetRow.swift            — Single target row with checkbox
ClarityCommandTests/
  CommandBlobTests.swift         — Encode/decode, scoring, streak logic
```

## Architecture
- `@Observable @MainActor CommandStore` — single source of truth injected via `.environment()`
- `@Bindable var s = store` in views for two-way binding to `@Observable` properties
- 3-tab layout: Mission (morning commit + evening reflection), Scoreboard (streaks + stats), Settings
- Morning commit → set targets → track through day → evening reflection → daily score
- Scoring: percentage of targets completed, streaks by area, overall streak

## Accessibility (non-negotiable)
- All fonts are semantic SwiftUI fonts via `ClarityTypography` — never hardcoded sizes
- All buttons have `minHeight: ClarityMetrics.minTapTarget` (44pt)
- All custom components have `.accessibilityLabel` and `.accessibilityHint`
- Use `ClarityPalette.muted` for secondary text (verified contrast ratio)
- No information conveyed by color alone

## Constraints
- Dark mode only — `ClarityPalette.bg` on every surface
- Gold accent (`#c8a84b`) via `CommandPalette` — never use raw hex in views
- No TypeScript, no external dependencies (except ClarityUI)
- Codable structs for all data — never `[String: Any]`
- Do not change `CommandConfig` key strings once data is on a real device
