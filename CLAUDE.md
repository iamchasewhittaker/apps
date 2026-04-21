# App Portfolio — Master Project Instructions

> For Claude Code. Read this first before touching any app in this portfolio.

> **Identity source of truth:** Chase's job-search direction, CliftonStrengths, voice rules, friend feedback, and Kassie's operating-doctrine letter live at [`identity/`](identity/) — specifically `identity/direction.md` (committed direction), `identity/strengths/` (Top 5 + all 34), `identity/voice-brief.md`, `identity/friend-feedback.md`, and `identity/kassie-notes.md`. Job Search HQ mirrors these via constants; other apps should reference the identity folder rather than restating.

## Mission

> **"For Reese. For Buzz. Forward — no excuses."**
>
> Build every app as if your family depends on it — because they do.
> Work with urgency. Ship with quality. No excuses, no coasting.
> This is for Reese and Buzz.

## Portfolio Overview


| App                         | Version       | Storage Key                                                                                                                  | URL                                 | Status                                                                                                                                                                                                                  |
| --------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wellness Tracker            | v15.10        | `chase_wellness_v1`                                                                                                          | local                               | ✅ Active · W+sunrise · Clarity palette · `[HANDOFF.md](portfolio/wellness-tracker/HANDOFF.md)`                                                                                                                          |
| Wellness Tracker (iOS)      | Phase 2 shell | `chase_wellness_ios_v1`                                                                                                      | local Xcode                         | ✅ Active · SwiftUI check-in · `[portfolio/wellness-tracker-ios](portfolio/wellness-tracker-ios)`                                                                                                                       |
| ClarityUI (Swift pkg)       | v0.1          | n/a (shared package)                                                                                                         | n/a                                 | ✅ Built · `swift build` clean · `FlowLayout` public · `[portfolio/clarity-ui](portfolio/clarity-ui)`                                                                                                                    |
| Clarity Check-in (iOS)      | v0.1          | `chase_checkin_ios_v1` (+draft, +meds)                                                                                       | local Xcode                         | ✅ Phase 1 done · `docs/BRANDING.md` + AppIcon 1024 · template `[docs/templates/PORTFOLIO_APP_BRANDING.md](docs/templates/PORTFOLIO_APP_BRANDING.md)` · `[portfolio/clarity-checkin-ios](portfolio/clarity-checkin-ios)` |
| Clarity Triage (iOS)        | v0.1          | `chase_triage_ios_v1`                                                                                                        | local Xcode                         | ✅ Phase 2 done · `**docs/BRANDING.md` + AppIcon** (nested chevron) · xcodeproj (`CT*`) · `[portfolio/clarity-triage-ios](portfolio/clarity-triage-ios)` · capacity + ideas + wins                                       |
| Clarity Time (iOS)          | v0.1          | `chase_time_ios_v1`                                                                                                          | local Xcode                         | ✅ Phase 3 done · `**docs/BRANDING.md` + AppIcon** (clock + arc) · xcodeproj (`CX*`) · `[portfolio/clarity-time-ios](portfolio/clarity-time-ios)` · time sessions + scripture streak                                     |
| Clarity Budget (iOS)        | v0.2          | `chase_budget_ios_v1` + YNAB Keychain `com.chasewhittaker.ClarityBudget`                                                                                                        | local Xcode                         | ✅ **Today** (STS month/week/day) + **web** [`clarity-budget-web`](portfolio/clarity-budget-web) + **YNAB** import/PATCH · `**docs/BRANDING.md` + AppIcon** · xcodeproj (`CB*`) · `[portfolio/clarity-budget-ios](portfolio/clarity-budget-ios)` · dual-scenario + wants · stub iOS Supabase |
| Clarity Budget (web)        | v0.4          | `chase_budget_web_v1` + `chase_budget_web_tx_v1` (tx cache) + YNAB token key in `localStorage`                                                                                          | clarity-budget-web.vercel.app       | ✅ Session 2 done · STS dashboard + **URL-persisted filters** + **tabbed SpendingBreakdown** (category / payee / week) + **sortable TransactionList** w/ role chips · tx never synced to Supabase · Session 3 next: Claude money companion · `[portfolio/clarity-budget-web](portfolio/clarity-budget-web)`                                              |
| Clarity Growth (iOS)        | v0.1          | `chase_growth_ios_v1`                                                                                                        | local Xcode                         | ✅ Phase 5 done · `**docs/BRANDING.md` + AppIcon** (sprout) · xcodeproj (`CG*`) · `[portfolio/clarity-growth-ios](portfolio/clarity-growth-ios)` · 7 growth areas + streaks                                              |
| Clarity Command (iOS)       | v0.1          | `chase_command_ios_v1`                                                                                                       | local Xcode                         | ✅ Phase 6 done · 3 tabs (Mission/Scoreboard/Settings) · gold accent · 14/14 tests · all 6 Clarity apps on iPhone · xcodeproj (`CD*`) · `[portfolio/clarity-command-ios](portfolio/clarity-command-ios)`                 |
| Clarity Command             | v1.0          | `chase_command_v1`                                                                                                           | local                               | ✅ Active · Daily accountability hub · LDS faith + family urgency · `[portfolio/clarity-command](portfolio/clarity-command)`                                                                                            |
| Job Search HQ               | v8.12         | `chase_job_search_v1`                                                                                                        | job-search-hq.vercel.app            | ✅ Active · Wave 4 #5: 📧 email forward parsing (regex → pre-filled Contact + App modals) · offer comparison side-by-side · outreach cadence timeline · Draft Message contact nav · Weekly Review tab · Chrome MV3 in `extension/`                |
| Job Search HQ (iOS)         | v0.1          | `chase_job_search_ios_v1`                                                                                                    | local Xcode                         | 🟡 Local · SwiftUI + ClarityUI · `[portfolio/job-search-hq-ios](portfolio/job-search-hq-ios)` · AppIcon/Logo via `tools/generate_brand_assets.py` · Debug+`devicectl` install verified · [Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) · Supabase Phase 2                                                                                         |
| App Forge                   | v8.1          | `chase_forge_v1`                                                                                                             | local                               | ✅ Active · `[portfolio/app-forge](portfolio/app-forge)`                                                                                                                                                                 |
| Clarity Hub                 | v0.2          | `chase_hub_checkin_v1` (+ 4 more)                                                                                            | local                               | ✅ Active · 5 tabs: Check-in, Triage, Time, Budget, Growth · YNAB+Tasks split out · `[portfolio/clarity-hub](portfolio/clarity-hub)`                                                                                     |
| Funded (iOS)                | v0.1          | SwiftData + `AppStorage` (`chase_ynab_clarity_ios_*`); token in Keychain; YNAB read + PATCH assign (Fund, with confirmation) | local Xcode                         | 🟡 Local · `[portfolio/funded-ios](portfolio/funded-ios)`                                                                                                                                                               |
| RollerTask Tycoon (iOS)     | v1.0          | SwiftData + `UserDefaults` (`chase_roller_task_tycoon_ios_*`)                                                                | local Xcode                         | 🟡 Local · [Linear](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e)                                                                                                                               |
| RollerTask Tycoon (web PWA) | v1.0          | `chase_roller_task_v1`                                                                                                       | local                               | ✅ Active · Vite PWA · `[portfolio/roller-task-tycoon](portfolio/roller-task-tycoon)`                                                                                                                                    |
| Growth Tracker              | v6            | `chase_growth_v1`                                                                                                            | local                               | Archived 2026-04-20 · merged into Wellness GrowthTab · `[portfolio/archive/growth-tracker](portfolio/archive/growth-tracker)`                                                                                           |
| Money                       | v0.1          | `chase_money_v1`                                                                                                             | local                               | Archived 2026-04-20 · superseded by Spend Clarity · `[portfolio/archive/money](portfolio/archive/money)`                                                                                                                |
| AI Dev Mastery              | v1.0.1        | none (no persistence)                                                                                                        | local                               | ✅ Active · React CRA course · 13 tracks, 68+ modules · `[portfolio/ai-dev-mastery](portfolio/ai-dev-mastery)`                                                                                                           |
| Shortcut Reference          | v0.1.0        | n/a (macOS native)                                                                                                           | local Xcode                         | ✅ Active · macOS Swift · AX keyboard shortcuts · `[portfolio/shortcut-reference](portfolio/shortcut-reference)`                                                                                                          |
| Claude Usage Tool           | v0.10.0       | electron-store                                                                                                               | local Electron                      | ✅ Active · Electron + React + TS · menu bar usage monitor · [Linear](https://linear.app/whittaker/project/claude-usage-tool-a002c92c1688) · `[portfolio/claude-usage-tool](portfolio/claude-usage-tool)`                 |
| Spend Clarity               | v0.1          | none (Python CLI; no localStorage); YNAB token in `.env`; Gmail OAuth tokens in `config/`                                    | local Python                        | 🟡 Local · `[portfolio/spend-clarity](portfolio/spend-clarity)`                                                                                                                                                         |
| Knowledge Base              | v2.1.1        | `chase_knowledge_base_v1`                                                                                                    | knowledge-base-hazel-iota.vercel.app | ✅ Active · favicons + import/export · Git/Vercel/Supabase folders · connected to apps.git auto-deploy · `[portfolio/knowledge-base](portfolio/knowledge-base)`                                                          |
| Funded Web                  | v1.0          | `chase_hub_ynab_v1`                                                                                                          | local                               | ✅ Active · Standalone YNAB dashboard · split from clarity-hub · `[portfolio/funded-web](portfolio/funded-web)`                                                                                                          |
| RollerTask Tycoon Web       | v1.0          | `chase_hub_rollertask_v1`                                                                                                    | local                               | ✅ Active · Standalone tasks/points tracker · split from clarity-hub · `[portfolio/rollertask-tycoon-web](portfolio/rollertask-tycoon-web)`                                                                              |
| Gmail Forge                 | v0.3          | Apps Script Script Properties (`CLASSIFIER_MODE`, `GEMINI_API_KEY`, `SHEET_ID`, `NEWSLETTER_TO_ALIASES`, `TRIGGER_TOKEN`)        | script.google.com                   | ✅ Active · Phase 3 LIVE · 69 XML filters + Apps Script auto-sorter (5-min) + Chrome MV3 extension · [dashboard](https://script.google.com/macros/s/AKfycbyaWjWoL_5tHfsVpCqhRJamduer13-q_p57D6YT3XPUB7zmW0Rgef2EY4Ji243AUDqLRQ/exec) · Review Queue: 83 to triage · `[portfolio/gmail-forge](portfolio/gmail-forge)` |
| Spend Radar                 | v0.1          | none (Apps Script Script Properties: `SHEET_ID`, `GMAIL_FORGE_WEB_APP_URL`, `GMAIL_FORGE_TRIGGER_TOKEN`, `DASHBOARD_URL`)       | Apps Script backend                 | 🟡 Active · Gmail `label:Receipt` → Subscriptions + Receipts + Audit tabs · rule-based extraction (`SENDER_RULES`) · cross-project Refresh All Apps (Gmail Forge) · `[portfolio/spend-radar](portfolio/spend-radar)`      |
| Spend Radar (web)           | v0.1          | `chase_spend_radar_web_v1`                                                                                                    | local                               | 🟡 Active · Read-only CRA dashboard reading Sheet published CSV · monthly/yearly totals + cancel candidates · `[portfolio/spend-radar-web](portfolio/spend-radar-web)`                                                   |
| Shipyard                    | v0.1          | n/a                                                                                                                           | shipyard-sandy-seven.vercel.app     | ✅ Active · Fleet command center · Phase 2 live (RLS + auth gate) · `[portfolio/shipyard](portfolio/shipyard)` |
| Shipyard (iOS)              | v0.1          | `chase_shipyard_ios_v1`                                                                                                       | local Xcode                         | 🟡 Local · SwiftUI + @Observable + supabase-swift v2 · Phase 2: real `projects` fetch + email/password auth + UserDefaults cache · SY monogram AppIcon · xcodeproj (`SY*`) · `[portfolio/shipyard-ios](portfolio/shipyard-ios)` |
| Ash Reader                  | v1.0          | `ash_reader_` prefix (localStorage)                                                                                           | ash-reader.vercel.app               | ✅ Active · Mobile chunker for capture system conversation → Ash · `[portfolio/ash-reader](portfolio/ash-reader)` |
| Ash Reader (iOS)            | v0.3          | `ash_reader_ios_` prefix (UserDefaults)                                                                                       | local Xcode                         | 🟡 Local · Full parity with web v1.1 · 4 tabs: Reader/Themes/Actions/Settings · P6 yellow icon · 26/26 tests · `[portfolio/ash-reader-ios](portfolio/ash-reader-ios)` |
| Unnamed (web)               | v0.1          | `unnamed_v1`                                                                                                                  | local                               | ✅ Active · Daily OS for ADHD brains · Next.js + Tailwind 4 + localStorage · Phase 1: 7-day rule · `[portfolio/unnamed](portfolio/unnamed)` |
| Unnamed (iOS)               | v0.1          | `unnamed_ios_v1`                                                                                                              | local Xcode                         | 🟡 On-device · SwiftUI + @Observable · 5 flows · 10/10 tests · amber-triangle AppIcon · xcodeproj (`UN*`) · `[portfolio/unnamed-ios](portfolio/unnamed-ios)` |
| Fairway (iOS)               | v0.1          | `chase_fairway_ios_v1`                                                                                                        | local Xcode                         | 🟡 Local · SwiftUI + @Observable · Lawn OS: 4 zones, irrigation, fertilizer plan, soil test, spreader calc, shrub beds · Augusta green palette · xcodeproj (`FW*`) · `[portfolio/fairway-ios](portfolio/fairway-ios)` |
| Alias Ledger                | v1.0          | `hme_alias_tracker_v1`                                                                                                        | alias-ledger.vercel.app             | ✅ Active · Hide My Email alias tracker · single-file HTML · `[portfolio/alias-ledger](portfolio/alias-ledger)` |
| Idea Kitchen                | v0.1          | n/a (docs-only)                                                                                                               | local                               | ✅ Active · Claude Project prompt + build guide + per-app minisite pattern · turns raw ideas → shipped apps · `[portfolio/idea-kitchen](portfolio/idea-kitchen)` |



### Portfolio metadata (Shipyard sync)

> Companion table for [Shipyard](portfolio/shipyard). Read by `portfolio/shipyard/scripts/sync-projects.ts`. Fill in `—` cells as you get to them; sync tolerates missing fields. App names MUST match the main Portfolio Overview table above.

| App | Category | Tagline | GitHub | Linear |
| --- | --- | --- | --- | --- |
| Wellness Tracker | Dashboard | Daily wellness check-in with streaks | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Wellness Tracker (iOS) | Health & Fitness | Native SwiftUI check-in shell | — | — |
| ClarityUI (Swift pkg) | Developer Tools | Shared SwiftUI components for the Clarity iOS apps | — | — |
| Clarity Check-in (iOS) | Health & Fitness | Morning check-in + meds tracker | — | — |
| Clarity Triage (iOS) | Productivity | Daily capacity, ideas, and wins | — | — |
| Clarity Time (iOS) | Productivity | Time sessions + scripture streak | — | — |
| Clarity Budget (iOS) | Finance | YNAB-backed STS month/week/day budget | — | — |
| Clarity Budget (web) | Finance | YNAB-backed STS dashboard + URL-filtered spending breakdown (category / payee / week) + sortable transaction list; Claude money companion in Phase 2 | [apps](https://github.com/iamchasewhittaker/apps) | [Linear](https://linear.app/whittaker/project/clarity-budget-web-b40f3edb4be0) |
| Clarity Growth (iOS) | Lifestyle | 7 growth areas with streaks | — | — |
| Clarity Command (iOS) | Productivity | Mission + Scoreboard + Settings — daily accountability | — | — |
| Clarity Command | Dashboard | Daily accountability hub on the web | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Job Search HQ | Tool | AI-assisted job search cockpit (pipeline + contacts + prep) | [apps](https://github.com/iamchasewhittaker/apps) | [Linear](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) |
| Job Search HQ (iOS) | Productivity | Native iOS companion to Job Search HQ | — | [Linear](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) |
| App Forge | Tool | Web workbench for building new portfolio apps | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Clarity Hub | Dashboard | Unified 5-tab hub (Check-in / Triage / Time / Budget / Growth) | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Funded (iOS) | Finance | YNAB read + assign flow, Keychain-secured | — | — |
| RollerTask Tycoon (iOS) | Lifestyle | Native iOS tasks + points tracker | — | [Linear](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) |
| RollerTask Tycoon (web PWA) | Tracker | Retired Vite PWA tasks/points tracker | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Growth Tracker | Tracker | Retired growth tracker — merged into Wellness | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Money | Tool | Superseded: Transaction Enricher + Budget Dashboard | [apps](https://github.com/iamchasewhittaker/apps) | — |
| AI Dev Mastery | Content | 13-track React course on AI-assisted dev | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Shortcut Reference | Reference | macOS menu-bar keyboard shortcut viewer | — | — |
| Claude Usage Tool | Developer Tools | Menu-bar monitor for Claude Code usage | — | [Linear](https://linear.app/whittaker/project/claude-usage-tool-a002c92c1688) |
| Spend Clarity | Developer Tools | Python CLI enriching YNAB from Gmail + Privacy.com | — | — |
| Knowledge Base | Content | Personal bookmark + notes hub | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Funded Web | Dashboard | Standalone YNAB dashboard | [apps](https://github.com/iamchasewhittaker/apps) | — |
| RollerTask Tycoon Web | Tracker | Standalone tasks/points tracker (split from Hub) | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Spend Radar | Tool | Gmail receipt → Sheet subscription tracker (Apps Script) | — | — |
| Spend Radar (web) | Dashboard | Read-only CRA reading Sheet CSV | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Shipyard | Dashboard | Fleet command center for the portfolio | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Shipyard (iOS) | Productivity | Mobile companion to Shipyard | — | — |
| Ash Reader | Tool | Mobile chunker for capture conversation → Ash | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Ash Reader (iOS) | Utilities | Native SwiftUI Ash Reader with themes + actions | — | — |
| Unnamed (web) | Tool | Daily OS for ADHD brains — 7-day rule | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Unnamed (iOS) | Productivity | On-device daily OS companion | — | — |
| Fairway (iOS) | Lifestyle | Lawn OS: zones, irrigation, fertilizer plan, soil test | — | — |
| Alias Ledger | Utilities | Hide My Email alias tracker (single-file HTML) | [apps](https://github.com/iamchasewhittaker/apps) | — |
| Gmail Forge | Tool | Three-layer Gmail automation: XML filters + Apps Script auto-sorter + Chrome extension | — | — |
| Idea Kitchen | Developer Tools | Reusable pattern for idea → foundation → Claude Code handoff | [apps](https://github.com/iamchasewhittaker/apps) | [Linear](https://linear.app/whittaker/project/idea-kitchen-1115a17b711a) |



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
> `LEARNINGS.md` — per-project mistakes, fixes, and "aha" moments. AI tools read it at session start; **append after every session where the app was modified** — not just when something goes wrong.
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

- **App-level:** `CHANGELOG.md` (`## [Unreleased]`), app `ROADMAP.md`, app `HANDOFF.md` (State/Next/Last touch), and `LEARNINGS.md` — **always**, even if just one line noting what changed and why.
- **Root-level (monorepo):** root `ROADMAP.md` Change Log row for notable work and root `HANDOFF.md` current focus/next step.
- **Shipped truth:** git commits + Linear are the shipped record; `HANDOFF.md` is resume context.

> **After every session where any app is modified, AI tools must (without being asked):**
>
> 1. Run `checkpoint` (or `git add -A && git commit`) to save the working state
> 2. Update that app's `CHANGELOG.md` — log what changed under `## [Unreleased]`
> 3. Update that app's `ROADMAP.md` — mark completed items, add new ideas
> 4. Update `/ROADMAP.md` (repo root) Change Log table with a new row
> 5. Update `HANDOFF.md` State table — Focus, Next, Last touch
> 6. Update that app's `LEARNINGS.md` — **always** append at least one line: what changed, why, and any surprises. This is mandatory, not conditional.
> 7. **New app or first-time branding:** ensure `**docs/BRANDING.md`** exists (copy from `[docs/templates/PORTFOLIO_APP_BRANDING.md](docs/templates/PORTFOLIO_APP_BRANDING.md)`) and is linked from that app's `CLAUDE.md`
> 8. **Update Linear (heartbeat)** — for the modified app's Linear project (from the portfolio metadata table), post a brief activity comment summarizing what shipped and move any now-complete issues to Done. If the app has no Linear project yet, create one under team **Whittaker**. This is the lightweight per-session heartbeat, not the full `"update linear"` audit below.
> 9. **Update Shipyard** — run the Shipyard sync so [portfolio/shipyard](portfolio/shipyard) reflects any portfolio-metadata-table changes in this file (`cd portfolio/shipyard && npm run sync:projects`). Flag any app missing from the Shipyard UI after the sync.
>
> **After a manual Xcode session (Chase editing alone):**
> Run `checkpoint` — that is the minimum. Updating docs is a bonus.

This applies to all apps in the portfolio **and** to AI Dev Mastery at `projects/ai-dev-mastery/`.

**Auto-checkpoint:** AI tools should also run `checkpoint` at the **start** of every session (before making changes) so there is always a clean rollback point. If the tool cannot run shell commands, remind Chase to run `checkpoint` manually first.

## Roadmap Reference

See [ROADMAP.md](ROADMAP.md) for the full priority queue, per-app suggestions, and decisions log.