# Changelog

All notable changes to AI Dev Mastery are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Git & Version Control track (track #14, 5 modules: Git Fundamentals, Branching & Merging, Collaborating with Pull Requests, Git with AI Tools, Advanced Git & Recovery) — inserted before GMAT track (2026-04-28)
- Portfolio-standard branding: logo SVG (`AI DEV` / `MASTERY`, orange `#f97316` accent), favicon SVG, PNG assets (512, 192, apple-touch-icon) (2026-04-28)
- Deployed to Vercel — first production deploy (2026-04-28)

### Changed
- Updated `manifest.json`: name "AI Dev Mastery", short_name "Mastery", theme/bg colors to `#0f1117` (2026-04-28)
- Updated `index.html`: title, description, theme-color, favicon.svg link, apple-touch-icon (2026-04-28)
- Updated `docs/BRANDING.md`: app palette, logo spec, Web checklist marked complete, Git track color added (2026-04-28)
- Updated CLAUDE.md track table with Git track (#14) (2026-04-28)
- Promoted from `projects/` to `portfolio/` as active portfolio app (2026-04-14)
- Added HANDOFF.md, LEARNINGS.md, docs/BRANDING.md (portfolio standard docs) (2026-04-14)
- Fixed Cursor symlink depth for portfolio/ path (2026-04-14)

- [Changed] Monorepo folder is `~/Developer/chase/projects/ai-dev-mastery/` (was `Projects/` at repo root); `README`, `SETUP-INSTRUCTIONS`, and root `launch.json` paths updated (2026-04-04)
- [Added] Apple Shortcuts track (track #13, 5 modules: What Are Apple Shortcuts?, Variables Conditionals and Loops, App Integrations and Personal Automations, Advanced Scripting — APIs Dictionaries and Regex, AI-Assisted Shortcut Creation) — inserted before GMAT track (2026-03-25)
- [Added] Claude Console track (track #2, 5 modules: What is Claude Console?, API Keys & Authentication, The Workbench: Prompt Playground, Usage/Billing/Rate Limits, Organizations & Team Access) — inserted between Claude Code and Cursor tracks (2026-03-25)
- [Added] Font scale toggle (small/medium/large) in header — persisted to localStorage (2026-03-25)
- [Added] Study streak tracking with fire emoji display in header (2026-03-25)
- [Added] Quiz history tracking — records correct/wrong answers per module (2026-03-25)
- [Added] Exercise section rendering (try-this, checklist, reflect types) with checkbox state persisted to localStorage (2026-03-25)
- [Added] Dive Deeper section rendering — supports video/docs/tool/article link types with icons (2026-03-25)
- [Added] Inline markdown link parsing in Key Points — [text](url) syntax renders as clickable anchors (2026-03-25)
- [Added] Skip-to-content accessibility link at top of page (2026-03-25)
- [Added] 31 daily spark prompts for the Study Plan — one unique prompt per day (2026-03-25)
- [Added] Themed study plan days (Tool Day, Theory Day, Build Day, Career Day) with color-coded headers (2026-03-25)
- [Added] Review injection in study plan — modules with wrong quiz answers resurface every 3rd day (2026-03-25)
- [Added] localStorage persistence for all state (completedModules, bookmarks, notes, fontScale, quizHistory, exerciseChecked, currentStreak) (2026-03-25)
- [Changed] All hardcoded font sizes replaced with dynamic `fs.*` values from fontSizes scale (2026-03-25)
- [Changed] All low-contrast colors (#44445a, #505070, #6060a0, etc.) updated to accessible equivalents (#8888a8, #9898b8, #9090c0, etc.) (2026-03-25)
- [Changed] Line heights increased to 1.75 throughout for readability (2026-03-25)
- [Changed] Header buttons now have aria-pressed attributes; sidebar items have aria-current (2026-03-25)
- [Changed] aside elements now have role and aria-label; main has id="main-content" and role="main" (2026-03-25)
- [Changed] Progress bars now have role="progressbar" with aria-valuenow/min/max/label (2026-03-25)
- [Changed] Code toggle button now has aria-expanded attribute (2026-03-25)
- [Changed] CSS updated: added focus-visible styles, prefers-reduced-motion support, dive-link/exercise-check/spark-card classes (2026-03-25)
- [Changed] generateStudyPlan rewritten with themed interleaving and review injection (2026-03-25)

---

## [v1.0.1] — 2026-03-25

### Fixed
- 6 multiline string syntax errors in `src/App.jsx` — converted regular quoted strings
  to template literals (backticks) in: CLAUDE.md code block, Project system prompt example,
  Cowork task descriptions, Scheduled task examples, Figma Make prompts, Figma MCP workflow

### Added
- CRA scaffold (package.json, public/, src/index.js, src/index.css, reportWebVitals.js)
  — app now runs with `npm start`
- `.claude/launch.json` — registered as `ai-dev-mastery` on port 3004 in portfolio launch config
- Dev server confirmed running at localhost:3004 with zero errors

---

## [v1.0] — 2026-03-24

### Added
- Initial course build — 13 tracks, 68+ modules
- Claude Code track (6 modules): What is Claude Code, Installation, Core Workflows,
  Context & Memory, Agentic Mode, Managing This Course in Claude Code
- Cursor track (5 modules): vs VS Code, Cmd+K, Chat Sidebar, Cursor Rules, Composer
- Project Management track (5 modules): Fundamentals, Agile & Scrum, AI-Powered
  Planning, Linear for Devs & PMs, Shipping & Retrospectives
- AI Fundamentals track (7 modules): How LLMs Work, Prompt Engineering Basics,
  AI Model Landscape, AI Agents & Workflows, Building with the API,
  Using Claude Effectively, AI Ethics & Limitations
- Prompt Engineering track (5 modules): System Prompts & Personas, Few-Shot
  Prompting, Chain of Thought, Structured Outputs, Building a Prompt Library
- Zapier & Automations track (6 modules): Fundamentals, Connecting AI to Tools,
  Real Workflow Recipes, YNAB + AI, Webhooks & Beyond Zapier, Automation Mindset
- Sunsama & Linear track (5 modules): Daily Planning Ritual, Sunsama Integrations,
  Linear Deep Dive, Sunsama + Linear Together, Building Your Productivity Stack
- Claude Cowork track (6 modules): What is Cowork, Your First Cowork Task,
  Sub-Agents & Parallel Workstreams, Scheduled Tasks & Dispatch,
  Computer Control & Connectors, Cowork for Knowledge Workers
- Figma track (5 modules): Fundamentals, AI Features, Figma → Claude Code via MCP,
  Design Systems & Tokens, Dev Handoff & Collaboration
- NotebookLM track (5 modules): What is NotebookLM, Building Your First Notebook,
  Audio Overviews, Research & Study Workflows, vs Claude vs ChatGPT
- Career & Job Search track (5 modules): Resume Tailoring, Interview Prep,
  LinkedIn & Cold Outreach, Cover Letters, Salary Research & Negotiation
- GMAT Focus track (5 modules): Focus Edition Overview, Quantitative Reasoning,
  Verbal Reasoning, Data Insights, Study System & Error Log
- Quiz system — 1-2 questions per module with interactive answer reveal
- Bookmarks — save any module, view all bookmarks in dedicated tab
- Notes — per-module personal notes with save/edit/delete
- Study Plan Generator — input minutes/day, generates day-by-day schedule
- Senior Dev Best Practice callouts (⚙) — 14 modules with devTip panels
- GMAT Connection callouts (∑) — 3 PM modules with GMAT bridge panels
- Track time estimates in sidebar
- Progress tracking with completion percentage
- Navigation: Previous/Next buttons, right-panel outline, module completion
