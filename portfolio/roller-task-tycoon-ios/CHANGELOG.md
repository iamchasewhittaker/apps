# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Park Operations Console:** five-tab shell (**Overview**, **Attractions**, **Staff**, **Finances**, **Map**) with retro panel styling; **attractions** use statuses **Open / Testing / Broken Down / Closed**, plus **zone**, **staff role**, **priority**, **reward**, optional **due date**, **description**, and **subtasks**.
- **Overview** dashboard: park rating %, profit today (ledger), guest count, alerts; cards for status, guest thoughts, top priorities, quick actions (**Add**, **Testing**, **Log profit**, **Repair**).
- **Attractions:** horizontal **board** (four columns) and **list** toggle; **detail** “ride panel” with status actions, edit sheet, subtask checkoffs, delete.
- **Profit ledger** (`ProfitLedgerEntry`) + variable **reward on close**; **Log profit** sheet for manual dollars (ledger + cash).
- **Staff** panel (Operator, Janitor, Mechanic, Entertainer) with heuristic assignment display; **Map** = zone list → filtered Attractions.
- **Backup schema v2** (tasks + subtasks + **ledger**); import still accepts **v1** (`isDone`); [`ParkDataImport`](RollerTaskTycoon/Data/ParkDataImport.swift) replace-all restore.
- **Docs:** [`docs/PARK_OPERATIONS_CONSOLE.md`](docs/PARK_OPERATIONS_CONSOLE.md) (product spec), [`docs/PARK_OPERATIONS_KEY.md`](docs/PARK_OPERATIONS_KEY.md) (definitions + how-to).
- SwiftData models **`SubtaskItem`**, **`ProfitLedgerEntry`**; **[`ParkDomain`](RollerTaskTycoon/Data/ParkDomain.swift)** enums; one-time **[`LegacyTaskMigration`](RollerTaskTycoon/Data/LegacyTaskMigration.swift)** from legacy `isDone`.

### Removed

- **ChecklistView** (replaced by Attractions board/list + detail flow). **V1:** no completion sound effect (previous checklist “ding” removed).

### Changed

- **App icon:** single **1024×1024** `AppIcon.png` in `AppIcon.appiconset` (park green gradient, simple coaster silhouette + gold accent); center-cropped to square and scaled for App Store sizing; wired in `Contents.json`.

- **Rebrand** to **RollerTask Tycoon:** monorepo path **`portfolio/roller-task-tycoon-ios`**; Xcode project **RollerTaskTycoon** / targets **RollerTaskTycoon**, **RollerTaskTycoonTests**; **`RollerTaskTycoonApp`** entry; display name **RollerTask Tycoon**; bundle id **`com.chasewhittaker.ParkChecklist`** unchanged.
- **`UserDefaults`:** keys **`chase_roller_task_tycoon_ios_cash`** and **`chase_roller_task_tycoon_ios_readable`** with one-time migration from `chase_park_checklist_ios_*` via **`PreferencesMigration`**.
- **Backup export** filename **`RollerTaskTycoon-backup-YYYY-MM-DD.json`**; import error copy updated.

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
