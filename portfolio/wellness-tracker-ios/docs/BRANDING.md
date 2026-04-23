# Branding — Wellness Tracker iOS

## App identity

| Field | Value |
|-------|-------|
| Display name | Wellness Tracker |
| Bundle ID | `com.chasewhittaker.WellnessTracker` |
| Repo path | `portfolio/wellness-tracker-ios/` |
| Stack | SwiftUI + `@Observable` + UserDefaults + optional Supabase |
| Storage / app key | `chase_wellness_ios_v1` / `'wellness'` |
| Primary ritual | Quick capture + check-in on iPhone |

## Palette (Clarity iOS — align to BASE tokens)

| Role | Hex | SwiftUI name |
|------|-----|-------------|
| Background | `#0e1015` | `clarityBackground` |
| Surface | `#1a1d24` | `claritySurface` |
| Primary accent | `#4f92f2` | `clarityBlue` |
| Text primary | `#f3f4f6` | `clarityTextPrimary` |
| Text secondary | `#9ca3af` | `clarityTextSecondary` |

Note: iOS palette should stay in sync with web. Any drift should be corrected in `ClarityPalette.swift` against BASE tokens.

## Typography

- **Primary:** SF Pro (system default via SwiftUI) — no custom font import needed
- **Display:** SF Pro Rounded for headers where warmth is needed
- Dynamic Type: all text views use `.font(.body)` / `.font(.title)` — no fixed sizes

## Voice

Same as web companion: warm, short, health-focused, not clinical. "How are you starting today?" Push copy is encouraging — never nagging.

Identity voice rules apply: no em-dashes, no hype words, no rule-of-threes.

## AppIcon — W+sunrise

- **Concept:** The letter "W" in Clarity white with a sunrise gradient behind it — sky goes from deep `#0e1015` at top to warm horizon at the W's midline.
- **Asset path:** `WellnessTracker/Assets.xcassets/AppIcon.appiconset/AppIcon.png`
- **Required size:** 1024×1024px, opaque, no alpha channel
- **Clarity iOS icon system:** follow `docs/design/CLARITY_IOS_APP_ICON_SPEC.md` for geometry rules

## Changelog

| Date | Change |
|------|--------|
| 2026-04-21 | Phase 2 shell shipped — W+sunrise AppIcon updated, Clarity palette wired |
| 2026-04-22 | Retroactive BRANDING.md produced |
