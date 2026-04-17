# iOS Handoff — Unnamed (daily OS)

> This document hands off the "Unnamed" web app to a new session for building the native iOS version.
> **Paste this entire file into the new chat as the session starter.**

---

## What this app is

A radically simple daily operating system for ADHD brains. **Not a task manager.** It narrows your day to what matters, shows you one thing at a time, and refuses to let you optimize it.

Built for Chase. The anti-features ARE the product. **"Containment is the feature."**

The web version (`portfolio/unnamed/`) is the reference implementation. Do not add features that aren't in the web version unless they're iOS-native affordances (haptics, swipe gestures).

---

## App name

**"Unnamed"** — a deliberate placeholder. The permanent name is TBD. Use `Unnamed` everywhere for now.

- Bundle ID: `com.chasewhittaker.Unnamed`
- Storage key: `unnamed_ios_v1`
- Xcode project prefix: `UN` (files: `UNStore.swift`, `UNModels.swift`, etc.)

---

## The 4 lanes (fixed forever — never change these)

| Lane | Color token | Description |
|------|-------------|-------------|
| `regulation` | Sky blue | Sleep, food, water, meds, walks, rest |
| `maintenance` | Emerald | Dishes, laundry, cleaning, errands |
| `support` | Violet | Kids, wife, church, family |
| `future` | Amber | Job search, GMAT, building, planning |

**Daily rule:** Chase picks exactly 2 lanes each morning. The other 2 disappear until tomorrow. One item at a time within active lanes. Lane lock is **irreversible** until midnight.

---

## Data model

Translate the web TypeScript types directly to Swift Codable structs:

```swift
enum Lane: String, Codable, CaseIterable {
    case regulation, maintenance, support, future, inbox
}

struct Item: Codable, Identifiable {
    var id: UUID
    var text: String
    var lane: Lane          // starts as .inbox
    var status: ItemStatus  // active | done | skipped
    var createdAt: Date
    var completedAt: Date?
}

enum ItemStatus: String, Codable {
    case active, done, skipped
}

struct DailyLock: Codable {
    var date: String        // "YYYY-MM-DD"
    var lane1: Lane
    var lane2: Lane
}

struct DailyCheck: Codable {
    var date: String        // "YYYY-MM-DD"
    var produced: Bool
    var stayedInLanes: Bool
}

struct AppState: Codable {
    var items: [Item]
    var locks: [DailyLock]
    var checks: [DailyCheck]
}
```

All state lives in one `AppState` blob persisted to `UserDefaults` under key `unnamed_ios_v1`. No SwiftData. No external dependencies. Follow the Clarity iOS pattern: `@Observable @MainActor` store, Codable structs.

---

## The 5 flows (screens)

### 1. Capture (`/inbox` on web → **Capture tab** on iOS)

- Full-screen text field at top, item list below
- User types → taps return or "+" → item added to inbox
- Shows count of unsorted inbox items: `{n} unsorted`
- Empty state: "Nothing in the inbox." / "That's either great or suspicious."
- No metadata. No categories. Just text.

### 2. Sort (`/sort` on web → **Sort tab** on iOS)

- Shows ONE inbox item at a time (not a list)
- Four lane buttons below it: Regulation / Maintenance / Support Others / Future
- Tapping a lane assigns the item to that lane
- "Skip" button sends item back (cycles to end of inbox)
- Empty state: "Inbox is empty. Nothing to sort."
- Subtitle: "Move inbox items into lanes."

### 3. Today — Lane Lock (`/today` LanePicker on web → **Today tab, pre-lock state**)

- Heading: "Today"
- Subtitle: "Pick your 2 lanes. The rest disappear."
- Four lane tiles with name + description
- User taps 2 lanes → "Lock in for today" button activates
- Helper text: "This can't be undone until tomorrow."
- Once locked: LanePicker disappears, FocusView appears

### 4. Today — Focus (`/today` FocusView on web → **Today tab, post-lock state**)

- Shows one item at a time from the 2 active lanes
- Item text large and centered
- Two buttons: "Skip" (secondary) and "Done" (primary, green)
- Progress counter: `{n} remaining`
- Lane badge showing which lane the current item belongs to
- Empty state: "▲" icon + "All clear." + "Nothing left in your active lanes."

### 5. Check (`/check` on web → **Check tab**)

**Pre-check (form):**
- Heading: "Check"
- Subtitle: "Two questions. That's it."
- Q1: "Did you produce something today?" → Yes / No
- Q2: "Did you stay in your lanes?" → Yes / No
- "Log it" button (disabled until both answered)

**Post-check (result):**
- Heading: "Check"
- Subtitle: "Today is logged."
- Result icon (large): `▲` (both yes) / `◆` (one yes) / `—` (neither)
- Result phrase:
  - Both yes → **"Solid day."**
  - One yes → **"Halfway there."**
  - Neither → **"Rest day. That counts too."**
- Summary: "Produced: Yes/No" + "Stayed in lanes: Yes/No"

---

## Bottom navigation (4 tabs)

| Tab | Icon | Badge |
|-----|------|-------|
| Capture | `+` | Inbox count (amber dot) if > 0 |
| Sort | `↕` or SF Symbol `arrow.up.arrow.down` | — |
| Today | `▲` or `triangle.fill` | Green dot if locked today |
| Check | `✓` or `checkmark` | Green dot if checked today |

