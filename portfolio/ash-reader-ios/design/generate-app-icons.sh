#!/bin/bash
# Renders design/app-icon.svg to all 12 App Icon PNG sizes required by iOS.
# Re-run whenever app-icon.svg changes. Do NOT edit the PNGs by hand.
#
# Uses macOS built-ins: qlmanage to rasterize SVG -> 1024 PNG, sips to downscale.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SVG="$SCRIPT_DIR/app-icon.svg"
OUT="$SCRIPT_DIR/../AshReader/Assets.xcassets/AppIcon.appiconset"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

if [[ ! -f "$SVG" ]]; then
  echo "SVG not found: $SVG" >&2
  exit 1
fi

mkdir -p "$OUT"

echo "Rendering master 1024x1024 from $SVG"
qlmanage -t -s 1024 "$SVG" -o "$TMP" >/dev/null 2>&1
MASTER="$TMP/$(basename "$SVG").png"

if [[ ! -f "$MASTER" ]]; then
  echo "qlmanage failed to produce $MASTER" >&2
  exit 1
fi

render() {
  local size="$1" name="$2"
  sips -z "$size" "$size" "$MASTER" --out "$OUT/$name" >/dev/null
  echo "  -> $name (${size}x${size})"
}

render 40   "Icon-20@2x.png"
render 60   "Icon-20@3x.png"
render 58   "Icon-29@2x.png"
render 87   "Icon-29@3x.png"
render 80   "Icon-40@2x.png"
render 120  "Icon-40@3x.png"
render 120  "Icon-60@2x.png"
render 180  "Icon-60@3x.png"
render 76   "Icon-76.png"
render 152  "Icon-76@2x.png"
render 167  "Icon-83.5@2x.png"
cp "$MASTER" "$OUT/Icon-1024.png"
echo "  -> Icon-1024.png (1024x1024)"

echo "Done. 12 PNGs written to $OUT"
