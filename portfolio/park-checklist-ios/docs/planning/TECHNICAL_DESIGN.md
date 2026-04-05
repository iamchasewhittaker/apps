# Technical Design — Park Checklist (iOS)

Park-specific; canonical blank: `docs/ios-app-starter-kit/TECHNICAL_DESIGN.md`.

## Final chosen stack

| Layer | Choice |
|--------|--------|
| UI | SwiftUI |
| Architecture | Views + model layer (MVVM-friendly; no heavy VM layer required for v1) |
| State | `@Query`, `@Bindable`, `@AppStorage`, `@State` / `@Environment` as in codebase |
| Persistence | **SwiftData** (`ChecklistTaskItem`) |
| Preferences | `@AppStorage` → `UserDefaults` (`chase_park_checklist_ios_*`) |
| Networking | None (v1) |
| Backend | None (v1) |
| Analytics | None (v1) |
| Packages | SPM / system only (no third-party for baseline) |

## Why this stack

Matches **local-first** checklist, fast iteration in Xcode, and portfolio convention for this app (see [`CLAUDE.md`](../../CLAUDE.md)).

## App structure (actual)

See [`CLAUDE.md`](../../CLAUDE.md) layout. High level:

- `ParkChecklistApp.swift` — app entry, model container.
- `ContentView.swift` — root composition.
- `Models/ChecklistTaskItem.swift` — SwiftData model.
- `Views/*` — checklist, templates, settings.
- `Theme/ParkTheme.swift` — colors, typography hooks.
- `Data/*` — templates, flavor text, backup envelope.

## Data model

### `ChecklistTaskItem` (SwiftData)

- `id` (UUID)
- `text` (String)
- `isDone` (Bool)
- `createdAt` (Date)

### Backup envelope (`BackupSupport.swift`)

- `schemaVersion: Int` (currently **1**)
- `exportedAt: String` (ISO8601)
- `cash: Int`
- `tasks: [{ id, text, isDone, createdAt }]` (string dates in export)

**Import:** `BackupImporter.decodeAndValidate(data:)` / `loadFromFile(url:)` — schema **1** only; UUID + ISO8601 checks. UI: `fileImporter` + destructive confirm; `apply` deletes all `ChecklistTaskItem` via `modelContext`, inserts rows with `ChecklistTaskItem(id:text:isDone:createdAt:)`, sets `@AppStorage` cash (`max(0, envelope.cash)`).

## Data flow

SwiftUI views ↔ SwiftData `@Query` / model context for tasks; `@AppStorage` for cash and readable font; export reads current tasks + cash → `BackupEnvelope` → JSON file → share sheet.

## Persistence design

- **Authoritative:** SwiftData store (app container).
- **Derived:** UI state (sheets, toasts).
- **Sidecar:** `UserDefaults` for cash + readability (also embedded in export).

## Error handling approach

User-visible for share/export failures; avoid silent discard of user actions. Prefer simple `Alert` or status message patterns consistent with existing code.

## Testing approach

- Manual: simulator + device for checklist, export, settings.
- Unit tests optional for backup encode/decode when import lands.

## Accessibility requirements

- Readable fonts toggle respects dynamic type / system fonts when on.
- Tap targets per HIG; multiline task text supported.

## Risks

- **Import** must handle schema migration and ID collisions explicitly.
- **Sync** later would need conflict strategy — out of scope until product locks.

## References

- Code: [`BackupSupport.swift`](../../ParkChecklist/Data/BackupSupport.swift)
- Assistant context: [`CLAUDE.md`](../../CLAUDE.md)