---

## Key behaviors (preserve all of these)

- `DailyLock` is irreversible — once locked, LanePicker never shows again that calendar day
- `today()` uses `YYYY-MM-DD` in local time as the date key for all daily state
- Sort flow: one item at a time, never a list
- Focus view: one item at a time — Done/Skip cycles to the next active item
- Check can only be submitted once per day (result shown after that)
- Inbox badge and lock/check dots on nav update reactively from store

---

## Anti-features (do not add these — ever)

- No additional lanes (4 is permanent max)
- No due dates or priorities
- No tags or labels
- No settings or customization
- No streaks or gamification
- No notifications (v1)
- No social features
- No export / import
- No integrations

---

## UI / visual direction

The web app is dark, minimal, and uses a zinc color palette. iOS should match:

- **Background:** near-black (system background in dark mode, or `Color(hex: "#09090b")`)
- **Text:** near-white primary, muted gray secondary
- **Lane colors:**
  - Regulation: `Color.sky` / `Color(hex: "#0ea5e9")`
  - Maintenance: `Color.emerald` / `Color(hex: "#10b981")`
  - Support: `Color.violet` / `Color(hex: "#8b5cf6")`
  - Future: `Color.amber` / `Color(hex: "#f59e0b")`
- **Primary action buttons:** rounded rect, prominent
- **Done button:** emerald green
- **Log it / Lock in:** amber
- **Haptics:** light impact on Done, medium on Lock

Dark mode only. No light mode support needed.

---

## Tech stack (follow the Clarity iOS pattern)

```
SwiftUI + iOS 17 + @Observable + UserDefaults + Codable
No SwiftData. No external dependencies. No ClarityUI package needed (standalone app).
```

Follow `clarity-checkin-ios` patterns:
- `@Observable @MainActor` store class
- `nonisolated init()` to allow `@State private var store = Store()` in App
- `@Bindable var s = store` in views for two-way binding
- All data is `Codable` structs — never `[String: Any]`
- `UserDefaults` key: `unnamed_ios_v1` — do not change once on device

---

## Suggested file structure

```
Unnamed/
  UnnamedApp.swift              ← @main, store init, .environment()
  Models/
    AppState.swift              ← AppState, Item, DailyLock, DailyCheck, Lane, ItemStatus
  Services/
    AppStore.swift              ← @Observable store: load, save, all mutations
    DateHelpers.swift           ← today() → "YYYY-MM-DD"
  Views/
    ContentView.swift           ← TabView with 4 tabs + badge logic
    Capture/
      CaptureView.swift         ← text input + inbox list
    Sort/
      SortView.swift            ← one-at-a-time lane assignment
    Today/
      TodayView.swift           ← switches between LanePickerView and FocusView
      LanePickerView.swift      ← pick 2 lanes + lock button
      FocusView.swift           ← one item at a time + done/skip
    Check/
      CheckView.swift           ← switches between CheckFormView and CheckDoneView
      CheckFormView.swift       ← two yes/no questions + log it
      CheckDoneView.swift       ← result icon + phrase + summary
  Constants/
    Lanes.swift                 ← lane labels, descriptions, colors
UnnamedTests/
  AppStateTests.swift           ← encode/decode, lane lock, daily check, today() boundary
```

---

## Xcode project setup

```bash
# Create in portfolio/ alongside other apps
# Use: File > New > Project > iOS > App
# Product name: Unnamed
# Bundle ID: com.chasewhittaker.Unnamed
# Language: Swift
# Interface: SwiftUI
# No Core Data, no tests (add manually or let Claude scaffold)
```

---

## Phase 1 scope (MVP only)

Build exactly what the web app has. Nothing more.

- [ ] All 5 flows functional
- [ ] Persistent state via UserDefaults (`unnamed_ios_v1`)
- [ ] Bottom tab navigation with badges
- [ ] Lane lock irreversible until midnight
- [ ] Check result shows correct phrase
- [ ] Dark UI matching web app palette
- [ ] Haptic feedback on Done and Lock

**Phase 1 rule:** No features until Chase has used it for 7 days.

---

## References

- Web app (source of truth): `portfolio/unnamed/`
- Web app CLAUDE.md: `portfolio/unnamed/CLAUDE.md`
- Closest iOS pattern to follow: `portfolio/clarity-checkin-ios/`
- Clarity iOS patterns: `portfolio/clarity-checkin-ios/CLAUDE.md`
- iOS data pattern: `portfolio/clarity-checkin-ios/ClarityCheckin/Services/CheckinStore.swift`
- Portfolio conventions: `~/Developer/chase/CLAUDE.md`

---

## Session starter prompt

Paste this into a new Claude Code chat:

```
Read ~/Developer/chase/CLAUDE.md and ~/Developer/chase/portfolio/unnamed/HANDOFF_IOS.md before doing anything else.

Goal: Build the native iOS version of the "Unnamed" daily OS app. 

Start by creating the Xcode project at ~/Developer/chase/portfolio/unnamed-ios/ following the file structure in HANDOFF_IOS.md. Then implement Phase 1 (MVP) using SwiftUI + @Observable + UserDefaults, following the clarity-checkin-ios patterns.

The web app at portfolio/unnamed/ is the complete reference — match its flows and behaviors exactly.
```
