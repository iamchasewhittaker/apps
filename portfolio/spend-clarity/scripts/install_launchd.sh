#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLIST_TEMPLATE="$PROJECT_DIR/scripts/com.chase.spend-clarity.pipeline.plist"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
PLIST_DEST="$LAUNCH_AGENTS_DIR/com.chase.spend-clarity.pipeline.plist"

mkdir -p "$LAUNCH_AGENTS_DIR"
mkdir -p "$PROJECT_DIR/output"

sed "s#__PROJECT_DIR__#$PROJECT_DIR#g" "$PLIST_TEMPLATE" > "$PLIST_DEST"

chmod 644 "$PLIST_DEST"
chmod +x "$PROJECT_DIR/scripts/run_pipeline.sh"

# Reload agent (safe if not loaded yet).
launchctl unload "$PLIST_DEST" >/dev/null 2>&1 || true
launchctl load "$PLIST_DEST"

echo "Installed launchd agent: com.chase.spend-clarity.pipeline"
echo "Plist path: $PLIST_DEST"
echo "Schedule: daily at 06:00 local time"
echo "Logs:"
echo "  $PROJECT_DIR/output/pipeline_cron.log"
echo "  $PROJECT_DIR/output/launchd.out.log"
echo "  $PROJECT_DIR/output/launchd.err.log"
