# Growth Tracker — Project Instructions

> ⚠️ RETIRED — 2026-03-23
> This app has been merged into the Wellness Tracker as the 🌱 Growth tab (v15).
> All 7 areas (gmat, job, ai, pm, claude, bom, cfm) now live in Wellness under `growthLogs` in `chase_wellness_v1`.
> Do not start new development sessions on this app.
> For all future Growth tracking work, use the Wellness Tracker project instead.
> Active app: https://wellness-tracker.vercel.app

---

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
cd "$(git rev-parse --show-toplevel)/portfolio/archive/growth-tracker"
bash "$(git rev-parse --show-toplevel)/portfolio/app-hub/sync.sh"
```

### Audit results in sync
Add this to the END of `audit.sh`:
```bash
bash audit.sh 2>&1 | tee "$(git rev-parse --show-toplevel)/portfolio/app-hub/last-audit-growth-tracker.txt"
```

---

## What This App Was

~~A personal habit and growth tracker. Tracks daily streaks, goals, and progress across multiple areas of life.~~

**Status:** RETIRED — merged into Wellness Tracker v15 (2026-03-23)
**Last deployed version:** v6
**Live URL (archived):** `https://growth-tracker-rouge.vercel.app`
**GitHub repo:** `github.com/iamchasewhittaker/growth-tracker` (private, no further development)
**Local folder:** `portfolio/archive/growth-tracker` (monorepo root: `~/Developer/chase`)
**Replacement:** Wellness Tracker Growth tab — `https://wellness-tracker.vercel.app`

---

## Deploy Workflow

```bash
ROOT="$(git rev-parse --show-toplevel)/portfolio/archive/growth-tracker"
mv ~/Downloads/App.jsx "$ROOT/src/App.jsx"
mv ~/Downloads/PROJECT_INSTRUCTIONS.md "$ROOT/PROJECT_INSTRUCTIONS.md"
mv ~/Downloads/CHANGELOG.md "$ROOT/CHANGELOG.md"

cd "$ROOT"
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN what changed" && git push
git tag vN && git push origin vN
```

---

## Tech Stack

- **Framework:** React (single JSX file — `src/App.jsx`)
- **Deployment:** Vercel — connected to GitHub, auto-deploys on push
- **Storage:** `localStorage` only — key: `chase_growth_v1`
- **Theme:** Dark mode only — locked, never change
- **Primary device:** iPhone, Safari, PWA

---

## Critical Rules

| Rule | Why |
|------|-----|
| **Never change localStorage key** `chase_growth_v1` | All data permanently lost |
| **Never remove `hasLoaded` ref** | Prevents save firing before load |
| **Never remove `getStreak` or `hadToday` functions** | Core to all streak display — removing breaks the app |
| **Always use `window.confirm()` not bare `confirm()`** | ESLint blocks bare confirm() — build fails |
| **Never delete `vercel.json`** | Breaks Safari cache busting |
| **Always update `CHANGELOG.md` on every deploy** | One entry per version |
| **Always run `bash audit.sh` before `bash pre-deploy.sh`** | Audit first, then pre-deploy |
| **Always verify brace balance before delivering** | Imbalanced braces cause silent JS failures |
| **Never rewrite sections that aren't changing** | Surgical edits only |
| **Global reset block must be at top of App.jsx** | Prevents white border on all browsers |

---

## Save Pattern

```js
const hasLoaded = useRef(false);

useEffect(() => {
  const stored = load();
  setData({ ...defaultData, ...stored });
  hasLoaded.current = true;
}, []);

useEffect(() => {
  if (!hasLoaded.current) return;
  save(data);
}, [data]);
```

---

## Global Reset (must be at top of App.jsx)

```js
const _style = document.createElement("style");
_style.textContent = "html,body{margin:0;padding:0;background:#0d0d0f;}*{box-sizing:border-box;}";
document.head.appendChild(_style);
```

---

## File Delivery Format

| File | Move command |
|------|-------------|
| `App.jsx` | `mv ~/Downloads/App.jsx "$(git rev-parse --show-toplevel)/portfolio/archive/growth-tracker/src/App.jsx"` |
| `PROJECT_INSTRUCTIONS.md` | `mv ~/Downloads/PROJECT_INSTRUCTIONS.md "$(git rev-parse --show-toplevel)/portfolio/archive/growth-tracker/PROJECT_INSTRUCTIONS.md"` |
| `CHANGELOG.md` | `mv ~/Downloads/CHANGELOG.md "$(git rev-parse --show-toplevel)/portfolio/archive/growth-tracker/CHANGELOG.md"` |

**CHANGELOG rule — always write the full file, not just the new entry.**

---

## About Chase

- Brand new to coding — always explain in plain English first
- ADHD and OCD — keep responses clear and structured, one step at a time
- All apps dark mode — bad eyes
- Primary device: iPhone, Safari
