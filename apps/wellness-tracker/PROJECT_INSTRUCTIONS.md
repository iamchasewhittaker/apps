# Wellness Tracker — Project Instructions
> Paste this at the start of every session with Claude.
> Reference MASTER_PROJECT_FRAMEWORK.md for standards that apply to all projects.

---

## How to Start Every Session

**After every deploy, the sync script runs automatically and copies a summary to your clipboard. Just paste it into Claude — no template needed.**

If starting a session without a recent deploy, upload:
- `App.jsx`
- `PROJECT_INSTRUCTIONS.md`

And say what you want to change.

---

## App Hub — Automatic Sync (set up 2026-03-22)

After every `git push`, `~/Documents/apps/app-hub/sync.sh` fires automatically and:
- Reads App.jsx line count
- Reads current git tag (version)
- Extracts new CHANGELOG entries since last sync
- Reads last audit results
- Copies a full summary to clipboard

**You just paste that summary into Claude. Claude handles the rest.**

### If sync doesn't fire
Run it manually from inside the app folder:
```bash
cd ~/Documents/apps/wellness-tracker
bash ~/Documents/apps/app-hub/sync.sh
```

---

## What This App Is

A personal daily wellness tracker. It exists because standard task and wellness tools don't account for day-to-day cognitive variability. Used daily on Safari on iPhone. Deployed on Vercel.

**Live URL:** `https://wellnes-tracker.vercel.app`
**GitHub repo:** `github.com/iamchasewhittaker/wellnes-tracker` (private)
**Local folder:** `~/Documents/apps/wellness-tracker`
**Current version:** `v15.10`
**Supabase sign-in email:** Dashboard → Authentication → Email Templates → **Magic link** must include `{{ .Token }}` so OTP works (see `CLAUDE.md`).
**App.jsx:** ~370 lines (thin shell — state, effects, NavTabs, floating button modals)
**Source files:** 8 files across `src/` and `src/tabs/` (see Repo Structure below)

> **Note:** Growth Tracker app is now retired. Its functionality lives in the 🌱 Growth tab of this app.

---

## Repo Structure

```
apps/wellness-tracker/
  src/
    App.jsx                    ← thin shell: state, effects, NavTabs, floating modals (~365 lines)
    ErrorBoundary.jsx          ← class component; wraps each tab — isolates crashes per tab
    theme.js                   ← T theme object, STORE keys, load/save/draft helpers, MED_STORE/DEFAULT_MEDS/loadMeds/saveMeds
    ui.jsx                     ← 9 shared UI primitives (Card, Rating, ChoiceButton, etc.)
    index.js
    tabs/
      TrackerTab.jsx           ← daily check-in sections + quotes + MORNING/EVENING_SECTIONS
      TasksTab.jsx             ← Tasks, GmatTracker, IdeasInTasks, WIN_CATEGORIES, LIFE_AREAS
      TimeTrackerTab.jsx       ← TimeTrackerTab, TIME_CATEGORIES, fmt helpers
      BudgetTab.jsx            ← BudgetTool (default), WantsTracker (named)
      GrowthTab.jsx            ← GrowthTab + subcomponents + GROWTH_AREAS helpers
      HistoryTab.jsx           ← HistoryView, WinLogger, PatternsView, PatternAlerts, DoctorPrepView, AIMonthlySummary
  public/
    index.html                 ← no-cache meta tags + PWA meta tags
  .claude/
    launch.json                ← dev server registry for Claude Code (all 4 apps)
  vercel.json                  ← server-level cache headers (never delete)
  CHANGELOG.md                 ← one entry per version, update every deploy
  PROJECT_INSTRUCTIONS.md      ← this file
  MASTER_PROJECT_FRAMEWORK.md  ← standards for all projects
  audit.sh                     ← run BEFORE pre-deploy — checks framework rules
  pre-deploy.sh                ← run after audit passes
  package.json
  .gitignore
```

---

## Deploy Workflow

**With Claude Code (preferred):** Claude edits files directly — no Downloads step needed.
```bash
cd ~/Documents/apps/wellness-tracker
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN description" && git push
git tag vN && git push origin vN
```

**Without Claude Code (chat interface):**
```bash
mv ~/Downloads/App.jsx ~/Documents/apps/wellness-tracker/src/App.jsx
# (move any updated tab files from Downloads as needed)
mv ~/Downloads/PROJECT_INSTRUCTIONS.md ~/Documents/apps/wellness-tracker/PROJECT_INSTRUCTIONS.md
mv ~/Downloads/CHANGELOG.md ~/Documents/apps/wellness-tracker/CHANGELOG.md

cd ~/Documents/apps/wellness-tracker
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN description" && git push
git tag vN && git push origin vN
```

