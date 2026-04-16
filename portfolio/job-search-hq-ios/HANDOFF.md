# HANDOFF — Job Search HQ iOS

## State

| Field | Value |
|-------|--------|
| **Focus** | v0.1 on device — text logo (JOB SEARCH / HQ) installed on iPhone 12 Pro Max |
| **Next** | Run **⌘U** in Xcode for unit tests; Phase 2 Supabase sync + OTP per `docs/SYNC_PHASE2.md` |
| **Last touch** | 2026-04-14 — AppIcon replaced with text-based brand mark (JOB SEARCH + HQ); installed on device `A0C65578-B1E0-4E96-A1EC-EEB8913BD11C` |

## Notes

- **Linear:** same product backlog as web — [Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) (note iOS companion milestones there or as linked issues).
- **Device install (verified 2026-04-14):** `xcodebuild -scheme JobSearchHQ -configuration Debug -destination 'platform=iOS,id=A0C65578-B1E0-4E96-A1EC-EEB8913BD11C' -allowProvisioningUpdates build` then `xcrun devicectl device install app --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C "$HOME/Library/Developer/Xcode/DerivedData/JobSearchHQ-*/Build/Products/Debug-iphoneos/JobSearchHQ.app"`. (iPhone 12 Pro Max)
- `xcodebuild … CODE_SIGNING_ALLOWED=NO` succeeds for compile check; `xcodebuild test` needs provisioning for new bundle id.
- Storage key `chase_job_search_ios_v1` intentionally ≠ web `localStorage` key until import path exists.
