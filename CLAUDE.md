# App Portfolio — Master Project Instructions

> For Claude Code. Read this first before touching any app in this portfolio.

## Portfolio Overview

| App | Version | Storage Key | URL | Status |
|-----|---------|-------------|-----|--------|
| Wellness Tracker | v15.10 | `chase_wellness_v1` | wellnes-tracker.vercel.app | ✅ Active · W+sunrise · Clarity palette · [`HANDOFF.md`](portfolio/wellness-tracker/HANDOFF.md) |
| Wellness Tracker (iOS) | Phase 2 shell | archived | — | 🗄️ Archived → replaced by 5 Clarity apps · [`portfolio/archive/wellness-tracker-ios`](portfolio/archive/wellness-tracker-ios) |
| ClarityUI (Swift pkg) | v0.1 | n/a (shared package) | n/a | ✅ Built · `swift build` clean · `FlowLayout` public · [`portfolio/clarity-ui`](portfolio/clarity-ui) |
| Clarity Check-in (iOS) | v0.1 | `chase_checkin_ios_v1` (+draft, +meds) | local Xcode | ✅ Phase 1 done · `docs/BRANDING.md` + AppIcon 1024 · template [`docs/templates/PORTFOLIO_APP_BRANDING.md`](docs/templates/PORTFOLIO_APP_BRANDING.md) · [`portfolio/clarity-checkin-ios`](portfolio/clarity-checkin-ios) |
| Clarity Triage (iOS) | v0.1 | `chase_triage_ios_v1` | local Xcode | ✅ Phase 2 done · **`docs/BRANDING.md` + AppIcon** (nested chevron) · xcodeproj (`CT*`) · [`portfolio/clarity-triage-ios`](portfolio/clarity-triage-ios) · capacity + ideas + wins |
| Clarity Time (iOS) | v0.1 | `chase_time_ios_v1` | local Xcode | ✅ Phase 3 done · **`docs/BRANDING.md` + AppIcon** (clock + arc) · xcodeproj (`CX*`) · [`portfolio/clarity-time-ios`](portfolio/clarity-time-ios) · time sessions + scripture streak |
| Clarity Budget (iOS) | v0.1 | `chase_budget_ios_v1` | local Xcode | ✅ Phase 4 done · **`docs/BRANDING.md` + AppIcon** (stacked coins) · xcodeproj (`CB*`) · [`portfolio/clarity-budget-ios`](portfolio/clarity-budget-ios) · dual-scenario budget + wants |
| Clarity Growth (iOS) | v0.1 | `chase_growth_ios_v1` | local Xcode | ✅ Phase 5 done · **`docs/BRANDING.md` + AppIcon** (sprout) · xcodeproj (`CG*`) · [`portfolio/clarity-growth-ios`](portfolio/clarity-growth-ios) · 7 growth areas + streaks |
| Job Search HQ | v8.3 | `chase_job_search_v1` | job-search-hq.vercel.app | ✅ Active |
| App Forge | v8.1 | `chase_forge_v1` | app-forge-fawn.vercel.app | ✅ Active |
| YNAB Clarity (iOS) | v0.1 | SwiftData + `AppStorage` (`chase_ynab_clarity_ios_*`); token in Keychain; YNAB read + PATCH assign (Fund, with confirmation) | local Xcode | 🟡 Local · [`portfolio/ynab-clarity-ios`](portfolio/ynab-clarity-ios) |
| RollerTask Tycoon (iOS) | v1.0 | SwiftData + `UserDefaults` (`chase_roller_task_tycoon_ios_*`) | local Xcode | 🟡 Local · [Linear](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) |
| RollerTask Tycoon (web PWA) | v1.0 | `chase_roller_task_v1` (historical) | (optional Vercel) | 🗄️ Retired — [`portfolio/archive/roller-task-tycoon`](portfolio/archive/roller-task-tycoon) |
| Growth Tracker | v6 | retired | — | 🗄️ Retired |
| AI Dev Mastery | v1.0 | none (no persistence) | not yet deployed | 🟡 Local |
| Spend Clarity | v0.1 | none (Python CLI; no localStorage); YNAB token in `.env`; Gmail OAuth tokens in `config/` | local Python | 🟡 Local · [`portfolio/spend-clarity`](portfolio/spend-clarity) |
| Knowledge Base | v2.0 | `chase_knowledge_base_v1` (blob: `{ bookmarks, folders, favorites, categoryOrder }`) | knowledge-base-beta-five.vercel.app | ✅ Active · 260 bookmarks · ARC sidebar + nested folders · [`portfolio/knowledge-base`](portfolio/knowledge-base) |

