# Handoff — Keep (iOS)

## Session info
- **Date:** 2026-04-29
- **Session #:** 1
- **Working on version:** v0.1

## What shipped this session
- **Phase 1 fully built** — all 15 Swift source files written; `xcodebuild build` → BUILD SUCCEEDED
- Product docs complete: `PRODUCT_BRIEF.md`, `PRD.md`, `APP_FLOW.md`
- App name locked: **Keep** ("Do I keep this?" + "The Keep" as fortress)
- Core triage loop: Keep / Donate / Toss / Unsure → one item at a time
- SpotPickerSheet after Keep (if spots exist for the room)
- CoachSheet: 3 yes/no questions triggered after 3+ consecutive Unsure decisions
- PhotoStore: file-based JPEG storage (not in UserDefaults blob)
- Warm amber theme: `#d4a055` accent, `#0f0e0d` background, dark-mode only
- 7 KeepBlobTests: backward-compat decode + roundtrip + computed helpers

## State table

| Key | Value |
|-----|-------|
| **Focus** | Phase 1 built — open in Xcode and test on device |
| **Next** | Open `Keep.xcodeproj` in Xcode, ⌘U to run tests, then install on iPhone |
| **Last touch** | 2026-04-29 — full Phase 1 build |
| **Build status** | `xcodebuild build` → BUILD SUCCEEDED |
| **Tests** | 7 tests written; verify with ⌘U in Xcode |
| **Simulator** | CLI simulator boot fails on this 2017 MBP (known constraint) |
| **On device** | Not yet installed — do via Xcode → Run (⌘R) |

## What's broken or half-done
- Tests not verified via CLI (simulator boot fails on this machine — normal)
- Not installed on device yet
- No AppIcon yet (intentionally deferred)
- No BRANDING.md yet

## Decisions made
- **No SwiftData** — switched to `@Observable` + Codable + UserDefaults (portfolio-consistent)
- **PhotoStore** — photos to filesystem, only UUID reference in blob (avoids UserDefaults size limits)
- **`@MainActor` on `KeepApp`** — required because `KeepStore.init()` is @MainActor-isolated
- **Coach threshold** — 3 consecutive Unsure decisions (not cumulative) triggers the coach

## Next session — start here
**Next action:** Open `Keep.xcodeproj` in Xcode, run ⌘U to verify all 7 tests pass, then ⌘R to install on iPhone. Walk through the full triage loop: create room → add items → triage → view stats.

If continuing to add features, check `ROADMAP.md` for Phase 2 candidates.

## Notes for future Claude
- Stack: SwiftUI + `@Observable @MainActor` + Codable + UserDefaults — **NOT SwiftData**
- Storage key: `chase_keep_ios_v1`
- Photos: `Documents/keep-photos/<uuid>.jpg` — never store image Data in UserDefaults
- All new Codable fields must use `decodeIfPresent` in the `extension` custom decoder
- Xcode project prefix: `KP*` (UUIDs in `project.pbxproj`)
- iOS Build Prerequisite: mount iOS 17.2 DMG before any `xcodebuild` call (see root CLAUDE.md)
- Machine: 2017 MBP · macOS Ventura · Xcode 15.2 — CLI simulator tests unreliable; use Xcode ⌘U

---

### Quick-start prompt for next session
> I'm continuing work on the Keep iOS app. It lives at `portfolio/keep-ios/` in my apps monorepo (`~/Developer/chase`). Read `CLAUDE.md`, `ROADMAP.md`, and `HANDOFF.md` in that folder first. Phase 1 is fully built (BUILD SUCCEEDED). Next: run tests in Xcode and install on device.
