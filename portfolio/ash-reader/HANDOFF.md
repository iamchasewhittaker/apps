# ash-reader — Handoff

## State

| Key | Value |
|-----|-------|
| Status | ✅ Live (v1.1) |
| URL | https://ash-reader.vercel.app |
| Last deploy | 2026-04-17 |
| Focus | Smart chunker + paste UI + iOS v0.1 |
| Next | Deploy web v1.1 to Vercel; iOS: haptics, share sheet, iCloud sync |

## What it does

Mobile-friendly web app for processing a 138k-word ChatGPT conversation into Ash:

- **Reader** — paste any text OR load from `doc.txt`; Q&A-aware chunker (`chunkSmart`) breaks at exchange boundaries ±20%; Copy (markdown stripped) + Mark as sent; progress bar; localStorage persistence
- **Themes** — 14 thematic sections from `organized_thread.md`; document summary at 3 word lengths; per-theme chunker
- **Actions** — 190 action items extracted from the conversation, grouped by theme, filterable, with checkboxes
- **Settings** — export/import progress JSON (for device transfer); Ash prompt prefix toggle + editor

## iOS companion (`ash-reader-ios`)

SwiftUI app at `portfolio/ash-reader-ios/`. Bundle ID: `com.chasewhittaker.AshReader`.

- Paste view + Q&A chunker (Swift port) + chunk reader with copy/progress tracking
- Built and deployed to iPhone 12 Pro Max via `devicectl`
- Open `AshReader.xcodeproj` in Xcode to continue development

## Data files (local only, gitignored)
- `public/doc.txt` — 138k words, 789KB
- `public/themes.md` — organized_thread.md (12 sections)
- `public/summary.json` — therapeutic summaries at 1000/1500/2000 words

## Deploy web
```bash
vercel --prod   # uploads local data files + ships new chunker/paste UI
```
