#!/usr/bin/env python3
"""Generate Clarity family iOS icon mockups (1024). Time-led ring system + badge on all.

Canonical mark: ``draw_time_center`` is the approved Time glyph — do not change without
explicit client sign-off. Export ``clarity-time-icon-canonical.png`` as the locked asset.
Other apps share rings + badge; iterate only their center draw functions.
"""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W = H = 1024
OUT_DIR = Path(__file__).resolve().parent

COL_BG = (14, 16, 21)
COL_SURFACE = (26, 30, 38)
COL_ACCENT = (79, 146, 242)
COL_SAFE = (61, 183, 122)
COL_CAUTION = (232, 187, 50)
COL_TEXT = (235, 239, 245)
INNER_RING = (126, 169, 230)
BADGE_BLUE = (49, 176, 240)

# Shared "Time" ring geometry (iOS squircle content area ~724px)
OUTER_ELLIPSE = (280, 280, 744, 744)
INNER_ELLIPSE = (345, 345, 679, 679)
ARC_BBOX = (250, 250, 774, 774)
ARC_START = 305
ARC_END = 350
OUTLINE_W = 34
INNER_W = 14
ARC_W = 28


def radial_gradient(size: tuple[int, int], inner: tuple[int, int, int], outer: tuple[int, int, int]) -> Image.Image:
    w, h = size
    cx, cy = w / 2, h / 2
    max_d = math.hypot(cx, cy)
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / max_d
            t = min(1, max(0, d * 1.25))
            r = int(inner[0] * (1 - t) + outer[0] * t)
            g = int(inner[1] * (1 - t) + outer[1] * t)
            b = int(inner[2] * (1 - t) + outer[2] * t)
            px[x, y] = (r, g, b)
    return img


def make_base_tile() -> Image.Image:
    img = Image.new("RGB", (W, H), COL_BG)
    bg = radial_gradient((W, H), (12, 25, 54), (8, 13, 30))
    img = Image.blend(img, bg, 0.55)
    d = ImageDraw.Draw(img)
    tile = (150, 150, 874, 874)
    d.rounded_rectangle(tile, radius=140, fill=COL_SURFACE)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle((150, 150, 874, 874), radius=140, outline=(18, 30, 70, 180), width=6)
    od.rectangle((150, 150, 874, 500), fill=(10, 20, 45, 80))
    od.rectangle((150, 500, 874, 874), fill=(5, 10, 20, 80))
    overlay = overlay.filter(ImageFilter.GaussianBlur(2.5))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    return img


def draw_time_style_rings(draw: ImageDraw.ImageDraw) -> None:
    draw.ellipse(OUTER_ELLIPSE, outline=COL_TEXT, width=OUTLINE_W)
    draw.ellipse(INNER_ELLIPSE, outline=INNER_RING, width=INNER_W)
    draw.arc(ARC_BBOX, start=ARC_START, end=ARC_END, fill=COL_ACCENT, width=ARC_W)


def draw_badge(draw: ImageDraw.ImageDraw, center: tuple[int, int] = (760, 760), r: int = 95) -> None:
    x, y = center
    draw.ellipse((x - r, y - r, x + r, y + r), fill=BADGE_BLUE)
    draw.line((x - 35, y + 2, x - 7, y + 30), fill=COL_TEXT, width=18)
    draw.line((x - 7, y + 30, x + 46, y - 24), fill=COL_TEXT, width=18)


def draw_time_center(draw: ImageDraw.ImageDraw) -> None:
    """Locked canonical Time mark (clock hands). Do not change without client sign-off."""
    draw.line((512, 512, 512, 372), fill=COL_TEXT, width=26)
    draw.line((512, 512, 618, 575), fill=COL_TEXT, width=22)


def draw_checkin_center(draw: ImageDraw.ImageDraw) -> None:
    # Pulse inside ring (same weight feel as Time hands)
    pts = [(340, 512), (400, 512), (440, 468), (485, 565), (545, 448), (590, 512), (685, 512)]
    draw.line(pts, fill=COL_TEXT, width=28, joint="curve")
    draw.arc((400, 400, 624, 624), start=200, end=340, fill=COL_SAFE, width=18)


def draw_triage_center(draw: ImageDraw.ImageDraw) -> None:
    # Compact funnel + two slots (fits inner disc)
    draw.line((400, 430, 624, 430), fill=COL_TEXT, width=22)
    draw.line((430, 430, 512, 520), fill=COL_TEXT, width=20)
    draw.line((595, 430, 512, 520), fill=COL_TEXT, width=20)
    draw.line((512, 520, 512, 560), fill=COL_TEXT, width=22)
    draw.rounded_rectangle((430, 575, 595, 615), radius=12, fill=COL_CAUTION)
    draw.rounded_rectangle((455, 630, 570, 665), radius=10, fill=INNER_RING)


