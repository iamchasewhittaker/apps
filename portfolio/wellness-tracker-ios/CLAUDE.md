# CLAUDE.md — Wellness Tracker (iOS)

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


Instructions for AI assistants and humans working in this directory.

## What this project is

**Native iOS:** **SwiftUI** Wellness Tracker companion to the web app ([`../wellness-tracker`](../wellness-tracker)).

- **Current V1 scope:** daily check-in (morning + evening), same-day draft restore, meds list editing, Past days read-only detail, Tasks / Time / Capture tabs.
- **Storage:** **UserDefaults** remains the source of truth on-device (`chase_wellness_ios_*`). **Optional Supabase** — same shared project as web (`unqtnnxlltiadzbqpyhh`): after sign-in, the app **pushes** `app_key` `wellness` (full blob) and `wellness-daily` (compact summary for [Clarity Command](../clarity-command)) and **pulls** `wellness` when remote `updated_at` is newer than local `_syncAt`.
- **Next phase focus:** deeper parity with web tabs where needed; optional ClarityUI SPM for shared chrome.

**Bundle ID:** `com.chasewhittaker.WellnessTracker`

**Branding:** Display name **Wellness Tracker**. App icon: unified **W + sunrise** on **Clarity family** `#0e1015` with blue horizon / amber sun (see YNAB Clarity `ClarityTheme.swift`); master `AppIcon.png` in `Assets.xcassets/AppIcon.appiconset/`. Specs: [../wellness-tracker/docs/BRANDING.md](../wellness-tracker/docs/BRANDING.md). Session notes: [HANDOFF.md](./HANDOFF.md).

## What This App Is

The native SwiftUI companion to Wellness Tracker — supports daily check-ins (morning and evening), medication tracking, tasks, time sessions, and a capture tab, with optional Supabase sync to the same shared project as the web app. Designed for on-device-first usage with UserDefaults as the source of truth and cloud sync as a convenience layer.

**Storage (UserDefaults):**

- `chase_wellness_ios_v1` — main blob
- `chase_wellness_ios_draft_v1` — same-day draft (stale day discarded)
- `chase_wellness_ios_meds_v1` — meds list

## Implementation notes

- **Root state:** `WellnessStore` injected via `environmentObject` from `WellnessTrackerApp`.
- **Blob:** `WellnessBlob.swift` — `normalizeBlob`, `saveEntry` (same-day morning/evening merge).
- **Cloud sync:** `WellnessCloudSync.swift` — Supabase Swift client; **Sync** tab for email OTP sign-in. Keys in `WellnessSupabaseConfig.swift` (shared anon key + URL; same as portfolio web apps).
- **UI shell:** `ContentView.swift` uses tab navigation for `Check-in`, `Tasks`, `Time`, `Capture`, and `Sync`.
- **UI modules:** `Features/Checkin/`, `Features/PastDays/`, `Features/Tasks/`, `Features/Time/`, `Features/Capture/`, `Features/Sync/`, `Theme/WellnessTheme.swift`.

## Pre-build prerequisite (2017 MBP · Ventura · Xcode 15.2)

Mount the iOS 17.2 runtime DMG once per session before any `xcodebuild` call — see root `CLAUDE.md § iOS Build Prerequisite` for the full command.

## When editing

- Small, focused changes; update **CHANGELOG.md** under `## [Unreleased]` for user-visible work.
- Match existing Swift style.

## Scope guardrails

- **Do not** chase full web parity in one pass.
- **Do not** start History analytics/export/AI parity until daily workflows are stable in native.

## Current decision

- **Decision:** **Companion + cloud** — sign-in is optional; local data always works offline. When signed in, sync matches web `user_data` rows so **Clarity Command** can read `wellness-daily`.

## References

- Portfolio master: [`/CLAUDE.md`](../../CLAUDE.md)

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
