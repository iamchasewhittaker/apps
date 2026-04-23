# Stage-Gate Launch Checklist

> Copy and instantiate per app as `LAUNCH_CHECKLIST.md` in the app directory.
> Each gate must pass before proceeding to the next.

---

## Gate 1: Strategy / Problem Fit

- [ ] Problem statement written (who has this problem, why it matters)
- [ ] Target user defined (specific persona, not "everyone")
- [ ] Success metric chosen (what number proves this works)
- [ ] Product line assigned (Clarity Life OS / Career Toolkit / Finance & Budget / Supporting Tool)
- [ ] No unresolved overlap with existing active app
- [ ] Differentiation from similar apps documented

**Gate 1 pass:** All items checked. Proceed to build.

---

## Gate 2: Build Readiness

- [ ] Scope frozen for this release (what's in, what's deferred)
- [ ] `docs/BRANDING.md` exists (copy from `docs/templates/PORTFOLIO_APP_BRANDING.md`)
- [ ] Security checklist started (copy from `docs/governance/SECURITY_CHECKLIST.md`)
- [ ] Shared files pulled from `portfolio/shared/` (sync.js, auth.js, storage.js, ErrorBoundary.jsx)
- [ ] localStorage key chosen and added to root CLAUDE.md portfolio table
- [ ] Linear project created with issues for this release scope

**Gate 2 pass:** All items checked. Proceed to build and ship.

---

## Gate 2.5: Revenue Model

> Added 2026-04-22. Required for every app that intends to generate revenue. Run `/money-audit` from the project dir to score current state.

- [ ] `MONETIZATION_BRIEF.md` exists in the project (use template at `chase/portfolio/idea-kitchen/templates/MONETIZATION_BRIEF.md`)
- [ ] Revenue model picked (subscription / lifetime / freemium / one-time / equity / ads / sponsorship / none)
- [ ] Pricing locked (headline price, free tier, paid tier(s), annual discount)
- [ ] WTP evidence documented (3+ competitor scan, signal sources, or admit no signal and accept the validation risk)
- [ ] Target audience defined (who, where they hang out, what they pay today)
- [ ] Day 30 / 60 / 90 success metrics chosen (concrete numbers, not vibes)
- [ ] Activation funnel mapped (5-step path from link to money)
- [ ] Payment provider picked (Stripe / Lemon Squeezy / RevenueCat / Gumroad)
- [ ] Provider account verified, bank connected, tax info submitted
- [ ] Plan-gating strategy defined (RLS / app-level / n/a)
- [ ] TOS + Privacy Policy live at `/terms` and `/privacy`
- [ ] Refund policy documented (especially for lifetime + one-time)
- [ ] Receipt email template exists
- [ ] Customer portal accessible from app
- [ ] Analytics on conversion events (signup, paid, churn)
- [ ] Email capture form for non-converters

**Gate 2.5 pass:** All items checked. Revenue model is documented and infrastructure is ready. Proceed to launch readiness.

---

## Gate 3: Launch Readiness

- [ ] `npm ci && npm run build` passes clean (or Xcode build succeeds)
- [ ] Security checklist complete — all items pass
- [ ] `npm audit` shows 0 critical/high vulnerabilities
- [ ] README.md has user-facing description (not just dev docs)
- [ ] `docs/BRANDING.md` complete (colors, fonts, logo, tagline)
- [ ] App logo created using `docs/templates/PORTFOLIO_APP_LOGO.md`
- [ ] Live URL verified (returns 200, renders correctly, no console errors)
- [ ] Auth flow tested end-to-end (if applicable)
- [ ] Cross-app session works (if part of Clarity ecosystem)
- [ ] Vercel environment variables set for production + preview
- [ ] Vercel connected to GitHub for auto-deploy
- [ ] HANDOFF.md updated with current state
- [ ] CHANGELOG.md has entry for this release
- [ ] Linear project updated — issues closed, status current

**Gate 3 pass:** All items checked. App is live and launch-ready.

---

## Gate 3.5: iOS App Store Readiness (iOS apps only)

> Added 2026-04-22. Skip for web / Python / Apps Script. Run `/ios-launch` from the project dir to generate `LAUNCH_IOS.md` with current state.

- [ ] `LAUNCH_IOS.md` exists in the project root
- [ ] App Store Connect record created
- [ ] Bundle ID is production-ready (no `dev`, `test`, `staging`)
- [ ] Marketing icon (1024x1024) finalized
- [ ] Screenshots ready: 6.9" + 6.5" iPhone (3-10 per device size)
- [ ] App name (≤30 chars), subtitle (≤30), description (≤4000), keywords (≤100), promo text (≤170) drafted
- [ ] Support URL + Marketing URL live
- [ ] Privacy nutrition labels filled in ASC
- [ ] All `NS*UsageDescription` strings written
- [ ] `PrivacyInfo.xcprivacy` present (if iOS 17+ SDKs in use)
- [ ] ATT prompt wired (if any third-party tracking)
- [ ] StoreKit2 or RevenueCat wired (if monetized)
- [ ] IAP products defined in Xcode + ASC, sandbox tested
- [ ] Pricing tier selected ($X/mo or $X lifetime)
- [ ] Archive builds cleanly via Xcode or `xcodebuild archive`
- [ ] At least 1 external TestFlight tester invited
- [ ] Crash-free rate >99% over 1 week of beta
- [ ] App Review notes drafted (demo account, reviewer instructions, contact)
- [ ] ASO keyword research doc
- [ ] Press kit (logo, screenshots, founder bio)
- [ ] Launch tweet / Reddit / IndieHackers post drafted

**Gate 3.5 pass:** All items checked. App is App Store-ready.

---

## Gate 4: Post-Launch Review

### Week 1 Check
- [ ] Live URL still accessible and rendering
- [ ] Auth still working (no session issues)
- [ ] No new console errors
- [ ] No Supabase errors in dashboard
- [ ] Basic user journey works end-to-end

### Week 4 Check
- [ ] Review success metric — trending toward goal?
- [ ] Any user feedback received? (even if user is just you)
- [ ] Any security issues surfaced?
- [ ] Decision: **Invest** (add features) / **Maintain** (keep as-is) / **Sunset** (archive)

### Revenue tracking (added 2026-04-22)

For monetized apps, track these alongside usage metrics:

- [ ] Day 1: visitors, signups, paid conversions
- [ ] Day 7: MRR, paying customers, churn
- [ ] Day 30: MRR vs target (from MONETIZATION_BRIEF.md), CAC vs LTV ratio if measurable
- [ ] Decision criteria: Hit 50% of target = double down. Hit <10% = pivot pricing or audience. Zero = shelve and document why.

**Gate 4 pass:** Decision made and documented in ROADMAP.md. Revenue metrics logged.

---

## Quick Reference: Gate Summary

| Gate | Question | Who (Hat) | When |
|------|----------|-----------|------|
| 1 - Strategy | Should we build this? | Product | Before any code |
| 2 - Build | Are we ready to build? | Architect + Builder | Before sprint starts |
| 2.5 - Revenue | How does this make money? | Monetization Advisor | Before launch (or before code, even better) |
| 3 - Launch | Is it ready to ship? | Operator + Storyteller | Before go-live |
| 3.5 - iOS | App Store-ready? (iOS only) | iOS Launch Advisor | Before TestFlight + ASC submission |
| 4 - Post-Launch | Did it work? Revenue tracking. | Product + Operator | Day 1 / 7 / 30 |
| 4 - Review | Is it working and worth continuing? | Product | Week 1 + Week 4 post-launch |
