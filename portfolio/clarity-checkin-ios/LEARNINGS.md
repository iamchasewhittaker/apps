# Learnings — Clarity Check-in (iOS)

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences.
**Root cause:** The non-obvious part.
**Fix / lesson:** What to do differently.
**Tags:** gotcha | swift | xcode | accessibility | ...

---

## Entries

### 2026-04-13 — Squaring wide app-icon mockups with `sips`
**What happened:** A wide marketing mockup (1376×768) needed to become a **1024×1024** `AppIcon.png` for Xcode’s single-size slot.
**Root cause:** `sips -p` pads to square using **black** by default, which clashes with a light presentation field.
**Fix / lesson:** Use `sips --padColor E6E7EB -p <W> <H> file.png` then `sips -z 1024 1024` — document in the shared icon spec. After icon changes, **delete the app from Simulator** before judging the result (SpringBoard caches icons).
**Tags:** xcode, design

### 2026-04-12 — @Observable binding pattern
**What happened:** `@Observable` stores don't use `@Published`. Views need `@Bindable var s = store` to get two-way bindings.
**Root cause:** iOS 17 `@Observable` macro changed the binding pattern from `ObservableObject`.
**Fix / lesson:** Always use `@Bindable var s = store` at the top of any view that needs `$store.property` bindings. Read-only views just use `store.property` directly.
**Tags:** swift, observable

### 2026-04-12 — FlowLayout is in ClarityUI
**What happened:** `FlowLayout` is defined in `ClarityMultiChip.swift` inside the ClarityUI package.
**Root cause:** It's internal to the component, but needed in Sections.swift for the meds chip display.
**Fix / lesson:** Import `ClarityUI` in any file that uses `FlowLayout` — it's public from the package.
**Tags:** swift, clarity-ui
