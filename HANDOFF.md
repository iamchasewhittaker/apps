# Handoff — multi-agent / multi-session work

**Living file.** Keep the **State** block short and current so Cursor, Claude Code, Codex, or another chat can resume without re-reading the whole thread.

### Quick routine (read every session)

1. **End of session or switch agent:** Update **State** (and **Notes** if useful) in this file.
2. **New chat:** Use [docs/templates/SESSION_START_MONOREPO.md](docs/templates/SESSION_START_MONOREPO.md) or [SESSION_START_APP_CHANGE.md](docs/templates/SESSION_START_APP_CHANGE.md); fill brackets; paste; say *“Read `CLAUDE.md` and `HANDOFF.md` first.”*
3. **Shipped work:** **Linear** + **git** = source of truth for what shipped; **`HANDOFF.md`** = where we are *right now*.

**Claude Code and other assistants:** Use this **Quick routine** and repo-root **`CLAUDE.md`** — that is the full process. **`.cursor/rules`** is an optional **Cursor-only** reminder; it is not a separate workflow.

## When to start a **new** chat (and use this file)

Start a **new** conversation when:

- **Context is full** or the model gets vague / forgets earlier constraints.
- You **switch products** (e.g. Cursor → Claude Code → Codex).
- You start a **different task** (new Linear issue or unrelated goal).
- The old thread is **noisy** and a clean prompt + `HANDOFF.md` is faster than scrolling.

You can **stay** in one chat when:

- You are iterating on the **same** task in one sitting and context still feels accurate.
- You are doing **small follow-ups** right after a commit.

**Whenever you start a new chat**, paste the contents of the right template from [docs/templates/](docs/templates/) and say: *“Read `CLAUDE.md` and `HANDOFF.md` first.”*

## When to **update** this file

Update **State** (and optionally **Notes**) when:

- You **stop for the day** or switch to another agent.
- You **merge / push** and the “next step” changes.
- You **discover a blocker** or change scope.

Do **not** duplicate `CLAUDE.md` or long architecture here — link to issues and commits instead.

---

## State (agents: read this first)

| Field | Value |
|--------|--------|
| **Workspace** | `~/Developer/chase` |
| **Branch** | `main` (or fill in) |
| **Linear** | [Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7) · [Park Checklist / RollerTask (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) |
| **Focus** | **Wellness Tracker (iOS)** Phase 1 at `portfolio/wellness-tracker-ios`. **RollerTask Tycoon (iOS)** — **Park Operations Console** implemented at `portfolio/roller-task-tycoon-ios` (five tabs, ledger, backup v2, `docs/PARK_OPERATIONS_*.md`). Web PWA archived at `portfolio/archive/roller-task-tycoon`. |
| **Next** | **Wellness iOS:** device QA, Supabase OTP + sync, App Icon. **RollerTask:** run **`RollerTaskTycoonTests`** on Simulator (⌘U); track **Park Operations Console** in [WHI-20](https://linear.app/whittaker/issue/WHI-20/park-operations-console-v1-spec-implementation) (spec docs linked in issue); TestFlight [WHI-19](https://linear.app/whittaker/issue/WHI-19) when ready. |
| **Blockers** | CI host had no iOS Simulator **device** runtime — `xcodebuild` may need Platforms → iOS Simulator installed. |
| **Last touch** | 2026-04-05 |

---

## Notes (optional, human + long-lived context)

- **iOS planning templates** live at **`docs/ios-app-starter-kit/`** (v3). **Filled** product docs + **`PLANNING_WORKFLOW.md`** under **`portfolio/roller-task-tycoon-ios/docs/planning/`**. **Linear** project [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) (WHI-15…19). Kit **`HANDOFF_TEMPLATE.md`** ≠ repo-root session **`HANDOFF.md`**.
- *(Decisions, links to PRs/commits, “parked” ideas.)*

---

## Templates (copy from repo)

| Situation | File |
|-----------|------|
| New initiative, migration, or cross-app work | [docs/templates/SESSION_START_MONOREPO.md](docs/templates/SESSION_START_MONOREPO.md) |
| Change one app under `portfolio/<app>/` or `projects/<name>/` | [docs/templates/SESSION_START_APP_CHANGE.md](docs/templates/SESSION_START_APP_CHANGE.md) |
