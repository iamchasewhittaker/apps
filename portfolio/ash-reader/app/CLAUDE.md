# ash-reader

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


Personal tool for processing the capture system ChatGPT conversation with Ash.

## Stack
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- No backend — all localStorage, static pages
- pnpm

## Key files
- `public/doc.txt` — full 138k word conversation (gitignored, local only)
- `public/themes.md` — curated 12-section thematic breakdown (gitignored)
- `public/summary.json` — pre-generated therapeutic summaries at 1000/1500/2000w (gitignored)
- `lib/chunker.ts` — word chunking + markdown stripping logic
- `lib/progress.ts` — localStorage helpers (chunks, actions, prefix, export/import)
- `lib/themes.ts` — markdown section parser
- `components/ChunkReader.tsx` — reusable chunker UI (used in Reader + each theme)
- `scripts/generate-summary.mjs` — run once with ANTHROPIC_API_KEY to regenerate summary.json

## Data files are gitignored
`doc.txt`, `themes.md`, `summary.json`, and `source-docs/` are excluded from git.
They live on local disk only and are uploaded to Vercel via `vercel --prod` (not GitHub auto-deploy).

## Deploy
```
vercel --prod   # uploads local files including gitignored public/ data
```

## Regenerate summary
```
ANTHROPIC_API_KEY=sk-... node scripts/generate-summary.mjs
```
