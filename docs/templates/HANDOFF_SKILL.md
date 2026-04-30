# /handoff — Auto-Handoff Skill

> Invoke with `/handoff` in any Claude Code session.
> Use proactively — every ~15 conversation turns, or before switching tools.

---

## What It Does

Generates a fresh, comprehensive handoff document covering:
1. Current git state (uncommitted changes, recent commits)
2. All active app statuses
3. What was done this session
4. Next priority items
5. A ready-to-paste prompt for the next session

---

## How to Create This Skill

Claude Code supports custom skills via the **skill-creator** plugin (already enabled in your settings).

### Option A — Manual `/handoff` invocation

Paste this prompt block into any session when you want a handoff generated:

```
Generate a handoff for this session. Do the following:

1. Run: git status && git log --oneline -10
2. Read: HANDOFF.md (State table)
3. Read: ROADMAP.md (Change Log — last 3 rows)
4. Summarize what was done this session (from context)
5. Identify what's next (from HANDOFF.md Next field + ROADMAP.md)
6. Output a fresh "Fresh session prompt" block I can paste into the next chat

Keep it under 30 lines. Focus on what changed and what's next.
Append the result to HANDOFF.md under a new "## Fresh session prompt — [date]" section.
```

### Option B — Skill Creator Plugin

Use the `skill-creator` plugin (already enabled) to register `/handoff` as a named skill:

1. In Claude Code, type `/skill-creator`
2. Name the skill: `handoff`
3. Paste the prompt block from Option A as the skill body
4. Save — now `/handoff` runs it automatically

---

## Auto-Trigger at 20 Turns — PreCompact Hook

To auto-generate a handoff before context compaction (which happens around turn ~20+), add this to `.claude/settings.local.json`:

```json
"hooks": {
  "PreCompact": [
    {
      "matcher": "auto",
      "hooks": [
        {
          "type": "command",
          "command": "cd /Users/chase/Developer/chase && git log --oneline -5 > /tmp/handoff-pre-compact.txt && git status --short >> /tmp/handoff-pre-compact.txt",
          "timeout": 10
        }
      ]
    }
  ]
}
```

This captures git state before compaction so context isn't lost.

---

## Handoff Prompt Template (ready to paste)

```
Read CLAUDE.md and HANDOFF.md first.

Goal: [FILL IN — what were you working on?]

Current state ([DATE]):
- Branch: main
- Last commit: [FILL IN from git log]
- Uncommitted: [FILL IN from git status]

What was done last session:
- [FILL IN]

Priority queue:
1. [FILL IN from HANDOFF.md Next]
2. [FILL IN]

Run checkpoint before edits.
Update CHANGELOG / ROADMAP / HANDOFF when done.

For Reese. For Buzz. Forward.
```

---

## Frequency Guidance

| Situation | Action |
|-----------|--------|
| Session just started | Read HANDOFF.md, no handoff needed |
| ~15 turns in | Run `/handoff` — generate + append to HANDOFF.md |
| Switching tools (Claude → Cursor) | Run `/handoff` first |
| End of day | Run `/handoff` + `checkpoint` |
| Context feels stale/confused | Start a new chat, paste fresh handoff prompt |

---

## Handoff Best Practices

### When to hand off

- **~20 conversation turns** — context quality drops; start fresh
- **Switching tools** — Claude Code to Cursor, Cursor to Codex, etc.
- **Switching apps** — one app per session is the default
- **End of day** — always `/handoff` + `checkpoint` before closing
- **Before destructive ops** — migrations, schema changes, large refactors
- **Model starts forgetting constraints** — repeating itself, ignoring anti-features, suggesting things you already rejected

### 5-field minimum

Every handoff must update these fields in the app's `HANDOFF.md`:

| Field | What goes there |
|-------|----------------|
| **Focus** | What you were actively working on (1 sentence) |
| **Next** | The immediate next step (not the backlog) |
| **Last touch** | Date + last commit hash or description |
| **Blockers** | Anything preventing progress, or "None" |
| **State table row** | The above 4 fields in the State table |

### Common mistakes

| Mistake | Why it hurts | Fix |
|---------|-------------|-----|
| Pasting the whole conversation | Too long, agent skims or ignores | Use State table (under 30 lines) |
| Skipping LEARNINGS.md | Gotchas repeat next session | Mandatory append — even one line |
| No checkpoint before switching | Lose rollback point | Always `checkpoint` first |
| Free-form handoff | Next agent wastes turns parsing | Use the template structure |
| Stale HANDOFF.md | Next agent works from wrong state | Update Focus/Next/Last touch every time |

### Tool-specific handoff tips

| Tool | Auto-loads | First action |
|------|-----------|-------------|
| **Claude Code** | `CLAUDE.md` automatically | Read `HANDOFF.md` |
| **Cursor** | `.cursor/rules/session-handoff.mdc` | Open project folder |
| **Codex** | `AGENTS.md` (paste manually) | Paste `AGENTS.md` + State table |
| **Windsurf** | `.windsurfrules` | Open project folder |
| **Copilot Chat** | `.github/copilot-instructions.md` | Open repo root |

### Anti-patterns

- **Handoff as conversation dump** — max 30 lines. If it's longer, you're repeating context that belongs in `CLAUDE.md` or `LEARNINGS.md`.
- **Relying on context alone** — context windows compress and compact. Write it down or it's gone.
- **Skipping checkpoint before tool switch** — the new tool can't roll back to where you were.
- **"Just read the code"** — code shows *what*, not *why* or *what's next*. The handoff fills the gap.

### Reflection

> "What context did you wish you had at the start of this session that a better handoff would have given you?"

---

*"For Reese. For Buzz. Forward — no excuses."*
