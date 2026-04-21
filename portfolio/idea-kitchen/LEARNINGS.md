# Learnings — Idea Kitchen

Mistakes, fixes, and "aha" moments. Read at session start; append after anything surprising.

---

## 2026-04-21 — Created Idea Kitchen

**What happened:** Built Idea Kitchen as a portfolio app rather than a loose `docs/` folder in the repo root. The decision came after 4 rounds of plan iteration.

**Why it matters:** Making it a portfolio app means it follows the same conventions it teaches (dogfood), shows up in Shipyard automatically, and can be edited by Claude Code like any other app. The alternative (a `docs/` blob) would have had no HANDOFF, no CHANGELOG, no LEARNINGS — meaning the system that teaches those practices would itself violate them.

**Rule:** When a tool or system teaches a convention, the tool itself must follow the convention. Otherwise the convention isn't real, it's aspirational.

---

## 2026-04-21 — Prompt vs. pasteable-message

**What happened:** First draft had the whole workflow collapsed into one giant paste-able prompt. Revised to split it into 6 markdown artifacts + 1 kickoff prompt.

**Why it matters:** A single giant prompt evaporates on context compaction. Six markdown files survive, can be re-read by Claude Code, and can be edited without re-running the Project. It also maps cleanly to the existing 6-phase framework — no new concepts.

**Rule:** Artifacts beat pasteable prompts. If information needs to survive a session, it belongs in a file, not a message.

---

## 2026-04-21 — Branding phase placement (2.5 between PRD and UX)

**What happened:** Considered putting naming/branding at Phase 1 (start) or Phase 3 (alongside UX). Landed on Phase 2.5.

**Why it matters:** At Phase 1, you don't yet know what the product is, so the name is a guess. At Phase 3, UX work starts using brand language (button copy, empty-state tone), so brand needs to exist before then. Phase 2.5 — after the PRD, before UX — gives the designer enough context to propose names that fit and leaves time for UX to use the brand.

**Rule:** Brand decisions need PRD context and must be locked before UX starts. 2.5 is the right slot.

---

## 2026-04-21 — Identity via Project Knowledge, not embedded prompt text

**What happened:** Considered baking voice rules and CliftonStrengths into the prompt itself. Chose to reference via Project Knowledge uploads instead.

**Why it matters:** Prompt text is static and rots. Project Knowledge files are editable in place — when `identity/voice-brief.md` changes, every future session picks it up automatically. No prompt edit needed.

**Rule:** Static context (identity, framework, portfolio conventions) belongs in Project Knowledge, not prompt text. The prompt references files by name.