---

## audit.sh — What It Does

Run `bash audit.sh` from inside this folder before every deploy. It:
- Auto-detects this app as Wellness Tracker (uses `morning_start` + `end_of_day` as unique markers)
- Checks all 8 universal framework rules
- Checks Wellness-specific section keys (morning_start, end_of_day)
- Scores /100 and prints pass/fail for every check
- Auto-copies results to clipboard

**Score required to deploy: 100/100 (or all failures explained and intentional)**

---

## Tech Stack

- **Framework:** React (single JSX file — `src/App.jsx`)
- **Deployment:** Vercel — connected to GitHub, auto-deploys on push
- **Storage:** `localStorage` only — key: `chase_wellness_v1` — no backend
- **Theme:** Dark mode only — locked, never change. T.bg = `#0d0d0f`, T.surface = `#1a1a1f`
- **Primary device:** iPhone, Safari, PWA

---

## Relationship with Job Search HQ

These two apps are intentionally separate but connected:

| App | Purpose |
|-----|---------|
| **Wellness Tracker** (`wellnes-tracker.vercel.app`) | Capacity tracking, daily check-ins, mood, meds, streaks |
| **Job Search HQ** (`job-search-hq.vercel.app`) | Pipeline, contacts, AI tools, resume tailoring |

**How they connect:**
- Growth tab → Job Search card reads live pipeline stats from `chase_job_search_v1` (active apps, follow-ups overdue) via `getJobPipelineSummary()`
- Job Search card has an "Open Job Tracker →" deep-link button pointing to `job-search-hq.vercel.app`
- Job Search HQ writes job sessions back into `chase_wellness_v1` growthLogs via `logSessionToWellness()`
- `JOB_TRACKER_URL` constant at top of App.jsx (line ~4) — update if job search app URL ever changes

**Storage is always separate — wellness tracker never writes to `chase_job_search_v1`.**

---

## Critical Rules — Never Break These

| Rule | Why |
|------|-----|
| **Never change localStorage key** `chase_wellness_v1` | All data permanently lost |
| **Never remove `hasLoaded` ref** | Prevents save firing before load — looks like dead code but isn't |
| **Never split the unified save `useEffect`** | All persistent state saves through one effect in App.jsx — tab files receive state as props |
| **Always use `window.confirm()` not bare `confirm()`** | ESLint blocks bare confirm() — Vercel build fails |
| **`mediaLogStep` and `mediaNewLog` live in `TasksTab`** | Intentionally lifted — moving back resets on re-render |
| **`winOpen`, `wantsOpen`, `pulseOpen` live in App** | Not in child components |
| **`ideasData` and `setIdeasData` passed as props through `TasksTab`** | Ideas sub-view lives inside TasksTab since v15 |
| **Always verify brace balance before delivering** | `{` count must equal `}` count |
| **Never rewrite sections that aren't changing** | Surgical edits only |
| **Never change check-in question wording without asking** | Clinical tracking — wording changes break historical data |
| **Never delete `vercel.json`** | Breaks Safari cache busting |
| **Always update `CHANGELOG.md` on every deploy** | One entry per version |
| **Always run `bash audit.sh` before `bash pre-deploy.sh`** | Audit first, then pre-deploy |
| **Dark mode only** | T.bg = `#0d0d0f`, T.surface = `#1a1a1f` — never switch to light |
| **NavTabs must use `overflowX: auto` + `flex: 0 0 auto` per tab** | Prevents History tab cutoff on iPhone — never revert to `flex: 1` |
| **NavTabs must NOT have `position: sticky` or `zIndex`** | It lives inside a sticky parent — double-sticky breaks Safari zoom/layout |
| **`JOB_TRACKER_URL` constant at top of file** | Update here if job search app URL ever changes |
| **`BACKUP_FOLDER_KEY` = `chase_wellness_backup_folder`** | Stores File System Access API folder handle — do not rename |

---

## App Structure

### Tabs (6 total — tab bar must stay at 6)
| Tab | Component | Description |
|-----|-----------|-------------|
| Check-In | `TrackerTab` (inside App) | Morning + evening check-ins, daily quote |
| Tasks | `TasksTab` | Triage-first ADHD task system + Ideas sub-view |
| Time | `TimeTrackerTab` | Time tracking by category with tags, notes, background toggle |
| Budget | `BudgetTool` | Dual-scenario budget + Wants tracker |
| Growth | `GrowthTab` | Study + job search + faith tracking — 7 areas with streaks |
| History | `HistoryView` | Check-ins, pulse checks, tasks, budget, media, patterns, doctor prep, quotes, GMAT, summary |

