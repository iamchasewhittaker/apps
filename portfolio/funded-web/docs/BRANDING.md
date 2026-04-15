# App branding — Funded Web

---

## App identity

| Field | Value |
|-------|-------|
| **Display name** | Funded |
| **Repo path** | `portfolio/funded-web/` |
| **Stack** | React CRA · localStorage · Supabase sync · inline styles |
| **Storage / app key** | `chase_hub_ynab_v1` (localStorage); `chase_hub_ynab_token` (YNAB token); Supabase `app_key = 'ynab'` |
| **Primary ritual** | YNAB budget companion — bills coverage, income gaps, safe spending, mortgage timeline |

---

## Visual system

### Logo

- **Label:** `YNAB` (52px, weight 600, Rose `#f43f5e`, letter-spacing 14)
- **Main:** `FUNDED` (110px, weight 800, `#f3f4f6`, letter-spacing -4)
- **Canvas:** 512x512, `#0f1117` bg, `rx=96`
- **Accent color:** Rose `#f43f5e`
- **Font:** DM Sans

### Web (React CRA, inline styles, Vercel PWA)

| Checklist | Done |
|-----------|------|
| `public/logo.svg` — 512x512 logo SVG | [x] |
| `public/favicon.svg` — 64x64 favicon | [x] |
| `public/logo512.png`, `logo192.png`, `apple-touch-icon.png` — generated PNGs | [x] |
| `manifest.json` + `index.html` meta aligned with this file | [x] |

---

## Palette (shared with iOS)

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
