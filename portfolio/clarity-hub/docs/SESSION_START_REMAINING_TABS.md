# Clarity Hub — Session Start: Remaining Tabs

> Paste this into a new Claude Code chat to pick up exactly where we left off.

## Context

**App:** Clarity Hub — a single React CRA app that consolidates 7 iOS Clarity apps into one web dashboard.

**Live URL:** https://clarity-hub-lilac.vercel.app  
**Vercel project:** `clarity-hub` (team: `iamchasewhittakers-projects`)  
**Supabase project:** `unqtnnxlltiadzbqpyhh` (shared with all portfolio apps)  
**App dir:** `portfolio/clarity-hub/` (repo root: `~/Developer/chase`)

## What's Already Built

| Tab | File | Status |
|-----|------|--------|
| YNAB | `src/tabs/YnabTab.jsx` | ✅ Full — setup flow + dashboard + fund modal |
| Time | `src/tabs/TimeTab.jsx` | ✅ Full — timer + manual sessions + scripture streak |
| Budget | `src/tabs/BudgetTab.jsx` | ✅ Full — dual scenarios + wants tracker |
| Check-in | `src/tabs/CheckinTab.jsx` | ❌ Placeholder |
| Triage | `src/tabs/TriageTab.jsx` | ❌ Placeholder |
| Growth | `src/tabs/GrowthTab.jsx` | ❌ Placeholder |
| Tasks | `src/tabs/RollerTaskTab.jsx` | ❌ Placeholder |
| Settings | `src/tabs/SettingsTab.jsx` | 🟡 Partial — YNAB token + sign out only |

**Also pending:**
- Add `clarity-hub` to CI workflow: `.github/workflows/portfolio-web-build.yml`
- Update `portfolio/clarity-hub/HANDOFF.md` (currently stale)

## Your First Task

Build all 4 remaining tabs + enhance Settings + add to CI, then `vercel --prod`.

Read these files before writing any code:
- `portfolio/clarity-hub/src/theme.js` — T palette, blob defaults, fmtCents/fmtDollars/fmtDuration/computeStreak
- `portfolio/clarity-hub/src/App.jsx` — blob state pattern (each tab gets `blob` + `setBlob` props)
- One already-built tab for reference: `portfolio/clarity-hub/src/tabs/TimeTab.jsx`

---

## Hard Rules (violations cause CI failures)

1. **Inline styles only** — no CSS files, no Tailwind, no component libraries
2. **T palette** — every color from `import { T } from "../theme"` 
3. **No unused variables** — `process.env.CI=true` on Vercel makes ESLint warnings into errors
4. **No TypeScript** — plain JS only
5. **No `useRef` unless actually used** — caused a build failure in a prior session
6. **Blob pattern** — tabs receive `blob` + `setBlob` as props; all state lives in App.jsx; tabs never have their own localStorage or persistent state

---

## Blob Shapes (from `src/theme.js`)

```js
// Check-in
DEFAULT_CHECKIN = {
  entries: [],          // CheckinEntry[]
  pulseChecks: [],      // PulseCheck[]
  savedMorning: null,   // "yyyy-MM-dd" of last saved morning
  savedEvening: null,   // "yyyy-MM-dd" of last saved evening
  syncAt: 0
}

// Triage
DEFAULT_TRIAGE = {
  capacity: 0,          // 0–10 int
  capacityDate: "",     // "yyyy-MM-dd"
  tasks: [],            // TriageTask[]
  ideas: [],            // TriageIdea[]
  wins: []              // TriageWin[]
}

// Growth
DEFAULT_GROWTH = { sessions: [] }  // GrowthSessionEntry[]

// RollerTask
DEFAULT_ROLLERTASK = { schemaVersion: 2, cash: 0, tasks: [], ledger: [] }
```

---

## Check-in Tab — Data Shapes & Features

**iOS source of truth:** `portfolio/clarity-checkin-ios/ClarityCheckin/`

```js
// CheckinEntry
{ id: date, date: "yyyy-MM-dd", morning: MorningData|null, evening: EveningData|null }

// MorningData
{ sleepOnset: 1-10, sleepQuality: 1-10, morningReadiness: 1-10, notes: "", savedAt: "" }

// EveningData
{ medsChecked: [], focus: 1-10, mood: 1-10, adhdSymptoms: "Yes"|"Mild"|"No"|null,
  sideEffects: null, exercise: null, eating: null, stress: null, faith: null, caffeine: null,
  dayQuality: 1-10, spendingNotes: "", tomorrowFocus: "", savedAt: "" }

// PulseCheck
{ id: uuid, mood: 1-10, note: "", date: "yyyy-MM-dd", timestamp: ms }
```

**Features to build:**
- **Morning form** (today only): sleep onset, sleep quality, morning readiness (all sliders 1–10), notes text area, Save button — saves to `entries[today].morning`
- **Evening form** (today only): meds checkbox list (placeholder: ["Adderall", "Vyvanse"]), focus/mood/dayQuality sliders, ADHD symptoms select, tomorrowFocus text, spendingNotes, Save
- **Pulse check** (anytime): quick mood slider + note → push to `pulseChecks` array; show last 3 pulses
- **History list**: last 7 days, each row shows date + morning readiness + evening mood + streak dots

**Today helpers:** use `today()` and `yesterday()` from `../theme`

---

## Triage Tab — Data Shapes & Features

**iOS source of truth:** `portfolio/clarity-triage-ios/ClarityTriage/`

