# Clarity Command — Phase 2 Session Handoff

> Start a new chat, paste this entire document, and say: "Read CLAUDE.md and HANDOFF.md first, then continue Phase 2."

## Context

Clarity Command (Phase 1) is live at **https://clarity-command.vercel.app**. It's the daily accountability hub — morning mission briefing (LDS scripture + wife's words + conviction messages), evening reflection, cross-app scoreboard, and settings.

Phase 2 wires Job Search HQ and Wellness Tracker into Command's accountability system. Both apps already sync to Supabase. The goal is that when Chase logs into Clarity Command, the Scoreboard reflects real activity from his other apps instead of manual check-ins.

## Phase 2 Goals

1. **Job Search HQ** — Add a persistent daily action counter + quick-log to FocusTab. Write a daily summary to Supabase (`app_key = 'job-search-daily'`) so Clarity Command can read it.
2. **Wellness Tracker** — Add morning/evening accountability prompts to TrackerTab (mood + "Am I making excuses today?" + physical activity). Write daily summary to Supabase (`app_key = 'wellness-daily'`).
3. **Clarity Command** — Read Job Search and Wellness daily summaries from Supabase to populate the Scoreboard automatically (instead of manual input).

## Supabase Env Vars — NEEDED

Clarity Command is deployed but running in localStorage-only mode. Before or during Phase 2, add these in the Vercel dashboard for the `clarity-command` project:

```
REACT_APP_SUPABASE_URL=<same as wellness-tracker and job-search-hq>
REACT_APP_SUPABASE_ANON_KEY=<same as wellness-tracker and job-search-hq>
```

The Supabase project ID is `unqtnnxlltiadzbqpyhh` — credentials are the same across all three apps.

## Job Search HQ Changes

**File:** `portfolio/job-search-hq/src/tabs/FocusTab.jsx`

Add at the top of the tab (always visible, regardless of what else is on screen):

```
╔══════════════════════════════╗
║  Today's Job Actions: 2/5    ║  ← progress bar, gold when met
║  [+ Application] [+ Outreach] [+ Other]
╚══════════════════════════════╝
```

- Counter persists in localStorage as part of `chase_job_search_v1` blob
- Key: `dailyActions` — array of `{ id, date, type, note, time }`
- Filter to today's date when counting
- After each add, write a daily summary to Supabase:
  ```js
  push('job-search-daily', {
    date: today(),          // "2026-04-13"
    count: actions.length,
    met: actions.length >= 5,
    actions: actions,
  })
  ```
- Show "No Zero Days" badge if streak > 0 (read from stored data)

**File:** `portfolio/job-search-hq/src/constants.js`

Add `today()` helper (same as theme.js in Clarity Command: `new Date().toISOString().slice(0, 10)`).

## Wellness Tracker Changes

**File:** `portfolio/wellness-tracker/src/tabs/TrackerTab.jsx`

Morning check-in form — add two new questions at the top of the morning section:

1. **"Am I making excuses today?"** — Yes / No / "I'm pushing through anyway" (radio)
2. **"Physical activity planned?"** — checkbox (20 min minimum)

Evening check-in — add:

1. **"Did I make excuses today?"** — Yes / No / Partial
2. **"Physical activity completed?"** — checkbox

After saving either check-in, write daily summary to Supabase:
```js
push('wellness-daily', {
  date: today(),
  morningDone: !!savedMorning,
  eveningDone: !!savedEvening,
  excusesAnswer: formData.excusesAnswer,  // new field
  activityDone: formData.activityDone,     // new field
  met: !!savedMorning && !!savedEvening && formData.activityDone,
})
```

## Clarity Command Changes — Cross-App Reads

**File:** `portfolio/clarity-command/src/App.jsx`

On load, after pulling own data, also pull from the other app keys:

```js
const [jobSearchData, setJobSearchData] = useState({});
const [wellnessData, setWellnessData] = useState({});

// In load useEffect, after main pull():
pull('job-search-daily', {}, 0).then(d => setJobSearchData(d));
pull('wellness-daily', {}, 0).then(d => setWellnessData(d));
```

**File:** `portfolio/clarity-command/src/tabs/MissionTab.jsx`

Replace the manual job action counter with live data from `jobSearchData` when available:

```js
// If jobSearchData.date === today(), use its count
const liveJobCount = jobSearchData?.date === today() ? jobSearchData.count : null;
const jobCount = liveJobCount !== null ? liveJobCount : jobActions.length;
```

Show a "Synced from Job Search HQ" indicator when using live data.

**File:** `portfolio/clarity-command/src/tabs/ScoreboardTab.jsx`

Add a "Live App Data" section showing:
- Job Search HQ: last sync time, today's count
- Wellness Tracker: morning/evening done, activity done

## Data Flow Diagram

```
Job Search HQ ──push('job-search-daily', ...)──► Supabase
Wellness Tracker ──push('wellness-daily', ...)──► Supabase
                                                       │
Clarity Command ◄──pull('job-search-daily') ──────────┘
                ◄──pull('wellness-daily') ─────────────┘
```

All three apps share the same Supabase project (`unqtnnxlltiadzbqpyhh`) with RLS (each user sees only their own rows). APP_KEY differentiation keeps the data separate.

## Files to Modify

| File | Change |
|------|--------|
| `portfolio/job-search-hq/src/tabs/FocusTab.jsx` | Add daily action counter + quick-log |
| `portfolio/job-search-hq/src/constants.js` | Add `today()` helper, daily action storage schema |
| `portfolio/job-search-hq/src/App.jsx` | Add `dailyActions` to state + blob; push `job-search-daily` after save |
| `portfolio/wellness-tracker/src/tabs/TrackerTab.jsx` | Add excuses + activity questions to morning/evening |
| `portfolio/wellness-tracker/src/App.jsx` | Add new fields to entry schema; push `wellness-daily` after save |
| `portfolio/clarity-command/src/App.jsx` | Pull `job-search-daily` + `wellness-daily` on load |
| `portfolio/clarity-command/src/tabs/MissionTab.jsx` | Use live job count when available |
| `portfolio/clarity-command/src/tabs/ScoreboardTab.jsx` | Add Live App Data section |

## Verification Checklist

- [ ] Job Search HQ: log 3 actions, verify `chase_job_search_v1` has them + Supabase row updated
- [ ] Wellness Tracker: complete morning check-in with excuses + activity, verify Supabase row
- [ ] Clarity Command: open Scoreboard, verify job count synced from Job Search HQ
- [ ] Clarity Command: open Scoreboard, verify wellness morning/evening synced
- [ ] `npm run build` passes for all three modified apps
- [ ] Vercel redeploy all three (or push to main → CI handles it)

## Priority Note

Job Search HQ is the most important change — that's where Chase spends time every day tracking applications. Make that one count. Do it first. The 5-action counter should be the first thing he sees when he opens that app.
