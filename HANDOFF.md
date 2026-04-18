# Handoff — multi-agent / multi-session work

**Living file.** Keep the **State** block short and current so any tool (Claude Code, Cursor, Codex, Antigravity) can resume without re-reading the whole thread.

---

## Every Session — 3 Steps

### 1. CHECKPOINT first

Run `checkpoint` in Terminal before touching anything.
This saves a git snapshot so you can always get back to where you started.

### 2. Tell the tool what you're doing


| Tool                      | How to start                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude Code**           | Paste `docs/templates/SESSION_START_APP_CHANGE.md` (one app) or `SESSION_START_MONOREPO.md` (cross-cutting). Say: *"Read CLAUDE.md and HANDOFF.md first."* |
| **Cursor**                | Open the project folder — `.cursor/rules/session-handoff.mdc` auto-loads. Still paste the template for goal context.                                       |
| **Antigravity (VS Code)** | Open the project folder — reads `CLAUDE.md` automatically. Paste the template for goal context.                                                            |
| **Codex (OpenAI)**        | Paste `CLAUDE.md` intro + this file's **State** table into the prompt, then paste the template.                                                            |
| **Xcode only**            | Just run `checkpoint` — that's your safety net. No template needed for Xcode-only edits.                                                                   |


### 3. Checkpoint when done

Run `checkpoint` again when you stop (or let AI tools do it).

**AI session deliverables** (AI tools handle these automatically):

- Code committed via `checkpoint` or explicit commit
- App `CHANGELOG.md` updated under `## [Unreleased]`
- App `ROADMAP.md` updated (mark done, add ideas)
- Root `ROADMAP.md` Change Log row added
- `HANDOFF.md` State table updated (Focus, Next, Last touch)
- App `LEARNINGS.md` updated if something went wrong or was learned

**Xcode-only session:** run `checkpoint` — that's the minimum.

---

## Recovery — if something breaks

```
restore          # shows your last 15 saves, numbered
restore 3        # go back to save #3 (auto-saves current state first — nothing is lost)
restore 2        # undo a restore
```

---

## When to start a **new** chat (and use this file)

Start a **new** conversation when:

- **Context is full** or the model gets vague / forgets earlier constraints.
- You **switch products** (e.g. Cursor → Claude Code → Codex).
- You start a **different task** (new Linear issue or unrelated goal).
- The old thread is **noisy** and a clean prompt + `HANDOFF.md` is faster than scrolling.

You can **stay** in one chat when:

- You are iterating on the **same** task in one sitting and context still feels accurate.
- You are doing **small follow-ups** right after a commit.

**Whenever you start a new chat**, paste the contents of the right template from [docs/templates/](docs/templates/) and say: *"Read `CLAUDE.md` and `HANDOFF.md` first."*

## When to **update** this file

Update **State** (and optionally **Notes**) when:

- You **stop for the day** or switch to another agent.
- You **merge / push** and the "next step" changes.
- You **discover a blocker** or change scope.

Do **not** duplicate `CLAUDE.md` or long architecture here — link to issues and commits instead.

---

## State (agents: read this first)


