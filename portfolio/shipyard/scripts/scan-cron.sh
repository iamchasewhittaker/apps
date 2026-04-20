#!/bin/bash
# Shipyard nightly scanner — invoked by launchd (~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist).
# Run manually to test: ./scripts/scan-cron.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== scan started $(date +%FT%T%z) ==="
npx tsx scripts/scan.ts
echo "=== scan finished $(date +%FT%T%z) ==="
