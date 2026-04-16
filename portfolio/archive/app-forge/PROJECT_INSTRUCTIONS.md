# App Forge — Project Instructions
> This lives in the Claude Project for App Forge.
> Reference MASTER_PROJECT_FRAMEWORK.md for standards that apply to all projects.

---

## Audit findings — 2026-04-15

**Compliance score:** 100/100
**Status assessment:** Stalled in Build — archive candidate

**Findings:**
- High compliance score (all 10 standard files present) but functionally overlaps with MVP Playbook HTML minisite and the audit framework itself.
- Entire app is a single 1,075-line App.jsx monolith.
- Claims Step 4 Build (stalled) — honest assessment.
- No Supabase, no live users, no active development.
- Missing .env.example and LICENSE.
- APP_SNAPSHOT_DEFAULTS are outdated (references v15.9 for wellness, v8.2 for job search — both have shipped newer).

**Recommended actions:**
- [ ] Archive — this app's purpose is now served by my-mvp-playbook.html + audit framework
- [ ] If keeping: refactor monolith, update snapshot defaults, wire Supabase
- [ ] Write Step 6 (Learn) retro note before archiving

**See full audit:** ~/Developer/audits/2026-04-15-audit-report.md

---

## How to Start Every Session

**After every deploy, the sync script runs automatically and copies a summary to your clipboard. Just paste it into Claude — no template needed.**

If starting a session without a recent deploy, upload:
- `App.jsx`
- `PROJECT_INSTRUCTIONS.md`

And say what you want to change.

---

## App Hub — Automatic Sync (set up 2026-03-22)

After every `git push`, a `post-push` hook can run `bash "$(git rev-parse --show-toplevel)/portfolio/app-hub/sync.sh"` and:
- Reads App.jsx line count
- Reads current git tag (version)
- Extracts new CHANGELOG entries since last sync
- Reads last audit results
- Copies a full summary to clipboard

**You just paste that summary into Claude. Claude handles the rest.**

### If sync doesn't fire
Run it manually from inside the app folder:
```bash
cd portfolio/app-forge
bash "$(git rev-parse --show-toplevel)/portfolio/app-hub/sync.sh"
```

### Audit results in sync
Add this to the END of `audit.sh`:
```bash
bash audit.sh 2>&1 | tee "$(git rev-parse --show-toplevel)/portfolio/app-hub/last-audit-app-forge.txt"
```

---

## The "I Updated an App" Workflow

When you ship a new version of ANY app (Wellness, Growth, Job Search HQ):
1. Deploy normally — sync script fires automatically after `git push`
2. Paste the clipboard summary into Claude
3. Claude suggests lessons, updates docs, updates memory
4. No manual App Forge update needed

---

## What This App Is

App Forge is Chase's central hub for all apps. It:
- Audits App.jsx files against framework rules (Audit tab)
- Tracks lessons learned across all builds (Lessons tab)
- Provides a framework rules reference + glossary (Learn tab)
- Manages improvement ideas per app (Ideas tab)
- Tracks current version and state of every app (Apps tab)

**Live URL:** `https://app-forge-fawn.vercel.app`
**GitHub repo:** `github.com/iamchasewhittaker/app-forge` (private)
**Local folder:** `portfolio/app-forge`
**Current file:** `src/App.jsx` (~1065 lines, single file)
**Current git tag:** `v7`

---

## Deploy Workflow (for App Forge code changes only)

**With Claude Code (preferred):** Claude edits files directly — no Downloads step needed.
```bash
cd portfolio/app-forge
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN description" && git push
git tag vN && git push origin vN
```

**Without Claude Code (chat interface):**
```bash
mv ~/Downloads/App.jsx portfolio/app-forge/src/App.jsx
mv ~/Downloads/PROJECT_INSTRUCTIONS.md portfolio/app-forge/PROJECT_INSTRUCTIONS.md
mv ~/Downloads/CHANGELOG.md portfolio/app-forge/CHANGELOG.md

cd portfolio/app-forge
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN description" && git push
git tag vN && git push origin vN
```

