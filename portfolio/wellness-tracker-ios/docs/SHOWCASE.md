# Wellness Tracker iOS

> Native SwiftUI companion to Wellness Tracker web — Phase 2 shell with Tasks, Time, Capture, and Sync tabs.

**Status:** Active
**Version:** Phase 2 shell
**Stack:** SwiftUI + @Observable + UserDefaults + optional Supabase
**Updated:** 2026-04-22

---

## Problem

The web PWA works on desktop but using it on iPhone means a browser tab — no home screen presence, no native feel, no haptics, no offline-first. Chase's wellness data deserves a native front door on iOS.

## Solution

A SwiftUI app with a proper tab bar and AppIcon that surfaces the same wellness data stack. Phase 2 establishes the shell and Supabase wiring; Phase 3 delivers full feature parity with the web app.

## Who it's for

Chase — on iPhone, when the web app isn't in reach.

---

## Key features (Phase 2 shell)

- **Tasks tab** — today's task list, local, instant load
- **Time tab** — basic focus timer that persists across launches
- **Capture tab** — quick note entry in one tap
- **Sync tab** — Supabase connection status display
- **W+sunrise AppIcon** — Clarity palette, native iOS feel

---

## Primary flow

1. Chase taps app icon on home screen
2. Tasks tab loads from UserDefaults — task list or empty state
3. Chase marks tasks complete; state saves immediately
4. Chase swipes to Time, starts a focus timer
5. Chase swipes to Capture, logs a quick note
6. App backgrounds; all state persists in UserDefaults
7. Next launch: everything is where Chase left it

---

## Screens

| Screen | Purpose | Empty state | Error state |
|--------|---------|-------------|-------------|
| Tasks | Today's task list | "No tasks yet" | Last saved state shown |
| Time | Basic focus timer | Timer 0:00 | Timer resets; count preserved |
| Capture | Quick note entry | Placeholder in field | Draft preserved in field |
| Sync | Supabase connection status | "Not connected" | "Connection error" + retry |

---

## Milestones

- [x] **M0 — Scaffold** — Xcode project, SwiftUI tab bar, AppIcon, builds on device
- [x] **M1 — Phase 2 shell** — Tasks, Time, Capture, Sync tabs; UserDefaults persistence; Supabase wiring (not enabled)
- [ ] **M2 — Tracker tab** — morning/evening check-in wizard (match web TrackerTab)
- [ ] **M3 — Full task CRUD** — categories, match web TasksTab
- [ ] **M4 — Time + Growth** — focus history, 7 growth areas + streaks
- [ ] **M5 — Supabase sync live** — read/write with `app_key = 'wellness'`

---

## Links

- **GitHub:** [apps](https://github.com/iamchasewhittaker/apps) (monorepo path: `portfolio/wellness-tracker-ios/`)
- **Linear:** —
- **Live:** local Xcode
- **Shipyard:** [/ship/wellness-tracker-ios](https://shipyard-sandy-seven.vercel.app/ship/wellness-tracker-ios)

---

## Why it exists

Chase's wellness data lives in a Supabase blob he owns. The web app is the full surface; the iOS app is the native front door. When Chase picks up his phone at 6am, he shouldn't need a browser.

*For Reese. For Buzz. Forward — no excuses.*
