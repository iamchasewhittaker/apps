# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

- **Black / empty screen on device:** attach `modelContainer` to `ContentView`, expand root `VStack` and `List` with `frame(maxWidth:maxHeight:)`, add `Spacer` when the list is empty, and force **light** color scheme so fixed palette isn’t invisible in Dark Mode.
- **Clipped UI:** leading toolbar uses a **two-line** stack (cash, then rating) with tighter `minimumScaleFactor`; status banner and task titles **wrap**; list area gets extra **bottom safe-area padding**; task rows align icon to **top** for multi-line titles.

### Changed

- **README:** troubleshooting for **device attach errors** (`IDEDebugSessionErrorDomain` / Xcode–iOS mismatch, signing, diagnostics, crash logs).
- **Docs:** **`docs/planning/README.md`** — place for filled Park-specific planning copies (templates stay in monorepo **`docs/ios-app-starter-kit/`**).
- **README:** link to monorepo **[`docs/ios-app-starter-kit/`](../../docs/ios-app-starter-kit/README.md)** for iOS product / PRD / release planning templates.
- Project path: **`portfolio/park-checklist-ios`** (was `projects/park-checklist-ios`).
- **Xcode:** `ContentView.swift` at `ParkChecklist/ContentView.swift` (next to `ParkChecklistApp.swift`) so the project path matches Xcode’s default SwiftUI layout and avoids “Build input file cannot be found”.

### Added

- **Backup import:** toolbar **Import backup** → `.json` file → validate **`schemaVersion` 1** → confirm **replace all** → SwiftData tasks + `@AppStorage` cash (`BackupImporter`, destructive confirm in `ContentView`). **`ChecklistTaskItem(id:text:isDone:createdAt:)`** for restore.
- **`ParkChecklistTests`:** `BackupImporter` decode / schema / UUID / date validation.
- **Planning:** filled **`docs/planning/`** set (workflow, brief, PRD, app flow, technical design, backlog, QA, release). **Linear** [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) with issues WHI-15…19 mirroring backlog.
- Initial **Park Checklist** iOS app: SwiftUI + SwiftData tasks, open/completed sections, strikethrough for done items.
- **Gamification:** park cash (+250 on complete), rating line, status banner, toasts, haptics, system sound on complete.
- **Top toolbar:** templates, export backup, settings (RCT-inspired game-style icons; standard iOS navigation).
- **Templates** sheet with categorized preset tasks.
- **Settings:** readable fonts toggle.
- **Backup:** versioned JSON export + share sheet (`ParkChecklist-backup-*.json`).
