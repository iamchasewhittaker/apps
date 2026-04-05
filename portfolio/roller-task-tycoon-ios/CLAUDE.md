# CLAUDE.md — RollerTask Tycoon (iOS)

Instructions for AI assistants and humans working in this directory.

## What this project is

A **native iOS** park-themed checklist branded **RollerTask Tycoon**: **SwiftUI** + **SwiftData**, **@AppStorage** for cash and display prefs, **share sheet** JSON backup. Visual goal: **tycoon / park HUD** (not Win95 desktop windows or a faux taskbar).

**Bundle ID:** `com.chasewhittaker.ParkChecklist` (unchanged from the original Park Checklist app for App Store continuity).

## Behavior rules

1. **Local-first:** Tasks live in SwiftData; cash in `UserDefaults` via `@AppStorage`.
2. **Completing** a task leaves it on the list with **strikethrough** (completed section).
3. **Backup** export/import: document `schemaVersion` when changing the envelope.
4. **Do not** add Win95 window chrome or Start-menu metaphors; keep **iOS-native** navigation patterns.

## Layout

```
RollerTaskTycoon.xcodeproj
RollerTaskTycoon/
  RollerTaskTycoonApp.swift
  ContentView.swift
  Models/ChecklistTaskItem.swift
  Views/ChecklistView.swift, TemplatesView.swift, SettingsView.swift
  Theme/ParkTheme.swift
  Data/TemplateLibrary.swift, GameFlavor.swift, BackupSupport.swift, PreferencesMigration.swift
  Assets.xcassets
```

## When editing

- Small, focused changes; update **CHANGELOG.md** under `## [Unreleased]` for user-visible work.
- Match existing Swift style; no TypeScript (N/A here).

## References

- Portfolio master: [`/CLAUDE.md`](../../CLAUDE.md)
- **Archived** Win95-style web PWA (historical): [`/portfolio/archive/roller-task-tycoon`](../archive/roller-task-tycoon)
