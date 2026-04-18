# Fairway iOS — Branding

## App Identity

| Field | Value |
|-------|-------|
| Display name | Fairway |
| Tagline | Masters-level lawn management |
| Bundle ID | `com.chasewhittaker.Fairway` |
| Storage key | `chase_fairway_ios_v1` |
| Platform | iOS 17+, iPhone only |

## Visual System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `backgroundPrimary` | `#0B150B` | App background — deep forest |
| `backgroundSurface` | `#162316` | Cards, sheets |
| `backgroundElevated` | `#1F2F1F` | Nav bars, popovers |
| `accentGreen` | `#006747` | Augusta green — primary brand |
| `accentGold` | `#C9A84C` | Masters gold — highlights, icons, active tabs |
| `statusHealthy` | `#22C55E` | Zone healthy indicator |
| `statusAttention` | `#F59E0B` | Zone needs attention |
| `statusAction` | `#EF4444` | Zone action needed / confirmed problem |
| `badgePreSeason` | `#F59E0B` | PRE-SEASON badge (amber) |
| `badgeConfirmed` | `#EF4444` | CONFIRMED problem badge (red) |
| `textPrimary` | `#F0F7F0` | Body text — slight green tint white |
| `textSecondary` | `#8FA98F` | Labels, metadata — muted sage |
| `stockGood` | `#22C55E` | Inventory: plenty in stock |
| `stockLow` | `#F59E0B` | Inventory: less than 1 application |
| `stockEmpty` | `#EF4444` | Inventory: empty / unknown |

### Typography

- System font (San Francisco) throughout — no custom fonts
- Headers: `.title2` semibold
- Body: `.body` regular
- Labels/metadata: `.caption` in `textSecondary`
- Badges: `.caption2` bold in white on colored background

### Name Candidates (for reference)

| Name | Notes |
|------|-------|
| Greenkeeper | Masters grounds crew reference |
| **Fairway** ✓ | Chosen — aspirational, clean |
| Verdant | Latin for lush/green — more abstract |
| Stripe | Lawn striping — minimal |

## App Icon Spec

- **Size:** 1024×1024 opaque PNG
- **Background:** Augusta green `#006747`
- **Glyph:** White stylized sprinkler arc — top semicircle with 3 spray lines radiating outward
- **No text** (name appears in OS)
- Location: `Fairway/Assets.xcassets/AppIcon.appiconset/AppIcon.png`

## Badge System

```
PRE-SEASON    → amber (#F59E0B) pill badge, text "PRE-SEASON"
CONFIRMED     → red (#EF4444) pill badge, text "CONFIRMED"
```

Used on: heads (isConfirmed=false), problem areas (isPreSeason=true / isConfirmed=true)

## Asset Paths

- App icon: `Fairway/Assets.xcassets/AppIcon.appiconset/` (placeholder until generated)
- Accent color: `Fairway/Assets.xcassets/AccentColor.colorset/` (set to `#C9A84C`)

## Changelog

| Date | Change |
|------|--------|
| 2026-04-18 | Initial branding spec created |
