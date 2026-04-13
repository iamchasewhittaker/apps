# Clarity Time (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App identity

- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.ClarityTime`
- **Storage key:** `chase_time_ios_v1`
- **Entry:** `ClarityTime/ClarityTimeApp.swift`
- **Shared package:** `../clarity-ui` (local SPM — product `ClarityUI`)

## Purpose

Time sessions (timer + manual logging) and a scripture completion streak — local-first, same patterns as Clarity Check-in / Triage.

## Tech stack

SwiftUI · iOS 17 · `@Observable` · UserDefaults + JSON `Codable` · ClarityUI only (no SwiftData, no third-party deps).

## Commands

```bash
cd portfolio/clarity-time-ios

xcodebuild -scheme ClarityTime -showdestinations

xcodebuild build -scheme ClarityTime \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO

xcodebuild test -scheme ClarityTime \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO
```

Open in Xcode: `open ClarityTime.xcodeproj`

## File structure

```
ClarityTime/
  ClarityTimeApp.swift
  Models/TimeBlob.swift
  Services/TimeConfig.swift
  Services/TimeStore.swift
  Constants/Quotes.swift
  Views/ContentView.swift
  Views/TimeSessionsView.swift
  Views/ScriptureStreakView.swift
  Assets.xcassets/
ClarityTimeTests/
  TimeBlobTests.swift
```

## Architecture

- Single `TimeStore` injected with `.environment(TimeStore.self)` from `@main`
- PBX object IDs use prefix **`CX`** (do not reuse `CT` — Triage)

## Constraints

- Do not change `TimeConfig.storeKey` once real devices hold data
- Dark mode palette from ClarityUI (`ClarityPalette.bg`, etc.)

## Session start — maintenance only

Paste when continuing **this** app (bugs, v0.2 polish):

```
Read CLAUDE.md and portfolio/clarity-time-ios/CLAUDE.md first.

Goal: Work on Clarity Time iOS at portfolio/clarity-time-ios/.

Read portfolio/clarity-time-ios/HANDOFF.md for shipped scope and verification notes.
Run checkpoint before edits; update CHANGELOG / ROADMAP / this HANDOFF when you stop.
```

For **Phase 4 (Clarity Budget)**, use the prompt in `portfolio/clarity-time-ios/HANDOFF.md` (Next / Phase 4 section).
