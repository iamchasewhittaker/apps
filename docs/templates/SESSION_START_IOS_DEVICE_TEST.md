# Session Start — iOS Device Testing + Portfolio Alignment

> Paste this into a new chat. Say: **"Read CLAUDE.md and HANDOFF.md first."**

---

## Mission (read before you start)

> **"For Reese. For Buzz. Forward — no excuses."**
>
> Every app, every build, every commit is for them. Work with urgency.
> This is the common thread woven into everything built in this portfolio.

---

## Read First

```
Read CLAUDE.md and HANDOFF.md first.
Then read portfolio/clarity-hub/CLAUDE.md.
```

Run `checkpoint` before any edits.

---

## Goals for This Session

### 1. iOS Physical Device Testing — iPhone 12 Pro Max

Get all 7 iOS apps verified and deployable to physical device.
Device must be plugged in, trusted, and visible in Xcode.

**For each app below, do in order:**
1. `cd` into the app directory
2. List available destinations: `xcodebuild -scheme <Scheme> -showdestinations`
3. Build to device: `xcodebuild build -scheme <Scheme> -destination 'platform=iOS,name=iPhone 12 Pro Max'`
4. If signing fails: check Development Team in Xcode → Signing & Capabilities
5. If bundle ID conflict: note it and update xcodeproj signing settings
6. Report: build ✅ / ❌ + any error summary

| App | Directory | Scheme | Bundle ID |
|-----|-----------|--------|-----------|
| Clarity Check-in | `portfolio/clarity-checkin-ios/` | `ClarityCheckin` | `com.chasewhittaker.ClarityCheckin` |
| Clarity Triage | `portfolio/clarity-triage-ios/` | `ClarityTriage` | `com.chasewhittaker.ClarityTriage` |
| Clarity Time | `portfolio/clarity-time-ios/` | `ClarityTime` | `com.chasewhittaker.ClarityTime` |
| Clarity Budget | `portfolio/clarity-budget-ios/` | `ClarityBudget` | `com.chasewhittaker.ClarityBudget` |
| Clarity Growth | `portfolio/clarity-growth-ios/` | `ClarityGrowth` | `com.chasewhittaker.ClarityGrowth` |
| RollerTask Tycoon | `portfolio/roller-task-tycoon-ios/` | `RollerTaskTycoon` | `com.chasewhittaker.ParkChecklist` |
| YNAB Clarity | `portfolio/ynab-clarity-ios/` | `YNABClarity` | `com.chasewhittaker.YNABClarity` |

**Common fixes needed:**
- `DEVELOPMENT_TEAM` not set → set in Signing & Capabilities tab or pass `DEVELOPMENT_TEAM=<TeamID>` to xcodebuild
- Provisioning profile missing → Xcode → Preferences → Accounts → Download Manual Profiles
- `CODE_SIGNING_REQUIRED=YES` for real device (never use `CODE_SIGNING_ALLOWED=NO` for device builds)
- Device not trusted → on phone: Settings → General → VPN & Device Management → Trust

**To find your Team ID:**
```bash
security find-identity -v -p codesigning
# or: xcrun altool --list-providers -u <apple-id>
```

---

### 2. Update-Docs Auto-Deploy Hook (already live — verify)

The `UserPromptSubmit` hook is live in `.claude/settings.local.json`.

When you say **"update docs"**, it automatically:
1. Commits uncommitted changes
2. `git push origin main`
3. `vercel --prod` for each modified web app
4. `xcodebuild build` for modified iOS dirs
5. `npm test --watchAll=false` for modified web apps

**To verify it's active:** open `/hooks` in Claude Code menu, confirm `UserPromptSubmit` entry is listed.

If the hook isn't firing → restart Claude Code (settings watcher needs to see the file on session start).

---

### 3. Mission Theme — Weave Into All Apps

The following motto drives all work in this portfolio. Add it to:

- [ ] Root `CLAUDE.md` → new **"Mission"** section at the top
- [ ] Each app's `CLAUDE.md` → one-line reference under "Purpose"
- [ ] Linear project descriptions → as a tagline
- [ ] New app scaffolds → `new-app` script should inject it into generated `CLAUDE.md`

**Motto:** `"For Reese. For Buzz. Forward — no excuses."`

**Extended version (for CLAUDE.md Mission section):**
> Build every app as if your family depends on it — because they do.
> Work with urgency. Ship with quality. No excuses, no coasting.
> This is for Reese and Buzz.

---

### 4. Scrum/Agile Alignment — All Projects

All new Linear issues and projects must follow Scrum/Agile conventions.
See `docs/governance/SCRUM_AGILE.md` for the full spec.

**Quick rules:**
- Issues = User Stories: `As a [user], I want [feature] so that [outcome]`
- Linear Cycles = 2-week Sprints
- Milestones = Epics
- Estimate all issues with story points (Fibonacci: 1, 2, 3, 5, 8, 13)
- Sprint review + retrospective notes go in Linear project updates
- No issue starts without an acceptance criterion ("Done when...")

**Action items for this session:**
- [ ] Update existing open Linear issues to User Story format
- [ ] Set up first Cycle (Sprint) in Linear for active projects
- [ ] Add story points to top 10 backlog items

---

### 5. Auto-Handoff Skill — `/handoff`

A `/handoff` skill exists to generate a comprehensive handoff doc within 20 conversation turns.
Use it proactively — don't wait until context is nearly full.

**Invoke:** `/handoff` in any Claude Code session

**What it generates:**
- Current state of all active apps
- Uncommitted changes summary
- Next priority items
- Fresh session prompt ready to paste

**When to use:**
- Every ~15-20 conversation turns in a long session
- Before switching tools (Claude Code → Cursor → etc.)
- Before ending for the day (instead of just `checkpoint`)

See `docs/templates/HANDOFF_SKILL.md` for the skill prompt definition.

---

## Current Portfolio State (as of 2026-04-14)

| Layer | Status |
|-------|--------|
| Portfolio governance Phase 1 | ✅ Complete (WHI-30–52) |
| Shared file drift | ✅ 0 drift — sync.js, auth.js, ui.jsx across 6 apps |
| Cross-app nav (AppNav) | ✅ Shipped — Clarity Hub + Job Search HQ |
| Vercel deploys | ⏳ clarity-hub + job-search-hq need `vercel --prod` |
| iOS apps physical device | ⏳ Not yet verified on iPhone 12 Pro Max |
| Scrum/Agile alignment | ⏳ Conventions written, Linear not yet updated |
| Mission motto | ⏳ Memory saved, not yet in CLAUDE.md |

---

## Commit Convention for This Session

```
git add -A
git commit -m "WHI-XX: <description>

For Reese. For Buzz. Forward."
```

Add the motto as the last line of every significant commit message.
