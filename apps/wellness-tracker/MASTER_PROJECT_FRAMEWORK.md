# Chase's App Development Framework
> This is the master document. Every project follows these standards.
> Last updated: 2026-04-03 — v15.10 / v8.3: OTP auth, Magic link `{{ .Token }}` docs, `.claude/` hygiene, `.env.example` notes

---

## The Three Active Projects

| Project | Repo | Local Folder | Storage Key | Live URL | Current Version |
|---------|------|-------------|-------------|----------|----------------|
| Wellness Tracker | wellnes-tracker | ~/Documents/apps/wellness-tracker | chase_wellness_v1 | wellnes-tracker.vercel.app | v15.10 (email OTP auth for iOS PWA) |
| Job Search HQ | job-search-hq | ~/Documents/apps/job-search-hq | chase_job_search_v1 | job-search-hq.vercel.app | v8.3 (OTP login + `.claude/launch.json`) |
| App Forge | app-forge | ~/Documents/apps/app-forge | chase_forge_v1 | app-forge-fawn.vercel.app | v7 |

> **Growth Tracker retired 2026-03-23** — merged into Wellness Tracker as the 🌱 Growth tab. Storage key `chase_growth_v1` no longer in active use.

---

## App Hub — Automatic Session Sync (set up 2026-03-22)

After every `git push`, `~/Documents/apps/app-hub/sync.sh` fires automatically and:
- Reads App.jsx line count
- Reads current git tag (version)
- Extracts new CHANGELOG entries since last sync
- Reads last audit results
- Copies a full summary to clipboard

**You just paste that summary into Claude. Claude handles the rest — no manual doc updates needed.**

### If sync doesn't fire
Run it manually from inside the app folder:
```bash
cd ~/Documents/apps/[app-name]
bash ~/Documents/apps/app-hub/sync.sh
```

### App Hub folder
```
~/Documents/apps/app-hub/
  sync.sh          ← main script, runs after every git push
  last-sync.json   ← tracks last synced version per app
  README.md
  last-audit-*.txt ← saved audit results per app (written by audit.sh)
```

---

## How to Start Every Session

**After every deploy, just paste the clipboard summary into Claude. That's it.**

If starting without a recent deploy, upload:
- `App.jsx`
- `PROJECT_INSTRUCTIONS.md`

And say what you want to change.

---

## The Standard Project Files

| File | Purpose |
|------|---------|
| `PROJECT_INSTRUCTIONS.md` | What Claude reads at the start of every session |
| `CHANGELOG.md` | One entry per version, every deploy — Claude always delivers the full file |
| `MASTER_PROJECT_FRAMEWORK.md` | This file — lives in every repo, identical copy in all folders |
| `audit.sh` | Run BEFORE pre-deploy — checks framework rules, auto-copies results to clipboard |
| `pre-deploy.sh` | Run after audit passes — final checks before push |
| `.claude/launch.json` | Dev server registry — Claude Code uses this to start/inspect servers |

---

## The Standard Stack

Every project uses the same stack. No exceptions unless documented in project instructions.

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React (single `src/App.jsx`) | One file = easy edits, no build complexity |
| Deployment | Vercel via GitHub | Auto-deploys on git push, free, fast |
| Version control | GitHub (private repos) under `iamchasewhittaker` | Tagged releases, rollback capability |
| Storage | `localStorage` only | No backend, no accounts, works offline |
| Device | iPhone, Safari, PWA + Mac browser | Add to Home Screen = native feel |
| Cache busting | `vercel.json` + meta tags | Safari PWA cache handled at server level |

---

## The Standard File Structure

```
apps/your-app/
  src/
    App.jsx                    ← entire app (single file for new/small apps)
    index.js                   ← minimal version only
    tabs/                      ← optional: extract tab components here when App.jsx exceeds ~2000 lines
  public/
    index.html                 ← no-cache meta tags + PWA meta tags
  .claude/
    launch.json                ← dev server config for Claude Code (runtimeExecutable, runtimeArgs, port)
  vercel.json                  ← cache headers (NEVER delete)
  CHANGELOG.md                 ← version history (update every deploy)
  PROJECT_INSTRUCTIONS.md      ← Claude reads this each session
  MASTER_PROJECT_FRAMEWORK.md  ← this file
  audit.sh                     ← run BEFORE pre-deploy
  pre-deploy.sh                ← run after audit passes
  package.json
  .gitignore                   ← must include .vercel
```

