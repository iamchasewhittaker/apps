# Changelog — Knowledge Base

## [Unreleased]

### Chore
- **Theme alignment:** swept all inline colors across `constants.js`, `App.jsx`, `Sidebar.jsx`, `FolderTree.jsx`, `BookmarkList.jsx`, `ErrorBoundary.jsx` to match shared portfolio BASE token set (`#09090b` / `#0d0d0f` → `#0f1117`, `#18181b` → `#161b27`, `#27272a` / `#1c1c1f` → `#1f2937`, `#a1a1aa` → `#6b7280`, `#f4f4f5` → `#f3f4f6`); added DM Sans font to `public/index.html`; updated root `fontFamily` to `'DM Sans', system-ui, sans-serif`; updated `theme-color` meta and body background

## [v2.0] — 2026-04-13
### Added
- **ARC-style sidebar** — fixed left panel (280px) with collapse toggle; folder tree, smart folders, favorites shelf, search, and new bookmark/folder buttons
- **Nested folder hierarchy** — Chrome-style nested folders 3–4 levels deep. 29 seed categories pre-grouped into 8 parent folders (AI Tools, Apple, Web & Dev, Learning, Career, Community, Life, Creative) + My Projects
- **Folder CRUD** — create folder/subfolder, rename (modal), delete (reparents children + bookmarks), move bookmarks to any folder via picker
- **Smart folders** — "Important" (importance ≥ 1, ranked) and "Recent" (last visited, top 15) as virtual sidebar entries and home view sections
- **Favorites shelf** — star/unstar bookmarks; starred bookmarks shown in sidebar + home view cards (up to 12)
- **Home view** — landing view when no folder selected; Favorites, Recently Visited, and Important sections as clickable cards
- **Two-panel layout** — sidebar + scrollable content area, both independently scrollable within 100vh
- **Search across all folders** — sidebar search bar filters bookmarks globally; results show folder path breadcrumb
- **Mobile overlay sidebar** — sidebar hidden on <768px; hamburger opens it as a fixed overlay
- **Keyboard shortcuts** — `/` focuses search, `n` opens new bookmark form, `Esc` closes menus/forms
- **Component extraction** — App.jsx split into BookmarkRow, BookmarkList, AddEditForm, Sidebar, FolderTree (6 components)

### Changed
- Storage blob upgraded to `{ bookmarks, categoryOrder, folders, favorites }` (SEED_VERSION 5); `load()` auto-migrates all historical formats
- Bookmark `folderId` field is now canonical; `category` kept as display fallback
- `pinned` → `favorites` array migration on first load (backward compatible)
- `statusColor`, `statusLabel`, `importanceColor`, `importanceLabel` moved to `constants.js` (shared across components)
- Category filter pills replaced by sidebar folder tree navigation
- Add/edit form now uses folder picker dropdown instead of free-text category input

### Removed
- Single-column layout
- Category filter pill row
- Category organization panel (superseded by folder CRUD in sidebar)

## [v1.3] — 2026-04-13
### Added
- **Category organization panel** — "Categories" button in toolbar opens inline manager with: reorder (up/down arrows), rename (click name or edit icon), merge into another category, delete empty categories, reset to A–Z
- **Importance ranking** — High/Med/Low/None field on every bookmark; colored badge (blue/amber/red) on rows; importance selector in detail panel
- **"Important" filter pill** — flat view of all importance-flagged bookmarks, sorted High → Med → Low → alphabetical within each level
- **Storage migration** — blob upgraded from flat array to `{ bookmarks, categoryOrder }`; `load()` auto-migrates old data silently

### Changed
- Category sort now respects `categoryOrder` from storage when set; falls back to default A–Z (My Projects last)
- Filter pills now include "Important" after "All"
- `startEdit` now preserves `importance` field when editing an existing bookmark
- Form reset includes `importance: 0` default

## [v1.2] — 2026-04-13
### Added
- Seed expanded 169 → 260 bookmarks across 29 categories (SEED_VERSION 4)
- New categories: Scripting, Python, Blogs, Reddit, Low Vision & RP, Making Money, Gospel Study, Idea Generation
- Expanded: Tools (+5 YNAB entries), Job Search (+6 boards/negotiation)

## [v1.1] — 2026-04-12
### Added
- Grouped collapsible category sections (alphabetical; My Projects always last)
- Pinned bookmarks section (star icon)
- Per-bookmark detail panel: status, progress 0–100%, notes, last visited
- Click tracking: visit count + lastVisited timestamp
- Status pills on bookmark rows (In Progress / Completed)
- Seed expanded 48 → 169 bookmarks across 21 categories (SEED_VERSION 3)

## [v1.0] — 2026-04-11
### Added
- CRA scaffold (react-scripts 5.0.1)
- localStorage persistence (key: `chase_knowledge_base_v1`)
- Inline styles via `s` object (no Tailwind)
- ErrorBoundary
- CI via `portfolio-web-build.yml`
- 48 seed bookmarks across 12 categories (SEED_VERSION 1→2)
- Deployed to Vercel: https://knowledge-base-beta-five.vercel.app
