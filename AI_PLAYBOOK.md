# AI Playbook — What Works

> Prompting strategies, session management, and tool-specific notes.
> Organized by tool and technique. Updated when something works (or fails) notably.
>
> This is a living doc — session-end step 6b appends entries when an AI technique is notably effective or ineffective.

---

## Session Management

### Context window discipline
**What:** Start every Claude Code session with `checkpoint` + read `CLAUDE.md` + `HANDOFF.md`. End with the session-end ritual. New chat when context feels stale (~20 turns).
**Why it works:** Front-loading context prevents mid-session drift. The checkpoint gives a clean rollback point if the session goes sideways.
**Source:** Root CLAUDE.md auto-checkpoint rule

### Split shell work from app work
**What:** When a task involves both shell/Python tooling AND Swift/React code, do them in separate sessions.
**Why it works:** The first half burns context on downloads/file operations. The second half needs clean context for code edits. Mixing them causes drift and missed steps.
**Source:** Fairway iOS KML reimport (2026-04-25)

### Verify integrations before re-coding
**What:** Query Supabase directly (`SELECT app_key, updated_at FROM user_data WHERE app_key IN (...)`) before assuming a cross-app integration is unbuilt.
**Why it works:** Clarity Command Phase 2 was already shipped but missing `.env` locally. Direct query proved it worked and saved hours of re-coding.
**Source:** Clarity Command (2026-04-27)

---

## Claude Code

### Structured HANDOFF over long context
**What:** A 30-line HANDOFF.md with State table beats a 200-line conversation paste for session continuity.
**Why it works:** Concise, structured state is easier for both AI and humans to parse. Key fields: Focus, Next, Last touch, Blockers.
**Source:** Multi-session pattern across all apps

### Session-start template pattern
**What:** Paste a `SESSION_START_*.md` template rather than free-form explaining the goal. Templates live in `docs/templates/`.
**Why it works:** Consistent structure means consistent results. Templates encode what to read, what to check, and what to produce.
**Source:** `docs/templates/` (13 templates)

### Unified full-journey SESSION_START format
**What:** Every per-app template follows one format: Journey so far (compressed changelog) → Still needs action → State at a glance (version/URL/storage/stack) → Key files → Next actions. Single paste, self-contained.
**Why it works:** Agents spend zero time hunting context. One paste = full project history + current state + unblocked next step. No drift between multiple files.
**Limitation:** Templates get stale if not updated after major sessions. Token cost matters — keep Journey bullets short (1 line each), trim Key files to 5 max. **Need to manage tokens better** — long Journey sections can eat context before any real work happens.
**Source:** idea-kitchen/templates SESSION_START rewrite (2026-04-29)
> **Chase:** Need to manage tokens better

### "No coding before Phase 3" declaration
**What:** Tell the AI "no coding until Phases 1-3 are documented" to prevent premature implementation.
**Why it works:** Without this gate, AI tools jump to code immediately. The declaration forces requirements/design thinking first.
**Source:** PRODUCT_BUILD_FRAMEWORK.md, new-app script

### Anti-feature declaration
**What:** List what the app will NOT do: "No additional lanes. No due dates. No tags."
**Why it works:** Prevents scope creep in AI sessions. The AI reads the anti-feature list and stops suggesting additions. Especially powerful with ADHD — removes the temptation to say "ooh, what about..."
**Source:** `portfolio/unnamed-ios/CLAUDE.md`

---

## Cursor

### .mdc alwaysApply symlinks
**What:** Symlink `.cursor/rules/session-handoff.mdc` into every app so subfolder workspaces load the same rule.
**Why it works:** Opening `portfolio/app-name` as workspace root picks up the rule without duplicating the file.
**Source:** `scripts/new-app` creates the symlink automatically

---

## Prompting Techniques

### JSON-first AI output for structured editors
**What:** When generating content with multiple editable fields (STAR stories, categorizations), prompt for strict JSON shape rather than freeform text.
**Why it works:** Each field remains independently editable. Freeform output requires brittle parsing. Combine with Zod for shape validation + allowlist for semantic validation.
**Source:** `portfolio/job-search-hq/src/` — STAR drafting prompt + `AITab.jsx` parser

### OpenAI strict mode: nullable not optional
**What:** OpenAI's `response_format: json_schema` strict mode requires `.nullable()` not `.optional()` in Zod schemas.
**Why it fails with optional:** `.optional()` removes the field from the `required` array, which strict mode rejects. `.nullable()` keeps it required but allows `null`. Propagation: types change from `string | undefined` to `string | null`.
**Source:** Clarity Budget Web AI categorization (2026-04-28)

---

## What Doesn't Work

### Assuming cross-app integrations are unbuilt
**What was tried:** Re-coding Clarity Command Phase 2 cross-app data pull.
**Why it failed:** Code was already shipped — just missing `.env` file locally and Vercel project had been removed. Hours wasted before querying Supabase directly proved it worked.
**Fix:** Always query the data layer before assuming a feature needs rebuilding.
**Learned:** 2026-04-27

