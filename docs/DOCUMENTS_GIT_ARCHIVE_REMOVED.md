# ~/Documents — old git repo removed (2026-04-04)

## What happened

1. **`~/Documents/.git`** was **renamed** to **`.git-documents-archive-20260404`** so `~/Documents` stopped being a git working tree.
2. That **archive folder** (git object database, refs, config — **not** your normal files) was **deleted** to free ~90MB after this note was written.

## What was **not** deleted

**No documents, apps, or project folders under `~/Documents` were removed.** Only the hidden **`.git-documents-archive-20260404`** directory (metadata used by Git) was deleted.

Your files stay exactly where they were: `apps/`, `Projects/`, `Obsidian Vault/`, etc.

## Snapshot: top-level `~/Documents` (before archive delete)

Recorded **2026-04-04** for reference (names only — not a full backup):

| Name | Notes |
|------|--------|
| `.DS_Store` | macOS |
| `.git-documents-archive-20260404` | *(was present on snapshot day; deleted same day — git metadata only)* |
| `.gitignore` | Left in place; optional cleanup later |
| `.localized` | macOS |
| `2026 Taxes/` | |
| `ArcRecoveryPhrase (1).png`, `ArcRecoveryPhrase.png` | |
| `Codex/`, `Codex Intel/` | |
| `Job Search 2026/` | |
| `Obsidian Vault/` | |
| `Projects/` | May overlap older paths; canonical monorepo code is **`~/Developer/chase`** |
| `Untitled 2.rtf` | |
| `Yard/` | |
| `apps/` | Legacy copy; live portfolio is under **`~/Developer/chase/portfolio/`** |
| `growth-tracker-old/` | |
| `wellness-tracker.jsx` | |

Re-list anytime: `ls -la ~/Documents`

## Canonical codebase

- **Git monorepo:** `~/Developer/chase` → remote `github.com/iamchasewhittaker/apps`
- Use that path for **Cursor workspace**, `git push` / `git pull`, and deployment workflows.

## Recovery

After the archive folder is deleted, **Git history for the old `~/Documents` repo is gone** unless you restore from **Time Machine**, **Backblaze**, or another backup that included **`.git-documents-archive-20260404`** or the original **`.git`**.

If you still have the archive folder on a backup, restore it to `~/Documents/.git` to revive the old repo.

## See also

- [MONOREPO_MIGRATION.md](../MONOREPO_MIGRATION.md) — portfolio / `projects/` layout
- Short marker file in Documents: **`DOCUMENTS_NOT_A_GIT_REPO.txt`**