def draw_budget_center(draw: ImageDraw.ImageDraw) -> None:
    # Small envelope inside rings
    draw.rounded_rectangle((415, 455, 610, 575), radius=22, outline=COL_TEXT, width=20)
    draw.line((417, 480, 512, 545), fill=COL_TEXT, width=18)
    draw.line((608, 480, 512, 545), fill=COL_TEXT, width=18)
    draw.rounded_rectangle((435, 595, 590, 625), radius=8, fill=COL_SAFE)
    draw.rounded_rectangle((435, 638, 555, 668), radius=8, fill=COL_ACCENT)


def draw_growth_center(draw: ImageDraw.ImageDraw) -> None:
    # Upward curve + seedling (inside rings)
    draw.line((360, 620, 455, 540, 530, 500, 620, 430, 665, 395), fill=COL_TEXT, width=26, joint="curve")
    draw.polygon([(665, 395), (615, 402), (640, 448)], fill=COL_TEXT)
    draw.ellipse((395, 555, 475, 635), outline=COL_SAFE, width=16)
    draw.line((435, 625, 435, 665), fill=COL_SAFE, width=12)


def draw_checkin_center_v3(draw: ImageDraw.ImageDraw) -> None:
    """Simpler EKG + single wellness dot (reads cleaner at small size)."""
    pts = [(368, 512), (418, 512), (448, 512), (468, 472), (498, 552), (528, 488), (558, 512), (658, 512)]
    draw.line(pts, fill=COL_TEXT, width=26, joint="curve")
    draw.ellipse((498 - 10, 488 - 10, 498 + 10, 488 + 10), fill=COL_SAFE)


def draw_triage_center_v3(draw: ImageDraw.ImageDraw) -> None:
    """Priority stack (wide → narrow) + sort chevron — clearer than funnel at small size."""
    w = 22
    draw.rounded_rectangle((378, 418, 646, 458), radius=14, outline=COL_TEXT, width=w)
    draw.rounded_rectangle((408, 478, 616, 518), radius=14, outline=COL_TEXT, width=w)
    draw.rounded_rectangle((438, 538, 586, 578), radius=14, outline=COL_TEXT, width=w)
    # Emphasize top slot (capacity / “now”)
    draw.rounded_rectangle((382, 422, 642, 454), radius=12, outline=COL_CAUTION, width=6)
    # Down chevron (sort / funnel motion)
    draw.line((472, 612, 512, 572), fill=COL_TEXT, width=w)
    draw.line((552, 612, 512, 572), fill=COL_TEXT, width=w)


def draw_budget_center_v3(draw: ImageDraw.ImageDraw) -> None:
    """Envelope + two ledger lines (less visual noise than v2)."""
    w = 22
    draw.rounded_rectangle((420, 455, 604, 575), radius=26, outline=COL_TEXT, width=w)
    draw.line((422, 488, 512, 548), fill=COL_TEXT, width=w - 2)
    draw.line((602, 488, 512, 548), fill=COL_TEXT, width=w - 2)
    draw.rounded_rectangle((418, 598, 606, 628), radius=10, outline=COL_SAFE, width=14)
    draw.rounded_rectangle((418, 642, 560, 672), radius=10, outline=COL_ACCENT, width=14)


def draw_growth_center_v3(draw: ImageDraw.ImageDraw) -> None:
    """Two-segment rise + bold arrowhead + sprout anchor."""
    draw.line((392, 592, 512, 498), fill=COL_TEXT, width=28)
    draw.line((512, 498, 638, 412), fill=COL_TEXT, width=28)
    draw.polygon([(638, 412), (592, 418), (612, 462)], fill=COL_TEXT)
    draw.ellipse((392 - 22, 592 - 22, 392 + 22, 592 + 22), outline=COL_SAFE, width=14)
    draw.line((392, 614, 392, 648), fill=COL_SAFE, width=12)


def draw_rollertask_center(draw: ImageDraw.ImageDraw) -> None:
    """Roller coaster track arc — peaked curve with gold accent at summit."""
    # Main track rail (wider stroke)
    track = [
        (375, 600), (410, 565), (445, 520), (480, 470), (512, 430),
        (544, 470), (579, 520), (614, 565), (649, 600),
    ]
    draw.line(track, fill=COL_TEXT, width=26, joint="curve")
    # Parallel lower rail (thinner, offset ~28px below)
    rail = [
        (375, 628), (410, 593), (445, 548), (480, 498), (512, 458),
        (544, 498), (579, 548), (614, 593), (649, 628),
    ]
    draw.line(rail, fill=COL_TEXT, width=14, joint="curve")
    # Cross-ties connecting the two rails
    for tx, ty_top, ty_bot in [(445, 520, 548), (512, 430, 458), (579, 520, 548)]:
        draw.line((tx, ty_top, tx, ty_bot), fill=COL_TEXT, width=10)
    # Gold accent dot at peak (tycoon / reward feel)
    draw.ellipse((512 - 15, 422 - 15, 512 + 15, 422 + 15), fill=COL_CAUTION)


