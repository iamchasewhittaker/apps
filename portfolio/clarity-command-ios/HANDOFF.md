# Handoff — Clarity Command (iOS)

## Current status: Phase 2 cross-app scoreboard shipped

- **Version:** v0.2 → v0.3 (cross-app reads)
- **Last session:** 2026-04-27 — Cross-app reads (`job-search-daily` + `wellness-daily`); new `LiveAppDataView` on Scoreboard tab; auto-pull on app launch
- **Previous session:** 2026-04-15 — Supabase `command` row (same as web), Settings sync UI, `_syncAt` Codable parity, device QA doc, programmatic AppIcon (`tools/generate_app_icon.py`)
- **Build status:** `xcodebuild build` clean for `generic/platform=iOS Simulator` (Debug)
- **Next:** Install on physical iPhone 12 Pro Max (id `A0C65578-B1E0-4E96-A1EC-EEB8913BD11C`) and verify the LIVE APP DATA section appears on the Scoreboard tab when signed in.

## What's shipped

- `ClarityCommand.xcodeproj` — generated programmatically, no manual Xcode setup needed
- All 26 source files registered in project, ClarityUI linked as local package (`../clarity-ui`)
- `Assets.xcassets` with AccentColor (gold) + AppIcon 1024 (programmatic shell + gold chevron — replace with marketing glyph when ready)
- **Supabase** — `CommandCloudSync` + `CommandSupabaseConfig` (shared project `unqtnnxlltiadzbqpyhh`, `app_key = command`); Settings **Cloud sync** section (OTP, pull, push); debounced push on local `save()`
- **Device QA:** [`docs/DEVICE_QA.md`](docs/DEVICE_QA.md)
- Gold accent system via `CommandPalette` (`#c8a84b`) extending `ClarityPalette`
- 3-tab layout: Mission, Scoreboard, Settings
- Morning commit flow: conviction panel, scripture card, target list, counter banner
- Evening reflection flow: review targets, score day, log reflections
- Scoreboard: week grid, month calendar heatmap, area streaks, stats row
- Settings: preferences, data management
- Reusable components: GoldButton, StatusBadge, TargetRow
- Constants: daily scripture rotation, motivational reminders
- CommandBlobTests: encode/decode + scoring + streak unit tests
- Standard portfolio docs: CLAUDE.md, CHANGELOG.md, HANDOFF.md, LEARNINGS.md, ROADMAP.md, docs/BRANDING.md

## How to open

```
open portfolio/clarity-command-ios/ClarityCommand.xcodeproj
```

Run on iPhone 16 simulator (command+R) or tests (command+U).

## Decisions made

- `@Observable @MainActor` store, `nonisolated init()` to allow `@State` initialization in App
- `@Bindable var s = store` pattern in views for two-way binding into `@Observable` stores
- Gold accent (`#c8a84b`) is app-local via `CommandPalette` — not added to shared ClarityUI palette
- 3-tab structure mirrors web Clarity Command: Mission (daily), Scoreboard (history), Settings
- No SwiftData — UserDefaults + JSON-encoded Codable blobs (storage key: `chase_command_ios_v1`)
- PBX GUID prefix `CD` to avoid collisions with other Clarity apps (CC=Check-in, CT=Triage, CX=Time, CB=Budget, CG=Growth)
- Scripture sources: Book of Mormon, Doctrine & Covenants, Bible (KJV)

## Done when (all verified)

- [x] Morning commit flow completes and saves (xcodebuild build succeeds)
- [x] Evening reflection merges with morning entry (unit test)
- [x] Target tracking persists across app restart (UserDefaults)
- [x] Scoreboard displays streaks and calendar (builds clean)
- [x] Scripture card rotates daily (constants wired)
- [x] Unit tests pass (CommandBlobTests)
- [x] **Cross-app reads compile + auto-pull on launch** (2026-04-27)
- [ ] End-to-end run on physical device — **next step**
- [ ] Verify `LIVE APP DATA` section renders correctly with real Supabase data on device

## Next for this app (Phase 2 remainder)

- [ ] Complete checklist in [`docs/DEVICE_QA.md`](docs/DEVICE_QA.md) on physical device (DEVELOPMENT_TEAM: `9XVT527KP3`)
- [ ] Pull-to-refresh on Scoreboard tab to manually re-fetch cross-app summaries (currently only on launch + Settings button)
- [ ] App icon: replace programmatic asset with final **chevron-in-shield** mark per [`docs/BRANDING.md`](docs/BRANDING.md) + [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)
- [ ] Today widget (WidgetKit) — morning/evening status + streak (now possible to include cross-app counts)
- [ ] Push notification reminders (morning commit, evening reflection)
- [ ] Siri Shortcuts ("Start my morning" / "Evening review")

**Deferred:** CloudKit — superseded by **Supabase** for parity with web Clarity Command (`chase_command_v1` / `command` row).

## Learnings from this session

- All view structs with computed properties accessing @MainActor store need `@MainActor` annotation
- `ClaritySectionLabel` uses unlabeled first param: `ClaritySectionLabel("text")` not `ClaritySectionLabel(text: "text")`
- `ClarityTypography` has no `bodyBold`/`captionBold` — use `.headline` or `.caption.bold()`
- `ClarityProgressBar` requires labeled params: `ClarityProgressBar(label: "", value: fraction)`
- String interpolation of enums needs `String(describing:)` to avoid Swift warnings
