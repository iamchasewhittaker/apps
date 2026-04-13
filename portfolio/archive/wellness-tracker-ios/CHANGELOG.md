# Changelog — Wellness Tracker (iOS)

## [Unreleased]

- **App icon:** fixed **1024×1024** square requirement (was 1376×768; Xcode “no applicable content”); `Contents.json` now includes `universal` + `ios-marketing` slots. Web `public/logo-*.png` re-synced from corrected master.
- **App icon:** `AppIcon.appiconset/AppIcon.png` — **W + sunrise** on Clarity-family `#0e1015` (see web `docs/BRANDING.md`). Added [HANDOFF.md](./HANDOFF.md) for iOS session notes.
- **Phase 2 foundation:** replaced single-screen root with native `TabView` shell (`Check-in`, `Tasks`, `Time`, `Capture`) so daily workflows can expand incrementally from a stable app structure.
- **First parity slice shipped:** added native `Tasks`, `Time`, and quick `Win`/`Pulse` capture tabs backed by `WellnessStore` mutations and existing blob persistence.
- **Store hardening:** `WellnessStore` now supports test-safe `UserDefaults` injection, bounded section navigation helpers, and reusable blob mutation utilities for new tabs.
- **Test coverage:** expanded `WellnessBlobTests` to cover draft restore, stale-draft discard, and section navigation/draft-save behavior.
- **QA:** verified simulator build with `xcodebuild build-for-testing ... CODE_SIGNING_ALLOWED=NO` (full `xcodebuild test` still depends on local simulator/signing conditions).
- **Local-only:** removed Supabase sync, email OTP, Keychain session, and login UI. App opens straight to check-in; data persists via `chase_wellness_ios_*` UserDefaults keys only.
- Initial Phase 1 (prior): SwiftUI check-in sections, draft + meds, optional Past days; prior sunrise-style icon in `AppIcon.appiconset`.
