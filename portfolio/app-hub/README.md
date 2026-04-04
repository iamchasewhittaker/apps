# App Hub

Central sync folder for all Chase's apps.

## Files
- `sync.sh` — runs after every git push, copies summary to clipboard
- `last-sync.json` — tracks last synced version per app
- `last-audit-*.txt` — last audit results per app (written by each app's audit.sh)

## Setup (monorepo — run from `~/Developer/chase`)

Use one shared `post-push` hook at the **repo root** (not per nested app), or from each `portfolio/<app>` if those folders have their own `.git` (they do not in the monorepo).

Example **root** hook after `git init` at monorepo root is unnecessary — hooks live in `portfolio/<app>/.git` only if you split repos. In this monorepo, run App Hub manually from an app directory:

```bash
cd portfolio/wellness-tracker
bash "$(git rev-parse --show-toplevel)/portfolio/app-hub/sync.sh"
```

To run automatically on `git push`, add at **repository root** `.git/hooks/post-push`:

```bash
#!/bin/sh
ROOT=$(git rev-parse --show-toplevel)
bash "$ROOT/portfolio/app-hub/sync.sh"
```

## How it works
1. You run `git push` in any app folder
2. sync.sh fires automatically
3. Reads App.jsx (line count), CHANGELOG.md (new entries), last audit results
4. Copies a clean summary to clipboard (prints to stdout if pbcopy unavailable)
5. Paste into Claude — Claude handles lessons + doc updates

## sync.sh error handling (added 2026-03-24)
- `set -e` at top — any command failure stops the script immediately
- Validates `package.json` exists — errors if run outside an app folder
- Validates git repo — errors if `.git` dir not found
- pbcopy wrapped in availability check — falls back to stdout on non-Mac systems
- Clear success summary printed at end (app name, version, line count)
