# Handoff — Knowledge Base

> Current state for multi-session / multi-agent work. Update State when you stop or switch tasks.

---

## State

| Field | Value |
|-------|-------|
| **Version** | v2.0 |
| **Branch** | `main` |
| **URL** | knowledge-base-beta-five.vercel.app |
| **Storage key** | `chase_knowledge_base_v1` — blob: `{ bookmarks, folders, favorites, categoryOrder }` |
| **Focus** | Post-v2.0 improvements — import/export, favicons, drag-and-drop |
| **Next** | Import / export JSON (backup + round-trip). Then favicons next to each bookmark row. |
| **Blockers** | None |
| **Last touch** | 2026-04-13 — Theme alignment: portfolio-wide BASE token sweep across `constants.js`, `App.jsx`, `Sidebar.jsx`, `FolderTree.jsx`, `BookmarkList.jsx`, `ErrorBoundary.jsx` (`#09090b`/`#0d0d0f` → `#0f1117`, `#18181b` → `#161b27`, `#27272a`/`#1c1c1f` → `#1f2937`, `#a1a1aa` → `#6b7280`, `#f4f4f5` → `#f3f4f6`); DM Sans font added; v2.0 ARC sidebar + Chrome folder redesign shipped |

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
| `src/constants.js` | SEED (260 bookmarks), SEED_FOLDERS, `s` styles, `css` string, storage helpers |
| `src/App.jsx` | Layout shell: state, CRUD, folder actions, modals |
| `src/Sidebar.jsx` | Sidebar: search, smart folders, favorites, folder tree, new buttons |
| `src/FolderTree.jsx` | Recursive folder tree renderer |
| `src/BookmarkRow.jsx` | Single bookmark row + expandable detail panel |
| `src/BookmarkList.jsx` | List of BookmarkRows with group header |
| `src/AddEditForm.jsx` | Add/edit bookmark form with folder picker |

## Critical gotchas

- `SEED_VERSION` is **5** — bump + add entries to `SEED`/`SEED_FOLDERS` when adding seed data
- `folderId` is canonical; `category` is display fallback only — always set both when moving bookmarks
- Seed folder IDs (`f_claude`, `f_chatgpt`, etc.) are stored in user localStorage — never rename
- Smart folder IDs are `"__important__"` and `"__recent__"` (double underscores, not real folders)
- `getDescendantFolderIds(folderId)` returns Set including folder + all nested children
