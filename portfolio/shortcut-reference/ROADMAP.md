# Roadmap

> **Status:** Active portfolio app (promoted from `projects/` on 2026-04-14).
> macOS keyboard shortcut viewer using Accessibility APIs. MVP functional.

## Now

- [x] Repo scaffold: standard docs, license, gitignore
- [x] SwiftPM library + CLI (`swift run ShortcutReference`)
- [x] Xcode `ShortcutReference.xcodeproj` → `ShortcutReference.app` (Info.plist, entitlements)
- [x] AX menu traversal + on-screen list for frontmost app
- [x] Active-app observer + debounced refresh (200ms)

## Next

- [x] Reference UI: group by top-level menu, search field, copy shortcut row
- [x] Accessibility onboarding copy (clearer first-run text; deep link already in app)
- [x] Window behavior: `NSPanel`, floating level, optional always-on-top

## Later

- [ ] Compact / minimized strip mode
- [ ] Manual overrides file for bad AX metadata
- [ ] Optional: position panel near active window (advanced)

## Parked / ideas

- Export shortcuts as Markdown
- Global hotkey to show/hide
