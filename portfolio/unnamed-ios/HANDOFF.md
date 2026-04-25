# HANDOFF — Unnamed (iOS)

> Per-app session state. Update **State** when you stop. See repo-root [`HANDOFF.md`](../../HANDOFF.md) for multi-app context.

---

## State

| Field | Value |
|-------|-------|
| **Path** | `portfolio/unnamed-ios/` |
| **Focus** | **Build unblocked — actool runtime mismatch is the last blocker before device install.** |
| **Stack** | SwiftUI + iOS 17 + @Observable + UserDefaults + Codable |
| **Device** | iPhone 12 Pro Max · UDID `A0C65578-B1E0-4E96-A1EC-EEB8913BD11C` (iOS 26.4.1) |
| **Bundle ID** | `com.chasewhittaker.Unnamed` |
| **Last touch** | 2026-04-24 — Fixed DailyLock Encodable conformance; cleared build path via `-target`; actool 21C52 vs 21C62 runtime mismatch is the remaining blocker. |
| **Next** | Fix actool runtime mismatch (see Fresh Session Prompt below), then install + launch. |

---

## Quick links

- [CLAUDE.md](CLAUDE.md) · [CHANGELOG.md](CHANGELOG.md) · [ROADMAP.md](ROADMAP.md) · [LEARNINGS.md](LEARNINGS.md)
- Web source of truth: [portfolio/unnamed/](../unnamed/)
- Session starter: [portfolio/unnamed/HANDOFF_IOS.md](../unnamed/HANDOFF_IOS.md)

---

## Fresh session prompt

```
Read /CLAUDE.md and /HANDOFF.md first, then portfolio/unnamed-ios/CLAUDE.md and portfolio/unnamed-ios/HANDOFF.md.

Goal: Get Unnamed iOS built and installed on iPhone 12 Pro Max (UDID A0C65578-B1E0-4E96-A1EC-EEB8913BD11C, iOS 26.4.1) from this 2017 MBP running macOS Ventura 13.7.8 + Xcode 15.2.

Current state (2026-04-24):
- AppState.swift is FIXED — DailyLock now has encode(to:) method
- Swift compiles cleanly
- Build via `-target Unnamed -configuration Debug -sdk iphoneos17.2` ALMOST works
- LAST BLOCKER: actool fails with "Failed to locate any simulator runtime matching options:
  { BuildVersionString = 21C52; Platforms = (com.apple.platform.iphonesimulator); VersionString = 17.2 }"
  actool wants build 21C52, but xcrun simctl runtime list shows 17.2 is installed as 21C62

Context on the Mac/Xcode situation:
- This Mac (Intel 2017 MBP) is end-of-life for Apple — maxes out at macOS Ventura, Xcode 15.2
- The iPhone is on iOS 26.4.1 — Xcode destination resolution refuses to list it as eligible
- Workaround found: use `-target Unnamed -sdk iphoneos17.2` (bypasses destination resolver)
- DeviceSupport for iOS 26.4.1 IS present at ~/Library/Developer/Xcode/iOS DeviceSupport/
- xcrun devicectl and xcrun simctl runtime list both work fine with the phone

What to try for the actool fix:
1. Check if there's a runtime registered at build 21C52 anywhere (the Xcode-bundled one, not the downloaded one)
   `xcrun simctl runtime list` and compare build versions
2. Try deleting the 64B8D827 duplicate runtime (Unusable) so simctl only has the Ready one
   `xcrun simctl runtime delete 64B8D827-76F4-4B8E-A80C-8E03E662FCF7`
   Then retry build
3. Try adding ACTOOL_EXTRA_FLAGS or passing --filter-for-thinning-device-configuration to actool
4. Try building with CODE_SIGNING_ALLOWED=NO first (simulator build) to verify Swift is clean, then tackle device
5. If actool is truly stuck, install via iOS Simulator instead and test flows there

Build commands to use:
# Device build (the working approach — destination resolver bypassed)
xcodebuild -target Unnamed -configuration Debug -sdk iphoneos17.2 -allowProvisioningUpdates build

# Install (once .app exists at build/Debug-iphoneos/Unnamed.app)
xcrun devicectl device install app --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C build/Debug-iphoneos/Unnamed.app

# Launch
xcrun devicectl device process launch --device A0C65678-B1E0-4E96-A1EC-EEB8913BD11C com.chasewhittaker.Unnamed

DO NOT modify any source code unless it's a compile error. Phase 1 rule: no new features.
```

---

## App overview

Native iOS port of the Unnamed daily OS web app. SwiftUI + @Observable + UserDefaults. No SwiftData, no external deps.

**5 flows:**
1. Capture → type text, add to inbox
2. Sort → one inbox item at a time, assign to lane
3. Today (lock) → pick 2 lanes, lock in for the day (irreversible until midnight)
4. Today (focus) → one active item at a time, Done/Skip
5. Check → "Did you produce?" + "Did you stay in your lanes?" → Solid/Halfway/Rest

**4 lanes (fixed forever):** Regulation · Maintenance · Support Others · Future
