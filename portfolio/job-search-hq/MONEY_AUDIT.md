# Money Audit — Job Search HQ

**Audit date:** 2026-04-22
**App type:** Web (React CRA + Supabase)
**Deployed:** https://job-search-hq.vercel.app
**Current state:** v8.13 (Confidence Bedrock wave shipped). Daily-use single-user job search cockpit. Auth gate via Supabase email OTP, sync live, Chrome MV3 extension shipped. Zero customers, zero revenue infrastructure.

## Verdict

Not monetization-ready. The product is mature and deeply built, but every gate that touches money is unchecked. This is a personal tool for Chase that has never been positioned, priced, or instrumented for paying customers.

**Top blocker:** No revenue model has been decided. Nothing about pricing, tier strategy, or who pays what is documented anywhere in the repo.
**Fastest path to first dollar:** Decide subscription pricing, write a one-page landing, add Stripe Payment Link gated by a Supabase `plan` column, and post the link in two laid-off communities Chase already reads.

## Gates

| Gate | Status | Notes |
|---|---|---|
| Revenue model | 🔴 | Zero mentions of pricing, subscription, paywall, MRR, or monetization across any doc. The only "subscription" in the codebase is `auth.onAuthStateChange` cleanup. |
| Pricing surface | 🔴 | No `/pricing` route, no Pricing component, no upgrade CTA anywhere in the app. |
| Payment infrastructure | 🔴 | No Stripe, Lemon Squeezy, or Paddle in package.json or env. No billing keys in `.env.example`. |
| Plan gating | 🔴 | Auth exists (Supabase email OTP). Every feature is free for any signed-in user. No `plan`, `tier`, or `subscription_status` column. RLS only checks `auth.uid()`. |
| Legal docs (TOS + Privacy) | 🔴 | No TERMS.md, no PRIVACY.md, no `/terms` or `/privacy` route. Cannot legally take money in this state. |
| Analytics | 🔴 | No PostHog, Plausible, Mixpanel, or gtag. Zero visibility into who visits, what they do, or where they drop. |
| Email capture | 🔴 | No Loops, ConvertKit, Mailchimp, or Resend. No email field outside the OTP login flow. Anyone who lands and bounces is gone. |
| Custom domain | 🟡 | Still on `job-search-hq.vercel.app`. CLAUDE.md hints at `apps.chasewhittaker.com/job-search` as the canonical origin, but the deployed URL is the bare Vercel subdomain. |
| App Store readiness | n/a | Web app. iOS companion lives in a separate repo and is not in scope for this audit. |
| Launch playbook | 🟡 | `LAUNCH_CHECKLIST.md` exists but it is a personal-app launch list (build passes, README updated, Linear created). It has no marketing, pricing, or revenue gates. |
| Marketing channel | 🔴 | No channel named in ROADMAP, HANDOFF, or CLAUDE. Mentions of Reddit, IndieHackers, Product Hunt, or laid-off communities are absent. The product was built for Chase, not for an audience. |

Legend: 🔴 blocking · 🟡 important · 🔵 pass · n/a not applicable

## Next Tasks (ordered)

1. Decide the revenue model in writing. Default: subscription, $9/mo or $19/mo, 14-day free trial, no free tier beyond the trial. Capture the decision in a new `MONETIZATION_BRIEF.md` so every future session works from one source of truth.
2. Write a one-page landing at the root URL that explains who it is for (laid-off job seekers running 10 to 50 apps at once), what it does in four lines, screenshots from the live app, and a single Stripe Payment Link button. Move the current app behind `/app` so the front door is sales, not signup.
3. Stand up Stripe in test mode. Create one product, one $9/mo price, one Payment Link. Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to Vercel.
4. Add a `plan` column to the Supabase `user_data` row (or a new `subscriptions` table keyed by `user_id`). Default value: `trial`. Wire a Vercel Function webhook handler that flips the row to `paid` on `checkout.session.completed` and back to `canceled` on `customer.subscription.deleted`.
5. Gate one valuable feature behind `plan = 'paid'`. Recommendation: Apply Tools (the copy-prompts tab) since it is the highest-effort surface and the clearest "pay to keep using this" hook. Trial users get 7 days of full access, then a soft paywall.
6. Drop in Plausible or PostHog before any traffic. Track four events: `landing_view`, `signup_started`, `trial_started`, `paid_conversion`. Without this, you will not know which channel is converting.
7. Write `TERMS.md` and `PRIVACY.md`. Use Termly or Genie for a fast pass. Link from the landing footer. Required before flipping Stripe to live mode.
8. Add a single email capture on the landing for visitors who are not ready to sign up. Loops free tier handles this.
9. Point `jobsearchhq.com` (or whatever Chase owns) at Vercel. The `*.vercel.app` URL kills trust on cold traffic.
10. Pick one channel for the first 30 days. Recommendation: r/jobs, r/recruitinghell, r/layoffs on Reddit. Chase IS the persona, so the post writes itself: "I got laid off 14 months ago and built this to keep my own job search from collapsing. Three other people are using it. $9/mo, 14-day free trial."

## Time-to-first-dollar estimate

10 to 14 days if Chase works on this exclusively. The product itself is done. What's missing is purely commerce plumbing and one piece of marketing copy. Stripe Payment Link plus webhook plus plan gating is a 2 to 3 day build. Landing page plus terms plus analytics is 3 to 4 days. Posting in two communities and getting one buyer is 2 to 7 days of waiting and replying.

## Recommended pricing (if not already set)

Subscription **$9/mo** with a **14-day free trial, no credit card required**, and an annual option at **$79/yr** (about 27% off). Laid-off job seekers are price-sensitive and ROI-focused. Nine dollars is below the "ask my partner" threshold and reads as obviously cheaper than the lost time of running a search across 12 browser tabs. The trial removes the buying decision while they are in interview mode and most likely to actually use it. Annual pricing catches the small slice who want to pre-commit. Consider a free "Public profile" tier later if you want to add a referral loop, but ship paid-only first.
