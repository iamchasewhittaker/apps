# Learnings — Shipyard (iOS)

## 2026-04-17 (Phase 1 scaffold session)

**Never run concurrent `xcodebuild` commands against the same project.**
Multiple simultaneous `xcodebuild test` invocations fight for `Build/Intermediates/XCBuildData/build.db`.
When locked, processes silently block for 30+ minutes without output. Fix: always use
`-derivedDataPath /tmp/<unique-slug>` per run to fully isolate DerivedData, and never launch
a second xcodebuild until the first exits. A xcscheme file is also required — without one,
`xcodebuild test` returns exit 144 immediately (no test action defined on the auto-generated scheme).

**Deferred ClarityUI dependency from Phase 1.**
The original plan called for wiring ClarityUI as a local Swift package reference. Adding a package reference to a hand-crafted `project.pbxproj` requires additional sections (`XCLocalSwiftPackageReference`, `XCSwiftPackageProductDependency`, `PBXBuildFile` with `productRef`) that aren't present in the `unnamed-ios` reference. Skipped for Phase 1 to keep the pbxproj minimal and match a proven-to-build pattern. Add in Phase 2 once the bare scaffold is stable — the job-search-hq-ios project has a working ClarityUI wire-up to copy from.

**Mirror web types 1:1 as Codable structs — don't reinvent.**
`Ship.swift` is a direct translation of `Project` from `portfolio/shipyard/src/lib/types.ts`. Keeping field names (even snake_case like `last_commit_date`) makes the future Supabase decode trivial — no `CodingKeys` gymnastics needed.

**`qlmanage` + `sips` is the reliable macOS-native icon pipeline.**
No need for rsvg-convert, ImageMagick, or Python PIL. Single SVG → 1024 PNG → downscaled to all required sizes. Borrowed the approach from `portfolio/ash-reader-ios/design/generate-app-icons.sh`.

**`AppIcon.appiconset` with a single `1024x1024` image works on iOS 17.**
No need to generate all 12 traditional sizes. Setting `ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon` in build settings plus a single `Icon-1024.png` referenced in `Contents.json` (with `idiom = universal, platform = ios`) is enough for iOS 17+ simulator builds.
