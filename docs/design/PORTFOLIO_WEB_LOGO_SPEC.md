# Portfolio Web App Logo Spec

> Pattern for all React/web portfolio apps. Follow this to keep the suite visually consistent.

---

## Design Pattern

**Structure:** Two-line typographic mark on a dark rounded square.

```
┌─────────────────┐
│                 │
│   LABEL         │  ← small, colored, spaced caps (optional)
│   ABBREV        │  ← large, bold, white — 2–5 chars
│   ─────         │  ← thin accent bar (same color as label)
│                 │
└─────────────────┘
```

**Rules:**
- Background: `#0f1117` flat (no gradient)
- Rounded corners: `rx="96"` on 512×512 viewBox
- Abbreviation: system-ui / DM Sans, weight 800, `#f3f4f6`
- Label (optional): same font, weight 600, app accent color, `letter-spacing: 12–14`
- Accent bar: 160×5px, `rx="2.5"`, same accent color as label, centered below abbrev
- No drop shadows, no gradients, no extra decorative elements

---

## Apps

| App | Abbrev | Label | Accent Color | Status |
|-----|--------|-------|-------------|--------|
| Job Search HQ | HQ | JOB | `#3b82f6` (blue) | ✅ Done |
| App Forge | FORGE | APP | `#8b5cf6` (purple) | ✅ Done |
| Knowledge Base | BASE | KNOW | `#10b981` (green) | ✅ Done |
| Wellness Tracker | — | — | — | ⏭ Skip — has custom branded logo |

---

## SVG Template

Copy and fill `{{ABBREV}}`, `{{LABEL}}`, `{{COLOR}}`, `{{FONT_SIZE}}`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0f1117"/>
  <text x="256" y="{{ABBREV_Y}}" text-anchor="middle" dominant-baseline="central"
        font-family="'DM Sans', system-ui, sans-serif" font-weight="800" font-size="{{FONT_SIZE}}"
        fill="#f3f4f6" letter-spacing="-6">{{ABBREV}}</text>
  <text x="256" y="{{LABEL_Y}}" text-anchor="middle"
        font-family="'DM Sans', system-ui, sans-serif" font-weight="600" font-size="52"
        fill="{{COLOR}}" letter-spacing="14">{{LABEL}}</text>
</svg>
```

**Font sizes by abbreviation length:**
- 2 chars (HQ): 200px — abbrev_y≈310, label_y≈178
- 4 chars (BASE, KNOW): 140px — abbrev_y≈310, label_y≈195
- 5 chars (FORGE): 110px — abbrev_y≈310, label_y≈195

---

## Favicon SVG Template (64×64)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0f1117"/>
  <text x="32" y="34" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, sans-serif" font-weight="800" font-size="{{FAVICON_SIZE}}"
        fill="#f3f4f6" letter-spacing="-1">{{ABBREV}}</text>
  <rect x="20" y="44" width="24" height="2" rx="1" fill="{{COLOR}}"/>
</svg>
```

**Favicon font sizes:** 2 chars → 26px · 4 chars → 16px · 5 chars → 13px

---

## PNG Generation (macOS)

```bash
cd portfolio/<app>/public

# Full logo (512px)
qlmanage -t -s 512 -o /tmp logo.svg 2>/dev/null
cp /tmp/logo.svg.png logo512.png

# 192px for PWA
sips -z 192 192 --out logo192.png logo512.png
```

---

## manifest.json fields to update

```json
{
  "short_name": "<App Name>",
  "name": "<App Full Name>",
  "theme_color": "#0f1117",
  "background_color": "#0f1117"
}
```

## index.html to update

```html
<link rel="icon" href="%PUBLIC_URL%/favicon.svg" type="image/svg+xml" />
<link rel="alternate icon" href="%PUBLIC_URL%/favicon.ico" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
```
