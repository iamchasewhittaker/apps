# Changelog — Clarity Growth (iOS)

## [Unreleased]

- **App icon (glyph refresh):** shipped center mark changed from **ascending steps** to **sprout** (organic growth); canonical wide `docs/design/app-icon-mockup-wide.png` + `AppIcon.png` regenerated with `sips`; prior steps art kept as `docs/design/app-icon-mockup-explore-steps.png`. **`docs/BRANDING.md`** updated. `xcodebuild build` **ClarityGrowth** ✅ (iPhone 15 / iOS 17.2, `CODE_SIGNING_ALLOWED=NO`).
- **App icon + branding:** wide mockup `docs/design/app-icon-mockup-wide.png` (1376×768) → `sips --padColor E6E7EB -p 1376 1376` → `AppIcon.png` 1024 + `AppIcon.appiconset/Contents.json` filename; **`docs/BRANDING.md`**; `CLAUDE.md` branding + icon spec links. Initial center glyph: ascending steps + suite check badge. `xcodebuild build` **ClarityGrowth** ✅ (iPhone 15 / iOS 17.2, `CODE_SIGNING_ALLOWED=NO`).
- **Design references:** added non-shipped wide explorations `docs/design/app-icon-mockup-explore-{sprout,nodes,arc}.png` with rationale in `docs/BRANDING.md`.
- **MVP scaffold (v0.1):** created app at `portfolio/clarity-growth-ios` with programmatic `ClarityGrowth.xcodeproj` using `CG*` PBX IDs and local `../clarity-ui` package.
- **Models / Store:** added `GrowthBlob`, `GrowthSessionEntry`, streak + aggregation helpers, and `GrowthStore` (`@Observable @MainActor`, `nonisolated init()`, `StorageHelpers` persistence with key `chase_growth_ios_v1`).
- **Growth catalog:** added 7 legacy area IDs (`gmat`, `job`, `ai`, `pm`, `claude`, `bom`, `cfm`) plus milestones and background options.
- **Views:** shipped dashboard stats, weekly bars, area tiles, log session flow, and history list with filtering + delete.
- **Tests:** added `GrowthBlobTests` (JSON round-trip, math/streak checks, last-seven-days helper).
- **Verify:** `xcodebuild -showdestinations` and `xcodebuild build` succeeded on iPhone 15 / iOS 17.2 (`CODE_SIGNING_ALLOWED=NO`); `xcodebuild test` attempted but can hang on this host when Simulator services are unhealthy (retry locally in Xcode or terminal).
