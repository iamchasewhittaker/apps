#!/bin/bash

# ============================================================
# audit.sh — App Forge Terminal Auditor
# Usage: bash audit.sh
# Run from inside any app folder (wellness, growth, job-search-hq, app-forge)
# Results are printed + copied to clipboard automatically
# ============================================================

FILE="src/App.jsx"

# ── Check file exists ────────────────────────────────────────
if [ ! -f "$FILE" ]; then
  echo "❌  No src/App.jsx found in this folder."
  echo "    Make sure you cd into the app folder first."
  exit 1
fi

# ── App Detection ────────────────────────────────────────────
# App Forge is checked FIRST — its code contains wellness/growth
# strings as part of its audit logic, causing false matches.

APP_KEY="unknown"
APP_NAME="Unknown App"

if grep -q "chase_forge_v1" "$FILE" && grep -q "detectApp" "$FILE"; then
  APP_KEY="appforge"
  APP_NAME="App Forge"
elif grep -q "morning_start" "$FILE" && grep -q "end_of_day" "$FILE"; then
  APP_KEY="wellness"
  APP_NAME="Wellness Tracker"
elif grep -q "getStreak" "$FILE" && grep -q "hadToday" "$FILE"; then
  APP_KEY="growth"
  APP_NAME="Growth Tracker"
elif grep -q "Job Search" "$FILE" && grep -q "resume" "$FILE"; then
  APP_KEY="jobsearch"
  APP_NAME="Job Search HQ"
fi

# ── Helpers ──────────────────────────────────────────────────
PASSED=0
TOTAL=0
RESULTS=""

run_check() {
  local LABEL="$1"
  local RESULT="$2"
  local NOTE="$3"
  TOTAL=$((TOTAL+1))
  if [ "$RESULT" = "pass" ]; then
    PASSED=$((PASSED+1))
    RESULTS="$RESULTS\n✅  $LABEL"
  else
    RESULTS="$RESULTS\n❌  $LABEL${NOTE:+ — $NOTE}"
  fi
}

warn_check() {
  local LABEL="$1"
  local NOTE="$2"
  TOTAL=$((TOTAL+1))
  PASSED=$((PASSED+1))
  RESULTS="$RESULTS\n⚠️   $LABEL${NOTE:+ — $NOTE}"
}

# ── Universal checks ─────────────────────────────────────────

# 1. localStorage key
if grep -q "chase_forge_v1" "$FILE" || grep -q "wellness_v1" "$FILE" || grep -q "growth_v1" "$FILE" || grep -q "jobsearch_v1" "$FILE"; then
  run_check "localStorage key present" "pass"
else
  run_check "localStorage key present" "fail" "No recognized storage key found"
fi

# 2. hasLoaded ref
if grep -q "hasLoaded" "$FILE"; then
  run_check "hasLoaded ref present" "pass"
else
  run_check "hasLoaded ref present" "fail" "Add: const hasLoaded = useRef(false)"
fi

# 3. Brace balance
OPEN=$(grep -o '{' "$FILE" | wc -l | tr -d ' ')
CLOSE=$(grep -o '}' "$FILE" | wc -l | tr -d ' ')
if [ "$OPEN" -eq "$CLOSE" ]; then
  run_check "Brace balance OK ($OPEN open, $CLOSE close)" "pass"
else
  run_check "Brace balance mismatch" "fail" "$OPEN open vs $CLOSE close — JSX won't compile"
fi

# 4. window.confirm (not bare confirm)
# Skip lines that are comments, backtick strings, or quoted strings
BARE=$(grep "confirm(" "$FILE" \
  | grep -v "window\.confirm" \
  | grep -v "^\s*//" \
  | grep -v "^\s*\`" \
  | grep -v "^\s*['\"]" \
  | grep -v "['\"\`].*confirm(")
if [ -n "$BARE" ]; then
  run_check "window.confirm() used (not bare confirm)" "fail" "Replace confirm() with window.confirm() — ESLint will block build"
else
  run_check "window.confirm() used (not bare confirm)" "pass"
fi

# 5. No reportWebVitals import
if grep -q "^import.*reportWebVitals" "$FILE"; then
  run_check "No reportWebVitals import" "fail" "Remove this import — file doesn't exist, build will fail"
else
  run_check "No reportWebVitals import" "pass"
fi

# 6. No logo.svg import
if grep -q "^import.*logo\.svg" "$FILE"; then
  run_check "No logo.svg import" "fail" "Remove this import — file was deleted, build will fail"
else
  run_check "No logo.svg import" "pass"
fi

# 7. hasLoaded guard in save useEffect
if grep -q "hasLoaded.current" "$FILE"; then
  run_check "Save useEffect with hasLoaded guard found" "pass"
else
  run_check "Save useEffect with hasLoaded guard found" "fail" "Add: if (!hasLoaded.current) return; inside save useEffect"
fi

# 8. vercel.json reminder
warn_check "vercel.json reminder" "Verify vercel.json exists in project root (can't check from App.jsx)"

# ── App-specific checks ──────────────────────────────────────

if [ "$APP_KEY" = "jobsearch" ]; then
  if grep -q "claude-opus-4" "$FILE" || grep -q "claude-sonnet-4" "$FILE" || grep -q "claude-haiku" "$FILE"; then
    run_check "Claude model string present" "pass"
  else
    run_check "Claude model string present" "fail" "Check model string — should match a current claude- model"
  fi
fi

if [ "$APP_KEY" = "growth" ]; then
  if grep -q "getStreak" "$FILE"; then
    run_check "getStreak function present" "pass"
  else
    run_check "getStreak function present" "fail" "getStreak function missing"
  fi
  if grep -q "hadToday" "$FILE"; then
    run_check "hadToday function present" "pass"
  else
    run_check "hadToday function present" "fail" "hadToday function missing"
  fi
fi

if [ "$APP_KEY" = "wellness" ]; then
  if grep -q "morning_start" "$FILE"; then
    run_check "morning_start section key present" "pass"
  else
    run_check "morning_start section key present" "fail" "morning_start key missing — section data will break"
  fi
  if grep -q "end_of_day" "$FILE"; then
    run_check "end_of_day section key present" "pass"
  else
    run_check "end_of_day section key present" "fail" "end_of_day key missing — section data will break"
  fi
fi

# ── Score ────────────────────────────────────────────────────
SCORE=$(echo "scale=0; $PASSED * 100 / $TOTAL" | bc)

if [ "$SCORE" -ge 90 ]; then
  GRADE="🟢 Ready to deploy"
elif [ "$SCORE" -ge 70 ]; then
  GRADE="🟡 Fix failures before deploying"
else
  GRADE="🔴 Do not deploy — significant issues found"
fi

# ── Output ───────────────────────────────────────────────────
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

OUTPUT="============================================================
APP FORGE — TERMINAL AUDIT
$TIMESTAMP
============================================================
App detected : $APP_NAME
File         : $FILE
------------------------------------------------------------
$(echo -e "$RESULTS")
------------------------------------------------------------
Score  : $SCORE/100
Passed : $PASSED/$TOTAL
Status : $GRADE
============================================================"

echo ""
echo "$OUTPUT"
echo ""
echo "$OUTPUT" | pbcopy
echo "📋  Results copied to clipboard — paste anywhere for analysis."
echo ""
