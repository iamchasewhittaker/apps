# RollerTask Tycoon (iOS)

**One-liner:** Native **SwiftUI** **park operations console**: attractions with **Open / Testing / Broken Down / Closed**, zones & staff roles, **variable rewards** + **profit ledger**, five-tab dashboard (**Overview**, **Attractions**, **Staff**, **Finances**, **Map**), templates, and **JSON backup** (schema **v2**, still imports **v1**).

**Monorepo:** `portfolio/roller-task-tycoon-ios` under [iamchasewhittaker/apps](https://github.com/iamchasewhittaker/apps).

**Note:** The app **bundle identifier** remains `com.chasewhittaker.ParkChecklist` for App Store continuity. **Linear** project may still be titled [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) until renamed.

## Portfolio snapshot

| | |
|---|---|
| **Problem** | Fun themed todos on device with exportable backup. |
| **Approach** | SwiftUI + SwiftData (`ChecklistTaskItem`, `SubtaskItem`, `ProfitLedgerEntry`); `@AppStorage` for cash + readable-font toggle; tab shell + board/list attractions; share sheet for `RollerTaskTycoon-backup-YYYY-MM-DD.json` (v2). |
| **Stack** | Xcode **current enough for your phone’s iOS** (15+ minimum for the project); app targets iOS **17+**; Swift 5. |
| **Status** | **Local** — open in Xcode; add **Development Team** for device builds. |

## Troubleshooting

### “Could not attach to pid” / `IDEDebugSessionErrorDomain` Code 7 (physical iPhone)

Usually the app **never stays running** long enough for the debugger to attach, or the **toolchain doesn’t match the phone’s iOS**.

1. **Xcode vs iOS on the phone (most common)**  
   If the iPhone is on a **much newer iOS** than your Xcode supports for *debugging* (e.g. **Xcode 15.2** with an **iOS 26** device), install the **latest Xcode** from the Mac App Store or [developer.apple.com/download](https://developer.apple.com/download/) so it includes device support for that OS. Until then, use an **iOS Simulator** or a device whose OS is within the range your Xcode version documents.

2. **Signing**  
   In Xcode: target **RollerTaskTycoon** → **Signing & Capabilities** → select your **Team**, no red errors. On the iPhone: **Settings → General → VPN & Device Management** → trust your developer certificate if prompted.

3. **Launch crash (looks like an attach failure)**  
   **Xcode → Report navigator** (⌘9) → latest **Run** / **Crashes**. On the Mac, **Console.app** → select the iPhone → clear → Run in Xcode → filter for **RollerTaskTycoon** or **crash**.

4. **Diagnostics interfering with attach**  
   **Product → Scheme → Edit Scheme… → Run → Diagnostics** — temporarily turn **off** options such as **View Debugging** (injecting a dylib on launch can break attach on some device/OS combos). Run again.

5. **Clean reinstall**  
   Delete **RollerTask Tycoon** from the phone → **Product → Clean Build Folder** → Run (⌘R).

### Black screen on launch (real device)

Pull latest; the app forces **light** mode and fixes SwiftData + layout sizing. If it still happens after the steps above, treat it as a **crash on launch** (see step 3).

## How to run

1. Open **`RollerTaskTycoon.xcodeproj`** in Xcode.
2. Select an **iPhone** simulator or device (install an **iOS Simulator** runtime in Xcode → Settings → Platforms if needed).
3. **Run** (⌘R). Set **Signing & Capabilities** → Team if building to a physical device.

## Storage keys (`UserDefaults` / `@AppStorage`)

| Key | Purpose |
|-----|---------|
| `chase_roller_task_tycoon_ios_cash` | Park cash (default 1000); migrated once from `chase_park_checklist_ios_cash` if present |
| `chase_roller_task_tycoon_ios_readable` | Use system fonts for readability; migrated from `chase_park_checklist_ios_readable` if present |
| `chase_roller_task_tycoon_ios_board` | Attractions default to **Board** (`true`) vs **List** |
| `chase_roller_task_tycoon_ios_migrated_v2_fields` | One-time flag after legacy `isDone` → status migration |

SwiftData store: app container (attractions, subtasks, ledger).

## Backup format

**Export (current):** `schemaVersion` **2**, `exportedAt`, `cash`, `tasks[]` (status, zone, staff, priority, reward, due, details, `closedAt`, nested `subtasks[]`), and `ledger[]` (profit events including manual “Log profit”).

**Import:** **v1** (`isDone` + legacy fields) or **v2**; confirms **replace all** attractions, subtasks, ledger, and park cash.

**Tests:** In Xcode, run **RollerTaskTycoonTests** (`BackupImporter` decode/validation). **CI:** The four CRA portfolio web apps use repo [`.github/workflows/portfolio-web-build.yml`](../../.github/workflows/portfolio-web-build.yml) (**Node 20**, `npm ci` then `npm run build` per app). This iOS app is not in that workflow.

## Docs

| File | Purpose |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | Assistant / human context |
| [AGENTS.md](AGENTS.md) | Agent conventions |
| [CHANGELOG.md](CHANGELOG.md) | Release notes |
| [ROADMAP.md](ROADMAP.md) | Next ideas |
| [iOS App Starter Kit](../../docs/ios-app-starter-kit/README.md) | Reusable product / PRD / release planning templates |
| [Planning](docs/planning/README.md) | Filled brief, PRD, flow, technical design, backlog, QA, release + [`PLANNING_WORKFLOW.md`](docs/planning/PLANNING_WORKFLOW.md) |
| [Park Operations spec](docs/PARK_OPERATIONS_CONSOLE.md) | Product / design narrative for the console + roadmap hints |
| [Park Operations key](docs/PARK_OPERATIONS_KEY.md) | What every control and metric means + step-by-step usage |
| [Linear — Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) | Project + backlog issues (WHI-15…19) |

## License

Follow the license of the parent monorepo repository.