> ⚠️ **AI Dev Mastery** also lives under this monorepo at `projects/ai-dev-mastery/` (and may be checked out elsewhere). When standalone, it is not wired to Supabase, no localStorage, pure course viewer.

**Product framework:** **[PRODUCT_BUILD_FRAMEWORK.md](PRODUCT_BUILD_FRAMEWORK.md)** — universal 6-phase framework (Product Definition → PRD → UX Flow → Architecture → Milestones → Ship). **No coding starts until Phases 1–3 are documented for that app.**

**Migration tracking:** [MONOREPO_MIGRATION.md](MONOREPO_MIGRATION.md) · [Linear — Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) · **Terms:** [docs/GLOSSARY.md](docs/GLOSSARY.md) · **Local legacy (not in git):** [docs/LEGACY_LOCAL_MIRRORS.md](docs/LEGACY_LOCAL_MIRRORS.md)

**Multi-session / multi-agent:** Read **[HANDOFF.md](HANDOFF.md)** when continuing work or opening a **new** chat; copy a starter from [docs/templates/](docs/templates/).

- **End / switch agent:** Update **State** (and **Notes**) in `HANDOFF.md`.
- **New chat:** Paste from `docs/templates/SESSION_START_MONOREPO.md` or `SESSION_START_APP_CHANGE.md`; say read `CLAUDE.md` + `HANDOFF.md` first.
- **Shipped:** Linear + commits = truth; `HANDOFF.md` = current focus.

## Coding Tools — How Each One Picks Up Context

This repo is designed to work across multiple AI coding tools. The handoff pattern is the same regardless of tool: **read `CLAUDE.md` + `HANDOFF.md` first**, then continue from `HANDOFF.md` state.

| Tool | How it loads context | Session start |
|------|---------------------|---------------|
| **Claude Code** (CLI) | Reads `CLAUDE.md` automatically at startup | Paste `SESSION_START_MONOREPO.md` template; say *read `CLAUDE.md` and `HANDOFF.md` first* |
| **Cursor** | Reads `.cursor/rules/session-handoff.mdc` (`alwaysApply`) — auto-loaded for every chat | Open any `portfolio/*` subfolder — symlink loads the same rule; still paste template for context |
| **Antigravity (VS Code)** | Reads `CLAUDE.md` automatically when project folder is open | Open project folder; paste template for goal context |
| **Codex (OpenAI)** | No auto-load — paste manually | Paste `CLAUDE.md` intro + `HANDOFF.md` State table into prompt, then paste template |
| **Windsurf** | Reads `.windsurfrules` or `CLAUDE.md` if pointed at it in settings | Paste `HANDOFF.md` content + `CLAUDE.md` intro manually at session start |
| **VS Code + Copilot / GitHub Copilot Chat** | No auto-load — paste manually | Paste `CLAUDE.md` relevant section + `HANDOFF.md` state into chat |
| **Any other LLM tool** | Paste manually | Same — `CLAUDE.md` + `HANDOFF.md` is always enough to resume |

**Cursor setup detail:** Repo root has **`.cursor/rules/session-handoff.mdc`** (`alwaysApply`). Every **`portfolio/*`** app has a **symlink** to that file so opening a subfolder as the workspace still loads the same rule automatically. New apps get the symlink on creation.

**Windsurf setup detail:** If you want Windsurf to auto-load rules, add a `.windsurfrules` file in the app folder that references the handoff conventions (or symlink to a shared `.windsurfrules` at the repo root). Not yet set up — do this when you first use Windsurf on this repo.

