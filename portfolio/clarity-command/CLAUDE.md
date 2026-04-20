# Clarity Command — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Version:** v1.0
- **Storage key:** `chase_command_v1`
- **URL:** local only (Vercel project removed 2026-04-20)
- **Purpose:** Daily accountability hub — morning mission briefing, evening reflection, cross-app scoreboard. Rooted in LDS faith and family urgency.
- **Mission:** *"For Reese. For Buzz. Forward — no excuses."*
- **Branding:** Clarity family palette, gold accent (`#c8a84b`), dark background (`#0a0d14`). See [`docs/BRANDING.md`](docs/BRANDING.md).
- **Entry:** `src/App.jsx`

## File Structure
```
src/
  App.jsx               ← shell: state, auth gate, nav tabs, load/save/push/pull
  theme.js              ← T (colors), load/save, today(), daysSince(), computeStreak(), DEFAULT_STATE
  ErrorBoundary.jsx
  sync.js               ← Supabase adapter (APP_KEY = 'command')
  index.js
  tabs/
    MissionTab.jsx      ← morning briefing + target tracking + evening reflection
    ScoreboardTab.jsx   ← week grid, area streaks, monthly calendar, stats
    SettingsTab.jsx     ← layoff date, targets, wife's reminders, scripture bank, data export
  data/
    scriptures.js       ← LDS scripture bank (15 entries) + getTodayScripture()
    reminders.js        ← wife's words bank (15 entries) + getTodayReminder() + getReminderForArea()
```

## State Architecture
All persistent state in `App.jsx`, saved as one blob under `chase_command_v1`:
```js
{
  layoffDate,     // ISO date string — used for days-since counter
  scriptures,     // custom user-added scriptures (base bank in data/scriptures.js)
  reminders,      // custom user-added reminders (base bank in data/reminders.js)
  targets: {
    jobActions,         // default 5
    productiveHours,    // default 6
    budgetCheckin,      // default 1
    scriptureMinutes,   // default 15
  },
  dailyLogs,      // array of { date, areas, jobActions, excuses, notes, top3Tomorrow, committed }
  _syncAt,        // set by save() for Supabase sync
}
```

### Daily Log Entry Schema
```js
{
  date: "2026-04-13",       // ISO date string
  committed: false,          // did user press "Accept Mission" in the morning
  jobActions: [              // array of logged job actions
    { id, type, note, time }
  ],
  areas: {
    jobs: 0,                 // count (mirrors jobActions.length)
    time: 0,                 // productive hours tracked
    budget: false,           // budget check-in done
    scripture: 0,            // minutes studied
    prayer: { morning: false, evening: false },
    wellness: { morning: false, evening: false, activity: false },
  },
  excuses: "",               // evening reflection: excuses audit
  notes: "",                 // evening reflection: what was accomplished
  top3Tomorrow: ["", "", ""],// tomorrow's top 3 priorities
}
```

## Key Conventions
- `hasLoaded.current` ref guards save effect from firing on first render
- `upsertTodayLog(patch)` merges partial patches into today's log entry
- Scripture and reminder rotation: day-of-year index mod array length
- Conviction messages only fire when yesterday had misses (not today — give grace to act first)
- Max 180 daily logs retained (trimmed in `upsertTodayLog`)

## Supabase Sync
Same pattern as Wellness Tracker. Uses shared `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY`. Falls back to localStorage-only mode if `.env` missing.

APP_KEY = `'command'`

To activate sync: add `.env` with same Supabase credentials as other apps.

## Daily Minimums (defaults)
| Area | Target |
|------|--------|
| Job search actions | 5 |
| Productive hours | 6 |
| Budget check-in | 1 |
| Scripture study | 15 min |
| Prayer | Morning + evening |
| Physical activity | 1 (20 min) |

## Tone
Direct and convicting. No sugarcoating. When targets are missed, the next morning shows conviction messages tied to LDS scripture and wife's words. "You applied to 0 jobs yesterday. 'You are wasting time.' Anxiously engaged means TODAY. (D&C 58:27)"
