# Changelog — Ash Reader iOS

## [0.3.0] — 2026-04-17

### Added
- **Themes tab** — 12 accordion cards parsed from `themes.md`; each expands to a `ChunkReaderView` scoped to that section with per-theme sent-chunk tracking (`ash_reader_ios_theme_{id}_sent`)
- **Actions tab** — ~190 action items grouped by theme, checkbox toggle, filter bar (All / Incomplete / Done), animated progress bar; stored in `ash_reader_ios_action_{themeId}_{index}`
- **Settings tab** — prompt prefix toggle + `TextEditor`, export progress as JSON (share sheet), import from Files, destructive reset with confirmation alert
- **SummaryView** — at top of Themes tab; loads `summary.json`, size picker (1k/1.5k/2k), copy with markdown strip + prefix
- **ThemeParser.swift** — `parseThemes(_:)` + `ThemeSection` struct; port of `lib/themes.ts`
- **`stripMarkdown(_:)`** in `Chunker.swift` — 9-regex pipeline; all copies (Reader + Themes + Summary) go through it
- **Prompt prefix** — when enabled in Settings, prepended to every chunk/summary copy
- **Haptic feedback** — `UIImpactFeedbackGenerator(.medium)` on Copy; `.light` on Mark Sent and action toggle
- **App icon refresh** — P6 "AR" monogram, black `#0f0f0f` on electric yellow `#f5e300`; `design/app-icon.svg` + `design/generate-app-icons.sh` (qlmanage + sips, no external deps)
- **`ProgressStore(key:)`** — storage key is now an init argument; default `ash_reader_ios_sent` keeps Reader backward-compatible
- **`ChunkReaderView`** — accepts `storageKey`, `promptPrefix`, `showSizeControl` props; yellow accent throughout
- **`docs/BRANDING.md`** — palette, icon spec, generation pipeline
- **26 unit tests** — `parseThemes` (8 cases), `stripMarkdown` (9 regex cases), `ProgressStore(key:)` (3 cases), chunker (2 existing)

### Changed
- `ContentView` → `TabView` with 4 tabs (Reader / Themes / Actions / Settings); doc-loading logic moved into private `ReaderTab` subview
- Tab tint updated to `#f5e300` (electric yellow); dark color scheme forced app-wide
- `themes.md` + `summary.json` bundled as resources; gitignored (personal content)

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
