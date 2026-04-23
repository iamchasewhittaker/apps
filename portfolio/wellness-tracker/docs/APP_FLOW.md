# App Flow — Wellness Tracker

## Primary flow — Morning check-in

1. Chase opens the app; `pull()` fires, loading latest Supabase state.
2. App lands on Tracker tab (default). Today's entry is empty or shows a saved draft.
3. Chase fills morning fields: sleep hours, mood (1–5), energy (1–5), supplements taken, meds taken, notes.
4. Chase taps Save. `save()` stamps `_syncAt`, writes to localStorage, fires `push()` to Supabase.
5. Tracker tab shows "Morning logged" confirmation state.
6. Chase navigates to Tasks tab to review today's tasks.
7. End of day: Chase returns to Tracker tab, fills evening fields (mood, energy, notes), saves.
8. Day is complete — History tab will show today's entry starting tomorrow.

## Alternate flows

**Empty state (first run):**  
No entries in localStorage. Tracker tab shows prompt: "Start your first check-in." All tabs render with empty-data fallbacks. History tab shows "No entries yet."

**Supabase auth required:**  
On load, if no valid session, app shows email OTP prompt before data loads. On success, `pull()` fires and app continues normally.

**Save error:**  
If `push()` fails (network offline), entry is saved to localStorage and a non-blocking banner shows "Sync pending." Data is not lost. Sync retries on next save.

## Screens

| Screen | Purpose | Empty state | Error state |
|--------|---------|-------------|-------------|
| Tracker tab | Morning/evening check-in form | Prompt to log first check-in | Form fields disabled; error banner |
| Tasks tab | Task list + ideas sub-tab | "No tasks yet — add one" | Tasks fail to load; show last known state |
| Time tab | Focus timer + scripture streak | Timer at 0:00, streak at 0 | Timer reset; streak preserved in localStorage |
| Budget tab | Spending log + wants tracker | "No entries this month" | Show cached totals |
| History tab | 90-day log, analytics, AI summary, export | "No history yet" | Analytics hidden; export still available |
| Growth tab | Habit logging, streaks, wins | "Log your first win" | Streaks show 0; prior entries preserved |

## Accessibility notes

- **Tap targets:** All interactive elements minimum 44×44pt.
- **Contrast:** Primary text `#f3f4f6` on `#0e1015` background = 16:1. Accent `#4f92f2` on dark surface = verified 4.5:1 minimum for interactive labels.
- **Dynamic Type:** Body text and labels use relative units where possible; not full SwiftUI Dynamic Type (web app), but font-size base is 16px.
- **VoiceOver / screen reader:** Form fields have explicit `<label>` associations. Tabs use `role="tab"` + `aria-selected`. Save button has descriptive `aria-label`.
- **Focus order:** Logical DOM order — top nav, then tab content top-to-bottom.
- **Error states:** Error messages are announced via `aria-live="polite"` regions.

## Data model sketch

```
chase_wellness_v1: {
  entries: [
    {
      date: "YYYY-MM-DD",
      morning: { sleep, mood, energy, supplements, meds, notes },
      evening: { mood, energy, notes },
      _savedAt: timestamp
    }
  ],
  tasks: [ { id, text, done, category, createdAt } ],
  ideas: [ { id, text, createdAt } ],
  timeEntries: [ { id, duration, label, date } ],
  scriptureStreak: { count, lastDate },
  budget: { entries: [ { id, amount, label, date, type } ] },
  wants: [ { id, text, amount, date } ],
  growth: { areas: { [areaKey]: { logs: [...], streak, wins: [...] } } },
  _syncAt: timestamp
}

chase_wellness_draft_v1: { ...partial morning or evening form state }
chase_wellness_meds_v1: { meds: [...], supplements: [...] }
```
