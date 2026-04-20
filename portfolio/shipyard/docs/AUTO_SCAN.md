# Auto-Scan Cron — Guide

The fleet scanner runs automatically every night at **3:00 AM local** via a macOS LaunchAgent. This doc walks through how it works, how to run it on demand, how to change the schedule, and how to turn it off.

## What It Does

A scheduled job runs `scripts/scan-cron.sh` every night. That wrapper calls `npx tsx scripts/scan.ts`, which:

1. Walks `~/Developer/chase/portfolio/*` and reads each project's `CLAUDE.md`, `git log`, `package.json`, etc.
2. Upserts a row per project into Supabase `projects`
3. Parses each `LEARNINGS.md` and upserts into `learnings` *(currently failing — see Known Issues)*
4. Writes a scan row into `scans` (for history)

Logs go to `~/Library/Logs/shipyard-scan/` — one `scan.log` (stdout) and one `scan.err` (stderr).

## The Pieces

| Piece | Location | What it is |
|---|---|---|
| Wrapper | `portfolio/shipyard/scripts/scan-cron.sh` | Bash script that `cd`s to shipyard and runs `npx tsx scripts/scan.ts`. Tracked in git. |
| LaunchAgent | `~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist` | Tells macOS when to run the wrapper. Local to this Mac — not tracked in git. |
| Logs | `~/Library/Logs/shipyard-scan/scan.{log,err}` | stdout / stderr. Grows a few KB per run. |

## Run It On Demand

You don't have to wait until 3am. Two ways:

**Option A — Fire and forget:**

```bash
launchctl start com.chasewhittaker.shipyard-scan
```

That tells launchd to run the job *right now*, on top of its normal schedule. Tomorrow's 3am run still happens.

**Option B — Watch it live:**

Open two terminal windows side by side.

Window 1 — tail the log file (this stays open and streams updates):
```bash
tail -f ~/Library/Logs/shipyard-scan/scan.log
```

Window 2 — trigger the scan:
```bash
launchctl start com.chasewhittaker.shipyard-scan
```

You'll see `[OK] <project>` lines tick by in window 1, then a summary. Press `Ctrl+C` in window 1 to stop watching (the log file keeps being written).

## Check Status

```bash
launchctl list | grep shipyard-scan
```

You'll see one of:

| Output | Meaning |
|---|---|
| `-	0	com.chasewhittaker.shipyard-scan` | Loaded, not currently running, last exit code 0 (success) |
| `14936	0	com.chasewhittaker.shipyard-scan` | Running right now (PID 14936) |
| `-	1	com.chasewhittaker.shipyard-scan` | Loaded, last run failed (exit 1) — check `scan.err` |
| *(no output)* | Not loaded at all — run `launchctl load -w ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist` |

## Change The Schedule

The plist's `StartCalendarInterval` block controls when it runs. Edit the file:

```bash
open -e ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist
```

Make your change, save, then **reload** so launchd picks it up:

```bash
launchctl unload -w ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist
launchctl load -w ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist
```

### Current: nightly at 3am

```xml
<key>StartCalendarInterval</key>
<dict>
    <key>Hour</key>
    <integer>3</integer>
    <key>Minute</key>
    <integer>0</integer>
</dict>
```

### Every 4 hours (what you asked about)

Replace the single `<dict>` with an **array of dicts** — one per fire time. "Every 4 hours" clock-aligned means 3am, 7am, 11am, 3pm, 7pm, 11pm:

```xml
<key>StartCalendarInterval</key>
<array>
    <dict><key>Hour</key><integer>3</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Hour</key><integer>7</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Hour</key><integer>11</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Hour</key><integer>15</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Hour</key><integer>19</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Hour</key><integer>23</integer><key>Minute</key><integer>0</integer></dict>
</array>
```

This is the cleanest approach — fires at specific clock times, and launchd catches up on a missed run if the Mac was asleep.

### Alternative: every N seconds (not recommended)

```xml
<key>StartInterval</key>
<integer>14400</integer>
```

`14400` = 4 hours in seconds. Drawback: drifts relative to the clock over time, and if the Mac sleeps, launchd fires immediately on wake even if only 10 minutes remained on the timer. Use `StartCalendarInterval` unless you have a reason not to.

### A few other examples

| Schedule | XML |
|---|---|
| Every morning at 6am | `<dict><key>Hour</key><integer>6</integer><key>Minute</key><integer>0</integer></dict>` |
| Weekdays only, 7:30am | `<dict><key>Hour</key><integer>7</integer><key>Minute</key><integer>30</integer><key>Weekday</key><integer>1</integer></dict>` *(repeat with Weekday 2–5)* |
| Every hour on the hour | `StartInterval` of `3600` |

After any edit: **unload + load** (shown above). If you don't reload, launchd keeps using the old schedule.

## Disable / Enable

**Turn off temporarily:**
```bash
launchctl unload -w ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist
```

**Turn back on:**
```bash
launchctl load -w ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist
```

The `-w` flag makes the disabled/enabled state persist across reboots. Without it, a reboot re-enables whatever the default was.

**Remove completely:**
```bash
launchctl unload -w ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist
rm ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist
```

The wrapper script at `scripts/scan-cron.sh` stays in the repo — you can still run it manually (`./scripts/scan-cron.sh` from the shipyard dir).

## Troubleshooting

**Nothing seems to run.**
Check `launchctl list | grep shipyard-scan`. If there's no output, the plist isn't loaded — run the load command from "Change The Schedule".

**Job exits non-zero (`-	1	...`).**
Check `~/Library/Logs/shipyard-scan/scan.err`. Most common cause: `.env.local` missing or `SUPABASE_SERVICE_ROLE_KEY` unset. The scanner needs that key to bypass RLS.

**Logs show `-bash: npx: command not found` or similar.**
The plist invokes `/bin/zsh -l -c …` so it picks up a login shell with your PATH. If you've changed shells or PATH setup, you may need to adjust the plist's `ProgramArguments`.

**Mac was asleep at 3am.**
launchd's `StartCalendarInterval` fires the missed run when the Mac next wakes. You won't miss a day, but the timestamp in the scan will be whenever the Mac woke up, not 3am.

## Known Issues

- **Learnings upsert fails.** The scanner calls `upsert` on the `learnings` table with `onConflict: 'project_slug,source,raw_source_ref'`, but the table is missing that unique constraint. Every run logs one error to `scan.err` but doesn't block the project upsert. Fix: add a migration `supabase/migrations/0003_learnings_unique.sql` creating the constraint. Tracked as a follow-up task.

## Quick Reference

```bash
# Fire a scan now
launchctl start com.chasewhittaker.shipyard-scan

# Watch log in real time
tail -f ~/Library/Logs/shipyard-scan/scan.log

# Check status
launchctl list | grep shipyard-scan

# Reload after editing plist
launchctl unload -w ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist && \
  launchctl load -w ~/Library/LaunchAgents/com.chasewhittaker.shipyard-scan.plist

# Last scan summary (last 25 lines)
tail -25 ~/Library/Logs/shipyard-scan/scan.log

# Errors from last run
cat ~/Library/Logs/shipyard-scan/scan.err
```
