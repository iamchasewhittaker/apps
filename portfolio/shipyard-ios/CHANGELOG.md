# Changelog — Shipyard (iOS)

## [Unreleased]

### Changed (2026-04-20 — nautical rebrand)
- **Palette.swift** rewritten with 8 canonical tokens: bg `#07101E`, surface `#0C1A34`, white `#F2EEE6`, steel `#4A90DE`, gold `#D7AA3A`, dim `#346090`, dimmer `#141A4C`, ghost `#0D1A34`.
- **Font+Shipyard.swift** (new) — `.shipyardDisplay()`, `.shipyardMono()`, `.shipyardBody(bold:)` helpers. Backed by BigShouldersDisplay-Bold, DMMono-Regular, InstrumentSans-Regular/Bold TTFs.
- **4 custom fonts** added to `Shipyard/Resources/Fonts/` and registered via `INFOPLIST_KEY_UIAppFonts` in pbxproj.
- **HelmMark.swift** (new) — reusable SwiftUI view drawing 8-spoke ship's helm with cream handles + steel dots; scales via GeometryReader.
- **LaunchScreenView.swift** (new) — full-bleed navy splash with HelmMark + BigShoulders "SHIPYARD" + 2px gold rule + DM Mono "FLEET COMMAND".
- **OnboardingView.swift** (new) — 3-page paged TabView; tap-to-advance; final tap sets `@AppStorage("hasOnboarded") = true`.
- **ShipyardApp.swift** — launch gate: onboarding → 0.9s splash → ContentView. Tint changed from `.gold` to `.steel`.
- **SignInView, FleetListView, ShipRowView, ShipDetailView** — all restyled with new tokens and shipyard font extensions.
- **AccentColor.colorset** updated to steel `#4A90DE` (sRGB decimal).
- **AppIcon** regenerated from helm SVG (13 sizes + Contents.json via `design/generate-app-icons.sh`).
- Onboarding + launch assets added to `Assets.xcassets` (Onboarding1/2/3.imageset, LaunchBackground.imageset).
- Design assets staged in `design/ios/`, `design/theme/shipyard-theme.md`, `design/DESIGN-HANDOFF.md`.

### Fixed (2026-04-20 — on-device bugs)
- **`.initialSession` false-positive** — listener called `handleSignedIn()` for nil sessions, setting `isSignedIn = true` before user signed in and loading mock data instead of the sign-in screen
- **Sign-out not sticking** — `signOut()` now calls `handleSignedOut()` directly after `auth.signOut()` so state resets even if the network call fails or listener fires late

### Added (2026-04-20)
- Error banner in `FleetListView` surfacing `store.errorMessage` for Supabase decode/network failures

### Added
- **Phase 2: Supabase integration** — real `projects` fetch replaces hardcoded mock fleet
- `supabase-swift` SPM dependency (v2.30.0, up-to-next-major from 2.0.0)
- `SupabaseService` singleton holding the shared `SupabaseClient`
- Email + password sign-in (matches current web auth flow)
- Session bootstrap on launch + `authStateChanges` listener for live sign-in/out
- Sign-out menu in `FleetListView` toolbar (ellipsis.circle → Reload / Sign out)
- `FleetStore.loadMockFleet()` test helper (fixes previously-broken tests)
- Cache now uses ISO 8601 date encoding to match Supabase decode

### Changed
- `SignInView` rewired from stubbed magic-link UI → real email + password via `auth.signIn(email:password:)`
- `FleetStore.signIn()` → `signIn(email:password:) throws`; `signOut()` is now async
- `Config.swift` anon key hardcoded (matches wellness-tracker-ios pattern — public `NEXT_PUBLIC_*` key, RLS protects data)
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
