# App Portfolio — Master Project Instructions

> For Claude Code. Read this first before touching any app in this portfolio.

## Mission

> **"For Reese. For Buzz. Forward — no excuses."**
>
> Build every app as if your family depends on it — because they do.
> Work with urgency. Ship with quality. No excuses, no coasting.
> This is for Reese and Buzz.

## Portfolio Overview


| App                         | Version       | Storage Key                                                                                                                  | URL                                 | Status                                                                                                                                                                                                                  |
| --------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wellness Tracker            | v15.10        | `chase_wellness_v1`                                                                                                          | wellness-tracker-kappa.vercel.app   | ✅ Active · W+sunrise · Clarity palette · `[HANDOFF.md](portfolio/wellness-tracker/HANDOFF.md)`                                                                                                                          |
| Wellness Tracker (iOS)      | Phase 2 shell | archived                                                                                                                     | —                                   | 🗄️ Archived → replaced by 5 Clarity apps · `[portfolio/archive/wellness-tracker-ios](portfolio/archive/wellness-tracker-ios)`                                                                                          |
| ClarityUI (Swift pkg)       | v0.1          | n/a (shared package)                                                                                                         | n/a                                 | ✅ Built · `swift build` clean · `FlowLayout` public · `[portfolio/clarity-ui](portfolio/clarity-ui)`                                                                                                                    |
| Clarity Check-in (iOS)      | v0.1          | `chase_checkin_ios_v1` (+draft, +meds)                                                                                       | local Xcode                         | ✅ Phase 1 done · `docs/BRANDING.md` + AppIcon 1024 · template `[docs/templates/PORTFOLIO_APP_BRANDING.md](docs/templates/PORTFOLIO_APP_BRANDING.md)` · `[portfolio/clarity-checkin-ios](portfolio/clarity-checkin-ios)` |
| Clarity Triage (iOS)        | v0.1          | `chase_triage_ios_v1`                                                                                                        | local Xcode                         | ✅ Phase 2 done · `**docs/BRANDING.md` + AppIcon** (nested chevron) · xcodeproj (`CT*`) · `[portfolio/clarity-triage-ios](portfolio/clarity-triage-ios)` · capacity + ideas + wins                                       |
| Clarity Time (iOS)          | v0.1          | `chase_time_ios_v1`                                                                                                          | local Xcode                         | ✅ Phase 3 done · `**docs/BRANDING.md` + AppIcon** (clock + arc) · xcodeproj (`CX*`) · `[portfolio/clarity-time-ios](portfolio/clarity-time-ios)` · time sessions + scripture streak                                     |
| Clarity Budget (iOS)        | v0.2          | `chase_budget_ios_v1` + YNAB Keychain `com.chasewhittaker.ClarityBudget`                                                                                                        | local Xcode                         | ✅ **Today** (STS month/week/day) + **web** [`clarity-budget-web`](portfolio/clarity-budget-web) + **YNAB** import/PATCH · `**docs/BRANDING.md` + AppIcon** · xcodeproj (`CB*`) · `[portfolio/clarity-budget-ios](portfolio/clarity-budget-ios)` · dual-scenario + wants · stub iOS Supabase |
| Clarity Budget (web)        | v0.2          | `chase_budget_web_v1` + YNAB token key in `localStorage`                                                                                                                                 | local / optional deploy             | ✅ Next.js STS dashboard + optional Supabase `clarity_budget` · PAT never sent to Supabase · `[portfolio/clarity-budget-web](portfolio/clarity-budget-web)`                                                                                                                             |
| Clarity Growth (iOS)        | v0.1          | `chase_growth_ios_v1`                                                                                                        | local Xcode                         | ✅ Phase 5 done · `**docs/BRANDING.md` + AppIcon** (sprout) · xcodeproj (`CG*`) · `[portfolio/clarity-growth-ios](portfolio/clarity-growth-ios)` · 7 growth areas + streaks                                              |
| Clarity Command (iOS)       | v0.1          | `chase_command_ios_v1`                                                                                                       | local Xcode                         | ✅ Phase 6 done · 3 tabs (Mission/Scoreboard/Settings) · gold accent · 14/14 tests · all 6 Clarity apps on iPhone · xcodeproj (`CD*`) · `[portfolio/clarity-command-ios](portfolio/clarity-command-ios)`                 |
| Clarity Command             | v1.0          | `chase_command_v1`                                                                                                           | clarity-command.vercel.app          | ✅ Active · Daily accountability hub · LDS faith + family urgency · needs Supabase env vars · `[portfolio/clarity-command](portfolio/clarity-command)`                                                                   |
| Job Search HQ               | v8.5          | `chase_job_search_v1`                                                                                                        | job-search-hq.vercel.app            | ✅ Active · Chrome MV3 capture + badge in `portfolio/job-search-hq/extension/`                                                                                                                                           |
| Job Search HQ (iOS)         | v0.1          | `chase_job_search_ios_v1`                                                                                                    | local Xcode                         | 🟡 Local · SwiftUI + ClarityUI · `[portfolio/job-search-hq-ios](portfolio/job-search-hq-ios)` · AppIcon/Logo via `tools/generate_brand_assets.py` · Debug+`devicectl` install verified · [Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) · Supabase Phase 2                                                                                         |
| App Forge                   | v8.1          | `chase_forge_v1`                                                                                                             | app-forge-fawn.vercel.app           | ✅ Active                                                                                                                                                                                                                |
| Clarity Hub                 | v0.2          | `chase_hub_checkin_v1` (+ 4 more)                                                                                            | clarity-hub-lilac.vercel.app        | ✅ Active · 5 tabs: Check-in, Triage, Time, Budget, Growth · YNAB+Tasks split out · `[portfolio/clarity-hub](portfolio/clarity-hub)`                                                                                     |
| Funded (iOS)                | v0.1          | SwiftData + `AppStorage` (`chase_ynab_clarity_ios_*`); token in Keychain; YNAB read + PATCH assign (Fund, with confirmation) | local Xcode                         | 🟡 Local · `[portfolio/funded-ios](portfolio/funded-ios)`                                                                                                                                                               |
| RollerTask Tycoon (iOS)     | v1.0          | SwiftData + `UserDefaults` (`chase_roller_task_tycoon_ios_*`)                                                                | local Xcode                         | 🟡 Local · [Linear](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e)                                                                                                                               |
| RollerTask Tycoon (web PWA) | v1.0          | `chase_roller_task_v1` (historical)                                                                                          | (optional Vercel)                   | 🗄️ Retired — `[portfolio/archive/roller-task-tycoon](portfolio/archive/roller-task-tycoon)`                                                                                                                            |
| Growth Tracker              | v6            | retired                                                                                                                      | —                                   | 🗄️ Retired                                                                                                                                                                                                             |
| AI Dev Mastery              | v1.0.1        | none (no persistence)                                                                                                        | not yet deployed                    | ✅ Active · React CRA course · 13 tracks, 68+ modules · `[portfolio/ai-dev-mastery](portfolio/ai-dev-mastery)`                                                                                                           |
| Shortcut Reference          | v0.1.0        | n/a (macOS native)                                                                                                           | local Xcode                         | ✅ Active · macOS Swift · AX keyboard shortcuts · `[portfolio/shortcut-reference](portfolio/shortcut-reference)`                                                                                                          |
| Claude Usage Tool           | v0.10.0       | electron-store                                                                                                               | local Electron                      | ✅ Active · Electron + React + TS · menu bar usage monitor · [Linear](https://linear.app/whittaker/project/claude-usage-tool-a002c92c1688) · `[portfolio/claude-usage-tool](portfolio/claude-usage-tool)`                 |
| Spend Clarity               | v0.1          | none (Python CLI; no localStorage); YNAB token in `.env`; Gmail OAuth tokens in `config/`                                    | local Python                        | 🟡 Local · `[portfolio/spend-clarity](portfolio/spend-clarity)`                                                                                                                                                         |
| Knowledge Base              | v1.0          | `chase_knowledge_base_v1`                                                                                                    | knowledge-base-beta-five.vercel.app | ✅ Active · 48 bookmarks · 12 categories · `[portfolio/knowledge-base](portfolio/knowledge-base)`                                                                                                                        |
| Funded Web                  | v1.0          | `chase_hub_ynab_v1`                                                                                                          | funded-web.vercel.app               | ✅ Active · Standalone YNAB dashboard · split from clarity-hub · `[portfolio/funded-web](portfolio/funded-web)`                                                                                                          |
| RollerTask Tycoon Web       | v1.0          | `chase_hub_rollertask_v1`                                                                                                    | rollertask-tycoon-web.vercel.app    | ✅ Active · Standalone tasks/points tracker · split from clarity-hub · `[portfolio/rollertask-tycoon-web](portfolio/rollertask-tycoon-web)`                                                                              |



**Product framework:** **[PRODUCT_BUILD_FRAMEWORK.md](PRODUCT_BUILD_FRAMEWORK.md)** — universal 6-phase framework (Product Definition → PRD → UX Flow → Architecture → Milestones → Ship). **No coding starts until Phases 1–3 are documented for that app.**

**Migration tracking:** [MONOREPO_MIGRATION.md](MONOREPO_MIGRATION.md) · [Linear — Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) · **Terms:** [docs/GLOSSARY.md](docs/GLOSSARY.md) · **Local legacy (not in git):** [docs/LEGACY_LOCAL_MIRRORS.md](docs/LEGACY_LOCAL_MIRRORS.md)

**Portfolio governance:** [Linear — Portfolio Governance & Report Infrastructure](https://linear.app/whittaker/project/portfolio-governance-and-report-infrastructure-28044a8f312b) (WHI-30 to WHI-51) · **Governance docs:** [docs/governance/](docs/governance/) · **Health check:** `scripts/portfolio-health-check` · **Report templates:** [docs/templates/PORTFOLIO_EXECUTIVE_REPORT_PROMPT.md](docs/templates/PORTFOLIO_EXECUTIVE_REPORT_PROMPT.md)

**Multi-session / multi-agent:** Read **[HANDOFF.md](HANDOFF.md)** when continuing work or opening a **new** chat; copy a starter from [docs/templates/](docs/templates/).

- **End / switch agent:** Update **State** (and **Notes**) in `HANDOFF.md`.
- **New chat:** Paste from `docs/templates/SESSION_START_MONOREPO.md` or `SESSION_START_APP_CHANGE.md`; say read `CLAUDE.md` + `HANDOFF.md` first.
- **Shipped:** Linear + commits = truth; `HANDOFF.md` = current focus.

## Coding Tools — How Each One Picks Up Context

This repo is designed to work across multiple AI coding tools. The handoff pattern is the same regardless of tool: **read `CLAUDE.md` + `HANDOFF.md` first**, then continue from `HANDOFF.md` state.


| Tool                                        | How it loads context                                                                   | Session start                                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Claude Code** (CLI)                       | Reads `CLAUDE.md` automatically at startup                                             | Paste `SESSION_START_MONOREPO.md` template; say *read `CLAUDE.md` and `HANDOFF.md` first*        |
| **Cursor**                                  | Reads `.cursor/rules/session-handoff.mdc` (`alwaysApply`) — auto-loaded for every chat | Open any `portfolio/*` subfolder — symlink loads the same rule; still paste template for context |
| **Antigravity (VS Code)**                   | Reads `CLAUDE.md` automatically when project folder is open                            | Open project folder; paste template for goal context                                             |
| **Codex (OpenAI)**                          | No auto-load — paste manually                                                          | Paste `CLAUDE.md` intro + `HANDOFF.md` State table into prompt, then paste template              |
| **Windsurf**                                | Reads `.windsurfrules` or `CLAUDE.md` if pointed at it in settings                     | Paste `HANDOFF.md` content + `CLAUDE.md` intro manually at session start                         |
| **VS Code + Copilot / GitHub Copilot Chat** | No auto-load — paste manually                                                          | Paste `CLAUDE.md` relevant section + `HANDOFF.md` state into chat                                |
| **Any other LLM tool**                      | Paste manually                                                                         | Same — `CLAUDE.md` + `HANDOFF.md` is always enough to resume                                     |


**Cursor setup detail:** Repo root has `**.cursor/rules/session-handoff.mdc`** (`alwaysApply`). Every `**portfolio/***` app has a **symlink** to that file so opening a subfolder as the workspace still loads the same rule automatically. New apps get the symlink on creation.

**Windsurf setup detail:** If you want Windsurf to auto-load rules, add a `.windsurfrules` file in the app folder that references the handoff conventions (or symlink to a shared `.windsurfrules` at the repo root). Not yet set up — do this when you first use Windsurf on this repo.

## Tech Stack (all apps)

- **Most apps:** React (Create React App) + localStorage; inline styles (no CSS modules, no Tailwind); Vercel; PWA manifest.
- **RollerTask Tycoon** (`portfolio/roller-task-tycoon-ios/`): **SwiftUI** + **SwiftData** + `@AppStorage` (native iOS; not the web portfolio stack). **Wellness Tracker** (`portfolio/wellness-tracker-ios/`): **SwiftUI** check-in, **local-only** (UserDefaults). **Archived** Vite PWA: `[portfolio/archive/roller-task-tycoon](portfolio/archive/roller-task-tycoon)` (`**VITE_*`** + `import.meta.env` when building that tree).
- **Spend Clarity** (`portfolio/spend-clarity/`): **Python 3 CLI** — no React, no localStorage, no Supabase. YNAB + Gmail + Privacy.com APIs. Run via `python src/main.py`. Uses `python-dotenv`, `google-auth-oauthlib`, `requests`. Secrets in `.env` and `config/` (gitignored).
- **Shortcut Reference** (`portfolio/shortcut-reference/`): **Swift 5.9+** / **SwiftUI** + **AppKit** — macOS 13+ keyboard shortcut viewer using Accessibility APIs. Bundle ID `dev.chase.shortcut-reference`. Build with Xcode or `swift run ShortcutReference`.
- **Claude Usage Tool** (`portfolio/claude-usage-tool/`): **Electron 28** + **React 18** + **TypeScript** + **Vite** — macOS menu bar app. Exception to the portfolio "no TypeScript" norm. Run via `npm run electron:dev`.
- No Redux, no external state libraries (portfolio-wide). TypeScript exception: Claude Usage Tool only.

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
    extension/   ← Chrome MV3 MVP: LinkedIn → HQ import + Action Queue badge (see extension/README.md)
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
  job-search-hq-ios/
    JobSearchHQ.xcodeproj, JobSearchHQ/  ← SwiftUI + ClarityUI; local-first MVP; tools/generate_brand_assets.py; Phase 2 Supabase (see docs/SYNC_PHASE2.md)
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
  ai-dev-mastery/
    src/
      App.jsx      ← single-file course app (2,667 lines; curriculum + React UI)
  shortcut-reference/
    Sources/ShortcutReferenceLibrary/  ← SwiftUI + AX logic
    MacApp/          ← @main for .app bundle
    ShortcutReference.xcodeproj
  claude-usage-tool/
    electron/        ← main process (scraper, adminApi, preload, main)
    src/             ← React + TypeScript frontend (App.tsx, components)
  archive/
    growth-tracker/  ← retired; merged into Wellness GrowthTab (`chase_wellness_v1.growthLogs`)
    roller-task-tycoon/  ← retired Vite PWA; APP_KEY roller_task_tycoon_v1 (historical Supabase rows may remain)
    money/  ← retired; Transaction Enricher (React) + Budget Dashboard (Python); superseded by spend-clarity
/scripts/
  checkpoint   ← run before editing; saves a git snapshot (one command, no git knowledge needed)
  restore      ← run to roll back to any prior checkpoint
  new-app      ← scaffold a new portfolio app (one command: new-app my-app "description")
```

> Each active `portfolio/*` app contains: `CLAUDE.md`, `HANDOFF.md`, `LEARNINGS.md`, `CHANGELOG.md`, `ROADMAP.md`.
> `LEARNINGS.md` — per-project mistakes, fixes, and "aha" moments. AI tools read it at session start; append after anything surprising.
>
> **Branding (do not repeat in every chat):** For new or restyled apps, add `**docs/BRANDING.md`** by copying `[docs/templates/PORTFOLIO_APP_BRANDING.md](docs/templates/PORTFOLIO_APP_BRANDING.md)`, fill placeholders, and link it from that app’s `CLAUDE.md`. Index of design specs: `[docs/design/README.md](docs/design/README.md)`.

Master instructions (this file) and [ROADMAP.md](ROADMAP.md) live at the **repo root** (`~/Developer/chase`).

## Key Conventions

### Branding (portfolio)

- **Logo template:** `[docs/templates/PORTFOLIO_APP_LOGO.md](docs/templates/PORTFOLIO_APP_LOGO.md)` — **every new app must get a logo** using this standard format (dark bg, colored label, white main text, DM Sans). Includes SVG templates, color palette, sizing guide, and PNG generation instructions.
- **Template:** `[docs/templates/PORTFOLIO_APP_BRANDING.md](docs/templates/PORTFOLIO_APP_BRANDING.md)` — copy → `portfolio/<app>/docs/BRANDING.md` (or `projects/<name>/docs/BRANDING.md`), fill once, link from app `CLAUDE.md`.
- **Clarity iOS icons (shared geometry):** `[docs/design/CLARITY_IOS_APP_ICON_SPEC.md](docs/design/CLARITY_IOS_APP_ICON_SPEC.md)` — use with the template; session prompts should say *follow `docs/BRANDING.md*` instead of pasting rules.
- **Web reference pattern:** `[portfolio/wellness-tracker/docs/BRANDING.md](portfolio/wellness-tracker/docs/BRANDING.md)` (Clarity palette + PWA notes).

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
- `.env` in CRA apps uses `REACT_APP_SUPABASE_*`. **Archived RollerTask web** uses `**VITE_SUPABASE_URL`** and `**VITE_SUPABASE_ANON_KEY**` when you build that tree.

> ⚠️ **Env prefixes:** CRA apps → `REACT_APP_*` + `process.env`. **Archived Vite RollerTask only** → `VITE_*` + `import.meta.env`.

**To activate sync on an app:**

1. All portfolio apps share one Supabase project: `unqtnnxlltiadzbqpyhh` — do NOT create a new project
2. SQL schema + RLS already applied — no SQL editor step needed for new apps
3. Supabase creds are stored in `.env.supabase` at repo root (gitignored, pre-populated — never commit it)
4. `npm install @supabase/supabase-js`
5. In the app's `App.jsx` load `useEffect`: call `pull(APP_KEY, stored, stored._syncAt)` after localStorage load
6. In the unified save `useEffect`: call `push(APP_KEY, blob)` after `save(blob)`

**Vercel deploy automation (no manual credential entry):**

1. `npm run build` — verify build passes first
2. `vercel link` — link app to Vercel project (first time only)
3. `vercel git connect https://github.com/iamchasewhittaker/apps.git --yes` — connect to GitHub for auto-deploy (first time only; idempotent)
4. `scripts/vercel-add-env portfolio/<app>` — reads `.env.supabase`, pipes `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` into Vercel for production + preview automatically
5. `vercel --prod` — deploy
6. Update `CLAUDE.md` portfolio table URL column and the app's `HANDOFF.md`

Verify all projects are connected: `scripts/vercel-check-git` | Fix: `scripts/vercel-check-git --fix`

Or use the `/deploy` slash command — it runs all 5 steps automatically.

**If `.env.supabase` is missing** (new machine / lost): `cd portfolio/clarity-hub && vercel env pull --environment=production /tmp/.env.prod` then copy the two `REACT_APP_SUPABASE_*` lines into `.env.supabase` at repo root.

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

GitHub Actions `**.github/workflows/portfolio-web-build.yml`** runs `**npm ci && npm run build**` on **Node 20** for these four CRA apps when their paths change (push to `main` / `master` or PR): **Wellness Tracker** (`portfolio/wellness-tracker`), **Job Search HQ** (`portfolio/job-search-hq`), **Knowledge Base** (`portfolio/knowledge-base`), **App Forge** (`portfolio/app-forge`). `**package-lock.json` must stay in sync** with each app’s `package.json` — CI uses `npm ci`, which fails if the lockfile was produced by a mismatched npm (e.g. Node 24 / npm 11 locally while CI uses Node 20). **Regenerate lockfiles with Node 20’s `npm`** and verify with `npm ci` before pushing; session template: `[docs/templates/SESSION_START_FIX_CI_LOCKFILES.md](docs/templates/SESSION_START_FIX_CI_LOCKFILES.md)`. **RollerTask Tycoon (iOS)** is not in that workflow — use Xcode (**⌘B** / **⌘U** for `RollerTaskTycoonTests`).

## Linear — project tracking (PM-style)

When you **ship or materially extend** an app in this portfolio, **use Linear** like a senior PM would: create or update a **project** on the Whittaker team with a short **purpose**, **success criteria**, and **workstreams** (Launch / QA / Backlog); seed **issues** with clear scope and “done when” acceptance. Link the Linear project from the app **README** or **ROADMAP** when useful. *(Example: [RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771).)*

## Documentation Auto-Update Rule

**Canonical phrase:** when Chase says **"update docs"**, treat it as this default scope unless explicitly overridden:

- **App-level:** `CHANGELOG.md` (`## [Unreleased]`), app `ROADMAP.md`, app `HANDOFF.md` (State/Next/Last touch), and `LEARNINGS.md` only when there was a surprise/failure/lesson.
- **Root-level (monorepo):** root `ROADMAP.md` Change Log row for notable work and root `HANDOFF.md` current focus/next step.
- **Shipped truth:** git commits + Linear are the shipped record; `HANDOFF.md` is resume context.

> **After every session where any app is modified, AI tools must (without being asked):**
>
> 1. Run `checkpoint` (or `git add -A && git commit`) to save the working state
> 2. Update that app's `CHANGELOG.md` — log what changed under `## [Unreleased]`
> 3. Update that app's `ROADMAP.md` — mark completed items, add new ideas
> 4. Update `/ROADMAP.md` (repo root) Change Log table with a new row
> 5. Update `HANDOFF.md` State table — Focus, Next, Last touch
> 6. Update that app's `LEARNINGS.md` — if anything went wrong, was surprising, or was learned
> 7. **New app or first-time branding:** ensure `**docs/BRANDING.md`** exists (copy from `[docs/templates/PORTFOLIO_APP_BRANDING.md](docs/templates/PORTFOLIO_APP_BRANDING.md)`) and is linked from that app's `CLAUDE.md`
>
> **After a manual Xcode session (Chase editing alone):**
> Run `checkpoint` — that is the minimum. Updating docs is a bonus.

This applies to all apps in the portfolio **and** to AI Dev Mastery at `projects/ai-dev-mastery/`.

**Auto-checkpoint:** AI tools should also run `checkpoint` at the **start** of every session (before making changes) so there is always a clean rollback point. If the tool cannot run shell commands, remind Chase to run `checkpoint` manually first.

## Roadmap Reference

See [ROADMAP.md](ROADMAP.md) for the full priority queue, per-app suggestions, and decisions log.