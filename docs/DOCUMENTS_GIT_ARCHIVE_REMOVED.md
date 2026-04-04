# ~/Documents — git removed + legacy code folders archived

## What happened

1. **`~/Documents/.git`** was **renamed** to **`.git-documents-archive-20260404`**, then that archive (**git metadata only**, ~90MB) was **deleted** so `~/Documents` stopped being a git working tree.
2. **2026-04-04 (later same day):** Legacy **`~/Documents/apps`** and **`~/Documents/Projects`** were **moved** (not deleted) into **`~/Documents/_archive_legacy_monorepo_20260404/`** so the live monorepo paths are only under **`~/Developer/chase`**. See **`README.txt`** inside that archive folder.

## What was **not** deleted

- **Normal files** under `~/Documents` (taxes, Obsidian, images, etc.) were not bulk-deleted.
- The old **`apps`** and **`Projects`** trees still exist **inside** **`_archive_legacy_monorepo_20260404/`** until you remove that folder yourself.

## Snapshot: top-level `~/Documents` (before git archive delete)

Historical reference (2026-04-04 morning). **`apps/`** and **`Projects/`** have since been moved into **`_archive_legacy_monorepo_20260404/`**.

| Name | Notes |
|------|--------|
| `apps/` | *(moved to `_archive_legacy_monorepo_20260404/apps`)* |
| `Projects/` | *(moved to `_archive_legacy_monorepo_20260404/Projects`)* |
| `Obsidian Vault/`, `2026 Taxes/`, etc. | Unchanged |

Re-list anytime: `ls -la ~/Documents`

## Canonical codebase

- **Git monorepo:** `~/Developer/chase` → remote `github.com/iamchasewhittaker/apps`
- **Portfolio apps:** `~/Developer/chase/portfolio/<app>/`
- **Other projects:** `~/Developer/chase/projects/<name>/`
- Use **`~/Developer/chase`** for **Cursor workspace**, `git push` / `git pull`, and deployment workflows.
- **Term reference:** [docs/GLOSSARY.md](GLOSSARY.md)

## Recovery

- **Old `~/Documents` git history:** Gone unless restored from Time Machine / backup (see earlier sections).
- **Legacy `apps` / `Projects` copy:** Restore by moving folders back from **`~/Documents/_archive_legacy_monorepo_20260404/`** if needed.

## See also

- [MONOREPO_MIGRATION.md](../MONOREPO_MIGRATION.md) — portfolio / `projects/` layout
- [GLOSSARY.md](GLOSSARY.md) — common terms
- Short marker: **`~/Documents/DOCUMENTS_NOT_A_GIT_REPO.txt`**
