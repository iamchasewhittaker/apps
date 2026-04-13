# Clarity iOS — shared app icon system

> **New app?** Start from the portfolio template **[`docs/templates/PORTFOLIO_APP_BRANDING.md`](../templates/PORTFOLIO_APP_BRANDING.md)** — copy to `portfolio/<app>/docs/BRANDING.md`, fill placeholders, link from that app’s `CLAUDE.md`. Use **this** document only for **icon geometry / Xcode / export** details so you do not repeat prose in every project.  
> **Five Clarity apps shipped** Check-in · Triage · Time · Budget · Growth with suite-consistent tiles; see **[`docs/design/README.md`](README.md)** for glyph summary. **Iterate one icon:** **[`SESSION_START_CLARITY_IOS_LOGOS.md`](../templates/SESSION_START_CLARITY_IOS_LOGOS.md)**.

**Canonical reference implementation:** [`portfolio/clarity-checkin-ios`](../../portfolio/clarity-checkin-ios) — `ClarityCheckin/Assets.xcassets/AppIcon.appiconset/` + `docs/design/`.

Use this document when creating **matching icons** for **Clarity Triage**, **Clarity Time**, **Clarity Budget**, **Clarity Growth**, or future Clarity iOS apps so the suite reads as one family on the Home Screen.

---

## 1. Canvas & Xcode

| Rule | Spec |
|------|------|
| Asset catalog | `Assets.xcassets/AppIcon.appiconset/` |
| iOS slot | Single **1024×1024** universal image (`idiom: universal`, `platform: ios`) |
| `Contents.json` | Set `"filename": "AppIcon.png"` on the 1024 slot |
| Alpha | **Opaque** PNG (no transparency) for App Store–safe icons |
| Safe area | Keep critical detail inside the central **~884 pt** diameter circle (iOS masks to a rounded square / platform-specific shapes) |

**Xcode:** Targets → *AppIcon* should point at `AppIcon.appiconset`. Build with the usual `xcodebuild` destination; no extra PBX entries are needed for PNGs inside the asset catalog folder.

---

## 2. Visual shell (same on every app)

These elements are **shared**; only the **center glyph** changes per app.

| Element | Spec |
|---------|------|
| **Field** | Full **1024×1024** square. Outer margin may be a very light neutral (**~#E6E7EB**) if the hero is a “device tile” mockup; otherwise fill the square with the tile background color. |
| **Tile background** | Deep navy / off-black **#060A12** – **#0B0F1A** (stay close to `ClarityPalette.bg` / dark Clarity UI) |
| **Depth band** | One subtle **horizontal highlight band** across the middle third (slightly lighter than the tile base) — low contrast, no harsh gradients |
| **Glyph color** | **White** `#FFFFFF` (or near-white), **single stroke / fill weight** across horizon, symbol, and accents |
| **Stroke weight** | Visually **~4–6% of tile width** at 1024 export (thicker than hairlines; survives SpringBoard scale) |
| **Optional badge** | Bottom-trailing: **circle ~12–14% of tile width**, fill **Clarity accent blue** (see §4), **white check** (simple two-segment path), slightly overlapping the tile edge — “verified / done” family cue from the reference suite |

**Do not** bake iOS’s corner mask into the bitmap as a hard clip that fights the system mask; a **soft rounded tile** inside the square is OK for marketing, but prefer a **full-bleed** square for the final `AppIcon.png` if the double-rounding looks wrong on device.

---

## 3. Center glyph (unique per app)

| Rule | Spec |
|------|------|
| **Job of the glyph** | One **abstract** idea for that app’s *primary* ritual (e.g. check-in + morning + meds for Check-in) |
| **Complexity** | **1–3** simple shapes (arc + line + one accent). No text inside the glyph |
| **Accent scale** | Secondary motifs (e.g. **pill capsule**) ≈ **55–65%** of the width you’d first guess — should not compete with the primary arc |
| **Metaphor** | Prefer **geometry** over literal illustration (no photos, no gradients unless extremely subtle) |

**Examples (other apps):** Triage → fork / priority mark; Time → arc or tick marks; Budget → column or balance stroke; Growth → upward step or sprout abstraction — always using the **same** shell in §2.

---

## 4. Color tokens

| Token | Role | Notes |
|-------|------|------|
| Tile | `#060A12` – `#0B0F1A` | Align with app dark surfaces |
| Canvas margin (optional) | `#E6E7EB` | Presentation / padded square exports |
| Glyph | `#FFFFFF` | Primary mark |
| Badge fill | **AccentColor** in Xcode | Clarity Check-in uses `AccentColor.colorset` (display P3 blue). For other apps, keep **one** badge hue per app or **identical** blue across the suite — pick once and document in that app’s `CLAUDE.md` |

**Padding export:** macOS `sips` pads with **black** by default. When squaring a wide mockup, use e.g. `sips --padColor E6E7EB -p <W> <H> source.png` before `sips -z 1024 1024`.

---

## 5. Production checklist

1. Export **1024×1024** PNG, **sRGB** or display P3 consistent with the rest of the asset pipeline.
2. Name it `AppIcon.png` in `AppIcon.appiconset/`.
3. Confirm `Contents.json` references `AppIcon.png`.
4. **Simulator:** delete app, clean build, reinstall — SpringBoard caches icons aggressively.
5. **App Store Connect:** single 1024 asset is enough for automated slots when using the one-size catalog.

---

## 6. File layout (per app)

```
<AppName>/
  Assets.xcassets/
    AppIcon.appiconset/
      Contents.json
      AppIcon.png          ← 1024×1024 master
    AccentColor.colorset/
      Contents.json
  docs/design/             ← optional: wide mockups + README
```

---

## 7. Clarity Check-in assets

| Path | Description |
|------|-------------|
| `ClarityCheckin/Assets.xcassets/AppIcon.appiconset/AppIcon.png` | Shipped 1024 master (gray-padded square from wide mockup). |
| `docs/design/app-icon-mockup-wide.png` | Source-style wide layout for slides / iteration. |

Related app docs: `CLAUDE.md`, `HANDOFF.md`, `CHANGELOG.md`, `ROADMAP.md`.
