# ash-reader-ios — Handoff

## State

| Key | Value |
|-----|-------|
| Status | 🟡 Local (v0.3) |
| Device | iPhone 12 Pro Max (A0C65578-B1E0-4E96-A1EC-EEB8913BD11C) |
| Last build | 2026-04-17 |
| Focus | Phase 5 — iCloud sync + push reminders (backlog) |
| Blocking | None |

## What it does (as of v0.3)

SwiftUI iPhone app with full feature parity to ash-reader web v1.1. The 138k-word capture system conversation is baked in as `doc.txt`. Four tabs:

- **Reader** — chunks the full conversation at 1k/1.5k/2k words; Copy (strips markdown, prepends prompt prefix if enabled), Mark Sent, progress bar, gear to resize
- **Themes** — 12 thematic sections parsed from `themes.md`; each accordion expands to its own ChunkReader scoped to that section; AI summary picker (1k/1.5k/2k) at top via `summary.json`
- **Actions** — ~190 action items grouped by theme, checkboxes, filter bar (All / Incomplete / Done), animated progress bar
- **Settings** — prompt prefix toggle + editor, export/import progress JSON, reset all

Haptic feedback on Copy (medium) and Mark Sent / action toggle (light). All text copied through `stripMarkdown` pipeline.

## Open in Xcode

```
open /Users/chase/Developer/chase/portfolio/ash-reader-ios/AshReader.xcodeproj
```

Hit ⌘R to run on connected iPhone, or ⌘U to run 26 unit tests.

## Feature parity table (v0.3)

| Feature | Web | iOS |
|---------|-----|-----|
| Tab navigation (Reader / Themes / Actions / Settings) | ✅ | ✅ |
| Themes tab — 12 sections, each with ChunkReader | ✅ | ✅ |
| AI summary picker (1k/1.5k/2k) | ✅ | ✅ |
| Actions tab — grouped checklist, filter bar, progress | ✅ | ✅ |
| Settings — prompt prefix toggle + editor | ✅ | ✅ |
| Export/import progress JSON | ✅ | ✅ |
| Markdown stripping on copy | ✅ | ✅ |
| Haptic feedback | — | ✅ |
| iCloud sync | ❌ | ❌ |
| Push reminders | ❌ | ❌ |

## Next (Phase 5 — backlog)

- iCloud sync via `NSUbiquitousKeyValueStore` (replace UserDefaults for cross-device progress)
- Push notification reminders to continue reading
- Session/streak tracking
