# Learnings — Unnamed (iOS)

> Append surprises, failures, and "aha" moments after each session.

---

## 2026-04-17 — Phase 1 Build

**You can hand-craft a valid `.xcodeproj` without xcodegen.**
xcodegen couldn't install on macOS 13 (Xcode 15.3 requirement mismatch). Instead, adapted the existing `clarity-checkin-ios/ClarityCheckin.xcodeproj/project.pbxproj` as a template — using sequential `UN*` UUIDs and a clean file list. xcodebuild accepted it without complaint. This is a valid fallback when xcodegen isn't available.

**`@MainActor` isolation propagates from the store, not the view.**
SwiftUI view bodies run on MainActor, but standalone private methods (`submit()`, `lockIn()`) in view structs are NOT inferred as `@MainActor` by the Swift compiler. Calling a `@MainActor`-isolated store method from those functions causes a compile error. Fix: mark each such function `@MainActor`. The error message is clear (`call to main actor-isolated instance method in a synchronous nonisolated context`).

**Pure Python stdlib can generate valid PNG files without any image libraries.**
No Pillow, no numpy — used `struct`, `zlib`, and byte multiplication (`bytes([r,g,b]) * n`) to write a scanline-based 1024×1024 PNG. Fast enough at ~10KB compressed. Key pattern: `b'\x00' + pixel_bytes * width` per row (filter byte + RGB data), then `zlib.compress(rows)` + PNG chunk format.

**`xcrun devicectl` > `ideviceinstaller` for modern iOS.**
`devicectl device install app --device <udid> <path>` worked first try. The old `ideviceinstaller` toolchain is no longer needed for paired devices on macOS 13+.

**No ClarityUI package = simpler setup.**
Without the local SPM dependency (`clarity-ui`), the project structure is dramatically simpler — no `XCLocalSwiftPackageReference` or `XCSwiftPackageProductDependency` sections in the pbxproj. `StorageHelpers` inlined directly is ~15 lines and removes the dependency entirely.

**Building for device requires `-allowProvisioningUpdates`.**
`CODE_SIGNING_ALLOWED=NO` works for simulator only. For device builds via CLI, pass `-allowProvisioningUpdates` — xcodebuild handles provisioning automatically when the team is set and the device is registered.

---

## 2026-04-24 — Build Archaeology Session

**`-scheme` destination resolution breaks when `IDEPlatformsFirstLaunchSelected-iphoneos = 0`.**
Even with iOS 17.2 SDK files present (`xcodebuild -showsdks` confirms it), if Xcode's platform selection state is unset, `-scheme Unnamed -destination id=...` fails with "iOS 17.2 is not installed." The platform pref is in `com.apple.dt.Xcode` defaults. `sudo xcodebuild -runFirstLaunch` and `defaults write com.apple.dt.Xcode IDEPlatformsFirstLaunchSelected-iphoneos -bool YES` didn't fully fix it. Workaround: bypass destination resolution entirely using `-target Unnamed -sdk iphoneos17.2` — this goes directly to the compiler without the destination-resolver layer.

**`DailyLock` Encodable conformance broke silently across Swift versions.**
The struct had a custom `init(from decoder:)` with extra `CodingKeys` cases (`lane1`, `lane2`) for legacy decoding, but no custom `encode(to:)`. Swift auto-synthesis of `encode(to:)` requires all `CodingKeys` cases to map to stored properties — `lane1`/`lane2` don't, so synthesis fails. Added explicit `encode(to:)` that only encodes `date` and `lanes`. The fix is in AppState.swift; the backward-compat decoder still reads legacy data correctly.

**actool for device builds internally requires the iOS Simulator runtime.**
Even when building for device (`--platform iphoneos`), actool does a simulator runtime lookup internally. The installed runtime (21C62, downloaded separately) doesn't match the build version actool expects from the SDK (21C52, shipped with Xcode 15.2). This is the last remaining build blocker as of 2026-04-24. Try: delete the duplicate "Unusable" runtime, or symlink the SDK's embedded runtime info to match what actool expects.

**2017 MBP (MacBookPro14,3) + Xcode 15.2 can still install on iOS 26.4.1 — but it's precarious.**
The DeviceSupport for iOS 26.4 and 26.4.1 are already in `~/Library/Developer/Xcode/iOS DeviceSupport/` — Xcode downloaded them when the phone was first connected. `xcrun devicectl` talks to the phone fine. The only broken layer is (1) destination resolver in xcodebuild and (2) actool's runtime version check. Both are solvable without a new Mac.

---

## 2026-04-25 — actool deep-dive

**The iOS simulator runtime is a DMG that must be mounted for actool to see it.**
`xcrun simctl runtime list` shows "Ready" runtimes even when the DMG is unmounted. "Ready" means the image is downloaded and valid, not that it's currently mounted. actool looks for the runtime by resolving `runtimeBundlePath` (inside the mounted volume). If the DMG isn't mounted, the path doesn't exist and actool fails. All simulator devices report "unavailable, runtime profile not found using 'System' match policy" as a symptom of this.

