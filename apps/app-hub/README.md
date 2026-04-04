# App Hub

Central sync folder for all Chase's apps.

## Files
- `sync.sh` — runs after every git push, copies summary to clipboard
- `last-sync.json` — tracks last synced version per app
- `last-audit-*.txt` — last audit results per app (written by each app's audit.sh)

## Setup (run once per app)
```bash
# Wellness Tracker
echo 'bash ~/Documents/app-hub/sync.sh' >> ~/Documents/wellness-tracker/.git/hooks/post-push
chmod +x ~/Documents/wellness-tracker/.git/hooks/post-push

# App Forge
echo 'bash ~/Documents/app-hub/sync.sh' >> ~/Documents/app-forge/.git/hooks/post-push
chmod +x ~/Documents/app-forge/.git/hooks/post-push

# Growth Tracker
echo 'bash ~/Documents/app-hub/sync.sh' >> ~/Documents/growth-tracker/.git/hooks/post-push
chmod +x ~/Documents/growth-tracker/.git/hooks/post-push

# Job Search HQ
echo 'bash ~/Documents/app-hub/sync.sh' >> ~/Documents/job-search-hq/.git/hooks/post-push
chmod +x ~/Documents/job-search-hq/.git/hooks/post-push
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
