# Product Brief — Wellness Tracker iOS

**App summary.** Native SwiftUI companion to the Wellness Tracker web app — a Phase 2 shell with Tasks, Time, Capture, and Sync tabs that shares the same Supabase data stack.

**Target user.** Chase — on iPhone, where the web PWA is inconvenient and a native tab bar with haptics and SwiftUI feels right.

**Main pain.** The web app works on desktop but accessing it on iPhone means a browser PWA with no native feel, no home screen presence, and no offline-first behavior.

**Core value.** A native iOS shell that surfaces the same `chase_wellness_v1` data with a proper SwiftUI tab bar, AppIcon, and optional Supabase sync — so Chase's wellness data is always one tap away on any device.

**V1 scope (Phase 2 shell — current):**
- Tasks tab: today's task list (read from local state)
- Time tab: basic focus timer
- Capture tab: quick note/capture entry
- Sync tab: Supabase connection status display
- W+sunrise AppIcon, Clarity palette, UserDefaults local storage
- Supabase wiring in place — not yet enabled for read/write (Phase 3)
