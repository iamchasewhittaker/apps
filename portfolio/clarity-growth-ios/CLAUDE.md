# Clarity Growth (iOS) — Project Instructions

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App identity

- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.ClarityGrowth`
- **Storage key:** `chase_growth_ios_v1`
- **Entry:** `ClarityGrowth/ClarityGrowthApp.swift`
- **Shared package:** `../clarity-ui` (local SPM — product `ClarityUI`)
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — single source for icons and palette; do not restate full rules in session prompts.
- **Clarity iOS icon system:** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)

## Purpose

Track progress across seven growth areas with streak-aware session logging and lightweight history review.

> *"For Reese. For Buzz. Forward — no excuses."*

## What This App Is

A native iOS habit tracker covering seven growth areas (Faith, Family, Career, Fitness, Mind, Finance, Service) with streak-aware session logging and a history review view. Part of the Clarity iOS suite, sharing the ClarityUI design system and syncing to Supabase via `app_key = growth`.

## Tech stack

SwiftUI · iOS 17 · `@Observable` · UserDefaults + JSON `Codable` · ClarityUI only (no SwiftData, no third-party deps).

## Commands

> **Pre-build (2017 MBP · Ventura · Xcode 15.2):** Mount the iOS 17.2 runtime DMG once per session before any `xcodebuild` call — see root `CLAUDE.md § iOS Build Prerequisite`.

```bash
cd portfolio/clarity-growth-ios

xcodebuild -scheme ClarityGrowth -showdestinations

xcodebuild build -scheme ClarityGrowth \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO

xcodebuild test -scheme ClarityGrowth \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO
```

Open in Xcode: `open ClarityGrowth.xcodeproj`

## File structure

```
ClarityGrowth/
  ClarityGrowthApp.swift
  Models/GrowthBlob.swift
  Services/GrowthConfig.swift
  Services/GrowthStore.swift
  Constants/GrowthDefinitions.swift
  Constants/Quotes.swift
  Views/ContentView.swift
  Views/GrowthDashboardView.swift
  Views/GrowthHistoryView.swift
  Assets.xcassets/
ClarityGrowthTests/
  GrowthBlobTests.swift
```

## Architecture

- Single `GrowthStore` injected with `.environment(GrowthStore.self)` from `@main`
- Views that mutate store state are marked `@MainActor` for Swift 6 isolation safety
- PBX object IDs use prefix **`CG`** (do not reuse `CC`, `CT`, `CX`, or `CB`)

## Constraints

- Do not change `GrowthConfig.storeKey` once real devices hold data
- Preserve 7 area IDs: `gmat`, `job`, `ai`, `pm`, `claude`, `bom`, `cfm`

## Session start — maintenance / v0.2+

```
Read CLAUDE.md and portfolio/clarity-growth-ios/CLAUDE.md first.

Goal: Work on Clarity Growth iOS at portfolio/clarity-growth-ios/.

Read portfolio/clarity-growth-ios/HANDOFF.md for shipped scope and verification.
Run checkpoint before edits; update CHANGELOG / ROADMAP / HANDOFF when you stop.
```
