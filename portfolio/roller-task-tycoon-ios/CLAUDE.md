# CLAUDE.md — RollerTask Tycoon (iOS)

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


Instructions for AI assistants and humans working in this directory.

## What this project is

A **native iOS** park-themed checklist branded **RollerTask Tycoon**: **SwiftUI** + **SwiftData**, **@AppStorage** for cash and display prefs, **share sheet** JSON backup. Visual goal: **tycoon / park HUD** (not Win95 desktop windows or a faux taskbar).

**Bundle ID:** `com.chasewhittaker.ParkChecklist` (unchanged from the original Park Checklist app for App Store continuity).

> *"For Reese. For Buzz. Forward — no excuses."*

## What This App Is

A native iOS park-themed task manager where completing tasks earns cash for a virtual tycoon park — attractions move through Open → Testing → Broken Down → Closed states, and cash accumulates in a profit ledger. Built with SwiftUI + SwiftData for full offline-first operation with JSON backup and restore.

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

## Pre-build prerequisite (2017 MBP · Ventura · Xcode 15.2)

Mount the iOS 17.2 runtime DMG once per session before any `xcodebuild` call — see root `CLAUDE.md § iOS Build Prerequisite` for the full command.

## Physical device install (CLI)

For a **clean reinstall** (e.g. dim SpringBoard icon after sideload): `xcrun devicectl device uninstall app --device <UUID> com.chasewhittaker.ParkChecklist`, then `xcodebuild … -destination 'generic/platform=iOS' -derivedDataPath /tmp/rtt-iphone-build build`, then `xcrun devicectl device install app --device <UUID> /tmp/rtt-iphone-build/Build/Products/Debug-iphoneos/RollerTaskTycoon.app`. UUID from `xcrun devicectl list devices`. Full context: [README.md](README.md#dim--gray-home-screen-icon-development--sideload).

## References

- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) -- icons, asset paths, visual system
- Portfolio master: [`/CLAUDE.md`](../../CLAUDE.md)
- **Archived** Win95-style web PWA (historical): [`/portfolio/archive/roller-task-tycoon`](../archive/roller-task-tycoon)

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