### Floating Buttons (every tab)
- 🏆 **Win** (bottom left) — `WinLogger` modal, state `winOpen` in App
- 💊 **Pulse** (bottom center) — `PulseCheckModal`, state `pulseOpen` in App
- 🛒 **Want** (bottom right, non-budget tabs) — `WantsTracker` modal, state `wantsOpen` in App

---

## Backup System (v15.4–v15.5)

The History tab has two export options at the bottom:

**📤 Export CSV** — check-ins, wins, completed tasks as CSV. Opens in Sheets/Excel.

**💾 Full JSON Backup** — full `chase_wellness_v1` dump as dated JSON file.
- Uses File System Access API (`window.showDirectoryPicker`) on supported browsers
- First tap: prompts user to pick/create a folder (e.g. "Wellness Backups" in iCloud)
- Folder handle stored in `localStorage` key `chase_wellness_backup_folder`
- Subsequent taps: saves directly to folder, no prompt
- "Change backup folder" link clears the stored handle to re-prompt
- Falls back to standard download on Safari/Firefox (API not yet supported)

---

## Growth Tab (v15)

Component: `GrowthTab`. Receives `growthLogs` / `setGrowthLogs` props from App.

**7 areas:** gmat, job, ai, pm, claude, bom, cfm

**Key components:**
- `GrowthAreaCard` — 2-col grid, shows streak badge + done-today indicator
- `GrowthLogPanel` — area picker, minutes slider, milestone chips, background, note
- `GrowthWeekChart` — 7-day bar chart across all areas
- `GrowthHistorySection` — last 30 sessions, filterable by area
- `GrowthBadge` — streak display (green < 3 days, amber/fire 3–6, teal/lightning 7+)

**Job Search card special behavior (v15.2):**
- Reads `chase_job_search_v1` via `getJobPipelineSummary()` (plain function, not a hook)
- Shows active application count badge (blue)
- Shows follow-ups overdue badge (amber) when any Applied app is 7+ days old
- "Open Job Tracker →" deep-link button opens `job-search-hq.vercel.app`
- URL controlled by `JOB_TRACKER_URL` constant at top of file

**Helper functions** (prefixed `g` to avoid collision with Time Tracker):
`gToday()`, `gPrev(iso)`, `gFmt(iso)`, `gStreak(logs, id)`, `gMins(logs, id)`, `gDoneToday(logs, id)`

**growthLogs** stored as top-level key in `chase_wellness_v1` — never remove from unified save.

---

## Ideas (moved to Tasks tab in v15)

Ideas content (Capture, Pressure Test, Explore) lives inside `TasksTab` as a secondary nav sub-view (`view === "ideas"`). Component is now called `IdeasInTasks` (not `IdeasTab`). Props: `ideasData`, `setIdeasData`, `taskData`, `setTaskData` — passed down from App through TasksTab.

GMAT sub-tab was removed from Ideas — GMAT tracking now lives in the Growth tab.

---

## Time Tracker Tab (v12–v14)

Component: `TimeTrackerTab`. Receives `timeData` / `setTimeData` / `scriptureStreak` props from App.

**Scripture streak stored as `scriptureStreak` top-level key inside `chase_wellness_v1`:**
- `count` — consecutive days scripture was logged
- `lastDate` — `toDateString()` of last day logged
- Included in unified save useEffect — never remove

**11 categories:** kids, work, house, move, scripture, church, rest, social, winddown, tv, untracked

**Timer bug fixed in v15.1:** `elapsed` clamped to `Math.max(0, now - active.startTime)` — `fmtHHMM` also guards against negative ms.

**DST midnight fix (v15.7):** `elapsed` additionally checks `new Date(active.startTime).toDateString() === todayStr` — sessions that started on a prior calendar day show 0 elapsed (cross-midnight sessions abandoned, not inflated).

---

## Check-In Flow

### Section Keys (localStorage field names)
```
Morning:  sleep, morning_start
Evening:  med_checkin, health_lifestyle, end_of_day
```

### Section Display Names
| Key | Display Label |
|-----|--------------|
| sleep | 🌙 Sleep |
| morning_start | ☀️ Morning Start |
| med_checkin | 🩺 Daily Tracker |
| health_lifestyle | 🌿 Health & Lifestyle |
| end_of_day | 🌅 End of Day |

---

## Medications Being Tracked
- **Sertraline 200mg** — mood, anhedonia, emotional regulation, numbness
- **Adderall 20mg x2** — focus, initiation, staying on task, irritability, caffeine interaction
- **Wellbutrin 150mg** — mood, anhedonia, brain sharpness
- **Buspar 10mg x2** — background anxiety, worry loops
- **Trazodone 50–100mg** — sleep onset, sleep quality, morning grogginess

