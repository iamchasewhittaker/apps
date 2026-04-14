# Session Start: Split YNAB + RollerTask into Standalone Apps

> Paste this into a new Claude Code session to pick up this work.

## Goal

Extract the YNAB tab and RollerTask tab from Clarity Hub into two standalone CRA apps — each with its own Vercel deployment. Clarity Hub keeps the remaining 6 tabs (Check-in, Triage, Time, Budget, Growth, Settings).

## Why

- YNAB has significant complexity (3 engine files, 745-line tab, API key management) and warrants its own focused app
- RollerTask is a self-contained tycoon game — a standalone URL is better for sharing/bookmarking
- Splitting avoids loading all 7 tabs' logic when a user only needs one

## Current State

**Repo root:** `~/Developer/chase`
**App dir:** `portfolio/clarity-hub/` (deployed at https://clarity-hub-lilac.vercel.app)
**Vercel project:** `clarity-hub` (team: `iamchasewhittakers-projects`)
**Supabase project:** `unqtnnxlltiadzbqpyhh` (shared — do not create a new one)

### What lives in clarity-hub today

| Tab | File | Supabase app_key | localStorage key |
|-----|------|-----------------|-----------------|
| YNAB | `src/tabs/YnabTab.jsx` (745 lines) | `ynab` | `chase_hub_ynab_v1` |
| Check-in | `src/tabs/CheckinTab.jsx` | `checkin` | `chase_hub_checkin_v1` |
| Triage | `src/tabs/TriageTab.jsx` | `triage` | `chase_hub_triage_v1` |
| Time | `src/tabs/TimeTab.jsx` | `time` | `chase_hub_time_v1` |
| Budget | `src/tabs/BudgetTab.jsx` | `budget` | `chase_hub_budget_v1` |
| Growth | `src/tabs/GrowthTab.jsx` | `growth` | `chase_hub_growth_v1` |
| Tasks | `src/tabs/RollerTaskTab.jsx` | `rollertask` | `chase_hub_rollertask_v1` |
| Settings | `src/tabs/SettingsTab.jsx` | — | — |

## Read These Files First

Before writing any code, read:
- `portfolio/clarity-hub/src/theme.js` — T palette, loadBlob/saveBlob, DEFAULT_* shapes
- `portfolio/clarity-hub/src/App.jsx` — auth gate, blob state pattern, save/push effects
- `portfolio/clarity-hub/src/sync.js` — how push/pull wrappers are structured
- `portfolio/clarity-hub/src/shared/sync.js` — the actual Supabase sync engine (copy into each new app)
- `portfolio/clarity-hub/src/tabs/YnabTab.jsx` — full YNAB tab to move
- `portfolio/clarity-hub/src/tabs/RollerTaskTab.jsx` — full RollerTask tab to move
- `portfolio/clarity-hub/src/engines/` — MetricsEngine.js, CashFlowEngine.js, YNABClient.js (YNAB only)

---

## Hard Rules (same as clarity-hub — violations cause CI failures)

1. **Inline styles only** — no CSS files, no Tailwind, no component libraries
2. **T palette** — every color from `import { T } from "./theme"` (or wherever theme lives)
3. **No unused variables** — `process.env.CI=true` on Vercel makes ESLint warnings into errors
4. **No TypeScript** — plain JS only
5. **No `useRef` unless actually used**
6. **Blob pattern** — App.jsx owns all state; feature components receive blob + setBlob as props
7. **CRA apps copy `shared/sync.js` as `src/shared/sync.js`** — real file, not symlink (symlinks break on Vercel)

---

## Task 1: New App — YNAB Clarity Web

### Bootstrap

```bash
cd ~/Developer/chase
./scripts/new-app ynab-clarity-web "YNAB dashboard — web companion to ynab-clarity-ios"
```

This scaffolds `portfolio/ynab-clarity-web/` with a standard CRA structure. Then:

```bash
cd portfolio/ynab-clarity-web
npm install @supabase/supabase-js
```

### Files to move / copy from clarity-hub

| Source | Destination | Notes |
|--------|------------|-------|
| `clarity-hub/src/tabs/YnabTab.jsx` | `ynab-clarity-web/src/tabs/YnabTab.jsx` | Update import paths |
| `clarity-hub/src/engines/MetricsEngine.js` | `ynab-clarity-web/src/engines/MetricsEngine.js` | Copy as-is |
| `clarity-hub/src/engines/CashFlowEngine.js` | `ynab-clarity-web/src/engines/CashFlowEngine.js` | Copy as-is |
| `clarity-hub/src/engines/YNABClient.js` | `ynab-clarity-web/src/engines/YNABClient.js` | Copy as-is |
| `clarity-hub/src/shared/sync.js` | `ynab-clarity-web/src/shared/sync.js` | Copy as-is |

### theme.js — copy relevant parts

Copy `T` palette + `loadBlob`/`saveBlob` + `YNAB_TOKEN_KEY`/`loadYnabToken`/`saveYnabToken` + `DEFAULT_YNAB` + `today`/`yesterday`/`fmtCents`/`fmtDollars`/`fmtDuration`/`computeStreak` from clarity-hub.

**Storage key:** Keep `chase_hub_ynab_v1` — existing users already have data under this key.

### sync.js — create app sync adapter

```js
// ynab-clarity-web/src/sync.js
import { createSync } from './shared/sync.js';

const { push, pull, auth } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const pushYnab = (data) => push('ynab', data);
export const pullYnab = (local, ts) => pull('ynab', local, ts);
export { auth };
```

### App.jsx — simplified single-blob shell

Strip clarity-hub's multi-blob App.jsx down to just the YNAB blob + auth gate + login screen. No NavTabs (single-page app — YNAB tab is the whole app). Pattern:

```jsx
const [ynab, setYnab] = useState(DEFAULT_YNAB);
// load + pull on mount
// save + push on ynab change
// auth gate same as clarity-hub LoginScreen
// render: <YnabTab blob={ynab} setBlob={setYnab} />
```

Add a minimal Settings section (YNAB token update + sign out) either inline or as a modal — don't need a full Settings tab.

### YNAB token key

Keep `chase_hub_ynab_token` — same localStorage key as clarity-hub uses. If a user has already set it in clarity-hub, it will work here too.

### Vercel deploy

```bash
cd portfolio/ynab-clarity-web
npm run build   # verify clean
vercel link     # link to new Vercel project "ynab-clarity-web"
scripts/vercel-add-env portfolio/ynab-clarity-web   # injects REACT_APP_SUPABASE_* from .env.supabase
vercel --prod
```

---

## Task 2: New App — RollerTask Tycoon Web

### Bootstrap

```bash
cd ~/Developer/chase
./scripts/new-app rollertask-tycoon-web "RollerTask Tycoon — points-based motivation tracker"
```

Then:
```bash
cd portfolio/rollertask-tycoon-web
npm install @supabase/supabase-js
```

### Files to move / copy from clarity-hub

| Source | Destination | Notes |
|--------|------------|-------|
| `clarity-hub/src/tabs/RollerTaskTab.jsx` | `rollertask-tycoon-web/src/tabs/RollerTaskTab.jsx` | Update import paths |
| `clarity-hub/src/shared/sync.js` | `rollertask-tycoon-web/src/shared/sync.js` | Copy as-is |

### theme.js — copy relevant parts

Copy `T` palette + `loadBlob`/`saveBlob` + `DEFAULT_ROLLERTASK` + `today` from clarity-hub.

**Storage key:** Keep `chase_hub_rollertask_v1`.

### sync.js

```js
// rollertask-tycoon-web/src/sync.js
import { createSync } from './shared/sync.js';

const { push, pull, auth } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const pushRollertask = (data) => push('rollertask', data);
export const pullRollertask = (local, ts) => pull('rollertask', local, ts);
export { auth };
```

### App.jsx — single-blob shell

Even simpler than YNAB — just the RollerTask blob + auth gate. No tab nav. Render `<RollerTaskTab blob={rollertask} setBlob={setRollertask} />` directly.

### Vercel deploy

```bash
cd portfolio/rollertask-tycoon-web
npm run build
vercel link     # new Vercel project "rollertask-tycoon-web"
scripts/vercel-add-env portfolio/rollertask-tycoon-web
vercel --prod
```

---

## Task 3: Remove tabs from Clarity Hub

Once both new apps are deployed and verified:

1. **Remove from `App.jsx`:**
   - Remove `ynab` and `rollertask` blob state, load/save effects, push/pull imports
   - Remove `YnabTab` and `RollerTaskTab` imports + renders
   - Remove YNAB from NavTabs (or redirect to new URL)
   - Update `SettingsTab` props — remove `ynab`/`setYnab`/`rollertask` props

2. **Delete files:**
   - `src/tabs/YnabTab.jsx`
   - `src/tabs/RollerTaskTab.jsx`
   - `src/engines/MetricsEngine.js`
   - `src/engines/CashFlowEngine.js`
   - `src/engines/YNABClient.js`
   - Remove `pushYnab`/`pullYnab`/`pushRollertask`/`pullRollertask` from `sync.js`

3. **Update `theme.js`:** Remove `DEFAULT_YNAB`, `DEFAULT_ROLLERTASK`, `YNAB_TOKEN_KEY`, `loadYnabToken`, `saveYnabToken`

4. **Update NavTabs:** Consider replacing YNAB tab with an external link button that opens the new standalone app URL

5. **Update `SettingsTab`:** Remove YNAB section (it moves to ynab-clarity-web's own settings)

6. **Update CI** (`portfolio-web-build.yml`): Both new apps need their own CI jobs (same pattern as existing jobs)

---

## Task 4: CI for Both New Apps

Add to `.github/workflows/portfolio-web-build.yml`:

```yaml
# Under paths (both push and pull_request):
- "portfolio/ynab-clarity-web/**"
- "portfolio/rollertask-tycoon-web/**"

# Jobs:
ynab-clarity-web:
  runs-on: ubuntu-latest
  defaults:
    run:
      working-directory: portfolio/ynab-clarity-web
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: npm
        cache-dependency-path: portfolio/ynab-clarity-web/package-lock.json
    - run: npm ci
    - run: npm run build

rollertask-tycoon-web:
  runs-on: ubuntu-latest
  defaults:
    run:
      working-directory: portfolio/rollertask-tycoon-web
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: npm
        cache-dependency-path: portfolio/rollertask-tycoon-web/package-lock.json
    - run: npm ci
    - run: npm run build
```

---

## Key Decisions to Make Before Starting

1. **Storage key continuity:** The plan above reuses `chase_hub_ynab_v1` and `chase_hub_rollertask_v1` so existing Supabase data (synced from iOS) is immediately accessible in the new apps. If you want fresh keys, update `KEYS` in each app's `theme.js` — but Supabase `app_key` strings (`ynab`, `rollertask`) must stay the same to keep iOS sync working.

2. **Cross-app navigation:** Should Clarity Hub's nav bar link out to the new standalone apps? E.g. replace the "YNAB" tab with a button that opens `ynab-clarity-web.vercel.app` in a new tab.

3. **Auth session sharing:** Each app has its own Supabase auth session (stored in localStorage under Supabase's own key). Users will need to log in separately to each app — this is the main UX cost of splitting.

---

## Verification Checklist

- [ ] `ynab-clarity-web`: `npm run build` passes clean
- [ ] `rollertask-tycoon-web`: `npm run build` passes clean
- [ ] `clarity-hub`: `npm run build` passes clean after tab removal
- [ ] YNAB data syncs correctly from iOS → ynab-clarity-web (check Supabase `app_key = 'ynab'`)
- [ ] RollerTask data syncs correctly from iOS → rollertask-tycoon-web
- [ ] Both new apps deploy successfully to Vercel
- [ ] CI jobs pass for all three apps
