# Session Start — Job Search HQ iOS (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-14** — Initial Xcode project: Focus / Pipeline / Contacts / More tabs, JobSearchDataBlob + JobSearchStore (UserDefaults), ClarityUI SPM, Phase 2 sync stub + docs/SYNC_PHASE2.md, design docs (DESIGN_SPEC.md, SCOPE_V1.md, BRANDING.md)
- **2026-04-14** — Brand visibility: AppIcon (pipeline bars + blue badge on navy), Logo.imageset + top chrome in ContentView, `tools/generate_brand_assets.py` (Pillow)
- **2026-04-14** — Device install verified: debug build + `xcrun devicectl` on iPhone 12 Pro Max
- **2026-04-18** — Logo updated to deep blue (#1d4ed8) outline style, AppIcon.png + Logo.png regenerated

---

## Still needs action

- Phase 2: Supabase + OTP sync parity with web (see docs/SYNC_PHASE2.md, tasks B1-B6)
- Profile editor, STAR stories UI, import JSON from web backup
- AI tools + Keychain API key (deferred from v1 scope)

---

## Job Search HQ iOS state at a glance

| Field | Value |
|-------|-------|
| Version | v0.1 |
| URL | local Xcode |
| Storage key | `chase_job_search_ios_v1` (UserDefaults) |
| Stack | SwiftUI + iOS 17 + @Observable + UserDefaults + Codable + ClarityUI SPM |
| Xcode prefix | -- (flat layout) |
| Bundle ID | com.chasewhittaker.JobSearchHQ |
| Linear | [Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d) |
| Last touch | 2026-04-18 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/job-search-hq-ios/CLAUDE.md | App-level instructions |
| portfolio/job-search-hq-ios/HANDOFF.md | Session state + notes |
| JobSearchHQ/JobSearchStore.swift | @Observable store with UserDefaults persistence |
| JobSearchHQ/JobSearchBlob.swift | Root Codable data blob (web-shaped JSON) |
| JobSearchHQ/ContentView.swift | TabView (Focus / Pipeline / Contacts / More) + logo header |
| JobSearchHQ/PipelineTabView.swift | Application pipeline CRUD |
| JobSearchHQ/RemoteSync.swift | Phase 2 sync stub (NoOpJobSearchRemoteSync) |

---

## Suggested next actions (pick one)

1. Phase 2 Supabase sync: wire RemoteSync to real Supabase push/pull with email OTP auth (see docs/SYNC_PHASE2.md)
2. Profile editor + STAR stories UI
3. Import JSON from web backup feature
