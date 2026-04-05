# Changelog — Wellness Tracker (iOS)

## [Unreleased]

- **Local-only:** removed Supabase sync, email OTP, Keychain session, and login UI. App opens straight to check-in; data persists via `chase_wellness_ios_*` UserDefaults keys only.
- Initial Phase 1 (prior): SwiftUI check-in sections, draft + meds, optional Past days; sunrise app icon in `AppIcon.appiconset`.
