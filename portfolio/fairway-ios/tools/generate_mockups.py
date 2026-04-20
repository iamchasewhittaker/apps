#!/usr/bin/env python3
"""Generate multiple Fairway icon concept mockups."""

import math
from PIL import Image, ImageDraw, ImageFont

SIZE = 1024
BG_GREEN = (0, 103, 71)       # #006747 Augusta green
BG_DARK  = (11, 21, 11)       # #0B150B app background
GOLD     = (201, 168, 76)     # #C9A84C Masters gold
WHITE    = (255, 255, 255)
OFF_WHITE = (240, 247, 240)

def new(bg=BG_GREEN):
    img = Image.new("RGB", (SIZE, SIZE), bg)
    return img, ImageDraw.Draw(img)

# ── Option A: filled spray fan (solid sector) ──────────────────────────────
def make_A():
    img, d = new()
    cx, cy = SIZE//2, SIZE//2 + 140

    # Filled arc sector from 205° to 335°
    # Draw as a filled pie slice then cut out center
    d.pieslice([cx-400, cy-400, cx+400, cy+400], start=205, end=335, fill=WHITE)
    # Knock out center — smaller pie
    d.pieslice([cx-180, cy-180, cx+180, cy+180], start=205, end=335, fill=BG_GREEN)
    # Cover the pie-slice straight edges below pivot
    d.rectangle([0, cy, SIZE, SIZE], fill=BG_GREEN)
    # Pivot circle
    d.ellipse([cx-52, cy-52, cx+52, cy+52], fill=WHITE)
    # Three droplets along the arc
    for angle in [-55, 0, 55]:
        r = math.radians(angle - 90)
        ex = cx + 360 * math.cos(r)
        ey = cy + 360 * math.sin(r)
        d.ellipse([ex-30, ey-30, ex+30, ey+30], fill=BG_GREEN)
        d.ellipse([ex-18, ey-18, ex+18, ey+18], fill=WHITE)
    img.save("tools/mockup_A.png")

# ── Option B: bold single arc + drips (no rays) ───────────────────────────
def make_B():
    img, d = new()
    cx, cy = SIZE//2, SIZE//2 + 90

    arc_r = 370
    line_w = 70
    bbox = [cx-arc_r, cy-arc_r, cx+arc_r, cy+arc_r]
    d.arc(bbox, start=210, end=330, fill=WHITE, width=line_w)

    # Teardrop drips at -55°, 0°, 55° off the arc
    for angle in [-55, 0, 55]:
        r = math.radians(angle - 90)
        # Drop at end of arc
        bx = cx + arc_r * math.cos(r)
        by = cy + arc_r * math.sin(r)
        # Ellipse taller than wide — teardrop feel
        d.ellipse([bx-26, by-38, bx+26, by+38], fill=WHITE)

    # Pivot nub
    d.ellipse([cx-44, cy-44, cx+44, cy+44], fill=WHITE)
    # Stem
    d.rectangle([cx-22, cy-200, cx+22, cy], fill=WHITE)

    img.save("tools/mockup_B.png")

