# Glossary — Chase monorepo & apps

Quick reference for terms that show up in docs, Vercel, Supabase, and Cursor. For layout and migration history see [MONOREPO_MIGRATION.md](../MONOREPO_MIGRATION.md) and [DOCUMENTS_GIT_ARCHIVE_REMOVED.md](DOCUMENTS_GIT_ARCHIVE_REMOVED.md).

| Term | Meaning |
|------|--------|
| **Canonical repo** | **`~/Developer/chase`** — the git checkout you `push`/`pull`; remote **`github.com/iamchasewhittaker/apps`**. Open this folder as your Cursor workspace. |
| **Monorepo** | One git repository holding many apps and side projects (portfolio PWAs + `projects/*`), instead of a separate repo per app. |
| **`portfolio/`** | Deployable / product web apps: **`shared/`** (sync layer), **`app-hub/`**, **`wellness-tracker`**, **`job-search-hq`**, **`app-forge`**, **`roller-task-tycoon`**, **`archive/`** (retired **growth-tracker**). |
| **`projects/`** | Lowercase. Non-portfolio worktrees: **AI Dev Mastery**, **ynab-enrichment**, **shortcut-reference**, **Money**, **`archive/`** (e.g. retired **claude-usage-tool**). Not the old **`~/Documents/Projects`** spelling. |
| **Root Directory** | Vercel project setting: subdirectory of the repo that contains **`package.json`** for that deploy (e.g. **`portfolio/wellness-tracker`**). Must match after a monorepo move. |
| **`APP_KEY` / `app_key`** | String that identifies which blob in Supabase **`user_data`** belongs to which app (e.g. **`roller_task_tycoon_v1`**, **`wellness`**, **`job-search`**). |
| **Blob sync** | Offline-first pattern: one JSON document per user per app in **`user_data`**, merged with **`localStorage`**; **`push`** / **`pull`** in the background. Implemented in **`portfolio/shared/sync.js`** (copied into each app as **`src/shared/sync.js`**). |
| **Offline-first** | UI reads/writes local storage immediately; cloud sync does not block the interface. |
| **OTP / magic link** | Supabase email sign-in; PWA on iPhone often needs the **code** in the email (**`{{ .Token }}`** in the template), not only the link. |
| **CRA** | Create React App — React + **`npm start`** / **`react-scripts`** (Wellness, Job Search, App Forge, archived Growth). |
| **Vite** | Faster dev/build tool; **RollerTask** uses **`VITE_*`** env vars (**`import.meta.env`**), not **`REACT_APP_*`**. |
| **PWA** | Progressive Web App — **`manifest.json`**, installable on iPhone home screen; service worker patterns vary by app. |
| **`localStorage` key** | Per-app storage namespace (e.g. **`chase_wellness_v1`**, **`chase_roller_task_v1`**). Do not rename shipped keys without a migration plan. |
| **Linear** | Issue/project tracker; Whittaker team; app backlogs + [Portfolio monorepo migration](https://linear.app/whittaker/project/portfolio-monorepo-migration-ed57de848d37). |
| **`wellnes` vs `wellness`** | Production URL / Vercel project **`wellnes-tracker`** is the typo spelling; folder is **`portfolio/wellnes-tracker`**. Separate Vercel project **`wellness-tracker`** points at **`portfolio/wellness-tracker`**. |
| **Retired / archive** | **`portfolio/archive/growth-tracker`**, **`projects/archive/claude-usage-tool`** — kept for reference; Linear projects often **Canceled**. |
| **Git LFS** | Large File Storage — optional for big binaries (e.g. large GIFs) so GitHub does not warn about 50MB+ blobs. |
| **`http.postBuffer`** | Git config; increase if **`git push`** fails with HTTP 400 on a large pack (e.g. **`git config http.postBuffer 524288000`**). |
| **Documents archive** | **`~/Documents/_archive_legacy_monorepo_20260404/`** — old **`apps/`** and **`Projects/`** trees moved out of the way 2026-04-04; not part of git. |

## Related files

- [CLAUDE.md](../CLAUDE.md) — master instructions for the portfolio
- [ROADMAP.md](../ROADMAP.md) — cross-app priorities and change log
- [AGENTS.md](../portfolio/wellness-tracker/AGENTS.md) (per app) — Cursor/agent conventions
