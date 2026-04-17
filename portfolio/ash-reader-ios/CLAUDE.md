# ash-reader-ios

Native SwiftUI companion to [ash-reader](../ash-reader) — the full 138k-word capture system conversation is baked in. Opens directly to the reader, no paste needed.

## Stack
- SwiftUI + iOS 17+
- UserDefaults for progress persistence
- No backend, no network — fully offline

## Key files
- `AshReader/Chunker.swift` — Q&A-aware smart chunker; recursively refines oversized segments (paragraphs → sentences)
- `AshReader/ChunkReaderView.swift` — chunk cards, copy, mark-sent, progress bar, nav, size settings sheet
- `AshReader/ProgressStore.swift` — UserDefaults persistence for sent chunk tracking
- `AshReader/ContentView.swift` — root view, loads doc.txt from bundle, passes chunks to reader; `Color(hex:)` extension lives here
- `AshReader/Models.swift` — `Chunk` struct
- `AshReader/doc.txt` — bundled 138k-word capture system conversation (gitignored in ash-reader web, baked here)
- `AshReader/Assets.xcassets` — app icon ("ASH" Futura bold, blue #7c9cff on dark)

## Bundle ID
`com.chasewhittaker.AshReader`

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

Or open `AshReader.xcodeproj` in Xcode and hit ⌘R.

## UserDefaults keys
- `ash_reader_ios_sent` — array of Int chunk indices marked as sent (reader tab)
- (planned) `ash_reader_ios_prompt_prefix` — custom Claude prompt text
- (planned) `ash_reader_ios_prompt_prefix_on` — "1" if prompt prefix enabled
- (planned) `ash_reader_ios_theme_{themeId}_sent` — sent chunks per theme
- (planned) `ash_reader_ios_action_{themeId}_{index}` — action item completion
