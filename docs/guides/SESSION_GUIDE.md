# How to Work on an App — Session Guide

> Plain English. No jargon. Refer back to this any time.
> Last updated: 2026-04-11

---

## New Project or Idea? Start Here First

> If you're working on an **existing app**, skip to "The 9 Steps" below.
> If you have a **new idea or new app**, read this section first.

---

### The Golden Rule

**No coding until you've answered 3 questions in writing:**
1. What is this? (one sentence)
2. Who is it for and what problem does it solve?
3. What does V1 look like — and what's NOT in V1?

If you skip this, you'll build the wrong thing, or build too much, and waste days. This isn't bureaucracy — it's protection.

---

### Phase 1 — Define the idea (do this yourself, 10 minutes)

Before opening any AI tool, answer these 5 questions. Write them down anywhere — Notes app, paper, doesn't matter.

```
App summary:    This app helps ___ do ___.
Target user:    Who specifically? (be specific — "me" is fine)
Pain point:     What's failing for them today?
Core value:     What does this do better than the current solution?
V1 scope:       What's the smallest useful version? (3–5 bullet points max)
```

**Example — a real filled-in version:**
```
App summary:    This app helps Chase see what he actually spent on Amazon each month.
Target user:    Me — I use YNAB but transactions just say "AMAZON" with no detail.
Pain point:     I have no idea what I bought. I can't cut spending I can't see.
Core value:     Pulls item names from receipt emails and puts them in the YNAB memo.
V1 scope:
  - Parse Amazon receipt emails from Gmail
  - Match to YNAB transactions by amount + date
  - Write item name into the memo field
  - Dry-run mode (preview before writing)
```

**Why this matters:** If you can't fill this in, the idea isn't ready yet. Keep it in your notes and come back when it's clearer.

---

### Phase 2 — Write the PRD (with AI help, 20 minutes)

A PRD (Product Requirements Doc) turns your idea into a buildable plan. You do this WITH the AI — not in code, just in words.

**What to tell the AI:**
```
I have a new app idea. Help me write a simple PRD.
Here's what I know so far: [paste your Phase 1 answers]
Ask me questions until we have: problem, users, user stories, 
V1 features, what's NOT in V1, and how we'll know it worked.
```

**What comes out:** A short document that answers:
- What problem are we solving?
- Who is this for?
- What can the user DO in V1? (user stories: "As a user, I want to...")
- What is explicitly NOT in V1? (this list is just as important)
- How do we know V1 succeeded?

**Example "Not in V1" list:**
```
Not in V1:
- No web UI
- No automatic scheduling (run manually only)
- No Apple or Privacy.com parsing yet (Amazon only)
- No category assignment
```
Cutting scope on paper is free. Cutting it after you've coded it costs days.

---

### Phase 3 — Map the UX flow (with AI help, 15 minutes)

Before any code, map out what the user actually experiences. Even for a CLI tool, this matters.

**What to tell the AI:**
```
Now help me map the UX flow. 
What's the first thing the user sees/does?
What's the main action?
What happens when it works? What happens when it fails?
What does an empty state look like?
```

**For a visual app (iOS, web), answer:**
- What is the first screen?
- What does the user tap first?
- How many taps to complete the main action?
- What shows when there's no data?
- What shows when something goes wrong?

**For a CLI tool (like Spend Clarity), answer:**
- What does the user type to run it?
- What does a successful run look like in the terminal?
- What does an error look like? Is it clear what to do?
- What's the dry-run output vs. the live output?

---

### Phase 4+ — Architecture, milestones, and coding

Only after Phases 1–3 are written down do you move to:
- **Phase 4** — How will it be built? (tech stack, folder structure)
- **Phase 5** — Break it into milestones (never "build the app" — always "build milestone 1")
- **Phase 6** — Ship, then learn

See `PRODUCT_BUILD_FRAMEWORK.md` at the repo root for full details on Phases 4–6.

---

### Setting up the new project folder

Once you're ready to code (Phases 1–3 done), tell the AI to scaffold the project:

