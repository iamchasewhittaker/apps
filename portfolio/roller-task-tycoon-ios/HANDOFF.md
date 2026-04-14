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
| **Focus** | Shipped V1 — stable. No active work. |
| **Last touch** | 2026-04-12 — post-ship cleanup docs (`docs: post-ship cleanup for RollerTask Tycoon iOS V1`) |
| **Next** | No immediate work planned. Future ideas: Supabase sync (local-first → cloud), App Store submission |

---

## Quick links

- [CLAUDE.md](CLAUDE.md) · [CHANGELOG.md](CHANGELOG.md) · [LEARNINGS.md](LEARNINGS.md)
- [Linear — RollerTask Tycoon](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771)

---

## Architecture snapshot

- **State:** SwiftData (tasks/attractions) + `@AppStorage` (park cash, display prefs)
- **Tabs:** Overview console · Park Attractions · Settings
- **Backup:** Share sheet JSON export/import — schema v2 (tasks + subtasks + ledger); v1 import still supported
- **No cloud sync** — local-first only

## V1 scope (shipped)
- Attractions with Open → Testing → Broken Down → Closed lifecycle
- Profit ledger (reward on Close)
- Park cash counter
- JSON backup via share sheet

## Known gaps / future
- No Supabase sync yet (local-only)
- App Store not submitted
- Subtasks and templates were cut for V1 simplicity
