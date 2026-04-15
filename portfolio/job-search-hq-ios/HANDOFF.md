# HANDOFF — Job Search HQ iOS

## State

| Field | Value |
|-------|--------|
| **Focus** | v0.1 scaffold shipped — local-only MVP, ClarityUI, four tabs |
| **Next** | Register bundle id / run ⌘U tests; Phase 2 Supabase when ready |
| **Last touch** | 2026-04-14 |

## Notes

- `xcodebuild … CODE_SIGNING_ALLOWED=NO` succeeds for compile check; `xcodebuild test` needs provisioning for new bundle id.
- Storage key `chase_job_search_ios_v1` intentionally ≠ web `localStorage` key until import path exists.