**Mounting requires sudo.** `hdiutil attach` on `/Library/Developer/CoreSimulator/Images/*.dmg` returns "Permission denied" for unprivileged users. You need `sudo hdiutil attach ... -mountpoint /Library/Developer/CoreSimulator/Volumes/iOS_21C62 -readonly -noverify`.

**The SDK plist and the runtime DMG can report different build versions.** Xcode 15.2's `iPhoneSimulator17.2.sdk/System/Library/CoreServices/SystemVersion.plist` reported `ProductBuildVersion = 21C52` (an older 17.2 build), while the downloaded runtime is `21C62`. Patching the SDK plist to 21C62 via `sudo PlistBuddy` makes actool ask for the right version — but the DMG still needs to be mounted. Backup of original plist: `~/iPhoneSimulator17.2-SystemVersion.plist.bak`.

**actool partially succeeds before failing.** It compiles icon PNGs (AppIcon60x60@2x.png, AppIcon76x76@2x~ipad.png) and writes them to the .app bundle, then emits the runtime-lookup error, and xcodebuild marks BUILD FAILED. The binary and Assets.car are never linked. Don't be fooled by seeing output files in the .app — it's incomplete.

---

## 2026-04-25 — DMG mount fix + successful device install

**Mounting the iOS 17.2 runtime DMG is all that was needed after patching the SDK plist.**
Once `sudo hdiutil attach ... -mountpoint /Library/Developer/CoreSimulator/Volumes/iOS_21C62 -readonly -noverify` completed, actool found `iOS 17.2.simruntime` at the expected `runtimeBundlePath` and the build succeeded immediately. No symlink (Step B) was needed.

**The DMG unmounts on reboot; the SDK plist patch is persistent.** After a Mac restart, re-run the `hdiutil attach` command before building. No need to re-run the PlistBuddy patch — that edit survives reboots. Keep the command in the HANDOFF Fresh Session Prompt so future sessions don't have to rediscover it.

**`xcrun devicectl` install status `unavailable` just means the phone isn't plugged in.** Plugging in the USB cable and unlocking the phone changed the status from `unavailable` to `connected` immediately. Install and launch then worked first try.

---

## 2026-04-25 — UX parity with web (inbox edit/delete, sort help, check clarification)

**Actor-isolated computed properties can't access `@MainActor` store outside `body`.** A struct-level `var q2Helper: String` tried to read `store.todayLock` (which is `@MainActor`-isolated). The compiler rejected it: "main actor-isolated property can not be referenced from a non-isolated context." Fix: move the `let q2Helper = ...` inline inside `body` and add `return` before the `VStack`. SwiftUI calls `body` on the main actor, so store reads are fine there. Rule: never put store-reading logic in struct-level computed properties — always inside `body` or an `@MainActor`-marked function.

**`Lane: Identifiable` is required for `.sheet(item:)`.** `.sheet(item: $helpLane)` where `helpLane: Lane?` won't compile unless `Lane` is `Identifiable`. Fix: `extension Lane: Identifiable { var id: Self { self } }`. The web version uses a plain string state variable; iOS `.sheet(item:)` is the idiomatic native pattern.

**`HStack` column separation is cleaner than `ZStack` for button-within-a-card.** With `ZStack(alignment: .trailing)`, a full-width sort button and an overlaid ⓘ button compete for touches — SwiftUI has no `stopPropagation`. Using `HStack { sortButton.frame(maxWidth: .infinity); infoButton }` gives each button its own non-overlapping tap area. Prefer this pattern whenever a row has two distinct actions.

**New files in a hand-crafted pbxproj require 4 edits.** Adding `LockedLanesHeader.swift` required entries in: (1) `PBXBuildFile` section, (2) `PBXFileReference` section, (3) the `PBXGroup` children array for the Check/ folder, (4) the `PBXSourcesBuildPhase` files array. Missing any one causes the file to be invisible in the navigator or fail to link. Use `grep` on existing nearby UUIDs (`UN01…`, `UN02…`) and increment from the highest found value.

**`@MainActor` conversion warnings in `CaptureView` are benign in Swift 5.9.** Warnings like "converting `@MainActor () -> ()` to `() -> Void` loses global actor" on `onSubmit(submit)` are warnings in Swift 5.9 (Xcode 15.2), errors in Swift 6. Safe to leave for now; note for future Swift 6 migration.

**Visible buttons beat `.swipeActions` for this app.** SwiftUI's `.swipeActions` is the "native iOS" pattern for inbox edit/delete, but rejected: (1) swipe actions are invisible — no affordance, (2) user explicitly asked for visible controls, (3) low-vision accessibility favors stable visible targets over gesture-dependent interactions. `InboxRowView` with pencil/trash columns matches the web implementation and the accessibility-first principle.

**`presentationDetents([.medium, .large])` with `.presentationDragIndicator(.visible)` is ideal for a help sheet.** Lets the user control how much content they see, drag-to-dismiss by default, feels native. No custom overlay or full-screen cover needed for purely informational content.
