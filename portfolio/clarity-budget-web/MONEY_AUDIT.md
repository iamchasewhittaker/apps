# Money Audit — Clarity Budget Web

**Audit date:** 2026-04-22
**App type:** Web (Next.js 15 / React 19 / TypeScript / Tailwind 4 / Supabase optional)
**Deployed:** clarity-budget-web.vercel.app
**Current state:** Session 2 done (Apr 20). STS dashboard with URL-persisted filters, tabbed spending breakdown (category / payee / week), sortable transaction list. Session 3 (Claude money companion) is the next planned build, not revenue.

## Verdict

Needs infra and a revenue model decision before it can take a single dollar. The product surface is real and useful, but every revenue gate is failing.

**Top blocker:** No revenue model defined anywhere in the repo, and no payment infrastructure wired up.
**Fastest path to first dollar:** Pick the model (subscription vs lifetime), add a Stripe checkout link off a `/pricing` route, gate the Money Companion (Phase 2) behind it, and post in r/ynab.

## Gates

| Gate | Status | Notes |
|---|---|---|
| Revenue model | 🔴 | No `MONETIZATION_BRIEF.md`. No mention of pricing, paywall, free tier, or MRR in CLAUDE.md, README.md, ROADMAP.md, HANDOFF.md. |
| Pricing surface | 🔴 | No `/pricing` route, no `Pricing.tsx`, no paywall component. App is a single page. |
| Payment infrastructure | 🔴 | No `stripe`, `@stripe/stripe-js`, `lemonsqueezy`, or `paddle` in `package.json`. No env vars referencing Stripe keys. |
| Plan gating | 🟡 | Supabase email/password auth exists for optional cross-device sync. Zero plan checks. No `plans`, `subscriptions`, or `is_pro` columns referenced. All features free. |
| Legal docs (TOS + Privacy) | 🔴 | No `TERMS.md`, `PRIVACY.md`, `/terms` route, or `/privacy` route. Cannot legally collect payment until both exist, especially given YNAB token handling. |
| Analytics | 🔴 | No PostHog, Plausible, Mixpanel, `gtag`, or `@vercel/analytics`. Zero conversion measurement. |
| Email capture | 🔴 | No Loops, Resend, ConvertKit, Mailchimp, or newsletter form. Every visitor who does not paste a YNAB token is lost. |
| Custom domain | 🟡 | Live on `clarity-budget-web.vercel.app`. No custom domain. Lower trust for a tool that asks for a YNAB personal access token. |
| App Store readiness | n/a | Web app. iOS sibling (`clarity-budget-ios`) is a separate audit. |
| Launch playbook | 🔴 | No `LAUNCH_PLAYBOOK.md` in this app. Master template at `chase/portfolio/docs/governance/LAUNCH_CHECKLIST.md` does not exist either. |
| Marketing channel | 🟡 | No channel named in app docs. Audience is obvious (r/ynab, r/ynab4, r/personalfinance, YNAB Discord), but not committed in writing. |

Legend: 🔴 blocking · 🟡 important · 🔵 pass · n/a not applicable

## Next Tasks (ordered)

1. Decide the model. Pick subscription $4.99/mo or lifetime $29 one-time. Write `MONETIZATION_BRIEF.md` with the decision, the target buyer (YNAB power user with ADHD or attention struggles), and what is free vs paid. The default split: STS dashboard + filters free, Money Companion (Phase 2) paid.
2. Write `TERMS.md` and `PRIVACY.md`. Privacy policy must be explicit about three things: YNAB token never leaves the browser, transactions never sync to Supabase, only the BudgetBlob (mappings + roles) hits the cloud and only if the user signs in. Use a generator (Termly, Iubenda) and customize for the YNAB token handling.
3. Add a custom domain. `claritybudget.app` or similar. Asking strangers to paste a YNAB personal access token into a `*.vercel.app` subdomain is a trust killer.
4. Add a `/pricing` route. One page. Tier table, "Connect YNAB to start" CTA, FAQ that addresses the YNAB token concern up front.
5. Wire Stripe Checkout. Test mode first. Use Stripe-hosted checkout, not custom UI. Add `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` to Vercel env. Single product, monthly recurring or one-time.
6. Add a `subscriptions` table to Supabase (or use Stripe webhooks to a single `is_pro` column on `user_data`). Gate the Phase 2 Money Companion routes behind it.
7. Install `@vercel/analytics` (zero config, free tier covers this) and add a single PostHog event for "checkout clicked" + "subscription started".
8. Add a marketing landing page above the app. Right now `/` drops users straight into the dashboard. New flow: marketing page at `/`, app at `/app`. Include screenshot of the spending breakdown, the YNAB-power-user pitch, and pricing.
9. Add email capture on the landing page. Loops or Resend, single field, "Get notified when Money Companion ships".
10. Write `LAUNCH_PLAYBOOK.md` with the r/ynab post draft, the 5 YNAB Discord channels worth posting in, and the launch sequence (post, monitor, reply for 24 hours).
11. Address the YNAB Personal Access Token problem head-on in copy. Power users know what a PAT is. Newer YNAB users do not. Either accept that the audience is power users only, or add a walkthrough page that shows exactly where to generate a token and reassures them it stays in their browser.
12. Ship the Money Companion (WHI-73, already planned for Session 3) so there is something behind the paywall worth paying for.

## Time-to-first-dollar estimate

10 to 14 days if Chase works on this exclusively. Breakdown: 1 day for monetization brief + legal docs (use a generator), 1 day for custom domain + DNS, 2 days for `/pricing` page + landing page split, 2 days for Stripe Checkout + Supabase plan column + webhook, 1 day for analytics + email capture, 3 to 5 days to finish Money Companion so the paid tier actually delivers something. Then post in r/ynab and wait. r/ynab has 200k+ members and YNAB users are already paying $14.99/mo for the parent product, so willingness to pay for adjacent tooling is real.

## Recommended pricing (if not already set)

Subscription $4.99/mo with a 14-day free trial, no credit card required. This fits because the audience already pays YNAB $14.99/mo and is comfortable with subscription pricing for budget tooling, $4.99 is below the "do I need this?" reflex threshold for someone already spending $15 elsewhere, and the Money Companion (Phase 2) uses Claude tokens on every interaction so a one-time purchase would bleed margin. If Chase prefers one-time, $29 lifetime is the alternative, but margin breaks the moment a user generates more than $29 of Claude API calls.
