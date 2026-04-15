# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] — 2026-04-12

### Changed (2026-04-15 ship polish)

- **App icon:** Production 1024×1024 asset in `AppIcon.appiconset` (park-themed plaque on grass gradient).
- **Empty states (PRD copy):** Overview — “Your park is ready for its first attraction.”; Attractions — “No attractions yet. Tap + to open the park.”; Finances top earners — “Close attractions to start earning profit.”
- **Overdue due dates:** Due line uses alert red (and slightly stronger card border) when the attraction is past due and not closed.

### Added

- **V1 simplification:** Reduced from 5 tabs → **3 tabs** (Overview / Attractions / Finances). Staff and Map functionality merged into Attractions as **filter chips** (zone + staff role filters in a horizontal scroll bar).
- **In-app Park Guide** (`ParkGuideView`) accessible from Overview toolbar (book icon) — explains statuses, zones, staff roles, park rating, profit system, and best-use tips.
- **Rotating guest thoughts** — expanded phrase pool to 30+ sayings across mood buckets (general, broken, overdue, testing, all-clear); rotates every 10 seconds via timer in Overview.
- **Zone + Staff filter chips** on Attractions screen — horizontal scroll bar replaces dedicated Staff and Map tabs.
- **Backup in Settings** — export/import moved from Overview toolbar to Settings sheet; cleaner toolbar (guide + settings only).
- **Product docs:** [`docs/PRD.md`](docs/PRD.md) (product requirements), [`docs/APP_FLOW.md`](docs/APP_FLOW.md) (screen-by-screen navigation + empty/error states).

### Removed

- **Subtasks** (`SubtaskItem` model, relationship, all subtask UI) — moved to V2. Simplifies data model and detail view.
- **Manual profit logging** (`LogProfitSheet`) — profit now comes exclusively from closing attractions. Cleaner reward loop.
- **Templates** (`TemplateLibrary`, `TemplatesView`) — moved to V2.
- **Legacy migration code** (`LegacyTaskMigration`) — clean slate for V1, no `isDone` compatibility needed.
- **Staff tab** and **Map tab** — replaced by filter chips on Attractions.
- **Backup v1 schema compatibility** — import now requires schema v2; drops `isDone`-only import path.
- **`isDone` field** on `ChecklistTaskItem` — removed; `statusRaw` is authoritative.

### Changed

- **Tab bar** — darkened to `woodDark` (deep brown); selected tab items gold, unselected items beige; persists on scroll and across all tabs.
- **Floating "+" button** — gold circle fixed bottom-right above tab bar (all tabs); opens Add Attraction sheet from anywhere in the app.
- **Overview quick actions** updated to 4 status-filter shortcuts: **Open / Testing / Broken / Closed** — each jumps to Attractions filtered to that status.
- **Priority & Alerts cards** — removed forced `minHeight` so they shrink to fit content instead of taking up half the screen.
- **Finances layout** — Today's profit and Weekly profit now sit side-by-side in an `HStack`; top earners card spans full width below them; both use matching `.parkPanel` style.
- **Overview quick actions** updated: Add, Testing, Repair, All open (replaced Log Profit with All Open shortcut).
- **`try? modelContext.save()`** replaced with `do/catch` in `AttractionDetailView` and `AttractionEditorView` — errors now surface as toasts or alerts instead of failing silently.
- **`StaffFinancesMapViews.swift`** renamed to `FinancesView.swift`; Staff and Map views deleted.
- **`SettingsView`** now accepts `onExport` + `onImport` callbacks; backup section added.
- **`ChecklistTaskItem`** restore initializer updated: removed `isDone` and `subtasks` parameters.

### Added (Park Operations Console — prior session)

- **Park Operations Console:** five-tab shell with retro panel styling; attractions use statuses **Open / Testing / Broken Down / Closed**, plus zone, staff role, priority, reward, optional due date, description.
- **Overview** dashboard: park rating %, profit today (ledger), guest count, alerts; cards for status, guest thoughts, top priorities, quick actions.
- **Attractions:** horizontal board (four columns) and list toggle; detail “ride panel” with status actions, edit sheet, delete.
- **Profit ledger** (`ProfitLedgerEntry`) + variable reward on close.
- **Backup schema v2** (tasks + ledger); [`ParkDataImport`](RollerTaskTycoon/Data/ParkDataImport.swift) replace-all restore.
- **Docs:** [`docs/PARK_OPERATIONS_CONSOLE.md`](docs/PARK_OPERATIONS_CONSOLE.md) (product spec), [`docs/PARK_OPERATIONS_KEY.md`](docs/PARK_OPERATIONS_KEY.md) (definitions + how-to).

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
