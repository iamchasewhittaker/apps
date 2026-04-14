# Portfolio App Logo Template

Every app in this portfolio uses the same text-based logo format. When creating a new app, generate logos from the templates below.

## Format

- **Canvas:** 512x512 SVG, `rx="96"` rounded corners
- **Background:** `#0f1117`
- **Label (top):** context word, 52px, weight 600, accent color, letter-spacing 14
- **Main (bottom):** key word, weight 800, `#f3f4f6`, letter-spacing -4 to -6
- **Font:** `'DM Sans', system-ui, sans-serif`

## Font Sizing Guide

| Characters | Main font-size | Letter-spacing | Label y | Example |
|-----------|---------------|---------------|---------|---------|
| 2         | 200px         | -6            | 178     | HQ      |
| 3         | 200px         | -6            | 178     | HUB     |
| 4         | 160px         | -6            | 185     | TASK    |
| 5         | 130px         | -4            | 195     | CHECK, FORGE |
| 6         | 110px         | -4            | 195     | TRIAGE, BUDGET, GROWTH |
| 7         | 95px          | -4            | 200     | COMMAND, CLARITY |

## Color Palette (assigned)

| App | Accent Color | Hex |
|-----|-------------|-----|
| Job Search HQ | Blue | `#3b82f6` |
| Knowledge Base | Emerald | `#10b981` |
| App Forge | Purple | `#8b5cf6` |
| Clarity Command | Gold | `#c8a84b` |
| Clarity Hub | Indigo | `#6366f1` |
| RollerTask Tycoon | Amber | `#f59e0b` |
| YNAB Clarity | Green | `#22c55e` |
| Clarity Check-in | Sky | `#38bdf8` |
| Clarity Triage | Orange | `#fb923c` |
| Clarity Time | Violet | `#a78bfa` |
| Clarity Budget | Teal | `#34d399` |
| Clarity Growth | Green | `#4ade80` |

When adding a new app, pick an accent color that's visually distinct from existing ones.

## Logo SVG Template

Replace `{{LABEL}}`, `{{MAIN}}`, `{{ACCENT}}`, `{{MAIN_SIZE}}`, and `{{LABEL_Y}}` with values from the tables above.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0f1117"/>
  <text x="256" y="{{LABEL_Y}}" text-anchor="middle"
        font-family="'DM Sans', system-ui, sans-serif" font-weight="600" font-size="52"
        fill="{{ACCENT}}" letter-spacing="14">{{LABEL}}</text>
  <text x="256" y="310" text-anchor="middle" dominant-baseline="central"
        font-family="'DM Sans', system-ui, sans-serif" font-weight="800" font-size="{{MAIN_SIZE}}"
        fill="#f3f4f6" letter-spacing="-4">{{MAIN}}</text>
</svg>
```

## Favicon SVG Template

Favicon uses only the main text with an accent bar below. Adjust font-size based on character count (roughly half the logo main size, capped at 26px).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0f1117"/>
  <text x="32" y="32" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, sans-serif" font-weight="800" font-size="{{FAV_SIZE}}"
        fill="#f3f4f6" letter-spacing="-1">{{MAIN}}</text>
  <rect x="{{BAR_X}}" y="46" width="{{BAR_W}}" height="2" rx="1" fill="{{ACCENT}}"/>
</svg>
```

| Characters | Favicon font-size | Bar x | Bar width |
|-----------|------------------|-------|-----------|
| 2-3       | 22-26px          | 16-20 | 24-32     |
| 4         | 18px             | 12    | 40        |
| 5         | 15px             | 12    | 40        |
| 6         | 13px             | 10    | 44        |
| 7         | 12px             | 10    | 44        |

## Generating PNG Assets

On macOS, use `qlmanage` and `sips`:

```bash
# Generate 512px PNG from logo SVG
qlmanage -t -s 512 -o . logo.svg && mv logo.svg.png logo512.png

# Resize to 192px
cp logo512.png logo192.png && sips -z 192 192 logo192.png

# Apple touch icon (180px)
cp logo512.png apple-touch-icon.png && sips -z 180 180 apple-touch-icon.png

# iOS App Icon (1024px)
qlmanage -t -s 1024 -o . logo.svg && mv logo.svg.png AppIcon.png
```

## Checklist for New Apps

1. Pick label + main text (reads as the app name together)
2. Pick an accent color not already used
3. Fill in the logo SVG template → save as `public/logo.svg`
4. Fill in the favicon SVG template → save as `public/favicon.svg`
5. Generate PNGs (logo512, logo192, apple-touch-icon)
6. Add to `public/index.html`: favicon link, apple-touch-icon link, manifest link
7. Create/update `public/manifest.json` with icon references
8. For iOS: generate 1024px PNG → `Assets.xcassets/AppIcon.appiconset/AppIcon.png`
9. Update the color palette table above with the new app's accent color
