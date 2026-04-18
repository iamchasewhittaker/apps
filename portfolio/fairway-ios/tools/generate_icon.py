#!/usr/bin/env python3
"""Generate Fairway iOS app icon — 1024×1024 Augusta green + white sprinkler arc."""

import math
from PIL import Image, ImageDraw

SIZE = 1024
BG = (0, 103, 71)   # #006747 Augusta green
WHITE = (255, 255, 255)

img = Image.new("RGB", (SIZE, SIZE), BG)
draw = ImageDraw.Draw(img)

# Pivot = sprinkler head center, placed at vertical midpoint of icon
cx = SIZE // 2
cy = SIZE // 2 + 120   # anchor lower so arc fans up into center

arc_r = 380
line_w = 56

# Spray arc: upper semicircle (fan upward from pivot)
bbox = [cx - arc_r, cy - arc_r, cx + arc_r, cy + arc_r]
draw.arc(bbox, start=205, end=335, fill=WHITE, width=line_w)

# Three rays from pivot upward at -55°, 0°, +55°
ray_angles = [-55, 0, 55]
ray_start_r = 50
ray_end_r = 345

for angle_deg in ray_angles:
    angle_rad = math.radians(angle_deg - 90)
    sx = cx + ray_start_r * math.cos(angle_rad)
    sy = cy + ray_start_r * math.sin(angle_rad)
    ex = cx + ray_end_r * math.cos(angle_rad)
    ey = cy + ray_end_r * math.sin(angle_rad)
    draw.line([(sx, sy), (ex, ey)], fill=WHITE, width=line_w - 14)

    # Droplet
    drop_r = 24
    draw.ellipse([(ex - drop_r, ey - drop_r), (ex + drop_r, ey + drop_r)], fill=WHITE)

# Pivot circle
head_r = 44
draw.ellipse([(cx - head_r, cy - head_r), (cx + head_r, cy + head_r)], fill=WHITE)

out = "Fairway/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png"
img.save(out, "PNG")
print(f"Saved {out}")
