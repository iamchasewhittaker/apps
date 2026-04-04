# Monorepo migration (in progress)

Tracks restructuring this repository to `portfolio/` and `projects/` under `~/Developer/chase`.

**Linear project:** [Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37)

Use that project for migration tasks, Vercel root-directory updates, and verification checklists.

**Local hygiene:** `~/Documents` is **not** a git repo anymore; the old `.git` archive was removed after [docs/DOCUMENTS_GIT_ARCHIVE_REMOVED.md](docs/DOCUMENTS_GIT_ARCHIVE_REMOVED.md). A marker file `~/Documents/DOCUMENTS_NOT_A_GIT_REPO.txt` points here. Legacy **`apps`**, **`Projects`**, and **`growth-tracker-old`** from Documents now live only under **`~/Developer/chase/projects/archive/from-documents-20260404/`** (local-only, **gitignored** — [docs/LEGACY_LOCAL_MIRRORS.md](docs/LEGACY_LOCAL_MIRRORS.md)).

**Term reference:** [docs/GLOSSARY.md](docs/GLOSSARY.md)

## Completed (recent)

- **Documents-era legacy bundle** → **`projects/archive/from-documents-20260404/`** (`apps`, `Projects`, `growth-tracker-old`); **`.gitignore`** + [docs/LEGACY_LOCAL_MIRRORS.md](docs/LEGACY_LOCAL_MIRRORS.md) + [projects/archive/README.md](projects/archive/README.md) (2026-04-04).
- **`main` pushed to GitHub** (`iamchasewhittaker/apps`). If `git push` returns HTTP 400, run `git config http.postBuffer 524288000` and retry (large pack). GitHub may warn about files over 50MB (e.g. `projects/archive/claude-usage-tool` GIF) — consider [Git LFS](https://git-lfs.github.com/) later.
- **Claude Usage Tool** → `projects/archive/claude-usage-tool/` (retired) · Linear [Claude Usage Tool](https://linear.app/whittaker/project/claude-usage-tool-a002c92c1688) (Canceled).
- **Vercel Root Directory** set (team `iamchasewhittakers-projects`): `wellnes-tracker` → `portfolio/wellnes-tracker`, `wellness-tracker` → `portfolio/wellness-tracker`, `job-search-hq` → `portfolio/job-search-hq`, `app-forge` → `portfolio/app-forge`, `roller-task-tycoon` → `portfolio/roller-task-tycoon`, `growth-tracker` (retired) → `portfolio/archive/growth-tracker`. Redeploys should follow from git pushes; confirm in each project’s Deployments tab.
- **`Projects/` → `projects/`** (lowercase) — `.gitignore` + handoff docs + `Money/analyze.py` (paths relative to script); root `.claude/launch.json` AI Dev Mastery prefix updated.
- **Top-level `apps/` retired** — master `CLAUDE.md`, `ROADMAP.md`, `SUNSAMA_MCP_GUIDE.md`, and `.claude/launch.json` now at **repo root** (`~/Developer/chase`).
- **Growth Tracker** → `portfolio/archive/growth-tracker/` · Linear [Growth Tracker](https://linear.app/whittaker/project/growth-tracker-9e99390538d6) (Canceled / retired).
