# Learnings — YNAB Clarity (iOS)

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

### 2026-04-12 — Optional `memo` on `YNABTransaction` still updates test memberwise inits
**What happened:** Added `memo: String?` for API decoding and Bills UI. Same pattern as `categoryId`: `MetricsEngineTests` memberwise `YNABTransaction(...)` calls needed `memo: nil`.
**Root cause:** Optional fields have no default in the struct definition, so the synthesized memberwise initializer requires every property at call sites.
**Fix / lesson:** Add `memo: nil` (or use `= nil` in the struct for low-friction test ergonomics). JSON decoding remains fine with missing `memo` keys.
**Tags:** swift, tests, gotcha

### 2026-04-12 — Adding a field to a struct breaks all memberwise initializers in tests
**What happened:** Added `categoryId: String?` to `YNABTransaction`. The model decoded fine from JSON (new field, optional), but `MetricsEngineTests` constructs `YNABTransaction` directly via memberwise init — those 4 call sites immediately broke with "Missing argument for parameter 'categoryId'".
**Root cause:** Swift structs auto-generate a memberwise initializer that includes every stored property. Any new field, even optional, becomes a required argument unless a default value is given in the struct definition.
**Fix / lesson:** Either add `= nil` default in the struct (`let categoryId: String? = nil`) to keep existing call sites valid, or update every test call site. We updated the call sites here. For future optional fields that tests don't care about, prefer the default-value approach to avoid this.
**Tags:** swift, tests, gotcha

### 2026-04-12 — New Swift files must be added to Xcode project manually
**What happened:** `CategorySuggestionEngine.swift` was created on disk via `Write` tool but Xcode didn't know about it. The build succeeded only after manually adding the file in Xcode's Project Navigator.
**Root cause:** Xcode's `.pbxproj` is the source of truth for which files compile. Creating a file on disk (via any tool or `touch`) doesn't register it — Xcode never watches the filesystem for new files.
**Fix / lesson:** After creating any new `.swift` file outside of Xcode, do: right-click the target group in Project Navigator → "Add Files to 'YNABClarity'…" → select the file → confirm "Add to target" is checked. One file at a time (per CLAUDE.md rule).
**Tags:** xcode, gotcha, new-file

### 2026-04-12 — YNAB bulk PATCH returns HTTP 209, not 200
**What happened:** `patchRequest` only accepted HTTP 200. Calling `PATCH /budgets/{id}/transactions` threw a runtime error because YNAB returns 209 (Multi-Status) for bulk partial updates.
**Root cause:** The single-category PATCH (`/months/{month}/categories/{id}`) returns 200. The bulk transactions PATCH returns 209 — a different status code not documented prominently.
**Fix / lesson:** `patchRequest` switch now accepts `case 200, 201, 209`. When adding any YNAB write endpoint, verify the expected status code against the actual API, not just the spec description.
**Tags:** api, ynab, gotcha

### 2026-04-11 — Code lost after accidental Xcode deletion
**What happened:** Code was accidentally deleted in Xcode with no recent commit to recover from. Recovery required reverting to an older version, losing recent work.
**Root cause:** No habit of committing before manual editing sessions. Xcode's undo does not survive file closes or app restarts, and there was no git safety net.
**Fix / lesson:** Always run `checkpoint` in Terminal before opening Xcode to edit. The checkpoint + restore system was created specifically because of this incident. One command saves everything.
**Tags:** data-loss, xcode, git
