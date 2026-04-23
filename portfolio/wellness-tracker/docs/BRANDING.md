# Branding — Wellness Tracker

## App identity

| Field | Value |
|-------|-------|
| Display name | Wellness Tracker |
| Repo path | `portfolio/wellness-tracker/` |
| Stack | React CRA + inline styles, PWA (local; Vercel removed 2026-04-20) |
| Storage / app key | `chase_wellness_v1` / `'wellness'` |
| Primary ritual | Daily morning/evening check-in loop |

## Palette

Wellness Tracker shares the **Clarity family** palette. Source of truth for the iOS side is [`portfolio/clarity-ui/Sources/ClarityUI/Theme/ClarityTheme.swift`](../../clarity-ui/Sources/ClarityUI/Theme/ClarityTheme.swift); web hex values are kept in lockstep here.

| Role | Hex | Clarity token | Use on web |
|------|-----|---------------|------------|
| Background | `#0e1015` | `bg` | Logo canvas, PWA `theme_color` + `background_color` |
| Surface | `#1a1d24` | `surface` | Cards, panels |
| Primary accent | `#4f92f2` | `accent` | Interactive elements, progress, top label of logo |
| Text primary | `#f3f4f6` | `text` | Body copy, main wordmark |
| Text secondary | `#9ca3af` | `muted` | Labels, metadata |
| Caution (sun) | `#e8bb32` | `caution` | Sunrise gradient on iOS mark |
| Safe | `#3cb77c` | `safe` | Optional small accent only |

Hex values are approximations from `SwiftUI.Color` components; if they drift, `ClarityTheme.swift` wins.

## Typography

- **Primary:** DM Sans (headers, UI labels)
- **Monospace:** system monospace (data values, timestamps)
- DM Sans weight 800 for app name display; weight 600 for section headers

## Voice

Wellness Tracker talks like a patient daily companion — warm, short, health-focused, not clinical. It asks "how are you starting today?" and means it.

Identity voice rules apply: no em-dashes, no hype words, no rule-of-threes.

## Logo — web text mark

Portfolio standard text logo per [`docs/templates/PORTFOLIO_APP_LOGO.md`](../../../docs/templates/PORTFOLIO_APP_LOGO.md):

- Canvas: 512×512, `#0f1117` background, `rx="96"`
- Label (top): `WELLNESS` — `#4f92f2`, 52px, weight 600, letter-spacing 14
- Main (bottom): `TRACKER` — `#f3f4f6`, 95px, weight 800, letter-spacing -4
- Font: DM Sans

**PWA assets in `public/`:** `logo.svg`, `favicon.svg`, `logo-wordmark.svg`, `logo192.png`, `logo512.png`, `apple-touch-icon.png`

## iOS app mark — W + sunrise

Sunrise mark for **native iOS** (separate from the text logo, used wherever the text wordmark is too wide):

- **Concept:** large sunrise / sun disk on Clarity `bg`, cream **W** integrated into the sun, accent blue horizon — aligned to the palette table above.
- **Master raster (1024×1024):** `public/logo-1024.png` (same bytes as iOS `AppIcon.png` in-repo).
- Companion mark, not a replacement — used for the iOS icon, the small favicon, and any context where the text logo can't fit.

## Where assets live

| Surface | Path |
|---------|------|
| Web text logo (SVG) | `public/logo.svg`, `public/favicon.svg` |
| Web PWA icons (PNG) | `public/logo192.png`, `public/logo512.png`, `public/apple-touch-icon.png` |
| Web manifest | `public/manifest.json` |
| iOS App Store / home screen | `wellness-tracker-ios/WellnessTracker/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |

## Regenerating or editing

When a new canonical mark is chosen, export **1024×1024** and replace the paths above, then refresh the smaller PNGs from the new master:

```bash
sips -Z 192  public/logo512.png --out public/logo192.png
sips -Z 512  public/logo-1024.png --out public/logo512.png
sips -Z 180  public/logo-1024.png --out public/apple-touch-icon.png
```

**Xcode requirement:** `AppIcon.png` must be **exactly 1024×1024** (square). Non-square exports cause *"AppIcon … did not have any applicable content"*. If the source is widescreen, scale with longest edge 1024 then **pad** to 1024×1024 (e.g. `sips -Z 1024` then `sips -p 1024 1024`). `Contents.json` should include both **`universal`** and **`ios-marketing`** 1024×1024 entries (same file is fine).

## Changelog

| Date | Change |
|------|--------|
| 2026-04-14 | Portfolio text logo created (WELLNESS/TRACKER, `#4f92f2`), iOS AppIcon updated, build verified (149.96 KB gzip) |
| 2026-04-21 | Idea Kitchen retroactive BRANDING produced |
| 2026-04-22 | Merged retroactive doc with existing technical content (Clarity tokens, sips commands, Xcode 1024 requirement); confirmed `TRACKER` wordmark matches `public/logo.svg` |
