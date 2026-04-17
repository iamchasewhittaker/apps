# Learnings — Ash Reader iOS

## 2026-04-17

### Chunker: Q&A turn segments can be arbitrarily large
**Problem:** The doc has only 7 Q&A turn markers across 138k words, so turns average ~20k words each. The chunker loop never closed a chunk because no single segment fit within `lo`..`hi` — the whole turn was one massive segment (reported as 23,940 words in chunk 1).
**Fix:** Added `refineSegments()` — recursive function that splits any segment exceeding `hi` by paragraphs, then sentences. Called before the assembly loop so all input segments are guaranteed to be ≤ `hi`.
**Lesson:** Always preprocess input segments before running the assembly loop. The loop logic assumes segments are smaller than the target — if they're not, nothing ever closes.

### Color extension must be in a shared file
**Problem:** `Color(hex:)` extension was defined at the bottom of `PasteInputView.swift`. When that file was deleted, the extension disappeared and the build broke with "extraneous argument label 'hex:' in call" errors across all views.
**Fix:** Moved extension to `ContentView.swift` (root view file, always compiled).
**Lesson:** Shared extensions belong in a dedicated shared file — not tacked onto a view that might be deleted. For next iOS project, create `Extensions.swift` up front.

### Integer division kills 1.5k label
**Problem:** `"\(size / 1000)k words"` with `size = 1500` gives "1k words" due to Swift integer division (1500 / 1000 = 1). Settings sheet was showing "1k / 1k / 2k".
**Fix:** `sizeLabel()` helper that uses `Double(size) / 1000` and formats to 1 decimal only when non-integer (`truncatingRemainder` check).
**Lesson:** Never use integer division for display labels when fractional values are possible.

### PBXBuildFile vs PBXFileReference — two separate entries required
When adding a file to an Xcode project by editing `project.pbxproj` manually, four places need updating:
1. `PBXFileReference` section — declares the file exists on disk
2. `PBXBuildFile` section — says "include this in a build phase"
3. The build phase `files` array (`PBXSourcesBuildPhase` for .swift, `PBXResourcesBuildPhase` for assets/data)
4. The `PBXGroup` `children` array — so it shows in Xcode's file navigator
Missing any one of these causes silent failures or "file not found" build errors.
