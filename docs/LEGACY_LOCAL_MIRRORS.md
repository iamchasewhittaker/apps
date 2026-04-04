# Legacy local mirrors (not in Git)

## What this is

On **this machine**, a bundle of pre-migration folders from **`~/Documents`** may exist at:

**`~/Developer/chase/projects/archive/from-documents-20260404/`**

Typical contents (names only):

- **`apps/`** — old monorepo layout (duplicates much of **`portfolio/`**)
- **`Projects/`** — old **`~/Documents/Projects`** tree (duplicates much of **`projects/`**)
- **`growth-tracker-old/`** — extra legacy Growth copy (canonical retired app in git is **`portfolio/archive/growth-tracker/`**)
- **`README.txt`** — short on-disk note from the Documents archive step

## Git policy

The path **`projects/archive/from-documents-20260404/`** is listed in **`.gitignore`**. It is **not** pushed to GitHub. A fresh **`git clone`** will **not** contain these directories.

## If you need them on another machine

Copy from backup (Time Machine, etc.) or re-run the same **`mv`** from your old layout into that path locally.

## Related

- [DOCUMENTS_GIT_ARCHIVE_REMOVED.md](DOCUMENTS_GIT_ARCHIVE_REMOVED.md) — why **`~/Documents`** is not a git repo
- [GLOSSARY.md](GLOSSARY.md) — monorepo terms
- [projects/archive/README.md](../projects/archive/README.md) — pointer from `projects/archive/`
