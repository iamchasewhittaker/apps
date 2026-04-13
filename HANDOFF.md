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
| **Focus**      | **Knowledge Base v1.3** — category organization + importance ranking. **Clarity iOS:** Check-in + **Triage + Time** now have shipped `AppIcon.png`, wide mockups under each app’s `docs/design/`, and `docs/BRANDING.md` (see root `ROADMAP.md` Change Log). |
| **Next**       | Knowledge Base v1.4: import/export JSON. Clarity: **Budget + Growth** launcher icons + `docs/BRANDING.md` (same pattern as Triage/Time). Then v0.2+ from [`portfolio/clarity-budget-ios/ROADMAP.md`](portfolio/clarity-budget-ios/ROADMAP.md) / [`portfolio/clarity-growth-ios/ROADMAP.md`](portfolio/clarity-growth-ios/ROADMAP.md). |
| **Blockers**   | *(none)*                                                                                                                                                                                                                                                                   |
| **Last touch** | 2026-04-13 — **Clarity Triage** (chevron wide → AppIcon) + **Clarity Time** (timer-arc wide → AppIcon); `xcodebuild build` both schemes ✅; root `ROADMAP` + `HANDOFF` updated.                                                                                                                                                                                      |


---

## Fresh session prompt — continue Clarity Budget (v0.2+)

Use a **new** chat after `checkpoint`. Paste:

```
Read CLAUDE.md and this HANDOFF.md first, then portfolio/clarity-budget-ios/CLAUDE.md and portfolio/clarity-budget-ios/HANDOFF.md.

Goal: Continue Clarity Budget iOS at portfolio/clarity-budget-ios/.

Current state: Phase 4 MVP v0.1 shipped — dual scenarios + wants aggregate; PBX prefix CB; store key chase_budget_ios_v1; ClarityUI via ../clarity-ui.

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

Current state: Phase 5 MVP v0.1 shipped — 7 growth areas + streak-aware session logging/history; PBX prefix CG; store key chase_growth_ios_v1; ClarityUI via ../clarity-ui.

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
- **clarity-triage-ios HANDOFF:** `portfolio/clarity-triage-ios/HANDOFF.md` — Phase 2 complete; use `xcodebuild -showdestinations` if “iPhone 16” simulator is missing.
- **clarity-time-ios (Phase 3):** `portfolio/clarity-time-ios/HANDOFF.md` — **complete** (v0.1); `CX*` PBX prefix; “Next” points at Growth + shipped Budget.
- **clarity-budget-ios (Phase 4):** `portfolio/clarity-budget-ios/HANDOFF.md` — **MVP shipped** (v0.1); PBX prefix **`CB`**; storage key `chase_budget_ios_v1`; continue prompt in this file + app `HANDOFF.md`.
- **clarity-growth-ios (Phase 5):** `portfolio/clarity-growth-ios/HANDOFF.md` — **MVP shipped** (v0.1); PBX prefix **`CG`**; storage key `chase_growth_ios_v1`; continue prompt in this file + app `HANDOFF.md`.
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


