# SESSION_START — Job Search HQ iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Job Search HQ iOS is a functional v0.1 SwiftUI app.
**App:** Job Search HQ iOS
**Slug:** job-search-hq-ios
**One-liner:** Native iOS companion to Job Search HQ — SwiftUI pipeline view with ClarityUI components, deep blue outline logo, and Phase 2 Supabase sync in progress.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. v0.1 is functional; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/job-search-hq-ios`
2. **BRANDING.md** — deep blue accent, Job Search HQ brand language, professional/corporate aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.1 shipped scope; Phase 2 = Supabase sync for cross-platform pipeline
5. **APP_FLOW.md** — document the pipeline view → application card → contact → prep flow
6. **SESSION_START_job-search-hq-ios.md** — stub only

Output paths: `portfolio/job-search-hq-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** SwiftUI + ClarityUI + @Observable + UserDefaults + Supabase (Phase 2)
**Storage key:** `chase_job_search_ios_v1`
**Bundle ID:** `com.chasewhittaker.JobSearchHQ`
**URL:** local Xcode
**Linear:** [Job Search HQ](https://linear.app/whittaker/project/job-search-hq-3695b3336b7d)

**What this app is:**
The native iOS companion to Job Search HQ web (v8.15). Provides a mobile view of the job pipeline: swipe through applications, see status, view contacts, and access prep materials. Built with ClarityUI for brand consistency. Phase 2 adds Supabase sync so pipeline data stays in sync between web and iOS.

**Web companion:**
- `portfolio/job-search-hq/` — v8.15, 5 tabs (Focus / Pipeline / Contacts / AI / Resources)
- Shares Supabase project (`unqtnnxlltiadzbqpyhh`), `app_key = 'job-search'`

**Architecture:**
- SwiftUI + `@Observable`
- ClarityUI package for palette + components
- UserDefaults for local state (`chase_job_search_ios_v1`)
- Supabase sync in Phase 2 (`app_key = 'job-search'` — same as web)
- Brand assets generated via `tools/generate_brand_assets.py`
- Debug + `devicectl` install verified on-device

**Brand system:**
- Deep blue outline logo (distinct from Clarity suite's filled icons)
- Professional, focused aesthetic — "every day you're not interviewing is a day behind"
- Voice: direct and urgent — "who should you message today?"

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** v0.1 on-device. Pipeline view functional. Phase 2 Supabase sync next.
**Last touch:** 2026-04-21

**Next (Phase 2):**
- Wire Supabase sync — pull `job-search` blob from shared project
- Read-only first: display web app data on iOS
- Phase 3: enable create/edit application from iOS
- Add push notifications for follow-up reminders (job applied N days ago, no response)
