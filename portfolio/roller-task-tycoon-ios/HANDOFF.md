# HANDOFF — RollerTask Tycoon (iOS)

> Per-app session state. **Monorepo session routine** still uses repo-root [`HANDOFF.md`](../../HANDOFF.md) — update that file's **State** when you stop, and keep *this* file in sync when work is iOS-only.

---

## State

| Field | Value |
|-------|-------|
| **Path** | `portfolio/roller-task-tycoon-ios/` |
| **Version** | v1.0 |
| **Platform** | Native iOS — SwiftUI + SwiftData |
| **Bundle ID** | `com.chasewhittaker.ParkChecklist` |
| **Focus** | Shipped V1 — stable. |
| **Last touch** | 2026-04-15 — brighter AppIcon; `devicectl` uninstall + reinstall on physical iPhone; README/CLAUDE/HANDOFF device notes |
| **Next** | No immediate work planned. Future ideas: Supabase sync (local-first → cloud), App Store submission |

---

## Quick links

- [CLAUDE.md](CLAUDE.md) · [CHANGELOG.md](CHANGELOG.md) · [LEARNINGS.md](LEARNINGS.md)
- [Linear — RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771)

---

## Architecture snapshot

- **State:** SwiftData (tasks/attractions) + `@AppStorage` (park cash, display prefs)
- **Tabs:** Overview · Attractions · Finances
- **Backup:** Share sheet JSON export/import — schema v2 (tasks + subtasks + ledger); v1 import still supported
- **No cloud sync** — local-first only

## V1 scope (shipped)
- Attractions with Open → Testing → Broken Down → Closed lifecycle
- Profit ledger (reward on Close)
- Park cash counter
- JSON backup via share sheet

## Physical iPhone (CLI reinstall)

From repo root, with the phone **unlocked** and **Developer Mode** on (iOS 16+):

1. `xcrun devicectl list devices` — use the iPhone **Identifier** UUID.
2. `xcrun devicectl device uninstall app --device <UUID> com.chasewhittaker.ParkChecklist`
3. `xcodebuild -scheme RollerTaskTycoon -project RollerTaskTycoon.xcodeproj -configuration Debug -destination 'generic/platform=iOS' -derivedDataPath /tmp/rtt-iphone-build -allowProvisioningUpdates build`
4. `xcrun devicectl device install app --device <UUID> "/tmp/rtt-iphone-build/Build/Products/Debug-iphoneos/RollerTaskTycoon.app"`

If the home icon looks **dim**, trust the cert (**Settings → General → VPN & Device Management**) then reinstall; see [README.md](README.md#dim--gray-home-screen-icon-development--sideload).

## Known gaps / future
- No Supabase sync yet (local-only)
- App Store not submitted
- Subtasks and templates were cut for V1 simplicity
