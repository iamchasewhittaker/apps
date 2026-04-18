# Changelog — Shipyard (iOS)

## [Unreleased]

### Changed
- App icon replaced: compass-rose → SY monogram (P6 style, nautical blue `#1e3a5f`, Arial Bold 560px, SHIPYARD sub-label 88px, 180px gap)

### Added
- Phase 1 scaffold: `Shipyard.xcodeproj` with `SY*` UUID prefix, SwiftUI shell, mock fleet
- `Ship` Codable model mirroring the web `Project` type
- `FleetStore` @Observable @MainActor with 6 hardcoded mock ships covering each status
- `FleetListView` grouped by bucket (Under Construction / Launched / Drydock / Archived)
- `ShipRowView` with name, nautical MVP-step label, days-since-commit chip
- `NauticalLabels` ported from web `src/lib/mvp-step.ts` (`STEP_NAUTICAL`)
- `Palette` with nautical tokens (navy, gold, sail-cream)
- AppIcon 1024 rendered from `design/app-icon.svg` (compass rose on navy)
- `docs/BRANDING.md` from portfolio template
- `ShipyardTests/FleetStoreTests.swift` — decode round-trip + group-by-status tests

## [0.1.0] — 2026-04-17

Initial scaffold.
