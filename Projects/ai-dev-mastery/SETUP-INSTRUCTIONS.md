# AI Dev Mastery — Setup Instructions for Claude Code

## What to do

Download all 6 files from Claude, put them in the same folder
(Downloads works fine), then open Claude Code and paste the
prompt below.

---

## Files you should have

1. ai-dev-course.jsx   — the course app
2. CLAUDE.md           — Claude Code instructions
3. README.md           — project reference
4. CHANGELOG.md        — version history
5. ROADMAP.md          — planned features
6. SETUP-INSTRUCTIONS.md — this file

---

## Prompt to paste into Claude Code

```
I have these files in my current folder:
- ai-dev-course.jsx
- CLAUDE.md
- README.md
- CHANGELOG.md
- ROADMAP.md

Please set up my project by doing the following:

1. Create this folder structure:
   ~/Documents/Projects/ai-dev-mastery/
   ~/Documents/Projects/ai-dev-mastery/src/
   ~/Documents/Projects/ai-dev-mastery/versions/

2. Copy files to their correct locations:
   ai-dev-course.jsx  →  ~/Documents/Projects/ai-dev-mastery/src/App.jsx
   CLAUDE.md          →  ~/Documents/Projects/ai-dev-mastery/CLAUDE.md
   README.md          →  ~/Documents/Projects/ai-dev-mastery/README.md
   CHANGELOG.md       →  ~/Documents/Projects/ai-dev-mastery/CHANGELOG.md
   ROADMAP.md         →  ~/Documents/Projects/ai-dev-mastery/ROADMAP.md

3. Create an empty placeholder:
   ~/Documents/Projects/ai-dev-mastery/versions/.gitkeep

4. Initialize Git and make the first commit:
   cd ~/Documents/Projects/ai-dev-mastery
   git init
   git add .
   git commit -m "v1.0 — initial course, 13 tracks, 68+ modules"

5. Show me the final folder structure so I can confirm everything looks right.
```

---

## After setup — how to use the project

**Open the course for editing:**
```
cd ~/Documents/Projects/ai-dev-mastery
claude
```
Claude Code reads CLAUDE.md automatically and knows the full
structure, rules, and how to update CHANGELOG.md and ROADMAP.md.

**View the course:**
Upload src/App.jsx to claude.ai as an artifact.

**Before any big edit — snapshot first:**
```
cp src/App.jsx versions/App-$(date +%Y%m%d).jsx
git add . && git commit -m "snapshot before [what you're changing]"
```

**Optional — push to GitHub:**
Tell Claude Code: "Create a private GitHub repo called
ai-dev-mastery and push this project to it."

---

## What each file does

| File | Purpose |
|------|---------|
| src/App.jsx | The entire course — curriculum + React UI |
| CLAUDE.md | Instructions Claude Code reads every session |
| README.md | Human-readable project reference |
| CHANGELOG.md | Log of every change made to the course |
| ROADMAP.md | Planned features, backlog, completed items |
| versions/ | Manual snapshots before big edits |
