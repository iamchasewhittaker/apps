# AI Dev Mastery

Personal learning course. Single-file React app covering 13 tracks
and 68+ modules across Claude Code, Cursor, Project Management,
AI Fundamentals, Prompt Engineering, Zapier, Sunsama & Linear,
Claude Cowork, Figma, NotebookLM, Career & Job Search, and GMAT Focus.

---

## Folder structure

```
ai-dev-mastery/
├── CLAUDE.md        ← Claude Code reads this automatically every session
├── README.md        ← this file
├── CHANGELOG.md     ← log of every change made to the course
├── ROADMAP.md       ← planned features and future content
├── src/
│   └── App.jsx      ← the entire course (curriculum data + React component)
└── versions/        ← manual snapshots before big edits
```

---

## Viewing the course

**Easiest — open in Claude.ai:**
1. Go to claude.ai
2. Start a new conversation
3. Upload `src/App.jsx`
4. Ask Claude to render it as an artifact

**Local dev (optional):**
```bash
npx create-react-app temp-runner
cd temp-runner
cp ~/Developer/chase/projects/ai-dev-mastery/src/App.jsx src/App.js
npm start
```

---

## Editing the course

### Quick changes (add a module, fix content, tweak UI)
1. Upload `src/App.jsx` to your Claude Project on claude.ai
2. Ask Claude to make the change (use prompts from CLAUDE.md)
3. Download the updated file
4. Save back to `src/App.jsx`
5. Update `CHANGELOG.md` with what changed
6. `git add . && git commit -m "describe what changed"`

### Ongoing development (new tracks, multiple edits)
```bash
cd ~/Developer/chase/projects/ai-dev-mastery
claude
```
Claude Code reads `CLAUDE.md` automatically — full context from the start.
It will also update `CHANGELOG.md` and `ROADMAP.md` as part of each session.

---

## Changelog

See `CHANGELOG.md` for the full version history.

Quick summary of current version:
- **v1.0** (2026-03-24) — Initial build, 13 tracks, 68+ modules, quizzes,
  bookmarks, notes, study plan generator, senior dev tips, GMAT connections

---

## Roadmap

See `ROADMAP.md` for the full planned feature list.

Top of the queue:
- MCP Servers Deep Dive module (Claude Code track)
- Claude in Chrome module (Cowork track)
- Dark/light mode toggle
- Search bar across all modules

---

## Before any big edit — snapshot first

```bash
cp src/App.jsx versions/App-$(date +%Y%m%d).jsx
git add . && git commit -m "snapshot before [what you're changing]"
```

---

## Git workflow

```bash
# After every edit
git add .
git commit -m "add [what] to [where]"

# Push to GitHub (if set up)
git push
```

---

## Track reference

| # | Track | Color | Modules |
|---|-------|-------|---------|
| 1 | Claude Code | #E8A87C | 6 |
| 2 | Cursor | #7EC8C8 | 5 |
| 3 | Project Management | #B8A9E8 | 5 |
| 4 | AI Fundamentals | #82C9A0 | 7 |
| 5 | Prompt Engineering | #C792EA | 5 |
| 6 | Zapier & Automations | #FF8C69 | 6 |
| 7 | Sunsama & Linear | #F9C74F | 5 |
| 8 | Claude Cowork | #D4A5F5 | 6 |
| 9 | Figma | #FF7262 | 5 |
| 10 | NotebookLM | #A8C8F8 | 5 |
| 11 | Career & Job Search | #F4A9C0 | 5 |
| 12 | GMAT Focus | #F4D06F | 5 |

---

## Claude Project system prompt

Paste this into your Claude Project instructions on claude.ai for
context-aware editing without re-explaining the structure every time:

```
You are the maintainer of a React JSX single-file course app called
"AI Dev Mastery" (App.jsx, ~155kb). 13 tracks, 68+ modules.

Structure:
- Top: curriculum array (all course content)
- Bottom: React component (UI logic — touch only when asked)

Module shape:
{ title, duration, type ('Concept'|'Hands-on'|'Advanced'),
  content: { summary, points[5], code?, tip,
             devTip?: { label, insight, antipattern },
             gmatConnection?: { skill, insight, example },
             quiz[]: { q, options[4], answer (0-indexed) } } }

Rules:
- Surgical edits only — never reformat the whole file
- New tracks go BEFORE the GMAT track (always last)
- New modules go at end of their track unless told otherwise
- Never rename track IDs
- After any edit: note what changed for CHANGELOG.md
- Output: under 20 lines → replacement block. Over 20 → full file.
```

---

## Quick-use prompts

| What you want | Say this |
|---|---|
| Add a track | `Add a new track on [topic]. Propose 5 modules with full content.` |
| Add a module | `Add a module called "[title]" to the [track] track. Type: [Concept/Hands-on/Advanced].` |
| Add a dev tip | `Add a devTip to the "[module]" module. Topic: [what to cover].` |
| Edit content | `In the "[module]" module, change [field] to: [new value].` |
| Fix a bug | `The [behavior] is broken. Fix the minimal component code needed.` |
| Update roadmap | `Move "[item]" from planned to completed in ROADMAP.md.` |
| Audit | `List all tracks, module counts, and flag any modules missing quiz questions.` |
