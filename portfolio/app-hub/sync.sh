#!/bin/bash
set -e

# ── APP HUB SYNC ──────────────────────────────────────────────────────────────
# Runs automatically after git push via post-push hook.
# Reads App.jsx + CHANGELOG.md + last audit results, builds a Claude summary,
# copies it to clipboard.
# Lives at: <repo>/portfolio/app-hub/sync.sh
# ─────────────────────────────────────────────────────────────────────────────

# ── Validate environment ───────────────────────────────────────────────────────
if [ ! -f "package.json" ]; then
  echo "Error: not in an app folder (no package.json found)"
  exit 1
fi

if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "Error: not a git repo"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAST_SYNC="$SCRIPT_DIR/last-sync.json"
APP_DIR="$(pwd)"
APP_NAME="$(basename "$APP_DIR")"

# ── Detect which app we're in ─────────────────────────────────────────────────
case "$APP_NAME" in
  wellness-tracker)  DISPLAY_NAME="Wellness Tracker" ;;
  app-forge)         DISPLAY_NAME="App Forge" ;;
  growth-tracker)    DISPLAY_NAME="Growth Tracker" ;;
  job-search-hq)     DISPLAY_NAME="Job Search HQ" ;;
  *)                 DISPLAY_NAME="$APP_NAME" ;;
esac

# ── Find App.jsx ──────────────────────────────────────────────────────────────
JSX_FILE="$APP_DIR/src/App.jsx"
if [ ! -f "$JSX_FILE" ]; then
  echo "⚠️  App Hub: Could not find src/App.jsx in $APP_DIR — skipping sync"
  exit 0
fi

# ── Line count ────────────────────────────────────────────────────────────────
LINE_COUNT=$(wc -l < "$JSX_FILE" | tr -d ' ')

# ── Current git tag / version ─────────────────────────────────────────────────
CURRENT_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "unknown")

# ── Read last synced version for this app ────────────────────────────────────
if [ -f "$LAST_SYNC" ]; then
  LAST_VERSION=$(python3 -c "
import json, sys
try:
  data = json.load(open('$LAST_SYNC'))
  print(data.get('$APP_NAME', {}).get('version', 'none'))
except:
  print('none')
")
else
  LAST_VERSION="none"
fi

# ── Read CHANGELOG ────────────────────────────────────────────────────────────
CHANGELOG_FILE="$APP_DIR/CHANGELOG.md"
if [ -f "$CHANGELOG_FILE" ]; then
  if [ "$LAST_VERSION" = "none" ]; then
    CHANGELOG_EXCERPT=$(awk '/^## v/{count++; if(count==1){found=1} if(count==2){exit}} found{print}' "$CHANGELOG_FILE")
  else
    CHANGELOG_EXCERPT=$(awk "/^## ${LAST_VERSION}[[:space:]]/{exit} {print}" "$CHANGELOG_FILE")
  fi
  CHANGELOG_EXCERPT=$(echo "$CHANGELOG_EXCERPT" | sed '/^[[:space:]]*$/d' | head -40)
else
  CHANGELOG_EXCERPT="No CHANGELOG.md found."
fi

# ── Read last audit results ───────────────────────────────────────────────────
AUDIT_FILE="$SCRIPT_DIR/last-audit-${APP_NAME}.txt"
if [ -f "$AUDIT_FILE" ]; then
  AUDIT_RESULTS=$(cat "$AUDIT_FILE")
else
  AUDIT_RESULTS="No audit results found. Run bash audit.sh and results will appear here next time."
fi

# ── Build Claude summary ──────────────────────────────────────────────────────
SUMMARY="# App Hub Sync — ${DISPLAY_NAME}
Date: $(date '+%Y-%m-%d %H:%M')
Version: ${CURRENT_TAG} (was: ${LAST_VERSION})
Lines: ${LINE_COUNT}

## New CHANGELOG entries
${CHANGELOG_EXCERPT}

## Last audit results
${AUDIT_RESULTS}

---
Claude: Please review the above and:
1. Suggest lessons to log based on the changelog entries
2. Flag any audit failures that need attention
3. Update my memory with the new version and line count for ${DISPLAY_NAME}
"

# ── Copy to clipboard ─────────────────────────────────────────────────────────
if command -v pbcopy &>/dev/null; then
  echo "$SUMMARY" | pbcopy
  echo "✓ Copied to clipboard"
else
  echo "$SUMMARY"
  echo "pbcopy not available — output above"
fi

# ── Update last-sync.json ─────────────────────────────────────────────────────
python3 -c "
import json, os
path = '$LAST_SYNC'
data = {}
if os.path.exists(path):
  try:
    data = json.load(open(path))
  except:
    data = {}
if '$APP_NAME' not in data:
  data['$APP_NAME'] = {}
data['$APP_NAME']['version'] = '$CURRENT_TAG'
data['$APP_NAME']['lines'] = $LINE_COUNT
data['$APP_NAME']['last_sync'] = '$(date +%Y-%m-%dT%H:%M:%S)'
json.dump(data, open(path, 'w'), indent=2)
"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "✅ App Hub sync complete"
echo "   App:     ${DISPLAY_NAME}"
echo "   Version: ${CURRENT_TAG} (was: ${LAST_VERSION})"
echo "   Lines:   ${LINE_COUNT}"
echo "📋 Paste the summary into Claude to continue."
echo ""
