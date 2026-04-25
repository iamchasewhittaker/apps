# Shipyard (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) and `portfolio/shipyard/CLAUDE.md` (web source of truth).

## App Identity

- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.Shipyard`
- **Storage key:** `chase_shipyard_ios_v1` (UserDefaults cache of last fleet fetch)
- **Stack:** SwiftUI + iOS 17 + `@Observable` + `supabase-swift` v2 (Phase 2)
- **Supabase project:** shared portfolio project `unqtnnxlltiadzbqpyhh` (same as wellness-tracker-ios, web apps)
- **Xcode project prefix:** `SY` (UUIDs, build refs)
- **Xcode project:** `Shipyard.xcodeproj` (hand-crafted `project.pbxproj` — no xcodegen)
- **Per-app handoff:** [HANDOFF.md](HANDOFF.md)
- **Branding:** [docs/BRANDING.md](docs/BRANDING.md)

## What This App Is

Native iOS companion to [Shipyard web](../shipyard) — a fleet command center for Chase's portfolio. Phase 2 pulls the real fleet from the shared Supabase `projects` table (kept fresh by the web app's nightly `scan-cron.sh`). Offline fallback: UserDefaults cache → mock fleet.

The web app at `portfolio/shipyard/` is the source of truth — iOS is read-only and never writes to Supabase.

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
    FleetStore.swift       ← @Observable @MainActor; real Supabase fetch + auth listener + cache fallback
    SupabaseService.swift  ← shared SupabaseClient singleton
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
- `SupabaseService.client` — shared singleton using `Config.supabaseURL` + `Config.supabaseAnonKey`
- Auth: email + password via `auth.signIn(email:password:)`; session restored on launch via `bootstrapSession()`; `authStateChanges` listener keeps `isSignedIn` live
- Fleet load chain: Supabase → UserDefaults cache (`chase_shipyard_ios_v1`) → hardcoded mock

## Phase 2.5+ (future)

- Magic-link auth (deep-link scheme `shipyard://auth/confirm`, `.onOpenURL`, `exchangeCodeForSession`, Supabase email template)
- WIP-of-1 gate (read-only mirror of web)
- Widgets (small: active ship; medium: fleet stats)
- Live Activity for "Under Construction" ship

## Build Commands

> **Pre-build (2017 MBP · Ventura · Xcode 15.2):** Mount the iOS 17.2 runtime DMG once per session before any `xcodebuild` call — see root `CLAUDE.md § iOS Build Prerequisite`.

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
