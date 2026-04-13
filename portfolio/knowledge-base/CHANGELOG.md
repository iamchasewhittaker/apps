# Changelog — Knowledge Base

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
