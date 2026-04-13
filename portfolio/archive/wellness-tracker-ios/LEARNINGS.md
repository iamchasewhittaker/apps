# Learnings — Wellness Tracker (iOS)

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

### 2026-04-12 — AppIcon must be exactly 1024×1024
**What happened:** Xcode reported *AppIcon … did not have any applicable content* and Swift compile failed.
**Root cause:** `AppIcon.png` was **1376×768** (non-square). iOS asset catalogs reject that for the single-size icon slot.
**Fix / lesson:** `sips -Z 1024` then `sips -p 1024 1024` to letterbox/pad to a square; add **`ios-marketing`** 1024 entry alongside **`universal`** in `Contents.json`. See `docs/BRANDING.md` on web mirror.
**Tags:** xcode, assets

### 2026-04-12 — App icon palette = Clarity family, not Spend Clarity raster
**What happened:** Branding asked to match “Spend Clarity” logo colors; Spend Clarity has no logo file in git.
**Root cause:** Clarify toolchain: **YNAB Clarity** owns the consumer visual tokens (`ClarityTheme.swift`).
**Fix / lesson:** Wellness `AppIcon` + web mark use those RGB approximations; document in `../wellness-tracker/docs/BRANDING.md`.
**Tags:** branding, docs

### 2026-04-12 — Checkpoint bundled two apps in one commit
**What happened:** End-of-session `checkpoint` committed Wellness Tracker (iOS) changes in the same commit as YNAB Clarity (iOS) work.
**Root cause:** `checkpoint` snapshots every dirty path in the monorepo when more than one app has local edits.
**Fix / lesson:** Before `checkpoint`, stash or commit per app if you want atomic commits; or leave as-is and split history later if needed (see **Backlog — repo hygiene** in `ROADMAP.md`).
**Tags:** git, monorepo

### 2026-04-12 — CLI tests may hang after build
**What happened:** `xcodebuild test` from CLI built successfully but stalled during simulator test execution in this environment.
**Root cause:** Simulator/runtime conditions can block test execution even when code compiles, especially with signing/simulator state mismatches.
**Fix / lesson:** Use `xcodebuild build-for-testing ... CODE_SIGNING_ALLOWED=NO` as a reliable CI-style compile check, then run full tests in Xcode when simulator state is healthy.
**Tags:** xcode, testing, swift

### 2026-04-11 — Code lost after accidental Xcode deletion
**What happened:** Code was accidentally deleted in Xcode with no recent commit to recover from. Recovery required reverting to an older version, losing recent work.
**Root cause:** No habit of committing before manual editing sessions. Xcode's undo does not survive file closes or app restarts, and there was no git safety net.
**Fix / lesson:** Always run `checkpoint` in Terminal before opening Xcode to edit. The checkpoint + restore system was created specifically because of this incident. One command saves everything.
**Tags:** data-loss, xcode, git
