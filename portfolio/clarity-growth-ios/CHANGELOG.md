# Changelog — Clarity Growth (iOS)

## [Unreleased]

- **MVP scaffold (v0.1):** created app at `portfolio/clarity-growth-ios` with programmatic `ClarityGrowth.xcodeproj` using `CG*` PBX IDs and local `../clarity-ui` package.
- **Models / Store:** added `GrowthBlob`, `GrowthSessionEntry`, streak + aggregation helpers, and `GrowthStore` (`@Observable @MainActor`, `nonisolated init()`, `StorageHelpers` persistence with key `chase_growth_ios_v1`).
- **Growth catalog:** added 7 legacy area IDs (`gmat`, `job`, `ai`, `pm`, `claude`, `bom`, `cfm`) plus milestones and background options.
- **Views:** shipped dashboard stats, weekly bars, area tiles, log session flow, and history list with filtering + delete.
- **Tests:** added `GrowthBlobTests` (JSON round-trip, math/streak checks, last-seven-days helper).
- **Verify:** `xcodebuild -showdestinations` and `xcodebuild build` succeeded on iPhone 15 / iOS 17.2 (`CODE_SIGNING_ALLOWED=NO`); `xcodebuild test` attempted but can hang on this host when Simulator services are unhealthy (retry locally in Xcode or terminal).
