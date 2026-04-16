# Architecture — App Forge

## Overview

Single CRA bundle: `src/App.jsx` holds most UI and state; `chase_forge_v1` in localStorage for portfolio snapshots and ideas.

## Scripts

| Script | Role |
|--------|------|
| `audit.sh` | Code audit; can tee results to `portfolio/app-hub/last-audit-app-forge.txt` |
| `pre-deploy.sh` | Pre-flight before deploy |

## Deploy

Vercel **Root Directory:** `portfolio/app-forge`.
