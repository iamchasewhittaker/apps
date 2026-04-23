# SESSION_START — AI Dev Mastery Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — AI Dev Mastery is a stable v1.0.1 course app.
**App:** AI Dev Mastery
**Slug:** ai-dev-mastery
**One-liner:** 13-track, 68-module React course on AI-assisted development — a self-paced curriculum built and used by Chase to accelerate his own AI coding skills.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The course is content-complete; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/ai-dev-mastery`
2. **BRANDING.md** — course / mastery aesthetic, structured learning palette
3. **PRODUCT_BRIEF.md** — distill from context below; note "built for Chase, used by Chase" framing
4. **PRD.md** — reflect v1.0.1 shipped scope (13 tracks, 68+ modules); V2 = deploy + interactive exercises
5. **APP_FLOW.md** — document the track selection → module list → lesson view flow
6. **SESSION_START_ai-dev-mastery.md** — stub only

Output paths: `portfolio/ai-dev-mastery/docs/`

---

## App context — CLAUDE.md

**Version:** v1.0.1
**Stack:** React CRA — single-file `src/App.jsx` (2,667 lines; curriculum + React UI)
**Storage:** none (no persistence — progress not tracked)
**URL:** local only

**What this app is:**
A self-paced course on AI-assisted software development. 13 tracks organized by topic (prompting, Claude Code, architecture, debugging, etc.), each with multiple modules. The curriculum is embedded directly in `App.jsx` as structured data. Chase built and uses this to systematically level up his AI dev skills.

**13 tracks include:**
- Foundations of AI-Assisted Dev
- Prompt Engineering for Code
- Claude Code CLI
- React + AI Patterns
- Architecture with AI
- Debugging with AI
- Shipping with AI
- Testing with AI
- Security with AI
- Performance with AI
- Documentation with AI
- Team workflows
- Advanced patterns

**Architecture:**
- Single-file monolith: `App.jsx` owns the full curriculum structure + UI
- No localStorage, no Supabase — stateless (no progress tracking in v1)
- No auth gate
- Built as a reference tool, not a product for others

**Brand system:**
- Course / mastery aesthetic — structured, clear, progress-oriented
- Dark background, track color-coding per domain
- Voice: direct and instructional — "here is the skill, here is the exercise"

---

## App context — HANDOFF.md

**Version:** v1.0.1
**Focus:** Content-complete. Used locally as a reference curriculum.
**Last touch:** 2026-04-21

**Next (V2 candidates):**
- Add progress tracking (mark modules complete, persist in localStorage)
- Deploy to Vercel for use on mobile
- Add interactive exercises (prompt templates, code challenges)
- Consider open-sourcing as a portfolio artifact
