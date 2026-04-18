# Changelog

## [Unreleased]

### Updated (2026-04-18)
- **Logo: deep blue outline style** — `tools/generate_brand_assets.py` updated: `BG = (0x1D, 0x4E, 0xD8)` (deep blue), `BAND = (0x1E, 0x40, 0xAF)`. Outline text simulated via `fill=BG, stroke_fill=WHITE` (Pillow fill=none workaround). `AppIcon.png` + `Logo.png` regenerated.

### Updated (2026-04-14)
- **AppIcon: text-based brand mark** — replaced pipeline glyph + badge with "JOB SEARCH" / "HQ" text logo matching the web portfolio standard (dark bg, blue label, white bold main). Generated 1024×1024 PNG via `qlmanage` from updated `logo.svg`. Built with `xcodebuild` (BUILD SUCCEEDED) and installed on iPhone 12 Pro Max (`com.chasewhittaker.JobSearchHQ`, device `A0C65578-B1E0-4E96-A1EC-EEB8913BD11C`).

- **Docs / release hygiene:** `HANDOFF`, `README`, `ROADMAP`, `CLAUDE`, `AGENTS` aligned with device install flow; Linear backlog = web [Job Search HQ project](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d).

- **Brand visibility:** Regenerated `AppIcon.png` (pipeline bars + blue badge on navy tile — reads on Home Screen); added `Logo.imageset` + top chrome in `ContentView`; `tools/generate_brand_assets.py` (Pillow) for reproducible exports.

- Initial Xcode project: Focus / Pipeline / Contacts / More tabs, `JobSearchDataBlob` + `JobSearchStore` (UserDefaults), ClarityUI SPM, Phase 2 sync stub + `docs/SYNC_PHASE2.md`.
- Design docs: `docs/DESIGN_SPEC.md`, `docs/SCOPE_V1.md`, `docs/BRANDING.md`.
