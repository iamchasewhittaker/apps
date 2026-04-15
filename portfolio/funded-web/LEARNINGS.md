# Learnings — Funded Web

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | react | swift | python | git | deploy | supabase | ...

---

## Entries

### 2026-04-15 — `git mv` leaves node_modules behind
**What happened:** After `git mv portfolio/conto-web portfolio/funded-web`, the old `portfolio/conto-web/` directory still existed on disk containing only `node_modules/`.
**Root cause:** `git mv` only moves tracked files. `node_modules/` is gitignored so git never touched it — the directory stayed in place.
**Fix / lesson:** After any `git mv` of an app folder, manually `rm -rf` the old directory if it still exists. The contents will only be gitignored artifacts (node_modules, build/, .vercel/) — safe to delete.
**Tags:** git, gotcha, rename

### 2026-04-15 — Vercel project rename: create new project, don't rename old one
**What happened:** When renaming conto-web → funded-web on Vercel, created a new project (`vercel project add funded-web`) rather than renaming the existing `conto-web` project.
**Root cause:** Renaming a Vercel project changes the URL slug but the old project and its env vars remain in place; creating a new one gives a clean slate with the correct name from day one.
**Fix / lesson:** For app renames, `vercel project add <new-name>` → `vercel link` → `vercel git connect` → `scripts/vercel-add-env` → `vercel --prod`. The old Vercel project can be archived/deleted afterward. Storage keys and Supabase `app_key` don't change — only the project name and URL change.
