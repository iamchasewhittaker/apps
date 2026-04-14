# Clarity Command Phase 2 — Session Handoff

> **How to start a new chat:** Paste this entire document and say:
> *"Read CLAUDE.md and HANDOFF.md first, then continue from this Phase 2 handoff."*

---

## What Was Done (Phase 2 — COMPLETE)

All code changes have been implemented and verified with `npm run build` (all three apps pass clean).

### 1. Clarity Command Logo ✅
- `portfolio/clarity-command/public/logo.svg` — Shield + compass SVG, gold `#c8a84b` on dark `#0a0d14`
- `portfolio/clarity-command/public/logo192.png` — 192×192 PWA manifest icon
- `portfolio/clarity-command/public/logo512.png` — 512×512 PWA manifest icon
- `portfolio/clarity-command/public/apple-touch-icon.png` — 180×180 iOS home screen
- `portfolio/clarity-command/public/favicon.svg` — browser tab favicon

### 2. Job Search HQ — Daily Action Counter ✅

**`portfolio/job-search-hq/src/constants.js`**
- Added `today()` helper — `new Date().toISOString().slice(0, 10)`
- Added `JOB_ACTION_TYPES` constant (Application, Outreach, Interview, Prep, Learning, Other)
- Added `dailyActions: []` to `defaultData` — `{ id, date, type, note, time }`

**`portfolio/job-search-hq/src/App.jsx`**
- Imports `today` and `generateId` from constants
- Added `addDailyAction(type, note)` and `removeDailyAction(id)` helper functions
- Added second `useEffect` that pushes `job-search-daily` summary to Supabase whenever `data.dailyActions` changes
- Passes `dailyActions`, `addDailyAction`, `removeDailyAction` props to `FocusTab`

**`portfolio/job-search-hq/src/tabs/FocusTab.jsx`**
- Added `DailyActionCounter` component — always visible at the top of the Daily Focus tab
  - Gold progress bar (0–5 actions), turns gold when target met
  - Quick-add buttons for each action type
  - Note input (optional, auto-clears after adding)
  - Today's action log with remove buttons
  - Streak badge ("🔥 N-day streak — No Zero Days")
  - Expandable/collapsible log

### 3. Wellness Tracker — Accountability Prompts ✅

**`portfolio/wellness-tracker/src/tabs/TrackerTab.jsx`**
- Added two accountability questions at the **top** of `MorningStartSection` (nums 1–2):
  1. "Am I making excuses today?" — Yes / Pushing through / No
  2. "Physical activity planned today?" — Yes 20+ min / Not today
- Added two accountability questions at the **top** of `EndOfDaySection` (nums 1–2):
  1. "Did I make excuses today?" — Yes / Partial / No
  2. "Physical activity completed?" — Yes / No
- Existing section numbers shifted up by 2 in each function
- Fields stored in `formData` as: `excusesMorning`, `activityPlanned`, `excusesEvening`, `activityDone`

**`portfolio/wellness-tracker/src/App.jsx`**
- Added `useEffect` that pushes `wellness-daily` summary to Supabase whenever `savedMorning`, `savedEvening`, or excuses/activity fields change

### 4. Clarity Command — Cross-App Reads ✅

**`portfolio/clarity-command/src/App.jsx`**
- Added `jobSearchDaily` and `wellnessDaily` state
- On load, pulls `job-search-daily` and `wellness-daily` from Supabase (timestamp 0 = always fetch remote)
- Passes both to `sharedProps` (→ MissionTab) and explicitly to ScoreboardTab

**`portfolio/clarity-command/src/tabs/MissionTab.jsx`**
- Accepts `jobSearchDaily` and `wellnessDaily` props
- When `jobSearchDaily.date === today()`, uses live count from Job Search HQ instead of manual entry
- Job Search target row shows "📡" indicator when synced from live data

**`portfolio/clarity-command/src/tabs/ScoreboardTab.jsx`**
- Added `LiveAppData` component — appears at top of scoreboard when cross-app data is available
  - Job Search HQ: shows `count/5 actions` with green when target met
  - Wellness Tracker: shows ☀️/🌙/🏃 icons for morning/evening/activity status

---

## What Still Needs to Happen

### A. Set Supabase Env Vars on Clarity Command (BLOCKER for cross-app sync)

Clarity Command is currently running in localStorage-only mode — it has no `.env` file. Without env vars, `pull('job-search-daily')` is a no-op and the scoreboard will not show live data.

**Steps:**
1. Go to Vercel dashboard → `clarity-command` project → Settings → Environment Variables
2. Add two production env vars:
   ```
   REACT_APP_SUPABASE_URL=https://unqtnnxlltiadzbqpyhh.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucXRubnhsbHRpYWR6YnFweWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQwODksImV4cCI6MjA4OTk1MDA4OX0.SiLspiMZoQuE8jr-WcYLHPSAYsw7-JJ1T69zWO85rkY
   ```
