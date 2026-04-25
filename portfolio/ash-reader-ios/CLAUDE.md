# ash-reader-ios

Native SwiftUI companion to [ash-reader](../ash-reader) — the full 138k-word capture system conversation is baked in. Opens directly to the reader, no paste needed.

**Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — palette, app icon spec (P6 electric yellow "AR"), generation pipeline.

## What This App Is

The native SwiftUI companion to Ash Reader — the full 138k-word capture system conversation is baked directly into the app bundle, so it opens straight to the reader without any paste step. Features four tabs (Reader, Themes, Actions, Settings), smart Q&A-aware chunking, mark-as-sent tracking, and fully offline operation via UserDefaults.

## Stack
- SwiftUI + iOS 17+
- UserDefaults for progress persistence (`ash_reader_ios_` prefix)
- No backend, no network — fully offline

## Key files

### App
- `AshReader/AshReaderApp.swift` — `@main` entry point
- `AshReader/ContentView.swift` — `TabView` (Reader / Themes / Actions / Settings); `Color(hex:)` extension; `ReaderTab` subview
- `AshReader/Models.swift` — `Chunk` struct
- `AshReader/ProgressStore.swift` — UserDefaults persistence; `init(key:)` for per-tab isolation

### Reader tab
- `AshReader/Chunker.swift` — Q&A-aware smart chunker + `stripMarkdown(_:)` helper
- `AshReader/ChunkReaderView.swift` — chunk cards, copy (+stripMarkdown +prefix), mark-sent, progress bar, haptics, optional size settings
- `AshReader/doc.txt` — bundled 138k-word capture system conversation (gitignored)

### Themes tab
- `AshReader/ThemesView.swift` — 12 accordion cards; `SummaryView` at top
- `AshReader/ThemeParser.swift` — `parseThemes(_:)` + `ThemeSection` struct
- `AshReader/SummaryView.swift` — summary.json picker (1k/1.5k/2k) + copy
- `AshReader/themes.md` — 12 thematic sections with actions (gitignored)
- `AshReader/summary.json` — precomputed AI summaries (gitignored)

### Actions tab
- `AshReader/ActionsView.swift` — grouped checklist, filter bar (All/Incomplete/Done), progress bar, light haptic on toggle

### Settings tab
- `AshReader/SettingsView.swift` — prompt prefix toggle + editor, export/import JSON progress, reset; `defaultPromptPrefix` constant

### Assets
- `AshReader/Assets.xcassets/AppIcon.appiconset/` — 12 PNGs from P6 SVG
- `design/app-icon.svg` — canonical P6 source ("AR" monogram, black on `#f5e300`)
- `design/generate-app-icons.sh` — renders SVG → 12 PNGs via `qlmanage` + `sips` (no external deps)

## Bundle ID
`com.chasewhittaker.AshReader`

## Pre-build prerequisite (2017 MBP · Ventura · Xcode 15.2)

Mount the iOS 17.2 runtime DMG once per session before any `xcodebuild` call — see root `CLAUDE.md § iOS Build Prerequisite` for the full command. SDK plist patch is persistent; only the DMG mount is needed after reboot.

## Build + run on device
```bash
xcodebuild \
  -project AshReader.xcodeproj \
  -scheme AshReader \
  -destination "id=A0C65578-B1E0-4E96-A1EC-EEB8913BD11C" \
  -configuration Debug \
  CODE_SIGN_STYLE=Automatic \
  DEVELOPMENT_TEAM=9XVT527KP3 \
  -allowProvisioningUpdates \
  build

APP=$(find ~/Library/Developer/Xcode/DerivedData/AshReader-* -name "AshReader.app" -path "*/Debug-iphoneos/*" | head -1)
xcrun devicectl device install app --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C "$APP"
xcrun devicectl device process launch --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C com.chasewhittaker.AshReader
```

## Run tests
```bash
xcodebuild \
  -project AshReader.xcodeproj \
  -scheme AshReader \
  -destination "id=A0C65578-B1E0-4E96-A1EC-EEB8913BD11C" \
  -configuration Debug \
  CODE_SIGN_STYLE=Automatic \
  DEVELOPMENT_TEAM=9XVT527KP3 \
  -allowProvisioningUpdates \
  test 2>&1 | grep -E "(Test case|TEST|Executed)"
```

Or open `AshReader.xcodeproj` in Xcode and hit ⌘U.

## UserDefaults keys (`ash_reader_ios_` prefix)
- `ash_reader_ios_sent` — `[Int]` chunk indices marked sent (Reader tab)
- `ash_reader_ios_theme_{themeId}_sent` — `[Int]` chunk indices sent per theme (Themes tab)
- `ash_reader_ios_action_{themeId}_{index}` — `"1"` / absent — action done state
- `ash_reader_ios_prompt_prefix` — `String` — custom Claude prompt prefix
- `ash_reader_ios_prompt_prefix_on` — `"1"` / absent — prefix enabled

Export/import via Settings tab writes all `ash_reader_ios_*` keys as JSON.
