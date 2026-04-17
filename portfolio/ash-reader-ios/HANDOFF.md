# ash-reader-ios — Handoff

## State

| Key | Value |
|-----|-------|
| Status | 🟡 Local (v0.2) |
| Device | iPhone 12 Pro Max (A0C65578-B1E0-4E96-A1EC-EEB8913BD11C) |
| Last build | 2026-04-17 |
| Focus | Feature parity with web (Themes, Actions, Settings tabs) |
| Blocking | None — ready to implement Phase 2 |

## What it does (as of v0.2)

SwiftUI iPhone app that opens directly to the chunk reader — no paste needed. The full 138k-word capture system conversation is baked in as `doc.txt`. On launch it loads, chunks at 2000 words, and jumps to the first unsent chunk.

- **⚙ gear button** → settings sheet to change chunk size (1k/1.5k/2k), resets progress
- **Copy** → copies chunk to clipboard
- **Mark sent** → tracks progress in UserDefaults
- **Progress bar** → sent/total counter with animated fill

## Open in Xcode

```
open /Users/chase/Developer/chase/portfolio/ash-reader-ios/AshReader.xcodeproj
```

Hit ⌘R to run on connected iPhone. Or use the build + install commands in CLAUDE.md.

## Feature Parity Gap (web has, iOS does not)

| Feature | Web | iOS | Phase |
|---------|-----|-----|-------|
| Tab navigation (Reader / Themes / Actions / Settings) | ✅ | ❌ | 2 |
| Themes tab — 12 themed sections from `themes.md`, each with ChunkReader | ✅ | ❌ | 2 |
| Summary display — AI-generated 1k/1.5k/2k summaries at top of Themes | ✅ | ❌ | 2 |
| Actions tab — extracted action items, checkbox completion, filter all/done/incomplete | ✅ | ❌ | 3 |
| Settings tab — prompt prefix toggle + editor, export/import progress JSON | ✅ | ❌ | 4 |
| Prompt prefix — custom text prepended when copying chunks | ✅ | ❌ | 4 |
| Markdown stripping on copy | ✅ | ❌ | 4 |
| `themes.md` bundled in app | ❌ | ❌ | 2 |
| `summary.json` bundled in app | ❌ | ❌ | 2 |
| Haptic feedback (copy, mark sent) | ❌ | ❌ | 4 |

## Next

**Phase 2 — Themes & Navigation** (highest priority):
1. Bundle `themes.md` and `summary.json` from `../ash-reader/public/` into iOS project
2. Create `ThemeParser.swift` — port of `lib/themes.ts`, parses `## ` headings into sections + action items
3. Create `ThemesView.swift` — collapsible list of 12 themes, each expands to its own ChunkReader
4. Create `SummaryView.swift` — size picker + copy for AI-generated summaries at top of Themes tab
5. Add `TabView` to `ContentView.swift` with 4 tabs: Reader (📖), Themes (🗂), Actions (✅), Settings (⚙️)

**Phase 3 — Actions tab**:
1. Parse action items (bullet points) from each theme section in `themes.md`
2. `ActionsView.swift` — grouped by theme, checkbox toggle per item
3. Filter bar: all / incomplete / done
4. `ash_reader_ios_action_{themeId}_{index}` UserDefaults keys

**Phase 4 — Settings & Polish**:
1. `SettingsView.swift` — prompt prefix toggle, text editor, reset button
2. Prompt prefix prepended on chunk copy in `ChunkReaderView`
3. Export/import progress as JSON (Files app share sheet)
4. Haptic feedback: `UIImpactFeedbackGenerator` on copy + mark sent
5. Markdown stripping on copy (port `stripMarkdown` from web `lib/chunker.ts`)
