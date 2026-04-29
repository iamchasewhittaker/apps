# ash-reader-ios — Handoff

## State

| Key | Value |
|-----|-------|
| Status | 🟡 Local (v0.4-dev · Phases 5–7 complete) |
| Device | iPhone 12 Pro Max (A0C65578-B1E0-4E96-A1EC-EEB8913BD11C) |
| Last build | 2026-04-29 |
| Last touch | 2026-04-29 — Phases 5–7: iCloud sync + reminders + streak tracking; 41/41 tests passing |
| Focus | Device testing: verify iCloud sync, reminders, share sheet on physical iPhone 12 Pro Max |
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
| Markdown stripping on copy + display | ✅ | ✅ |
| Haptic feedback | — | ✅ |
| iCloud sync (all progress) | ❌ | ✅ |
| Push reminders (weekday schedule) | ❌ | ✅ |
| Share button on chunks | ❌ | ✅ |
| Reading streak tracking | ❌ | ✅ |

## Implementation status

**Phases 5–7 complete (2026-04-29):**
- ✅ Phase 5: `SyncedStore.swift` wraps `NSUbiquitousKeyValueStore` with UserDefaults fallback; one-time migration; all progress keys sync
- ✅ Phase 6: `NotificationManager.swift`; weekday reminders via `UNCalendarNotificationTrigger`; SettingsView controls (DatePicker + 7 weekday toggles)
- ✅ Phase 7: `ShareSheet.swift` + `StreakStore.swift`; ChunkReaderView Share button; current/longest streak display

**Testing:** 41/41 unit tests passing (4 SyncedStore, 3 NotificationManager, 7 StreakStore, 14 existing parser/chunker/progress). Simulator notification query timing limitation documented (use absence-check tests instead).

## Next (device testing)

1. **Xcode UI step:** Target → Signing & Capabilities → + Capability → iCloud → check "Key-Value storage"
2. **Build + install on iPhone 12 Pro Max** — verify app launches, no crashes
3. **Phase 5 test:** Mark chunk sent, background app, check iCloud KV store (Xcode Organizer or device log); optionally test with second device if available
4. **Phase 6 test:** Enable reminders set 2 minutes out, lock screen, verify notification fires with correct text
5. **Phase 7 test:** Tap Share on chunk, verify sheet opens; mark chunks sent on 2 consecutive days, verify streak shows in Settings
