# Handoff — multi-agent / multi-session work

**Living file.** Keep the **State** block short and current so Cursor, Claude Code, Codex, or another chat can resume without re-reading the whole thread.

### Quick routine (read every session)

1. **End of session or switch agent:** Update **State** (and **Notes** if useful) in this file.
2. **New chat:** Use [docs/templates/SESSION_START_MONOREPO.md](docs/templates/SESSION_START_MONOREPO.md) or [SESSION_START_APP_CHANGE.md](docs/templates/SESSION_START_APP_CHANGE.md); fill brackets; paste; say *“Read `CLAUDE.md` and `HANDOFF.md` first.”*
3. **Shipped work:** **Linear** + **git** = source of truth for what shipped; **`HANDOFF.md`** = where we are *right now*.

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
| **Linear** | *(issue URL or “none”)* |
| **Focus** | *(one line: what we’re doing)* |
| **Next** | 1. … 2. … 3. … |
| **Blockers** | *(or “none”)* |
| **Last touch** | *(date, optional)* |

---

## Notes (optional, human + long-lived context)

- *(Decisions, links to PRs/commits, “parked” ideas.)*

---

## Templates (copy from repo)

| Situation | File |
|-----------|------|
| New initiative, migration, or cross-app work | [docs/templates/SESSION_START_MONOREPO.md](docs/templates/SESSION_START_MONOREPO.md) |
| Change one app under `portfolio/<app>/` or `projects/<name>/` | [docs/templates/SESSION_START_APP_CHANGE.md](docs/templates/SESSION_START_APP_CHANGE.md) |
