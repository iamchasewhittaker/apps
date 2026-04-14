#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$HOME/Developer/chase/portfolio/spend-clarity}"
cd "$PROJECT_DIR"

# Prefer local venv if available, otherwise fall back to system python3.
if [[ -x ".venv/bin/python3" ]]; then
  PYTHON_BIN=".venv/bin/python3"
elif [[ -x "venv/bin/python3" ]]; then
  PYTHON_BIN="venv/bin/python3"
else
  PYTHON_BIN="${PYTHON_BIN:-python3}"
fi

mkdir -p output

"$PYTHON_BIN" src/main.py --pipeline-auto >> output/pipeline_cron.log 2>&1
