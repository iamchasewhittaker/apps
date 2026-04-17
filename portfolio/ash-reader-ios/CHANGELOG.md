# Changelog — Ash Reader iOS

## [0.2.0] — 2026-04-17

### Changed
- Baked `doc.txt` (138k-word capture system conversation) directly into the app bundle — no paste required
- App opens directly to `ChunkReaderView` (removed `PasteInputView`)
- "← Edit" button replaced with ⚙ gear → settings sheet for rechunking
- `Color(hex:)` extension moved to `ContentView.swift` (was in deleted `PasteInputView.swift`)

### Added
- `doc.txt` registered as bundle resource in `project.pbxproj`
- `Assets.xcassets/AppIcon.appiconset` — "ASH" Futura bold in blue (#7c9cff) on dark background, all required iOS sizes
- Recursive `refineSegments()` in `Chunker.swift` — prevents oversized chunks when Q&A turns span 20k+ words; splits by paragraphs → sentences
- Sentence splitter (`splitIntoSentences`) as third-level fallback in chunker
- Settings sheet: size picker (1k / 1.5k / 2k) with correct labels, resets progress + index on rechunk

### Fixed
- Chunker producing 23k-word chunks when doc had only 7 Q&A markers (segments not refined before assembly)
- Settings sheet showing "1k / 1k / 2k" (integer division of 1500 / 1000 = 1); now uses `sizeLabel()` helper

## [0.1.0] — 2026-04-17

### Added
- Initial SwiftUI app scaffolded (`AshReader.xcodeproj`)
- `PasteInputView`: TextEditor with live word count, chunk size picker (1k / 1.5k / 2k words), pasted text persisted to UserDefaults
- `ChunkReaderView`: chunk cards with word count, tap-to-copy (clipboard), Mark Sent toggle (green checkmark), progress bar, Prev/Next navigation, auto-jumps to first unsent chunk on open
- `Chunker.swift`: Swift port of web `chunkSmart` — detects Q&A turn boundaries (Human/User/ChatGPT/Assistant prefixes), ±20% size tolerance, falls back to paragraph splitting
- `ProgressStore`: `ObservableObject` backed by UserDefaults (`ash_reader_ios_sent`)
- Dark theme matching web app color palette
- Built for iOS 17+, bundle ID `com.chasewhittaker.AshReader`
- Deployed to iPhone 12 Pro Max via `xcrun devicectl`