def make_icon(name: str, draw_center) -> Path:
    img = make_base_tile().convert("RGBA")
    draw = ImageDraw.Draw(img)
    draw_time_style_rings(draw)
    draw_center(draw)
    draw_badge(draw)
    path = OUT_DIR / name
    img.convert("RGB").save(path)
    return path


def build_homescreen(icon_names: list[str], labels: list[str], out_name: str) -> Path:
    home = Image.new("RGB", (1290, 2796), (25, 33, 58))
    hd = ImageDraw.Draw(home)
    for y in range(2796):
        t = y / 2796.0
        c = int(35 + 35 * math.sin(t * math.pi))
        hd.line((0, y, 1290, y), fill=(c, c + 15, c + 45))
    font = ImageFont.load_default()
    grid = [
        (labels[0], icon_names[0], (130, 520)),
        (labels[1], icon_names[1], (550, 520)),
        (labels[2], icon_names[2], (970, 520)),
        (labels[3], icon_names[3], (340, 1000)),
        (labels[4], icon_names[4], (760, 1000)),
    ]
    for label, fname, (x, y) in grid:
        icon = Image.open(OUT_DIR / fname).resize((250, 250), Image.Resampling.LANCZOS)
        home.paste(icon, (x, y))
        hd.text((x + 95, y + 270), label, fill=(235, 240, 248), font=font)
    hd.rounded_rectangle((20, 20, 1270, 2776), radius=110, outline=(220, 220, 230), width=5)
    hd.rounded_rectangle((460, 52, 830, 112), radius=28, fill=(20, 20, 20))
    p = OUT_DIR / out_name
    home.save(p)
    return p


def build_comparison_board(
    icon_names: list[str],
    labels: list[str],
    out_name: str,
    *,
    title_suffix: str = "v2",
) -> Path:
    board = Image.new("RGB", (2200, 1700), (20, 24, 34))
    bd = ImageDraw.Draw(board)
    bd.rectangle((0, 850, 2200, 1700), fill=(236, 239, 244))
    font = ImageFont.load_default()
    for i, (lbl, fname) in enumerate(zip(labels, icon_names)):
        x = 80 + i * 420
        icon = Image.open(OUT_DIR / fname).resize((320, 320), Image.Resampling.LANCZOS)
        board.paste(icon, (x, 190))
        board.paste(icon, (x, 1010))
        bd.text((x + 120, 535), lbl, fill=(230, 234, 242), font=font)
        bd.text((x + 120, 1355), lbl, fill=(50, 58, 78), font=font)
    bd.text((80, 80), f"Clarity Family Icons {title_suffix} - Dark Background", fill=(238, 242, 248), font=font)
    bd.text((80, 900), f"Clarity Family Icons {title_suffix} - Light Background", fill=(36, 44, 60), font=font)
    p = OUT_DIR / out_name
    board.save(p)
    return p


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    specs_v2 = [
        ("clarity-checkin-icon-v2.png", draw_checkin_center),
        ("clarity-triage-icon-v2.png", draw_triage_center),
        ("clarity-time-icon-v2.png", draw_time_center),
        ("clarity-budget-icon-v2.png", draw_budget_center),
        ("clarity-growth-icon-v2.png", draw_growth_center),
    ]
    for name, fn in specs_v2:
        make_icon(name, fn)
    labels = ["Check-in", "Triage", "Time", "Budget", "Growth"]
    names_v2 = [n for n, _ in specs_v2]
    build_homescreen(names_v2, labels, "clarity-homescreen-mockup-v2.png")
    build_comparison_board(names_v2, labels, "clarity-icon-comparison-board-v2.png", title_suffix="v2")

    # V3: locked Time glyph + revised centers for the other four
    make_icon("clarity-time-icon-canonical.png", draw_time_center)
    specs_v3 = [
        ("clarity-checkin-icon-v3.png", draw_checkin_center_v3),
        ("clarity-triage-icon-v3.png", draw_triage_center_v3),
        ("clarity-budget-icon-v3.png", draw_budget_center_v3),
        ("clarity-growth-icon-v3.png", draw_growth_center_v3),
    ]
    for name, fn in specs_v3:
        make_icon(name, fn)
    names_v3 = [
        "clarity-checkin-icon-v3.png",
        "clarity-triage-icon-v3.png",
        "clarity-time-icon-canonical.png",
        "clarity-budget-icon-v3.png",
        "clarity-growth-icon-v3.png",
    ]
    build_homescreen(names_v3, labels, "clarity-homescreen-mockup-v3.png")
    build_comparison_board(names_v3, labels, "clarity-icon-comparison-board-v3.png", title_suffix="v3")

    # RollerTask Tycoon (Clarity family style)
    make_icon("rollertask-tycoon-icon.png", draw_rollertask_center)

    print("v2:", *[OUT_DIR / n for n, _ in specs_v2], sep="\n")
    print("v3 + canonical:", OUT_DIR / "clarity-time-icon-canonical.png", *[OUT_DIR / n for n, _ in specs_v3], sep="\n")
    print("RollerTask:", OUT_DIR / "rollertask-tycoon-icon.png")


if __name__ == "__main__":
    main()