3. Redeploy Clarity Command (push to main or trigger manual deploy)

Also add a `.env` file locally for `npm start` testing:
```
# portfolio/clarity-command/.env
REACT_APP_SUPABASE_URL=https://unqtnnxlltiadzbqpyhh.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucXRubnhsbHRpYWR6YnFweWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzQwODksImV4cCI6MjA4OTk1MDA4OX0.SiLspiMZoQuE8jr-WcYLHPSAYsw7-JJ1T69zWO85rkY
```

### B. Set Your Layoff Date in Clarity Command

Open https://clarity-command.vercel.app → Settings → set your layoff date. This powers the "Days Since Layoff" counter on the mission briefing.

### C. Deploy All Three Apps

Push to `main` — GitHub Actions CI will build all three. Vercel auto-deploys on push.

```bash
cd ~/Developer/chase
checkpoint
git add portfolio/clarity-command portfolio/job-search-hq portfolio/wellness-tracker
git commit -m "Phase 2: cross-app accountability sync + Clarity Command logo"
git push
```

---

## Data Flow (now live)

```
Job Search HQ
  → logs daily actions in dailyActions[]
  → push('job-search-daily', { date, count, met, actions })
        ↓
      Supabase user_data table
        ↓
Clarity Command ← pull('job-search-daily') on load
  → MissionTab: shows live count with 📡 indicator
  → ScoreboardTab: LiveAppData section

Wellness Tracker
  → accountability prompts in morning + evening check-in
  → push('wellness-daily', { date, morningDone, eveningDone, excusesMorning/Evening, activityPlanned/Done, met })
        ↓
      Supabase user_data table
        ↓
Clarity Command ← pull('wellness-daily') on load
  → ScoreboardTab: LiveAppData ☀️🌙🏃 status
```

---

## Supabase app_key Reference

| app_key | Written by | Read by | Purpose |
|---------|-----------|---------|---------|
| `job-search` | Job Search HQ | Job Search HQ | Full app state sync |
| `wellness` | Wellness Tracker | Wellness Tracker | Full app state sync |
| `command` | Clarity Command | Clarity Command | Full app state sync |
| `job-search-daily` | Job Search HQ | Clarity Command | Daily action summary |
| `wellness-daily` | Wellness Tracker | Clarity Command | Daily check-in summary |

---

## Verification Checklist

- [ ] Log 3 job actions in Job Search HQ → counter shows 3/5, progress bar 60%
- [ ] Log 2 more → counter turns gold, shows "✓ Target met"
- [ ] Open Clarity Command Scoreboard → "📡 Live App Data" shows Job Search HQ count
- [ ] Open Clarity Command Mission tab → Job Search Actions row shows "📡" with live count
- [ ] Complete morning check-in in Wellness Tracker → answer excuses + activity prompts
- [ ] Open Clarity Command Scoreboard → Wellness row shows ☀️ ✓
- [ ] Complete evening check-in → Wellness row shows ☀️ ✓ 🌙 ✓
- [ ] `npm run build` passes in all three apps (already verified ✅)

---

## Files Changed in Phase 2

| File | What Changed |
|------|-------------|
| `portfolio/clarity-command/public/logo.svg` | NEW — shield/compass SVG logo |
| `portfolio/clarity-command/public/logo192.png` | NEW — PWA icon 192px |
| `portfolio/clarity-command/public/logo512.png` | NEW — PWA icon 512px |
| `portfolio/clarity-command/public/apple-touch-icon.png` | NEW — iOS home screen 180px |
| `portfolio/clarity-command/public/favicon.svg` | NEW — browser tab favicon |
| `portfolio/job-search-hq/src/constants.js` | Added `today()`, `JOB_ACTION_TYPES`, `dailyActions` to `defaultData` |
| `portfolio/job-search-hq/src/App.jsx` | `addDailyAction`, `removeDailyAction`, push `job-search-daily` |
| `portfolio/job-search-hq/src/tabs/FocusTab.jsx` | `DailyActionCounter` component at top of tab |
| `portfolio/wellness-tracker/src/tabs/TrackerTab.jsx` | Accountability prompts in morning + evening sections |
| `portfolio/wellness-tracker/src/App.jsx` | Push `wellness-daily` on check-in save |
| `portfolio/clarity-command/src/App.jsx` | Pull `job-search-daily` + `wellness-daily` on load |
| `portfolio/clarity-command/src/tabs/MissionTab.jsx` | Use live job count when synced |
| `portfolio/clarity-command/src/tabs/ScoreboardTab.jsx` | `LiveAppData` section |