---

## Tech Stack

- **Framework:** React (single JSX file — `src/App.jsx`)
- **Deployment:** Vercel — connected to GitHub, auto-deploys on push
- **Storage:** `localStorage` only — key: `chase_forge_v1`
- **Theme:** Dark mode only — `#0d0d0f` background, locked
- **Primary use:** Mac browser at `app-forge-fawn.vercel.app`
- **Cost:** Zero — no API calls, no backend

---

## Critical Rules

| Rule | Why |
|------|-----|
| **Never change localStorage key** `chase_forge_v1` | All data permanently lost |
| **Never remove `hasLoaded` ref** | Prevents save firing before load |
| **Always use `window.confirm()` not bare `confirm()`** | ESLint blocks bare confirm() — build fails |
| **Never add `reportWebVitals` or `logo.svg` imports** | Files deleted — build fails |
| **Never delete `vercel.json`** | Breaks Safari cache busting |
| **Always update `CHANGELOG.md` on every deploy** | One entry per version |
| **Always `cd` into app folder before running scripts** | Scripts check current directory's App.jsx |
| **Never rewrite sections that aren't changing** | Surgical edits only |
| **Never rename `detectApp` or `chase_forge_v1`** | audit.sh detection depends on these |
| **Always run `bash audit.sh` before `bash pre-deploy.sh`** | Audit first, then pre-deploy |
| **App Forge must be detected FIRST in audit.sh** | Its code references other apps' marker strings |
| **Deploy App Forge only when code changes** | Don't deploy just to update version numbers in Apps tab |

---

## App Structure — 5 Tabs

| Tab | Color | What it does |
|-----|-------|-------------|
| Audit | `#9F8AE8` purple | Paste App.jsx → auto-detect → run checks → score /100 → auto-suggest lessons |
| Lessons | `#1D9E75` teal | Log lessons, tag by app + type, pin, filter |
| Learn | `#BA7517` amber | Framework rules + glossary, beginner/expert toggle |
| Ideas | `#D85A30` coral | Track improvements, priority + status, ship → auto-logs lesson |
| Apps | `#378ADD` blue | One card per app — version, changelog summary, key facts |

---

## Data Model

```js
// localStorage key: chase_forge_v1
{
  lessons: [{ id, date, title, body, app, type, pinned }],
  ideas: [{ id, date, title, body, app, priority, status }],
  auditHistory: [{ id, date, appKey, appName, score, passed, total, failedChecks }],
  appSnapshots: {
    wellness:  { version, lastUpdated, summary, liveUrl, storageKey, localFolder, notes },
    growth:    { version, lastUpdated, summary, liveUrl, storageKey, localFolder, notes },
    jobsearch: { version, lastUpdated, summary, liveUrl, storageKey, localFolder, notes },
    appforge:  { version, lastUpdated, summary, liveUrl, storageKey, localFolder, notes },
  },
  settings: { beginnerMode: boolean, lastAuditedApp: string|null }
}
```

---

## Audit Engine

### App Detection
`detectApp(code)` scores each app by marker matches. Needs 2+ to confirm.
Order: **App Forge → Wellness → Growth → Job Search HQ → Unknown**

> **Note:** Wellness Tracker is now split into multiple files (`App.jsx` + `src/tabs/`). When auditing Wellness, paste `App.jsx` (the thin shell) — it still contains `chase_wellness_v1`, `hasLoaded`, and the unified save `useEffect`. The section key checks (`morning_start`, `end_of_day`) now live in `TrackerTab.jsx` — audit that file separately if needed.

### Checks Run Per App

**All apps (8 checks):**
localStorage key · hasLoaded ref · brace balance · window.confirm() · no reportWebVitals · no logo.svg · single save useEffect · vercel.json reminder

