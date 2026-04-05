# App Flow — Park Checklist (iOS)

Park-specific; canonical blank: `docs/ios-app-starter-kit/APP_FLOW.md`.

## Screen list (current)

- **Main checklist** — single primary screen: open tasks, completed section, toolbar, status banner.
- **Templates** — sheet: categorized preset tasks → add to list.
- **Settings** — sheet: readable fonts toggle (and room for future prefs).
- **Share sheet** — system UI for exported JSON (not a custom screen).
- **File picker** — system document import for `.json` backup (via toolbar).

No separate onboarding or auth in v1.

## Navigation structure

- **Navigation stack** — primary container (`NavigationStack` / equivalent) for title and toolbar.
- **Modal sheets** — Templates, Settings.
- **Alerts** — as needed for confirmations (e.g. destructive actions if added later).
- **Activity view** — `UIActivityViewController` wrapper for export.

## First screen

**Checklist** — user lands on tasks immediately; park cash and rating in leading toolbar; actions in trailing toolbar.

## Main action

**Complete a task** (or add a task) — core value loop.

## Primary flow

Launch → Checklist visible → tap to complete task → cash/toast/haptics → task appears in **completed** section with strikethrough.

Add task: (per current UI) user adds text → task appears in open section.

## Secondary flows

- **Templates:** Toolbar → Templates sheet → pick template / category → tasks added.
- **Export:** Toolbar → Export → JSON generated → share sheet → save to Files / AirDrop / etc.
- **Import:** Toolbar → Import → pick `.json` → if valid, **Replace all** confirmation → tasks + cash replaced → toast.
- **Settings:** Toolbar → Settings → toggle readable fonts → dismiss.

## Empty states

- **No tasks:** List area shows empty state / spacer (see `ChecklistView` / `ContentView`); user can add first task or use templates.

## Error states

- **Export failure:** Surface error (alert or inline) if file write fails; do not claim success.
- **SwiftData failures:** Rare; log / crash in dev; avoid silent data loss (follow existing patterns).
- **Import:** Invalid JSON, wrong `schemaVersion`, bad task id/date → alert with message; **no** partial apply. User can cancel before replace confirm.

## Permission flows

None required for v1 (no camera, location, notifications yet).

## UX questions (answered for baseline)

| Question | Answer |
|----------|--------|
| First screen? | Checklist |
| Main action? | Complete / add task |
| Minimal taps to success? | Open app → one tap to complete existing task |
| Stuck points? | First-time user may need to discover templates/export in toolbar |
| No data? | Empty list state + add flow |

## Low-fidelity wireframes

Add Figma or screenshots here when available.

## Notes

Import uses toolbar + file picker + confirm dialog; optional future: post-import summary counts.
