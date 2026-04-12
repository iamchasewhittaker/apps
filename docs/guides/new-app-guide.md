# How to Start a New Portfolio App

> One command scaffolds everything. No repeated decisions. No blank-page problem.

---

## Step 1 — Run the script

From anywhere in the monorepo:

```bash
new-app
```

That's it. It will ask you three questions.

---

## Step 2 — Answer the prompts

**Question 1: App name**

Use kebab-case. This becomes the folder name, storage key, and display title.

```
What's the app name? (kebab-case, e.g. habit-tracker)
> habit-tracker
```

**Question 2: One-line description**

One sentence. What does this app do?

```
One-line description:
> Track daily habits with streaks and reminders
```

**Question 3: Tech stack**

```
Which tech stack?

  1) react   — React CRA + localStorage + inline styles + Vercel
               Best for: web tools, dashboards, data viewers, PWAs
               Examples: Wellness Tracker, Job Search HQ, Knowledge Base

  2) swift   — SwiftUI + SwiftData + Xcode project
               Best for: native iOS apps, offline-first mobile, App Store
               Examples: RollerTask Tycoon, YNAB Clarity

  3) python  — Python CLI + argparse + pytest
               Best for: automation scripts, API integrations, CLI tools
               Examples: Spend Clarity

Pick [1/2/3]: 1
```

**How to choose:**

| If you need... | Pick |
|---|---|
| A web app, dashboard, or tool you can open in a browser | React |
| A native iPhone/iPad app | Swift |
| A script that runs in Terminal, talks to APIs, or processes data | Python |

---

## Step 3 — Read the output

The script prints exactly what it created and a checklist:

```
Done! Created portfolio/habit-tracker/ (React CRA)

  Code
  src/App.jsx              Main component
  src/constants.js         Storage helpers + styles
  ...

  Docs (fill these out before coding)
  docs/PRODUCT_BRIEF.md    Phase 1: What is this app?
  docs/PRD.md              Phase 2: What does it do?
  docs/APP_FLOW.md         Phase 3: How does it flow?

═══════════════════════════════════════════════════
  MVP Checklist — Product Build Framework
═══════════════════════════════════════════════════

  No coding until steps 1-3 are done.

  [ ] 1. Product Brief (docs/PRODUCT_BRIEF.md)
  [ ] 2. PRD (docs/PRD.md)
  [ ] 3. App Flow (docs/APP_FLOW.md)
  [ ] 4. Build V1
  [ ] 5. Ship + learn
```

---

## Step 4 — Fill out the Phase 1-3 docs

> **Do not write any code yet.** This is the most important rule.

Open Claude Code (or any editor) in the new app folder and fill out the three docs:

### docs/PRODUCT_BRIEF.md — Phase 1 (~10 minutes)

Answer these five questions in plain sentences:

```
App summary:    "This app helps Chase track daily habits so he doesn't lose streaks."
Target user:    Chase (solo, personal use)
Main pain point: Forgetting which habits he's done each day
Core value:     One-tap check-in, visible streak counter
V1 scope:
  - List of habits (fixed set to start)
  - Daily check-in (tap to mark done)
  - Streak counter per habit
  - Persists across sessions
```

**You know Phase 1 is done when:** you can explain the app in one sentence and name exactly what V1 does and does NOT do.

### docs/PRD.md — Phase 2 (~15 minutes)

Turn your brief into a feature list:

```
Problem: No single place to track daily habits with streaks.

Users: Chase (personal use only)

User stories:
- As a user, I want to see all my habits on one screen
- As a user, I want to check off a habit with one tap
- As a user, I want to see my current streak for each habit

V1 features:
- Hard-coded list of 5 habits (no add/edit in V1)
- Tap to mark done for today
- Streak counter (days in a row)
- Resets at midnight
- Persists in localStorage

Not in V1:
- Adding custom habits
- Reminders / notifications
- History chart
- Categories

Success metrics:
- Can check in for the day in under 10 seconds
- Streak survives a browser refresh
```

**You know Phase 2 is done when:** someone else could read it and know exactly what to build — and exactly what NOT to build.

### docs/APP_FLOW.md — Phase 3 (~10 minutes)

Map the experience:

```
First screen: Habit list with today's check-ins
Main action: Tap a habit to mark it done for today

Primary flow:
  1. Open app → see list of habits
  2. Tap a habit → it marks as done, streak increments
  3. All habits done → all show checkmarks

Screens:
- Habit list (only screen in V1)

Empty states:
- Habit list: "Nothing checked off today. Start your streak!"

Error states:
- Storage write fails: changes still visible in UI, silently retries on next action
```

**You know Phase 3 is done when:** you can draw the app on a napkin from memory.

---

## Step 5 — Start a Claude Code session and build

Once Phase 1-3 docs are filled out, start a new session:

**React:**
```bash
cd portfolio/habit-tracker
npm install
npm start
```

**Swift:** Open the folder in Xcode (double-click the `.xcodeproj` file).

**Python:**
```bash
cd portfolio/habit-tracker
pip install -r requirements.txt
python src/main.py --dry-run
```

Then paste this into the Claude Code chat:

> I'm starting work on Habit Tracker. It lives at `portfolio/habit-tracker/` in my apps monorepo (`~/Developer/chase`). Read `CLAUDE.md`, `ROADMAP.md`, `HANDOFF.md`, and the `docs/` folder. Phase 1-3 are filled out. Help me build V1.

Claude reads the docs you filled out and builds exactly what you defined — nothing more.

---

## Quick mode (skip the prompts)

If you already know what you want:

```bash
new-app habit-tracker "Track daily habits with streaks" --type react
new-app my-ios-app "Native iOS workout tracker" --type swift
new-app data-pipeline "Enrich YNAB transactions from Gmail" --type python
```

---

## What the script does automatically

You never have to think about these again:

| Task | What happens |
|---|---|
| Storage key | Auto-set to `chase_{app_name}_v1` |
| Folder structure | Created to match portfolio conventions |
| Phase 1-3 doc stubs | Generated with prompts pre-filled |
| CI workflow | App added to `portfolio-web-build.yml` (React only) |
| Portfolio table | Row added to root `CLAUDE.md` |
| Cursor symlink | `.cursor/rules/session-handoff.mdc` wired up |
| Session docs | `CLAUDE.md`, `ROADMAP.md`, `HANDOFF.md`, `CHANGELOG.md`, `LEARNINGS.md` |

---

## The rule: no coding before Phase 3

From `PRODUCT_BUILD_FRAMEWORK.md`:

> No coding starts until Phases 1–3 are documented.

If you skip the docs, you will overbuild. The three docs take ~30 minutes total and save hours of rework.
