# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Docs / UI:** Explain why **Accessibility keeps re-prompting** (ad-hoc Xcode rebuilds): set a **Signing Team**; diagnostics pasteboard + Debug banner + README / LEARNING.

### Fixed

- **UI:** Replace `NavigationSplitView` with a **single-column** layout so the shortcuts area isn’t hidden behind a collapsed second column (users only saw “Active app” in the sidebar).

### Fixed

- **Accessibility:** Re-check `AXIsProcessTrusted` when the app becomes active, poll briefly while untrusted, show the **executable/bundle path** to match in System Settings, and only show Apple’s trust **prompt once** (avoid “keeps asking” loops).
- **Accessibility (onboarding):** Plain-English **“how you’re running”** guess (Xcode vs terminal vs `.app`), numbered steps, selectable executable line, and **Copy steps & details** for the pasteboard.
- **Accessibility (Xcode-built .app):** Clarify that **ShortcutReference** must be ON (not only Xcode), **Show app in Finder** for the + picker, OFF/ON after rebuilds, and optional **`tccutil reset`** line in diagnostics.
- **Xcode build** no longer depends on a **local Swift Package** inside the `.xcodeproj` (avoids *“Packages are not supported when using legacy build locations”* on some setups). The app target now compiles **`Sources/ShortcutReferenceLibrary`** sources directly; **`swift run ShortcutReference`** still uses the SwiftPM library + CLI.

### Added

- **`scripts/build-app.sh`** — Xcode build, then **copy** **`ShortcutReference.app`** to **`dist/`** (easy to find; SwiftPM in this project can’t use a custom DerivedData path). README documents default **`~/Library/Developer/Xcode/DerivedData/...`** layout.
- **`ShortcutReference.xcodeproj`** — macOS app target producing **`ShortcutReference.app`**, linking the local Swift package product **`ShortcutReferenceLibrary`**.
- **`MacApp/`** — thin `@main` host, **`Info.plist`** (including `NSAccessibilityUsageDescription`), entitlements (no App Sandbox).
- **`ShortcutReferenceLibrary`** SwiftPM library target + **`ShortcutReferenceCLI`** executable so **`swift run ShortcutReference`** still works.
- Shared Xcode scheme; optional **`project.yml`** for XcodeGen on supported setups.

### Fixed

- **Skip Accessibility menu scans** for Cursor / Todesktop / VS Code–class apps whose Electron menus often **hang** the AX stack; show an in-app explanation instead.
- Cap menu traversal (**AX call budget**, **max depth**, **cycle detection**) so pathological trees cannot run forever.
- Run menu extraction on the **main actor** instead of `Task.detached`; AX APIs off the main thread often **deadlock** and freeze the UI.
- Support **macOS 13** deployment (was incorrectly set to 14, causing “built for macOS 14.0 which is newer than running OS” on Ventura).
- Remove `#Preview` and avoid `ContentUnavailableView` so `swift run` does not crash on missing `DeveloperToolsSupport` symbols at launch.

### Added

- Swift Package macOS executable with SwiftUI: active-app observer (`NSWorkspace`), menu-bar traversal (`AXUIElement`), shortcut list UI with refresh and Accessibility settings shortcut.
- `Package.swift` targeting macOS 13+.

### Added (earlier)

- Initial documentation scaffold: README, CLAUDE, AGENTS, learning/architecture docs, ADR template, roadmap, changelog, MIT license, Swift/Xcode `.gitignore`.
