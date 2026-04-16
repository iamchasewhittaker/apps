# Learning guide

Read this alongside building the app. Check off sections as you go.

## Suggested order

1. **macOS app lifecycle** — How a menu bar app or accessory app runs; main thread vs background work.
2. **NSWorkspace** — `didActivateApplicationNotification`, `frontmostApplication`, `NSRunningApplication`.
3. **Accessibility (AX)** — Why Apple requires permission; what `AXUIElement` represents; reading attributes vs actions.
4. **Menu bar as AX tree** — From application element → menu bar → menus → menu items; shortcut-related attributes.
5. **SwiftUI + AppKit bridge** — `NSPanel`, window level, non-activating panels (if we use them).
6. **Sandbox** — Why many “inspect other apps” utilities are **not** sandboxed Mac App Store apps.

## Glossary

| Term | Meaning |
|------|---------|
| **AX / Accessibility** | Framework for assistive tech; same APIs can read UI structure of other apps (with permission). |
| **AXUIElement** | Opaque reference to a UI element (window, button, menu item, …). |
| **PID** | Process identifier; ties an `AXUIElement` to a running app. |
| **Frontmost app** | The app that owns keyboard focus / is “active” in the menu bar. |
| **NSPanel** | AppKit window type often used for floating palettes. |
| **ADR** | Architecture Decision Record—short memo of why we chose X over Y. |

## Debugging tips

- If AX returns errors, confirm **Accessibility** is enabled for **this run’s process** in System Settings—the entry is **ShortcutReference** (`.app`), **Terminal** (`swift run`), or **Xcode** / a **DerivedData** path when running from Xcode. Each can be a separate toggle.
- **Call `AXUIElement` on the main thread.** Querying other apps’ menus from a background queue often **deadlocks** and freezes the whole app.
- **Electron apps (Cursor, VS Code, etc.)** often expose huge or buggy menu trees; reads can **block indefinitely**. Shortcut Reference **skips** known IDs and caps work for everything else.
- Test with **native Apple apps** (Notes, Safari) before Electron-heavy apps.
- **Accessibility asks again after every build:** normal for **ad-hoc** Debug builds. Assign a **Team** in Xcode signing so the binary has a **stable** Apple Development identity; use **Developer ID** + notarization for distributable Release builds.

## Where this is implemented

See [ARCHITECTURE.md](ARCHITECTURE.md) file map. Core Accessibility walking lives in `MenuShortcutExtractor.swift`; frontmost app updates in `ActiveAppObserver.swift`.
