# Changelog — ClarityUI

## [Unreleased]

- **Theme alignment (BASE tokens):** `ClarityPalette` core tokens updated to portfolio BASE token set — `bg` `#0f1117`, `surface` `#161b27`, `border` `#1f2937`, `text` `#f3f4f6`, `muted` `#6b7280`; all semantic/accent colors unchanged; change propagates automatically to all 5 Clarity consumer apps

## v0.1 — 2026-04-12 — Initial package
- ClarityPalette: full color token set, progressColor, clampedFraction, highContrast muted
- ClarityTypography: semantic Dynamic Type fonts (display, title, headline, body, support, caption, mono)
- ClarityMetrics: spacing constants, minTapTarget (44pt), ScaledMetric guidance
- ClarityCard: `.clarityCard()` ViewModifier (port from YNAB Clarity ClarityTheme.swift)
- ClarityChoiceButton: selectable chip with 44pt tap target + VoiceOver traits
- ClarityRating: 1-10 picker with adjustable VoiceOver action
- ClarityMultiChip + ClarityChipGroup: tag selection with FlowLayout
- ClarityTriToggle: 3-way Yes/Mild/No toggle
- ClaritySectionLabel: uppercase section heading with isHeader trait
- ClarityEmptyState: standardized empty list card
- ClarityProgressBar: color-coded progress with VoiceOver value
- QuoteBanner + ClarityQuote + todaysQuote: daily rotating quote card
- DateHelpers: todayString, isToday, isStale, isMorning, display formatters, JS timestamp
- StorageHelpers: generic Codable UserDefaults load/save/remove
- Tests: ClarityPaletteTests, DateHelpersTests, StorageHelpersTests
