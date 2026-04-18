# Roadmap — Ash Reader iOS

## Shipped

### v0.3.0 — 2026-04-17 (Phase 2–4 complete)
- Full feature parity with ash-reader web v1.1
- Themes tab: 12 accordion sections, each with own ChunkReader + per-theme progress
- AI summary picker (1k/1.5k/2k) at top of Themes tab via bundled `summary.json`
- Actions tab: ~190 items grouped by theme, filter bar, progress bar, checkbox persistence
- Settings tab: prompt prefix toggle + editor, export/import JSON progress, reset
- `stripMarkdown` on all copies; prompt prefix prepended when enabled
- Haptic feedback (medium on copy, light on mark sent / action toggle)
- App icon: P6 "AR" monogram, black on electric yellow `#f5e300`
- `ProgressStore(key:)` — storage key argument for multi-tab isolation
- 26 unit tests (100% pass on device)
- `docs/BRANDING.md` + `design/generate-app-icons.sh` (no external deps)

### v0.2.0 — 2026-04-17
- Doc baked in (`doc.txt` bundle resource) — no paste needed
- App icon: "ASH" Futura bold, blue on dark (replaced in v0.3)
- Chunker fix: recursive segment refinement prevents 20k-word chunks
- Settings sheet with correct 1k/1.5k/2k labels

### v0.1.0 — 2026-04-17
- Initial SwiftUI app: paste input, smart Q&A chunker, chunk reader, progress tracking

## Backlog

### Phase 5 — iCloud Sync
- [ ] `NSUbiquitousKeyValueStore` replacing UserDefaults for cross-device progress
- [ ] Migrate existing `ash_reader_ios_*` keys on first cloud-enabled launch

### Phase 6 — Reminders
- [ ] Push notification reminders to continue reading (configurable schedule)
- [ ] Local `UNUserNotificationCenter` — no server needed

### Phase 7 — Sharing
- [ ] Share sheet integration to send copied chunks directly to Ash app (if URL scheme exists)
- [ ] Session/streak tracking (days with at least 1 chunk read)

### Ideas
- [ ] Spotlight search over theme titles and action items
- [ ] Widget: "X chunks left in current theme" on home screen
