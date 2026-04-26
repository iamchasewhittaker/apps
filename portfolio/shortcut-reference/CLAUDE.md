# CLAUDE.md — Shortcut Reference

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


Instructions for AI assistants and humans working in this repo.

## What this project is

macOS app: a **floating or docked reference window** listing keyboard shortcuts for the **frontmost application**, discovered by traversing that app’s **menu bar** using `AXUIElement` (Accessibility), not by hardcoding per-app cheat sheets.

## What This App Is

A macOS floating or docked reference window that reads keyboard shortcuts for the frontmost app by traversing its menu bar via the Accessibility API — no hardcoded cheat sheets, no manual maintenance as apps update. Built in Swift/SwiftUI with AppKit for window behavior, targeting macOS 13+.

## Behavior rules (for implementers)

1. **Prefer Accessibility-derived shortcuts** as the source of truth; add **manual overrides** only when an app exposes bad or empty metadata.
2. **Never silently fail** if Accessibility is denied—show a clear in-app message and link to System Settings.
3. **Debounce** rapid app switches so we don’t thrash AX calls.
4. **Non-destructive**: this app only *reads* UI structure; it must not drive clicks or keystrokes in other apps unless we add an explicit, separate feature later.
5. **Do not commit secrets**—no API keys expected for v1; keep `.env` out of git if we add any.

## Tech stack (target)

- **Swift** + **SwiftUI** for UI
- **AppKit** (`NSPanel` / window behavior) where SwiftUI is awkward
- **Accessibility** (`AXUIElement`, menu attributes such as `kAXMenuItemCmdCharAttribute`)

## Project layout

```
Package.swift                    — SwiftPM: library + CLI executable (macOS 13+)
Sources/ShortcutReferenceLibrary/ — UI + AX (product: ShortcutReferenceLibrary)
Sources/ShortcutReferenceCLI/     — @main for swift run ShortcutReference
MacApp/                          — @main + Info.plist + entitlements for .app
ShortcutReference.xcodeproj/     — macOS app target (compiles library sources; no Xcode SPM link)
project.yml                      — optional XcodeGen
docs/
CHANGELOG.md
ROADMAP.md
```

- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — single source for icons/palette; do not restate full rules in session prompts.

## When editing this repo

- **Small, focused changes**—one concern per commit when possible.
- After meaningful user-visible or structural changes: update **CHANGELOG.md** under `## [Unreleased]`.
- If a decision is non-obvious (e.g. sandbox vs not, App Store vs direct): add an **ADR** in `docs/adr/`.
- Update **docs/ARCHITECTURE.md** when the data flow or major modules change.
- For portfolio updates: refresh **README.md** snapshot and **docs/CASE_STUDY.md** when the story materially changes.

## References

- Apple: Accessibility, `AXUIElement`, menu item command attributes.
- Active app: `NSWorkspace.didActivateApplicationNotification`.
