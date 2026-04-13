# Clarity Triage (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App identity

- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.ClarityTriage`
- **Storage key:** `chase_triage_ios_v1`
- **Entry:** `ClarityTriage/ClarityTriageApp.swift`
- **Shared package:** `../clarity-ui` (local SPM — product `ClarityUI`)

## Purpose

Capacity-based daily triage: pick today’s energy level, add tasks that consume weighted slots, move ideas through a three-stage pipeline, and log wins.

## Tech stack

SwiftUI · iOS 17 · `@Observable` · UserDefaults + JSON `Codable` · ClarityUI only (no SwiftData, no third-party deps).

## Commands

```bash
cd portfolio/clarity-triage-ios

# List simulators (pick one that exists on this machine)
xcodebuild -scheme ClarityTriage -showdestinations

# Build (example: iPhone 15 + iOS 17.2 simulator)
xcodebuild build -scheme ClarityTriage \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO

# Tests
xcodebuild test -scheme ClarityTriage \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO
```

Open in Xcode: `open ClarityTriage.xcodeproj`

## File structure

```
ClarityTriage/
  ClarityTriageApp.swift
  Models/TriageBlob.swift
  Services/TriageConfig.swift
  Services/TriageStore.swift
  Constants/Quotes.swift
  Views/ContentView.swift
  Views/Tasks/       — CapacityPickerView, TaskListView, AddTaskView
  Views/Ideas/       — IdeasView
  Views/Wins/        — WinLoggerView, AddWinView
  Views/Components/  — CapacityBadge
  Assets.xcassets/
ClarityTriageTests/
  TriageBlobTests.swift
```

## Architecture

- Single `TriageStore` injected with `.environment(TriageStore.self)` from `@main`
- `@Bindable(store)` where two-way binding to store properties is needed
- Capacity resets when `capacityDate` is not today; tasks use **weighted** slots (see `TriageStore.slotsRequired(for:)`)

## Accessibility (match Clarity family)

- Semantic fonts via `ClarityTypography`
- Minimum tap targets via `ClarityMetrics.minTapTarget`
- Labels on non-obvious controls; no color-only meaning

## Constraints

- Do not change `TriageConfig.storeKey` string once real devices hold data
- Dark mode palette from ClarityUI (`ClarityPalette.bg`, etc.)
