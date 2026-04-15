#!/usr/bin/env python3
"""Generate AppIcon + in-app Logo PNGs for Job Search HQ iOS (Clarity shell + JSHQ accents)."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
APP_ICON = ROOT / "JobSearchHQ/Assets.xcassets/AppIcon.appiconset/AppIcon.png"
LOGO_DIR = ROOT / "JobSearchHQ/Assets.xcassets/Logo.imageset"
LOGO_PNG = LOGO_DIR / "Logo.png"

BG = (0x0B, 0x0F, 0x1A)
BAND = (0x10, 0x16, 0x24)
WHITE = (0xFF, 0xFF, 0xFF)
BLUE = (0x3B, 0x82, 0xF6)


def draw_app_icon(size: int = 1024) -> Image.Image:
    img = Image.new("RGB", (size, size), BG)
    d = ImageDraw.Draw(img)
    y0, y1 = int(size * 0.32), int(size * 0.68)
    d.rectangle([0, y0, size, y1], fill=BAND)

    # Three pipeline columns (rounded tops)
    n, gap, bw = 3, int(size * 0.06), int(size * 0.11)
    total = n * bw + (n - 1) * gap
    x_start = (size - total) // 2
    base_y = int(size * 0.62)
    bar_h = int(size * 0.28)
    radius = int(size * 0.025)
    for i in range(n):
        x0 = x_start + i * (bw + gap)
        x1 = x0 + bw
        y_top = base_y - bar_h
        d.rounded_rectangle([x0, y_top, x1, base_y], radius=radius, fill=WHITE)

    # Suite-style blue badge + check (bottom-trailing)
    cx, cy = int(size * 0.78), int(size * 0.78)
    r = int(size * 0.09)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=BLUE)
    # Simple check (two strokes)
    t = max(int(size * 0.022), 8)
    d.line(
        [(cx - int(r * 0.42), cy), (cx - int(r * 0.08), cy + int(r * 0.38))],
        fill=WHITE,
        width=t,
    )
    d.line(
        [(cx - int(r * 0.08), cy + int(r * 0.38)), (cx + int(r * 0.48), cy - int(r * 0.42))],
        fill=WHITE,
        width=t,
    )
    return img


def draw_logo(size: int = 256) -> Image.Image:
    img = Image.new("RGB", (size, size), BLUE)
    d = ImageDraw.Draw(img)
    margin = int(size * 0.08)
    d.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=int(size * 0.18),
        fill=(0x0F, 0x11, 0x17),
    )
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", int(size * 0.28))
    except OSError:
        font = ImageFont.load_default()
    text = "HQ"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (size - tw) // 2
    ty = (size - th) // 2 - int(size * 0.02)
    d.text((tx, ty), text, fill=WHITE, font=font)
    return img


def main() -> None:
    APP_ICON.parent.mkdir(parents=True, exist_ok=True)
    draw_app_icon(1024).save(APP_ICON, "PNG", optimize=True)

    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    draw_logo(256).save(LOGO_PNG, "PNG", optimize=True)
    (LOGO_DIR / "Contents.json").write_text(
        json.dumps(
            {
                "images": [{"filename": "Logo.png", "idiom": "universal", "scale": "1x"}],
                "info": {"author": "xcode", "version": 1},
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print("Wrote", APP_ICON)
    print("Wrote", LOGO_PNG)


if __name__ == "__main__":
    main()
