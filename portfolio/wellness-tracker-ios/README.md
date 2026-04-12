# Wellness Tracker (iOS)

Native **SwiftUI** **Wellness Tracker**: morning/evening check-in and optional **Past days**. Data lives in **UserDefaults** on the device only — **no account, no OTP, no Supabase.**

## Product direction

- Build the iOS app as a **native-first phased replacement**, not an all-at-once parity rewrite.
- Keep web as the complete feature surface while iOS ships high-frequency workflows first.
- Defer advanced History analytics/export/AI parity until core daily usage is stable.

## Native V1 scope (done-for-now)

- Morning + evening check-in flow
- Same-day draft restore + stale draft guard
- Meds list editing
- Past days read-only list + detail

## Phase 2 foundation now in app

- Native tab shell: `Check-in`, `Tasks`, `Time`, `Capture`
- First daily parity slice: task capture/toggle, time session logging, quick win and pulse capture
- Insights parity (history analytics/export/AI) remains intentionally deferred

## Explicit non-goals for V1

- No auth/login
- No Supabase sync or cloud backup
- No full parity for Tasks/Time/Budget/Growth/History analytics

## Requirements

- Xcode 15+ (see project for deployment target)

## Open the project

```bash
open portfolio/wellness-tracker-ios/WellnessTracker.xcodeproj
```

**WellnessTracker** scheme → Run (⌘R). Tests: **WellnessTrackerTests** (⌘U).

## Docs

- **[CLAUDE.md](./CLAUDE.md)**
- **[CHANGELOG.md](./CHANGELOG.md)**
- **[ROADMAP.md](./ROADMAP.md)**

## Linear

[Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7)
