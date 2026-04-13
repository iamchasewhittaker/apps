# Session start — change one app (portfolio or project)

Copy everything below into a **new** chat, fill the brackets, then send.

---

**Instructions for the agent**

1. Read repo **[CLAUDE.md](../../CLAUDE.md)**.
2. Read this app’s **`CLAUDE.md`** and **`AGENTS.md`** (if present):
   - Portfolio app path: `~/Developer/chase/portfolio/<app>/`
   - Other project path: `~/Developer/chase/projects/<name>/`
3. If the app has **`docs/BRANDING.md`**, read it for icons/palette (do not invent alternate branding). **New apps:** copy **[`docs/templates/PORTFOLIO_APP_BRANDING.md`](../templates/PORTFOLIO_APP_BRANDING.md)** there once, then link it from `CLAUDE.md` — see **[`docs/design/README.md`](../design/README.md)**.
4. Read **[HANDOFF.md](../../HANDOFF.md)** for current thread state.
5. Run `cd ~/Developer/chase && git status -sb` and inspect only the relevant subtree.

**App / project path:** `portfolio/[APP_NAME]/` or `projects/[PROJECT_NAME]/`  
**Linear (optional):** [paste issue URL]  
**Goal:** [one sentence]

**Acceptance (“done when”):**

- [ ] [bullet]
- [ ] [bullet]

**Constraints:**

- [e.g. CRA only / archived Vite RollerTask at `portfolio/archive/roller-task-tycoon` uses `VITE_*`]
- [e.g. keep `src/shared/sync.js` aligned with `portfolio/shared/sync.js` if this app uses sync]

**Files / areas already touched (if continuing):**

- [paths or “none — fresh start”]

---

After the session: update app **`CHANGELOG.md`** under `## [Unreleased]`, root **`ROADMAP.md`** Change Log if required, **[HANDOFF.md](../../HANDOFF.md)**, and Linear.
