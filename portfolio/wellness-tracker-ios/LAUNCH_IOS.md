# Launch iOS — Wellness Tracker

**Bundle ID:** com.chasewhittaker.WellnessTracker
**Audit date:** 2026-04-22
**Deployment target:** iOS 17.0+
**Current state:** Phase 2 shell. SwiftUI check-in, Tasks, Time, Capture, and Sync tabs. UserDefaults local-first with optional Supabase email-OTP sign-in that pushes `wellness` and `wellness-daily` blobs to the shared portfolio project.

## Verdict

Needs major work before TestFlight. The build is healthy and signed under team `9XVT527KP3`, but every App Store Connect artifact is missing: no ASC record, no screenshots, no privacy policy, no draft metadata, no review notes. The app already sends data to Supabase, which makes a public privacy policy a hard prerequisite, not a nice-to-have.

**Top blocker:** No App Store Connect record exists for this bundle ID, and no public privacy policy URL is on file even though the Sync tab transmits user data to Supabase.
**Days to TestFlight:** 4.
**Days to App Store:** 14.

## Gates

### Product
- [x] App icon (1024x1024 marketing)
- [x] Bundle ID is production-ready
- [x] Deployment target appropriate (iOS 16+ recommended)
- [ ] App tested on physical device

### App Store Connect
- [ ] ASC app record created
- [ ] App name reserved
- [ ] SKU set
- [ ] Primary category chosen
- [ ] Secondary category chosen (optional)

### Marketing assets
- [ ] App name (≤30 chars): Wellness Tracker (16 chars, fits)
- [ ] Subtitle (≤30 chars): TBD (suggest: "Daily check-ins, on device")
- [ ] Description (≤4000 chars): drafted (PRODUCT_BRIEF and SHOWCASE exist, no ASC-shaped copy yet)
- [ ] Keywords (≤100 chars): drafted
- [ ] Promotional text (≤170 chars): drafted
- [ ] Support URL: TBD
- [ ] Marketing URL: TBD (web app exists at the companion repo, no public URL listed in iOS docs)

### Screenshots
- [ ] 6.9" iPhone (3-10 shots)
- [ ] 6.5" iPhone (3-10 shots)
- [ ] 6.1" iPhone (optional)
- [ ] iPad Pro 13" (if iPad supported) — note: project ships with `TARGETED_DEVICE_FAMILY = "1,2"`, so iPad screenshots will be required if you keep iPad enabled

### Privacy + compliance
- [ ] All NS*UsageDescription strings written (none currently in Info.plist; none required by current code, but confirm again before submit)
- [ ] PrivacyInfo.xcprivacy present (if iOS 17+ SDKs in use) — Supabase Swift SDK in use; review whether it requires an entry
- [x] ATT prompt (if tracking) — no IDFA, no third-party trackers found, ATT not required
- [ ] Privacy Policy URL public — required because the Sync tab sends data to Supabase
- [ ] Terms of Service URL public (if accepting payment) — not accepting payment, optional
- [ ] Privacy nutrition labels filled in ASC — needs entries for "Other User Content" and "User ID" (email) since OTP captures email and pushes a `wellness` blob

### Monetization
- [ ] StoreKit2 or RevenueCat wired — none present (free app)
- [ ] IAP products defined in Xcode
- [ ] IAP products created in ASC
- [ ] Pricing tier selected: Free (no MONETIZATION_BRIEF.md found)
- [ ] Sandbox tested with real Apple ID

### TestFlight
- [ ] Archive builds cleanly (no ExportOptions.plist or archive verification on file)
- [ ] Internal testers added
- [ ] At least one external tester invited
- [ ] Crash-free rate >99% over 1 week of beta

### App Review
- [ ] App Review notes drafted
- [ ] Demo account credentials (if auth required) — Sync tab requires email OTP; reviewer needs a working test inbox or a "skip sign-in" note
- [ ] Reviewer instructions for non-obvious flows (Check-in tab is the default; Sync is optional)
- [ ] Contact email + phone

