#!/bin/bash
# Renders design/app-icon.svg -> Shipyard/Assets.xcassets/AppIcon.appiconset/ (all 13 sizes + Contents.json)
# Provides iOS 16/17 compatibility in addition to iOS 18's single-file mode.
#
# macOS built-ins only: qlmanage rasterizes the SVG; sips resizes to exact dimensions.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SVG="$SCRIPT_DIR/app-icon.svg"
OUT="$SCRIPT_DIR/../Shipyard/Assets.xcassets/AppIcon.appiconset"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if [[ ! -f "$SVG" ]]; then
  echo "SVG not found: $SVG" >&2
  exit 1
fi

mkdir -p "$OUT"

echo "Rendering 1024x1024 from $SVG"
qlmanage -t -s 1024 "$SVG" -o "$TMP" >/dev/null 2>&1
MASTER_RAW="$TMP/$(basename "$SVG").png"
if [[ ! -f "$MASTER_RAW" ]]; then
  echo "qlmanage failed to produce $MASTER_RAW" >&2
  exit 1
fi

MASTER="$TMP/master-1024.png"
sips -z 1024 1024 "$MASTER_RAW" --out "$MASTER" >/dev/null

# filename : size (pixels)
SIZES=(
  "Icon-1024.png:1024"
  "Icon-60@2x.png:120"
  "Icon-60@3x.png:180"
  "Icon-40@2x.png:80"
  "Icon-40@3x.png:120"
  "Icon-29@1x.png:29"
  "Icon-29@2x.png:58"
  "Icon-29@3x.png:87"
  "Icon-20@2x.png:40"
  "Icon-20@3x.png:60"
  "Icon-76@1x.png:76"
  "Icon-76@2x.png:152"
  "Icon-83.5@2x.png:167"
)

for entry in "${SIZES[@]}"; do
  name="${entry%%:*}"
  size="${entry##*:}"
  sips -z "$size" "$size" "$MASTER" --out "$OUT/$name" >/dev/null
  echo "  -> $OUT/$name (${size}x${size})"
done

cat > "$OUT/Contents.json" <<'JSON'
{
  "images" : [
    { "idiom" : "iphone", "size" : "20x20", "scale" : "2x", "filename" : "Icon-20@2x.png" },
    { "idiom" : "iphone", "size" : "20x20", "scale" : "3x", "filename" : "Icon-20@3x.png" },
    { "idiom" : "iphone", "size" : "29x29", "scale" : "1x", "filename" : "Icon-29@1x.png" },
    { "idiom" : "iphone", "size" : "29x29", "scale" : "2x", "filename" : "Icon-29@2x.png" },
    { "idiom" : "iphone", "size" : "29x29", "scale" : "3x", "filename" : "Icon-29@3x.png" },
    { "idiom" : "iphone", "size" : "40x40", "scale" : "2x", "filename" : "Icon-40@2x.png" },
    { "idiom" : "iphone", "size" : "40x40", "scale" : "3x", "filename" : "Icon-40@3x.png" },
    { "idiom" : "iphone", "size" : "60x60", "scale" : "2x", "filename" : "Icon-60@2x.png" },
    { "idiom" : "iphone", "size" : "60x60", "scale" : "3x", "filename" : "Icon-60@3x.png" },
    { "idiom" : "ipad", "size" : "20x20", "scale" : "1x", "filename" : "Icon-20@2x.png" },
    { "idiom" : "ipad", "size" : "20x20", "scale" : "2x", "filename" : "Icon-20@2x.png" },
    { "idiom" : "ipad", "size" : "29x29", "scale" : "1x", "filename" : "Icon-29@1x.png" },
    { "idiom" : "ipad", "size" : "29x29", "scale" : "2x", "filename" : "Icon-29@2x.png" },
    { "idiom" : "ipad", "size" : "40x40", "scale" : "1x", "filename" : "Icon-40@2x.png" },
    { "idiom" : "ipad", "size" : "40x40", "scale" : "2x", "filename" : "Icon-40@2x.png" },
    { "idiom" : "ipad", "size" : "76x76", "scale" : "1x", "filename" : "Icon-76@1x.png" },
    { "idiom" : "ipad", "size" : "76x76", "scale" : "2x", "filename" : "Icon-76@2x.png" },
    { "idiom" : "ipad", "size" : "83.5x83.5", "scale" : "2x", "filename" : "Icon-83.5@2x.png" },
    { "idiom" : "ios-marketing", "size" : "1024x1024", "scale" : "1x", "filename" : "Icon-1024.png" }
  ],
  "info" : { "version" : 1, "author" : "xcode" }
}
JSON

echo "Done."
