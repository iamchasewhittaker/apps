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

## Tool Comparison Notes

| Capability | Claude Code | Cursor | Codex | Windsurf |
|---|---|---|---|---|
| Auto-reads CLAUDE.md | Yes | Via .mdc | Via AGENTS.md | Via .windsurfrules |
| Best for | Full-stack changes, multi-file, shell ops | Single-file edits, quick fixes | CLI tasks | — |
| Context limit feel | ~20 turns | Per-file | — | — |
| Session continuity | HANDOFF.md + templates | .mdc rules | AGENTS.md | .windsurfrules |
| Strengths | Agentic, reads whole project, tool calls | Inline diff, fast | — | — |
