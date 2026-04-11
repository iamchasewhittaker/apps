# App Portfolio — Management Roadmap
> Last updated: 2026-04-11 (YNAB Clarity iOS Overview refresh) | Maintained by Chase

---

## Quick Reference

| App | Version | URL | Storage Key | Status |
|-----|---------|-----|-------------|--------|
| Wellness Tracker | v15.10 | https://wellnes-tracker.vercel.app | chase_wellness_v1 | ✅ Active |
| Wellness Tracker (iOS) | Phase 1 | — | `chase_wellness_ios_*` (local-only) | 🟡 Local · [`portfolio/wellness-tracker-ios`](portfolio/wellness-tracker-ios) |
| Job Search HQ | v8.3 | https://job-search-hq.vercel.app | chase_job_search_v1 | ✅ Active |
| App Forge | v8.1 | https://app-forge-fawn.vercel.app | chase_forge_v1 | ✅ Active |
| YNAB Clarity (iOS) | v0.1 | local Xcode | SwiftData + `chase_ynab_clarity_ios_*`; token in Keychain | 🟡 Local · [`portfolio/ynab-clarity-ios`](portfolio/ynab-clarity-ios) |
| Growth Tracker | v6 | https://growth-tracker-rouge.vercel.app | chase_growth_v1 | 🗄️ Retired |
| RollerTask Tycoon (iOS) | v1.0 | local Xcode | SwiftData + `chase_roller_task_tycoon_ios_*` | 🟡 Local · [Linear](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) |
| RollerTask Tycoon (web PWA) | v1.0 | (optional) | `chase_roller_task_v1` (historical) | 🗄️ Retired — `portfolio/archive/roller-task-tycoon` |
| App Hub | — | local only | — | 🔧 Utility |
| AI Dev Mastery | v1.0 | local (port 3004) | not yet deployed | 🟡 Local |

---

## Priority Queue

> Use this section to track the most important next actions across all apps.

| # | Priority | App | Task | Status |
|---|----------|-----|------|--------|
| 1 | ✅ Done | Wellness | Wire Supabase sync — auth gate + push/pull live (v15.9) | ✅ Done |
| 2 | ✅ Done | Wellness | Auth gate (magic-link login) so data is user-scoped in Supabase | ✅ Done |
| 3 | ✅ Done | Wellness | Add Supabase env vars to Vercel so deployed app has sync (not just local) | ✅ Done |
| 4 | ✅ Done | Job Search | Wire Supabase sync (same pattern as Wellness — infra ready) | ✅ Done |
| 4.5 | ✅ Done | Job Search | Fix auth: .env pointed to wrong separate Supabase project; corrected to shared wellness project + redirect URLs updated | ✅ Done |
| 5 | 🔴 High | Wellness | Split TrackerTab.jsx (78K) — too large, similar to old App.jsx problem | 🟡 Planned |
| 6 | 🔴 High | Wellness | Split HistoryTab.jsx (58K) — analytics, export, AI summary too large | 🟡 Planned |
| 7 | 🟡 Medium | App Forge | Add deployment status checks (ping live URLs, compare to last-sync.json) | 💡 Idea |
| 8 | 🟡 Medium | All | Shared `ui.jsx` component library across apps (currently duplicated) | 💡 Idea |
| 9 | 🟡 Medium | Wellness | Export data to PDF (doctor prep report currently plain text) | 💡 Idea |
| 10 | 🟢 Low | Job Search | Add offline AI queue — buffer Claude calls when offline, retry on reconnect | 💡 Idea |
| 11 | 🟢 Low | App Hub | Upgrade sync.sh to also push data snapshots to cloud backup | 💡 Idea |
| 12 | 🟡 Medium | Job Search | Kanban board view for pipeline (drag-and-drop cards between stages) | 💡 Idea |
| 13 | 🟡 Medium | Wellness | Weekly digest — generate summary + open mailto link (no backend needed) | 💡 Idea |
| 14 | 🟡 Medium | All | Cross-app nav bar — shared session already works, just needs a visible link between apps | 💡 Idea |
| 15 | 🟢 Low | App Forge | Wire Supabase sync (Phase 3 of rollout — same shared project) | 💡 Idea |
| 16 | 🟢 Low | Wellness | Sleep correlation chart — Oura readiness/sleep/HRV vs mood vs productivity over time | 💡 Idea |
| 17 | 🟢 Low | Job Search | Auto-draft follow-up email when application ages past 7 days | 💡 Idea |
| 18 | 🟢 Low | All | PWA push notifications — wellness streak nudges, job search follow-up reminders | 💡 Idea |

---

## Overlap Analysis

### Duplicated Code (Consolidation Opportunities)

