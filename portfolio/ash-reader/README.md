# Ash Reader

Mobile-friendly web app for processing the 138k-word ChatGPT capture system conversation with [Ash](https://www.talktoash.com).

**Live:** https://ash-reader.vercel.app

## What it does

Copy chunks of your capture system conversation into Ash for therapeutic processing. Three tabs:

| Tab | Purpose |
|-----|---------|
| **Reader** | Full document chunked at 1000/1500/2000 words. Copy (markdown stripped), Mark as sent, progress tracking. |
| **Themes** | 14 thematic sections + document summary at 3 word lengths. Per-theme chunker with same copy/mark flow. |
| **Actions** | 190 action items extracted from the conversation, grouped by theme. Filterable checklist with progress bar. |
| **Settings** | Export/import progress JSON for cross-device sync. Ash prompt prefix toggle + editor. |

## Data files (local only)

The document data is **not committed to git** (personal mental health content):
- `public/doc.txt` — 138k word conversation
- `public/themes.md` — 12-section thematic breakdown (`organized_thread.md`)
- `public/summary.json` — therapeutic summaries at 1000/1500/2000 words
- `source-docs/` — original RTF + PDF archive

These files exist locally and are included in Vercel deploys via `vercel --prod`.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- No backend — localStorage only
- pnpm

## Commands

```bash
pnpm dev                    # local dev server
pnpm build                  # production build check
vercel --prod               # deploy (uploads local data files)

# Regenerate therapeutic summary (needs ANTHROPIC_API_KEY):
ANTHROPIC_API_KEY=sk-... node scripts/generate-summary.mjs
```

## iOS app (roadmap)

A native SwiftUI version is planned as the next phase.