```
I'm ready to start coding. 
App name: [name]
Folder: portfolio/[app-folder-name]
Stack: [iOS SwiftUI / React web / Python CLI]

Please:
1. Create the portfolio/[app-folder-name]/ folder
2. Create CLAUDE.md, HANDOFF.md, LEARNINGS.md, CHANGELOG.md, ROADMAP.md
3. Add the app to the master CLAUDE.md portfolio table
4. Create the .cursor/rules/ symlink for Cursor
5. Add a row to the root ROADMAP.md change log
```

**What gets created automatically:**

| File | What it's for |
|------|--------------|
| `CLAUDE.md` | Rules and conventions for this app |
| `HANDOFF.md` | Session state — where you left off |
| `LEARNINGS.md` | Mistakes and lessons (starts empty) |
| `CHANGELOG.md` | History of every change |
| `ROADMAP.md` | What's planned and what's done |
| `.cursor/rules/` symlink | So Cursor auto-loads handoff rules |

---

### New project checklist

```
Before touching any code:
[ ] Phase 1 written — app summary, user, pain point, V1 scope
[ ] Phase 2 written — PRD with features + explicit cut list
[ ] Phase 3 written — UX flow, screens, empty states

Setting up:
[ ] checkpoint (always first)
[ ] Folder created under portfolio/
[ ] All 5 docs created (CLAUDE.md, HANDOFF.md, LEARNINGS.md, CHANGELOG.md, ROADMAP.md)
[ ] Added to master CLAUDE.md portfolio table
[ ] Cursor symlink created
[ ] Root ROADMAP.md updated

Then use the normal 9-step session flow for all coding sessions.
```

---

### New project vs. existing app — at a glance

| Situation | What to do |
|-----------|-----------|
| Brand new idea, haven't thought it through | Do Phase 1 yourself (10 min, no AI needed) |
| Have a clear idea, need to flesh it out | Phases 1–3 with AI help before any code |
| Ready to build, need the folder set up | Ask AI to scaffold the project folder |
| Project exists, adding a feature | Use the normal 9-step session flow |
| Project exists, fixing a bug | Use the normal 9-step session flow |

---

## The 9 Steps at a Glance

| # | Step | When |
|---|------|------|
| 1 | Run `checkpoint` | Before you touch anything |
| 2 | Paste the template | When you open your AI tool |
| 3 | Say "Read CLAUDE.md and HANDOFF.md first" | Right after pasting |
| 4 | AI reads LEARNINGS.md | Happens automatically |
| 5 | CHANGELOG.md updated | End of session (automatic) |
| 6 | ROADMAP.md updated | End of session (automatic) |
| 7 | Root ROADMAP.md updated | End of session (automatic) |
| 8 | HANDOFF.md updated | End of session (automatic) |
| 9 | Final `checkpoint` | End of session (automatic or you) |

Steps 1–3 are **yours to do**. Steps 4–9 happen **automatically**.

---

## Step 1 — Run `checkpoint` before you start

### What to do
Open Terminal and type:
```bash
checkpoint
```
Or with a note:
```bash
checkpoint "starting work on spending chart"
```

### What it does
- Saves a snapshot of every file in the repo right now
- Creates a named save point in git with a timestamp
- Takes about 2 seconds

### Why it matters
- If you break something, you can get back to this exact moment
- Xcode's undo button doesn't work after you close a file — git does
- Without this, broken code = start over. With it, broken code = 2-second fix

### Example
```
You open Xcode, accidentally delete the wrong function, save the file.
Undo doesn't work. Panic.

→ Without checkpoint: you're rewriting from memory or an old version
→ With checkpoint: run `restore 1` and it's back in 5 seconds
```

### When to run it
- Before opening Xcode
- Before starting an AI session
- Any time you're about to make a big change
- When something is working and you want to freeze that moment

---

## Step 2 — Paste the template

### What to do
1. Open your AI tool (Claude Code, Cursor, Antigravity, Codex)
2. Go to `docs/templates/` in the repo
3. Open the right template file (see below)
4. Fill in the blank fields
5. Paste it as your first message

### Which template to use

| Situation | Template |
|-----------|----------|
| Working on ONE app | `docs/templates/SESSION_START_APP_CHANGE.md` |
| Cross-app changes or big repo work | `docs/templates/SESSION_START_MONOREPO.md` |

