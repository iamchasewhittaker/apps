# Knowledge Base — Project Instructions

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

## App Identity
- **Version:** v1.0
- **Storage key:** `chase_knowledge_base_v1` (localStorage)
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
{ id: number, title: string, url: string, category: string }
```
- `id`: `Date.now()` on creation (seed uses sequential 1–N)
- `url`: auto-prefixed with `https://` if missing
- `category`: free-text; defaults to `"Other"` if blank

## Current Features (v1.1)
- 169 seed bookmarks across 21 categories
- Grouped collapsible category sections (alphabetical; My Projects always last)
- Pinned bookmarks section at top (star icon toggles)
- Per-bookmark detail panel: status (Not Started / In Progress / Completed), progress 0–100%, notes, last visited
- Click tracking: visit count + lastVisited set on link open
- "My Projects" category with all active portfolio apps (14 entries)
- Search across title / URL / category
- Category filter pills (dynamic from data)
- Add / edit / delete bookmarks
- Persistent storage via localStorage
- Dark mode only (`#09090b` base)
- ErrorBoundary wrapping

## Commands
- `npm start` — dev server
- `npm run build` — production build

## Constraints & Gotchas
- Preserve dark mode (`#09090b` base).
- **Seed migration is in place.** `SEED_VERSION` (currently `3`) controls migration. Bump it and add new entries to `SEED` — existing users will get the new entries appended on next load without losing their custom bookmarks. `STORE_SEED_VERSION` (`chase_knowledge_base_seed_version`) tracks the last migrated version in localStorage.
- **New bookmark fields** are all optional (falsy = default). Don't break existing entries by requiring them.
- All styles live in the `s` object in `constants.js`. Hover effects use CSS classes prefixed with `kb-` injected via the `css` string.

## How to Extend
1. Read the ROADMAP.md before adding anything new.
2. One feature per iteration. Ship, test, then move on.
3. If a feature requires changing the data shape, migrate existing stored data in the `useEffect` loader.
4. Never break the seed load path — users rely on it as a fallback.
