#!/usr/bin/env python3
"""Generate 1024×1024 AppIcon.png — Command suite tile + gold chevron-in-shield motif."""
from __future__ import annotations

import struct
import zlib
from pathlib import Path


def _png_chunk(tag: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)


def write_png(path: Path, width: int, height: int, rgb: bytes) -> None:
    """Write opaque RGB PNG (color type 2) — App Store–safe, no alpha channel."""
    assert len(rgb) == width * height * 3
    signature = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    raw = b"".join(b"\x00" + rgb[y * width * 3 : (y + 1) * width * 3] for y in range(height))
    compressed = zlib.compress(raw, 9)
    blob = signature + _png_chunk(b"IHDR", ihdr) + _png_chunk(b"IDAT", compressed) + _png_chunk(b"IEND", b"")
    path.write_bytes(blob)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out = root / "ClarityCommand" / "Assets.xcassets" / "AppIcon.appiconset" / "AppIcon.png"
    w = h = 1024
    tile = (11, 15, 26)  # #0B0F1A
    band_hi = (18, 24, 38)  # subtle mid band
    gold = (200, 168, 75)  # #c8a84b
    px = bytearray(w * h * 3)

    def set_px(x: int, y: int, rgbv: tuple[int, int, int]) -> None:
        if 0 <= x < w and 0 <= y < h:
            i = (y * w + x) * 3
            px[i : i + 3] = bytes([rgbv[0], rgbv[1], rgbv[2]])

    for y in range(h):
        for x in range(w):
            blend = tile
            if h // 3 <= y < 2 * h // 3:
                t = 0.22
                blend = tuple(int(tile[i] * (1 - t) + band_hi[i] * t) for i in range(3))
            i = (y * w + x) * 3
            px[i : i + 3] = bytes([blend[0], blend[1], blend[2]])

    cx, cy = w // 2, h // 2
    shield_w, shield_h = int(w * 0.38), int(h * 0.44)

    def in_shield(x: int, y: int) -> bool:
        dx = abs(x - cx) / (shield_w / 2)
        dy = (y - cy) / (shield_h / 2)
        if dy < -0.15:
            return False
        top = dy < 0.35 and dx < 0.55 * (1.0 - (0.35 - dy) * 0.9)
        body = dy >= 0.35 and (dx * dx + (dy - 0.2) * (dy - 0.2)) < 1.05
        return top or body

    for y in range(h):
        for x in range(w):
            if in_shield(x, y):
                edge = False
                for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                    nx, ny = x + dx, y + dy
                    if in_shield(nx, ny) != in_shield(x, y):
                        edge = True
                        break
                if edge:
                    set_px(x, y, gold)

    # Gold chevron >
    chev_thick = max(18, w // 56)
    for t in range(-chev_thick, chev_thick + 1):
        for u in range(-int(shield_w * 0.35), int(shield_w * 0.35)):
            x = cx + u // 2 + t // 3
            y = cy + u + t
            if abs(u) + abs((u + t) // 4) < shield_w * 0.28:
                set_px(x, y, gold)

    out.parent.mkdir(parents=True, exist_ok=True)
    write_png(out, w, h, bytes(px))
    print(f"Wrote {out} ({w}×{h} RGB opaque)")


if __name__ == "__main__":
    main()
