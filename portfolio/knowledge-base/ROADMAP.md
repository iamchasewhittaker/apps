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

## v1.0 — Shipped (CRA conversion)
- [x] **Swap `window.storage` → `localStorage`** — new key `chase_knowledge_base_v1`
- [x] **CRA scaffold** — `package.json`, `public/index.html`, `src/` structure (react-scripts, not Vite)
- [x] **Inline styles** — converted Tailwind to `s` style object (portfolio convention)
- [x] **ErrorBoundary** — standard portfolio pattern
- [x] **CI** — added to `portfolio-web-build.yml`
- [ ] **Deploy to Vercel** — connect repo, auto-deploy on push

## v1.1 — Next
- [ ] **Import / export JSON** — backup + portability
- [ ] **Favicons** — show site icons next to each bookmark

## v1.2 — Make it scale as a KB
- [ ] Tags (multiple per bookmark, separate from single category)
- [ ] Pinned / favorites section at top
- [ ] Notes field per bookmark
- [ ] Sort options (recent / alphabetical / category)

## v1.3 — Quality of life
- [ ] Keyboard shortcuts (`/` to focus search, `n` for new)
- [ ] Duplicate URL detection on add
- [ ] "Last visited" tracking
- [ ] Collapsible category groups

## Later — Ideas parking lot
- Bulk edit / multi-select
- Drag to reorder
- Broken link checker
- Themed color accents per category
- Share a category as a read-only list
- Quick-add from clipboard (paste URL -> auto-fill title)
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
