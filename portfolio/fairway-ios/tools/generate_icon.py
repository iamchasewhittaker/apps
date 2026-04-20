#!/usr/bin/env python3
"""Generate Fairway iOS app icon — 1024×1024 retro-sunset circle-badge.

Source-of-truth: docs/brand/fairway_minimal.html → app-icon variant (viewBox 80×80).
All coords are scaled by 1024/80 = 12.8.

Run:
    python tools/generate_icon.py
"""

from PIL import Image, ImageDraw, ImageFilter

SIZE = 1024
SCALE = SIZE / 80  # viewBox is 80×80 in the brand HTML

# Palette (matches FairwayTheme.swift and docs/brand/fairway_minimal.html)
BG = (12, 30, 16)             # #0c1e10 — the sky rect the brand HTML uses for app icon
GOLD = (212, 175, 55)         # #d4af37
SUN_AMBER = (232, 160, 48)    # #e8a030
SUN_YELLOW = (240, 192, 80)   # #f0c050
GREEN_BRIGHT = (3, 102, 53)   # #036635
GREEN_MID = (2, 78, 40)       # #024e28
GREEN_DEEP = (1, 58, 28)      # #013a1c


def s(v: float) -> float:
    return v * SCALE


def p(x: float, y: float) -> tuple[int, int]:
    return (int(round(x * SCALE)), int(round(y * SCALE)))


def main() -> None:
    # Base canvas — solid dark green, ignores iOS corner mask (OS applies its own)
    img = Image.new("RGBA", (SIZE, SIZE), BG + (255,))

    # --- Sun glow: two soft disks with feather so they blend into the sky ---
    sun_layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    sun_draw = ImageDraw.Draw(sun_layer)
    cx, cy = p(40, 42)

    # Outer sun r=16 @ 0.35
    r1 = int(s(16))
    sun_draw.ellipse([cx - r1, cy - r1, cx + r1, cy + r1],
                     fill=SUN_AMBER + (int(255 * 0.35),))
    # Inner sun r=9 @ 0.40
    r2 = int(s(9))
    sun_draw.ellipse([cx - r2, cy - r2, cx + r2, cy + r2],
                     fill=SUN_YELLOW + (int(255 * 0.40),))

    # Soften the sun so it bleeds into horizon like the SVG renders at large sizes
    sun_layer = sun_layer.filter(ImageFilter.GaussianBlur(radius=int(s(1.2))))
    img.alpha_composite(sun_layer)

    draw = ImageDraw.Draw(img, "RGBA")

    # --- Fairway bands (quadratic Bézier → dense polygon approximation) ---
    def band(start_y: float, mid_y: float, end_y: float) -> list[tuple[int, int]]:
        """Port of SVG: M0 startY Q20 startY-8 40 midY Q60 midY+6 80 endY L80 80 L0 80 Z
        The app-icon variant uses the simpler curve family: startY → midY via
        control point (20, startY-8), then midY → endY via (60, midY+6)."""
        pts: list[tuple[int, int]] = []
        steps = 80

        # First arc: (0, startY) → (40, midY) via (20, startY-8)
        for i in range(steps + 1):
            t = i / steps
            x = (1 - t) ** 2 * 0 + 2 * (1 - t) * t * 20 + t ** 2 * 40
            y = (1 - t) ** 2 * start_y + 2 * (1 - t) * t * (start_y - 8) + t ** 2 * mid_y
            pts.append(p(x, y))

        # Second arc: (40, midY) → (80, endY) via (60, midY+6)
        for i in range(1, steps + 1):
            t = i / steps
            x = (1 - t) ** 2 * 40 + 2 * (1 - t) * t * 60 + t ** 2 * 80
            y = (1 - t) ** 2 * mid_y + 2 * (1 - t) * t * (mid_y + 6) + t ** 2 * end_y
            pts.append(p(x, y))

        # Close the rectangle down to the bottom edge
        pts.append(p(80, 80))
        pts.append(p(0, 80))
        return pts

    # From HTML app-icon: y=46/44, 56/54, 66/64, endpoints 40/50/60
    draw.polygon(band(46, 44, 40), fill=GREEN_BRIGHT)
    draw.polygon(band(56, 54, 50), fill=GREEN_MID)
    draw.polygon(band(66, 64, 60), fill=GREEN_DEEP)

    # --- Flag pole (40,28) → (40,44), gold, width 1.3 ---
    pole_w = max(2, int(round(s(1.3))))
    draw.line([p(40, 28), p(40, 44)], fill=GOLD + (255,), width=pole_w)

    # --- Flag triangle: 40,28 → 48,32 → 40,36, gold @ 0.9 ---
    draw.polygon([p(40, 28), p(48, 32), p(40, 36)],
                 fill=GOLD + (int(255 * 0.9),))

    out = "Fairway/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png"
    img.convert("RGB").save(out, "PNG")
    print(f"Saved {out} ({SIZE}×{SIZE})")


if __name__ == "__main__":
    main()
