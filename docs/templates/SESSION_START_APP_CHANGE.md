# Session start — change one app (portfolio or project)

Copy everything below into a **new** chat, fill the brackets, then send.

---

**Instructions for the agent**

1. Read repo **[CLAUDE.md](../../CLAUDE.md)**.
2. Use defaults from `CLAUDE.md` unless overridden here:
   - `update docs` means app + root docs scope (canonical default).
   - Shipped truth is git + Linear; `HANDOFF.md` is resume context.
3. Read this app’s **`CLAUDE.md`** and **`AGENTS.md`** (if present):
   - Portfolio app path: `~/Developer/chase/portfolio/<app>/`
   - Other project path: `~/Developer/chase/projects/<name>/`
4. If the app has **`docs/BRANDING.md`**, read it for icons/palette (do not invent alternate branding). **New apps:** copy **[`docs/templates/PORTFOLIO_APP_BRANDING.md`](../templates/PORTFOLIO_APP_BRANDING.md)** there once, then link it from `CLAUDE.md` — see **[`docs/design/README.md`](../design/README.md)**.
5. Read **[HANDOFF.md](../../HANDOFF.md)** for current thread state.
6. Run `cd ~/Developer/chase && git status -sb` and inspect only the relevant subtree.
7. **CRA apps in CI** (`portfolio/wellness-tracker`, `job-search-hq`, `knowledge-base`, `app-forge`): GitHub Actions uses **Node 20** + `npm ci`. If you change dependencies or see lockfile drift, follow **[`SESSION_START_FIX_CI_LOCKFILES.md`](SESSION_START_FIX_CI_LOCKFILES.md)** (regenerate `package-lock.json` with Node 20’s npm).

**App / project path:** `portfolio/[APP_NAME]/` or `projects/[PROJECT_NAME]/`  
**Linear (optional):** [paste issue URL]  
**Goal:** [one sentence]

**Acceptance (“done when”):**

- [ ] [bullet]
- [ ] [bullet]

**Constraints:**

- **Docs scope override (optional):** [default app+root | app-only | handoff-only]
- [e.g. CRA only / archived Vite RollerTask at `portfolio/archive/roller-task-tycoon` uses `VITE_*`]
- [e.g. keep `src/shared/sync.js` aligned with `portfolio/shared/sync.js` if this app uses sync]

**Files / areas already touched (if continuing):**

- [paths or “none — fresh start”]

---

> Handoff guide: [`docs/templates/HANDOFF_SKILL.md`](HANDOFF_SKILL.md)

After the session: update app **`CHANGELOG.md`** under `## [Unreleased]`, root **`ROADMAP.md`** Change Log if required, **[HANDOFF.md](../../HANDOFF.md)**, and Linear.
