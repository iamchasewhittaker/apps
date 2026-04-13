# Changelog — Clarity Check-in (iOS)

## [Unreleased]

## v0.1 — 2026-04-12 — Initial source
- Models: CheckinBlob, CheckinEntry, MorningData, EveningData, PulseCheck, DraftBlob
- CheckinConfig: UserDefaults keys, default meds list
- CheckinStore: @Observable, load/save, draft autosave+stale-discard, same-day merge, pulse log, meds CRUD
- ContentView: quote banner + today status card + past days list
- CheckinFlowView: section-based morning/evening wizard with progress bar
- Sections: Sleep, MorningStart, MedCheckin, HealthLifestyle, EndOfDay
- EntryDetailView: read-only past entry display
- PulseCheckView: quick mood snapshot sheet
- MedsEditorView: add/remove medications sheet
- TodayStatusCard: morning/evening status badges + primary CTA
- 36 themed daily quotes (faith, ADHD, self-compassion, morning motivation, stoic)
- CheckinBlobTests: encode/decode, same-day merge, stale draft detection
- Xcode project file not yet created — needs manual Xcode setup
