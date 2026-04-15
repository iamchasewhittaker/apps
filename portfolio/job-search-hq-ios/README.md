# Job Search HQ (iOS)

SwiftUI companion to [Job Search HQ web](../job-search-hq/) — Clarity-style stack (`@Observable`, local SPM **ClarityUI**, iOS 17+). See [CLAUDE.md](CLAUDE.md) and [docs/DESIGN_SPEC.md](docs/DESIGN_SPEC.md).

## Open in Xcode

```bash
open JobSearchHQ.xcodeproj
```

## Build (CLI, no signing)

```bash
xcodebuild -scheme JobSearchHQ -destination 'platform=iOS Simulator,name=iPhone 16' build CODE_SIGNING_ALLOWED=NO
```

## Tests

Run **⌘U** in Xcode after automatic signing resolves for bundle id `com.chasewhittaker.JobSearchHQ` (first-time provisioning). Unit tests live in `JobSearchHQTests/JobSearchBlobTests.swift`.

## Data

- On-device key: `chase_job_search_ios_v1` (JSON aligned with web `chase_job_search_v1` — see [docs/SCOPE_V1.md](docs/SCOPE_V1.md)).
- Supabase: Phase 2 — [docs/SYNC_PHASE2.md](docs/SYNC_PHASE2.md).
