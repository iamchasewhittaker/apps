# Wellness Tracker (iOS)

Native **SwiftUI** **Wellness Tracker**: morning/evening check-in, **Past days**, and Phase 2 tabs (**Tasks**, **Time**, **Capture**). Data lives in **UserDefaults** first; **optional Supabase** (same portfolio project as web) via the **Sync** tab — email OTP, pull/push `wellness` blob, push `wellness-daily` for **Clarity Command**.

**App icon:** W + sunrise on **Clarity family** `#0e1015` (see [BRANDING.md](../wellness-tracker/docs/BRANDING.md)). Session: [HANDOFF.md](./HANDOFF.md).

## Product direction

- Build the iOS app as a **native-first phased companion** to the web app.
- Keep web as the complete feature surface while iOS ships high-frequency workflows first.
- Defer advanced History analytics/export/AI parity until core daily usage is stable.

## Native V1 scope (done-for-now)

- Morning + evening check-in flow
- Same-day draft restore + stale draft guard
- Meds list editing
- Past days read-only list + detail

## Phase 2 foundation now in app

- Native tab shell: `Check-in`, `Tasks`, `Time`, `Capture`, `Sync`
- First daily parity slice: task capture/toggle, time session logging, quick win and pulse capture
- Optional cloud: Supabase Swift + PostgREST upserts for `wellness` and `wellness-daily`
- Insights parity (history analytics/export/AI) remains intentionally deferred

## Requirements

- Xcode 15+ (iOS 17 deployment target)

## Open the project

```bash
open portfolio/wellness-tracker-ios/WellnessTracker.xcodeproj
```

**WellnessTracker** scheme → Run (⌘R). Tests: **WellnessTrackerTests** (⌘U).

## Docs

- [CLAUDE.md](./CLAUDE.md) — architecture, storage keys, sync
- [ROADMAP.md](./ROADMAP.md)

Paused 2026-04-15 — focusing on clarity-command per WIP limit.
