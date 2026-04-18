# App branding — Shipyard (iOS)

> **Purpose:** Single source for identity + visual rules. Link here from `CLAUDE.md` instead of restating hex codes or icon geometry in every chat.

---

## App identity

| Field | Value |
|-------|-------|
| **Display name** | Shipyard |
| **Repo path** | `portfolio/shipyard-ios/` |
| **Stack** | SwiftUI + iOS 17 + `@Observable` (no ClarityUI in Phase 1) |
| **Bundle ID** | `com.chasewhittaker.Shipyard` |
| **Storage / app key** | `chase_shipyard_ios_v1` (Phase 2+) |
| **Primary ritual** | "Glance at the fleet — which ship is under construction today?" |

---

## Visual system — Nautical

Shipyard is the **one non-Clarity-family** iOS app. It borrows the "dark suite + accent" spirit but uses a nautical palette and compass-rose mark, not the Clarity geometry.

### Palette

| Token | Swift | Hex | Use |
|-------|-------|-----|-----|
| Navy (bg) | `Palette.navy` | `#0A1E3F` | App background, icon background |
| Deep sea | `Palette.deepSea` | `#132B5A` | Cards, grouped list rows |
| Gold (accent) | `Palette.gold` | `#D4A84B` | Compass rose, AccentColor, chips |
| Sail cream | `Palette.sailCream` | `#F4EAD5` | Primary text |
| Mist | `Palette.mist` | `#9BB0C8` | Secondary text |
| Storm (warning) | `Palette.storm` | `#E56B4E` | Stalled / drydock chip |

### Icon — SY Monogram (P6 style)

Follows the same P6 pattern as ash-reader (large initials + app name below inside a rounded square).

| Property | Value |
|---|---|
| Canvas | 1024 × 1024 px |
| Corner radius | 22% ≈ 225px |
| Background | `#1e3a5f` (nautical blue) |
| Initials | `SY`, Arial Bold, 560px, `#e2e8f0` |
| Sub-label | `SHIPYARD`, Arial, 88px, `#e2e8f0` @ 75% opacity |
| Gap (SY → SHIPYARD) | 180px |

**Render:** Python Pillow script. Regenerate with:
```bash
python3 -c "
from PIL import Image, ImageDraw, ImageFont; import os
size=1024; radius=int(size*0.22)
img=Image.new('RGBA',(size,size),(0,0,0,0))
mask=Image.new('L',(size,size),0)
ImageDraw.Draw(mask).rounded_rectangle([0,0,size,size],radius=radius,fill=255)
bg=Image.new('RGBA',(size,size),'#1e3a5f')
img=Image.composite(bg,img,mask); draw=ImageDraw.Draw(img)
ifont=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',560)
sfont=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',88)
sy_bb=draw.textbbox((0,0),'SY',font=ifont); sy_w=sy_bb[2]-sy_bb[0]; sy_h=sy_bb[3]-sy_bb[1]
sh_bb=draw.textbbox((0,0),'SHIPYARD',font=sfont); sh_w=sh_bb[2]-sh_bb[0]; sh_h=sh_bb[3]-sh_bb[1]
gap=180; total_h=sy_h+gap+sh_h; top=(size-total_h)//2
draw.text(((size-sy_w)//2-sy_bb[0],top-sy_bb[1]),'SY',font=ifont,fill=(226,232,240,255))
draw.text(((size-sh_w)//2-sh_bb[0],top-sy_bb[1]+sy_h+sy_bb[1]+gap-sh_bb[1]),'SHIPYARD',font=sfont,fill=(226,232,240,191))
img.save('Shipyard/Assets.xcassets/AppIcon.appiconset/Icon-1024.png','PNG')
"
```

| Checklist | Done |
|-----------|------|
| `Assets.xcassets/AppIcon.appiconset/Icon-1024.png` — 1024×1024 opaque | ✅ |
| `AppIcon.appiconset/Contents.json` — single universal iOS slot | ✅ |
| `AccentColor.colorset` — gold (`#D4A84B`) | ✅ |

---

## Voice & naming

| Rule | Value |
|------|-------|
| User-visible product name | Shipyard |
| Lexicon | Nautical — "ships" not "projects", "under construction" not "building", "drydock" not "paused", "launched" not "shipped", "fleet" not "dashboard" |
| Words to avoid in UI | "App", "project" (user-facing copy) |

---

## Related monorepo docs

| Doc | Use when |
|-----|----------|
| [`/docs/templates/PORTFOLIO_APP_LOGO.md`](../../../docs/templates/PORTFOLIO_APP_LOGO.md) | Reviewing the shared logo format |
| [`/docs/design/README.md`](../../../docs/design/README.md) | Index of design specs |
| [`portfolio/shipyard/`](../../shipyard/) | Web source of truth — keep labels consistent |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-04-17 | Initial `BRANDING.md` + compass-rose AppIcon + nautical palette |
| 2026-04-18 | Replaced compass-rose with SY monogram (P6 style) — nautical blue bg, Arial Bold 560px, SHIPYARD sub-label 88px, 180px gap |