> **Wellness Tracker exception:** App.jsx is now a thin shell (~349 lines). Tab logic lives in `src/tabs/`. All state still lives in App.jsx and is passed down as props — the save pattern and localStorage key are unchanged.

---

## The Standard Deploy Workflow

**With Claude Code (preferred):** Claude edits files directly — no Downloads step needed.
```bash
cd ~/Documents/apps/your-app
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN what changed" && git push
git tag vN && git push origin vN
```

**Without Claude Code (chat interface):**
```bash
mv ~/Downloads/App.jsx ~/Documents/apps/your-app/src/App.jsx
mv ~/Downloads/PROJECT_INSTRUCTIONS.md ~/Documents/apps/your-app/PROJECT_INSTRUCTIONS.md
mv ~/Downloads/CHANGELOG.md ~/Documents/apps/your-app/CHANGELOG.md

cd ~/Documents/apps/your-app
bash audit.sh
bash pre-deploy.sh
git add . && git commit -m "vN what changed" && git push
git tag vN && git push origin vN
# sync.sh fires automatically after git push → clipboard ready → paste into Claude
```

**Rule: Never run pre-deploy.sh until audit.sh shows 100/100.**

---

## What Claude Delivers Every Session

**With Claude Code:** Claude edits files in place. No Downloads or move commands needed.

**Without Claude Code (chat interface):** Claude delivers three files minimum:

| File | Command |
|------|---------|
| `App.jsx` | `mv ~/Downloads/App.jsx ~/Documents/apps/your-app/src/App.jsx` |
| `PROJECT_INSTRUCTIONS.md` | `mv ~/Downloads/PROJECT_INSTRUCTIONS.md ~/Documents/apps/your-app/PROJECT_INSTRUCTIONS.md` |
| `CHANGELOG.md` | `mv ~/Downloads/CHANGELOG.md ~/Documents/apps/your-app/CHANGELOG.md` |

**CHANGELOG rule — always write the full file, not just the new entry.**

---

## The Standard Global Reset (apply to every app)

Every App.jsx must have this at the top, before any components.

```js
// ── GLOBAL RESET ───────────────────────────────────────────────
const _style = document.createElement("style");
_style.textContent = "html,body{margin:0;padding:0;background:#0d0d0f;}*{box-sizing:border-box;}";
document.head.appendChild(_style);
```

---

## audit.sh — How It Works

- Auto-detects which app it's auditing from unique markers in the code
- Runs 8 universal checks + app-specific checks
- Scores /100 with pass/fail for each check
- Auto-copies results to clipboard

