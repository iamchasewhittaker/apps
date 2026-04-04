# AGENTS.md — Cursor & coding agents

Read this together with [CLAUDE.md](CLAUDE.md) and portfolio master [`/CLAUDE.md`](../../CLAUDE.md) (repo root).

## Scope

- Work from **`portfolio/roller-task-tycoon`** unless a task says otherwise.

**Monorepo migration:** [Linear — Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37)
- Prefer **small commits** with clear messages.
- Track launch and follow-ups in **Linear** — [RollerTask Tycoon project](https://linear.app/whittaker/project/rollertask-tycoon-ca86fd0bf771); update issue status when work ships.

## Conventions

1. **Match existing style** — vanilla JS, no TypeScript unless the portfolio standard changes.
2. **Update CHANGELOG.md** under `## [Unreleased]` for features, fixes, breaking changes, or important refactors.
3. **Learning-friendly:** prefer a short note in [docs/LEARNING.md](docs/LEARNING.md) over long comment blocks in code.
4. **No drive-by refactors** unrelated to the task.
5. **Portfolio:** when shipping something visible, update [README.md](README.md) snapshot / “How to run” and [docs/CASE_STUDY.md](docs/CASE_STUDY.md) as appropriate.
6. **Keep `src/shared/sync.js` in sync** with [`/portfolio/shared/sync.js`](../shared/sync.js) when the shared layer changes (copy file; do not symlink on Vercel).

## Files to touch when…

| Situation | Update |
|-----------|--------|
| Architecture or data flow changes | `docs/ARCHITECTURE.md` |
| Significant technical choice | new file in `docs/adr/` |
| Milestones shift | `ROADMAP.md` |
| User-visible release | `CHANGELOG.md` |
| Portfolio master index | `/CLAUDE.md` + `/ROADMAP.md` (repo root) Change Log |

## Vite / env

- Use **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** only — `import.meta.env.VITE_*`.
- Do not use `REACT_APP_*` here (that prefix is for CRA apps elsewhere in the monorepo).