| Field          | Value                                                                                                                                                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Workspace**  | `~/Developer/chase`                                                                                                                                                                                                                                                        |
| **Branch**     | `main`                                                                                                                                                                                                                                                                     |
| **Linear**     | [Portfolio Governance & Report Infrastructure](https://linear.app/whittaker/project/portfolio-governance-and-report-infrastructure-28044a8f312b) (WHI-30 to WHI-51, 22 issues) · [Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7) · [Park Checklist / RollerTask (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) · [Job Search HQ (web + iOS umbrella)](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) |
| **Focus**      | **Branding shipped (2026-04-17).** Unnamed web: chalk white `#F5F5F0` UN logo, deployed to [unnamed-wine.vercel.app](https://unnamed-wine.vercel.app). Clarity Command web: electric sky `#7DF9FF` CC logo, deployed to [clarity-command.vercel.app](https://clarity-command.vercel.app). Both have canonical design/ SVGs, icon pipelines, and full PWA icon sets. Unnamed iOS rebuilt and installed on iPhone 12 Pro Max. |
| **Next**       | 1. **Unnamed iOS:** Use for 7 days — no features until then. 2. **Fix Vercel/GitHub connection for Unnamed** — at 10-project limit, need to disconnect a stale project first (see Blockers). 3. **WHI-24 — Wave 3 #2 stage-specific prep templates** (Job Search HQ web). |
| **Blockers**   | **Vercel/GitHub connection limit:** GitHub repo `iamchasewhittaker/apps` is already connected to 10 Vercel projects — Unnamed auto-deploy could not be wired up. To fix: go to Vercel dashboard → disconnect a stale/retired project from the repo → then run `vercel git connect https://github.com/iamchasewhittaker/apps.git --yes` from `portfolio/unnamed/`. |
| **Last touch** | 2026-04-17 — Branding: P6-style logos for Unnamed + Clarity Command. Both deployed to Vercel. Unnamed iOS rebuilt + installed on device. |


---

## Fresh session prompt — continue Unnamed

Use a **new** chat after `checkpoint`. Paste:

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/unnamed-ios/CLAUDE.md and portfolio/unnamed-ios/HANDOFF.md.

Goal: Continue Unnamed iOS at portfolio/unnamed-ios/.

State (2026-04-17): Phase 1 complete. All 5 flows (capture/sort/lock/focus/check), @Observable store, UserDefaults, 10/10 tests, installed on iPhone 12 Pro Max.
Phase 1 rule: NO new features until Chase has used the app for 7 days.

Web app is at portfolio/unnamed/ — also Phase 1, not yet deployed to Vercel.

Priority:
1. Deploy to Vercel: vercel project add summit-push --scope iamchasewhittakers-projects → vercel link → vercel git connect → vercel --prod
2. Generate PWA icons (192px + 512px) — cairn/mountain theme, dark background
3. Install on phone as PWA, verify all 5 flows work on mobile

Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + pnpm + localStorage
Key: summit_push_v1 | Anti-features: no settings, no priorities, no tags, 4 lanes max forever

Run checkpoint before edits. Update CHANGELOG / ROADMAP / HANDOFF when done.
```

---

## Fresh session prompt — Sprint 1 kickoff + TrackerTab split

Use a **new** chat after `checkpoint`. Paste:

```
Read CLAUDE.md and HANDOFF.md first.

Goal: Sprint 1 kickoff — TrackerTab split (WHI-42).

Current state (2026-04-14):
- iOS device test session complete: 7 apps build, /handoff skill, motto everywhere, Linear User Stories + story points.
- Sprint 1 NOT YET CREATED in Linear UI — needs manual cycle: 2026-04-21 to 2026-05-04, assign WHI-42 (8pt) + WHI-23 (2pt) + WHI-35 (2pt) + WHI-49 (1pt) = 13 pts.
- WHI-42: Split TrackerTab.jsx (1420 lines) into morning/evening sub-components.

Priority:
1. Read portfolio/wellness-tracker/src/tabs/TrackerTab.jsx — understand morning vs evening sections.
2. Plan the split (morning form, evening form, shared helpers).
3. Implement — keep all props/behavior identical.
4. Test: npm start, verify both check-in flows work.

Run checkpoint before edits. Update CHANGELOG / ROADMAP / HANDOFF when done.
```

---

## Fresh session prompt — continue governance Phase 2+

Use a **new** chat after `checkpoint`. Paste:

```
Read CLAUDE.md and HANDOFF.md first.

Goal: Continue Portfolio Governance — Phase 2 next items.

Current state (2026-04-14):
- Phase 1 complete: all 6 governance docs, health check, PRODUCT_LINES.md confirmed.
- WHI-52/38/40 all done: AppNav shipped to Clarity Hub + Job Search HQ; 0 shared file drift; PRODUCT_LINES.md exists.
- Shared files tracked by health check: sync.js, auth.js, ui.jsx — 14/14 green.

Priority queue (pick from governance backlog):
1. Deploy clarity-hub + job-search-hq to Vercel (vercel --prod) to ship AppNav live.
2. WHI-39: Executive report automation.
3. WHI-42: CI/CD pipeline improvements.
4. WHI-43: Portfolio dashboard.

Run checkpoint before edits. Update CHANGELOG / ROADMAP / HANDOFF when done.
```

## Fresh session prompt — continue Clarity Command iOS (v0.2+)

Use a **new** chat after `checkpoint`. Paste:

```
Read CLAUDE.md and this HANDOFF.md first, then portfolio/clarity-command-ios/CLAUDE.md and portfolio/clarity-command-ios/HANDOFF.md.

Goal: Continue Clarity Command iOS at portfolio/clarity-command-ios/.

Current state: Phase 6 MVP v0.1 shipped — 3-tab SwiftUI app (Mission/Scoreboard/Settings), CommandStore with conviction system, 26 Swift source files, gold accent (#c8a84b), 14/14 unit tests, all 6 Clarity apps on iPhone 12 Pro Max. PBX prefix CD; store key chase_command_ios_v1; ClarityUI via ../clarity-ui; docs/BRANDING.md written.

Pick next work from portfolio/clarity-command-ios/ROADMAP.md (or fix bugs). Follow existing patterns: @Observable @MainActor store, @MainActor on views with computed properties accessing the store, StorageHelpers persistence.

Verify:
  cd portfolio/clarity-command-ios && xcodebuild -scheme ClarityCommand -showdestinations
  xcodebuild build -scheme ClarityCommand -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO
  xcodebuild test  -scheme ClarityCommand -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO

Update CHANGELOG [Unreleased], app ROADMAP, app HANDOFF, root ROADMAP Change Log, and this file's State when you stop.
```

## Fresh session prompt — continue Clarity Budget (v0.2+)

Use a **new** chat after `checkpoint`. Paste:

```
Read CLAUDE.md and this HANDOFF.md first, then portfolio/clarity-budget-ios/CLAUDE.md and portfolio/clarity-budget-ios/HANDOFF.md.

Goal: Continue Clarity Budget iOS (+ optional web in portfolio/clarity-budget-web) at portfolio/clarity-budget-ios/.

Current state: **v0.2 MVP shipped** — **Today** tab (YNAB safe to spend month/week/day) + **web companion** (same STS math, optional Supabase blob); **Settings** = full YNAB (token, budget, roles, import Baseline, PATCH fund); dual scenarios + wants; `_syncAt` + **stub** `BudgetSupabaseSync` on iOS (wire supabase-swift next); PBX prefix **CB**; store key `chase_budget_ios_v1`; ClarityUI via `../clarity-ui`; launcher = stacked coins + [`docs/BRANDING.md`](portfolio/clarity-budget-ios/docs/BRANDING.md).

Pick next work from portfolio/clarity-budget-ios/ROADMAP.md (or fix bugs). Follow existing patterns: `@MainActor` `@Observable` store (`BudgetStore`), `@MainActor` on views that mutate the store from nested Button builders, `StorageHelpers` persistence.

Verify:
  cd portfolio/clarity-budget-ios && xcodebuild -scheme ClarityBudget -showdestinations
  xcodebuild build -scheme ClarityBudget -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO
  xcodebuild test  -scheme ClarityBudget -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO

Update CHANGELOG [Unreleased], app ROADMAP, app HANDOFF, root ROADMAP Change Log, and this file's Notes (clarity-budget-ios bullet) when you stop.
```

## Fresh session prompt — continue Clarity Growth (v0.2+)

Use a **new** chat after `checkpoint`. Paste:

```
Read CLAUDE.md and this HANDOFF.md first, then portfolio/clarity-growth-ios/CLAUDE.md and portfolio/clarity-growth-ios/HANDOFF.md.

Goal: Continue Clarity Growth iOS at portfolio/clarity-growth-ios/.

Current state: Phase 5 MVP v0.1 shipped — 7 growth areas + streak-aware session logging/history; PBX prefix CG; store key chase_growth_ios_v1; ClarityUI via ../clarity-ui; **launcher** = sprout + [`docs/BRANDING.md`](portfolio/clarity-growth-ios/docs/BRANDING.md).

Pick next work from portfolio/clarity-growth-ios/ROADMAP.md (or fix bugs). Follow existing patterns: @Observable @MainActor store, @MainActor on views that mutate store from nested Button builders, StorageHelpers persistence.

Verify:
  cd portfolio/clarity-growth-ios && xcodebuild -scheme ClarityGrowth -showdestinations
  xcodebuild build -scheme ClarityGrowth -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO
  xcodebuild test  -scheme ClarityGrowth -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO

Update CHANGELOG [Unreleased], app ROADMAP, app HANDOFF, root ROADMAP Change Log, and this file's State when you stop.
```

---

## Notes (optional, human + long-lived context)

- **Linear — Job Search HQ (applied 2026-04-15):** Project [Overview](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) updated via API (iOS companion section + commit link); short description mentions iOS v0.1. Done issue **[WHI-53](https://linear.app/whittaker/issue/WHI-53/jshq-ios-v01-device-install-brand)** — *JSHQ iOS v0.1 — device install + brand* (links [fdecbb1](https://github.com/iamchasewhittaker/apps/commit/fdecbb1)).

- **Governance Phase 1 (2026-04-14):** `scripts/portfolio-health-check` (LOC, commits/30d, URL liveness, sync drift, npm audit, secrets scan, doc freshness) · `docs/governance/` (KPI_DICTIONARY.md, SECURITY_CHECKLIST.md, OPERATING_MODEL.md, ARCHIVE_POLICY.md, LAUNCH_CHECKLIST.md) · report templates rewritten · Linear project WHI-30 to WHI-51. **Phase 1 still missing: PRODUCT_LINES.md → WHI-52.**
- **Health check baseline (2026-04-14):** 33,355 LOC / 19 apps / 8 live URLs all 200 / 6 sync.js drift instances / 0 hardcoded secrets / top monoliths: TrackerTab.jsx (1420), TasksTab.jsx (1192), HistoryTab.jsx (1113), App Forge App.jsx (1075) / most active 30d: job-search-hq (22), wellness-tracker (18), ynab-clarity-ios (16), knowledge-base (15).
- **Phase 2 priority queue:** ~~WHI-36 shared code registry~~ done · ~~WHI-37 Job Search HQ launch polish~~ done · ~~WHI-41 scripts/new-app shared files~~ done · ~~WHI-52 Product Lines doc~~ done (confirmed existing) · ~~WHI-38 ecosystem consistency~~ done (0 drift) · ~~WHI-40 cross-app nav bar~~ done (AppNav shipped to Clarity Hub + Job Search HQ).
- **WHI-40 delivered (2026-04-14):** `AppNav` + `resolveAppUrl` in `portfolio/shared/ui.jsx`; copied to `src/shared/ui.jsx` in clarity-hub and job-search-hq. Clarity Hub: replaces inline `EXTERNAL_LINKS` in NavTabs. Job Search HQ: new nav bar between header and tabs. Health check now tracks `sync.js`, `auth.js`, `ui.jsx` — 14/14 green checks, 0 drift.
- **WHI-38 delivered (2026-04-14):** `scripts/portfolio-health-check` expanded from `sync.js`-only to `(sync.js auth.js ui.jsx)`. Synced canonical `sync.js` to all 6 apps (comment-only drift). All shared files: 0 drift.
- **WHI-36 delivered (2026-04-14, commit 8e75952):** `portfolio/shared/` — `auth.js` (canonical auth: `getAuthConfig`, `maybeRedirectToCanonical`, `createPortfolioAuthClient`, `getEmailRedirectUrl`); `storage.js` (createStorage factory with `_syncAt`); `ErrorBoundary.jsx`; `ui.jsx` (Card + NavTabs); updated `sync.js`. `scripts/new-app` now copies all 5 shared files into `src/shared/` on scaffold.
- **WHI-37 delivered (2026-04-14, commit 8e75952):** Job Search HQ — `docs/BRANDING.md` (palette, typography, component patterns), `LAUNCH_CHECKLIST.md` (all 4 gates; external beta flagged open), `README.md` user-facing description, `CLAUDE.md` links branding.
- **Uncommitted batch:** ~20 file modifications still outstanding — app icons (6 iOS + web), session templates, Knowledge Base constants, rollertask-tycoon-web + ynab-clarity-web public files, new scripts. Run `checkpoint` before new feature work.
- **Clarity iOS split plan:** `~/.claude/plans/stateful-wondering-puppy.md` — 5 apps + ClarityUI, build order, accessibility requirements, quotes per app.
- **ClarityUI package:** `portfolio/clarity-ui/` — iOS 17+ / macOS 14+. Compiles clean via `swift build`. SwiftUI tests can't run on macOS host (no display); use `xcodebuild` with simulator for real testing.
- **clarity-checkin-ios HANDOFF:** `portfolio/clarity-checkin-ios/HANDOFF.md` — Phase 1 complete; **`docs/BRANDING.md`** + **AppIcon** 1024; new apps copy **`docs/templates/PORTFOLIO_APP_BRANDING.md`** once; shared icon geometry **`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`**.
- **clarity-triage-ios HANDOFF:** `portfolio/clarity-triage-ios/HANDOFF.md` — Phase 2 complete; **`docs/BRANDING.md` + AppIcon** (nested chevron). `xcodebuild -showdestinations` if "iPhone 16" is missing.
- **clarity-time-ios (Phase 3):** `portfolio/clarity-time-ios/HANDOFF.md` — **v0.1**; `CX*`; **`docs/BRANDING.md` + AppIcon** (clock + arc + badge).
- **clarity-budget-ios:** `portfolio/clarity-budget-ios/HANDOFF.md` — **v0.2** — Today (STS) + **clarity-budget-web** + YNAB (Keychain `com.chasewhittaker.ClarityBudget`, import Baseline, fund category); stub iOS Supabase; **`CB`**; **`docs/BRANDING.md` + AppIcon** (stacked coins); **`xcodebuild test`** ✅ + Simulator recovery notes in app **`LEARNINGS.md`**.
- **clarity-growth-ios (Phase 5):** `portfolio/clarity-growth-ios/HANDOFF.md` — **v0.1**; **`CG`**; **`docs/BRANDING.md` + AppIcon** (sprout); explore wides in `docs/design/`.
- **clarity-command-ios (Phase 6):** `portfolio/clarity-command-ios/HANDOFF.md` — **v0.1+**; **`CD`**; gold accent (`#c8a84b`); 3 tabs; **Supabase** `command` row + Settings sync UI; interim AppIcon (`tools/generate_app_icon.py`); `docs/DEVICE_QA.md`. Next: device QA checklist, final AppIcon glyph, widgets/push/Siri.
- **Clarity Hub (2026-04-13):** `portfolio/clarity-hub/HANDOFF.md` — v0.2; 5 tabs (Check-in, Triage, Time, Budget, Growth); YNAB + RollerTask split to standalone apps; nav links to both. Deployed at https://clarity-hub-lilac.vercel.app.
- **YNAB Clarity Web (2026-04-13):** `portfolio/ynab-clarity-web/HANDOFF.md` — v1.0; standalone YNAB dashboard; storage key `chase_hub_ynab_v1`; Supabase `app_key = 'ynab'`. Deployed at https://ynab-clarity-web.vercel.app.
- **RollerTask Tycoon Web (2026-04-13):** `portfolio/rollertask-tycoon-web/HANDOFF.md` — v1.0; standalone task/points tracker; storage key `chase_hub_rollertask_v1`; Supabase `app_key = 'rollertask'`. Deployed at https://rollertask-tycoon-web.vercel.app.
- **Shared auth (2026-04-14):** Canonical host strategy shipped across all 6 web apps (WHI-29). `src/shared/auth.js` added. Supabase Site URL + redirect allowlist updated. Vercel env vars `REACT_APP_AUTH_CANONICAL_ORIGIN` + `REACT_APP_AUTH_APP_PATH` set for all 6 apps. Redeploy still needed to pick up new env vars.
- **iOS device test session (2026-04-14):** All 7 iOS apps built for physical device (iPhone 12 Pro Max, UDID `00008101-000630D01161001E`, Team `9XVT527KP3`). ClarityCheckin had existing profile; other 6 needed `-allowProvisioningUpdates`. `/handoff` slash command created at `.claude/commands/handoff.md`. PreCompact hook added to `.claude/settings.local.json` (gitignored). Mission motto added to all 19 CLAUDE.md files + `scripts/new-app`. 10 Linear issues converted to User Story format with Fibonacci story points (WHI-42 8pt, WHI-43 8pt, WHI-20 13pt, WHI-45 5pt, WHI-24 5pt, WHI-27 3pt, WHI-23 2pt, WHI-35 2pt, WHI-49 1pt, WHI-44 8pt). Sprint 1 needs manual setup in Linear UI (no `create_cycle` API).
- **Vercel git connections (2026-04-14):** Connected 7 Vercel projects to GitHub (`iamchasewhittaker/apps`) via `scripts/vercel-check-git --fix`. All auto-deploy on push to `main`.
- **Portfolio web CI (2026-04-13-14):** GitHub Actions [`.github/workflows/portfolio-web-build.yml`](.github/workflows/portfolio-web-build.yml) uses **Node 20** and `npm ci`. Regenerate **`package-lock.json`** with Node 20's npm — see [`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`](docs/templates/SESSION_START_FIX_CI_LOCKFILES.md).
- **Security fixes (2026-04-12):** SEC-001 PII in constants.js, SEC-002 Gmail OAuth token gitignore, SEC-003 hardcoded email → env var, SEC-004 .build/ gitignored, SEC-005 YNAB UUIDs (accepted), SEC-006 Supabase project ID replaced, SEC-007 iCloud aliases replaced, SEC-008 .env in app-forge gitignore.
- **Wellness Tracker per-app handoff:** `portfolio/wellness-tracker/HANDOFF.md` (web) and `portfolio/wellness-tracker-ios/HANDOFF.md` (archived — superseded by Clarity apps).
- **YNAB Clarity (2026-04-11):** `goal_target` on `YNABMonthCategory`, Bills by coverage, `dueDay`, Income tab, `TipBanner`, `HowItWorksView`, PATCH Fund; spending chips; safe-to-spend formula; stale sync banner.
- **YNAB API write:** `PATCH` updates `budgeted` (assigned) only; confirmation before Fund.
- *(Decisions, links to PRs/commits, "parked" ideas.)*

---

## Templates (copy from repo)


| Situation                                                     | File                                                                                     |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| New initiative, migration, or cross-app work                  | [docs/templates/SESSION_START_MONOREPO.md](docs/templates/SESSION_START_MONOREPO.md)     |
| Change one app under `portfolio/<app>/` or `projects/<name>/` | [docs/templates/SESSION_START_APP_CHANGE.md](docs/templates/SESSION_START_APP_CHANGE.md) |
| **Portfolio web CI** — `npm ci` / lockfile failures           | [docs/templates/SESSION_START_FIX_CI_LOCKFILES.md](docs/templates/SESSION_START_FIX_CI_LOCKFILES.md) |
| **Clarity iOS** — fix / iterate launcher icon                 | [docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md](docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md) |
