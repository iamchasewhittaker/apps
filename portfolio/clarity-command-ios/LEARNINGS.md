# Learnings — Clarity Command (iOS)

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences.
**Root cause:** The non-obvious part.
**Fix / lesson:** What to do differently.
**Tags:** gotcha | swift | xcode | accessibility | clarity-ui | ...

---

## Entries

### 2026-04-14 — @MainActor annotation required on view structs
**What happened:** Views with computed properties accessing the `@MainActor CommandStore` failed to compile with concurrency errors.
**Root cause:** Computed properties and private methods on view structs do not automatically inherit `@MainActor` isolation from the store — only `body` does. Swift 5.9+ strict concurrency enforces this.
**Fix / lesson:** Annotate the entire view struct with `@MainActor` when it has computed properties or helper methods that read from the store outside of `body`.
**Tags:** swift, concurrency, gotcha

### 2026-04-14 — ClaritySectionLabel unlabeled first parameter
**What happened:** Using `ClaritySectionLabel(text: "Header")` failed to compile.
**Root cause:** `ClaritySectionLabel` init uses an unlabeled first parameter: `init(_ text: String)`.
**Fix / lesson:** Always use `ClaritySectionLabel("Header")` — no argument label. Check ClarityUI source when unsure about init signatures.
**Tags:** clarity-ui, api

### 2026-04-14 — ClarityTypography has no bodyBold / captionBold
**What happened:** Attempted to use `ClarityTypography.bodyBold` and `ClarityTypography.captionBold` — neither exists.
**Root cause:** ClarityUI provides semantic font styles (`.body`, `.caption`, `.headline`, `.title`, etc.) but no bold variants as separate properties.
**Fix / lesson:** Use `.headline` for bold body-weight text, or apply `.bold()` modifier: `ClarityTypography.caption.bold()`. Do not assume bold variants exist.
**Tags:** clarity-ui, api

### 2026-04-14 — ClarityProgressBar requires labeled parameters
**What happened:** `ClarityProgressBar(0.75)` and `ClarityProgressBar("Label", 0.75)` both failed.
**Root cause:** The init signature requires explicit labels: `ClarityProgressBar(label: String, value: Double)`.
**Fix / lesson:** Always use `ClarityProgressBar(label: "Progress", value: fraction)` with both labels.
**Tags:** clarity-ui, api

### 2026-04-14 — String interpolation of enums needs String(describing:)
**What happened:** Interpolating a Swift enum value in a string (`"\(myEnum)"`) produced a compiler warning about non-sendable or ambiguous interpolation.
**Root cause:** Swift strict concurrency and string interpolation of non-String-conforming types triggers warnings.
**Fix / lesson:** Use `String(describing: myEnum)` or explicitly conform the enum to `CustomStringConvertible`.
**Tags:** swift, gotcha