| Pattern | Found In | Recommendation |
|---------|----------|----------------|
| `load()` / `save()` localStorage helpers | All 4 apps | Extract to shared `storage.js` utility |
| NavTabs switcher component | All 4 apps | Extract to shared `ui.jsx` package |
| Error boundary class component | Wellness, Job Search | Standardize one version, share it |
| PWA manifest + vercel.json setup | All 4 apps | Template in App Hub for new apps |
| `callClaude()` API wrapper | Job Search only | Move to shared `api.js` — Wellness could use Claude for health summaries too |
| Streak calculation logic | Wellness (GrowthTab), Growth (retired) | Already merged — confirm no dead code in growth-tracker |
| Draft system (save/load unsaved form state) | Wellness, Job Search | Could be a shared `useDraft()` hook |

### Feature Overlap

| Feature | Wellness | Job Search | App Forge | Notes |
|---------|----------|------------|-----------|-------|
| Growth/habit tracking | ✅ GrowthTab | ✅ Daily Focus blocks | — | Unified view needed |
| Task management | ✅ TasksTab | ✅ Daily Focus | — | Two separate task systems |
| Ideas capture | ✅ Ideas sub-tab | — | ✅ Idea tracker | Three places to log ideas |
| Backup / export | ✅ File System API | ✅ File System API | — | Identical implementation — share it |
| Version tracking | ✅ CHANGELOG | ✅ CHANGELOG | ✅ App snapshots | App Forge should be source of truth |

