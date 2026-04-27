# AGENTS.md — Cursor & coding agents

Read this together with [CLAUDE.md](CLAUDE.md) and portfolio master [`/CLAUDE.md`](../../CLAUDE.md).

## Scope

- Work from **`portfolio/roller-task-tycoon-ios`** unless a task says otherwise.

## Conventions

1. **Swift / SwiftUI** — match existing patterns; iOS 17+.
2. **CHANGELOG.md** under `## [Unreleased]` for features, fixes, or notable refactors.
3. **No drive-by refactors** unrelated to the task.
4. After meaningful changes: refresh **README.md** snapshot if behavior or setup changes.

## Xcode

- Open **RollerTaskTycoon.xcodeproj**; scheme **RollerTaskTycoon**.
- Set **Development Team** for device signing.

- After changing **`BackupSupport`** / import-export: run **RollerTaskTycoonTests** (**⌘U**) or `xcodebuild test -scheme RollerTaskTycoon -destination 'platform=iOS Simulator,name=iPhone 15'`.
- **Layout reference device:** **iPhone 12 Pro Max**; spot-check board/list and Overview on smaller simulators when touching UI.
