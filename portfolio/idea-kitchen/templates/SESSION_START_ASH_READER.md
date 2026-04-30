# Session Start — Ash Reader (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-17** — v1.0 shipped: Reader (full 138k-word doc chunked at 1k/1.5k/2k words), Themes (14 sections + summaries at 3 word counts), Actions (190 items grouped by theme), Settings (export/import progress, Ash prompt prefix)
- **2026-04-17** — Deployed to ash-reader.vercel.app (Next.js 16 + React 19 + TypeScript + Tailwind 4)
- **2026-04-17** — v1.1 shipped: smart Q&A chunker (`chunkSmart`) breaking at exchange boundaries, paste-in mode on Reader tab, graceful missing-file handling
- **2026-04-17** — iOS companion (ash-reader-ios) scaffolded: SwiftUI PasteInputView + ChunkReaderView + Swift port of Q&A chunker, built + deployed to iPhone 12 Pro Max

---

## Still needs action

- Deploy web v1.1 to Vercel (`vercel --prod`) to push smart chunker + paste UI live
- Data files (`doc.txt`, `themes.md`, `summary.json`) are gitignored and local-only; deploy requires `vercel --prod` (not GitHub auto-deploy)

---

## Ash Reader state at a glance

| Field | Value |
|-------|-------|
| Version | v1.1 |
| URL | ash-reader.vercel.app |
| Storage key | `ash_reader_` prefix (multiple localStorage keys) |
| Stack | Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + pnpm, no backend |
| Linear | [Linear](https://linear.app/whittaker/project/ash-reader-c2d6692cd906) |
| Last touch | 2026-04-17 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/ash-reader/CLAUDE.md | App-level instructions + stack + key files |
| portfolio/ash-reader/HANDOFF.md | Session state + deploy instructions |
| portfolio/ash-reader/lib/chunker.ts | Word chunking + Q&A-aware smart splitting |
| portfolio/ash-reader/lib/progress.ts | localStorage helpers (chunks, actions, prefix, export/import) |
| portfolio/ash-reader/components/ChunkReader.tsx | Reusable chunker UI component |
| portfolio/ash-reader/app/page.tsx | Main reader page |

---

## Suggested next actions (pick one)

1. Deploy v1.1 to Vercel (`vercel --prod`) to push smart chunker + paste UI live
2. Add chunk-jump feature (tap chunk number to jump directly to any chunk)
3. Add session notes (freetext field per chunk to jot what Ash said about it)