```js
// TriageTask
{ id: uuid, title: "", category: "Job Search"|"Family"|"Health"|"Finance"|"Other",
  size: "Small"|"Medium"|"Large", isComplete: false, createdDate: "yyyy-MM-dd" }

// TriageIdea
{ id: uuid, title: "", stage: 0-3, note: "", createdDate: "yyyy-MM-dd" }
// stage: 0=Raw, 1=Exploring, 2=Committed, 3=Shipped

// TriageWin
{ id: uuid, category: "Job Search"|"Family"|"Health"|"Finance"|"Other",
  note: "", date: "yyyy-MM-dd", timestamp: ms }
```

**Features to build:**
- **Capacity bar**: daily 0–10 slider, save to `capacity` + `capacityDate = today()`. Show as a visual bar (color: green ≥7, yellow 4–6, red ≤3). Reset each day (if `capacityDate !== today`, show as unset)
- **Tasks section**: add task (title + category + size), check off, delete. Show incomplete first. Filter by category tabs.
- **Ideas pipeline**: add idea (title + note), bump stage (0→1→2→3), delete. Show grouped by stage.
- **Wins log**: add win (category + note), show last 10, delete.
- All 3 sections are collapsible (open/closed toggle)

---

## Growth Tab — Data Shapes & Features

**iOS source of truth:** `portfolio/clarity-growth-ios/ClarityGrowth/`

```js
// GrowthSessionEntry
{ id: uuid, area: areaId, mins: int, note: "", milestones: [], backgrounds: [],
  date: "yyyy-MM-dd", timestampMs: ms }
```

**7 Growth Areas (fixed list):**
```js
const GROWTH_AREAS = [
  { id: "faith",    label: "Faith",        emoji: "🙏" },
  { id: "family",   label: "Family",       emoji: "👨‍👩‍👧‍👦" },
  { id: "fitness",  label: "Fitness",      emoji: "💪" },
  { id: "finance",  label: "Finance",      emoji: "💰" },
  { id: "career",   label: "Career",       emoji: "🎯" },
  { id: "learning", label: "Learning",     emoji: "📚" },
  { id: "creative", label: "Creative",     emoji: "🎨" },
];
```

**Features to build:**
- **Area grid** (2-col): each card shows emoji + label + today's streak (use `computeStreak()` from theme) + total minutes + "Log" button
- **Log session modal**: select area (pre-selected if tapped from card), duration (15/30/45/60/Custom), note, optional milestone text → push to `sessions`
- **History list**: last 20 sessions sorted newest-first, group by date, show area emoji + label + mins + note, delete button
- **Weekly summary bar**: 7 day bars (Mon–Sun), height proportional to minutes that day across all areas

---

## RollerTask Tab — Data Shapes & Features

**Blob shape:**
```js
// Task
{ id: uuid, title: "", category: "Job Search"|"Family"|"Health"|"Finance"|"Other",
  points: 10|25|50|100, isComplete: false, createdDate: "yyyy-MM-dd" }

// LedgerEntry
{ id: uuid, label: "", points: int, date: "yyyy-MM-dd", timestampMs: ms }
```

**Features to build:**
- **Cash display**: big header showing `blob.cash` points (styled like a score)
- **Tasks list**: add task (title + category + points value). Tap to complete → add points to `cash`, push to `ledger`, mark `isComplete = true`. Delete.
- **Ledger**: last 15 entries showing what was earned, newest first
- **Reset button**: clears completed tasks (keeps active ones), resets `cash = 0`, clears `ledger` — confirm before reset

Keep it fun/game-like — this is a tycoon-style motivator app.

---

## Settings Tab — Enhance to Full

Current: YNAB token update + Re-run YNAB Setup + Sign Out  
**Add these sections:**

1. **Account** — show signed-in email (from Supabase `auth.getUser()`), Sign Out button  
2. **YNAB** — token (masked), Update Token, Re-run YNAB Setup (already there)
3. **Data** — "Last synced" timestamp (read `blob._syncAt` from each blob, show most recent), Export button (downloads all blobs as JSON)
4. **App info** — version (hardcode "v0.1"), storage keys list

Props passed from App.jsx:
```js
<SettingsTab signOut={signOut} ynab={ynab} setYnab={setYnab}
  checkin={checkin} triage={triage} time={time} budget={budget} growth={growth} rollertask={rollertask} />
```

---

## CI Workflow

Add to `.github/workflows/portfolio-web-build.yml` — copy the `clarity-command` job pattern:

```yaml
clarity-hub:
  runs-on: ubuntu-latest
  defaults:
    run:
      working-directory: portfolio/clarity-hub
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: npm
        cache-dependency-path: portfolio/clarity-hub/package-lock.json
    - run: npm ci
    - run: npm run build
```

Also add `"portfolio/clarity-hub/**"` to the `paths:` filter under both `push:` and `pull_request:`.

---

## Deploy

After all tabs pass `npm run build`:

```bash
cd portfolio/clarity-hub
vercel --prod
```

Env vars are already set on Vercel. No manual credential entry needed.

Or use the `/deploy` slash command.

---

## Key File Map

| File | Purpose |
|------|---------|
| `src/theme.js` | T palette, defaults, fmtCents/fmtDollars/fmtDuration/computeStreak, today/yesterday |
| `src/App.jsx` | All blob state, auth gate, NavTabs, save/push effects |
| `src/tabs/TimeTab.jsx` | Reference for timer pattern + blob update pattern |
| `src/tabs/BudgetTab.jsx` | Reference for form + cents math pattern |
| `portfolio/clarity-checkin-ios/ClarityCheckin/Models/CheckinBlob.swift` | iOS source of truth |
| `portfolio/clarity-triage-ios/ClarityTriage/Models/TriageBlob.swift` | iOS source of truth |
| `portfolio/clarity-growth-ios/ClarityGrowth/Models/GrowthBlob.swift` | iOS source of truth |
