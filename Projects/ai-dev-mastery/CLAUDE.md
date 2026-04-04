# AI Dev Mastery — Course Maintenance

## What this is
Single-file React JSX course app (~155kb). Curriculum data at top,
React component at bottom. 13 tracks, 68+ modules.

---

## Shape of a module (all fields required unless marked optional)
```
title          — short, title-case
duration       — e.g. "20 min"
type           — 'Concept' | 'Hands-on' | 'Advanced'
content:
  summary      — 1-2 sentences
  points[]     — exactly 5 items, use **bold** for key terms
  code?        — optional, use \n for line breaks
  tip          — 1 actionable sentence
  devTip?      — { label, insight, antipattern }
  gmatConnection? — { skill, insight, example }
  quiz[]       — 1-2 × { q, options[4], answer (0-indexed int) }
```

---

## Track order + IDs + colors
| # | ID | Title | Color |
|---|-----|-------|-------|
| 1 | claude-code | Claude Code | #E8A87C |
| 2 | claude-console | Claude Console | #A8D8EA |
| 3 | cursor | Cursor | #7EC8C8 |
| 4 | pm | Project Management | #B8A9E8 |
| 5 | ai-fundamentals | AI Fundamentals | #82C9A0 |
| 6 | prompt-engineering | Prompt Engineering | #C792EA |
| 7 | zapier | Zapier & Automations | #FF8C69 |
| 8 | daily-planning | Sunsama & Linear | #F9C74F |
| 9 | cowork | Claude Cowork | #D4A5F5 |
| 10 | figma | Figma | #FF7262 |
| 11 | notebooklm | NotebookLM | #A8C8F8 |
| 12 | career | Career & Job Search | #F4A9C0 |
| 13 | apple-shortcuts | Apple Shortcuts | #5AC8FA |
| 14 | gmat | GMAT Focus | #F4D06F |

---

## Rules for every edit
- Surgical edits only — never reformat the whole file
- New tracks go BEFORE the GMAT track (always keep GMAT last)
- New modules go at END of their track's modules[] unless told otherwise
- Never rename existing track IDs — they are referenced in component state
- **After EVERY edit, without being asked:**
  1. Update `CHANGELOG.md` — log what changed under `## [Unreleased]`
  2. Update `ROADMAP.md` — mark completed items, move new ideas to correct section
  3. Run `git add . && git commit -m "describe what changed"`

---

## Changelog instructions
After EVERY edit to App.jsx, update CHANGELOG.md:
1. Add a new entry under ## [Unreleased] using this format:
   - [Added] Brief description of what was added
   - [Changed] Brief description of what was changed
   - [Fixed] Brief description of what was fixed
   - [Removed] Brief description of what was removed
2. Include: date, what changed, which track/module affected
3. When a version is "released" (major update complete), move Unreleased
   entries under a new version heading: ## [v1.x] — YYYY-MM-DD

Example entry:
```
## [Unreleased]
- [Added] "Advanced Prompting" module to Prompt Engineering track (2026-03-24)
- [Fixed] Quiz answer index off-by-one in Figma Fundamentals module (2026-03-24)
```

---

## Roadmap instructions
ROADMAP.md tracks what's planned. Update it when:
- A roadmap item gets built → move from Planned to Completed
- A new idea comes up → add to Planned or Backlog
- Priorities shift → reorder items within sections

Format:
```
## In Progress
- [ ] Short description — target: [timeframe or "next session"]

## Planned (next 1-3 sessions)
- [ ] Short description

## Backlog (someday/maybe)
- [ ] Short description

## Completed
- [x] Short description — done: YYYY-MM-DD
```

---

## Common tasks

### Add a new track
"Add a new track on [topic]. Propose 5 modules with full content."
- Insert BEFORE gmat track
- Use a unique hex color not in the table above
- Add a row to the track table in this file
- Log in CHANGELOG.md

### Add a module
"Add a module called '[title]' to the [track] track. Type: [Concept/Hands-on/Advanced]."
- Log in CHANGELOG.md

### Edit a field
"In the '[module]' module, change [field] to: [new value]."
- Log in CHANGELOG.md

### Add a dev tip
"Add a devTip to the '[module]' module. Topic: [what to cover]."

### Fix a UI bug
"The [describe behavior] is broken. Fix the minimal component code needed."
- Log in CHANGELOG.md as [Fixed]

### Mark a roadmap item complete
"Mark '[roadmap item]' as complete in ROADMAP.md."

---

## Output format
- Change under 20 lines → show replacement block with before/after markers
- Change over 20 lines → return the full updated file
- Always confirm after edit: tracks, modules, what changed, changelog updated

---

## Do not
- Reformat the whole file
- Change component logic unless explicitly asked
- Remove existing content unless explicitly asked
- Rename any track ID
- Skip updating CHANGELOG.md after any edit
