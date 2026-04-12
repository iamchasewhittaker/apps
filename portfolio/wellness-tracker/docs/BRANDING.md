# Wellness Tracker — branding

## App mark (2026)

Unified logo for **web (PWA)** and **native iOS**:

- **Concept:** Large sunrise / sun disk on the app canvas background (`#0d0d0f`), with a cream **W** integrated as negative space in the sun, and a sage horizon line (`#3d9970`) — aligned with `theme.js` / `WellnessTheme` colors.
- **Master raster (1024×1024):** `public/logo-1024.png` in the web app (same file used as the iOS `AppIcon.appiconset/AppIcon.png` source of truth for the repo).

## Where assets live

| Surface | Path |
|--------|------|
| Web PWA icons | `public/logo192.png`, `public/logo512.png`, `public/apple-touch-icon.png`, `public/favicon-32.png` |
| Web manifest | `public/manifest.json` |
| iOS App Store / home screen | `wellness-tracker-ios/WellnessTracker/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |

## Regenerating or editing

Design iterations may live under the Cursor workspace `assets/` folder during exploration; when a new canonical mark is chosen, export **1024×1024** and replace the paths above, then re-run `sips` (or your tool) to refresh `logo192` / `logo512` / `apple-touch-icon` / `favicon-32` from the new master.
