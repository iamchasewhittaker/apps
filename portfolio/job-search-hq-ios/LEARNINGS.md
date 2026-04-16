# LEARNINGS — Job Search HQ iOS

## 2026-04-14 (text logo session)

- **iOS AppIcon must be full-bleed — no `rx` corner radius:** Apple applies its own squircle mask at render time. The source PNG should be a solid square (no rounded corners). To generate from the web `logo.svg`: strip `rx="96"` before rasterizing — `sed 's/rx="96" //' logo.svg > /tmp/icon.svg && qlmanage -t -s 1024 -o /tmp /tmp/icon.svg` — then copy to `AppIcon.appiconset/AppIcon.png`.
- **Text-based AppIcon vs glyph icon:** `tools/generate_brand_assets.py` (Pillow) produces the original pipeline-glyph icon. To switch to a text-based mark matching the web logo, use `qlmanage` from the SVG rather than re-running the Python script. Update `generate_brand_assets.py` if the text-based approach becomes permanent.
- **Delete + reinstall to clear Springboard icon cache:** After replacing `AppIcon.png`, iOS may continue showing the old icon. `xcrun devicectl device install app` over an existing install sometimes refreshes it, but a clean delete-from-device first is the reliable fix.

## 2026-04-15

- **Springboard icon cache:** After replacing `AppIcon` assets, iOS can show the previous icon until the app is **deleted** and reinstalled (or a clean install via `devicectl`). Same symptom if the first icon was too low-contrast on navy — prefer a Clarity-style band + glyph so the tile reads at a glance.

## 2026-04-14

- **Swift 5.0 / Xcode project `SWIFT_VERSION = 5.0`:** trailing commas in call argument lists (e.g. `Text("...", )`, `.overlay(..., )`) are rejected — remove trailing commas before `)`.
- **`@MainActor` store + `@State` default init:** `@State private var store = JobSearchStore()` fails if `JobSearchStore()` is MainActor-isolated; Check-in uses `nonisolated init()` on the store. Here we dropped `@MainActor` from the store for the same ergonomics (v1 UI is main-thread only anyway).
- **Simulator `xcodebuild test`:** new bundle id needs a development profile or `-allowProvisioningUpdates`; document ⌘U in Xcode for first run.
