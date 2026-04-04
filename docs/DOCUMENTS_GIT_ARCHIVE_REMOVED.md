# ~/Documents — git removed + legacy code folders relocated

## What happened

1. **`~/Documents/.git`** was **renamed** to **`.git-documents-archive-20260404`**, then that archive (**git metadata only**, ~90MB) was **deleted** so `~/Documents` stopped being a git working tree.
2. Legacy **`~/Documents/apps`** and **`~/Documents/Projects`** were moved into **`~/Documents/_archive_legacy_monorepo_20260404/`**, then (same era) **`~/Documents/growth-tracker-old`** was grouped with them.
3. **2026-04-04 (bundle into Chase):** That whole bundle was moved to **`~/Developer/chase/projects/archive/from-documents-20260404/`** (`apps`, `Projects`, `growth-tracker-old`, plus the small **`README.txt`** from the Documents archive step). The directory is **gitignored** — see [LEGACY_LOCAL_MIRRORS.md](LEGACY_LOCAL_MIRRORS.md).

**Nothing under `~/Documents` should remain** named **`apps`**, **`Projects`**, **`growth-tracker-old`**, or **`_archive_legacy_monorepo_20260404`**.

## What was **not** deleted

- **Normal files** under `~/Documents` (taxes, Obsidian, images, etc.) were not bulk-deleted.
- Legacy code trees still exist **on disk** under **`~/Developer/chase/projects/archive/from-documents-20260404/`** until you remove that folder yourself (they are **not** on GitHub).

## Snapshot: top-level `~/Documents` (historical)

Early **2026-04-04** reference only.

| Name | Notes |
|------|--------|
| `apps/`, `Projects/` | Later bundled → Chase `from-documents-20260404` |
| `growth-tracker-old/` | Same bundle |
| `Obsidian Vault/`, `2026 Taxes/`, etc. | Unchanged |

Re-list anytime: `ls -la ~/Documents`

## Canonical codebase

- **Git monorepo:** `~/Developer/chase` → remote `github.com/iamchasewhittaker/apps`
- **Portfolio apps:** `~/Developer/chase/portfolio/<app>/`
- **Other projects:** `~/Developer/chase/projects/<name>/`
- Use **`~/Developer/chase`** for **Cursor workspace**, `git push` / `git pull`, and deployment workflows.
- **Term reference:** [docs/GLOSSARY.md](GLOSSARY.md)
- **Local legacy mirror (not in git):** [docs/LEGACY_LOCAL_MIRRORS.md](LEGACY_LOCAL_MIRRORS.md)

## Recovery

- **Old `~/Documents` git history:** Gone unless restored from Time Machine / backup.
- **Legacy trees on this Mac:** **`~/Developer/chase/projects/archive/from-documents-20260404/`** (copy elsewhere if you need a second machine).

## See also

- [MONOREPO_MIGRATION.md](../MONOREPO_MIGRATION.md) — portfolio / `projects/` layout
- [projects/archive/README.md](../projects/archive/README.md) — what lives under `projects/archive/`
- Short marker: **`~/Documents/DOCUMENTS_NOT_A_GIT_REPO.txt`**
