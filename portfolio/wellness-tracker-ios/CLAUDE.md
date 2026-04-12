# CLAUDE.md — Wellness Tracker (iOS)

Instructions for AI assistants and humans working in this directory.

## What this project is

**Native iOS:** **SwiftUI** Wellness Tracker companion that is moving toward phased replacement of the web app.

- **Current V1 scope (done-for-now target):** daily check-in (morning + evening), same-day draft restore, meds list editing, and Past days read-only detail.
- **Current storage mode:** **local-only** (`UserDefaults`) — no Supabase, no sign-in, no cloud sync.
- **Next phase focus:** native tab shell + daily-use modules (Tasks, Time, quick Win/Pulse capture) before analytics parity.

**Bundle ID:** `com.chasewhittaker.WellnessTracker`

**Branding:** Display name **Wellness Tracker**. App icon: sunrise / horizon in `Assets.xcassets/AppIcon.appiconset/`.

**Storage (UserDefaults):**

- `chase_wellness_ios_v1` — main blob
- `chase_wellness_ios_draft_v1` — same-day draft (stale day discarded)
- `chase_wellness_ios_meds_v1` — meds list

## Implementation notes

- **Root state:** `WellnessStore` injected via `environmentObject` from `WellnessTrackerApp`.
- **Blob:** `WellnessBlob.swift` — `normalizeBlob`, `saveEntry` (same-day morning/evening merge).
- **UI shell:** `ContentView.swift` uses tab navigation for `Check-in`, `Tasks`, `Time`, and `Capture`.
- **UI modules:** `Features/Checkin/`, `Features/PastDays/`, `Features/Tasks/`, `Features/Time/`, `Features/Capture/`, `Theme/WellnessTheme.swift`.

## When editing

- Small, focused changes; update **CHANGELOG.md** under `## [Unreleased]` for user-visible work.
- Match existing Swift style.

## Scope guardrails

- **Do not** chase full web parity in one pass.
- **Do not** start History analytics/export/AI parity until daily workflows are stable in native.
- **Do not** implement auth/sync until replacement-vs-companion decision is made explicitly in `ROADMAP.md`.

## Current decision

- **Decision:** iOS is a **companion-first build now**, with a potential move to full replacement later.
- **Implication:** remain local-only in near term; reassess cloud auth/sync only after daily workflow parity is personally stable for at least two weeks.

## References

- Portfolio master: [`/CLAUDE.md`](../../CLAUDE.md)

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
