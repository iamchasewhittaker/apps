#!/bin/bash
# Renders design/app-icon.svg -> Shipyard/Assets.xcassets/AppIcon.appiconset/Icon-1024.png
# iOS 17+ only needs a single 1024x1024 universal slot; the system generates smaller sizes.
#
# macOS built-ins only: qlmanage rasterizes the SVG; sips is the safety net for exact size.

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
MASTER="$TMP/$(basename "$SVG").png"

if [[ ! -f "$MASTER" ]]; then
  echo "qlmanage failed to produce $MASTER" >&2
  exit 1
fi

# Normalize to exact 1024x1024 (qlmanage sometimes outputs with transparency/odd dims)
sips -z 1024 1024 "$MASTER" --out "$OUT/Icon-1024.png" >/dev/null
echo "  -> $OUT/Icon-1024.png (1024x1024)"

echo "Done."
