# Monorepo migration (in progress)

Tracks restructuring this repository to `portfolio/` and `projects/` under `~/Developer/chase`.

**Linear project:** [Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37)

Use that project for migration tasks, Vercel root-directory updates, and verification checklists.

## Completed (recent)

- **`main` pushed to GitHub** (`iamchasewhittaker/apps`). If `git push` returns HTTP 400, run `git config http.postBuffer 524288000` and retry (large pack). GitHub may warn about files &gt;50MB (e.g. `projects/claude-usage-tool` GIF) — consider [Git LFS](https://git-lfs.github.com/) later.
- **Vercel Root Directory** set for production apps: `wellnes-tracker` → `portfolio/wellnes-tracker`, `job-search-hq` → `portfolio/job-search-hq`, `app-forge` → `portfolio/app-forge`, `roller-task-tycoon` → `portfolio/roller-task-tycoon` (team `iamchasewhittakers-projects`). Redeploys should follow from the push; confirm in each project’s Deployments tab.
- **`Projects/` → `projects/`** (lowercase) — `.gitignore` + handoff docs + `Money/analyze.py` (paths relative to script); root `.claude/launch.json` AI Dev Mastery prefix updated.
- **Top-level `apps/` retired** — master `CLAUDE.md`, `ROADMAP.md`, `SUNSAMA_MCP_GUIDE.md`, and `.claude/launch.json` now at **repo root** (`~/Developer/chase`).
- **Growth Tracker** → `portfolio/archive/growth-tracker/` · Linear [Growth Tracker](https://linear.app/whittaker/project/growth-tracker-9e99390538d6) (Canceled / retired).
