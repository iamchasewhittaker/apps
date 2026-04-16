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
| **Focus** | V1 stable. Branding complete. Phase 2 (Supabase sync) planned. |
| **Last touch** | 2026-04-14 — ROLLER/TASK text logo installed on iPhone 12 Pro Max; `docs/BRANDING.md` + `docs/SYNC_PHASE2.md` added; quick-start prompts in HANDOFF |
| **Next** | 1. **Phase 2 — Supabase sync** (see `docs/SYNC_PHASE2.md`) · 2. **V2 — Game Feel** (subtasks, templates, haptics, drag-to-reorder) |

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
- No Supabase sync yet (local-only) — see [`docs/SYNC_PHASE2.md`](docs/SYNC_PHASE2.md)
- App Store not submitted
- Subtasks and templates were cut for V1 simplicity

---

## Quick-start prompts

### General work on this app
```
Read CLAUDE.md and portfolio/roller-task-tycoon-ios/HANDOFF.md first.
Goal: Work on RollerTask Tycoon iOS at portfolio/roller-task-tycoon-ios/.
Run checkpoint before edits; update CHANGELOG / ROADMAP / HANDOFF when done.
Build check: xcodebuild build -scheme RollerTaskTycoon -project RollerTaskTycoon.xcodeproj
  -destination 'platform=iOS Simulator,name=iPhone 16' CODE_SIGNING_ALLOWED=NO
```

### Phase 2 — Supabase sync
```
Read CLAUDE.md, portfolio/roller-task-tycoon-ios/HANDOFF.md,
and portfolio/roller-task-tycoon-ios/docs/SYNC_PHASE2.md first.

Goal: Wire RollerTask Tycoon iOS to Supabase so tasks sync with the web app.

Context:
- iOS app: portfolio/roller-task-tycoon-ios/ (SwiftUI + SwiftData, local-only today)
- Web app: portfolio/rollertask-tycoon-web/ (React CRA, already live at rollertask-tycoon-web.vercel.app)
- Web sync: app_key = 'rollertask', Supabase project unqtnnxlltiadzbqpyhh (shared)
- Blob shape: { schemaVersion, cash, tasks, ledger, _syncAt }
- Conflict rule: remote wins when remote _syncAt > local _syncAt
- Auth pattern: email OTP (same as web) — see web src/App.jsx for reference flow
- Creds: pull from repo root .env.supabase (REACT_APP_SUPABASE_URL + REACT_APP_SUPABASE_ANON_KEY)
- Reference: portfolio/job-search-hq-ios/docs/SYNC_PHASE2.md for the same pattern on another app

Implementation sketch in docs/SYNC_PHASE2.md.
Run checkpoint before any changes. Build check after each step.
```
