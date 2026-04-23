# Money Audit — Unnamed

**Audit date:** 2026-04-22
**App type:** Web (Next.js 16 App Router + TypeScript + Tailwind 4 + localStorage)
**Deployed:** local only (not yet on Vercel)
**Current state:** v0.1 MVP built. iOS sibling installed on Chase's iPhone. Phase 1 rule: no new features until Chase uses it 7 consecutive days.

## Verdict

No-go for revenue today. The app cannot take a dollar in its current state and there is no documented plan to. It is a personal tool that has not been validated outside Chase's own use.

**Top blocker:** No revenue model decided, no payment infrastructure, and no public deploy. Nothing exists for a buyer to land on, choose, or pay through.
**Fastest path to first dollar:** Finish the 7-day usage rule, ship a deployed landing page with one paid tier, wire Stripe Checkout, and pre-sell a lifetime deal to a tight ADHD audience instead of building subscription billing first.

## Gates

| Gate | Status | Notes |
|---|---|---|
| Revenue model | 🔴 | Nothing in CLAUDE.md, ROADMAP.md, or HANDOFF.md mentions pricing, subscription, or paid tier. Phase 3 in ROADMAP mentions "potential product" but names no model. |
| Pricing surface | 🔴 | No `/pricing` route, no `Pricing.tsx`, no paywall component. Root redirects straight to `/today`. |
| Payment infrastructure | 🔴 | No Stripe, Lemon Squeezy, or Paddle in `package.json`. Only deps: `next`, `react`, `react-dom`. No env vars referenced. |
| Plan gating | n/a | No auth, no users, no plans table. App is single-user localStorage. |
| Legal docs (TOS + Privacy) | 🔴 | No `TERMS.md`, `PRIVACY.md`, no `/terms` or `/privacy` routes. Cannot legally collect payment without these. |
| Analytics | 🔴 | No PostHog, Plausible, GA, or Mixpanel. Zero conversion measurement possible. |
| Email capture | 🔴 | No Loops, ConvertKit, Resend, or newsletter form. Anyone who visits and bounces is lost. |
| Custom domain | 🔴 | Not deployed at all. Not even on a `*.vercel.app` URL yet. |
| App Store readiness | n/a | Web app. iOS sibling has its own audit context. |
| Launch playbook | 🔴 | No `LAUNCH_PLAYBOOK.md`. ROADMAP Phase 1 ends at "use for 7 days," not at a public launch checklist. |
| Marketing channel | 🔴 | ROADMAP mentions "ADHD adults who've failed every productivity app" as a market but names no specific channel (subreddit, IH, Twitter, ADHD coach communities, etc.). |

Legend: 🔴 blocking · 🟡 important · 🔵 pass · n/a not applicable

## Next Tasks (ordered)

1. Finish the 7-day personal usage gate. Without proof the app actually helps Chase, there is no story to sell. Document the days.
2. Write a one-page `MONETIZATION_BRIEF.md` that names the model (lifetime vs subscription), the price, the buyer (ADHD founders, ADHD parents, post-diagnosis adults, or a single tight slice), and the promise. Pick one slice, not all.
3. Pick and register a permanent name. The placeholder "Unnamed" is a real blocker for a domain, a landing page, App Store metadata, and any marketing post.
4. Deploy the current MVP to Vercel on a `*.vercel.app` URL so a landing page route can be added and shared privately for early feedback.
5. Build a `/` marketing landing page that replaces the redirect to `/today`. Move the app into `/app` or behind a "start" button. Add a single email capture field (Loops or Resend) above the fold.
6. Buy a custom domain that matches the chosen name. A custom domain is the lowest-cost trust signal there is.
7. Write `TERMS.md` and `PRIVACY.md` (Termly or hand-rolled is fine for a solo product) and link them in the footer. Required before a charge.
8. Wire Stripe Checkout (hosted page, not Elements) for one product. For a localStorage app with no auth, lifetime is simpler than subscription. Send the buyer a license key by email and gate "pro" features by key in localStorage.
9. Add PostHog (free tier) for events: landing view, email capture, checkout start, checkout success. Without these four events, you cannot improve conversion.
10. Pick one channel and post one piece of content there. ADHD subreddits (r/ADHD, r/adhdwomen) and IndieHackers are the lowest-friction starts for this audience. Quote the anti-features as the differentiator.
11. Pre-sell ten lifetime licenses at a steep discount before public launch. Ten yes-or-no conversations is the cheapest validation possible.
12. Only after the above, consider Supabase + auth + recurring billing. localStorage limits the buyer to one device, which is the strongest objection a paid user will raise.

## Time-to-first-dollar estimate

Three to six weeks of focused work, assuming Chase honors the 7-day usage rule first. Breakdown: 7 days for the usage gate (running in parallel with prep), 3 to 5 days for naming + domain + Vercel + landing page, 2 to 3 days for legal docs + Stripe Checkout + email capture, 5 to 10 days for one channel post + ten pre-sell conversations. The blocker is not engineering. It is naming, picking a slice of the audience, and writing copy that earns trust.

## Recommended pricing (if not already set)

Lifetime $39 one-time for v1. Subscription is the default for ADHD productivity tools, but this app has no auth, no sync, and a deliberate anti-feature philosophy that cuts against recurring billing expectations. A lifetime price under $50 fits an audience that has been burned by every productivity subscription they have tried, and it lets Chase test demand without building user accounts. Move to subscription only after Supabase sync ships in v2 and the per-device limit is gone.
