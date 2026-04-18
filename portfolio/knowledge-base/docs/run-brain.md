---
date: 2026-04-17
tags: [reference, workflow, claude-code]
---

# Run Brain

Open a terminal and type:

```zsh
brain
```

That's it. Claude Code launches inside the vault with full context from `CLAUDE.md`.

## What to ask it

**Daily note**
```
Create today's daily note from the template. Here's what happened: [paste bullets]
```

**Weekly review**
```
Read all daily notes from this week and the project READMEs. Write a weekly review to 06-Reviews/.
```

**Cross-project search**
```
Search everywhere for mentions of [topic].
```

**Decision capture**
```
Add this decision to 02-Projects/[slug]/README.md: [decision + why]
```

**Project digest from repos**
```
Read each project's STATE.md and git log --since="1 week ago". What moved, what stalled?
```

**Triage inbox**
```
Read everything in 00-Inbox/ and file each item to the right folder.
```

## When to run it
- End of day → daily note
- Sunday → weekly review
- Mid-session when a decision needs logging
- Anytime you need to find something across all notes
