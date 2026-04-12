# Learnings — RollerTask Tycoon (iOS)

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

```
### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | xcode | git | data-loss | swift | api | ...
```

---

## Entries

### 2026-04-11 — Code lost after accidental Xcode deletion
**What happened:** Code was accidentally deleted in Xcode with no recent commit to recover from. Recovery required reverting to an older version, losing recent work.
**Root cause:** No habit of committing before manual editing sessions. Xcode's undo does not survive file closes or app restarts, and there was no git safety net.
**Fix / lesson:** Always run `checkpoint` in Terminal before opening Xcode to edit. The checkpoint + restore system was created specifically because of this incident. One command saves everything.
**Tags:** data-loss, xcode, git
