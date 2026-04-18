#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SVG="$SCRIPT_DIR/app-icon.svg"
PUBLIC="$SCRIPT_DIR/../public"
APP="$SCRIPT_DIR/../src/app"
TMP=$(mktemp -d)

echo "Rendering $SVG ..."
qlmanage -t -s 1024 -o "$TMP" "$SVG" 2>/dev/null
RENDERED=$(ls "$TMP"/*.png 2>/dev/null | head -1)

if [ -z "$RENDERED" ]; then
  echo "Error: qlmanage failed to render SVG. Is the file accessible?"
  rm -rf "$TMP"
  exit 1
fi

echo "Generating sizes..."
sips -z 32  32  "$RENDERED" --out "$TMP/icon-32.png"  > /dev/null
sips -z 180 180 "$RENDERED" --out "$TMP/icon-180.png" > /dev/null
sips -z 192 192 "$RENDERED" --out "$TMP/icon-192.png" > /dev/null
sips -z 512 512 "$RENDERED" --out "$TMP/icon-512.png" > /dev/null

cp "$TMP/icon-180.png" "$PUBLIC/apple-touch-icon.png"
cp "$TMP/icon-192.png" "$PUBLIC/icon-192.png"
cp "$TMP/icon-512.png" "$PUBLIC/icon-512.png"
cp "$TMP/icon-32.png"  "$APP/favicon.ico"

rm -rf "$TMP"
echo "Done. Icons written to public/ and app/favicon.ico"
