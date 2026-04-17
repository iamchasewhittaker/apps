# Roadmap — Ash Reader

## Shipped ✅
- v1.0: Reader, Themes, Actions, Settings tabs — deployed to ash-reader.vercel.app
- v1.1: Smart Q&A chunker (`chunkSmart`), paste-in mode, graceful missing-file handling
- iOS v0.1: SwiftUI app scaffolded (`ash-reader-ios`), built + deployed to iPhone

## iOS Next 📱
- Haptic feedback on mark-as-sent
- Native share sheet (copy chunk → share directly to Ash)
- iCloud sync for progress (instead of JSON export/import)
- Push notification reminders ("You have 12 chunks left")
- App icon + branding (`docs/BRANDING.md`)

## Phase 2 (web)
- **Deploy v1.1** to ash-reader.vercel.app (`vercel --prod`)
- **Import new document**: Upload a new `.txt` conversation file to process through the app
- **Export full document**: Download the chunked text as a formatted PDF
- **Chunk jump**: Tap chunk number to jump directly to any chunk
- **Session notes**: Freetext field per chunk to jot what Ash said about it

## Backlog
- Dark/light mode toggle
- Themes page: show which themes have chunks already marked as sent
- Actions: link each action to its source chunk in Reader
- Summary regeneration UI (trigger from Settings without CLI)
