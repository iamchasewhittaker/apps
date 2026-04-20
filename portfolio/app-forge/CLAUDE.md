# App Forge — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

**Project tracking:** [Linear — App Forge](https://linear.app/whittaker/project/app-forge-64221811d236)

## App Identity
- **Version:** v8.1
- **Storage key:** `chase_forge_v1`
- **URL:** local only (un-archived + Vercel URL retired 2026-04-20)
- **Entry:** `src/App.jsx` (monolith — not yet refactored)

## Purpose
App Forge is the portfolio management and audit tool. It tracks the state of all other apps, captures lessons learned, manages ideas, and runs code audits. Think of it as the "mission control" for the whole portfolio.

> *"For Reese. For Buzz. Forward — no excuses."*

## What This App Is

A portfolio management and audit workbench — paste any app's source code to run a structural health check, log lessons learned from bugs and deploys, track a prioritized idea backlog, and maintain per-app snapshot cards with version, URL, and storage key. The conceptual predecessor to Shipyard, still useful for ad-hoc auditing and idea capture.

## File Structure
```
src/
  App.jsx   ← single monolith (~1100 lines): all tabs, components, audit engine, defaults
public/
  index.html
  manifest.json
CHANGELOG.md
CLAUDE.md   ← this file
```

## Tabs
| Tab | Key | Purpose |
|-----|-----|---------|
| 🔍 Audit | `audit` | Paste app source code → detects which app it is → runs checks |
| 📚 Lessons | `lessons` | Log lessons learned from bugs, patterns, deploys |
| 💡 Ideas | `ideas` | Idea backlog with priority, status, effort, links |
| 📱 Apps | `apps` | App snapshot cards — version, summary, live URL, storage key |

## Key Data Structures

### `APP_SNAPSHOT_DEFAULTS`
Pre-filled defaults for each app snapshot. These are the **starting values** — once a user updates a card, their changes are stored in localStorage and merged on top. Update these defaults whenever a significant version ships.

```js
const APP_SNAPSHOT_DEFAULTS = {
  wellness:  { version, lastUpdated, summary, liveUrl, storageKey, localFolder, notes },
  growth:    { version, lastUpdated, summary, liveUrl, storageKey, localFolder, notes },
  jobsearch: { version, lastUpdated, summary, liveUrl, storageKey, localFolder, notes },
  appforge:  { version, lastUpdated, summary, liveUrl, storageKey, localFolder, notes },
};
```

**Current defaults (as of v8.1):**
| App | Version | Notes |
|-----|---------|-------|
| wellness | v15.9 | Supabase live, shared project `unqtnnxlltiadzbqpyhh` |
| growth | v6 | 🗄️ Retired — data in chase_wellness_v1.growthLogs |
| jobsearch | v8.2 | Supabase live, shared project, auth fix |
| appforge | v8.1 | Current |

### `defaultData`
```js
{
  lessons: [],
  ideas: [],
  auditHistory: [],
  appSnapshots: {},           // keyed by ALL_APP_KEYS: ['wellness','growth','jobsearch','appforge']
  settings: { beginnerMode: true, lastAuditedApp: null },
}
```

## Audit Engine

### APP_META Detection (primary)
Each app should have this comment on line 1 of `App.jsx`:
```js
// APP_META: { "app": "wellness", "version": "15.9" }
// APP_META: { "app": "jobsearch", "version": "8.2" }
```
`detectApp()` reads this first. If found, uses it as authoritative source.

### Marker Scoring (fallback)
If no APP_META, scores based on string markers (storage keys, component names, etc.). Less reliable — always prefer APP_META.

### Audit Checks
Runs checks for:
- Storage key naming conventions
- `save()` stamping `_syncAt` for Supabase
- Error boundaries present
- No hardcoded API keys
- Inline styles only (no CSS imports)
- No TypeScript

## Storage Pattern
```js
const STORE = "chase_forge_v1";
const load = () => JSON.parse(localStorage.getItem(STORE)) || {};
const save = (d) => localStorage.setItem(STORE, JSON.stringify(d));
```
Single blob, no Supabase sync yet (planned for Phase 3 rollout).

## Key Behaviours to Preserve
- `APP_SNAPSHOT_DEFAULTS` are merged with saved `appSnapshots` on load — new fields always appear even if the user has old data
- Audit history capped at 50 entries
- Ideas and lessons are stored in the main data blob
- `beginnerMode` toggle shows/hides helper text in Audit tab

## Supabase Sync — Not yet wired
App Forge is Phase 3 of the Supabase sync rollout (Wellness ✅ → Job Search ✅ → App Forge → next).
When ready, follow the same pattern: use the shared project `unqtnnxlltiadzbqpyhh`, APP_KEY = `'app-forge'`.

## What NOT to Do
- Don't refactor to multiple files yet — monolith is intentional until patterns stabilize
- Don't add TypeScript, component libraries, or CSS files (see portfolio conventions)
- Don't create new localStorage keys
- Don't add a backend — when sync is needed, use the shared Supabase project

## Roadmap Reference
See `/ROADMAP.md` (repo root) for the full priority queue and improvement ideas (items A1–A7).

## CI (GitHub Actions)
This app is built by **`.github/workflows/portfolio-web-build.yml`** on **Node 20** (`npm ci` then `npm run build`). Keep **`package-lock.json`** in sync with `package.json` using **Node 20’s npm** — see repo root **[`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`](../../docs/templates/SESSION_START_FIX_CI_LOCKFILES.md)**.

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
