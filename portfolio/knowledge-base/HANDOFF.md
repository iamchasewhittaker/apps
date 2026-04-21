# Handoff — Knowledge Base

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v2.1.1 |
| **Branch** | `main` |
| **URL** | https://knowledge-base-hazel-iota.vercel.app |
| **Storage key** | `chase_knowledge_base_v1` — blob: `{ bookmarks, folders, favorites, categoryOrder }` |
| **Focus** | v2.1.1 shipped — seed maintenance: My Projects URL fixes, Git/Vercel/Supabase folders added |
| **Next** | v2.2 — drag-and-drop reorder, tags cross-folder filter, sort options |
| **Blockers** | None |
| **Last touch** | 2026-04-20 — v2.1.1: fixed 4 My Projects URLs (Shipyard/RollerTask/Knowledge Base/Unnamed), added Vercel + Supabase folders (8 links each), 4 Git links, Alias Ledger + Clarity Budget Web; SEED_VERSION 11 |

---

## What's in v2.0

- **ARC-style sidebar** — 280px collapsible (→ 48px icon strip), sticky 100vh
- **Nested folder hierarchy** — 8 parent folders, 29 leaf folders, CRUD (create/rename/delete/move)
- **Smart folders** — "Important" (importance ≥ 1) + "Recent" (last 15 visited)
- **Favorites shelf** — star → sidebar row + home view cards
- **Home view** — Favorites / Recently Visited / Important when no folder selected
- **Search** — global with folder breadcrumb path on results
- **Mobile** — overlay sidebar on < 768px
- **Keyboard shortcuts** — `/` search, `n` new bookmark, `Esc` close
- **6 components** — App.jsx (shell), Sidebar, FolderTree, BookmarkRow, BookmarkList, AddEditForm

## Fresh session prompt

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/knowledge-base/CLAUDE.md and portfolio/knowledge-base/HANDOFF.md.

Goal: Continue Knowledge Base at portfolio/knowledge-base/.

Current state: v2.0 — ARC sidebar, Chrome nested folders, 260 seed bookmarks. Theme aligned to portfolio BASE tokens.

Pick next work from portfolio/knowledge-base/ROADMAP.md.

Follow existing patterns:
- All styles in s object in constants.js — no CSS files
- Hover/pseudo CSS via css string with kb- class prefix
- Storage: { bookmarks, folders, favorites, categoryOrder } — use saveAll() pattern
- folderId is canonical; category is display-only copy of folder name

Verify: cd portfolio/knowledge-base && npm start

Update CHANGELOG [Unreleased], ROADMAP, HANDOFF, root ROADMAP Change Log, root HANDOFF State when done.
```

---

## Key files

| File | Purpose |
|------|---------|
| `src/constants.js` | SEED (274 bookmarks inline), SEED_FOLDERS, `s` styles, `css` string, storage helpers |
| `src/expandedSeeds.js` | EXPANDED_SEED (131 + 22 new bookmarks, IDs 275–303) |
| `src/App.jsx` | Layout shell: state, CRUD, folder actions, modals |
| `src/Sidebar.jsx` | Sidebar: search, smart folders, favorites, folder tree, new buttons |
| `src/FolderTree.jsx` | Recursive folder tree renderer |
| `src/BookmarkRow.jsx` | Single bookmark row + expandable detail panel |
| `src/BookmarkList.jsx` | List of BookmarkRows with group header |
| `src/AddEditForm.jsx` | Add/edit bookmark form with folder picker |

## Critical gotchas

- `SEED_VERSION` is **11** — bump + add entries to `SEED`/`SEED_FOLDERS` when adding seed data
- `folderId` is canonical; `category` is display fallback only — always set both when moving bookmarks
- Seed folder IDs (`f_claude`, `f_chatgpt`, etc.) are stored in user localStorage — never rename
- Smart folder IDs are `"__important__"` and `"__recent__"` (double underscores, not real folders)
- `getDescendantFolderIds(folderId)` returns Set including folder + all nested children

Paused 2026-04-15 — focusing on clarity-command per WIP limit.
