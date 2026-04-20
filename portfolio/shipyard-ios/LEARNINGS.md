# Learnings — Shipyard (iOS)

## 2026-04-19 (Phase 2 — Supabase integration)

**Hand-editing `project.pbxproj` to add a Swift Package Manager dep is safe when you mirror a working example.**
Adding `supabase-swift` without opening Xcode required six synchronized edits: `PBXBuildFile` (framework link), `PBXFileReference` (new Swift source), `PBXFrameworksBuildPhase` (add to files), `PBXNativeTarget.packageProductDependencies`, `PBXProject.packageReferences`, `PBXSourcesBuildPhase`, plus two new sections (`XCRemoteSwiftPackageReference`, `XCSwiftPackageProductDependency`). Copied the exact UUID slots and structure from `wellness-tracker-ios/WellnessTracker.xcodeproj/project.pbxproj`. First build succeeded on the first try — the pattern is deterministic if you stay consistent with UUIDs.

**Hardcoding the Supabase anon key in Swift is the portfolio convention, not a security flaw.**
Initial plan called for `Secrets.xcconfig` + Info.plist binding. Discovered `wellness-tracker-ios/Services/WellnessSupabaseConfig.swift` already hardcodes the same anon key in a public repo with a comment: "Public anon key (documented in repo handoffs; safe with RLS)." The anon key maps to `NEXT_PUBLIC_SUPABASE_ANON_KEY` — it's designed to be public. RLS is the real security boundary. Follow the existing pattern rather than over-engineering a new one.

**`authStateChanges` fires `.initialSession` on every listener start — including when there is NO session.**
Destructure with `for await (event, session) in ...` and **always** check `session != nil` before acting on `.initialSession`. If you handle `.initialSession` the same as `.signedIn` (ignoring the session value), the listener sets `isSignedIn = true` on launch with no auth token. The fleet loads mock data, the sign-in screen never appears, and `signOut()` has nothing to invalidate so it silently no-ops. The correct pattern:
```swift
case .initialSession:
    if session != nil { await handleSignedIn() }
case .signedIn, .tokenRefreshed:
    await handleSignedIn()
case .signedOut:
    handleSignedOut()
```
Also: `signOut()` should call `handleSignedOut()` directly (belt-and-suspenders) after `auth.signOut()` — don't rely solely on the listener firing `.signedOut`, because it may be slow or fail if the network is down.

**Test helper methods live on the production class, not a test-only file.**
Tests referenced `FleetStore.loadMockFleet()` from Phase 1, but the method didn't exist — `loadFleet()` was async-only. Rather than rewrite tests to use `await`, add a small synchronous `loadMockFleet()` helper directly on `FleetStore`. Cheaper than a test-only subclass and makes SwiftUI previews simpler too (`#Preview` uses the same helper).

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
