# Wellness Tracker — branding

## Palette source (Spend Clarity / Clarity family)

**Spend Clarity** (`portfolio/spend-clarity/`) is a **Python CLI** — there is **no logo raster** checked into that repo.

For a **consistent visual family** with the YNAB + receipts toolchain, the Wellness mark uses the same **RGB tokens as YNAB Clarity (iOS)** — see [`portfolio/ynab-clarity-ios/YNABClarity/Theme/ClarityTheme.swift`](../../ynab-clarity-ios/YNABClarity/Theme/ClarityTheme.swift).

| Token (Clarity) | Approx hex | Use on Wellness mark |
|-----------------|-------------|----------------------|
| `bg` | `#0e1015` | Logo canvas / PWA `theme_color` + `background_color` |
| `text` | `#eaedf0` | Letter **W** (negative space / cutout) |
| `accent` | `#4f92f2` | Horizon arc (interactive blue) |
| `caution` | `#e8bb32` | Sun gradient (amber → gold) |
| `safe` | `#3cb77c` | Optional small accent only |

Hex values are **approximations** from `SwiftUI.Color` components; source of truth remains `ClarityTheme.swift`.

## Portfolio text logo (2026)

Standard Clarity-family typographic logo per `docs/templates/PORTFOLIO_APP_LOGO.md`:

- **Label:** `WELLNESS` (accent `#4f92f2`, 52px, weight 600)
- **Main:** `TRACK` (#f3f4f6, 130px, weight 800)
- **Canvas:** 512×512, `#0f1117` background
- **SVG:** `public/logo.svg` · **Favicon:** `public/favicon.svg`
- **PNGs:** `logo512.png`, `logo192.png`, `apple-touch-icon.png` (generated from SVG)

## iOS app mark (2026)

Sunrise mark for **native iOS** (separate from the text logo):

- **Concept:** Large sunrise / sun disk on **Clarity `bg`**, cream **W** integrated into the sun, **accent** blue horizon — aligned to the table above.
- **Master raster (1024×1024):** `public/logo-1024.png` (same bytes as iOS `AppIcon.png` in-repo).

## Where assets live

| Surface | Path |
|--------|------|
| Web text logo (SVG) | `public/logo.svg`, `public/favicon.svg` |
| Web PWA icons (PNG) | `public/logo192.png`, `public/logo512.png`, `public/apple-touch-icon.png` |
| Web manifest | `public/manifest.json` |
| iOS App Store / home screen | `wellness-tracker-ios/WellnessTracker/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |

## Regenerating or editing

Design iterations may live under the Cursor workspace `assets/` folder during exploration; when a new canonical mark is chosen, export **1024×1024** and replace the paths above, then re-run `sips` (or your tool) to refresh `logo192` / `logo512` / `apple-touch-icon` / `favicon-32` from the new master.

**Xcode requirement:** `AppIcon.png` must be **exactly 1024×1024** (square). Non-square exports cause *“AppIcon … did not have any applicable content”*. If the source is widescreen, scale with longest edge 1024 then **pad** to 1024×1024 (e.g. `sips -Z 1024` then `sips -p 1024 1024`). `Contents.json` should include both **`universal`** and **`ios-marketing`** 1024×1024 entries (same file is fine).
