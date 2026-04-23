# Launch Playbook — <APP NAME>

> Filled during Phase 5 of the build framework. Every gate below must pass before launch day. If a gate is n/a, write why.

## Pre-launch (T-30 days)

### Domain + hosting
- [ ] Custom domain purchased (`<app>.com` or subdomain)
- [ ] DNS pointed at Vercel / hosting provider
- [ ] SSL active and verified
- [ ] `www` redirect configured
- [ ] OG image set, link previews verified on iMessage + Slack + Twitter

### Legal
- [ ] TOS published at `/terms`
- [ ] Privacy Policy published at `/privacy`
- [ ] Cookie banner if EU traffic expected
- [ ] Refund policy documented (especially for lifetime / one-time)
- [ ] DMCA / Contact email live

### Payment
- [ ] Stripe (or chosen provider) account verified
- [ ] Bank account connected for payouts
- [ ] Tax info submitted (W-9 / W-8)
- [ ] Live mode keys in production env
- [ ] Test purchase end-to-end with real card
- [ ] Receipt email working
- [ ] Customer portal accessible from app
- [ ] Refund flow tested

### Analytics + tracking
- [ ] PostHog (or chosen tool) installed
- [ ] Conversion events fire (signup, paid, churn)
- [ ] Funnel report set up
- [ ] Daily active user dashboard live

### Email
- [ ] Loops (or chosen tool) account
- [ ] Welcome email written and sequenced
- [ ] Receipt email branded
- [ ] Email capture form on landing page
- [ ] Sender domain verified (SPF / DKIM)

### Marketing surface
- [ ] Landing page live (not the app shell)
- [ ] One-line value prop in headline
- [ ] Three or fewer hero CTAs
- [ ] Demo video or animated screenshot
- [ ] Pricing page (or pricing block on landing)
- [ ] FAQ section answers top 5 objections
- [ ] About / "who built this" section

## Launch day (T-0)

### Distribution channels (pick 1-2, not all)
- [ ] Reddit post in r/<niche subreddit>
- [ ] IndieHackers ship post
- [ ] Twitter / X build-in-public thread
- [ ] LinkedIn post
- [ ] Product Hunt (if positioned correctly)
- [ ] Email blast to existing list
- [ ] DM to 10 specific people who would care

### Day-of tasks
- [ ] Post launch content by 8 AM PT
- [ ] Reply to every comment within 1 hour for first 6 hours
- [ ] Pin tweet / post the Stripe link
- [ ] Monitor PostHog for errors
- [ ] Have a rollback plan if checkout breaks

## Post-launch (T+30)

### Metrics to watch
| Day | Metric | Target |
|---|---|---|
| 1 | Visitors | |
| 1 | Signups | |
| 1 | Paid conversions | |
| 7 | MRR | |
| 30 | MRR | |
| 30 | Churn | |

### Iteration loop
- [ ] Weekly email to paid users asking for feedback
- [ ] Monthly check on top user request, ship one
- [ ] 30-day decision: double down, iterate, or shelve

## App Store launch (iOS only)

If this is an iOS app, also run `/ios-launch` to generate `LAUNCH_IOS.md` and complete those gates.

## Decision log

- **<YYYY-MM-DD>** — chose <Stripe / Lemon Squeezy / RevenueCat> for payment because <reason>.
- **<YYYY-MM-DD>** — picked <Reddit / IndieHackers / Twitter> as primary launch channel because <reason>.
