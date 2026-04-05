# RollerTask Tycoon (iOS)

**One-liner:** Native **SwiftUI** checklist with a **park / tycoon** theme: open vs completed sections, **+250 park cash** per completion, templates, **JSON backup** via the system share sheet, and **no Win95/desktop window** chrome (iOS navigation + park HUD styling).

**Monorepo:** `portfolio/roller-task-tycoon-ios` under [iamchasewhittaker/apps](https://github.com/iamchasewhittaker/apps).

**Note:** The app **bundle identifier** remains `com.chasewhittaker.ParkChecklist` for App Store continuity. **Linear** project may still be titled [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) until renamed.

## Portfolio snapshot

| | |
|---|---|
| **Problem** | Fun themed todos on device with exportable backup. |
| **Approach** | SwiftUI + SwiftData (`ChecklistTaskItem`); `@AppStorage` for cash + readable-font toggle; share sheet for `RollerTaskTycoon-backup-YYYY-MM-DD.json`. |
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

SwiftData store: app container (tasks).

## Backup format

Exported JSON includes `schemaVersion`, `exportedAt` (ISO8601), `cash`, and `tasks[]` with `id`, `text`, `isDone`, `createdAt`. **Import** (toolbar): pick a `.json` file; only **schema version 1**; confirms **replace all** tasks and park cash before applying.

**Tests:** In Xcode, run **RollerTaskTycoonTests** (`BackupImporter` decode/validation). **CI:** Web apps use repo [`.github/workflows/portfolio-web-build.yml`](../../.github/workflows/portfolio-web-build.yml) (`npm run build` per app).

## Docs

| File | Purpose |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | Assistant / human context |
| [AGENTS.md](AGENTS.md) | Agent conventions |
| [CHANGELOG.md](CHANGELOG.md) | Release notes |
| [ROADMAP.md](ROADMAP.md) | Next ideas |
| [iOS App Starter Kit](../../docs/ios-app-starter-kit/README.md) | Reusable product / PRD / release planning templates |
| [Planning](docs/planning/README.md) | Filled brief, PRD, flow, technical design, backlog, QA, release + [`PLANNING_WORKFLOW.md`](docs/planning/PLANNING_WORKFLOW.md) |
| [Linear — Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) | Project + backlog issues (WHI-15…19) |

## License

Follow the license of the parent monorepo repository.
