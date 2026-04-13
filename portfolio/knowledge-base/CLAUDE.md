# Knowledge Base — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Version:** v1.3
- **Storage key:** `chase_knowledge_base_v1` (localStorage) — blob shape: `{ bookmarks: [...], categoryOrder: [...] }`
- **URL:** https://knowledge-base-beta-five.vercel.app
- **Entry:** `src/App.jsx`

## Purpose
A personal knowledge base and bookmark manager. One page to store and quickly reach everything Chase needs: AI tool documentation, his own projects, and general reference links.

## File Structure
```
package.json           <- CRA scaffold (react-scripts 5.0.1)
public/
  index.html           <- shell with <div id="root">
src/
  index.js             <- ReactDOM.createRoot entry
  App.jsx              <- main component
  constants.js         <- SEED data, styles (s), storage helpers (load/save), STORE key
  ErrorBoundary.jsx    <- standard portfolio error boundary
bookmark-manager.jsx   <- ARCHIVED original Claude artifact
docs/
  PRODUCT_BRIEF.md     <- Phase 1: Product Definition
  PRD.md               <- Phase 2: Product Requirements
  APP_FLOW.md          <- Phase 3: UX / App Flow
CLAUDE.md              <- this file
ROADMAP.md             <- feature pipeline
HANDOFF.md             <- session continuity
```

## Tech Stack
- React 18 (Create React App) with hooks (`useState`, `useEffect`)
- Inline styles via `s` object in `constants.js` (portfolio convention)
- `css` string injected via `<style>` for hover effects
- `lucide-react` for icons
- `localStorage` for persistence (`load()` / `save()` in constants.js)

## Data Shape
```js
// localStorage blob (chase_knowledge_base_v1):
{ bookmarks: [...], categoryOrder: [...] | null }

// Bookmark:
{ id: number, title: string, url: string, category: string,
  description?: string, status?: string, progress?: number,
  notes?: string, pinned?: boolean, visits?: number,
  lastVisited?: string, importance?: 0|1|2|3 }
```
- `id`: `Date.now()` on creation (seed uses sequential 1–N)
- `url`: auto-prefixed with `https://` if missing
- `category`: free-text; defaults to `"Other"` if blank
- `importance`: 0=None, 1=Low, 2=Medium, 3=High (default 0)
- `categoryOrder`: null means default A–Z sort (My Projects last)

## Current Features (v1.3)
- 260 seed bookmarks across 29 categories
- Grouped collapsible category sections (custom order or alphabetical; My Projects last)
- **Category organization panel** — reorder, rename, merge, delete empty categories
- Pinned bookmarks section at top (star icon toggles)
- **Importance ranking** — High/Med/Low per bookmark; colored badge on rows; "Important" filter shows flat ranked list
- Per-bookmark detail panel: status, importance, progress 0–100%, notes, last visited
- Click tracking: visit count + lastVisited set on link open
- "My Projects" category with all active portfolio apps
- Search across title / URL / category / description
- Category filter pills (dynamic from data, respects custom order)
- Add / edit / delete bookmarks
- Persistent storage via localStorage
- Dark mode only (`#09090b` base)
- ErrorBoundary wrapping

## Commands
- `npm start` — dev server
- `npm run build` — production build

## Constraints & Gotchas
- Preserve dark mode (`#09090b` base).
- **Seed migration is in place.** `SEED_VERSION` (currently `4`) controls migration. Bump it and add new entries to `SEED` — existing users will get the new entries appended on next load without losing their custom bookmarks. `STORE_SEED_VERSION` (`chase_knowledge_base_seed_version`) tracks the last migrated version in localStorage.
- **Storage shape is `{ bookmarks, categoryOrder }`.** `load()` auto-detects and migrates old flat-array format. Never write a bare array back to localStorage — always use `save({ bookmarks, categoryOrder })`.
- **New bookmark fields** are all optional (falsy = default). Don't break existing entries by requiring them.
- **`persist(next)`** saves bookmarks + current categoryOrder. **`persistAll(bm, order)`** updates both. **`persistOrder(order)`** updates order only (bookmarks unchanged).
- All styles live in the `s` object in `constants.js`. Hover effects use CSS classes prefixed with `kb-` injected via the `css` string.

## How to Extend
1. Read the ROADMAP.md before adding anything new.
2. One feature per iteration. Ship, test, then move on.
3. If a feature requires changing the data shape, migrate existing stored data in the `useEffect` loader.
4. Never break the seed load path — users rely on it as a fallback.
