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
| **Linear**     | [Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7) · [Park Checklist / RollerTask (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e)                                                                         |
| **Focus**      | **Shared auth: canonical host strategy shipped across all 6 web apps.** Shared `src/shared/auth.js` added to all apps (canonical-host redirect, session key consolidation, OTP `emailRedirectTo`). Supabase Site URL + redirect allowlist updated on both projects (`unqtnnxlltiadzbqpyhh` + `uwlfhxzeeleebjpiimrg`) to `https://apps.chasewhittaker.com`. Vercel env vars `REACT_APP_AUTH_CANONICAL_ORIGIN` + `REACT_APP_AUTH_APP_PATH` set in production for all 6 apps. Linear: [WHI-29](https://linear.app/whittaker/issue/WHI-29). |
| **Next**       | Redeploy apps to pick up new env vars (push to main or manual `vercel --prod`). Run manual verification matrix from `AUTH_PERSISTENCE_TEST_RESULTS.md` in production (page refresh, tab close/reopen, cross-app nav, overnight idle, iOS OTP). |
| **Blockers**   | None. |
| **Last touch** | 2026-04-14 — Shared auth bootstrap + Supabase config + Vercel env vars all set. All 6 app CHANGELOGs updated. |


---

## Fresh session prompt — continue Clarity Budget (v0.2+)

Use a **new** chat after `checkpoint`. Paste:

```
Read CLAUDE.md and this HANDOFF.md first, then portfolio/clarity-budget-ios/CLAUDE.md and portfolio/clarity-budget-ios/HANDOFF.md.

Goal: Continue Clarity Budget iOS at portfolio/clarity-budget-ios/.

Current state: Phase 4 MVP v0.1 shipped — dual scenarios + wants aggregate; PBX prefix CB; store key chase_budget_ios_v1; ClarityUI via ../clarity-ui; **launcher** = stacked coins + [`docs/BRANDING.md`](portfolio/clarity-budget-ios/docs/BRANDING.md).

Pick next work from portfolio/clarity-budget-ios/ROADMAP.md (or fix bugs). Follow existing patterns: @Observable @MainActor store, @MainActor on views that mutate the store from nested Button builders, StorageHelpers persistence.

Verify:
  cd portfolio/clarity-budget-ios && xcodebuild -scheme ClarityBudget -showdestinations
  xcodebuild build -scheme ClarityBudget -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO
  xcodebuild test  -scheme ClarityBudget -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' CODE_SIGNING_ALLOWED=NO

Update CHANGELOG [Unreleased], app ROADMAP, app HANDOFF, root ROADMAP Change Log, and this file’s State when you stop.
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

Update CHANGELOG [Unreleased], app ROADMAP, app HANDOFF, root ROADMAP Change Log, and this file’s State when you stop.
```

---

## Notes (optional, human + long-lived context)

- **Clarity iOS split plan:** `~/.claude/plans/stateful-wondering-puppy.md` — 5 apps + ClarityUI, build order, accessibility requirements, quotes per app.
- **ClarityUI package:** `portfolio/clarity-ui/` — iOS 17+ / macOS 14+. Compiles clean via `swift build`. SwiftUI tests can't run on macOS host (no display); use `xcodebuild` with simulator for real testing.
- **clarity-checkin-ios HANDOFF:** `portfolio/clarity-checkin-ios/HANDOFF.md` — Phase 1 complete; **`docs/BRANDING.md`** + **AppIcon** 1024; new apps copy **`docs/templates/PORTFOLIO_APP_BRANDING.md`** once; shared icon geometry **`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`**.
- **clarity-triage-ios HANDOFF:** `portfolio/clarity-triage-ios/HANDOFF.md` — Phase 2 complete; **`docs/BRANDING.md` + AppIcon** (nested chevron). `xcodebuild -showdestinations` if “iPhone 16” is missing.
- **clarity-time-ios (Phase 3):** `portfolio/clarity-time-ios/HANDOFF.md` — **v0.1**; `CX*`; **`docs/BRANDING.md` + AppIcon** (clock + arc + badge).
- **clarity-budget-ios (Phase 4):** `portfolio/clarity-budget-ios/HANDOFF.md` — **v0.1**; **`CB`**; **`docs/BRANDING.md` + AppIcon** (stacked coins); explore wides in `docs/design/`.
- **clarity-growth-ios (Phase 5):** `portfolio/clarity-growth-ios/HANDOFF.md` — **v0.1**; **`CG`**; **`docs/BRANDING.md` + AppIcon** (sprout); explore wides in `docs/design/`.
- **Clarity Hub (2026-04-13):** `portfolio/clarity-hub/HANDOFF.md` — v0.2; 5 tabs (Check-in, Triage, Time, Budget, Growth); YNAB + RollerTask split to standalone apps; nav links to both. Deployed at https://clarity-hub-lilac.vercel.app.
- **YNAB Clarity Web (2026-04-13):** `portfolio/ynab-clarity-web/HANDOFF.md` — v1.0; standalone YNAB dashboard; storage key `chase_hub_ynab_v1`; Supabase `app_key = 'ynab'`. Deployed at https://ynab-clarity-web.vercel.app.
- **RollerTask Tycoon Web (2026-04-13):** `portfolio/rollertask-tycoon-web/HANDOFF.md` — v1.0; standalone task/points tracker; storage key `chase_hub_rollertask_v1`; Supabase `app_key = 'rollertask'`. Deployed at https://rollertask-tycoon-web.vercel.app.
- **Vercel git connections (2026-04-14):** Connected 7 Vercel projects to GitHub (`iamchasewhittaker/apps`) that previously showed "Connect Git Repository" in the dashboard. Used `scripts/vercel-check-git --fix` for 6 projects + manual `vercel link` for roller-task-tycoon (archived). Connected: clarity-command, clarity-hub, knowledge-base, rollertask-tycoon-web, wellness-tracker, ynab-clarity-web, roller-task-tycoon. All auto-deploy on push to `main` now.
- **Portfolio web CI (2026-04-13-14):** GitHub Actions [`.github/workflows/portfolio-web-build.yml`](.github/workflows/portfolio-web-build.yml) uses **Node 20** and `npm ci`. Regenerate **`package-lock.json`** with Node 20’s npm (not only Node 24/npm 11) so CI stays green -- see [`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`](docs/templates/SESSION_START_FIX_CI_LOCKFILES.md).
- **Security fixes (2026-04-12):** SEC-001 PII in constants.js (phone/salary redacted), SEC-002 Gmail OAuth token in gitignore, SEC-003 hardcoded email → env var, SEC-004 .build/ gitignored + git rm --cached, SEC-005 YNAB category UUIDs (accepted risk), SEC-006 Supabase project ID replaced, SEC-007 iCloud aliases replaced in gmail-filters.xml, SEC-008 .env added to app-forge gitignore.
- **Wellness Tracker per-app handoff:** `portfolio/wellness-tracker/HANDOFF.md` (web) and `portfolio/wellness-tracker-ios/HANDOFF.md` (now archived shell — superseded by Clarity apps).
- **YNAB Clarity (2026-04-11):** `goal_target` on `YNABMonthCategory`, Bills by coverage, `dueDay`, Income tab, `TipBanner`, `HowItWorksView`, PATCH Fund; spending chips; safe-to-spend formula; stale sync banner.
- **YNAB API write:** `PATCH` updates `budgeted` (assigned) only; confirmation before Fund.
- *(Decisions, links to PRs/commits, "parked" ideas.)*

---

## Templates (copy from repo)


| Situation                                                     | File                                                                                     |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| New initiative, migration, or cross-app work                  | [docs/templates/SESSION_START_MONOREPO.md](docs/templates/SESSION_START_MONOREPO.md)     |
| Change one app under `portfolio/<app>/` or `projects/<name>/` | [docs/templates/SESSION_START_APP_CHANGE.md](docs/templates/SESSION_START_APP_CHANGE.md) |
| **Portfolio web CI** — `npm ci` / lockfile failures (Wellness, Job Search, Knowledge Base, App Forge) | [docs/templates/SESSION_START_FIX_CI_LOCKFILES.md](docs/templates/SESSION_START_FIX_CI_LOCKFILES.md) |
| **Clarity iOS** — fix / iterate **launcher icon** (name app in chat) | [docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md](docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md) |