## Tech Stack (all apps)
- **Most apps:** React (Create React App) + localStorage; inline styles (no CSS modules, no Tailwind); Vercel; PWA manifest.
- **RollerTask Tycoon** (`portfolio/roller-task-tycoon-ios/`): **SwiftUI** + **SwiftData** + `@AppStorage` (native iOS; not the web portfolio stack). **Wellness Tracker** (`portfolio/wellness-tracker-ios/`): **SwiftUI** check-in, **local-only** (UserDefaults). **Archived** Vite PWA: [`portfolio/archive/roller-task-tycoon`](portfolio/archive/roller-task-tycoon) (**`VITE_*`** + `import.meta.env` when building that tree).
- **Spend Clarity** (`portfolio/spend-clarity/`): **Python 3 CLI** — no React, no localStorage, no Supabase. YNAB + Gmail + Privacy.com APIs. Run via `python src/main.py`. Uses `python-dotenv`, `google-auth-oauthlib`, `requests`. Secrets in `.env` and `config/` (gitignored).
- No TypeScript, no Redux, no external state libraries (portfolio-wide)

## Monorepo Layout
```
/portfolio/
  shared/
    sync.js        ← Supabase offline-first sync (source of truth; copy into each app)
  app-hub/
    sync.sh        ← post-push summaries (paths resolved via script location)
  wellness-tracker/
    src/
      App.jsx      ← shell only (~370 lines)
      theme.js     ← T (colors), load/save/loadDraft/saveDraft helpers, STORE keys
      ErrorBoundary.jsx
      ui.jsx       ← shared UI components (NavTabs, Card, etc.)
      tabs/        ← one file per tab
        TrackerTab.jsx, TasksTab.jsx, TimeTrackerTab.jsx,
        BudgetTab.jsx, HistoryTab.jsx, GrowthTab.jsx
  job-search-hq/
    src/
      App.jsx      ← shell only (~280 lines)
      constants.js ← all data, styles (s), helpers, templates — no React
      ErrorBoundary.jsx
      tabs/
        FocusTab.jsx, PipelineTab.jsx, ContactsTab.jsx,
        AITab.jsx, ResourcesTab.jsx
      components/
        Field.jsx, AIResult.jsx, ApiKeyModal.jsx,
        AppCard.jsx, AppModal.jsx, ContactCard.jsx,
        ContactModal.jsx, ProfileModal.jsx, PrepModal.jsx
  app-forge/
    src/
      App.jsx      ← monolith (not yet refactored)
  roller-task-tycoon-ios/
    RollerTaskTycoon.xcodeproj, RollerTaskTycoon/  ← SwiftUI + SwiftData; local iOS (bundle id still com.chasewhittaker.ParkChecklist)
  wellness-tracker-ios/
    WellnessTracker.xcodeproj, WellnessTracker/  ← SwiftUI Phase 1 check-in; bundle com.chasewhittaker.WellnessTracker
  spend-clarity/
    src/              ← Python CLI modules (main, gmail_client, receipt_parser, matcher, etc.)
    tests/            ← pytest suite
    config/           ← category_rules.yaml; Gmail OAuth tokens (gitignored)
    CLAUDE.md, HANDOFF.md, LEARNINGS.md, PROMPT.md, requirements.txt
  archive/
    growth-tracker/  ← retired; merged into Wellness GrowthTab (`chase_wellness_v1.growthLogs`)
    roller-task-tycoon/  ← retired Vite PWA; APP_KEY roller_task_tycoon_v1 (historical Supabase rows may remain)
    money/  ← retired; Transaction Enricher (React) + Budget Dashboard (Python); superseded by spend-clarity
/projects/
  ai-dev-mastery/, shortcut-reference/  ← non-portfolio worktrees
  archive/
    claude-usage-tool/  ← retired fork (Electron menu bar; see README)
/scripts/
  checkpoint   ← run before editing; saves a git snapshot (one command, no git knowledge needed)
  restore      ← run to roll back to any prior checkpoint
  new-app      ← scaffold a new portfolio app (one command: new-app my-app "description")
```

> Each active `portfolio/*` app contains: `CLAUDE.md`, `HANDOFF.md`, `LEARNINGS.md`, `CHANGELOG.md`, `ROADMAP.md`.
> `LEARNINGS.md` — per-project mistakes, fixes, and "aha" moments. AI tools read it at session start; append after anything surprising.
>
> **Branding (do not repeat in every chat):** For new or restyled apps, add **`docs/BRANDING.md`** by copying [`docs/templates/PORTFOLIO_APP_BRANDING.md`](docs/templates/PORTFOLIO_APP_BRANDING.md), fill placeholders, and link it from that app’s `CLAUDE.md`. Index of design specs: [`docs/design/README.md`](docs/design/README.md).

