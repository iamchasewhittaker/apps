# SESSION_START — Shortcut Reference Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Shortcut Reference is a functional v0.1.0 macOS app.
**App:** Shortcut Reference
**Slug:** shortcut-reference
**One-liner:** macOS menu-bar app that shows keyboard shortcuts for the active app using Accessibility APIs — no manual shortcut lists required, reads directly from the OS.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is functional; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/shortcut-reference`
2. **BRANDING.md** — macOS-native aesthetic, developer-tool palette, keyboard/shortcut metaphor
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.1.0 shipped scope; V2 = shortcut search, favorites, clipboard copy
5. **APP_FLOW.md** — document the AX API poll → parse → menu bar render → search flow
6. **SESSION_START_shortcut-reference.md** — stub only

Output paths: `portfolio/shortcut-reference/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1.0
**Stack:** Swift 5.9+ / SwiftUI + AppKit — macOS 13+ (Ventura and later)
**Storage:** n/a (macOS native — no localStorage, no Supabase)
**URL:** local Xcode
**Bundle ID:** `dev.chase.shortcut-reference`
**Build:** Xcode or `swift run ShortcutReference`

**What this app is:**
A macOS menu-bar app that reads keyboard shortcuts for the currently active application using the Accessibility (AX) APIs. Instead of manually maintaining shortcut lists per app, it queries the OS directly for menu items and their key equivalents, then renders them in a searchable panel attached to the menu bar icon.

**Architecture:**
- `Sources/ShortcutReferenceLibrary/` — SwiftUI + AX logic (library)
- `MacApp/` — `@main` entry point for the `.app` bundle
- AX API: `AXUIElementCreateSystemWide()` → focused app → menu bar → menu items + key equivalents
- Renders as a `NSPopover` attached to menu bar `NSStatusItem`

**Key constraint:**
Requires Accessibility permissions (`Privacy & Security → Accessibility`). User must grant on first launch.

**Brand system:**
- macOS-native — follows system light/dark, SF Symbols icons
- Keyboard / shortcut metaphor — modifier key symbols (⌘ ⌥ ⇧ ⌃)
- Voice: minimal utility — "Xcode: ⌘B Build"

---

## App context — HANDOFF.md

**Version:** v0.1.0
**Focus:** Functional. AX shortcut reading works for most macOS apps.
**Last touch:** 2026-04-21

**Next (V2 candidates):**
- Add shortcut search (filter by key combination or action name)
- Add favorites / pin frequently used shortcuts
- Add one-click copy of shortcut combo to clipboard
- Handle apps that don't expose full menu bar (some Electron apps, games)
- Submit to Mac App Store (requires Accessibility entitlement review)