### localStorage for OAuth tokens
**What was tried:** Storing YNAB/Gmail refresh tokens in `localStorage` alongside app data.
**Why it failed:** Blob round-trips through localStorage → Supabase daily. Tokens become visible to XSS, backed up alongside non-sensitive data. Migration to server-side encrypted storage required banner + dual-path fallback.
**Fix:** Use separate Supabase row with server-side encryption from day one.
**Learned:** 2026-04-28

---

## Context Window Management

### Compact early, compact often
**What:** Don't wait for the system to auto-compact at ~20 turns. If you're done with exploration and starting implementation, that's a natural compaction point. Run `/handoff` to capture state, then start a fresh chat.
**Why it works:** The first 10 turns of exploration burn context on file reads and grep results that aren't needed during implementation. A fresh window with a clean handoff gives the model full capacity for code generation.
**Source:** Multi-session pattern (2026-04-29)

### Front-load constraints, not context
**What:** Instead of pasting 200 lines of background, paste 10 lines of constraints: what the app does NOT do, what stack to use, what files to touch. Let the AI read CLAUDE.md for the rest.
**Why it works:** Constraints are cheaper than context. "No TypeScript, no component libraries, inline styles only" prevents more bugs than a paragraph explaining the tech stack history.
**Source:** Root CLAUDE.md "What NOT to Do" section

### Anti-feature declarations prevent scope creep
**What:** Explicitly list what the app will NOT do in its CLAUDE.md. "No additional lanes. No due dates. No tags. No calendar integration."
**Why it works:** AI tools suggest features by default. The anti-feature list is a hard stop. With ADHD, it also removes the temptation to chase shiny additions mid-session.
**Source:** `portfolio/unnamed-ios/CLAUDE.md` (2026-04-24)

---

## Multi-Agent Orchestration

### Tool selection by task shape
**What:** Match the tool to the work shape, not habit:
- **Claude Code** — multi-file changes, shell ops, agentic workflows, project-wide refactors
- **Cursor** — single-file inline edits, quick fixes, tab-completion-heavy work
- **Codex** — CLI-centric tasks, one-shot shell scripts
- **Windsurf** — subfolder-scoped work where `.windsurfrules` is sufficient context
**Why it works:** Each tool has a different context loading strategy. Using Claude Code for a one-line fix wastes the agentic overhead. Using Cursor for a 15-file refactor loses cross-file awareness.
**Source:** Multi-tool portfolio experience (2026-04-29)

### Handoff protocol between tools
**What:** Before switching tools: (1) run `/handoff`, (2) run `checkpoint`, (3) update HANDOFF.md State table. The next tool reads HANDOFF.md first.
**Why it works:** No tool shares context with another. The handoff doc is the bridge. Without it, the next tool starts from zero and may redo or contradict work.
**Source:** `docs/templates/HANDOFF_SKILL.md` best practices section

### One app per session
**What:** Default to one app per Claude Code session. Cross-app work uses `SESSION_START_MONOREPO.md` and explicitly scopes which apps are in play.
**Why it works:** Mixing apps in one session leads to wrong-file edits, stale state assumptions, and confused HANDOFF.md updates. The exception is scripting/tooling that touches multiple apps by design (scanner, sync scripts).
**Source:** Portfolio convention (2026-04-29)

---

## Session Architecture

### Plan session, then implement session
**What:** Use separate context windows for planning vs. implementing. Plan session: read code, design approach, write plan file. Implement session: read plan, execute. Never plan and implement in the same window.
**Why it works:** Planning requires broad exploration (reading many files, considering alternatives). Implementation requires focused execution (editing specific files, running tests). Mixing them exhausts the context window before implementation starts.
**Source:** Claude Code plan mode pattern (2026-04-29)

### Gate coding behind Phase 3
**What:** No code until Phases 1-3 of the Product Build Framework are documented: Product Definition, PRD, UX Flow. Tell the AI explicitly: "no coding until these are done."
**Why it works:** AI tools default to code generation. Without the gate, you get a half-baked implementation with no documented requirements. The framework forces thinking-first, building-second.
**Source:** `PRODUCT_BUILD_FRAMEWORK.md`, `scripts/new-app`

### Session-start checkpoint
**What:** Run `checkpoint` at the very start of every session, before any edits. This gives a clean rollback point regardless of what happens next.
**Why it works:** If the session goes sideways — wrong approach, broken build, model hallucination — you can `restore` to exactly where you were. Without it, recovery requires manual git archaeology.
**Source:** Root CLAUDE.md auto-checkpoint rule

---

## Tool Comparison Notes

| Capability | Claude Code | Cursor | Codex | Windsurf |
|---|---|---|---|---|
| Auto-reads CLAUDE.md | Yes | Via .mdc | Via AGENTS.md | Via .windsurfrules |
| Best for | Full-stack changes, multi-file, shell ops | Single-file edits, quick fixes | CLI tasks | — |
| Context limit feel | ~20 turns | Per-file | — | — |
| Session continuity | HANDOFF.md + templates | .mdc rules | AGENTS.md | .windsurfrules |
| Strengths | Agentic, reads whole project, tool calls | Inline diff, fast | — | — |
