# CLAUDE.md — Wellness Tracker (iOS)

Instructions for AI assistants and humans working in this directory.

## What this project is

**Native iOS:** **SwiftUI** daily check-in (morning + evening). **Local-only** — no Supabase, no sign-in, no cloud sync. Optional **Past days** (read-only).

**Bundle ID:** `com.chasewhittaker.WellnessTracker`

**Branding:** Display name **Wellness Tracker**. App icon: sunrise / horizon in `Assets.xcassets/AppIcon.appiconset/`.

**Storage (UserDefaults):**

- `chase_wellness_ios_v1` — main blob
- `chase_wellness_ios_draft_v1` — same-day draft (stale day discarded)
- `chase_wellness_ios_meds_v1` — meds list

## Implementation notes

- **Root state:** `WellnessStore` injected via `environmentObject` from `WellnessTrackerApp`.
- **Blob:** `WellnessBlob.swift` — `normalizeBlob`, `saveEntry` (same-day morning/evening merge).
- **UI:** `Features/Checkin/`, `Features/PastDays/`, `Theme/WellnessTheme.swift`.

## When editing

- Small, focused changes; update **CHANGELOG.md** under `## [Unreleased]` for user-visible work.
- Match existing Swift style.

## References

- Portfolio master: [`/CLAUDE.md`](../../CLAUDE.md)

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
