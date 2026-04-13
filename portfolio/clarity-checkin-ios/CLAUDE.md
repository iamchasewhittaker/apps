# Clarity Check-in (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App Identity
- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.ClarityCheckin`
- **Storage keys:** `chase_checkin_ios_v1` (main), `chase_checkin_ios_draft_v1` (draft), `chase_checkin_ios_meds_v1` (meds)
- **Entry:** `ClarityCheckin/ClarityCheckinApp.swift`
- **Shared package:** `../../clarity-ui` (local SPM dependency — `ClarityUI`)

## Purpose
Morning and evening wellness check-in app with medication tracking, mood logging, pulse mood snapshots, and daily quotes.

## Tech Stack
SwiftUI + iOS 17 + `@Observable` + UserDefaults + Codable structs. No SwiftData, no external dependencies beyond ClarityUI.

## Commands
- Open `ClarityCheckin.xcodeproj` in Xcode → ⌘B to build, ⌘R to run
- Tests: ⌘U (`CheckinBlobTests`)
- Build check (no signing): `xcodebuild build -scheme ClarityCheckin -destination 'platform=iOS Simulator,name=iPhone 16' CODE_SIGNING_ALLOWED=NO`

## File Structure
```
ClarityCheckin/
  ClarityCheckinApp.swift    — @main entry, store init, .environment()
  Models/
    CheckinBlob.swift        — CheckinBlob, CheckinEntry, MorningData, EveningData, PulseCheck
    DraftBlob.swift          — In-progress draft (autosaved)
  Services/
    CheckinConfig.swift      — UserDefaults keys enum + defaults
    CheckinStore.swift       — @Observable store (load, save, draft, commit, pulse, meds)
  Constants/
    Quotes.swift             — checkinQuotes array (faith, ADHD, stoic, self-compassion, morning)
  Views/
    ContentView.swift        — Root: quote banner, today status card, past days
    CheckinFlow/
      CheckinFlowView.swift  — Morning/evening wizard with section navigator
      Sections.swift         — SleepSection, MorningStartSection, MedCheckin, HealthLifestyle, EndOfDay
    History/
      EntryDetailView.swift  — Read-only past entry detail
    Components/
      TodayStatusCard.swift  — Today status + primary CTA button
      PastDaysSection.swift  — List of past entries
      PulseCheckView.swift   — Quick mood snapshot sheet
      MedsEditorView.swift   — Add/remove medications sheet
ClarityCheckinTests/
  CheckinBlobTests.swift     — Encode/decode, same-day merge, stale draft
```

## Architecture
- `@Observable @MainActor CheckinStore` — single source of truth injected via `.environment()`
- `@Bindable var s = store` in views for two-way binding to `@Observable` properties
- Draft autosave: `store.saveDraft()` called on every `onChange`; stale-day discard on load
- Same-day merge: morning + evening always stored in the same `CheckinEntry` keyed by date

## Accessibility (non-negotiable)
- All fonts are semantic SwiftUI fonts via `ClarityTypography` — never hardcoded sizes
- All buttons have `minHeight: ClarityMetrics.minTapTarget` (44pt)
- All custom components have `.accessibilityLabel` and `.accessibilityHint`
- Use `ClarityPalette.muted` for secondary text (verified contrast ratio)
- No information conveyed by color alone

## Constraints
- Dark mode only — `ClarityPalette.bg` on every surface
- No TypeScript, no external dependencies (except ClarityUI)
- Codable structs for all data — never `[String: Any]`
- Do not change `CheckinConfig` key strings once data is on a real device
