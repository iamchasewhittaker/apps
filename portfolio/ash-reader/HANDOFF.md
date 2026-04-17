# ash-reader — Handoff

## State

| Key | Value |
|-----|-------|
| Status | ✅ Live |
| URL | https://ash-reader.vercel.app |
| Last deploy | 2026-04-17 |
| Focus | Shipped v1 |
| Next | See Roadmap |

## What it does

4-tab mobile-friendly web app for processing a 138k-word ChatGPT conversation about capture system struggles:

- **Reader** — chunks the full doc into 1000/1500/2000-word segments; Copy (markdown stripped) + Mark as sent; progress bar; localStorage persistence
- **Themes** — 14 thematic sections from `organized_thread.md`; document summary at 3 word lengths; per-theme chunker
- **Actions** — 190 action items extracted from the conversation, grouped by theme, filterable, with checkboxes
- **Settings** — export/import progress JSON (for device transfer); Ash prompt prefix toggle + editor

## Data files (local only, gitignored)
- `public/doc.txt` — 138k words, 789KB
- `public/themes.md` — organized_thread.md (12 sections)
- `public/summary.json` — therapeutic summaries at 1000/1500/2000 words

## Roadmap
- Export full document as formatted file
- Import a new conversation to process
