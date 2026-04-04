#!/bin/bash
# pre-deploy.sh — run this before every git push
# Usage: bash pre-deploy.sh
# Place this file in your project root (same folder as package.json)

set -e

APP_FILE="src/App.jsx"
PASS=0
FAIL=0
WARNINGS=()
ERRORS=()

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${BOLD}╔════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║         App Forge Pre-Deploy Check     ║${RESET}"
echo -e "${BOLD}╚════════════════════════════════════════╝${RESET}"
echo ""

# Check App.jsx exists
if [ ! -f "$APP_FILE" ]; then
  echo -e "${RED}✗ $APP_FILE not found. Run from your project root.${RESET}"
  exit 1
fi

check_pass() {
  echo -e "  ${GREEN}✓${RESET} $1"
  PASS=$((PASS + 1))
}

check_fail() {
  echo -e "  ${RED}✗ $1${RESET}"
  echo -e "    ${YELLOW}→ $2${RESET}"
  FAIL=$((FAIL + 1))
  ERRORS+=("$1")
}

check_warn() {
  echo -e "  ${YELLOW}⚠ $1${RESET}"
  echo -e "    ${YELLOW}→ $2${RESET}"
  WARNINGS+=("$1")
}

echo -e "${BLUE}── Checking $APP_FILE ──────────────────────${RESET}"
echo ""

# ── 1. Brace balance ────────────────────────────────────────────
OPENS=$(grep -o '{' "$APP_FILE" | wc -l | tr -d ' ')
CLOSES=$(grep -o '}' "$APP_FILE" | wc -l | tr -d ' ')
if [ "$OPENS" -eq "$CLOSES" ]; then
  check_pass "Brace balance ($OPENS { = $CLOSES })"
else
  check_fail "Brace balance ($OPENS { vs $CLOSES })" \
    "Difference of $((OPENS - CLOSES)). Find the missing or extra brace before deploying."
fi

# ── 2. hasLoaded ref ────────────────────────────────────────────
if grep -q "hasLoaded" "$APP_FILE" && grep -q "useRef" "$APP_FILE"; then
  check_pass "hasLoaded ref present"
else
  check_fail "hasLoaded ref missing" \
    "Add: const hasLoaded = useRef(false); and set hasLoaded.current = true after loading data."
fi

# ── 3. Single save useEffect ────────────────────────────────────
# Only count actual localStorage.setItem calls — not string literals like code.includes("localStorage.setItem")
SAVE_COUNT=$(grep -c "localStorage\.setItem(" "$APP_FILE" 2>/dev/null || echo 0)
if [ "$SAVE_COUNT" -le 1 ]; then
  check_pass "Single save useEffect ($SAVE_COUNT localStorage.setItem found)"
else
  check_warn "Multiple localStorage.setItem calls ($SAVE_COUNT found)" \
    "Merge into a single unified save useEffect to avoid race conditions."
fi

# ── 4. window.confirm ───────────────────────────────────────────
# Only flag actual bare confirm( calls — not string literals containing "confirm("
BARE_CONFIRM=$(grep -n "confirm(" "$APP_FILE" | grep -v "window\.confirm\|\.confirm\|\/\/\|\".*confirm\|'.*confirm\|\`.*confirm" | wc -l | tr -d ' ')
if [ "$BARE_CONFIRM" -eq 0 ]; then
  check_pass "Uses window.confirm() not bare confirm()"
else
  check_fail "Bare confirm() found ($BARE_CONFIRM instance(s))" \
    "Replace all confirm( with window.confirm( to avoid ESLint build failure."
fi

# ── 5. No reportWebVitals ───────────────────────────────────────
# Only flag actual import statements — not string literals like code.includes("reportWebVitals")
if ! grep -qE "^import.*reportWebVitals|require.*reportWebVitals" "$APP_FILE"; then
  check_pass "No reportWebVitals import"
else
  check_fail "reportWebVitals found in App.jsx" \
    "Remove any line referencing reportWebVitals — the file was deleted."
fi

# ── 6. No logo.svg ──────────────────────────────────────────────
# Only flag actual import statements — not string literals
if ! grep -qE "^import.*logo\.svg|require.*logo\.svg" "$APP_FILE"; then
  check_pass "No logo.svg import"
else
  check_fail "logo.svg found in App.jsx" \
    "Remove any line importing logo.svg — the file was deleted."
fi

# ── 7. localStorage key present (check App.jsx or theme.js — key may live in either) ──
if grep -q "chase_" "$APP_FILE" || grep -q "chase_" "src/theme.js" 2>/dev/null; then
  KEY=$(grep -o '"chase_[^"]*"' "$APP_FILE" "src/theme.js" 2>/dev/null | head -1 | cut -d: -f2)
  check_pass "localStorage key found: $KEY"
else
  check_fail "No chase_ localStorage key found" \
    "Make sure your STORE constant uses the key format: chase_appname_v1"
fi

# ── 8. vercel.json exists ───────────────────────────────────────
if [ -f "vercel.json" ]; then
  check_pass "vercel.json exists"
else
  check_fail "vercel.json missing" \
    "Create vercel.json in your project root with no-cache headers. See MASTER_PROJECT_FRAMEWORK.md."
fi

# ── 9. src/App.js conflict ──────────────────────────────────────
if [ -f "src/App.js" ]; then
  check_fail "src/App.js exists alongside App.jsx" \
    "Delete it: rm src/App.js — it conflicts with App.jsx and will break the build."
else
  check_pass "No src/App.js conflict"
fi

# ── 10. CHANGELOG.md exists ─────────────────────────────────────
if [ -f "CHANGELOG.md" ]; then
  check_pass "CHANGELOG.md exists"
else
  check_warn "CHANGELOG.md missing" \
    "Create CHANGELOG.md and add an entry for every deploy."
fi

# ── 11. index.js is clean ───────────────────────────────────────
if [ -f "src/index.js" ]; then
  if grep -q "reportWebVitals" "src/index.js"; then
    check_fail "src/index.js references reportWebVitals" \
      "Replace src/index.js with the minimal version from MASTER_PROJECT_FRAMEWORK.md."
  else
    check_pass "src/index.js is clean"
  fi
fi

# ── Summary ─────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}── Summary ──────────────────────────────────${RESET}"
echo ""

TOTAL=$((PASS + FAIL))
if [ "$FAIL" -eq 0 ] && [ "${#WARNINGS[@]}" -eq 0 ]; then
  echo -e "  ${GREEN}${BOLD}All $PASS checks passed — safe to deploy.${RESET}"
  echo ""
  echo -e "  Run your deploy:"
  echo -e "  ${BLUE}git add . && git commit -m \"vN description\" && git push${RESET}"
  echo -e "  ${BLUE}git tag vN && git push origin vN${RESET}"
elif [ "$FAIL" -eq 0 ]; then
  echo -e "  ${YELLOW}${BOLD}$PASS/$TOTAL passed with ${#WARNINGS[@]} warning(s).${RESET}"
  echo -e "  ${YELLOW}Warnings won't break the build but should be addressed.${RESET}"
  echo ""
  echo -e "  You can deploy, but review the warnings above first."
else
  echo -e "  ${RED}${BOLD}$FAIL check(s) failed — do not deploy.${RESET}"
  echo ""
  echo -e "  ${RED}Fix these before pushing:${RESET}"
  for err in "${ERRORS[@]}"; do
    echo -e "  ${RED}  • $err${RESET}"
  done
fi

echo ""

# Exit with error code if any checks failed (useful for CI)
if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
