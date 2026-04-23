# Launch iOS — Unnamed

**Bundle ID:** com.chasewhittaker.Unnamed
**Audit date:** 2026-04-22
**Deployment target:** iOS 17.0+
**Current state:** v0.1 Phase 1 complete. All 5 flows built, 10/10 tests pass, installed on iPhone 12 Pro Max. Phase 1 rule blocks new features until 7 consecutive days of personal use.

## Verdict

Needs setup before TestFlight. The app builds, installs, and tests pass on device. Everything outside the binary is missing. No App Store Connect record, no screenshots, no metadata draft, no privacy policy URL, no support URL, and the AppIcon ships with an alpha channel that Apple rejects on upload. Bundle ID, signing, and team are already production-ready, and there is zero compliance risk because the app uses no sensitive APIs and no tracking.

The bigger question is naming. App Store Connect requires a real app name under 30 characters at submission. "Unnamed" reads as a placeholder and Phase 1 docs flag it as one. Pick the real name before reserving the slot in ASC, otherwise you ship under a name you intend to change.

**Top blocker:** AppIcon has an alpha channel. App Store upload will reject the build until a flat 1024x1024 RGB PNG replaces it.
**Days to TestFlight:** 2.
**Days to App Store:** 9.

## Gates

### Product
- [x] App icon (1024x1024 marketing) present at `Unnamed/Assets.xcassets/AppIcon.appiconset/AppIcon1024.png`, but it is RGBA and must be flattened to RGB
- [x] Bundle ID is production-ready (`com.chasewhittaker.Unnamed`, no dev/test/staging suffix)
- [x] Deployment target appropriate (iOS 17.0)
- [x] App tested on physical device (iPhone 12 Pro Max, UDID on file in HANDOFF.md)

### App Store Connect
- [ ] ASC app record created
- [ ] App name reserved (and the placeholder name "Unnamed" needs a final answer first)
- [ ] SKU set
- [ ] Primary category chosen (recommend Productivity)
- [ ] Secondary category chosen (recommend Health & Fitness, given the regulation lane and ADHD framing)

### Marketing assets
- [ ] App name (under 30 chars): TBD, "Unnamed" is a placeholder per CLAUDE.md
- [ ] Subtitle (under 30 chars): TBD
- [ ] Description (under 4000 chars): not drafted
- [ ] Keywords (under 100 chars): not drafted
- [ ] Promotional text (under 170 chars): not drafted
- [ ] Support URL: TBD
- [ ] Marketing URL: TBD (web counterpart at `portfolio/unnamed/` is not deployed yet either)

### Screenshots
- [ ] 6.9" iPhone (3 to 10 shots)
- [ ] 6.5" iPhone (3 to 10 shots)
- [ ] 6.1" iPhone (optional)
- [ ] iPad Pro 13" (n/a, app is iPhone-first per `UISupportedInterfaceOrientations` set to portrait only on phone)

### Privacy + compliance
- [x] All NS*UsageDescription strings written (none required, app uses zero sensitive APIs)
- [x] PrivacyInfo.xcprivacy present (n/a, no third-party SDKs in use)
- [x] ATT prompt (n/a, no tracking SDKs)
- [ ] Privacy Policy URL public (Apple still requires one even when no data is collected)
- [x] Terms of Service URL public (n/a, free app, no payments)
- [ ] Privacy nutrition labels filled in ASC (will say "Data Not Collected" but still requires submission)

### Monetization
- [x] StoreKit2 or RevenueCat wired (n/a, free app)
- [x] IAP products defined in Xcode (n/a)
- [x] IAP products created in ASC (n/a)
- [x] Pricing tier selected: Free
- [x] Sandbox tested with real Apple ID (n/a)

### TestFlight
- [ ] Archive builds cleanly (not yet attempted, no `ExportOptions.plist` in repo)
- [ ] Internal testers added
- [ ] At least one external tester invited
- [ ] Crash-free rate over 99% across 1 week of beta

### App Review
- [ ] App Review notes drafted
- [x] Demo account credentials (n/a, no auth in app)
- [ ] Reviewer instructions for non-obvious flows (the lane lock being irreversible until midnight, the one-at-a-time focus model, and the "containment is the feature" anti-features all need a sentence so a reviewer does not file a "missing functionality" rejection)
- [ ] Contact email + phone

### ASO + press
- [ ] ASO keyword research doc
- [ ] Press kit (logo, screenshots, founder bio)
- [ ] Launch tweet drafted
- [ ] Launch post drafted (Reddit r/ADHD, IndieHackers, LinkedIn)

## Next Tasks (ordered)

1. Decide the real app name. "Unnamed" is flagged as a placeholder in `CLAUDE.md` and `ROADMAP.md`. Reserving the wrong name in ASC then changing it later costs review time.
2. Flatten the AppIcon. Re-export `Unnamed/Assets.xcassets/AppIcon.appiconset/AppIcon1024.png` as 1024x1024 RGB with no alpha channel. Apple's icon validator rejects RGBA on upload. Without this, archive succeeds but App Store Connect upload fails.
3. Stand up a privacy policy URL. Apple requires a public URL even when the app collects zero data. A single static page on a Vercel domain is enough. Same page can host the support email link, which kills the Support URL gap in one move.
4. Create the App Store Connect record. Pick SKU `unnamed-ios-v1` or the app's final name slug. Choose primary category Productivity, secondary Health & Fitness. Reserve the name.
5. Add an `ExportOptions.plist` and run a release archive once. `xcodebuild archive -scheme Unnamed -configuration Release -archivePath build/Unnamed.xcarchive` then `xcodebuild -exportArchive`. Confirms the icon, signing, and bitcode story before TestFlight day.
6. Capture 5 screenshots on iPhone 16 Pro Max simulator (6.9") and 5 on iPhone 11 Pro Max simulator (6.5"). Cover Capture, Sort, Lane Lock, Focus, Check. Use the simulator's Hardware menu to set Pro Max sizes since you do not own those devices physically.
7. Draft ASC metadata in a new `marketing/asc-metadata.md`. Subtitle should hit the ADHD positioning without using "ADHD" in the first 30 chars (better as a keyword than a subtitle). Description should lead with the 4-lanes rule and the "containment is the feature" line. Keywords should be: adhd, focus, daily, lane, lock, regulation, capture, inbox, intentional, anti-distraction. Trim to under 100 total chars including commas.
8. Write App Review notes at `marketing/app-review-notes.md`. Include: no login required, lane lock is intentional and irreversible until midnight by design, no in-app purchases, no data leaves the device, contact email.
9. Upload first build to TestFlight. Internal-only testers (yourself) for the first 24 hours.
10. Invite 3 external testers from the LDS / ADHD circle. Run for 7 days. This satisfies both the App Store crash-free metric and Phase 1's 7-day usage rule, on the same calendar.
11. Submit for App Store review. Expect first response in 24 to 48 hours.

## Reference

- Master template: `chase/portfolio/docs/governance/LAUNCH_CHECKLIST.md`
- Existing iOS release plan reference: `chase/portfolio/roller-task-tycoon-ios/docs/planning/RELEASE_PLAN.md`
- Strategy context: `chase/portfolio/STRATEGY.md`
- Web source of truth: `chase/portfolio/unnamed/`
- Project handoff: `chase/portfolio/unnamed-ios/HANDOFF.md`