### ASO + press
- [ ] ASO keyword research doc
- [ ] Press kit (logo, screenshots, founder bio)
- [ ] Launch tweet drafted
- [ ] Launch post drafted (Reddit / IndieHackers / LinkedIn)

## Findings beyond the gate list

1. **CLAUDE.md drift.** The portfolio root `CLAUDE.md` lists this app as local-only, but `WellnessCloudSync.swift`, `WellnessSupabaseConfig.swift`, and `SyncTabView.swift` are wired and active in the build. The CHANGELOG also shows an "Unarchived" entry that re-added Supabase. Reconcile before submitting nutrition labels, or App Review will reject for inaccurate data-collection disclosures.
2. **Anon key checked in.** `WellnessSupabaseConfig.swift` contains the anon key in source. That is acceptable per the portfolio convention (RLS enforced), but flag it in App Review notes so the reviewer does not treat it as a secret leak.
3. **iPad family enabled.** `TARGETED_DEVICE_FAMILY = "1,2"` is set in both Debug and Release. If you do not plan to ship iPad in v1, set this to `"1"` to drop the iPad screenshot requirement. If you keep iPad, the iPad Pro 13" screenshots become mandatory.
4. **No tracking, no IDFA.** No `ATTrackingManager`, `IDFA`, Mixpanel, Adjust, AppsFlyer, or Branch references found. ATT prompt is not required.
5. **One test file.** `WellnessTrackerTests/WellnessBlobTests.swift` exists. Confirm it still passes under Xcode 15 before archiving.
6. **No `PrivacyInfo.xcprivacy`.** Supabase Swift v2 may require a privacy manifest entry under the new SDK rules. Verify against the Supabase Swift release notes before submission.
7. **`MARKETING_VERSION = 1.0`, `CURRENT_PROJECT_VERSION = 1`.** Fine for a first build. Bump build number on every TestFlight upload.

## Next Tasks (ordered)

1. Create the App Store Connect record (bundle `com.chasewhittaker.WellnessTracker`, name "Wellness Tracker", SKU `wellness-tracker-ios-v1`, primary category Health & Fitness, secondary Lifestyle).
2. Publish a privacy policy at a stable URL covering: email captured for OTP sign-in, `wellness` blob (mood, sleep, supplements, gratitude notes) and `wellness-daily` summary stored in Supabase, no third-party tracking, on-device-first storage. Link it from the iOS app docs and the support URL.
3. Decide iPad: either drop `2` from `TARGETED_DEVICE_FAMILY` to ship iPhone-only, or commit to producing iPad Pro 13" screenshots.
4. Reconcile the local-only vs Supabase claim across `CLAUDE.md` (root and app), `README.md`, and `HANDOFF.md` so the privacy disclosure matches reality.
5. Draft App Store metadata: subtitle, 4000-char description, 100-char keyword string, 170-char promo text. Pull base copy from `docs/SHOWCASE.md` and `docs/PRODUCT_BRIEF.md`.
6. Capture five screenshots per required device (6.9" and 6.5" minimum) showing Check-in, Past days, Tasks, Time, and Capture. The Sync tab should not be the hero shot.
7. Verify the Supabase Swift SDK privacy-manifest requirement; add `PrivacyInfo.xcprivacy` if Apple's manifest list flags it.
8. Write `REVIEW_NOTES.md`: explain the OTP flow, that the anon key in source is intentional and protected by RLS, that the reviewer can use any email they control, and that the Check-in tab is the default landing experience.
9. Archive a Release build, validate, and upload to TestFlight. Add yourself as the first internal tester and run through every tab on a physical device.
10. After one week of internal testing with no crashes, submit to App Review.

## Reference

- Master template: `chase/portfolio/docs/governance/LAUNCH_CHECKLIST.md`
- Existing iOS release plan reference: `chase/portfolio/roller-task-tycoon-ios/docs/planning/RELEASE_PLAN.md`
- Strategy context: `chase/portfolio/STRATEGY.md`
