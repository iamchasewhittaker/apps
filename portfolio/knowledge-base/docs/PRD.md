# Knowledge Base — Product Requirements

> Phase 2 of the [Product Build Framework](../../PRODUCT_BUILD_FRAMEWORK.md)

## Problem

Chase saves links across multiple browsers, note apps, and AI chats. When he needs a specific doc or project URL, he has to hunt through tabs and history. There is no single, fast page that holds everything worth remembering.

## Users

Chase — solo developer maintaining a portfolio of apps (web + iOS). Primary use cases:
- Quick access to AI tool documentation while building
- Jumping to his own deployed apps, repos, and dashboards
- Storing reference links (articles, tools, learning resources)

## User Stories

- As a user, I want to search my bookmarks so I can find a link in under 2 seconds
- As a user, I want to filter by category so I can browse a topic area quickly
- As a user, I want to add a new bookmark so I can save a link I just found
- As a user, I want to edit a bookmark so I can fix a title or re-categorize it
- As a user, I want to delete a bookmark so I can remove links I no longer need
- As a user, I want my bookmarks to persist across reloads so I don't lose my data
- As a user, I want to see my own projects as a first-class category so I can jump to any app fast

## V1 Features (shipped in v0.1–v0.3)

- Dark mode UI (`bg-zinc-950`)
- 22 seed bookmarks across 8 AI categories
- "My Projects" category with 7 portfolio app links
- Full-text search (title / URL / category)
- Category filter pills (dynamically generated)
- Add bookmark (title, URL, category)
- Edit bookmark inline
- Delete bookmark
- Auto-prefix `https://` on URLs missing protocol
- Persistent storage via `window.storage`

## Not in V1

- Import / export JSON (v0.3 stretch)
- Favicons next to bookmarks (v0.3 stretch)
- Tags (multiple per bookmark) — v0.4
- Pinned / favorites — v0.4
- Notes field per bookmark — v0.4
- Sort options — v0.4
- Keyboard shortcuts — v0.5
- Duplicate URL detection — v0.5
- Multi-user / accounts
- Browser extension
- External service sync (Raindrop, Pocket)
- AI auto-categorization

## Success Metrics

- User can find any link in 2 interactions or fewer (search or filter + click)
- Works on first load with empty storage (seed loads correctly)
- Works on reload with existing data (persistence is reliable)
- All CRUD operations function without errors
- "My Projects" pill appears and filters correctly
