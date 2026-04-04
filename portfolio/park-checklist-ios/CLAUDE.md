# CLAUDE.md — Park Checklist (iOS)

Instructions for AI assistants and humans working in this directory.

## What this project is

A **native iOS** park-themed checklist: **SwiftUI** + **SwiftData**, **@AppStorage** for cash and display prefs, **share sheet** JSON backup. Visual goal: **tycoon / park HUD** (not Win95 desktop windows or a faux taskbar).

## Behavior rules

1. **Local-first:** Tasks live in SwiftData; cash in `UserDefaults` via `@AppStorage`.
2. **Completing** a task leaves it on the list with **strikethrough** (completed section).
3. **Backup** is export-only until import is built; document `schemaVersion` when changing the envelope.
4. **Do not** add Win95 window chrome or Start-menu metaphors; keep **iOS-native** navigation patterns.

## Layout

```
ParkChecklist.xcodeproj
ParkChecklist/
  ParkChecklistApp.swift
  Models/ChecklistTaskItem.swift
  Views/ContentView.swift, ChecklistView.swift, TemplatesView.swift, SettingsView.swift
  Theme/ParkTheme.swift
  Data/TemplateLibrary.swift, GameFlavor.swift, BackupSupport.swift
  Assets.xcassets
```

## When editing

- Small, focused changes; update **CHANGELOG.md** under `## [Unreleased]` for user-visible work.
- Match existing Swift style; no TypeScript (N/A here).

## References

- Portfolio master: [`/CLAUDE.md`](../../CLAUDE.md)
- Thematic cousin (web PWA, different UI): [`/portfolio/roller-task-tycoon`](../../portfolio/roller-task-tycoon)
