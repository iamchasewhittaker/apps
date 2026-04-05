# CLAUDE.md — Park Checklist (iOS)

Instructions for AI assistants and humans working in this directory.

## What this project is

A **native iOS** park-themed checklist: **SwiftUI** + **SwiftData**, **@AppStorage** for cash and display prefs, **share sheet** JSON backup. Visual goal: **tycoon / park HUD** (not Win95 desktop windows or a faux taskbar).

## Behavior rules

1. **Local-first:** Tasks live in SwiftData; cash in `UserDefaults` via `@AppStorage`.
2. **Completing** a task leaves it on the list with **strikethrough** (completed section).
3. **Backup:** export via share sheet; **import** is replace-all from JSON (`schemaVersion` **1** only) after confirmation. Document `schemaVersion` when changing the envelope.
4. **Do not** add Win95 window chrome or Start-menu metaphors; keep **iOS-native** navigation patterns.

## Layout

```
ParkChecklist.xcodeproj
ParkChecklist/
  ParkChecklistApp.swift
  ContentView.swift
  Models/ChecklistTaskItem.swift
  Views/ChecklistView.swift, TemplatesView.swift, SettingsView.swift
  Theme/ParkTheme.swift
  Data/TemplateLibrary.swift, GameFlavor.swift, BackupSupport.swift
  Assets.xcassets
```

## When editing

- Small, focused changes; update **CHANGELOG.md** under `## [Unreleased]` for user-visible work.
- Match existing Swift style; no TypeScript (N/A here).

## Planning (major scope)

For features that change product surface, backup format, sync, or navigation: follow **[`docs/planning/PLANNING_WORKFLOW.md`](docs/planning/PLANNING_WORKFLOW.md)** and keep **[`docs/planning/`](docs/planning/README.md)** aligned with what you ship. **Blank templates** and phase framework: **[`docs/ios-app-starter-kit/`](../../docs/ios-app-starter-kit/README.md)** — use that **`CLAUDE.md`** only for planning discipline, not for Park-specific behavior.

## References

- Portfolio master: [`/CLAUDE.md`](../../CLAUDE.md)
- Thematic cousin (web PWA, different UI): [`/portfolio/roller-task-tycoon`](../../portfolio/roller-task-tycoon)
