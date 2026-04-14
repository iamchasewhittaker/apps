# Session start — monorepo / cross-cutting work

Copy everything below into a **new** chat (Cursor, Claude Code, Codex, etc.), fill the brackets, then send.

---

**Instructions for the agent**

1. Read **[CLAUDE.md](../../CLAUDE.md)** (repo root) and **[HANDOFF.md](../../HANDOFF.md)** first.
2. Use defaults from `CLAUDE.md` unless overridden here:
   - `update docs` means app + root docs scope (canonical default).
   - Shipped truth is git + Linear; `HANDOFF.md` is resume context.
3. If work touches **icons or marketing visuals**, read **[`docs/design/README.md`](../design/README.md)** — portfolio branding template + Clarity iOS icon spec live there (avoid re-explaining rules per chat).
4. Run `cd ~/Developer/chase && git status -sb && git log -3 --oneline`.
5. Follow portfolio rules: small diffs, update `CHANGELOG.md` / `ROADMAP.md` when required by [CLAUDE.md](../../CLAUDE.md).
6. If you touch **`portfolio/wellness-tracker`**, **`portfolio/job-search-hq`**, **`portfolio/knowledge-base`**, or **`portfolio/app-forge`**, read [CLAUDE.md](../../CLAUDE.md) **CI — portfolio web builds** and use **[`SESSION_START_FIX_CI_LOCKFILES.md`](SESSION_START_FIX_CI_LOCKFILES.md)** if `package-lock.json` / `npm ci` on GitHub Actions is involved.

**Workspace:** `~/Developer/chase`  
**Remote:** `github.com/iamchasewhittaker/apps`  
**Linear (optional):** [paste issue URL]  
**Goal:** [one sentence — e.g. “Document X”, “Script Y”, “Refactor Z across apps”]

**Scope / constraints:**

- **Docs scope override (optional):** [default app+root | app-only | handoff-only]
- [e.g. touch only `portfolio/` — not `projects/`]
- [e.g. no new dependencies]
- [e.g. offline-first unchanged]

**Not in scope:**

- [what to avoid]

---

After the session, the human will update **[HANDOFF.md](../../HANDOFF.md)** (State + Notes) and Linear.