### The fields and what to write

**App** — the folder path of the app you're working on
```
App: portfolio/ynab-clarity-ios
```

**Goal** — one sentence. What are you trying to build or fix?
```
Goal: Add a spending chart to the Overview tab
```
Keep it tight. Vague goals = the AI does things you didn't ask for.

**Done when** — how will you know it's finished?
```
Done when: Chart shows last 30 days of spending, tapping a bar shows the category breakdown
```
This is the finish line. Without it, the AI keeps going.

**Not in scope** — what should the AI NOT touch?
```
Not in scope: Bills tab, Income tab, any existing navigation
```
This is your guardrail. AI tools are eager — they'll "improve" things you didn't ask about if you don't block them.

**Constraints** — house rules for this session
```
Constraints: Keep dark theme, no new Swift packages, keep file under 400 lines
```

### Filled-in example
```
App: portfolio/ynab-clarity-ios
Goal: Add a monthly spending chart to the Overview tab
Done when: Bar chart shows last 6 months, each bar is color-coded by top category
Not in scope: Bills tab, Income tab, Settings
Constraints: Dark theme only, no new dependencies, SwiftUI only
```

---

## Step 3 — Say "Read CLAUDE.md and HANDOFF.md first"

### What to do
After pasting the template, add this line:
```
Read CLAUDE.md and HANDOFF.md first.
```

### What the AI reads

| File | What it contains | Why the AI needs it |
|------|-----------------|---------------------|
| Root `CLAUDE.md` | Rules for the whole portfolio | "Never add TypeScript" · "Use this storage pattern" |
| App `CLAUDE.md` | Rules for this specific app | Swift conventions · what keys to use · gotchas |
| `HANDOFF.md` | Where you left off | Current branch · what was done last · next steps |
| App `LEARNINGS.md` | Past mistakes | Things that broke before so they don't break again |

### Why it matters
Without this, the AI starts from scratch every session. It might:
- Change something you already decided not to change
- Use the wrong storage key and wipe your data
- Break a convention that took 3 sessions to establish

With this, it's fully caught up before writing a single line.

### Analogy
It's like briefing a surgeon before an operation. You want them reading the patient chart, not guessing.

---

## Step 4 — AI reads LEARNINGS.md (automatic)

### What happens
The AI opens `LEARNINGS.md` in the app folder and reads it before doing anything.

### What's in LEARNINGS.md
A running log of mistakes, fixes, and "aha" moments from past sessions.

Example entry:
```
### 2026-04-11 — Code lost after accidental Xcode deletion
What happened: Deleted code in Xcode, no recent commit, lost the work.
Root cause: No checkpoint before editing. Xcode undo doesn't survive file close.
Fix / lesson: Always run `checkpoint` before opening Xcode.
Tags: data-loss, xcode, git
```

### Why it matters
- The AI won't repeat a mistake that's already been logged
- You won't pay for the same lesson twice
- Over time it becomes a map of every trap in the project

### What you do
Nothing — it's automatic. But you can add entries yourself any time:
```
### 2026-04-15 — Simulator showed old UI after code change
What happened: Changed a SwiftUI view but the Simulator kept showing the old version.
Root cause: Simulator cache wasn't cleared.
Fix / lesson: Product → Clean Build Folder (Shift+Cmd+K) then re-run.
Tags: xcode, gotcha
```

---

## Step 5 — CHANGELOG.md updated (automatic)

### What happens
The AI adds an entry to the app's `CHANGELOG.md` under `## [Unreleased]`.

### What it looks like
```markdown
## [Unreleased]

### Added
- Monthly spending bar chart on Overview tab (last 6 months, color-coded by category)

### Fixed
- (nothing this session)
```

### Why it matters
- Three months from now you'll forget what you built and when
- If something breaks in a future session, you can trace it back to the exact change
- Looks professional if you ever share the project

### What you do
Nothing — automatic. But you can read it any time to see the history of an app.

---

## Step 6 — App ROADMAP.md updated (automatic)

### What happens
The AI updates the roadmap for the specific app you worked on:
- Checks off what just got completed
- Adds any new ideas that came up during the session
- Re-prioritizes if something changed

