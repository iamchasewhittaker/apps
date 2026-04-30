# Session Start — Shortcut Reference (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-14** — Initial documentation scaffold: README, CLAUDE, AGENTS, ADR template, roadmap, changelog, license, gitignore
- **2026-04-14** — Swift Package with SwiftUI: active-app observer (NSWorkspace), menu-bar traversal (AXUIElement), shortcut list UI
- **2026-04-14** — ShortcutReference.xcodeproj created with MacApp/ @main, Info.plist, entitlements (no App Sandbox)
- **2026-04-14** — scripts/build-app.sh for Xcode build + copy to dist/
- **2026-04-14** — Fixed: skip AX scans for Electron apps (Cursor, VS Code) that hang the AX stack; added AX call budget, max depth, cycle detection
- **2026-04-14** — Fixed: run menu extraction on main actor (AX APIs off main thread deadlock); macOS 13 deployment target
- **2026-04-14** — Accessibility onboarding: plain-English guidance, executable path display, Copy steps button, Xcode-specific instructions
- **2026-04-14** — Single-column layout fix (was hidden behind collapsed NavigationSplitView second column)
- **2026-04-14** — Promoted from projects/ to portfolio/; HANDOFF, LEARNINGS, BRANDING created

---

## Still needs action

- Define V1 MoSCoW scope and triage ROADMAP milestones with dates
- Add branding/logo per portfolio standard
- Consider App Store distribution (requires Accessibility entitlement review)
- Scraper may need to handle apps with empty AX metadata (manual overrides file)

---

## Shortcut Reference state at a glance

| Field | Value |
|-------|-------|
| Version | v0.1.0 |
| URL | local Xcode |
| Storage key | n/a |
| Stack | Swift 5.9+ / SwiftUI + AppKit, macOS 13+ |
| Linear | [Shortcut Reference](https://linear.app/whittaker/project/shortcut-reference-5b5280d7288b) |
| Last touch | 2026-04-14 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/shortcut-reference/CLAUDE.md | App-level instructions |
| portfolio/shortcut-reference/HANDOFF.md | Session state + notes |
| Sources/ShortcutReferenceLibrary/MenuShortcutExtractor.swift | AXUIElement menu-bar traversal engine |
| Sources/ShortcutReferenceLibrary/ActiveAppObserver.swift | NSWorkspace frontmost-app observer + debounce |
| Sources/ShortcutReferenceLibrary/ContentView.swift | Main UI: shortcut list, search, refresh |
| MacApp/DriveMindApp.swift | @main entry point for .app bundle |
| Sources/ShortcutReferenceLibrary/AccessibilityIntrospectionPolicy.swift | Electron skip-list + AX call budget |

---

## Suggested next actions (pick one)

1. Define V1 MoSCoW scope — decide which ROADMAP items ship in v1.0 vs later
2. Add compact/minimized strip mode (ROADMAP Later)
3. Build manual overrides file for apps with bad AX metadata
