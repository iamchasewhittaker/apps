# Roadmap — Ash Reader iOS

## Shipped

### v0.1.0 — 2026-04-17
- Initial SwiftUI app: paste input, smart Q&A chunker, chunk reader, progress tracking

### v0.2.0 — 2026-04-17
- Doc baked in (`doc.txt` bundle resource) — no paste needed
- App icon: "ASH" Futura bold, blue on dark
- Chunker fix: recursive segment refinement prevents 20k-word chunks
- Settings sheet with correct 1k/1.5k/2k labels

## Planned

### Phase 2 — Themes & Navigation
- [ ] Bundle `themes.md` + `summary.json` from `../ash-reader/public/`
- [ ] `ThemeParser.swift` — parse `## ` headings into `Theme` structs with title, content, action items, slug ID
- [ ] `ThemesView.swift` — scrollable list of 12 themes, each expands to ChunkReader; per-theme progress bar
- [ ] `SummaryView.swift` — size picker + copy button for AI-generated summaries at top of Themes tab
- [ ] Replace `ContentView` root with `TabView` — 4 tabs: Reader (📖), Themes (🗂), Actions (✅), Settings (⚙️)
- [ ] Per-theme UserDefaults keys: `ash_reader_ios_theme_{themeId}_sent`

### Phase 3 — Actions
- [ ] Parse action items (bullet points under each theme) from `themes.md`
- [ ] `ActionsView.swift` — items grouped by theme, tap to toggle completion
- [ ] Filter bar: all / incomplete / done
- [ ] Progress summary: "X of Y complete"
- [ ] UserDefaults keys: `ash_reader_ios_action_{themeId}_{index}`

### Phase 4 — Settings & Polish
- [ ] `SettingsView.swift` — prompt prefix toggle + `TextEditor`, reset to default button
- [ ] Prompt prefix prepended on all chunk copies (reader + themes)
- [ ] Export/import progress JSON via share sheet (Files app)
- [ ] Haptic feedback: `UIImpactFeedbackGenerator(.medium)` on copy; `.light` on mark sent
- [ ] Markdown stripping on copy (port `stripMarkdown` from `ash-reader/lib/chunker.ts`)
- [ ] Share sheet instead of silent clipboard write

### Backlog
- [ ] iCloud sync for progress (`NSUbiquitousKeyValueStore` replacing UserDefaults)
- [ ] Session/streak tracking
