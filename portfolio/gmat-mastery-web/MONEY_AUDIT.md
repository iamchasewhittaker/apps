# Money Audit — GMAT Mastery Web

**Audit date:** 2026-04-22
**App type:** Web (Next.js 16 App Router + React 19 + Tailwind 4)
**Deployed:** local only (no Vercel project, no custom domain)
**Current state:** v0.1 scaffold from 2026-04-21. Core gameplay loop works (section + difficulty picker, Claude-generated MCQ, Socratic explanation, end-of-session summary). No accounts, no persistence, no deploy. `.env.local` holds a mock Anthropic key so both API routes 500 in their current state.

## Verdict

No-go for revenue today. The app cannot accept a payment, has no deployed surface, and has no revenue model documented.

**Top blocker:** App is not deployed and has a mock Anthropic key, so no user can even reach a paid surface.
**Fastest path to first dollar:** Ship the app to a custom domain with a real Anthropic key, gate question generation behind a one-time Stripe Payment Link priced at $49 lifetime, and post the link in r/GMAT plus a GMAT Club thread.

## Gates

| Gate | Status | Notes |
|---|---|---|
| Revenue model | 🔴 | No `MONETIZATION_BRIEF.md`. CLAUDE.md, README, AGENTS.md contain zero pricing language. |
| Pricing surface | 🔴 | No `/pricing` route, no paywall component, no checkout button anywhere in `src/`. |
| Payment infrastructure | 🔴 | No `stripe`, `lemonsqueezy`, or `paddle` in `package.json`. No payment env vars. |
| Plan gating | 🔴 | No auth, no `plan`/`tier`/`is_pro` checks. Supabase SDK installed but unwired — no `src/shared/` directory exists. |
| Legal docs (TOS + Privacy) | 🔴 | No `TERMS.md`, `PRIVACY.md`, `LICENSE`, or `/terms` `/privacy` routes. Cannot legally collect payment. |
| Analytics | 🔴 | No PostHog, Plausible, GA, Mixpanel. No way to measure landing-to-purchase conversion. |
| Email capture | 🔴 | No Loops, Resend, ConvertKit, Mailchimp. No email field anywhere. Every non-converting visitor is lost. |
| Custom domain | 🔴 | Not deployed at all. Per CLAUDE.md: "URL: not deployed", "Vercel: not yet created." |
| App Store readiness | n/a | Web app. |
| Launch playbook | 🔴 | No `LAUNCH_PLAYBOOK.md`, no `docs/LAUNCH.md`, no `ROADMAP.md`, no `HANDOFF.md`. |
| Marketing channel | 🔴 | No channel named in any doc. r/GMAT, GMAT Club, and TikTok are obvious candidates and none are claimed. |

Legend: 🔴 blocking · 🟡 important · 🔵 pass · n/a not applicable

## Next Tasks (ordered)

1. Decide pricing in writing. Recommend $49 lifetime. Capture in `MONETIZATION_BRIEF.md` with target audience (people 6 to 12 weeks out from a GMAT date), free preview rules (e.g. 5 free questions, then paywall), and refund policy.
2. Get a real `ANTHROPIC_API_KEY` into Vercel env. Without it the app crashes on first question and no one buys.
3. Decide whether to keep Haiku (`claude-haiku-4-5-20251001`) once paying users exist. Both `src/app/api/generate-question/route.ts` and `src/app/api/generate-explanation/route.ts` use Haiku for cost; tool use enforces structure but explanation quality may need Sonnet at the paid tier.
4. Set a free-question quota in `useGameState.ts` using localStorage (e.g. 5 free questions per device). After quota, show a paywall card instead of the next question.
5. Generate `TERMS.md` and `PRIVACY.md` via Termly or hand-rolled. Add `/terms` and `/privacy` routes.
6. Create a Stripe Payment Link for $49 lifetime. No subscription complexity, no webhook required for v1. On purchase, Stripe redirects to a `/unlock?token=...` page that writes a flag to localStorage. Trust-on-honor for v1, tighten with Supabase later.
7. Deploy: `vercel project add gmat-mastery-web`, `vercel link`, `vercel git connect`, `vercel --prod`. Buy a domain (gmatmastery.app or similar, $12/yr) and point it at the project.
8. Wire PostHog with `posthog-js` for `landing_view`, `question_started`, `paywall_shown`, `checkout_clicked`, `purchase_completed` events. This is what tells you whether the funnel works.
9. Add a single email capture field on the paywall ("Not ready? Get a free 7-day GMAT email plan") wired to Loops or Resend. Captures the 95%+ who don't buy first visit.
10. Pick one channel and post. Recommend two posts in r/GMAT (a free 25-question giveaway thread + a "I built this with Claude" build-in-public thread) and one in GMAT Club. Track UTMs.
11. Write `LAUNCH_PLAYBOOK.md` covering the launch week sequence (channel posts, follow-ups, response-to-feedback cadence) so you don't have to re-decide each day.

## Time-to-first-dollar estimate

8 to 14 days assuming Chase works on this exclusively. Days 1 to 3: pricing brief, Anthropic key, model bump, free quota + paywall card. Days 4 to 5: legal docs, Stripe Payment Link, deploy + domain. Days 6 to 7: PostHog + email capture. Days 8 to 14: post in r/GMAT and GMAT Club, iterate on conversion based on PostHog funnel data. WIP-limit caveat: parent CLAUDE.md says focus is RollerTask V1, so this only ships if Chase explicitly reorders.

## Recommended pricing (if not already set)

**$49 lifetime, one-time payment.** GMAT prep is single-use (you pass the test, you're done) so subscription friction kills conversion. $49 sits below the typical Magoosh / Manhattan Prep $149 to $399 anchors and reads as "cheaper than one tutoring hour" to the buyer. Offer no free trial, but allow 5 free questions before paywall so the buyer can feel the Socratic explanation quality before paying. If conversion is strong after 30 paying users, raise to $69 to test demand elasticity.
