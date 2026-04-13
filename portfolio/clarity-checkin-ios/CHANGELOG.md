# Changelog — Clarity Check-in (iOS)

## [Unreleased]

- **Branding:** `docs/BRANDING.md` (filled from [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../../docs/templates/PORTFOLIO_APP_BRANDING.md)); `CLAUDE.md` links there instead of duplicating icon rules
- **App icon:** `AppIcon.appiconset/AppIcon.png` (1024×1024) + `Contents.json` filename; wide mockup under `docs/design/`
- **Docs:** portfolio-wide icon system at monorepo `docs/design/CLARITY_IOS_APP_ICON_SPEC.md`; design index `docs/design/README.md`; session templates + `new-app-guide` + iOS starter kit + root `CLAUDE` + `GLOSSARY` point at the branding template

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
- `ClarityCheckin.xcodeproj` generated programmatically + shared scheme (see repo)
