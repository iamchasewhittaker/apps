# Job Search HQ (iOS) — Project Instructions

> See also: [`/CLAUDE.md`](../../CLAUDE.md) (repo root) and web app [`../job-search-hq/CLAUDE.md`](../job-search-hq/CLAUDE.md).

**Project tracking (shared with web):** [Linear — Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)

## App Identity

- **Version:** v0.1 (local-first MVP)
- **Bundle ID:** `com.chasewhittaker.JobSearchHQ`
- **Storage key:** `chase_job_search_ios_v1` (distinct from web `localStorage` during dev — same JSON shape)
- **Entry:** `JobSearchHQ/JobSearchHQApp.swift`
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) · design IA [`docs/DESIGN_SPEC.md`](docs/DESIGN_SPEC.md) · v1 scope [`docs/SCOPE_V1.md`](docs/SCOPE_V1.md)

## What This App Is

The native iOS companion to Job Search HQ — manages the application pipeline, contact CRM, and AI-assisted prep sessions on-device in a dark SwiftUI interface using the JSHQ web palette tokens. Shares the same Supabase project as the web app and is tracked under the same Linear project.

## Tech Stack

SwiftUI · iOS 17 · `@Observable` · `UserDefaults` + `Codable` · local SPM [`../clarity-ui`](../clarity-ui) (`ClarityUI`). No SwiftData. Dark UI with JSHQ web palette tokens in `JSHQTheme.swift`.

## Commands

- Open `JobSearchHQ.xcodeproj` in Xcode → ⌘B / ⌘R
- **Regenerate launcher + in-app logo:** `python3 tools/generate_brand_assets.py` (Pillow) — commit updated PNGs when art changes.
- Tests: ⌘U (requires signing for the new bundle id once)
- Build check (no signing):  
  `xcodebuild -scheme JobSearchHQ -destination 'platform=iOS Simulator,name=iPhone 16' build CODE_SIGNING_ALLOWED=NO`
- **Physical device (example):** Debug build with `-allowProvisioningUpdates`, then `xcrun devicectl device install app` to the `.app` under `DerivedData/.../Debug-iphoneos/` (see `HANDOFF.md`).

## File layout (v1)

Flat `JobSearchHQ/` group in Xcode (sources under `JobSearchHQ/*.swift`): models (`JobSearchBlob.swift`), store, sync stub, theme, tab views + editor sheets.

## Phase 2

Supabase + OTP parity with web — [`docs/SYNC_PHASE2.md`](docs/SYNC_PHASE2.md), `RemoteSync.swift` protocol + `NoOpJobSearchRemoteSync`.

## Constraints

- Do not change `JobSearchConfig.storageKey` string once real device data exists without a migration note.
- Anthropic / AI tools: not in v1; keys never belong in the synced blob (match web).
