# PRD — Park Checklist (iOS)

Park-specific; canonical blank: `docs/ios-app-starter-kit/PRD.md`.

## Problem

Users want a **fun, local-first** checklist with optional **file backup**. Export exists; **restore** and **multi-device** stories are unresolved. The app must stay **iOS-native** and avoid faux-desktop UI.

## Users

### Primary user

iPhone user managing personal tasks with optional theme/gamification.

### Secondary user

Anyone archiving data via **JSON export** (Files, AirDrop, etc.).

## User stories

- As a user, I want to **add and complete tasks** so that I see progress and park cash increase.
- As a user, I want **templates** so that I can seed common lists quickly.
- As a user, I want to **export JSON** so that I have a backup file outside the app.
- As a user, I want **readable fonts** so that long titles and UI are easier to read.
- As a user, I want to **import a backup** so that I can restore or replace data from a file (replace-all, confirmed).

## Core user journey

Launch app → see checklist (open / completed sections) → add or complete tasks → (optional) open templates → (optional) export or **import** backup from toolbar → (optional) toggle readable fonts in Settings.

## V1 features (shipped baseline)

- Persisted checklist (SwiftData).
- Complete task → strikethrough, move to completed section, +cash, feedback.
- Templates sheet; settings sheet.
- JSON export with `schemaVersion`, `exportedAt`, `cash`, `tasks[]`.
- Light color scheme enforced for design consistency on device.

## Not in V1 (until specified)

- **Merge** import (replace-only for now; see Import addendum).
- Widgets, Siri intents, Live Activities.
- Cloud sync (CloudKit, Supabase, etc.).
- Collaboration / multi-user.

## Functional requirements

- User can create, view, and mark tasks complete; completed tasks remain visible in a completed section.
- User can open templates and add preset tasks.
- User can export backup JSON via system share sheet; filename pattern `ParkChecklist-backup-YYYY-MM-DD.json`.
- User can **import** a backup JSON file (`schemaVersion` 1 only): validation, confirm replace-all, then tasks + cash match the file.
- User can toggle readable fonts; preference persists (`@AppStorage`).
- Empty list: sensible layout (spacer / prompt per current implementation).
- Cash and display prefs persist via `UserDefaults` keys documented in README.

## Non-functional requirements

- Target **iOS 17+**, SwiftUI, stable on real device (SwiftData).
- No network required for core checklist.
- Accessibility: readable toggle; avoid color-only status where feasible.
- Envelope changes: bump **`schemaVersion`** in code and document in CHANGELOG / technical design.

## Success metrics

- Main flow completable without coaching.
- Crash-free sessions on device for checklist + export.
- Test user can state **one sentence** value (themed todos + backup file).

## Dependencies

- Xcode 15+, development team for device builds.
- No third-party packages required for baseline.

## Open questions

- **Pixel font / art:** performance and licensing (OFL / CC0) vs maintenance.
- **Sync:** CloudKit-only vs alignment with portfolio Supabase pattern — product and privacy implications.

## Import / restore (addendum — locked)

**Mode:** **Replace all** only for v1 import. User picks a JSON file; after validation they confirm a **destructive** dialog; then all SwiftData tasks are removed, tasks and cash from the file are applied. **Merge-by-id** is deferred until explicitly specced (optional follow-up).

**Schema:** Import **only** when `schemaVersion == 1` (matches [`BackupFormat.schemaVersion`](../../ParkChecklist/Data/BackupSupport.swift)). **Higher** schema → error (“newer app required”). **Lower or other** unsupported values → error (no silent migration in v1).

**Validation:** Valid JSON matching `BackupEnvelope`; each task `id` must be a UUID string; each `createdAt` must parse as ISO8601 with `.withInternetDateTime` (same as export). Invalid file → no writes.

**Cash:** Restored from file; negative values clamped to `0` in UI storage.

**Entry point:** Toolbar **Import backup** (with Export); Settings About text summarizes behavior.

## Approval

Treat this PRD as **locked for shipped v1 baseline**; any **new** feature requires updating this file (or an addendum section) before implementation.
