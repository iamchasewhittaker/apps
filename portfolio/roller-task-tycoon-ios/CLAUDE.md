# CLAUDE.md — RollerTask Tycoon (iOS)

Instructions for AI assistants and humans working in this directory.

## What this project is

A **native iOS** park-themed checklist branded **RollerTask Tycoon**: **SwiftUI** + **SwiftData**, **@AppStorage** for cash and display prefs, **share sheet** JSON backup. Visual goal: **tycoon / park HUD** (not Win95 desktop windows or a faux taskbar).

**Bundle ID:** `com.chasewhittaker.ParkChecklist` (unchanged from the original Park Checklist app for App Store continuity).

> *"For Reese. For Buzz. Forward — no excuses."*

## Behavior rules

1. **Local-first:** Tasks live in SwiftData; cash in `UserDefaults` via `@AppStorage`.
2. **Attractions** use statuses **Open → Testing → Broken Down → Closed**; closing adds **reward** to park cash and the **profit ledger**.
3. **Backup** export/import: **schema v2** (tasks + subtasks + ledger); still imports **v1** (`isDone` only). Document `schemaVersion` when changing the envelope.
4. **Do not** add Win95 window chrome or Start-menu metaphors; keep **iOS-native** navigation patterns.

## Layout

```
RollerTaskTycoon.xcodeproj
RollerTaskTycoon/
  RollerTaskTycoonApp.swift
  ContentView.swift
  Models/ChecklistTaskItem.swift, SubtaskItem.swift, ProfitLedgerEntry.swift
  Views/OverviewConsoleView, ParkAttractionsView, AttractionDetailView, AttractionEditorView,
       LogProfitSheet, StaffFinancesMapViews, TemplatesView.swift, SettingsView.swift
  Theme/ParkTheme.swift
  Data/ParkDomain.swift, LegacyTaskMigration.swift, ParkStatusTransitions.swift, ParkFinance.swift,
       ParkDataImport.swift, TemplateLibrary.swift, GameFlavor.swift, BackupSupport.swift, PreferencesMigration.swift
  docs/PARK_OPERATIONS_CONSOLE.md, docs/PARK_OPERATIONS_KEY.md
  Assets.xcassets
```

## When editing

- Small, focused changes; update **CHANGELOG.md** under `## [Unreleased]` for user-visible work.
- Match existing Swift style; no TypeScript (N/A here).

## References

- Portfolio master: [`/CLAUDE.md`](../../CLAUDE.md)
- **Archived** Win95-style web PWA (historical): [`/portfolio/archive/roller-task-tycoon`](../archive/roller-task-tycoon)

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
