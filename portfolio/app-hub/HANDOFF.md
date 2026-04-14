# HANDOFF — App Hub

> Utility sync folder — not a deployable app. State tracked here for session continuity.

---

## State

| Field | Value |
|-------|-------|
| **Path** | `portfolio/app-hub/` |
| **Purpose** | Post-push sync summary script for the monorepo |
| **Last touch** | 2026-04-14 — HANDOFF.md created; no code changes |
| **Status** | Stable — no active work |

---

## What this is

`app-hub/` holds `sync.sh`: a shell script that fires after `git push`, reads each app's `App.jsx` line count, `CHANGELOG.md` entries, and audit results, then copies a summary to clipboard for pasting into an AI session.

It is **not** a React app and has **no Vercel deployment**.

---

## Files

| File | Purpose |
|------|---------|
| `sync.sh` | Run after git push — copies per-app summary to clipboard |
| `last-sync.json` | Tracks last synced version per app |
| `MVP-AUDIT.md` | Audit results snapshot |
| `README.md` | Setup + usage instructions |

---

## How to run

```bash
cd portfolio/wellness-tracker
bash "$(git rev-parse --show-toplevel)/portfolio/app-hub/sync.sh"
```

Or wire to the repo root's `.git/hooks/post-push` (see README.md).

---

## Quick links

- [README.md](README.md)
- [sync.sh](sync.sh)
