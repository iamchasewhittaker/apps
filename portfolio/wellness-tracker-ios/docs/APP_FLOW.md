# App Flow — Wellness Tracker iOS

> Phase 2 shell. Five tabs (Check-in / Tasks / Time / Capture / Sync). Local-only. Supabase wiring present but not enabled.

## Primary flow — Morning check-in (Phase 2)

1. Chase taps the Wellness Tracker icon on the home screen.
2. App launches to Check-in tab (default). UserDefaults loads `chase_wellness_ios_v1` (main) and `chase_wellness_ios_draft_v1` (same-day draft).
3. Today's morning form renders. If a same-day draft exists, fields restore from it.
4. Chase fills sleep / mood / energy / supplement fields and taps Save. Entry merges into today's record (`saveEntry` same-day merge).
5. Chase swipes to Tasks tab, marks a task complete. State saves to UserDefaults immediately.
6. Chase swipes to Time tab, starts a focus timer.
7. Chase swipes to Capture tab, types a quick note, taps Save.
8. Chase backgrounds the app. On next launch: check-in entry, draft, task state, timer state, and captured notes all persist.

## Alternate flow — Evening check-in

1. Same launch path → Check-in tab.
2. Today's record exists from morning save; evening fields render below morning fields.
3. Chase fills evening fields (mood, gratitude, notes) and saves. Same `saveEntry` merge keeps both halves of the day in one record.

## Alternate flows

**First launch (empty state):**  
No UserDefaults entry. All tabs show empty states. Tasks: "No tasks yet." Time: timer at 0:00. Capture: empty text field with placeholder. Sync: "Not connected" status badge.

**Supabase sync tab (Phase 2 — status only):**  
Sync tab shows connection indicator. If Supabase is reachable: green badge "Connected." If not: yellow badge "Offline." No read or write happens — this is display only until Phase 3.

**Background + foreground:**  
App uses `@Observable` state. On foreground, `onAppear` reloads from UserDefaults to catch any changes.

## Screens (Phase 2 shell)

| Screen | Purpose | Empty state | Error state |
|--------|---------|-------------|-------------|
| Check-in tab | Morning + evening form, same-day draft, past days read-only | "Start your first check-in" | Form disabled; draft preserved in UserDefaults |
| Tasks tab | View today's task list | "No tasks yet" | Show last saved state; no crash |
| Time tab | Basic focus timer | Timer 0:00, start button | Timer resets; preserves last session count |
| Capture tab | Quick note entry | Placeholder text in field | Save fails silently; draft preserved in field |
| Sync tab | Supabase connection status | "Not connected" | "Connection error" with retry hint |

## Accessibility notes (per screen)

**General (all tabs):**
- Minimum tap target: 44×44pt on all interactive elements
- Text scales with Dynamic Type — no fixed font sizes
- VoiceOver: all interactive elements have descriptive accessibility labels
- Focus order: tab bar first, then tab content top-to-bottom
- Contrast: `#f3f4f6` on `#0e1015` = 16:1 (exceeds 4.5:1 minimum)

**Check-in tab:**
- Each form field: `accessibilityLabel` includes the prompt + current value
- Save button: minimum 44pt, `accessibilityLabel("Save check-in")`
- Past-day rows: `accessibilityLabel` reads date + summary; tap opens read-only detail

**Tasks tab:**
- Task rows: `accessibilityLabel` includes task text + completion status
- Completion toggle: `accessibilityHint("Double-tap to mark as complete")`

**Time tab:**
- Timer display: `accessibilityLabel` updates live ("Timer: 12 minutes 30 seconds")
- Start/stop button: `accessibilityLabel` switches between "Start timer" and "Stop timer"

**Capture tab:**
- Text field: `accessibilityLabel("Quick capture note")`
- Save button: minimum 44pt, `accessibilityLabel("Save note")`

**Sync tab:**
- Status badge: `accessibilityLabel("Supabase sync: connected")` or "…: offline"

## Data model sketch (Phase 2 shell)

```swift
// UserDefaults key: "chase_wellness_ios_v1"
struct WellnessLocalState: Codable {
    var checkIns: [CheckInEntry]     // morning/evening form per day (Phase 2)
    var tasks: [WellnessTask]        // today's tasks
    var captureNotes: [CaptureNote]  // quick captures
    var timerState: TimerState       // last known timer
    var lastSavedAt: Date
}

// UserDefaults key: "chase_wellness_ios_draft_v1"
struct CheckInDraft: Codable {
    var date: Date
    var fields: [String: String]     // partial form state for same-day restore
}

struct WellnessTask: Codable, Identifiable {
    var id: UUID
    var text: String
    var done: Bool
    var createdAt: Date
}

struct CaptureNote: Codable, Identifiable {
    var id: UUID
    var text: String
    var createdAt: Date
}

struct TimerState: Codable {
    var elapsedSeconds: Int
    var isRunning: Bool
}

// Phase 3 additions:
// - GrowthArea (streaks, logs)
// - Supabase push/pull with app_key = "wellness"
// - Task CRUD with categories
```
