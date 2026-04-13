# Knowledge Base — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Version:** v2.0
- **Storage key:** `chase_knowledge_base_v1` (localStorage) — blob shape: `{ bookmarks: [...], folders: [...], favorites: [...], categoryOrder: null }`
- **URL:** https://knowledge-base-beta-five.vercel.app
- **Entry:** `src/App.jsx`

## Purpose
A personal knowledge base and bookmark manager with ARC-style sidebar navigation and Chrome-style nested folder hierarchy.

## File Structure
```
package.json              <- CRA scaffold (react-scripts 5.0.1)
public/
  index.html              <- shell with <div id="root">
src/
  index.js                <- ReactDOM.createRoot entry
  App.jsx                 <- layout shell: state, CRUD, folder actions, render
  Sidebar.jsx             <- sidebar: search, smart folders, favorites, folder tree, actions
  FolderTree.jsx          <- recursive folder tree renderer
  BookmarkRow.jsx         <- single bookmark row + expandable detail panel
  BookmarkList.jsx        <- list of BookmarkRows with group header
  AddEditForm.jsx         <- add/edit bookmark form with folder picker
  constants.js            <- SEED, SEED_FOLDERS, styles (s), css, storage helpers, display constants
  ErrorBoundary.jsx       <- standard portfolio error boundary
bookmark-manager.jsx      <- ARCHIVED original Claude artifact
docs/
  PRODUCT_BRIEF.md        <- Phase 1: Product Definition
  PRD.md                  <- Phase 2: Product Requirements
  APP_FLOW.md             <- Phase 3: UX / App Flow
CLAUDE.md                 <- this file
ROADMAP.md                <- feature pipeline
HANDOFF.md                <- session continuity
```

## Tech Stack
- React 18 (Create React App) with hooks (`useState`, `useEffect`, `useRef`)
- Inline styles via `s` object in `constants.js` (portfolio convention)
- `css` string injected via `<style>` for hover/pseudo effects (`kb-` class prefix)
- `lucide-react` for icons
- `localStorage` for persistence (`load()` / `save()` in constants.js)

## Data Shape
```js
// localStorage blob (chase_knowledge_base_v1):
{
  bookmarks: [...],       // array of bookmark objects
  folders: [...],         // array of folder objects (nested hierarchy)
  favorites: [...],       // array of bookmark IDs starred as favorites
  categoryOrder: null,    // legacy field kept for migration compat; not used
}

// Bookmark:
{ id: number, title: string, url: string,
  folderId: string,       // canonical — links bookmark to its folder
  category: string,       // display copy of folder name (kept for compat)
  description?: string, status?: string, progress?: number,
  notes?: string, pinned?: boolean, visits?: number,
  lastVisited?: string, importance?: 0|1|2|3 }

// Folder:
{ id: string, name: string, parentId: string|null, order: number }
```
- `folderId` is canonical — always use this for folder membership
- `category` is a display copy of `folder.name`, kept for backward compat
- Seed folder IDs use `"f_"` prefix; user-created folders use `"f_" + Date.now()`
- Smart folder IDs `"__important__"` and `"__recent__"` are virtual (not stored in `folders`)
- `favorites` is an array of bookmark IDs; `pinned` field on bookmarks is legacy (kept in sync)

## Current Features (v2.0)
- 260 seed bookmarks in nested folder hierarchy (8 parent folders + 29 leaf folders)
- **ARC-style sidebar** — collapsible (280px ↔ 48px); sticky within 100vh
- **Smart folders** — "Important" (importance ≥ 1) and "Recent" (last visited, top 15)
- **Favorites shelf** — starred bookmarks in sidebar + home view cards (up to 12)
- **Home view** — Favorites / Recently Visited / Important card grids when no folder selected
- **Nested folder tree** — expand/collapse, bookmark counts, `...` context menu (rename/subfolder/delete)
- **Folder CRUD** — create, rename (modal), delete (reparents), move bookmarks between folders
- **Search** — global or within selected folder; results show folder breadcrumb path
- **Bookmark CRUD** — add, edit (folder picker dropdown), delete, detail panel
- Per-bookmark: status, importance, progress 0–100%, notes, last visited, visit count
- **Keyboard shortcuts** — `/` focus search, `n` new bookmark, `Esc` close
- **Mobile** — sidebar as fixed overlay on < 768px; hamburger toggle
- Dark mode only (`#09090b` base)
- ErrorBoundary wrapping

## Commands
- `npm start` — dev server
- `npm run build` — production build

## Constraints & Gotchas
- Preserve dark mode (`#09090b` base).
- **SEED_VERSION is 5.** Bump + add entries to `SEED` and `SEED_FOLDERS` when adding seed data. Migration is in `App.jsx` `useEffect` loader.
- **Storage shape is `{ bookmarks, folders, favorites, categoryOrder }`.** `load()` auto-migrates all older formats. Never write a bare array back. Use `saveAll(bm, folders, favs)` pattern.
- **`folderId` is canonical.** When creating/moving bookmarks always set both `folderId` and `category` (the folder's name) to keep them in sync.
- **Folder IDs must be stable.** Seed folder IDs (`f_claude`, `f_chatgpt`, etc.) are stored in user localStorage — never rename or remove them from `SEED_FOLDERS`.
- **`getDescendantFolderIds(folderId)`** returns a Set including the folder + all nested children — always use this when filtering bookmarks for a folder view.
- All styles in `s` object in `constants.js`. Hover/pseudo CSS uses `kb-` prefixed classes in the `css` string.
- `statusColor`, `statusLabel`, `importanceColor`, `importanceLabel` are exported from `constants.js` — import from there, don't redefine locally.

## How to Extend
1. Read ROADMAP.md before adding anything new.
2. One feature per iteration. Ship, test, then move on.
3. Data shape changes → update `load()` migration + bump `SEED_VERSION`.
4. New folders → add to `SEED_FOLDERS` with stable `f_` ID; add `folderId` to matching `SEED` bookmarks.
5. Never break the seed load path — it's the fallback for fresh installs.
