# Park Checklist (iOS)

**One-liner:** Native **SwiftUI** checklist with a **park / tycoon** theme: open vs completed sections, **+250 park cash** per completion, templates, **JSON backup** via the system share sheet, and **no Win95/desktop window** chrome (iOS navigation + park HUD styling).

**Monorepo:** `portfolio/park-checklist-ios` under [iamchasewhittaker/apps](https://github.com/iamchasewhittaker/apps).

## Portfolio snapshot

| | |
|---|---|
| **Problem** | Fun themed todos on device with exportable backup. |
| **Approach** | SwiftUI + SwiftData (`ChecklistTaskItem`); `@AppStorage` for cash + readable-font toggle; share sheet for `ParkChecklist-backup-YYYY-MM-DD.json`. |
| **Stack** | Xcode 15+, iOS **17+**, Swift 5. |
| **Status** | **Local** — open in Xcode; add **Development Team** for device builds. |

## Troubleshooting

- **Black screen on launch (real device):** Pull latest; the app forces **light** mode and fixes SwiftData + layout sizing. Delete the app from the phone, **Product → Clean Build Folder**, then run again.
- If it persists, check **Xcode → Report navigator** for crashes (e.g. SwiftData store).

## How to run

1. Open **`ParkChecklist.xcodeproj`** in Xcode.
2. Select an **iPhone** simulator or device (install an **iOS Simulator** runtime in Xcode → Settings → Platforms if needed).
3. **Run** (⌘R). Set **Signing & Capabilities** → Team if building to a physical device.

## Storage keys (`UserDefaults` / `@AppStorage`)

| Key | Purpose |
|-----|---------|
| `chase_park_checklist_ios_cash` | Park cash (default 1000) |
| `chase_park_checklist_ios_readable` | Use system fonts for readability |

SwiftData store: app container (tasks).

## Backup format

Exported JSON includes `schemaVersion`, `exportedAt` (ISO8601), `cash`, and `tasks[]` with `id`, `text`, `isDone`, `createdAt`. **Import/restore** is not implemented yet; keep the file for safekeeping or manual merge.

## Docs

| File | Purpose |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | Assistant / human context |
| [AGENTS.md](AGENTS.md) | Agent conventions |
| [CHANGELOG.md](CHANGELOG.md) | Release notes |
| [ROADMAP.md](ROADMAP.md) | Next ideas |

## License

Follow the license of the parent monorepo repository.