Master instructions (this file) and [ROADMAP.md](ROADMAP.md) live at the **repo root** (`~/Developer/chase`).

## Key Conventions

### Branding (portfolio)
- **Template:** [`docs/templates/PORTFOLIO_APP_BRANDING.md`](docs/templates/PORTFOLIO_APP_BRANDING.md) — copy → `portfolio/<app>/docs/BRANDING.md` (or `projects/<name>/docs/BRANDING.md`), fill once, link from app `CLAUDE.md`.
- **Clarity iOS icons (shared geometry):** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](docs/design/CLARITY_IOS_APP_ICON_SPEC.md) — use with the template; session prompts should say *follow `docs/BRANDING.md`* instead of pasting rules.
- **Web reference pattern:** [`portfolio/wellness-tracker/docs/BRANDING.md`](portfolio/wellness-tracker/docs/BRANDING.md) (Clarity palette + PWA notes).

### Storage pattern (all apps)
- One big JSON blob per app in localStorage
- `load()` / `save()` helpers in each app's `theme.js` or `constants.js`
- `save()` in Wellness now stamps `_syncAt: Date.now()` for Supabase sync
- Never split data across multiple localStorage keys (except meds in Wellness)

### Component pattern (Wellness + Job Search)
- `App.jsx` is the shell: state, load/save effects, data helpers, modal renders, nav
- Tabs are dumb — they receive state + setters as props, own no persistent state
- ErrorBoundary wraps every tab render
- Styles live in a single `s` object (Job Search) or `T` tokens (Wellness)

### API calls (Job Search HQ)
- `callClaude(system, userMsg, maxTokens)` in `constants.js` — use this everywhere
- API key stored in `localStorage` under `chase_anthropic_key`, separate from app data
- `handleClaudeCall(fn, errorSetter)` pattern: wraps any Claude call with standardized error handling

## Supabase Sync — Status

**Wellness Tracker: LIVE ✅** | **Wellness Tracker (iOS):** local-only (no cloud sync) | **Job Search HQ: LIVE ✅** | **RollerTask Tycoon (iOS):** local-first (no Supabase in app yet) | **RollerTask Tycoon (archived web):** historical `roller_task_tycoon_v1` rows may still exist | App Forge: later

> ⚠️ **Wellness and Job Search** share the same Supabase project (`unqtnnxlltiadzbqpyhh`). The **retired Vite PWA** used the same project with `app_key = roller_task_tycoon_v1` (see archived app’s `CLAUDE.md`).

- `/portfolio/shared/sync.js` — `createSync(url, key)` factory, exports `push`, `pull`, `auth`
- `wellness-tracker/src/sync.js` — app adapter, APP_KEY = `'wellness'`
- `job-search-hq/src/sync.js` — app adapter, APP_KEY = `'job-search'`
- `portfolio/archive/roller-task-tycoon/src/sync.js` — **archived** app adapter, APP_KEY = `'roller_task_tycoon_v1'`, env `VITE_SUPABASE_*`
- CRA apps copy `shared/sync.js` as `src/shared/sync.js` (real file, not symlink — symlinks break on Vercel). The archived RollerTask PWA did the same.
- `save()` stamps `_syncAt` · `push()` fires on every save · `pull()` runs on startup
- Email OTP + `verifyOtp` auth gate: **Wellness** + **Job Search** in `App.jsx`; archived **RollerTask web** used `src/main.js` (vanilla). **Dashboard:** Authentication → Email Templates → **Magic link** — add `{{ .Token }}` to the body (default template is link-only; [Supabase OTP docs](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp)). See each app’s `CLAUDE.md` for a sample template.
- `.env` in CRA apps uses `REACT_APP_SUPABASE_*`. **Archived RollerTask web** uses **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** when you build that tree.

> ⚠️ **Env prefixes:** CRA apps → `REACT_APP_*` + `process.env`. **Archived Vite RollerTask only** → `VITE_*` + `import.meta.env`.

