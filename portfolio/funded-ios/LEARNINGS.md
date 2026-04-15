# Learnings — Funded (iOS)

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

### 2026-04-12 — Adding CategoryOverride to Schema doesn't require a migration version
**What happened:** Added `CategoryOverride.self` to the SwiftData `Schema` array in `YNABClarityApp.swift`. Worried this would crash existing installs.
**Root cause:** Not an issue — SwiftData handles new `@Model` types added to the Schema without requiring a `VersionedSchema` or `SchemaMigrationPlan`. The new table is simply created. Only renaming/removing existing `@Model` properties requires a migration.
**Fix / lesson:** New `@Model` types = safe to add at any time. Renaming/removing fields on existing models = needs lightweight migration. Properties on new models have no existing data to migrate so they just work.
**Tags:** swift, swiftdata, gotcha

### 2026-04-12 — CategoryOverride payeeSubstring stores full lowercased raw payee
**What happened:** Considered whether to store the cleaned/display name or the raw payee as the `payeeSubstring`. The `CategorySuggestionEngine.suggest()` matches against `transaction.payeeName?.lowercased()` (the raw payee), not the display name.
**Root cause:** Design decision: we match on raw because that's what `suggest()` receives. The raw payee is noisier but is the same string every time for the same transaction source.
**Fix / lesson:** The override stores the full raw payee lowercased. This is intentionally broad — it catches all future transactions from the same merchant/card. If it over-matches, add more specific patterns; the override with the most specific substring wins because the check exits on first match.
**Tags:** swift, swiftdata, categorization

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

### 2026-04-15 — `xcodebuild test` + Xcode GUI → `build.db` locked
**What happened:** Running `xcodebuild test` from the CLI while Xcode (or another `xcodebuild`) was using the same DerivedData folder failed with `unable to attach DB` / `build.db` locked.
**Root cause:** Shared DerivedData path; two processes contend for the same XCBuildData database.
**Fix / lesson:** Use `-derivedDataPath /tmp/YNABClarity-dd-test` (or any empty temp dir) for CLI test runs, or quit other builders first.
**Tags:** xcode, tests, gotcha

### 2026-04-15 — App rename: pbxproj replacements must go longest-match first
**What happened:** Renaming Conto → Funded in `project.pbxproj` via `sed` required a specific ordering: `ContoApp.swift` → `ContoTests` → `"Conto"` → `Conto`. Doing shorter strings first corrupted longer tokens (e.g. `ContoTests` became `FundedTests` but `ContoApp.swift` became `FundedApp.swift` only if the filename was first).
**Root cause:** `sed` replaces left-to-right in one pass. Shorter patterns shadow longer ones when the shorter form is a prefix of the longer.
**Fix / lesson:** Always process longest tokens first in pbxproj renames. Also: `git mv` the source folder and `.xcodeproj` directory before editing the pbxproj so path references are already correct.
**Tags:** xcode, rename, gotcha

### 2026-04-15 — NSImage.lockFocus renders at Retina scale (2048px not 1024px)
**What happened:** Used `NSImage(size:)` + `lockFocus()` to generate the AppIcon PNG. The resulting file was 2048×2048 (Retina @2x), causing `actool` to reject it: "AppIcon.png is 2048×2048 but should be 1024×1024."
**Root cause:** `NSImage.lockFocus()` renders at the screen's backing scale factor (2× on Retina). The size parameter is in points, not pixels.
**Fix / lesson:** Use `CGContext(data:width:height:…)` directly to work in exact pixels, then wrap it with `NSGraphicsContext(cgContext:flipped:)` for AppKit drawing. Write via `CGImageDestination` / `CGImageDestinationFinalize`.
**Tags:** xcode, swift, appicon, gotcha

### 2026-04-15 — `brew install librsvg` stalls for 10+ min (builds Rust from source)
**What happened:** Tried to install `librsvg` to get `rsvg-convert` for SVG→PNG conversion. Brew stalled because `librsvg` depends on `rust`, which compiles from source on older homebrew setups.
**Root cause:** No pre-built bottle available for the current macOS/Xcode combo; Homebrew falls back to source compilation.
**Fix / lesson:** Skip `rsvg-convert` entirely. Use a Swift script with `CGContext` + `NSAttributedString` to render text directly — faster, no dependencies, always works on macOS.
**Tags:** tooling, gotcha, svg, appicon

### 2026-04-15 — `itemContextSubtitle` test drift after universal empty-memo copy
**What happened:** `testItemContextSubtitle_amazonFallbackWhenMemoEmpty` failed — it still expected the old Amazon-specific hint containing "memo".
**Root cause:** `PayeeDisplayFormatter.itemContextSubtitle` now returns the same string for all merchants when memo is empty: `No item details yet`.
**Fix / lesson:** Renamed test to `testItemContextSubtitle_universalFallbackWhenMemoEmpty` and asserted equality with that string.
**Tags:** swift, tests, ui-copy
