@AGENTS.md

# ash-reader

Personal tool for processing the capture system ChatGPT conversation with Ash.

- **URL:** https://ash-reader.vercel.app

## Stack
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- No backend — all localStorage, static pages
- pnpm

## Key files
- `public/doc.txt` — full 138k word conversation (gitignored, local only)
- `public/themes.md` — curated 12-section thematic breakdown (gitignored)
- `public/summary.json` — pre-generated therapeutic summaries at 1000/1500/2000w (gitignored)
- `lib/chunker.ts` — word chunking + markdown stripping
- `lib/progress.ts` — localStorage helpers (chunks, actions, prefix, export/import)
- `lib/themes.ts` — markdown section parser
- `components/ChunkReader.tsx` — reusable chunker UI
- `scripts/generate-summary.mjs` — run once with ANTHROPIC_API_KEY to regenerate summary.json

## Data files are gitignored
`doc.txt`, `themes.md`, `summary.json`, `source-docs/` excluded from git.
Deploy with `vercel --prod` (not GitHub auto-deploy) to include local data files.

## Commands
```
pnpm dev                                          # local dev
vercel --prod                                     # deploy with data files
ANTHROPIC_API_KEY=sk-... node scripts/generate-summary.mjs  # regenerate summary
```
