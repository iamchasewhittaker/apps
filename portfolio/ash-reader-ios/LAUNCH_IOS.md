# Launch iOS — Ash Reader

**Bundle ID:** com.chasewhittaker.AshReader
**Audit date:** 2026-04-23
**Deployment target:** iOS 17.0+
**Current state:** v0.3 local on iPhone 12 Pro Max. Full parity with web v1.1. 4 tabs (Reader / Themes / Actions / Settings). 26/26 tests pass. No TestFlight build yet.

## Verdict

Close to TestFlight. The build, signing, and product are ready. The blocker is content. The bundled `doc.txt` is a 138k-word personal therapeutic conversation that is gitignored and unique to Chase, so the app as currently built is not a generic product Apple can review or that other users can use. Decide what ships before anything else moves.

**Top blocker:** The bundled `doc.txt` content question. Either ship as a personal-use app with a generic sample doc and a paste/import path, pivot to a "bring your own document" reader, or accept this is a private build and stay off the App Store.
**Days to TestFlight:** 3 (once content path is decided).
**Days to App Store:** 10.

## Gates

### Product
- [x] App icon (1024x1024 marketing)
- [x] Bundle ID is production-ready
- [x] Deployment target appropriate (iOS 16+ recommended)
- [x] App tested on physical device

### App Store Connect
- [ ] ASC app record created
- [ ] App name reserved
- [ ] SKU set
- [ ] Primary category chosen
- [ ] Secondary category chosen (optional)

### Marketing assets
- [ ] App name (≤30 chars): Ash Reader
- [ ] Subtitle (≤30 chars): TBD
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
- [x] All NS*UsageDescription strings written (none needed; app uses no sensitive APIs)
- [x] PrivacyInfo.xcprivacy present (if iOS 17+ SDKs in use) — N/A, no third-party SDKs
- [x] ATT prompt (if tracking) — N/A, no tracking
- [ ] Privacy Policy URL public
- [x] Terms of Service URL public (if accepting payment) — N/A, free app
- [ ] Privacy nutrition labels filled in ASC

### Monetization
- [x] StoreKit2 or RevenueCat wired — N/A, planned as free
- [x] IAP products defined in Xcode — N/A
- [x] IAP products created in ASC — N/A
- [x] Pricing tier selected: Free
- [x] Sandbox tested with real Apple ID — N/A

### TestFlight
- [ ] Archive builds cleanly
- [ ] Internal testers added
- [ ] At least one external tester invited
- [ ] Crash-free rate >99% over 1 week of beta

### App Review
- [ ] App Review notes drafted
- [x] Demo account credentials (if auth required) — N/A, no auth
- [ ] Reviewer instructions for non-obvious flows
- [ ] Contact email + phone

### ASO + press
- [ ] ASO keyword research doc
- [ ] Press kit (logo, screenshots, founder bio)
- [ ] Launch tweet drafted
- [ ] Launch post drafted (Reddit / IndieHackers / LinkedIn)

## Findings

**Signing and build settings.** `DEVELOPMENT_TEAM = 9XVT527KP3`, `CODE_SIGN_STYLE = Automatic`, `MARKETING_VERSION = 1.0`, `CURRENT_PROJECT_VERSION = 1`. `TARGETED_DEVICE_FAMILY = "1,2"` so iPad screenshots will be required at submission. If iPad support is not actually polished, drop to iPhone-only (`"1"`) before the first archive.

**Info.plist.** `GENERATE_INFOPLIST_FILE = YES`, no usage descriptions in build settings. The app uses no camera, microphone, location, photos, contacts, calendar, motion, health, notifications, or tracking, so this is fine. Confirmed by reading every Swift file — only `UserDefaults`, `UIImpactFeedbackGenerator`, `UIPasteboard`, `UIActivityViewController`, and `fileImporter`.

**Networking.** None. No `URLSession`, no analytics SDK, no third-party dependency. Privacy nutrition label can honestly be "Data Not Collected".

**App icon.** 12 PNGs present, `Icon-1024.png` verified at 1024x1024 RGBA. `Contents.json` correctly maps all required slots.

**Tests.** `AshReaderTests/AshReaderTests.swift` exists and the README claims 26/26 pass on device.

**Bundled content risk (the real blocker).** `AshReader/doc.txt` is 808KB of Chase's personal therapeutic conversation, gitignored, and the entire reason the app exists. `themes.md` and `summary.json` are also personal and gitignored. This raises three Apple review questions:
1. Guideline 5.2 — does Chase have rights to bundle this content? It is a conversation transcript, so yes, but Apple may ask.
2. Guideline 4.2 (minimum functionality) — is a single bundled document enough product? Probably yes given the chunker, themes, actions, and settings are real features, but reviewers can disagree.
3. Personal data exposure — once shipped to the App Store, the entire transcript is inside an `.ipa` that anyone can extract. Chase needs to be okay with the content being technically public.

**No TestFlight or distribution artifacts.** No `ExportOptions.plist`, no archive script, no CI workflow. The build commands in `CLAUDE.md` are device-install only, not archive.

**No App Store Connect record yet.** No ASC ID anywhere in `CLAUDE.md`, `HANDOFF.md`, or the project file.

**No marketing assets.** No `marketing/`, `press-kit/`, or `Resources/Screenshots/` folders. No drafted ASC metadata.

**Privacy Policy.** None hosted. Required by Apple for every app. Since the app collects nothing, this can be a one-page static page on a personal domain.

## Next Tasks (ordered)

1. Decide the content question. Three options: (a) ship with a generic sample document plus paste/import like the web app, (b) reframe as "bring your own long-form document", (c) keep this as a personal build and skip the App Store. Everything below assumes (a) or (b).
2. Add iPad screenshot or drop iPad support in `TARGETED_DEVICE_FAMILY`.
3. Create the ASC app record. Reserve the name "Ash Reader" or fall back to "Ash Reader: Long Doc Reader" if taken. Set SKU `ash-reader-ios-001`. Primary category Productivity, secondary Utilities.
4. Write a one-page Privacy Policy ("This app collects no data. All progress stays on device.") and host on the chasewhittaker.com or shipyard subdomain. Also stand up a Support URL pointing to a `mailto:` or a contact form.
5. Draft ASC metadata: subtitle, description, keywords, promotional text. Save in `marketing/asc-metadata.md`.
6. Capture screenshots for 6.9" and 6.5" iPhone (3 each minimum). Use Xcode simulator for the 6.9" iPhone 16 Pro Max. Add iPad shots if keeping iPad.
7. Bump `CURRENT_PROJECT_VERSION` and archive (`xcodebuild archive`). Upload to ASC via Xcode Organizer or `xcrun altool`.
8. In ASC, fill the privacy nutrition label as "Data Not Collected", select age rating (likely 17+ given therapeutic content), and submit to internal TestFlight.
9. Write App Review notes. Explain that the bundled document is a personal AI conversation Chase owns, that the app reads chunks for pasting into a separate AI assistant, and that nothing is sent over the network.
10. After 1 week of internal TestFlight with no crashes, submit to App Review.

## Reference

- Master template: `chase/portfolio/docs/governance/LAUNCH_CHECKLIST.md`
- Existing iOS release plan reference: `chase/portfolio/roller-task-tycoon-ios/docs/planning/RELEASE_PLAN.md`
- Strategy context: `chase/portfolio/STRATEGY.md`
