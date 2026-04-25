# Unnamed (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) and `portfolio/unnamed/CLAUDE.md` (web reference).

## App Identity

- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.Unnamed`
- **Storage key:** `unnamed_ios_v1`
- **Stack:** SwiftUI + iOS 17 + `@Observable` + `UserDefaults` + Codable — no SwiftData, no external deps
- **Xcode project prefix:** `UN` (UUIDs, build refs)
- **Xcode project:** `Unnamed.xcodeproj` (hand-crafted `project.pbxproj` — no xcodegen)
- **Per-app handoff:** [HANDOFF.md](HANDOFF.md)

## What This App Is

Native iOS version of the Unnamed daily OS web app. Mirrors the web flows exactly. No new features.

The web app at `portfolio/unnamed/` is the source of truth — do not add anything the web app doesn't have, except iOS-native affordances (haptics, swipe gestures).

**Anti-features are the product. "Containment is the feature."**

## File Structure

```
Unnamed.xcodeproj/
  project.pbxproj      ← hand-crafted, UN* UUID prefix
  project.xcworkspace/

Unnamed/
  UnnamedApp.swift     ← @main, store init, .environment(), .preferredColorScheme(.dark)
  Models/
    AppState.swift     ← Lane, ItemStatus, Item, DailyLock, DailyCheck, AppState (all Codable)
  Services/
    AppStore.swift     ← @Observable @MainActor store — load/save/all mutations
    DateHelpers.swift  ← DateHelpers.todayString ("YYYY-MM-DD"), isToday()
    StorageHelpers.swift ← thin UserDefaults wrapper (load/save generic Codable)
  Constants/
    Lanes.swift        ← Lane extensions: label, laneDescription, color, summary, examples[], rule; Lane: Identifiable; Color(hex:)
  Views/
    ContentView.swift  ← TabView with 4 tabs + badges
    Capture/
      CaptureView.swift      ← InboxRowView (view/edit/confirmDelete modes) + CaptureView
    Sort/
      SortView.swift         ← LaneHelpSheet (bottom sheet) + SortView with ⓘ button per lane
    Today/
      TodayView.swift        ← switches LanePickerView ↔ FocusView
      LanePickerView.swift   ← pick 2 lanes + lock (irreversible)
      FocusView.swift        ← one item at a time, Done/Skip
    Check/
      CheckView.swift        ← switches CheckFormView ↔ CheckDoneView
      CheckFormView.swift    ← LockedLanesHeader + reworded Q1/Q2 with helper text
      CheckDoneView.swift    ← LockedLanesHeader + updated result labels
      LockedLanesHeader.swift ← shared: today's locked lanes as colored chips

UnnamedTests/
  AppStateTests.swift  ← 10 tests: encode/decode, lock, check, date format
```

## Architecture

- `@Observable @MainActor AppStore` — single store, injected via `.environment(store)`
- `nonisolated init()` — zero-cost, allows `@State private var store = AppStore()` in App
- `@Environment(AppStore.self)` in all views
- Private mutation methods that call `@MainActor` store methods must be marked `@MainActor`
- All data is `Codable` structs — never `[String: Any]`
- Single JSON blob at `UserDefaults` key `unnamed_ios_v1`

## Key Behaviors (never break these)

- `DailyLock` is irreversible — `lockLanes()` has a `guard !isLockedToday` check
- `today()` uses `YYYY-MM-DD` in local time — `DateHelpers.todayString`
- Capture: items are editable and deletable via visible 44pt pencil/trash buttons — no hidden gestures
- Sort: one inbox item at a time (skip cycles to end via array remove+append); ⓘ button opens help sheet without assigning
- Focus: one active item at a time — done/skip cycles same way
- Check: once per day — `guard !hasCheckedToday`; shows locked lanes as chips above questions
- Haptics: `.medium` on lane lock, `.light` on Done

## Anti-Features (never add these)

- No additional lanes (4 is permanent max)
- No due dates or priorities
- No tags or labels
- No settings or customization
- No streaks or gamification
- No notifications (v1)
- No social or export features
- No Supabase (v1 — UserDefaults only)

## Build Commands

> **Pre-build (2017 MBP · Ventura · Xcode 15.2):** Mount the iOS 17.2 runtime DMG once per session before any `xcodebuild` call — see root `CLAUDE.md § iOS Build Prerequisite`.

```bash
# Build for simulator (no signing needed)
xcodebuild build \
  -project Unnamed.xcodeproj \
  -scheme Unnamed \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO

# Run tests
xcodebuild test \
  -project Unnamed.xcodeproj \
  -scheme UnnamedTests \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGNING_ALLOWED=NO

# Build for device (bypasses destination resolver — required on this machine for iOS 26.x device)
xcodebuild -target Unnamed -configuration Debug -sdk iphoneos17.2 \
  -allowProvisioningUpdates build \
  2>&1 | tee /tmp/unnamed-build.log

xcrun devicectl device install app \
  --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C \
  build/Debug-iphoneos/Unnamed.app

xcrun devicectl device process launch \
  --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C \
  com.chasewhittaker.Unnamed
```

## Phase 1 Rule

No new features until Chase has used the app for 7 consecutive days. If Chase asks to add a feature, ask: "Have you used it for 7 days first?"

## References

- Web source of truth: `portfolio/unnamed/`
- Session starter: `portfolio/unnamed/HANDOFF_IOS.md`
- Store pattern reference: `portfolio/clarity-checkin-ios/ClarityCheckin/Services/CheckinStore.swift`
- Portfolio conventions: `/CLAUDE.md`
