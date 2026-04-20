#!/bin/sh
# Build with Xcode (default DerivedData), then copy ShortcutReference.app into ./dist/ so it’s easy to find.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CFG="${1:-Debug}"
cd "$ROOT"

echo "Building (configuration: $CFG)…"
xcodebuild \
  -scheme ShortcutReference \
  -project "$ROOT/ShortcutReference.xcodeproj" \
  -configuration "$CFG" \
  -destination "platform=macOS" \
  build

DIR="$(xcodebuild \
  -scheme ShortcutReference \
  -project "$ROOT/ShortcutReference.xcodeproj" \
  -configuration "$CFG" \
  -showBuildSettings 2>/dev/null \
  | sed -n 's/[[:space:]]*BUILT_PRODUCTS_DIR = //p' | head -1 | tr -d '\r' | sed 's/^"//;s/"$//')"

if [ -z "$DIR" ] || [ ! -d "$DIR/ShortcutReference.app" ]; then
  echo "error: could not find built ShortcutReference.app (BUILT_PRODUCTS_DIR=$DIR)" >&2
  exit 1
fi

mkdir -p "$ROOT/dist"
rm -rf "$ROOT/dist/ShortcutReference.app"
ditto "$DIR/ShortcutReference.app" "$ROOT/dist/ShortcutReference.app"

echo ""
echo "Original (Xcode): $DIR/ShortcutReference.app"
echo "Copy for Finder:  $ROOT/dist/ShortcutReference.app"
open "$ROOT/dist/ShortcutReference.app"
