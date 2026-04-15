# Job Search HQ — iOS branding

> Web reference: [`../job-search-hq/docs/BRANDING.md`](../job-search-hq/docs/BRANDING.md)  
> Suite icon rules: [`../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)

## Hybrid system (v1)

| Layer | Source |
|--------|--------|
| Layout, Dynamic Type, tap targets | ClarityUI (`ClarityTypography`, `ClarityMetrics`) |
| Background / surfaces / accents | `JSHQTheme` — hex aligned with web table in web `BRANDING.md` |
| App icon | Clarity-style tile + pipeline glyph + blue badge — regenerate with [`tools/generate_brand_assets.py`](../tools/generate_brand_assets.py) (requires Pillow) |
| In-app mark | `Logo` image set — same script writes `Logo.imageset/Logo.png`; header in `ContentView` |

**Home Screen refresh:** If the launcher tile looks stale after regenerating PNGs, delete the app from the device once and reinstall so Springboard picks up the new asset catalog.

## Token table (iOS)

| Token | Hex | Use |
|-------|-----|-----|
| Background | `#0f1117` | Screens |
| Surface | `#1a1d27` | Cards, lists |
| Border | `#2a2d3a` | Outlines |
| Text primary | `#e5e7eb` | Titles, body |
| Text muted | `#9ca3af` | Secondary |
| Accent blue | `#3b82f6` | Primary actions, pipeline |
| Accent purple | `#8b5cf6` | Networking |
| Accent green | `#10b981` | Positive |
| Accent amber | `#f59e0b` | Warnings, tips |
| Accent red | `#ef4444` | Destructive |