**Job Search HQ:** + correct Claude model string
**Growth Tracker:** + getStreak and hadToday functions present
**Wellness Tracker:** + morning_start and end_of_day section keys intact (in TrackerTab.jsx as of v15.6)

---

## Known Fixes Applied (don't revert)

| Fix | What happened | Solution |
|-----|--------------|----------|
| `App.js` conflict | create-react-app default file alongside App.jsx | `rm src/App.js` |
| Duplicate CSS `borderBottom` | Appeared twice in tab style object | Removed duplicate |
| vercel.json false positive | Couldn't verify separate file from App.jsx | Changed to always-pass reminder |
| Pre-deploy false positives | Script flagged string literals as real violations | Used `grep -E` to match imports only |
| Wrong folder for pre-deploy | Ran from job-search-hq, checked wrong App.jsx | Always `cd` into app first |
| audit.sh detected App Forge as Wellness | App Forge code references morning_start in audit strings | Check App Forge FIRST |
| confirm() false positive in audit.sh | String description triggered bare confirm() check | Added grep filters |
| White border around app | No html/body margin/padding reset | Global style reset injected at top of App.jsx |

---

## Save Pattern

```js
const hasLoaded = useRef(false);

useEffect(() => {
  const stored = load();
  setData({ ...defaultData, ...stored, appSnapshots: { ...(stored.appSnapshots || {}) }, settings: { ...defaultData.settings, ...(stored.settings || {}) } });
  hasLoaded.current = true;
}, []);

useEffect(() => {
  if (!hasLoaded.current) return;
  save(data);
}, [data]);
```

---

## About Chase

- Brand new to coding — always explain in plain English first
- ADHD and OCD — keep responses clear and structured, one step at a time
- All apps dark mode — bad eyes
- Primary device: Mac browser for App Forge, iPhone for other apps
- No API costs — App Forge uses zero external APIs

---

## File Delivery Format

| File | Move command |
|------|-------------|
| `App.jsx` | `mv ~/Downloads/App.jsx portfolio/app-forge/src/App.jsx` |
| `PROJECT_INSTRUCTIONS.md` | `mv ~/Downloads/PROJECT_INSTRUCTIONS.md portfolio/app-forge/PROJECT_INSTRUCTIONS.md` |
| `CHANGELOG.md` | `mv ~/Downloads/CHANGELOG.md portfolio/app-forge/CHANGELOG.md` |

**CHANGELOG rule — always write the full file, not just the new entry.**

---

## Lessons Logged (v1–v7)

1. Always delete src/App.js after create-react-app — Bug fix — All apps
2. Pre-deploy script had false positives on string literals — Bug fix — App Forge
3. Always cd into app folder before running pre-deploy.sh — Pattern learned — All apps
4. Duplicate CSS borderBottom key causes ESLint warning — Bug fix — App Forge
5. vercel.json check can't be verified from App.jsx alone — Architecture — App Forge
6. Deploy to Vercel via npx vercel in Terminal — Pattern learned — All apps
7. audit.sh detection must check App Forge first — Bug fix — App Forge
8. confirm() in string literals triggers false positive in audit.sh — Bug fix — App Forge
9. Don't deploy App Forge just to update version data — Architecture — App Forge
10. Set up app-hub sync — git hook fires sync.sh after every push, copies summary to clipboard — Architecture — All apps
11. Split Wellness Tracker monolith (5,485 lines → App.jsx thin shell + 6 tab files + theme.js + ui.jsx) — Architecture — Wellness Tracker. State stays in App.jsx, tabs receive props. Build passes clean. Split at ~2000 lines is a good threshold.
12. .claude/launch.json registers dev servers for Claude Code — enables preview_start, screenshot, console/network inspection without running Bash servers — Architecture — All apps

---

## Future Ideas

- Export audit report as text file
- Cross-app pattern view in Lessons tab
- Version history diff — compare two audit scores over time
- Add new app profile when 5th app is built
- Notify when idea has been "Planned" for 7+ days
- End-of-session lesson prompt — free, no API, just a simple text field
