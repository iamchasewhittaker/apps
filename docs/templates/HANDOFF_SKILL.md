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

*"For Reese. For Buzz. Forward — no excuses."*