### Detection order (important — never change)
1. App Forge (checked first — its code references other apps' markers)
2. Wellness Tracker
3. Growth Tracker
4. Job Search HQ

---

## The Standard localStorage Pattern

```js
const STORE = "chase_appname_v1"; // NEVER CHANGE after first deploy
const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } };
const save = (d) => { try { localStorage.setItem(STORE, JSON.stringify(d)); } catch {} };

export default function App() {
  const hasLoaded = useRef(false);
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const stored = load();
    setData({ ...defaultData, ...stored });
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    save(data);
  }, [data]);
}
```

---

## Critical Rules — Apply to Every Project

| Rule | Why |
|------|-----|
| **Always run `bash audit.sh` before `bash pre-deploy.sh`** | Audit catches framework violations before deploy |
| **Delete `src/App.js` immediately after `create-react-app`** | Default file conflicts with App.jsx — causes build failure |
| **Never change the localStorage key after first deploy** | Permanently deletes all user data — no recovery |
| **Never remove `hasLoaded` ref** | Prevents save effect from overwriting data on startup |
| **Never split the unified save `useEffect`** | Multiple save effects cause race conditions |
| **Always use `window.confirm()` not bare `confirm()`** | ESLint blocks bare confirm() — Vercel build fails |
| **Never add `reportWebVitals` back** | File was deleted — importing it breaks the build |
| **Never add `logo.svg` imports** | File was deleted — importing it breaks the build |
| **Never delete `vercel.json`** | Safari PWA serves stale cached versions without it |
| **Always verify brace balance before delivering** | Imbalanced braces cause silent JS failures |
| **Never rewrite sections that aren't changing** | Every unnecessary rewrite is a regression risk |
| **Always update `CHANGELOG.md` on every deploy** | One entry per version, every time |
| **Use `mv` not `cp` when moving files from Downloads** | Keeps Downloads clean, git is your backup |
| **Single file default: everything in `src/App.jsx`** | One file = easy to edit, version, and hand to Claude. Split into `src/tabs/` only when App.jsx exceeds ~2000 lines. |
| **Global reset at top of every App.jsx** | Prevents white border on all browsers and PWA |
| **Deploy only when code changes** | Don't deploy just to update data or version numbers |

---

## Rollback to Any Version

```bash
cd ~/Documents/apps/your-app
git tag                          # see all versions
git checkout v3 -- src/App.jsx  # restore a version
git add . && git commit -m "rollback to v3" && git push
```

---

## About Chase

- ADHD and OCD — keep UI clear, low-friction, action-oriented
- Brand new to coding — plain English explanations always
- Job searching — enterprise sales, Visa/payments background
- Studying for GMAT (active)
- LDS faith, family with young kids
- Primary device: iPhone, Safari — also uses Mac browser

---

## New Project Setup — Step by Step

```bash
# 1. Create the React app
cd ~/Documents/apps
npx create-react-app your-app-name
cd your-app-name

# 2. CRITICAL — delete the default App.js immediately
rm src/App.js src/App.css src/App.test.js src/logo.svg src/reportWebVitals.js src/setupTests.js

# 3. Replace index.js with the minimal version
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
EOF

# 4. Create vercel.json
cat > vercel.json << 'EOF'
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
        { "key": "Pragma", "value": "no-cache" },
        { "key": "Expires", "value": "0" }
      ]
    }
  ]
}
EOF

# 5. Move audit.sh + pre-deploy.sh from Downloads
mv ~/Downloads/audit.sh audit.sh
mv ~/Downloads/pre-deploy.sh pre-deploy.sh

# 6. Move App.jsx from Claude download
mv ~/Downloads/App.jsx src/App.jsx

# 7. Wire up app-hub git hook
echo 'bash ~/Documents/apps/app-hub/sync.sh' >> .git/hooks/post-push
chmod +x .git/hooks/post-push

# 8. Test the build
npm run build

# 9. Push to GitHub
git add .
git commit -m "v1 initial build"
git branch -M main
git remote add origin https://github.com/iamchasewhittaker/your-app-name.git
git push -u origin main
git tag v1 && git push origin v1

# 10. Deploy to Vercel
npx vercel

# 11. Add to iPhone Home Screen
# Safari → Vercel URL → Share → Add to Home Screen
```

---

## New Project Checklist

- [ ] `create-react-app` scaffolded inside `~/Documents/apps/`
- [ ] `src/App.js` deleted immediately
- [ ] Default files cleaned
- [ ] `src/index.js` replaced with minimal version
- [ ] `public/index.html` replaced with standard PWA template
- [ ] `vercel.json` created in repo root
- [ ] `CHANGELOG.md` created with v1 entry
- [ ] `PROJECT_INSTRUCTIONS.md` created with app-hub section
- [ ] `audit.sh` and `pre-deploy.sh` moved from Downloads to repo root
- [ ] localStorage key chosen, documented, will never change
- [ ] Global reset block at top of App.jsx
- [ ] `hasLoaded` ref pattern in App.jsx
- [ ] Single unified save `useEffect` in App.jsx
- [ ] `npm run build` runs with zero errors
- [ ] GitHub repo created (private) under `iamchasewhittaker`
- [ ] v1 tagged in git
- [ ] Vercel deployed via `npx vercel` in Terminal
- [ ] GitHub connected to Vercel
- [ ] App opens correctly in Safari on iPhone
- [ ] Added to iPhone Home Screen
- [ ] app-hub git hook installed (post-push)
- [ ] Audited via `bash audit.sh` — score 100/100
- [ ] Audited in App Forge browser tool — score 100/100
- [ ] `MASTER_PROJECT_FRAMEWORK.md` copied to repo root
