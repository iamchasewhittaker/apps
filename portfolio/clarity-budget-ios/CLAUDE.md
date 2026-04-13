# Clarity Budget (iOS) — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## App identity

- **Version:** v0.1
- **Bundle ID:** `com.chasewhittaker.ClarityBudget`
- **Storage key:** `chase_budget_ios_v1`
- **Entry:** `ClarityBudget/ClarityBudgetApp.swift`
- **Shared package:** `../clarity-ui` (local SPM — product `ClarityUI`)

## Purpose

Dual-scenario budget (baseline vs stretch) plus wants tracking — local-first, same patterns as Clarity Check-in / Triage / Time.

## Tech stack

SwiftUI · iOS 17 · `@Observable` · UserDefaults + JSON `Codable` · ClarityUI only (no SwiftData, no third-party deps).

## Commands

```bash
cd portfolio/clarity-budget-ios

xcodebuild -scheme ClarityBudget -showdestinations

xcodebuild build -scheme ClarityBudget \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO

xcodebuild test -scheme ClarityBudget \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2' \
  CODE_SIGNING_ALLOWED=NO
```

Open in Xcode: `open ClarityBudget.xcodeproj`

## File structure

```
ClarityBudget/
  ClarityBudgetApp.swift
  Models/BudgetBlob.swift
  Services/BudgetConfig.swift
  Services/BudgetStore.swift
  Constants/Quotes.swift
  Views/ContentView.swift
  Views/BudgetScenariosView.swift
  Views/WantsTrackerView.swift
  Assets.xcassets/
ClarityBudgetTests/
  BudgetBlobTests.swift
```

## Architecture

- Single `BudgetStore` injected with `.environment(BudgetStore.self)` from `@main`
- Views that call store mutations are marked **`@MainActor`** (Swift 6–friendly isolation with `@Observable` stores)
- PBX object IDs use prefix **`CB`** (do not reuse `CC`, `CT`, or `CX`)

## Constraints

- Do not change `BudgetConfig.storeKey` once real devices hold data

## Session start — maintenance / v0.2+

```
Read CLAUDE.md and portfolio/clarity-budget-ios/CLAUDE.md first.

Goal: Work on Clarity Budget iOS at portfolio/clarity-budget-ios/.

Read portfolio/clarity-budget-ios/HANDOFF.md for shipped scope and verification.
Run checkpoint before edits; update CHANGELOG / ROADMAP / HANDOFF when you stop.
```
