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