### What it looks like (before)
```markdown
## Planned
- [ ] Add spending chart to Overview
- [ ] Add budget vs actual comparison
```

### What it looks like (after)
```markdown
## Completed
- [x] Add spending chart to Overview ← checked off

## Planned
- [ ] Add budget vs actual comparison
- [ ] Add drill-down by merchant within chart ← new idea added
```

### Why it matters
- Your to-do list stays accurate without you maintaining it
- New ideas don't get lost — they get captured while they're fresh
- You always know what's done and what's next for each app

---

## Step 7 — Root ROADMAP.md updated (automatic)

### What happens
A new row gets added to the master Change Log table at the repo root (`/ROADMAP.md`).

### What it looks like
```
| 2026-04-15 | YNAB Clarity (iOS) | v0.1 | Added 6-month spending chart on Overview tab | SwiftUI Charts |
```

### Why it matters
- You have 7 apps — this is the bird's-eye view of ALL of them
- One place to see the whole story: what was built, when, and why
- Useful when switching between apps — you can see what changed across the portfolio at a glance

---

## Step 8 — HANDOFF.md updated (automatic)

### What happens
The State table in `HANDOFF.md` gets updated:
- **Focus** → what was just worked on
- **Next** → what the next steps are
- **Last touch** → today's date

### What it looks like
```markdown
| Focus     | YNAB Clarity (iOS) — added spending chart to Overview |
| Next      | 1) Test on device · 2) Add drill-down by category |
| Last touch| 2026-04-15 |
```

### Why it matters
This is your sticky note between sessions. Next time you (or an AI tool) opens this project, reading HANDOFF.md takes 30 seconds and you're fully caught up — no hunting through old conversations.

### The difference it makes
```
Without HANDOFF.md:
"What was I doing? Where did I leave off? Was that bug fixed? 
What branch am I on? Did I finish that feature?"
→ 20 minutes of re-orientation

With HANDOFF.md:
"Focus: spending chart. Next: test on device."
→ 30 seconds
```

---

## Step 9 — Final `checkpoint` (automatic or you)

### What happens
Everything gets saved to git with a clear message.

### What the commit looks like
```
checkpoint (ynab-clarity-ios): add spending chart to Overview tab [2026-04-15 14:32]
```

### Why it matters
- The finished work is now saved permanently
- If something breaks tomorrow, you can restore to this exact working state
- It's your proof of work — the git history shows everything you built and when

### If the AI doesn't do it automatically
Run it yourself:
```bash
checkpoint "finished spending chart"
```

---

## Quick Reference Card

### Starting a session
```
1. checkpoint
2. Open AI tool → paste SESSION_START_APP_CHANGE.md template (filled in)
3. Say: "Read CLAUDE.md and HANDOFF.md first"
```

### Filling in the template
```
App:          portfolio/[app-folder]
Goal:         [one sentence — what are you building?]
Done when:    [how will you know it's done?]
Not in scope: [what should the AI NOT touch?]
Constraints:  [any house rules for this session?]
```

### If something breaks mid-session
```
restore              ← shows your save points
restore 3            ← goes back to save #3
restore 2            ← undoes a restore
```

### End of session (if AI doesn't do it)
```
checkpoint "what you built"
```

---

## File Locations

| File | Where it lives | What it's for |
|------|---------------|---------------|
| This guide | `docs/guides/SESSION_GUIDE.md` | How sessions work |
| App change template | `docs/templates/SESSION_START_APP_CHANGE.md` | Paste at session start (one app) |
| Monorepo template | `docs/templates/SESSION_START_MONOREPO.md` | Paste at session start (cross-app) |
| Master rules | `CLAUDE.md` | Rules for the whole portfolio |
| Session state | `HANDOFF.md` | Where you left off |
| App rules | `portfolio/[app]/CLAUDE.md` | Rules for one specific app |
| App lessons | `portfolio/[app]/LEARNINGS.md` | Mistakes and fixes per app |
| App changelog | `portfolio/[app]/CHANGELOG.md` | History of changes |
| App roadmap | `portfolio/[app]/ROADMAP.md` | What's done and what's next |