### Consolidation Recommendation
- **Ideas:** Consolidate all idea capture into one tab (App Forge's Idea tracker is most complete)
- **Tasks:** Keep Wellness TasksTab for personal tasks; Job Search Daily Focus for job-specific blocks
- **Growth logging:** Wellness is the canonical source — confirm Job Search still logs correctly after any refactors

---

## Cross-Device Sync Strategy

> Currently all apps use `localStorage` only — data is siloed per browser/device. This is the single biggest limitation.

### Recommended Path: Supabase (Free Tier)

**Why Supabase:**
- Free tier handles this use case easily (500MB DB, 2GB bandwidth)
- Built-in auth (email/OAuth) — one login across all apps
- Real-time subscriptions for live sync
- Row-level security keeps data private
- REST + JS SDK fits current React architecture

**Implementation Plan:**

#### Phase 1 — Backend Setup (one-time)
- [ ] Create Supabase project at supabase.com
- [ ] Create `user_data` table: `(id, user_id, app_key, data jsonb, updated_at)`
- [ ] Enable Row Level Security — users only see their own rows
- [ ] Store Supabase URL + anon key in `.env` for each app

#### Phase 2 — Sync Layer (shared code)
Create `/portfolio/shared/sync.js`:
```js
// save(appKey, data) → upserts to Supabase
// load(appKey) → fetches from Supabase, falls back to localStorage
// sync() → merges localStorage + remote, last-write-wins per field
```
- Offline-first: write to localStorage immediately, sync to Supabase in background
- Conflict resolution: compare `updated_at` timestamps, merge at field level where possible

#### Phase 3 — Auth (shared)
Create `/portfolio/shared/auth.js`:
```js
// Uses Supabase auth
// Stores session in localStorage (auto-refreshed)
// Single login page shared via redirect or embedded component
```

#### Phase 4 — Per-App Integration
Roll out one app at a time:
1. **Wellness Tracker** first (most data, most value)
2. **Job Search HQ** second (AI key already separate — keep it local)
3. **App Forge** third (audit/lesson data)

### Alternative: Cloudflare KV + Workers (if no auth needed)
- Simpler but no per-user isolation
- Good for single-user setup where Chase is the only user
- Less setup, but harder to scale to multi-device without user IDs

### Mobile-Specific Improvements
Since all apps are PWA-ready (manifest.json exists), these unlock mobile use:

| Improvement | Effort | Impact |
|-------------|--------|--------|
| Add `display: standalone` to all manifests | Low | Makes install-to-homescreen feel native |
| Touch-optimized tap targets (44px min) | Low | Better mobile usability |
| Swipe navigation between tabs | Medium | Natural mobile gesture |
| Background sync API for offline queued writes | Medium | Ensures no data loss on flaky mobile connections |
| Push notifications for streak reminders | High | Wellness streak nudges on mobile |
| Responsive layout audit (all apps) | Medium | Some tabs likely break on small screens |

---

## App-by-App Improvement Suggestions

### Wellness Tracker

| # | Suggestion | Why | Effort |
|---|-----------|-----|--------|
| W1 | Split TrackerTab.jsx (78K) into morning/evening sub-components | Same fragility Wellness had before v15.6 refactor | Medium |
| W2 | Split HistoryTab.jsx (58K) — separate analytics, export, AI summary | Too much in one component | Medium |
| W3 | Move AI monthly summary (currently in HistoryTab) to use shared `callClaude()` | Avoid duplicating API logic | Low |
| W4 | Add iCloud/Supabase sync — highest priority, most daily writes | Cross-device access to daily check-ins | High |
| W5 | Medication tracking: add dose time logging, not just yes/no | More useful health data | Medium |
| W6 | Add weekly summary email/notification (cron or manual trigger) | Accountability without opening app | High |
| W7 | Move `theme.js` storage constants to a dedicated `storage.js` | theme.js is doing too much | Low |
| W8 | Medication dose time logging — not just yes/no, but when taken | More actionable health data | Low |
| W9 | Weekly digest — generate summary + open mailto link with the text | Accountability without opening app | Medium |
| W10 | Sleep correlation chart — Oura readiness/sleep/HRV vs mood vs productivity | Spot patterns over time | Medium |

### Job Search HQ

| # | Suggestion | Why | Effort |
|---|-----------|-----|--------|
| J1 | Refactor App.jsx (1,921 lines) → modular tabs | Same problem Wellness solved in v15.6 | High |
| J2 | Extract `callClaude()` to shared `api.js` | Avoid drift between apps using Claude | Low |
| J3 | Add application status timeline view (Kanban or timeline) | Pipeline list doesn't show momentum | Medium |
| J4 | Sync applications to Supabase — resume + contacts lost if browser cleared | Critical data should be backed up | High |
| J5 | Add interview calendar integration (create calendar event from application) | Reduces context switching | Medium |
| J6 | Separate Anthropic key UI into a shared `<ApiKeyModal>` component | Job Search and future apps share same pattern | Low |
| J7 | Add "last contacted" tracking for contacts | Networking follow-up gaps easy to miss | Low |
| J8 | Kanban board view for pipeline (drag-and-drop cards between stages) | Pipeline list doesn't show momentum visually | Medium |
| J9 | Auto-draft follow-up email when application ages past 7 days | Reduces manual tracking | Medium |
| J10 | Application status timeline — date applied → follow-up → response | See deal velocity at a glance | Low |

### App Forge

| # | Suggestion | Why | Effort |
|---|-----------|-----|--------|
| A1 | Add live URL health checks (fetch each app's URL, report 200/error) | Catch broken deployments automatically | Medium |
| A2 | Replace manual app snapshot editing with auto-read from each app's localStorage | Avoid staleness — Forge should read live data | High |
| A3 | Add a cross-app search — search lessons/ideas across all apps at once | Currently siloed per-app notes | Medium |
| A4 | Integrate with App Hub sync.sh — Forge reads last-sync.json for version info | Closes the loop between git pushes and Forge audit | Low |
| A5 | Add "This Week" dashboard — new lessons this week, apps updated, ideas in progress | Quick weekly review view | Medium |
| A6 | Trigger Vercel redeploy from within Forge (call Vercel deploy hook URL) | One-click deploy without leaving Forge | Medium |
| A7 | GitHub recent commits view per app — show last 5 commits + diff summary | See what changed since last audit | Medium |

### App Hub (sync.sh)

| # | Suggestion | Why | Effort |
|---|-----------|-----|--------|
| H1 | Add Supabase push step — after git push, snapshot data to cloud | Automated offsite backup | Medium |
| H2 | Add version mismatch detection — warn if live URL version ≠ local CHANGELOG | Catch forgotten deploys | Low |
| H3 | Generate ROADMAP.md update prompt (append new version to change log below) | Keep this file current automatically | Medium |
| H4 | Cross-app dependency check — warn if Job Search growthLog write would break after Wellness schema change | Prevent silent integration bugs | Medium |

---

## Shared Infrastructure Wishlist

These are one-time investments that improve all apps:

```
/portfolio/shared/
  storage.js     — load/save/sync with localStorage + Supabase fallback
  api.js         — callClaude() wrapper with error handling
  auth.js        — Supabase session management
  ui.jsx         — NavTabs, Card, Rating, ChoiceButton, ErrorBoundary (shared)
  theme.js       — design tokens (colors, spacing) used by all apps
  hooks/
    useDraft.js  — save/restore unsaved form state
    useSync.js   — background cloud sync hook
    useStreak.js — streak calculation (used in Wellness + Growth)
```

This would eliminate the duplicated code across apps and give each app a consistent look/feel with less maintenance burden.

---

## Change Log

> Record every meaningful update here. One row per version/change.

| Date | App | Version | Change Summary | Notes |
|------|-----|---------|----------------|-------|
| 2026-04-11 | YNAB Clarity (iOS) | v0.1 | **Overview:** merged mortgage into Bills & Essentials; Spending card (yesterday / week / month from transactions API); safe-to-spend includes Ready to Assign + all non-required mapped categories; 24h stale-sync banner + persisted `chase_ynab_clarity_ios_last_refreshed_epoch` | See `portfolio/ynab-clarity-ios/CHANGELOG.md` |
| 2026-04-11 | YNAB Clarity (iOS) | v0.1 | **`YNABClient.patchRequest`:** use `(_, response)` instead of unused `data` from `URLSession` — removes compiler warning / unblocks strict builds | See `portfolio/ynab-clarity-ios/CHANGELOG.md` |
| 2026-04-11 | YNAB Clarity (iOS) | v0.1 | **Rethink:** decode `goal_target` / use goal for `monthlyTarget` (fixes $0 when unassigned); Overview reorder + Budget Health + Underfunded Goals; Bills by coverage + optional **Fund** (PATCH `budgeted`); `dueDay` on `CategoryMapping`; Income tab surplus + inline sources; Cash Flow today marker + bill status; `TipBanner` + `HowItWorksView`; `YNABClient.updateCategoryBudgeted` | See `portfolio/ynab-clarity-ios/CHANGELOG.md` |
| 2026-04-08 | YNAB Clarity (iOS) | v0.1 | **Income:** added `semimonthly` frequency (5th + 20th pattern); `secondPayDay` property on `IncomeSource`; form stepper for 2nd pay date | SwiftData-safe default; `occurrencesInMonth` handles new case |
| 2026-04-08 | YNAB Clarity (iOS) | v0.1 | **New** `portfolio/ynab-clarity-ios` — read-only YNAB companion; 4 tabs (Overview, Bills, Salary, Cash Flow); SwiftData + Keychain token; auto-categorization, mortgage isCovered fix, Fun Money help sheet, SettingsSheet; `IncomeSetupView` pre-fill bug fixed (`sheet(item:)`); initial git commit (was previously untracked) | Bundle `com.chasewhittaker.YNABClarity`; `chase_ynab_clarity_ios_*` AppStorage keys; see `portfolio/ynab-clarity-ios/CLAUDE.md` |
| 2026-04-05 | Wellness Tracker (iOS) | Phase 1 | **New** `portfolio/wellness-tracker-ios` — SwiftUI daily check-in (morning/evening), `chase_wellness_ios_*` UserDefaults, **local-only** (no Supabase/OTP); optional **Past days** read-only; sunrise app icon; `WellnessTracker` scheme + tests | Bundle `com.chasewhittaker.WellnessTracker`; see `CLAUDE.md` |
| 2026-04-05 | Portfolio + RollerTask Tycoon | — | **Web PWA archived** to `portfolio/archive/roller-task-tycoon`; **iOS** product path `portfolio/roller-task-tycoon-ios`, Xcode **RollerTaskTycoon** / **RollerTaskTycoonTests**, display name RollerTask Tycoon, bundle id `com.chasewhittaker.ParkChecklist` unchanged; `UserDefaults` keys `chase_roller_task_tycoon_ios_*` + one-time migration from `chase_park_checklist_ios_*`; backup export `RollerTaskTycoon-backup-*.json`; root **`.gitignore`** whitelists **`.github/workflows/**`** so **`.github/workflows/portfolio-web-build.yml`** is versioned | **CI** builds Wellness, Job Search, App Forge only; disable Vercel for retired PWA if desired |
| 2026-04-05 | Park Checklist (iOS) | v1.0 | **README:** troubleshooting for physical-device **debugger attach** failures (Xcode vs iOS, signing, scheme diagnostics, crash logs) | e.g. iOS 26 device + older Xcode |
| 2026-04-05 | Portfolio | — | **GitHub Actions** [`.github/workflows/portfolio-web-build.yml`](.github/workflows/portfolio-web-build.yml) — `npm ci && npm run build` for Wellness, Job Search, App Forge on path-scoped push/PR | iOS still local Xcode |
| 2026-04-05 | Park Checklist (iOS) | v1.0 | **Import:** replace-all JSON restore (`schemaVersion` 1), confirm dialog, `BackupImporter` + tests target **ParkChecklistTests**; PRD addendum; **WHI-15** done | Merge import = backlog idea |
| 2026-04-05 | Park Checklist (iOS) | v1.0 | **Planning:** `docs/planning/` filled docs + `PLANNING_WORKFLOW.md`; kit README/CLAUDE cross-links; **Linear** [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) + backlog WHI-16…19 | See row above for WHI-15 import |
| 2026-04-04 | Park Checklist (iOS) | v1.0 | **`docs/planning/README.md`** — home for filled Park-specific planning copies; README + ROADMAP point at kit + this folder | Templates remain in **`docs/ios-app-starter-kit/`** |
| 2026-04-04 | Portfolio | — | **iOS App Starter Kit** → **`docs/ios-app-starter-kit/`** (was `portfolio/iOS App Starter Kit v3/`); template **`HANDOFF_TEMPLATE.md`** (avoids confusion with repo-root session **`HANDOFF.md`**); Park Checklist README links to kit | Planning templates only — not a deployable app |
| 2026-04-04 | Park Checklist (iOS) | v1.0 | **Layout:** two-line leading toolbar (cash + rating), multiline status banner and task rows, bottom `safeAreaPadding`, top-aligned row icons | `ContentView.swift`, `ChecklistView.swift` |
| 2026-04-04 | Park Checklist (iOS) | v1.0 | Moved to **`portfolio/park-checklist-ios`** (was `projects/`); SwiftUI + SwiftData checklist, templates, JSON backup, top toolbar | Open **`portfolio/park-checklist-ios/ParkChecklist.xcodeproj`**; iOS Simulator runtime if needed |
| 2026-04-04 | Portfolio | — | **Handoff docs:** **`CLAUDE.md`** + **`HANDOFF.md`** state canonical routine for **Claude Code / non-Cursor**; **`.cursor/rules`** = Cursor-only mirror (**“Cursor only:”** line) | Avoid implying checklist is Cursor-only |
| 2026-04-04 | Portfolio | — | **Symlink** **`session-handoff.mdc`** in each **`portfolio/*`** app + **`projects/ai-dev-mastery/`** → monorepo root rule (subfolder Cursor workspaces) | **`CLAUDE.md`** note · relative path `../../../.cursor/rules/session-handoff.mdc` |
| 2026-04-04 | Portfolio | — | **Quick routine** in **`HANDOFF.md`** (top) + **`CLAUDE.md`** bullets; **`.cursor/rules/session-handoff.mdc`** (`alwaysApply`); **`.gitignore`** `!/.cursor/rules/**` | End session → update HANDOFF; new chat → templates; shipped → Linear + git; HANDOFF = now |
| 2026-04-04 | Portfolio | — | **`HANDOFF.md`** + **`docs/templates/SESSION_START_*.md`** for multi-agent continuity; **`CLAUDE.md`** link; **`.gitignore`** `!/HANDOFF.md` | Cross-tool session starts + living handoff state |
| 2026-04-04 | Portfolio | — | Legacy **`apps`**, **`Projects`**, **`growth-tracker-old`** from Documents → **`projects/archive/from-documents-20260404/`** (gitignored); **`docs/LEGACY_LOCAL_MIRRORS.md`**, **`projects/archive/README.md`**, `.gitignore`, doc refresh | Not on GitHub; see [LEGACY_LOCAL_MIRRORS.md](docs/LEGACY_LOCAL_MIRRORS.md) · [migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) |
| 2026-04-04 | Portfolio | — | **`~/Documents/apps`** + **`Projects`** moved to **`~/Documents/_archive_legacy_monorepo_20260404/`**; added **`docs/GLOSSARY.md`**; refreshed **DOCUMENTS_GIT_ARCHIVE_REMOVED** + **MONOREPO_MIGRATION** | Active code only under `~/Developer/chase/portfolio` + `projects/` |
| 2026-04-04 | Portfolio | — | **`~/Documents` git sunset:** deleted `.git-documents-archive-20260404` (~90MB metadata only); documented layout in `docs/DOCUMENTS_GIT_ARCHIVE_REMOVED.md` + `~/Documents/DOCUMENTS_NOT_A_GIT_REPO.txt` | Canonical repo: `~/Developer/chase` |
| 2026-04-04 | Portfolio | — | **Claude Usage Tool** fork → `projects/archive/claude-usage-tool/` (retired); Linear project **Canceled** | https://linear.app/whittaker/project/claude-usage-tool-a002c92c1688 · [migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) |
| 2026-04-04 | Portfolio | — | **Vercel Root Directory:** `wellness-tracker` → `portfolio/wellness-tracker`; `growth-tracker` → `portfolio/archive/growth-tracker` (archived app) | [migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) |
| 2026-04-04 | Portfolio | — | **`main` pushed** to `github.com/iamchasewhittaker/apps`; **Vercel Root Directory** → `portfolio/<app>` for wellnes-tracker, job-search-hq, app-forge, roller-task-tycoon | `git config http.postBuffer 524288000` if push 400 · [migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) |
| 2026-04-04 | Portfolio | — | Monorepo: **`Projects/` → `projects/`** (git mv via temp); root `.gitignore` + Money/YNAB/AI Dev docs and `analyze.py` paths; launch.json → `projects/ai-dev-mastery` | [migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) |
| 2026-04-04 | Portfolio | — | Retired top-level `apps/`: master `CLAUDE.md`, `ROADMAP.md`, `SUNSAMA_MCP_GUIDE.md`, `.claude/launch.json` → **repo root**; `.gitignore` whitelist updated | [migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) |
| 2026-04-04 | Portfolio | — | Monorepo: **Growth Tracker** → `portfolio/archive/growth-tracker`; retired docs + launch path; Linear **Growth Tracker** project **Canceled** | https://linear.app/whittaker/project/growth-tracker-9e99390538d6 · [migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) |
| 2026-04-04 | Portfolio | — | Monorepo migration: RollerTask at `portfolio/roller-task-tycoon` (was `apps/roller-task-tycoon`); cross-doc path + shared sync link updates; Vercel **Root Directory** → `portfolio/roller-task-tycoon` | Linear RollerTask project description updated · [migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37) |
| 2026-04-04 | RollerTask Tycoon | v1.0 | Audit: startup `pull` uses fresh `loadState()` + `hasLoaded` after pull (avoids stale `_syncAt`); notification toasts escape user text (XSS) | `src/main.js`, CHANGELOG, ARCHITECTURE |
| 2026-04-04 | Portfolio + RollerTask | — | Linear project **RollerTask Tycoon** + issues WHI-10…13 (Vercel, Supabase OTP, QA, backlog); `apps/CLAUDE.md` “Linear — project tracking”; README/AGENTS link | https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771 |
| 2026-04-03 | RollerTask Tycoon | v1.0 | New `apps/roller-task-tycoon`: Vite vanilla, Win95 UI, PWA manifest + Apple meta + safe-area, `chase_roller_task_v1` blob, shared Supabase `user_data` + `roller_task_tycoon_v1`, email OTP auth, docs parity (README/CLAUDE/AGENTS/CHANGELOG/ROADMAP/docs/adr), `vercel.json` | Deploy: Vercel root `apps/roller-task-tycoon`, `VITE_SUPABASE_*`; add URL to Supabase redirects · `/apps/CLAUDE.md` updated |
| 2026-04-03 | Wellness + Job Search | v15.10 / v8.3 | Email OTP + `verifyOtp`; removed Wellness PWA auth bypass; Magic link template + `{{ .Token }}` (CLAUDE samples, login hints, `.env.example`); CHANGELOG/`[Unreleased]` cleanup; `.claude/` gitignore + launch.json (Job Search); MASTER_FRAMEWORK; removed stale “wire Job Search sync” from Wellness CLAUDE | Dashboard → Authentication → Email Templates → Magic link · [passwordless OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp) |
| 2026-03-24 | All | — | Created CLAUDE.md files — master + per-app project instructions | `/apps/CLAUDE.md`, each app root |
| 2026-03-24 | Job Search | v8 | Refactored App.jsx (1,921→279 lines) into modular tabs + components | `tabs/`, `components/`, `constants.js` |
| 2026-03-24 | Shared | — | Created `/portfolio/shared/sync.js` — Supabase offline-first sync layer | Ready to wire; SQL schema in file comments |
| 2026-03-24 | Wellness | v15.8 | `save()` now stamps `_syncAt: Date.now()` for Supabase last-write comparison | `theme.js` |
| 2026-03-24 | Wellness | — | Created `.env.example` with Supabase env var docs | — |
| 2026-03-24 | Job Search | — | Created `.env.example` with Supabase env var docs | — |
| 2026-03-24 | All | — | Authored next-session Supabase onboarding prompt — includes guided project setup walkthrough | See Notes & Decisions Log |
| 2026-03-24 | Wellness | v15.8 | Latest batch of updates | — |
| 2026-03-24 | Job Search | v8 | Latest batch of updates | — |
| 2026-03-24 | App Forge | v8 | Latest batch of updates | — |
| 2026-03-24 | App Hub | — | sync.sh error handling added (set -e, validation) | — |
| 2026-03-23 | Growth | v6 | Retired — merged into Wellness GrowthTab | Data in chase_wellness_v1.growthLogs |
| 2026-03-24 | Wellness | v15.9 | Supabase sync live — auth gate, push/pull wired, `src/sync.js` created, symlink fix for CRA | `REACT_APP_` env vars; fallback mode if .env missing |
| 2026-03-24 | Wellness | v15.9 | Supabase env vars added to Vercel — deployed app at wellnes-tracker.vercel.app now has live sync | Supabase Site URL + redirect URL confirmed set; redeploy triggered; login verified on live URL |
| 2026-03-24 | Job Search | v8.1 | Supabase sync live — auth gate, push/pull wired, `src/sync.js` + `src/shared/sync.js` created | Same project/credentials as Wellness; data separated by app_key |
| 2026-03-24 | ROADMAP | — | Priority queue reordered, three next-session prompts written | See "Next Session Prompts" section |
| 2026-03-24 | ROADMAP | v1 | Created this document | Initial portfolio analysis |
| 2026-03-24 | Wellness | v15.9 | Supabase sync live — auth gate, push/pull wired, src/sync.js created, shared/sync.js copied as real file | REACT_APP_* env vars; Vercel env vars set; login verified on live URL |
| 2026-03-24 | Job Search | v8.1 | Supabase sync live — same pattern as Wellness; APP_KEY = 'job-search'; shared project, data separated by app_key | Same credentials as Wellness; Anthropic key stays local |
| 2026-03-24 | Job Search | v8.2 | Fixed auth bug: .env was pointing to wrong Supabase project (uwlfhxzeeleebjpiimrg) instead of shared wellness project | Added job-search-hq.vercel.app + localhost URLs to redirect allowlist; fixed .env.example VITE_ prefix |
| 2026-03-24 | Job Search | v8.2 | Redeployed to Vercel — fresh build with correct Supabase credentials baked in | Login screen confirmed at job-search-hq.vercel.app |
| 2026-03-24 | App Forge | v8.1 | Updated APP_SNAPSHOT_DEFAULTS to current versions; created CLAUDE.md; updated APP_META in job-search-hq App.jsx | Wellness v15.9, Job Search v8.2, Growth retired |
| 2026-03-25 | AI Dev Mastery | v1.0 | New standalone project set up at ~/Documents/Projects/ai-dev-mastery/; CRA scaffolded; 6 multiline string syntax errors fixed in App.jsx; dev server running on port 3004; GitHub repo created (private: iamchasewhittaker/ai-dev-mastery); added to launch.json | Standalone — not in /apps/ monorepo |
| 2026-03-31 | Wellness + Job Search | — | Fixed auth login loop: `onAuthStateChange` now wired before `getSession`, PKCE code detection added, explicit Supabase client auth options set | `App.jsx` + `src/shared/sync.js` in both apps |
| 2026-03-31 | Wellness + Job Search | — | Both apps deployed to Vercel with auth fix | wellness-tracker-kappa.vercel.app, job-search-hq.vercel.app |
| 2026-03-31 | All | — | Created Asana projects for Wellness Tracker and Job Search HQ | Two projects with sections: Active Development, Backlog, Infrastructure, Completed |

---

## Notes & Decisions Log

> Running log of architectural decisions and reasoning.

**2026-03-24 — Job Search auth fix (v8.2)**
Job Search .env was using a separate Supabase project (`uwlfhxzeeleebjpiimrg`) instead of the intended shared wellness project. Magic links were redirecting to `wellnes-tracker.vercel.app` (that project's Site URL), logging users into the wrong app. Root cause: job-search was set up with its own project rather than reusing wellness credentials as documented. Fixed: .env updated to wellness project (`unqtnnxlltiadzbqpyhh`). Added `job-search-hq.vercel.app` + localhost URLs to the shared project's redirect allowlist. One login now covers both apps. Also fixed wrong `VITE_` prefix in `.env.example`.

**2026-03-24 — Next session prompts written (items 3–5)**
Three copy-paste prompts written below for the next three sessions. See "Next Session Prompts" section. Prompts A and B are now complete — replaced with updated prompts.

**2026-03-24 — Supabase sync LIVE in Job Search HQ (v8.1)**
Job Search HQ is fully wired: `src/sync.js` created (APP_KEY = 'job-search'), `src/shared/sync.js` copied as a real file (not a symlink — symlinks break on Vercel), `push()` wired into save useEffect with `_syncAt` stamp, `pull()` wired into load useEffect, magic-link auth gate added, `@supabase/supabase-js` installed. Same Supabase project as Wellness — data is separated by app_key. Anthropic API key remains in localStorage only (never synced). Login screen confirmed working; zero console errors.

**2026-03-24 — Supabase sync LIVE in Wellness Tracker (v15.9)**
Wellness Tracker is fully wired: `src/sync.js` created, `push()` wired into save useEffect, `pull()` wired into load useEffect, magic-link auth gate added. `.env.example` fixed from `VITE_` to `REACT_APP_` prefix (this is CRA, not Vite). `@supabase/supabase-js` installed. Fallback mode active (no-op stubs) until `.env` is filled with real Supabase URL + anon key. Job Search HQ sync is next priority.

**2026-03-24 — Supabase sync infrastructure complete, wiring pending**
`/portfolio/shared/sync.js` is written and ready. Wellness `save()` already stamps `_syncAt`. Both apps have `.env.example`.

**2026-03-24 — localStorage-only is the current bottleneck**
All apps store data in browser localStorage. This means data is lost if the browser is cleared, unavailable on other devices, and can't be shared between apps on different domains. The recommended fix is Supabase as a sync backend. Priority: tackle Wellness first since it has the most daily writes and the most to lose.

**2026-03-24 — Job Search App.jsx refactored ✅**
Completed the refactor: App.jsx went from 1,921 → 279 lines. Split into `constants.js` (data/styles), 5 tab files, 9 component files, matching the Wellness v15.6 pattern. All tabs verified working in dev server with zero console errors.

**2026-03-24 — Growth Tracker officially retired**
growth-tracker app folder can be archived (zip + delete) once we confirm no unique data remains. All functionality and data migrated to Wellness Tracker's Growth tab.

**2026-03-24 — Ideas scattered across 3 places**
Wellness TasksTab has an Ideas sub-tab, Job Search has none, App Forge has an Ideas tracker. Consider App Forge as the canonical idea backlog and remove the Ideas sub-tab from Wellness (or make it a redirect link).

---

## Next Session Prompts

> Copy-paste these at the start of the relevant session. Each is self-contained.

---

### Prompt A — Split TrackerTab.jsx and HistoryTab.jsx

```
Read `/CLAUDE.md` (repo root) and `portfolio/wellness-tracker/CLAUDE.md` before starting.

Two tabs in Wellness Tracker are too large and need splitting:
- tabs/TrackerTab.jsx (~78K) — contains morning check-in form, evening check-in form, and PulseCheckModal
- tabs/HistoryTab.jsx (~58K) — contains history list, analytics charts, AI summary, data export, and WinLogger

This is the same problem App.jsx had before the v15.6 refactor (was 1,900+ lines, now ~370).

Task: Split both files using the same pattern as the v15.6 App.jsx refactor.

For TrackerTab.jsx — proposed split:
- tabs/TrackerTab.jsx — thin shell, imports sub-components, exports MORNING_SECTIONS, EVENING_SECTIONS, getCheckinMode, PulseCheckModal (keep exports intact — App.jsx imports these)
- tabs/tracker/MorningForm.jsx — morning check-in form sections
- tabs/tracker/EveningForm.jsx — evening check-in form sections
- tabs/tracker/PulseCheckModal.jsx — pulse check modal (currently exported from TrackerTab)

For HistoryTab.jsx — proposed split:
- tabs/HistoryTab.jsx — thin shell, imports sub-components, exports WinLogger (App.jsx imports this)
- tabs/history/HistoryList.jsx — the entries list view
- tabs/history/Analytics.jsx — charts and stats
- tabs/history/AISummary.jsx — Claude AI monthly summary
- tabs/history/ExportTools.jsx — data export (File System API)
- tabs/history/WinLogger.jsx — win log component (currently exported from HistoryTab)

Rules:
- Keep all existing exports from TrackerTab.jsx and HistoryTab.jsx intact — App.jsx imports from these files and must not need changes
- No new localStorage keys, no new state in sub-components — all state stays in App.jsx and flows down as props
- Inline styles only, no CSS files
- Start the dev server after each file is split and verify no errors before moving to the next

After splitting, update ROADMAP.md changelog and mark items 5 and 6 done. Update wellness-tracker/CLAUDE.md file structure.
```

---

### Prompt B — Wire Supabase sync into App Forge

```
Read `/CLAUDE.md` (repo root) and `portfolio/app-forge/CLAUDE.md` before starting.

Supabase sync is live in Wellness (v15.9) and Job Search (v8.2) using a shared project.
App Forge is the next app in the rollout.

What's already done:
- Shared Supabase project: unqtnnxlltiadzbqpyhh (wellness-tracker)
- /portfolio/shared/sync.js — createSync() factory ✅
- wellness-tracker/src/sync.js and job-search-hq/src/sync.js — wiring examples ✅
- Both existing apps use APP_KEY to separate data in the shared user_data table ✅

Task: Wire Supabase sync into App Forge using the same pattern.

Steps:
1. Create app-forge/src/sync.js — same pattern, APP_KEY = 'app-forge'
2. Copy shared/sync.js into app-forge/src/shared/sync.js (real file, NOT symlink)
3. Copy app-forge/.env.example → app-forge/.env, fill with SAME credentials as wellness and job-search
   (same Supabase project — data separated by app_key)
4. npm install @supabase/supabase-js in app-forge/
5. Wire pull() + push() + auth gate into app-forge/src/App.jsx
6. Add REACT_APP_SUPABASE_URL + REACT_APP_SUPABASE_ANON_KEY to Vercel env vars for app-forge project

After wiring, verify login screen appears and sync works. Update ROADMAP.md and app-forge/CLAUDE.md.
```

---

### Prompt C — Cross-app navigation bar

```
Read `/CLAUDE.md` (repo root) before starting.

All three active apps share the same Supabase auth session (same project: unqtnnxlltiadzbqpyhh).
A user logged into one app is automatically logged into the others. But there's no UI to navigate between them.

Task: Add a minimal cross-app navigation bar to all three apps (Wellness, Job Search, App Forge).

Design:
- A small fixed or sticky row at the very top of each app (above the existing header)
- Shows the current app name (highlighted) + links to the other two
- Links: "💪 Wellness" → wellnes-tracker.vercel.app | "🎯 Job Search" → job-search-hq.vercel.app | "🔧 Forge" → app-forge-fawn.vercel.app
- Style: dark background, small text, minimal height (~28px) — doesn't compete with app UI
- No new state, no new localStorage keys — purely presentational

Rules:
- Inline styles only (no CSS files)
- Add to App.jsx in each app (above the main app wrapper)
- Keep it simple — this is a nav strip, not a full shell

After adding, update ROADMAP.md changelog and mark item 14 done.
```

---

## How to Use This File

1. **Weekly review:** Check Priority Queue, move tasks from Idea → Planned → In Progress → Done
2. **After each deploy:** Add a row to the Change Log table
3. **New idea:** Add to Priority Queue with status 💡 Idea, app, and effort estimate
4. **Architecture decision:** Add a dated entry to Notes & Decisions Log
5. **App Hub:** Consider automating updates to Change Log via sync.sh

---

*Generated 2026-03-24. Update as you ship.*