# ── Option C: bold "F" with spray arc ─────────────────────────────────────
def make_C():
    img, d = new(BG_GREEN)
    cx, cy = SIZE//2, SIZE//2

    # Bold block F using rectangles
    stroke = 90
    f_left = cx - 170
    f_top  = cy - 260
    f_bot  = cy + 260
    bar_h  = stroke

    # Vertical bar
    d.rectangle([f_left, f_top, f_left + stroke, f_bot], fill=WHITE)
    # Top crossbar
    d.rectangle([f_left, f_top, f_left + 310, f_top + stroke], fill=WHITE)
    # Mid crossbar (shorter)
    d.rectangle([f_left, cy - bar_h//2, f_left + 240, cy + bar_h//2], fill=WHITE)

    # Small spray arc off top-right of the F
    arc_cx = f_left + 310
    arc_cy = f_top + stroke // 2
    arc_r  = 140
    d.arc([arc_cx-arc_r, arc_cy-arc_r, arc_cx+arc_r, arc_cy+arc_r],
          start=200, end=340, fill=GOLD, width=28)
    for angle in [-50, 0, 50]:
        r = math.radians(angle - 90)
        ex = arc_cx + arc_r * math.cos(r)
        ey = arc_cy + arc_r * math.sin(r)
        d.ellipse([ex-16, ey-16, ex+16, ey+16], fill=GOLD)

    img.save("tools/mockup_C.png")

# ── Option D: concentric arcs (rings of spray) ────────────────────────────
def make_D():
    img, d = new()
    cx, cy = SIZE//2, SIZE//2 + 100

    radii = [200, 290, 370]
    widths = [60, 44, 30]

    for arc_r, lw in zip(radii, widths):
        bbox = [cx-arc_r, cy-arc_r, cx+arc_r, cy+arc_r]
        d.arc(bbox, start=210, end=330, fill=WHITE, width=lw)

    # Pivot circle + stem
    d.ellipse([cx-46, cy-46, cx+46, cy+46], fill=WHITE)
    d.rectangle([cx-24, cy-220, cx+24, cy-46], fill=WHITE)

    # Droplets at arc tips (outermost ring)
    for angle in [-53, 0, 53]:
        r = math.radians(angle - 90)
        ex = cx + 370 * math.cos(r)
        ey = cy + 370 * math.sin(r)
        d.ellipse([ex-24, ey-24, ex+24, ey+24], fill=WHITE)

    img.save("tools/mockup_D.png")

# ── Option E: golf-flag-meets-sprinkler ───────────────────────────────────
def make_E():
    img, d = new(BG_DARK)
    cx, cy = SIZE//2, SIZE//2

    # Flag pole
    pole_x = cx - 40
    pole_top = cy - 280
    pole_bot = cy + 260
    pole_w = 22
    d.rectangle([pole_x, pole_top, pole_x + pole_w, pole_bot], fill=WHITE)

    # Flag pennant (gold)
    flag_pts = [
        (pole_x + pole_w, pole_top),
        (pole_x + 220, pole_top + 100),
        (pole_x + pole_w, pole_top + 200),
    ]
    d.polygon(flag_pts, fill=GOLD)

    # Sprinkler spray arcs from base of pole
    base_x = pole_x + pole_w // 2
    base_y = pole_bot
    for i, arc_r in enumerate([130, 200, 265]):
        lw = 36 - i * 8
        alpha = 255 - i * 50
        bbox = [base_x - arc_r, base_y - arc_r, base_x + arc_r, base_y + arc_r]
        d.arc(bbox, start=210, end=330, fill=WHITE, width=lw)

    # Base plate circle
    d.ellipse([base_x-40, base_y-40, base_x+40, base_y+40], fill=WHITE)

    img.save("tools/mockup_E.png")

# ── Composite sheet ────────────────────────────────────────────────────────
def make_sheet():
    cols, rows = 3, 2
    thumb = 480
    pad = 24
    label_h = 48
    sheet_w = cols * thumb + (cols + 1) * pad
    sheet_h = rows * (thumb + label_h) + (rows + 1) * pad
    sheet = Image.new("RGB", (sheet_w, sheet_h), (18, 28, 18))
    sd = ImageDraw.Draw(sheet)

    items = [
        ("tools/mockup_A.png", "A — Filled fan"),
        ("tools/mockup_B.png", "B — Arc + drips"),
        ("tools/mockup_C.png", "C — F lettermark"),
        ("tools/mockup_D.png", "D — Concentric arcs"),
        ("tools/mockup_E.png", "E — Flag + spray"),
    ]

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
    except Exception:
        font = ImageFont.load_default()

    for i, (path, label) in enumerate(items):
        col = i % cols
        row = i // cols
        x = pad + col * (thumb + pad)
        y = pad + row * (thumb + label_h + pad)

        icon = Image.open(path).resize((thumb, thumb), Image.LANCZOS)
        sheet.paste(icon, (x, y))
        sd.text((x + thumb // 2, y + thumb + 8), label,
                fill=(200, 200, 200), font=font, anchor="mt")

    sheet.save("tools/mockups_sheet.png")
    print("Saved tools/mockups_sheet.png")

make_A()
make_B()
make_C()
make_D()
make_E()
make_sheet()
