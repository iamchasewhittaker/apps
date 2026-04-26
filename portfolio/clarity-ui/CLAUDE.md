# ClarityUI — Shared Swift Package

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


> Shared design system package for all Clarity iOS apps.
> See `/CLAUDE.md` (repo root) for portfolio-wide conventions.

## Purpose

Provides colors, typography, spacing, and reusable SwiftUI components so all 5 Clarity apps look and behave consistently — and so accessibility requirements are enforced in one place.

> *"For Reese. For Buzz. Forward — no excuses."*

## What This App Is

The shared Swift package providing colors, typography, spacing, and reusable SwiftUI components across all five Clarity iOS apps — enforcing a consistent visual identity and accessibility standards in one place. Referenced as a local SPM dependency from each app's `.xcodeproj`; changes here propagate automatically to every consumer.

## Consumers

Portfolio iOS apps under `portfolio/clarity-*-ios/` reference this package from their `.xcodeproj` as `../clarity-ui` (sibling folder under `portfolio/`).

| App | Path |
|-----|------|
| Clarity Check-in | `portfolio/clarity-checkin-ios/` |
| Clarity Triage | `portfolio/clarity-triage-ios/` |
| Clarity Time | `portfolio/clarity-time-ios/` |
| Clarity Budget | `portfolio/clarity-budget-ios/` |
| Clarity Growth | `portfolio/clarity-growth-ios/` |

## Structure

```
Sources/ClarityUI/
  Theme/
    ClarityPalette.swift       — Color tokens (source: ClarityTheme.swift in YNAB Clarity)
    ClarityTypography.swift    — Font definitions (semantic, Dynamic Type compliant)
    ClarityMetrics.swift       — Spacing, sizing, tap targets
  Components/
    ClarityCard.swift          — Card ViewModifier (.clarityCard())
    ClarityChoiceButton.swift  — Selectable chip button
    ClarityRating.swift        — 1–10 numeric rating picker
    ClarityMultiChip.swift     — Multi-select tag chips + FlowLayout
    ClarityTriToggle.swift     — 3-way toggle (Yes/Mild/No)
    ClaritySectionLabel.swift  — Uppercase section heading
    ClarityEmptyState.swift    — Empty list state card
    ClarityProgressBar.swift   — Color-coded progress bar
    QuoteBanner.swift          — Daily quote card + ClarityQuote model
  Utilities/
    DateHelpers.swift          — Date formatting, isToday, isStale, isMorning
    StorageHelpers.swift       — Generic UserDefaults load/save/remove
Tests/ClarityUITests/
  ClarityPaletteTests.swift
  DateHelpersTests.swift
  StorageHelpersTests.swift
```

## Accessibility Rules (non-negotiable)

- All fonts are semantic SwiftUI fonts — never hardcoded pt sizes
- All interactive elements enforce 44×44pt minimum tap target
- All custom components have `.accessibilityLabel`, `.accessibilityHint`, `.accessibilityValue`
- Color is never the sole conveyor of information
- `ClarityPalette.muted` is set to pass WCAG AA on the dark bg

## Commands

```bash
# Run tests (from package root)
swift test

# Build check
swift build
```

## Adding a new component

1. Create `Sources/ClarityUI/Components/YourComponent.swift`
2. Add `public` access on struct + init
3. Add `.accessibilityLabel` + `.accessibilityHint` at minimum
4. Enforce 44pt tap targets on any Button
5. Add a test if there's logic to verify
