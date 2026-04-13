# Roadmap — Knowledge Base

MVP-first. Ship one slice at a time. Nothing on this list is committed until it's pulled into "Now."

## Vision
One page for everything Chase needs to reach fast: AI tool docs, his own projects, and a general knowledge base of links. No more hunting across browsers, notes, and chats.

## v0.1 — Shipped
- Dark mode UI
- 10 seed bookmarks (Claude, ChatGPT, Codex, Gemini, Antigravity, Cursor)
- Search bar (title / url / category)
- Category filter pills
- Add / edit / delete
- Persistent storage

## v0.2 — Shipped
- Expanded seed list to 22 bookmarks
- New categories: Prompting, Learning, Dev Tools, Community

## v0.3 — Shipped
- [x] **"My Projects" category** — 7 portfolio app links
- [x] **Project folder setup** — moved into monorepo at `portfolio/knowledge-base/` with Product Build Framework docs

## v1.0 — Shipped
- [x] **Swap `window.storage` → `localStorage`** — new key `chase_knowledge_base_v1`
- [x] **CRA scaffold** — `package.json`, `public/index.html`, `src/` structure (react-scripts, not Vite)
- [x] **Inline styles** — converted Tailwind to `s` style object (portfolio convention)
- [x] **ErrorBoundary** — standard portfolio pattern
- [x] **CI** — added to `portfolio-web-build.yml`
- [x] **Seed expanded** — 48 bookmarks across 12 categories (Apple Developer, Perplexity, full My Projects)
- [x] **Seed migration** — version-based; existing users get new entries without losing custom bookmarks
- [x] **Deploy to Vercel** — https://knowledge-base-beta-five.vercel.app

## v1.1 — Shipped
- [x] **Grouped collapsible sections** — bookmarks under category headers, alphabetical, My Projects last
- [x] **Pinned bookmarks** — star to promote to top Pinned section
- [x] **Per-bookmark tracking** — status, progress 0–100%, notes, last visited, visit count
- [x] **Click tracking** — auto-increments visits + sets lastVisited on link open
- [x] **Expanded Add/Edit form** — description, status, progress, notes
- [x] **Seed expanded to 169 bookmarks across 21 categories** — Job Search, GMAT, Coding, Web Dev, iOS Dev, Design, Architecture, GitHub, Swift, Tools + expanded AI categories
- [x] **SEED_VERSION 3 migration**

## v1.2 — Shipped
- [x] **Seed expanded 169 → 260 bookmarks across 29 categories** — all URLs verified active
  - New: Scripting, Python, Blogs, Reddit, Low Vision & RP, Making Money, Gospel Study, Idea Generation
  - Expanded: Tools (+5 YNAB), Job Search (+6 boards/negotiation)
- [x] **SEED_VERSION 4 migration**

## v1.3 — Shipped
- [x] **Category organization menu** — inline panel: reorder (up/down), rename, merge, delete empty, reset A–Z; custom order persists
- [x] **Importance ranking** — High/Med/Low field on bookmarks; colored badge on rows; selector in detail panel; "Important" filter pill (flat ranked list)
- [x] **Storage migration** — blob shape upgraded to `{ bookmarks, categoryOrder }`; auto-migrates old data

## v2.0 — Shipped
- [x] **ARC sidebar + Chrome folder redesign** — two-panel layout; collapsible 280px sidebar; nested folder hierarchy; folder CRUD; favorites shelf; smart folders; home view; search with breadcrumbs; keyboard shortcuts; mobile overlay; component extraction (6 files); SEED_VERSION 5 migration

## v2.0.1 — Shipped
- [x] **Theme alignment** — portfolio-wide BASE token sweep (`#0f1117` bg, `#161b27` surface, `#1f2937` border, `#6b7280` muted, `#f3f4f6` text); DM Sans font (2026-04-13)

## v2.1 — Next
- [ ] **Deploy v2.0 to Vercel** — push and verify live URL works with migrated localStorage data
- [ ] **Import / export JSON** — backup + portability (export downloads file; import merges without duplicating)
- [ ] **Favicons** — show site favicons next to each bookmark row

## v2.2 — Quality of life
- [ ] Drag-and-drop reordering within a folder and between folders
- [ ] Tags (multiple per bookmark, cross-folder filtering)
- [ ] Sort options within folder view (alphabetical / most visited / date added)
- [ ] Duplicate URL detection on add

## Later — Ideas parking lot
- Bulk edit / multi-select
- Broken link checker
- Themed color accents per folder
- Share a folder as a read-only list
- Quick-add from clipboard (paste URL → auto-fill title)
- Supabase sync (follow portfolio pattern)

## Out of scope (for now)
- Multi-user / accounts
- Browser extension
- Syncing to external services (Raindrop, Pocket, etc.)
- AI-powered auto-categorization

## Definition of done (for any item)
1. Works on first load with empty storage
2. Works on reload with existing data
3. Doesn't break existing features
4. Builds and deploys cleanly (`npm run build`)
5. Matches dark mode aesthetic
