# Portfolio Web Logo — Rollout Handoff

> Status as of 2026-04-13. Update the table when each app is done.

---

## Status

| App | logo.svg | favicon.svg | logo512.png | logo192.png | manifest | index.html | Done |
|-----|----------|-------------|-------------|-------------|----------|------------|------|
| Job Search HQ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| App Forge | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Knowledge Base | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Wellness Tracker | ⏭ skip | ⏭ skip | ⏭ skip | ⏭ skip | — | — | ⏭ Has custom branded logo |

---

## Design Reference

See [`PORTFOLIO_WEB_LOGO_SPEC.md`](PORTFOLIO_WEB_LOGO_SPEC.md) for the full SVG template, font sizes, and PNG generation commands.

**Quick summary:**
- Background: `#0f1117` flat, `rx="96"` on 512×512
- Abbreviation: bold 800, `#f3f4f6`, large (110–200px depending on char count)
- Label: weight 600, app accent color, `letter-spacing: 14`, 52px
- No gradients, no shadows

---

## Per-App Details

### Job Search HQ — ✅ Done
- Path: `portfolio/job-search-hq/public/`
- Abbrev: **HQ** (2 chars, 200px) · Label: **JOB** · Color: `#3b82f6` (blue)

### App Forge — ✅ Done
- Path: `portfolio/app-forge/public/`
- Abbrev: **FORGE** (5 chars, 110px) · Label: **APP** · Color: `#8b5cf6` (purple)

### Knowledge Base — ✅ Done
- Path: `portfolio/knowledge-base/public/`
- Abbrev: **BASE** (4 chars, 140px) · Label: **KNOW** · Color: `#10b981` (green)

---

## Steps for a New App

1. Determine abbrev (2–5 chars), label (3–5 caps), accent color
2. Copy SVG template from `PORTFOLIO_WEB_LOGO_SPEC.md`, fill values
3. Save to `portfolio/<app>/public/logo.svg`
4. Create `favicon.svg` (64×64 template from spec) — abbrev + accent bar only
5. Generate PNGs:
   ```bash
   cd portfolio/<app>/public
   qlmanage -t -s 512 -o /tmp logo.svg 2>/dev/null
   cp /tmp/logo.svg.png logo512.png
   sips -z 192 192 --out logo192.png logo512.png
   ```
6. Update `manifest.json`:
   - `short_name` / `name` → app name
   - `theme_color` / `background_color` → `#0f1117`
7. Update `public/index.html` — add in `<head>`:
   ```html
   <link rel="icon" href="%PUBLIC_URL%/favicon.svg" type="image/svg+xml" />
   <link rel="alternate icon" href="%PUBLIC_URL%/favicon.ico" />
   <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
   <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
   ```
8. Update the status table above
