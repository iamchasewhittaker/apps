#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PLIST_TEMPLATE="$PROJECT_DIR/ops/com.chase.spend-clarity.enrich.plist"
LAUNCH_AGENT_DIR="$HOME/Library/LaunchAgents"
LAUNCH_AGENT_PLIST="$LAUNCH_AGENT_DIR/com.chase.spend-clarity.enrich.plist"
LOG_DIR="$HOME/Library/Logs"
PYTHON_BIN="${PYTHON_BIN:-$PROJECT_DIR/.venv/bin/python}"
LIVE_MODE="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --live)
      LIVE_MODE="true"
      shift
      ;;
    --python)
      PYTHON_BIN="$2"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1"
      echo "Usage: scripts/install_launchd_job.sh [--live] [--python /path/to/python]"
      exit 1
      ;;
  esac
done

if [[ ! -x "$PYTHON_BIN" ]]; then
  echo "Python interpreter not found or not executable: $PYTHON_BIN"
  echo "Create one with: python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

mkdir -p "$LAUNCH_AGENT_DIR" "$LOG_DIR"
TMP_PLIST="$(mktemp)"
cp "$PLIST_TEMPLATE" "$TMP_PLIST"
sed -i "" "s|__PROJECT_DIR__|$PROJECT_DIR|g" "$TMP_PLIST"
sed -i "" "s|__PYTHON_BIN__|$PYTHON_BIN|g" "$TMP_PLIST"
sed -i "" "s|__LOG_DIR__|$LOG_DIR|g" "$TMP_PLIST"

if [[ "$LIVE_MODE" == "true" ]]; then
  sed -i "" '/--dry-run/d' "$TMP_PLIST"
fi

if launchctl print "gui/$(id -u)/com.chase.spend-clarity.enrich" >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)" "$LAUNCH_AGENT_PLIST" || true
fi

mv "$TMP_PLIST" "$LAUNCH_AGENT_PLIST"
chmod 644 "$LAUNCH_AGENT_PLIST"
launchctl bootstrap "gui/$(id -u)" "$LAUNCH_AGENT_PLIST"

echo "Installed: $LAUNCH_AGENT_PLIST"
echo "Mode: $( [[ "$LIVE_MODE" == "true" ]] && echo live-write || echo dry-run )"
echo "Check: launchctl print gui/$(id -u)/com.chase.spend-clarity.enrich"
echo "Run now: launchctl kickstart -k gui/$(id -u)/com.chase.spend-clarity.enrich"
echo "Uninstall: launchctl bootout gui/$(id -u) $LAUNCH_AGENT_PLIST && rm $LAUNCH_AGENT_PLIST"
