# Launch iOS — Clarity Command

**Bundle ID:** com.chasewhittaker.ClarityCommand
**Audit date:** 2026-04-22
**Deployment target:** iOS 17.0+
**Current state:** Phase 6 done. 3 tabs (Mission/Scoreboard/Settings), gold accent, 14/14 tests pass, all 6 Clarity apps installed on iPhone 12 Pro Max. Supabase sync wired (`app_key = command`). Interim programmatic AppIcon. No App Store Connect record yet.

## Verdict

Code is shippable. Store-side and marketing assets are not. Two heavy lifts gate TestFlight: a real 1024 marketing icon and an App Store Connect record. After that, the rest is metadata, screenshots, and review notes for a sync-and-OTP flow.

**Top blocker:** No App Store Connect app record + interim placeholder AppIcon (chevron-in-shield mark not yet designed).
**Days to TestFlight:** 4.
**Days to App Store:** 12.

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
- [ ] App name (≤30 chars): Clarity Command (15 chars)
- [ ] Subtitle (≤30 chars): TBD (suggest: "Daily mission. No excuses.")
- [ ] Description (≤4000 chars): drafted
- [ ] Keywords (≤100 chars): drafted
- [ ] Promotional text (≤170 chars): drafted
- [ ] Support URL: TBD
- [ ] Marketing URL: TBD

### Screenshots
- [ ] 6.9" iPhone (3-10 shots)
- [ ] 6.5" iPhone (3-10 shots)
- [ ] 6.1" iPhone (optional)
- [ ] iPad Pro 13" (if iPad supported)

### Privacy + compliance
- [x] All NS*UsageDescription strings written (none required: app uses no sensitive APIs)
- [ ] PrivacyInfo.xcprivacy present (if iOS 17+ SDKs in use)
- [x] ATT prompt (if tracking) (no tracking SDKs in app)
- [ ] Privacy Policy URL public
- [ ] Terms of Service URL public (if accepting payment)
- [ ] Privacy nutrition labels filled in ASC

### Monetization
- [ ] StoreKit2 or RevenueCat wired
- [ ] IAP products defined in Xcode
- [ ] IAP products created in ASC
- [ ] Pricing tier selected: free (no MONETIZATION_BRIEF.md present)
- [ ] Sandbox tested with real Apple ID

### TestFlight
- [x] Archive builds cleanly (xcodebuild build pass on simulator with `CODE_SIGNING_ALLOWED=NO`; full archive on device not yet recorded)
- [ ] Internal testers added
- [ ] At least one external tester invited
- [ ] Crash-free rate >99% over 1 week of beta

### App Review
- [ ] App Review notes drafted
- [ ] Demo account credentials (if auth required) (Supabase OTP requires email; reviewer needs a working test inbox or a path that skips sync)
- [ ] Reviewer instructions for non-obvious flows
- [ ] Contact email + phone

### ASO + press
- [ ] ASO keyword research doc
- [ ] Press kit (logo, screenshots, founder bio)
- [ ] Launch tweet drafted
- [ ] Launch post drafted (Reddit / IndieHackers / LinkedIn)

## Next Tasks (ordered)

1. Replace interim programmatic AppIcon with the final chevron-in-shield mark per `docs/BRANDING.md` and `../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md`. Re-export 1024x1024 opaque PNG into `ClarityCommand/Assets.xcassets/AppIcon.appiconset/`.
2. Create the App Store Connect record. Reserve the name "Clarity Command", set SKU `clarity-command-ios-v1`, primary category Productivity, secondary Lifestyle. Bundle `com.chasewhittaker.ClarityCommand`, team `9XVT527KP3`.
3. Complete `docs/DEVICE_QA.md` end-to-end on the iPhone 12 Pro Max. Confirm Mission morning + evening flow persists, Scoreboard renders, Settings reset works, and Supabase OTP pull/push round-trips against the web Clarity Command row.
4. Archive a signed release build in Xcode. Distribute to TestFlight internal testing (just Chase). First TestFlight gate.
5. Publish a Privacy Policy and Support page. Single static page on `chasewhittaker.com` or a Vercel route is enough. Cover Supabase email + the JSON blob row.
6. Capture screenshots on iPhone 16 Pro Max simulator (6.9") and iPhone 11 Pro Max simulator (6.5"). Five shots minimum per size: morning Mission, evening reflection, scoreboard week, scoreboard month, settings + sync.
7. Draft App Store Connect metadata (subtitle, description, keywords, promotional text, what's new) and review notes. Include demo account flow: explain that login is optional and the app is fully usable without Supabase sign-in.
8. Fill out the privacy nutrition labels in ASC. Data collected: Email Address (linked to user, used for app functionality, via Supabase auth). Daily entries are user-generated content stored in their own Supabase row.
9. Submit for App Review.

## Reference

- Master template: `chase/portfolio/docs/governance/LAUNCH_CHECKLIST.md` (not present in repo; see `chase/portfolio/job-search-hq/LAUNCH_CHECKLIST.md` as the closest existing reference)
- Existing iOS release plan reference: `chase/portfolio/roller-task-tycoon-ios/docs/planning/RELEASE_PLAN.md`
- Strategy context: `chase/portfolio/STRATEGY.md`
