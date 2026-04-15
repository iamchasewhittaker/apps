# Shortcut Reference (macOS)

**One-liner:** A utility that lists **keyboard shortcuts for whichever app is in front**, by reading that app’s menu bar via Apple’s Accessibility APIs (KeyCue-style).

## Portfolio snapshot

| | |
|---|---|
| **Problem** | Hard to remember shortcuts per app; cheat sheets are static and go stale. |
| **Approach** | Watch the frontmost app, traverse its `AXUIElement` menu tree, display shortcuts in a floating reference window. |
| **Stack** | Swift, SwiftUI, AppKit (`NSPanel`), Accessibility (`AXUIElement`). |
| **Status** | SwiftPM CLI + Xcode **`.app`** target; reads front app menu shortcuts via Accessibility. |

## Quick links

| Doc | Purpose |
|-----|---------|
| [CLAUDE.md](CLAUDE.md) | Project rules and context for AI assistants |
| [AGENTS.md](AGENTS.md) | Cursor/agent conventions |
| [docs/LEARNING.md](docs/LEARNING.md) | Concepts and glossary (learning path) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System shape and data flow |
| [docs/CASE_STUDY.md](docs/CASE_STUDY.md) | Portfolio-style narrative (fill as you build) |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [ROADMAP.md](ROADMAP.md) | Planned work |
| [docs/adr/](docs/adr/) | Architecture Decision Records |

## How to run

**Terminal (SwiftPM — no `.app`)**

```bash
cd /path/to/shortcut-reference
swift run ShortcutReference
```

**Xcode — real `ShortcutReference.app` (step 1: bundle)**

1. Open **`ShortcutReference.xcodeproj`** (or the repo folder in Xcode and pick that project).
2. Scheme **ShortcutReference** → **Run** (⌘R).
3. After a successful build, **`ShortcutReference.app`** is usually under **DerivedData**, or—if Xcode is set to a **project-relative build location**—under **`build/Debug/`** next to this repo. To open the folder:
   - **Xcode 14/15:** **Product → Show Build Folder in Finder** (if present), or
   - **Report navigator** (⌘9) → select the latest **Build** → expand **Log** and search for **`ShortcutReference.app`**, or
   - Terminal:  
     `xcodebuild -scheme ShortcutReference -project ShortcutReference.xcodeproj -configuration Debug -showBuildSettings 2>/dev/null | grep BUILT_PRODUCTS_DIR`  
     then open that directory in Finder — the `.app` is inside it.

**Easier — copy into `./dist/`**

```bash
./scripts/build-app.sh          # Debug build → copies app to dist/ and opens it
./scripts/build-app.sh Release  # Release
```

The script **copies** the built app to **`dist/ShortcutReference.app`** (gitignored) so you always have a copy next to the project. Drag that into **`/Applications`** to install.

**Optional:** If you install [XcodeGen](https://github.com/yonaskolb/XcodeGen) on a newer macOS, `project.yml` can regenerate the project; the repo already includes a hand-maintained `ShortcutReference.xcodeproj` for macOS 13 / no Homebrew XcodeGen.

**Accessibility:** Enable **ShortcutReference** in **System Settings → Privacy & Security → Accessibility** when using the **`.app`**. For `swift run`, enable **Terminal** (or your terminal host).

**Accessibility keeps resetting after every ⌘R?** Xcode **Debug** builds without a **Signing Team** are **ad-hoc** signed; macOS often treats each rebuild as a new app. Fix: target **ShortcutReference** → **Signing & Capabilities** → choose a **Team** (free **Personal Team** is fine). See [docs/LEARNING.md](docs/LEARNING.md) and **Copy steps & details** in the app.

## License

See [LICENSE](LICENSE).