**To activate sync on an app:**
1. Create Supabase project at supabase.com (explain: org, project name, region, free tier limits)
2. Run SQL from `shared/sync.js` comments in Supabase SQL editor (explain: table schema, RLS, updated_at trigger)
3. Copy project URL + anon key → fill in `.env` from `.env.example` (explain: anon key is safe in browser, RLS is what protects data)
4. `npm install @supabase/supabase-js`
5. In the app's `App.jsx` load `useEffect`: call `pull(APP_KEY, stored, stored._syncAt)` after localStorage load
6. In the unified save `useEffect`: call `push(APP_KEY, blob)` after `save(blob)`

**Roll out order:** Wellness first → Job Search → App Forge

## What NOT to Do
- Don't add TypeScript — these apps use plain JS
- Don't install component libraries (MUI, Chakra, etc.) — all web UI is inline styles (archived RollerTask PWA used `<style>` in `index.html`, not a shared `s` object)
- Don't split the Job Search / Wellness styles `s` / `T` into CSS files without a deliberate refactor — it works across Vercel deploys
- Don't create new localStorage keys without updating the storage key table above
- Don't change existing `STORE` constant names in shipped apps — existing user data depends on them
- Don't add arbitrary backends — offline-first; **Supabase** (shared sync) is the only cloud data path
- Don't commit real financial data, income figures, account balances, or employer names — this repo is public (see "Sensitive Data" section below)

## Sensitive Data — Never Commit

> **This repo is PUBLIC on GitHub.** Treat every tracked file as world-readable.

- **Never commit real financial data** — income amounts, account balances, spending history, budget figures, debt amounts
- **Never commit real names in a financial context** — employer names with salary figures, family members with financial details
- **Never commit API tokens, passwords, or secrets** — use `.env` (gitignored) or macOS Keychain
- **Never commit bank/lender names tied to real account details** (e.g., "Citibank balance $X")
- **Archive folder safety net:** `portfolio/archive/.gitignore` blocks `.py`, `.html`, `.csv`, `.xlsx` — only `.md`, `.jsx`, `.js`, `.ts` are tracked
- **When in doubt, don't commit it.** Ask first.

If you discover sensitive data already in a tracked file, **stop and flag it immediately** — do not commit, push, or continue until it's resolved.

## CI — portfolio web builds

GitHub Actions **`.github/workflows/portfolio-web-build.yml`** runs **`npm ci && npm run build`** for **Wellness**, **Job Search**, and **App Forge** when those paths change (push to `main` / `master` or PR). **RollerTask Tycoon (iOS)** is not in that workflow — use Xcode (**⌘B** / **⌘U** for `RollerTaskTycoonTests`).

## Linear — project tracking (PM-style)

When you **ship or materially extend** an app in this portfolio, **use Linear** like a senior PM would: create or update a **project** on the Whittaker team with a short **purpose**, **success criteria**, and **workstreams** (Launch / QA / Backlog); seed **issues** with clear scope and “done when” acceptance. Link the Linear project from the app **README** or **ROADMAP** when useful. *(Example: [RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771).)*

## Documentation Auto-Update Rule

> **After every session where any app is modified, AI tools must (without being asked):**
> 1. Run `checkpoint` (or `git add -A && git commit`) to save the working state
> 2. Update that app's `CHANGELOG.md` — log what changed under `## [Unreleased]`
> 3. Update that app's `ROADMAP.md` — mark completed items, add new ideas
> 4. Update `/ROADMAP.md` (repo root) Change Log table with a new row
> 5. Update `HANDOFF.md` State table — Focus, Next, Last touch
> 6. Update that app's `LEARNINGS.md` — if anything went wrong, was surprising, or was learned
> 7. **New app or first-time branding:** ensure **`docs/BRANDING.md`** exists (copy from [`docs/templates/PORTFOLIO_APP_BRANDING.md`](docs/templates/PORTFOLIO_APP_BRANDING.md)) and is linked from that app's `CLAUDE.md`
>
> **After a manual Xcode session (Chase editing alone):**
> Run `checkpoint` — that is the minimum. Updating docs is a bonus.

This applies to all apps in the portfolio **and** to AI Dev Mastery at `projects/ai-dev-mastery/`.

**Auto-checkpoint:** AI tools should also run `checkpoint` at the **start** of every session (before making changes) so there is always a clean rollback point. If the tool cannot run shell commands, remind Chase to run `checkpoint` manually first.

## Roadmap Reference
See [ROADMAP.md](ROADMAP.md) for the full priority queue, per-app suggestions, and decisions log.
