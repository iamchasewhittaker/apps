# HANDOFF — Job Search HQ iOS

## State

| Field | Value |
|-------|--------|
| **Focus** | v0.1 on device — brand assets read on Springboard; local-first MVP |
| **Next** | Run **⌘U** in Xcode (or CI simulator) for unit tests; Phase 2 Supabase per `docs/SYNC_PHASE2.md` |
| **Last touch** | 2026-04-15 |

## Notes

- **Linear:** same product backlog as web — [Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) (note iOS companion milestones there or as linked issues).
- **Device install (verified):** `xcodebuild -scheme JobSearchHQ -configuration Debug -destination 'platform=iOS,id=00008101-000630D01161001E' -allowProvisioningUpdates build` then `xcrun devicectl device install app --device 00008101-000630D01161001E "$HOME/Library/Developer/Xcode/DerivedData/JobSearchHQ-*/Build/Products/Debug-iphoneos/JobSearchHQ.app"`.
- `xcodebuild … CODE_SIGNING_ALLOWED=NO` succeeds for compile check; `xcodebuild test` needs provisioning for new bundle id.
- Storage key `chase_job_search_ios_v1` intentionally ≠ web `localStorage` key until import path exists.