---

## History Tab Sub-tabs
| Sub-tab | Contents |
|---------|----------|
| 📋 Check-ins | Daily check-in entries |
| 💊 Pulse Checks | Quick pulse check log |
| ✅ Tasks | Completed tasks, weekly wins |
| 💰 Budget | Spending history |
| 📺 Media | Media log |
| ⚠️ Patterns | Auto-flagged trends + bar charts |
| 🩺 Doctor Prep | Screenshot-ready prescriber summary |
| 💬 Quotes | All daily quotes |
| 📚 GMAT | Study sessions + practice scores |
| 📊 Summary | AI Monthly Summary (Anthropic API) |

---

## Save Pattern (v15.1)

```js
const hasLoaded = useRef(false);

useEffect(() => {
  const stored = load();
  // load all state from stored...
  hasLoaded.current = true;
}, []);

useEffect(() => {
  if (!hasLoaded.current) return;
  save({
    entries, budget: budgetData, tasks: taskData, ideas: ideasData,
    growthLogs, wins, pulseChecks, savedMorning, savedEvening,
    timeData, scriptureStreak,
  });
}, [entries, budgetData, taskData, ideasData, growthLogs, wins,
    pulseChecks, savedMorning, savedEvening, timeData, scriptureStreak]);

// Draft auto-save (separate intentional effect)
useEffect(() => {
  if (Object.keys(formData).length > 0 && !savedMorning && !savedEvening) {
    saveDraft({ formData, sectionIdx, checkinMode, date: new Date().toDateString() });
  }
}, [formData, sectionIdx, checkinMode]);
```

---

## About Chase

- ADHD and OCD — themes: health/body, certainty/checking, intrusive thoughts
- Job searching — enterprise sales, Visa/payments background (Authorize.Net, CyberSource)
- Target roles: Implementation Specialist, Customer Success Manager, inbound AE
- Remote only (cannot drive due to vision impairment)
- Managing financial stress with family and young kids
- Studying for GMAT, AI, and PMP — all tracked in Growth tab
- Faith matters — LDS context, Book of Mormon + Come Follow Me tracked daily
- Primary device: iPhone, Safari
- Brand new to coding — plain English always

---

## File Delivery Format

**With Claude Code:** Files are edited directly — no move commands needed. Claude Code knows the full path to every file.

**Without Claude Code (chat interface):**

| File | Move command |
|------|-------------|
| `App.jsx` | `mv ~/Downloads/App.jsx ~/Documents/apps/wellness-tracker/src/App.jsx` |
| `ErrorBoundary.jsx` | `mv ~/Downloads/ErrorBoundary.jsx ~/Documents/apps/wellness-tracker/src/ErrorBoundary.jsx` |
| `tabs/TrackerTab.jsx` | `mv ~/Downloads/TrackerTab.jsx ~/Documents/apps/wellness-tracker/src/tabs/TrackerTab.jsx` |
| `tabs/TasksTab.jsx` | `mv ~/Downloads/TasksTab.jsx ~/Documents/apps/wellness-tracker/src/tabs/TasksTab.jsx` |
| `tabs/TimeTrackerTab.jsx` | `mv ~/Downloads/TimeTrackerTab.jsx ~/Documents/apps/wellness-tracker/src/tabs/TimeTrackerTab.jsx` |
| `tabs/BudgetTab.jsx` | `mv ~/Downloads/BudgetTab.jsx ~/Documents/apps/wellness-tracker/src/tabs/BudgetTab.jsx` |
| `tabs/GrowthTab.jsx` | `mv ~/Downloads/GrowthTab.jsx ~/Documents/apps/wellness-tracker/src/tabs/GrowthTab.jsx` |
| `tabs/HistoryTab.jsx` | `mv ~/Downloads/HistoryTab.jsx ~/Documents/apps/wellness-tracker/src/tabs/HistoryTab.jsx` |
| `theme.js` | `mv ~/Downloads/theme.js ~/Documents/apps/wellness-tracker/src/theme.js` |
| `ui.jsx` | `mv ~/Downloads/ui.jsx ~/Documents/apps/wellness-tracker/src/ui.jsx` |
| `PROJECT_INSTRUCTIONS.md` | `mv ~/Downloads/PROJECT_INSTRUCTIONS.md ~/Documents/apps/wellness-tracker/PROJECT_INSTRUCTIONS.md` |
| `CHANGELOG.md` | `mv ~/Downloads/CHANGELOG.md ~/Documents/apps/wellness-tracker/CHANGELOG.md` |

```bash
cd ~/Documents/apps/wellness-tracker
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN description" && git push
git tag vN && git push origin vN
```
