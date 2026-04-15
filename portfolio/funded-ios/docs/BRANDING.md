# App branding — Funded iOS

---

## App identity

| Field | Value |
|-------|-------|
| **Display name** | Funded |
| **Repo path** | `portfolio/funded-ios/` |
| **Stack** | SwiftUI iOS + ClarityUI |
| **Bundle ID** | `com.chasewhittaker.Funded` |
| **Storage / app key** | SwiftData + `AppStorage` (`chase_ynab_clarity_ios_*`); token in Keychain (`com.chasewhittaker.YNABClarity`); Supabase `app_key = 'ynab'` |
| **Primary ritual** | YNAB budget companion — bills coverage, income gaps, safe spending, mortgage timeline |

---

## Visual system

### Logo

- **Label:** `YNAB` (52px, weight 600, Rose `#f43f5e`, letter-spacing 14)
- **Main:** `FUNDED` (110px, weight 800, `#f3f4f6`, letter-spacing -4)
- **Canvas:** 512x512, `#0f1117` bg, `rx=96`
- **Accent color:** Rose `#f43f5e`
- **Font:** DM Sans

### iOS App Icon

| Checklist | Done |
|-----------|------|
| `Assets.xcassets/AppIcon.appiconset/AppIcon.png` — 1024x1024, opaque | [x] |
| `AppIcon.appiconset/Contents.json` — `"filename": "AppIcon.png"` on universal iOS slot | [x] |
| `AccentColor.colorset` matches Rose accent | [ ] |

**App-specific asset paths:**

| Asset | Path |
|-------|------|
| Shipped App Store / SpringBoard icon | `Funded/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |

---

## Palette (shared with web)

| Token | Hex | Use |
|-------|-----|-----|
| bg | `#0f1117` | Background |
| surface | `#161b27` | Cards |
| border | `#1f2937` | Dividers |
| text | `#f3f4f6` | Primary text |
| muted | `#6b7280` | Secondary text |
| accent (Rose) | `#f43f5e` | Branding, accent elements |
| safe | `#3db87a` | Positive states |
| caution | `#e8bb32` | Warning states |
| danger | `#e05050` | Error states |
| mortgage | `#c66cf0` | Mortgage-specific |

---

## Voice & naming

| Rule | Value |
|------|-------|
| User-visible product name | Funded |
| Tagline | YNAB budget companion |
| Words to avoid in UI | "Clarity" (reserved for Clarity suite apps) |

---

## Related monorepo docs

| Doc | Use when |
|-----|----------|
| [`docs/templates/PORTFOLIO_APP_LOGO.md`](../../docs/templates/PORTFOLIO_APP_LOGO.md) | Logo SVG template + color palette |
| [`docs/templates/PORTFOLIO_APP_BRANDING.md`](../../docs/templates/PORTFOLIO_APP_BRANDING.md) | Branding template reference |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-14 | Initial BRANDING.md — rename from Conto to Funded; Rose #f43f5e accent |
