# QA checklist — Park Checklist (iOS)

Park-specific; canonical blank: `docs/ios-app-starter-kit/QA_CHECKLIST.md`.

Run before merge to `main` or before TestFlight handoff.

## Device / environment

- [ ] Simulator: fresh install + repeat run
- [ ] Physical device (if available): signed build
- [ ] iOS 17+ target confirmed

## Core checklist

- [ ] Add task → appears in open section
- [ ] Complete task → strikethrough, moves to completed section, cash increases
- [ ] Multiple lines / long title wrap correctly; row layout not clipped
- [ ] Toolbar: cash and rating visible; no overlap at small width (scale / wrap)

## Templates

- [ ] Open templates sheet → categories load
- [ ] Add from template → tasks appear as expected

## Settings

- [ ] Readable fonts toggle persists across relaunch
- [ ] Visual change obvious when toggled

## Backup export

- [ ] Export produces JSON; open in Files or text editor
- [ ] `schemaVersion`, `exportedAt`, `cash`, `tasks` present and plausible
- [ ] Share sheet completes without crash

## Backup import

- [ ] Import toolbar button opens file picker (JSON)
- [ ] Valid backup → confirm dialog → Replace removes old tasks and loads file; cash matches (try negative cash → clamps to 0)
- [ ] Wrong schema / corrupt JSON / bad task id → alert, data unchanged
- [ ] Cancel on confirm dialog leaves data unchanged
- [ ] Round-trip: export → clear or edit tasks → import same file → matches export

## Theming / UX

- [ ] Light appearance enforced (no invisible text in Dark Mode)
- [ ] Haptics / sound / toasts (if enabled) not annoying or broken
- [ ] No Win95/desktop window chrome regressions

## Regression after changes

- [ ] SwiftData: delete app reinstall if model changed (document in CHANGELOG)
- [ ] Re-run sections above for touched flows

## Notes

When **import** ships, add: corrupt file, wrong version, empty file, duplicate IDs, large payload.
