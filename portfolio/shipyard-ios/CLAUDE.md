# Shipyard (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) and `portfolio/shipyard/CLAUDE.md` (web source of truth).

## App Identity

- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.Shipyard`
- **Storage key (when added):** `chase_shipyard_ios_v1`
- **Stack:** SwiftUI + iOS 17 + `@Observable` — no external deps, no backend (Phase 1)
- **Xcode project prefix:** `SY` (UUIDs, build refs)
- **Xcode project:** `Shipyard.xcodeproj` (hand-crafted `project.pbxproj` — no xcodegen)
- **Per-app handoff:** [HANDOFF.md](HANDOFF.md)
- **Branding:** [docs/BRANDING.md](docs/BRANDING.md)

## What This App Is

Native iOS companion to [Shipyard web](../shipyard) — a fleet command center for Chase's portfolio. Phase 1 renders a read-only fleet list from hardcoded mock data so the scaffold works offline. Phase 2 will pull live from Supabase (after the web app's RLS + auth gate lands).

The web app at `portfolio/shipyard/` is the source of truth — do not add features the web app doesn't have.

## File Structure

```
Shipyard.xcodeproj/
  project.pbxproj      ← hand-crafted, SY* UUID prefix
  project.xcworkspace/

Shipyard/
  ShipyardApp.swift    ← @main, store init, .environment(), .preferredColorScheme(.dark)
  Models/
    Ship.swift         ← Codable struct mirroring web `Project` type
  Services/
    FleetStore.swift   ← @Observable @MainActor; loads mock fleet in Phase 1
  Constants/
    NauticalLabels.swift ← STEP_NAUTICAL labels ported from web mvp-step.ts
    Palette.swift      ← nautical color tokens (navy, gold, sail-cream)
  Views/
    ContentView.swift  ← NavigationStack shell
    Fleet/
      FleetListView.swift  ← grouped list by status
      ShipRowView.swift    ← row: name · nautical MVP label · days-since-commit chip
  Assets.xcassets/
    AppIcon.appiconset/
    AccentColor.colorset/

ShipyardTests/
  FleetStoreTests.swift
```

## Architecture

- `@Observable @MainActor FleetStore` — single store, injected via `.environment(store)`
- `nonisolated init()` — allows `@State private var store = FleetStore()` in `@main`
- `@Environment(FleetStore.self)` in all views
- All data is `Codable` structs — never `[String: Any]`
- Phase 1: mock fleet baked in. Phase 2: Supabase SDK + session-aware pull.

## Phase 2+ (not in this session)

- Supabase read: pull `projects` rows from shared project `unqtnnxlltiadzbqpyhh`
- Auth: magic-link/OTP gate matching the web app
- Ship detail screen (read-only)
- WIP-of-1 gate (read-only mirror)
- Pull-to-refresh, widget, Live Activity

## Build Commands

```bash
# Build for simulator (no signing needed)
xcodebuild build \
  -project Shipyard.xcodeproj \
  -scheme Shipyard \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO

# Run tests
xcodebuild test \
  -project Shipyard.xcodeproj \
  -scheme ShipyardTests \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO
```

## References

- Web source of truth: `portfolio/shipyard/`
- Types ported from: `portfolio/shipyard/src/lib/types.ts`, `portfolio/shipyard/src/lib/mvp-step.ts`
- Store pattern reference: `portfolio/unnamed-ios/Unnamed/Services/AppStore.swift`
- pbxproj scaffold reference: `portfolio/unnamed-ios/Unnamed.xcodeproj/project.pbxproj`
- Portfolio conventions: `/CLAUDE.md`
