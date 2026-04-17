# Changelog — Ash Reader

## [1.0.0] — 2026-04-17

### Added
- **Reader tab**: Full 138k-word document chunked at 1000/1500/2000 words
  - Word + character count per chunk
  - Copy button with markdown stripped (clean paste into Ash)
  - Optional Ash prompt prefix prepended on copy
  - Mark as sent toggle with localStorage persistence
  - Progress bar (X of N sent)
  - Prev/Next navigation, auto-jumps to first unsent chunk
- **Themes tab**: 14 thematic sections parsed from `organized_thread.md`
  - Document summary at 1000/1500/2000 words (generated via Claude API)
  - Per-theme accordion with embedded chunker + copy/mark flow
- **Actions tab**: 190 action items extracted from conversation
  - Grouped by theme, filterable (All/Incomplete/Done)
  - Checkbox per action with localStorage persistence
  - Progress bar with percentage
- **Settings tab**:
  - Export progress → `ash-reader-progress.json` download
  - Import progress → restores all localStorage from JSON file
  - Ash prompt prefix toggle + editable text field
- Dark theme, mobile-first layout with bottom tab nav
- iPhone safe-area inset support
- Deployed to https://ash-reader.vercel.app via Vercel

### Technical
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- Static site generation (all pages prerendered)
- `doc.txt`, `themes.md`, `summary.json` gitignored (personal data)
- Shipyard scan integration: auto-discovered and upserted
