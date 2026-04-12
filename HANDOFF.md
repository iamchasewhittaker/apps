# Handoff — multi-agent / multi-session work

**Living file.** Keep the **State** block short and current so any tool (Claude Code, Cursor, Codex, Antigravity) can resume without re-reading the whole thread.

---

## Every Session — 3 Steps

### 1. CHECKPOINT first
Run `checkpoint` in Terminal before touching anything.
This saves a git snapshot so you can always get back to where you started.

### 2. Tell the tool what you're doing

| Tool | How to start |
|------|-------------|
| **Claude Code** | Paste `docs/templates/SESSION_START_APP_CHANGE.md` (one app) or `SESSION_START_MONOREPO.md` (cross-cutting). Say: *"Read CLAUDE.md and HANDOFF.md first."* |
| **Cursor** | Open the project folder — `.cursor/rules/session-handoff.mdc` auto-loads. Still paste the template for goal context. |
| **Antigravity (VS Code)** | Open the project folder — reads `CLAUDE.md` automatically. Paste the template for goal context. |
| **Codex (OpenAI)** | Paste `CLAUDE.md` intro + this file's **State** table into the prompt, then paste the template. |
| **Xcode only** | Just run `checkpoint` — that's your safety net. No template needed for Xcode-only edits. |

### 3. Checkpoint when done
Run `checkpoint` again when you stop (or let AI tools do it).

**AI session deliverables** (AI tools handle these automatically):
- [ ] Code committed via `checkpoint` or explicit commit
- [ ] App `CHANGELOG.md` updated under `## [Unreleased]`
- [ ] App `ROADMAP.md` updated (mark done, add ideas)
- [ ] Root `ROADMAP.md` Change Log row added
- [ ] `HANDOFF.md` State table updated (Focus, Next, Last touch)
- [ ] App `LEARNINGS.md` updated if something went wrong or was learned

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

| Field | Value |
|--------|--------|
| **Workspace** | `~/Developer/chase` |
| **Branch** | `main` |
| **Linear** | [Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7) · [Park Checklist / RollerTask (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) |
| **Focus** | **Wellness Tracker iOS Phase 2 foundation shipped.** Native tab shell (`Check-in`, `Tasks`, `Time`, `Capture`) is live with first daily parity slice (Tasks + Time + quick Win/Pulse), plus draft/navigation test coverage and explicit companion-first scope docs. |
| **Next** | 1) Expand Tasks parity (top-3 triage + one-thing) in `portfolio/wellness-tracker-ios` · 2) Expand Time parity to active timer/session controls · 3) Keep History analytics/export/AI deferred until Phase 2 workflows are stable · 4) Revisit auth/sync only if iOS replacement criteria are met |
| **Blockers** | *(none)* |
| **Last touch** | 2026-04-12 (Wellness Tracker iOS) |

---

## Notes (optional, human + long-lived context)

- **iOS planning templates** live at **`docs/ios-app-starter-kit/`** (v3). **Filled** product docs + **`PLANNING_WORKFLOW.md`** under **`portfolio/roller-task-tycoon-ios/docs/planning/`**. **Linear** project [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) (WHI-15…19). Kit **`HANDOFF_TEMPLATE.md`** ≠ repo-root session **`HANDOFF.md`**.
- **YNAB Clarity (2026-04-11):** Implemented full rethink plan — `goal_target` on `YNABMonthCategory`, `monthlyTarget` prefers goal; Bills by coverage; `dueDay`; Income tab rename + surplus; Cash Flow today marker; `TipBanner`, `HowItWorksView`, `YNABClient` PATCH + Bills **Fund** sheet; Xcode `project.pbxproj` includes `Views/Components/TipBanner.swift` and `HowItWorksView.swift`.
- **YNAB Clarity (same session, follow-up):** `fetchTransactions` + spending chips; `toBeBudgeted` on month; safe-to-spend formula; unified bills card; stale sync banner (persisted epoch).
- **YNAB API write:** `PATCH` updates `budgeted` (assigned) only; confirmation before Fund.
- *(Decisions, links to PRs/commits, "parked" ideas.)*

---

## Templates (copy from repo)

| Situation | File |
|-----------|------|
| New initiative, migration, or cross-app work | [docs/templates/SESSION_START_MONOREPO.md](docs/templates/SESSION_START_MONOREPO.md) |
| Change one app under `portfolio/<app>/` or `projects/<name>/` | [docs/templates/SESSION_START_APP_CHANGE.md](docs/templates/SESSION_START_APP_CHANGE.md) |
