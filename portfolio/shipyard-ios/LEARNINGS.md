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

**iOS icon cache is aggressive — delete + reinstall to see icon changes.**
After reinstalling an app with a new `Icon-1024.png`, iOS often shows the cached old icon on the home screen. The only reliable fix is to delete the app and reinstall. Long-press → wiggle → delete, then `xcrun devicectl device install app ...`.

**`devicectl process launch` fails with error -10814 or "device locked" when screen is off.**
These are not real errors — the app installed fine. Just unlock the phone and tap the icon. Don't retry the launch command; it won't help.

**Gap between initials and sub-label needs to be ~18% of icon canvas (180px at 1024px).**
48px and 110px both rendered too close on device. 180px is the correct value for the SY/SHIPYARD layout. Arrived at iteratively — save time and start at 180px for future P6-style icons.

**Python Pillow works for programmatic icon generation when no SVG source exists.**
`qlmanage + sips` (the ash-reader approach) requires an SVG. For Shipyard, the design is purely typographic so Pillow is cleaner — no SVG authoring needed. Use `draw.textbbox` (not deprecated `textsize`) for accurate bounds.

**`AppIcon.appiconset` with a single `1024x1024` image works on iOS 17.**
No need to generate all 12 traditional sizes. Setting `ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon` in build settings plus a single `Icon-1024.png` referenced in `Contents.json` (with `idiom = universal, platform = ios`) is enough for iOS 17+ simulator builds.
