#!/usr/bin/env python3
"""Generate Fairway iOS app icon — 1024×1024 Augusta green + white sprinkler arc."""

import math
from PIL import Image, ImageDraw

SIZE = 1024
BG = (0, 103, 71)       # #006747 Augusta green
WHITE = (255, 255, 255)

img = Image.new("RGB", (SIZE, SIZE), BG)
draw = ImageDraw.Draw(img)

cx = SIZE // 2
cy = SIZE // 2

# Sprinkler head: small filled circle at center-bottom of glyph
head_r = 28
head_cy = cy + 120
draw.ellipse(
    [(cx - head_r, head_cy - head_r), (cx + head_r, head_cy + head_r)],
    fill=WHITE
)

# Arc radius and line width
arc_r = 280
line_w = 36

# Draw the arc (top half: 210° to 330° = upper-left to upper-right, i.e., the spray zone)
# We want the arc to fan upward from the head position
# Center of the arc circle is at the head position
arc_cx = cx
arc_cy = head_cy

bbox = [arc_cx - arc_r, arc_cy - arc_r, arc_cx + arc_r, arc_cy + arc_r]
draw.arc(bbox, start=200, end=340, fill=WHITE, width=line_w)

# Three spray rays emanating from the head outward at -60°, 0°, +60° (relative to straight up)
ray_angles = [-60, 0, 60]
ray_start_offset = 40   # how far out from head center the ray begins
ray_length = 200
ray_w = 24

for angle_deg in ray_angles:
    angle_rad = math.radians(angle_deg - 90)  # -90 to point upward
    # Start of ray (just outside the head circle)
    sx = arc_cx + ray_start_offset * math.cos(angle_rad)
    sy = arc_cy + ray_start_offset * math.sin(angle_rad)
    # End of ray
    ex = arc_cx + (ray_start_offset + ray_length) * math.cos(angle_rad)
    ey = arc_cy + (ray_start_offset + ray_length) * math.sin(angle_rad)
    draw.line([(sx, sy), (ex, ey)], fill=WHITE, width=ray_w)

    # Droplet at end of each ray
    drop_r = 14
    draw.ellipse(
        [(ex - drop_r, ey - drop_r), (ex + drop_r, ey + drop_r)],
        fill=WHITE
    )

# Save icon
out = "Fairway/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png"
img.save(out, "PNG")
print(f"Saved {out}")
