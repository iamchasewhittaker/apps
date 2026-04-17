# Roadmap — Ash Reader

## Shipped ✅
- v1.0: Reader, Themes, Actions, Settings tabs
- Deployed to ash-reader.vercel.app
- Shipyard integration

## Next: iOS App 📱
**Priority: High**

Native SwiftUI version of ash-reader for iPhone. Goals:
- Offline-first (no network needed)
- Native share sheet (copy chunk → share directly to Ash app or Safari)
- Haptic feedback on mark-as-sent
- iCloud sync for progress (instead of JSON export/import)
- Larger touch targets, native scroll behavior
- Push notification reminders ("You have 12 chunks left")

Stack: SwiftUI + `@AppStorage` / `UserDefaults` for progress

## Phase 2 (web)
- **Import new document**: Upload a new `.txt` conversation file to process through the app
- **Export full document**: Download the chunked text as a formatted PDF
- **Chunk jump**: Tap chunk number to jump directly to any chunk
- **Session notes**: Freetext field per chunk to jot what Ash said about it

## Backlog
- Dark/light mode toggle
- Themes page: show which themes have chunks already marked as sent
- Actions: link each action to its source chunk in Reader
- Summary regeneration UI (trigger from Settings without CLI)
