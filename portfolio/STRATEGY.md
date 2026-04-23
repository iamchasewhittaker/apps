# Portfolio Strategy

> Living doc. Update quarterly, or after any material shift in priorities.
> Last updated: 2026-04-22

> *"For Reese. For Buzz. Forward — no excuses."*

---

## 1. Executive Summary

**Where we are today (2026-04-22):**
- 38 projects in portfolio. 11 deployed, 14 in active build, 9 idea/started, 4 archived.
- $0 MRR. Zero monetization wired anywhere. Zero paying customers.
- No public audience. No Twitter, LinkedIn, or community presence as a builder.
- 1+ year unemployed, actively job hunting (5 apps + 3 outreach daily).

**Where we want to be in 90 days (2026-07-22):**
- $500 MRR or $1,000 in cumulative one-time sales from at least 1 product.
- 3 priority apps with paywalls live and Stripe wired (Job Search HQ, GMAT Mastery, Clarity Budget at minimum).
- 1 confidence-bypass artifact shipped (e.g., YNAB power-user templates pack on Gumroad).
- 100 followers somewhere (IndieHackers, Twitter, or LinkedIn). Doesn't matter where.
- Job-search momentum maintained or accelerated. Apps don't replace the job hunt.

**Where we want to be in 180 days (2026-10-22):**
- $2,000 MRR.
- Either a full-time role landed, OR enough side income that the search becomes optional.
- One piece of content per week, in voice, under Chase's name.

**The constraint that shapes everything:** Chase has no audience, low confidence in being a public expert, and feels timid about putting himself out there. This isn't a flaw to fix. It's the design constraint. Strategy must work for *this* Chase, not a hypothetical bold one. Every recommendation in this doc respects that.

---

## 2. The Honest Starting Point

**What's real:**
- Chase has built 38 projects in roughly a year. Most builders ship 1 or 2.
- Job Search HQ has Chrome extension, AI integration, real pipeline CRM. It's a product, not a toy.
- Wellness Tracker, Shipyard, Knowledge Base, Alias Ledger, Ash Reader are live and working.
- Code quality is high. Git hygiene is high. Supabase RLS + auth + sync is wired across multiple apps.
- ADHD lived experience is the basis for the lane framework, check-in system, 4 loops. That's IP, not background.

**What's hard:**
- He's been laid off 1+ year. Money pressure is real, not theoretical.
- He doesn't feel like an authority. Doesn't have the confidence to write thought-leadership posts.
- Family-first ("For Reese. For Buzz.") means swing for stability over swing for the fences.
- ADHD + anxiety means consistency is harder than it looks from the outside.

**What this doc refuses to do:**
- Tell Chase to "just post on LinkedIn" or "build in public." That's the hard part, not the answer.
- Pretend any of these 38 apps is a unicorn. They're useful tools. Some can make money. None are fundraising material.
- Suggest income paths that require him to be a personality first. Sell the work. The work is real.

---

## 3. Strengths Reframed as Income

CliftonStrengths Top 5: Harmony, Developer, Consistency, Context, Individualization.

| Strength | What it does in voice/work | What it could earn |
|---|---|---|
| **Harmony** | Calm when the room isn't. "Let me make sure I understand what you're asking for." | Tools and content for ADHD, anxiety, job loss. People who feel chaotic want a calm voice. Wellness Tracker, Unnamed/Dash OS, lane framework. |
| **Developer** | Sees potential in people and systems. Asks "what would make this easier for you?" | Coaching (later, when confidence allows). System templates (now). Productized "I'll set this up for you" services. |
| **Consistency** | Says he'll have it back by Thursday, then does. Daily systems, repeatable frameworks. | Daily-use tools (subscription fits). Habit and check-in apps. Methodologies that are repeatable, not novel. |
| **Context** | References what's been tried. "I've seen this on Authorize.Net deploys, usually it's the webhook URL." | Long-form writing (build-in-public, post-mortems). Case studies. Anything where the *why* matters more than the *what*. |
| **Individualization** | Doesn't send the same outreach twice. Notices what the person cares about. | Custom-fit deliverables, not mass courses. Productized 1:1 services beat group programs at this price tier. |

**Insight:** The combination of Harmony + Developer + Individualization is uncommon. It's the profile of a great Implementation Consultant, which is exactly the job direction Chase is targeting. The 1099 contract path is real income while the W2 search continues.

---

## 4. Project Portfolio Table

Status uses the live CLAUDE.md as source of truth.

Monetization-readiness scoring (0-10):
- 0-2: idea/abandoned. No path to revenue without major rebuild.
- 3-5: working code, no revenue model defined, no paywall, no audience.
- 6-7: working code + clear revenue model, missing infrastructure (Stripe, landing, legal).
- 8-9: infrastructure ready, just needs the gate flipped + first marketing push.
- 10: paying customers.

| App | Status | M-Score | Action |
|---|---|---|---|
| **Job Search HQ** | Live, v8.12 | 5 | Monetize (top 4) |
| **GMAT Mastery Web** | In build | 4 | Monetize (top 4) |
| **Clarity Budget Web** | In build, v0.4 | 5 | Monetize (top 4) |
| **Unnamed Web** | In build, v0.1 | 4 | Monetize (top 4) |
| **Wellness Tracker** | Live, v15.10 | 4 | Hold, validate audience first |
| **Wellness Tracker iOS** | Local, Phase 2 | 3 | Hold, gate behind web revenue |
| **Shipyard** | Live, v0.1 | 3 | Internal tool, leverage as Clarity OS hub if Path B chosen |
| **Shipyard iOS** | Local | 2 | Hold |
| **Knowledge Base** | Live, v2.1.1 | 2 | Personal use only, archive candidate |
| **Alias Ledger** | Live, v1.0 | 2 | Personal use only, hold |
| **Ash Reader** | Live, v1.0 | 3 | Niche, validate before monetizing |
| **Ash Reader iOS** | Local, v0.3 | 2 | Hold |
| **Clarity Budget iOS** | Local, v0.2 | 4 | Bundle (Path A or B) |
| **Clarity Checkin iOS** | Local, v0.1 | 3 | Bundle (Path A or B) |
| **Clarity Triage iOS** | Local, v0.1 | 2 | Bundle (Path B) or archive |
| **Clarity Time iOS** | Local, v0.1 | 2 | Bundle (Path B) or archive |
| **Clarity Growth iOS** | Local, v0.1 | 2 | Bundle (Path B) or archive |
| **Clarity Command iOS** | Local, v0.1 | 2 | Bundle (Path B) or archive |
| **Clarity Command Web** | Live, v1.0 | 2 | Archive candidate (superseded) |
| **Clarity Hub** | Live, v0.2 | 2 | Archive candidate (consolidate into Shipyard) |
| **Job Search HQ iOS** | Local, v0.1 | 4 | Roadmap follow-on after web revenue |
| **Funded iOS** | Local, v0.1 | 3 | Bundle with Clarity Budget or archive |
| **Funded Web** | Live, v1.0 | 2 | Archive candidate (consolidate) |
| **RollerTask Tycoon iOS** | Local, v1.0 | 4 | Ship as $2.99 paid app or free + ads |
| **RollerTask Tycoon Web PWA** | Live, v1.0 | 2 | Archive candidate |
| **App Forge** | Live, v8.1 | 1 | Internal tool, hold |
| **AI Dev Mastery** | Live, v1.0.1 | 6 | Productize as paid course ($79-149) |
| **Spend Clarity** | Local, Python CLI | 3 | Internal tool, gate behind Clarity Budget |
| **Spend Radar** | Local, Apps Script | 2 | Archive candidate (consolidate) |
| **Spend Radar Web** | Local | 2 | Archive candidate |
| **Gmail Forge** | Live | 3 | Internal tool, possible template pack ($19) |
| **Fairway iOS** | Local, v0.1 | 2 | Personal hobby, hold |
| **Idea Kitchen** | Live (docs), v0.3 | 7 | Productize as $299 service |
| **Claude Usage Tool** | Live, v0.10.0 | 3 | Hold, possible $9 menu-bar app |
| **Shortcut Reference** | Live, v0.1.0 | 2 | Personal use, hold |
| **ClarityUI Swift package** | Built | n/a | Internal library |
| **Growth Tracker** | Archived | n/a | Done |
| **Money** | Archived | n/a | Done |
| **Roller Task Web (archived)** | Archived | n/a | Done |

---

## 5. Top 4 Monetization Roadmap

### 5.1 Job Search HQ → "HQ Pro"

**Why this one:** Chase lives in it daily. Founder-market fit is real. Audience (job seekers, especially laid-off mid-career tech workers) has acute pain and proven willingness to pay (LinkedIn Premium, Teal, Huntr exist).

**Pricing:** $9.99/mo or $79/year. 14-day free trial. No free tier (kills urgency).

**What unlocks Pro:**
- AI coach (Claude API): cover letter rewrites, STAR story coach, interview prep on any job posting.
- Mock interview with voice playback + transcription scoring.
- Weekly auto-report email (pipeline summary, follow-up reminders).
- Chrome extension premium features (auto-apply with tailored cover letter).

**Free tier (lead magnet, not product):**
- Pipeline CRM (tracks 10 active apps).
- Basic AI features (5 calls/month).

**Required infrastructure:**
- Stripe Subscriptions (use [Stripe Customer Portal for self-serve cancellation](https://stripe.com/docs/billing/subscriptions/customer-portal)).
- Supabase plan-gating (add `plan` column to user_metadata, RLS check on Pro features).
- Pricing page at `/pricing` (component pattern from Job Search HQ existing styles).
- Legal pages: TOS, Privacy, Refund Policy (use [Termly free generator](https://termly.io/) for v1).
- Email capture for waitlist before launch (use [Loops](https://loops.so/) free tier).
- Analytics: PostHog (free up to 1M events).

**4-week build plan:**
- **Week 1:** Stripe account + Customer Portal + product/price IDs. Add `plan` field to Supabase user_metadata. Wire RLS check.
- **Week 2:** Build pricing page (`/pricing`) + checkout flow. Wire 1 Pro feature behind paywall (start with weekly report email).
- **Week 3:** Wire remaining Pro features (mock interview, advanced AI coach). Build Account Settings page with cancel/manage subscription.
- **Week 4:** Legal pages, analytics, email capture, "Pro" badge in UI. Soft launch to Chase's network (text 10 people, not "announce").

**First marketing channel (low-confidence-friendly):**
- Post one long-form on IndieHackers: "I built a job-search command center because I'm 1+ year laid off. Here's everything in it." Link to free tier. No "buy this" pitch.
- Comment helpfully in r/jobs, r/cscareerquestions, r/recruitinghell when relevant. No drive-by self-promo.
- Email past coworkers with a personal note (not blast): "I built a thing for my own search. Free to use. Want a walkthrough?"

**Success criteria:**
- Day 30: 100 free signups, 3 paid conversions, $30 MRR.
- Day 60: 300 signups, 10 paid, $100 MRR. If <5 paid, revisit pricing or features.
- Day 90: 500 signups, 20 paid, $200 MRR. Decision: scale marketing or pivot focus.

**Decision criteria:** If Day 60 hits <5 paid, pause marketing spend and run 5 customer interviews. Conversion problem or product problem before more growth.

---

### 5.2 GMAT Mastery → "GMAT Coach"

**Why this one:** Niche audience with proven willingness to pay ($200-2000 on prep courses like Magoosh, Manhattan Prep, Target Test Prep). Already wired to Claude API. AI question generation + Socratic explanations is a real differentiator vs. static practice tests.

**Pricing:** $49 lifetime, OR $19/mo (keep both options at launch, see which converts).

**Why one-time fits:** GMAT is a one-shot event. Most users use prep for 2-3 months, then stop. Lifetime pricing matches the use pattern.

**Required infrastructure:**
- [Lemon Squeezy](https://lemonsqueezy.com) for one-time purchases (handles tax, simpler than Stripe for digital goods, takes 5% + $0.50).
- Supabase auth gate.
- Pricing page.
- Legal pages.
- Email capture.

**4-week build plan:**
- **Week 1:** Finish core question-generation flow. Wire Claude API rate limiting (cap users at 100 questions/day to control API cost).
- **Week 2:** Lemon Squeezy product setup, checkout flow, license key system.
- **Week 3:** Onboarding flow (placement test → study plan generation). Account page.
- **Week 4:** Landing page (real one, not just /pricing). Legal pages. Soft launch.

**First marketing channel:**
- Post in r/GMAT (10k subscribers, active community). Lead with the AI-generated questions, not a sales pitch.
- Write one long-form on Medium or Substack: "How AI changed how I'd study for the GMAT in 2026."
- Reach out to 3 GMAT YouTubers offering free lifetime access in exchange for a mention.

**Success criteria:**
- Day 30: 50 signups, 2 paid, $98 revenue.
- Day 60: 200 signups, 10 paid, $490 cumulative.
- Day 90: 500 signups, 30 paid, $1,470 cumulative.

---

### 5.3 Clarity Budget → "Safe to Spend"

**Why this one:** YNAB has 20k+ active users hungry for power tools. Safe-to-Spend daily forecast + receipt enrichment from Gmail is a feature YNAB doesn't have natively. Existing YNAB API integration is already wired. Subreddit r/ynab is a real, distribution-ready audience.

**Pricing:** $4.99/mo or $39/year. Free tier with read-only YNAB import.

**What unlocks paid:**
- Daily Safe-to-Spend forecast (the killer feature).
- Receipt enrichment (Gmail OCR + Privacy.com merchant cleanup).
- Spending breakdown with payee/category/week views.
- Custom rule engine for auto-categorization.

**Required infrastructure:**
- Stripe Subscriptions.
- Supabase plan-gating.
- Pricing page.
- Legal pages.
- Privacy Policy specifically must address Gmail OAuth scope (this is sensitive).

**4-week build plan:**
- **Week 1:** Stripe + plan gating. Lock receipt enrichment behind paid plan.
- **Week 2:** Pricing page + checkout. Free vs Paid feature comparison clear in UI.
- **Week 3:** Onboarding (connect YNAB, import last 30 days, show Safe to Spend on Day 1).
- **Week 4:** Legal pages (extra care on Gmail OAuth scope disclosure). Submit Gmail API verification (takes 2-6 weeks).

**First marketing channel:**
- Post in r/ynab: "I built a Safe-to-Spend dashboard that reads from YNAB. Free to try, $5/mo for receipt enrichment." Subreddit is rule-friendly to genuine builds with disclosure.
- Reach out to YNAB community moderators / Discord admins offering free year for review.

**Success criteria:**
- Day 30: 30 signups, 5 paid, $25 MRR.
- Day 60: 100 signups, 15 paid, $75 MRR.
- Day 90: 250 signups, 30 paid, $150 MRR.

**Risk:** Gmail API verification takes 2-6 weeks. Submit Week 4 to avoid blocking launch.

---

### 5.4 Unnamed/Dash OS → "Lane"

**Why this one:** Personal pain Chase solved for himself. Lane framework is differentiated (most ADHD apps are todo lists or pomodoros). r/ADHD has 1.7M members. ADHD coaching market is growing fast.

**Pricing:** $4.99/mo. Free tier with one lane only.

**What unlocks paid:**
- All 4 lanes (Regulation, Maintenance, Support Others, Future).
- Lane lock + reflection prompts.
- Streak history + visualization.
- Optional Apple Health sleep + activity integration.

**Required infrastructure:**
- Stripe Subscriptions.
- Supabase plan-gating.
- Pricing page.
- Legal pages (sensitive: mental health context, not a medical device, disclaimer needed).

**4-week build plan:**
- **Week 1:** Finish core lane-switching flow + 7-day rule (already in progress).
- **Week 2:** Stripe + plan gating + free tier (one lane only).
- **Week 3:** Onboarding flow that explains the 4 lanes (this IS the marketing).
- **Week 4:** Legal pages + medical disclaimer. Soft launch.

**First marketing channel:**
- Post in r/ADHD: "I'm an ADHD founder. I built a daily OS based on 4 lanes. Free to try." Lead with personal story.
- Comment thoughtfully in ADHD coaching subreddits.
- Reach out to 3 ADHD content creators on TikTok/YouTube offering free year.

**Success criteria:**
- Day 30: 75 signups, 3 paid, $15 MRR.
- Day 60: 200 signups, 10 paid, $50 MRR.
- Day 90: 500 signups, 25 paid, $125 MRR.

**Decision criteria:** ADHD apps have notoriously low retention. If Day 30 retention <30%, the product needs work before more marketing.

---

## 6. Clarity Strategy: Two Paths Laid Out

The Clarity family is 10 apps. They share one Supabase project but no clear product boundary. To monetize, this needs a story. Here are both paths, side by side.

### Path A: Pick the Top 2-3 Standalone

Pick the strongest 2-3 (Clarity Budget Web + iOS, plus possibly Clarity Checkin iOS), monetize independently, archive or fold the rest.

**Pros:**
- Faster to first dollar (less to ship per app).
- Simple positioning per app ("Safe to Spend for YNAB users").
- Lower maintenance burden (3 apps vs 10).
- Each one can have its own audience and channel.

**Cons:**
- Kills sunk cost on 7 apps that don't make the cut.
- Hard to justify the iOS Clarity stack work (Triage, Time, Growth, Command) if they're archived.
- Less defensible than a "system."

**What to ship in 90 days:**
- Clarity Budget Web ($4.99/mo, see section 5.3).
- Clarity Budget iOS as a paid companion ($2.99 one-time or bundled with web).
- Clarity Checkin iOS as standalone $2.99 (or free with Wellness Tracker).
- Archive: Triage, Time, Growth, Command iOS apps. Funded iOS folds into Clarity Budget. Clarity Hub web folds into Shipyard.

### Path B: Bundle Into "Clarity OS"

Position all 10 as one $14.99/mo subscription with module switcher in Shipyard. Defensible as "the operating system for ADHD founders."

**Pros:**
- High average customer value ($14.99/mo vs $4.99/mo).
- Leverages all built work (none of the iOS apps get archived).
- Defensible positioning (no competitor has 10 modules).
- Builds Chase's brand around a coherent point of view.
- Shipyard becomes the customer-facing front door instead of an internal tool.

**Cons:**
- Complex onboarding ("which lane? which module? where do I start?").
- Harder to message in one sentence.
- Takes longer to launch (probably 60-90 days vs 30-45 days for Path A).
- Higher churn risk if onboarding overwhelms new users.

**What to ship in 90 days:**
- Refactor Shipyard into a Clarity OS dashboard (module switcher, unified login, billing).
- Wire Stripe Subscriptions at $14.99/mo with 14-day trial.
- Pick one "front door" module (Clarity Checkin) that loads first and is easy to grok.
- Write one onboarding video (5 min) that walks through the 10 modules.
- Launch with a "Founding Member" price of $9.99/mo for first 100 signups.

### Recommendation

**Lean Path A.** Reasons:
1. Time-to-revenue matters. Chase needs $X by Day 90, not Day 180.
2. Clarity Budget alone is the strongest of the 10 (proven YNAB audience). Don't bury it under 9 other modules at launch.
3. Confidence-building requires shipping something users actually pay for. One product at $4.99 selling beats 10 at $14.99 not selling.
4. Path B can still happen in Year 2 once Path A products have audiences. Convert them to modules of Clarity OS later.

**But Chase decides.** This is a values call as much as a strategy call. If the goal is to build a defensible thing he can be known for, Path B might be right. If the goal is income now, Path A is right. The plan defers the call.

---

## 7. Brand-from-Zero Playbook

For someone who has no audience and doesn't feel like an expert. Built around the principle: write artifacts before personalities, ship work before opinions.

### Month 1: Write artifacts. No face. No personal brand pressure.

**Cadence:** 1 long-form per week. Pick the lowest-stakes platform: IndieHackers + dev.to.

**Topic ideas (Chase already has the material):**
- "I built 38 apps in a year while job hunting with ADHD. Here's the system."
- "A non-bold person's guide to monetizing apps you already built."
- "How I use Claude Code to ship one app a week."
- "What I wish I knew before I built 10 ADHD apps."

**Goal:** 4 posts published. Not virality. Not 1000 readers. Just *published*.

**Why this works:** No camera. No personality. No sales pitch. The work IS the credential. IndieHackers comments are kind. dev.to has SEO benefit.

### Month 2: Pseudo-public on Twitter

**Cadence:** 1 build-in-public tweet per day. 1 sentence + screenshot. 5 minutes per tweet.

**Format:**
- "Wired Stripe into Job Search HQ today. First paid feature: weekly auto-report email. Soft launch in 2 weeks. [screenshot]"
- "Day 47 of /unnamed: 4 lanes, lane lock, no notification spam. Looking for ADHD beta testers. [screenshot]"

**Hashtags:** #BuildInPublic, #IndieHackers, #ADHDFounder.

**Goal:** 30 posts. 100 followers. 1 real conversation.

**Why this works:** Tweets are low stakes. Building in public has a built-in audience that rewards the *behavior* not the *quality*. Daily cadence beats weekly thoughtful posts.

### Month 3: LinkedIn + first paid artifact ships

**LinkedIn:** 1 post per week. Topic: build-in-public progress, frame it as a learning ("I tried X, here's what happened").

**First paid artifact:** Ship the YNAB power-user templates pack on Gumroad. $19 lifetime. The pack IS the marketing.

**Goal:** First dollar earned. 10 customers. 200 LinkedIn followers (mostly from existing connections engaging).

### Month 4-6: Start showing up

**LinkedIn:** Add face/photo to posts. Weekly cadence stays.

**Twitter:** Daily build-in-public. Add 1 longer thread per week.

**New offer:** Launch coaching or higher-touch service IF confidence allows. Otherwise stay in artifact mode.

**Goal:** $500 MRR + 500 followers + 1 product with at least 50 customers.

### The Confidence Ladder

Each step requires the previous step to have happened consistently for ≥30 days. No skipping.

1. Publish under name (Month 1).
2. Publish with photo (Month 4).
3. Publish video (Month 6 or later).
4. Live cohort or 1:1 coaching (Month 9 or later).

**Why the ladder matters:** Skipping steps is the #1 reason builders burn out on personal brand. Build the muscle. Don't perform it.

### What NOT to do

- Don't film TikTok/Instagram Reels in months 1-3. Too high a confidence cost for the audience size.
- Don't post on Twitter without a screenshot or specific result. Vague "thinking out loud" tweets don't help.
- Don't compare to bigger builders. Pieter Levels and Justin Welsh are decades into their craft.
- Don't quit if a post flops. The first 50 posts are practice. Rate of improvement matters more than reach.

---

## 8. Confidence-Bypass Income Paths

Ranked by how much personal brand / public confidence is required. Lower is easier to start now.

### Tier 1: No personal brand required

**1. YNAB power-user templates pack — $19 lifetime, Gumroad**
- Time to ship: 1 week.
- Built-in audience: r/ynab (53k members).
- Output IS the marketing. Pack is YNAB workbook templates derived from Spend Clarity / Clarity Budget data models.
- Realistic Year 1: 100 sales = $1,900.
- Confidence required: 1/10. Just post in r/ynab once and let the asset sell itself.

**2. ADHD founder ops template pack — $49 lifetime, Notion or Obsidian**
- Time to ship: 2 weeks.
- Built-in audience: ADHD subreddits, IndieHackers ADHD micro-community.
- Pack is the lane framework + check-in system + 4 loops materials, packaged as Notion or Obsidian templates.
- Realistic Year 1: 75 sales = $3,675.
- Confidence required: 2/10. Personal story helps but isn't required.

**3. Anthropic Claude Code mastery mini-course — $79, video, no face**
- Time to ship: 4 weeks.
- Audience: Twitter #BuildInPublic, IndieHackers, dev.to readers.
- 5 short screencasted videos (no face). Topics: "How I built 38 apps in a year with Claude Code."
- Realistic Year 1: 50 sales = $3,950.
- Confidence required: 3/10. Voice but no face. Output is technical (less personal exposure).

### Tier 2: Some personal credibility helps

**4. Brand systems for indie devs — $1,500-$3,000 per brand, productized service**
- Time to ship: Ready now (Shipyard process IS the SKU).
- Audience: IndieHackers, Twitter builders.
- Deliverable: brand guide, design tokens, logo. Output is the marketing.
- Realistic Year 1: 5 clients = $10,000.
- Confidence required: 4/10. Need to talk to clients but the work speaks.

**5. Job Search HQ template/clone setup — $497 one-time**
- Time to ship: 2 weeks (after JSHQ paywall is live).
- Audience: laid-off tech workers (specific subreddits).
- Deliverable: "I'll set up your personal job-search command center" (deploy a fork to your domain, configure your data, walkthrough video).
- Realistic Year 1: 10 clients = $4,970.
- Confidence required: 4/10. Need to be on a 30-min call but it's technical, not personality.

**6. Idea Kitchen as a service — $299 one-time**
- Time to ship: Ready now (after Idea Kitchen v0.4).
- Audience: IndieHackers, X/Twitter indie builders.
- Deliverable: run /idea-kitchen on the customer's idea, hand back 8 artifacts.
- Realistic Year 1: 20 clients = $5,980.
- Confidence required: 5/10. Need to talk through their idea, but the framework does the structured work.

### Tier 3: Bridge income (no brand at all)

**7. Affiliate income — Anthropic, Vercel, Supabase, Cursor, GitHub Copilot**
- Time to ship: Today (sign up for affiliate programs).
- Embed in build-in-public posts naturally ("Built this with Claude Code on Vercel + Supabase").
- Realistic Year 1: $500-2,000 (passive once content is up).

**8. Freelance Next.js/Supabase via Contra or Wellfound — $80-150/hr**
- Time to ship: This week (build profile).
- Audience: Contra and Wellfound have inbound leads from startups.
- No personal brand needed. Portfolio of 38 apps is the resume.
- Realistic Year 1: 5-10 contracts = $20,000-50,000.
- Confidence required: 3/10. Standard freelance interviewing.

**9. Implementation Consultant 1099 contract — $80-150/hr**
- Time to ship: Now (this matches Chase's job-search direction anyway).
- Some payments-adjacent companies hire 1099 ICs alongside W2 SEs.
- Realistic Year 1: 1 contract @ 20 hr/week = $80,000-150,000 annualized.
- Confidence required: 4/10. Same as job interviews, just for contracts.

### Tier 4: Optionality plays

**10. Build-for-equity micro-bets — 0.5-2% equity for 4-8 weeks of work**
- Time to ship: Network-dependent.
- Audience: early-stage founders who need an MVP and can't afford to hire.
- Output is the work. Equity is the bet.
- Realistic Year 1: $0 cash, but 1-2 small equity stakes that might be worth $0-50k each in 5 years.
- Confidence required: 5/10. Need to negotiate terms but the work speaks.

### Recommended order of attempt

1. (Week 1) Sign up for affiliate programs (Tier 3, #7). Passive baseline.
2. (Week 2) Build Contra/Wellfound profile (Tier 3, #8). Bridge income.
3. (Week 3) Ship YNAB templates pack (Tier 1, #1). First sale.
4. (Week 4-6) Ship ADHD founder ops template (Tier 1, #2). Second product.
5. (Month 2) Soft-launch Brand systems for indie devs (Tier 2, #4) on Twitter once 50 followers exist.
6. (Month 3+) Productized service offers as Job Search HQ Pro builds audience.

**This order is designed for Chase's actual confidence level today. The earliest items require no personality, no audience, and produce real output.**

---

## 9. Ideaflow + Naval Brainstorm Framework

Used by /idea-kitchen Phase 0. Generates 20+ raw seeds before narrowing to 3 to validate.

### The Bug List (Ideaflow methodology)

Catalog daily frustrations. Each bug is a potential product. Examples from Chase's life:
- "I have to manually paste ChatGPT exports into Ash one chunk at a time" → Ash Reader.
- "YNAB doesn't show what I can safely spend today" → Clarity Budget Safe-to-Spend.
- "Job search apps don't track my contacts and outreach the way I think about them" → Job Search HQ.

**The exercise:** Write 20 bugs from the past week. Rank by frequency (how often does it happen?) and intensity (how much does it hurt?). Top 5 are product candidates.

### The Combo Prompt

Pick two unrelated interests/skills/audiences. Ideate 5 ideas at the intersection. Examples:
- ADHD × Faith → scripture study app with 4-lane focus, "ministering tracker for ADHD elders."
- Mountaineering × Budgeting → "expedition budgeting tool" (one-time goal saving with milestones).
- Implementation Consulting × ADHD → coaching service for founders with ADHD launching SaaS products.

**The exercise:** Pull two random items from Chase's interests/strengths/audiences. Ideate 5 ideas. Repeat 3 times.

### Steal and Twist

Find a tool Chase uses and loves. Ideate 5 ways to remix for an underserved audience.
- Linear → Linear for non-engineers (project management for ADHD parents).
- Notion → Notion templates pack for laid-off tech workers.
- YNAB → YNAB methodology for irregular income (freelancers, contractors).

### The Naval Angles

Apply each lens, write 1-3 ideas per lens.

- **"What can you do that others can't be trained for?"** Specific knowledge audit. Chase's: building 38 apps in a year with Claude Code while managing ADHD + job loss. That's a niche of one.
- **"What permissionless leverage exists?"** Code (apps), media (writing), people (audience). Chase has code. Needs media.
- **"Productize yourself."** What does Chase do that no one else does the same way? Most likely answer: implementation consulting with ADHD-aware design.
- **"Long-term game with long-term people."** Which audience could Chase serve for 10 years? Likely answer: ADHD builders/founders, or laid-off mid-career tech workers.

### The Output

20+ raw seeds → narrow to 3 (using Ideaflow's "ratio matters" principle, not "first idea is best") → pick 1 → feed into the rest of the /idea-kitchen framework.

### Rules

- **Quantity first.** Don't judge ideas during generation. Judge after.
- **Steal openly.** Combinations of existing ideas are still original. Pure novelty is overrated.
- **Specific beats general.** "Budget app for YNAB users with ADHD" beats "budget app."
- **Write fast.** If an idea takes more than 30 seconds to articulate, skip it.

---

## 10. Deprecation Candidates

These apps cost maintenance time (CI runs, docs to keep current, mental overhead) and produce no income. Recommendations only. Not destructive.

| App | Why archive | What to keep |
|---|---|---|
| **RollerTask Tycoon Web PWA** | Already retired in CLAUDE.md, just needs formal archive move. | Nothing to keep, iOS version is the future. |
| **Growth Tracker** | Already archived in CLAUDE.md (merged into Wellness). | Done. |
| **Money** | Already archived in CLAUDE.md (superseded by Spend Clarity). | Done. |
| **Spend Radar** | Apps Script back end, superseded by Clarity Budget receipt enrichment. | Possibly extract sender rules into Clarity Budget, then archive. |
| **Spend Radar Web** | Read-only dashboard for Spend Radar. Archive when parent archives. | Nothing. |
| **Clarity Hub** | 5-tab unified hub superseded by Shipyard (or future Clarity OS bundle). | Nothing. |
| **Clarity Command Web** | Daily accountability hub superseded by Shipyard + Unnamed. | Nothing. |
| **Funded Web** | Standalone YNAB dashboard split from Clarity Hub. Superseded by Clarity Budget Web. | Nothing. |
| **App Forge** | Internal tool, not deployed. Superseded by Idea Kitchen + Claude Code workflow. | Possibly extract any unique scaffolding logic, then archive. |
| **Clarity Triage iOS, Clarity Time iOS, Clarity Growth iOS, Clarity Command iOS** | All low monetization potential as standalone. Either bundle into Path B (Clarity OS) or archive. | If Path A wins, archive. If Path B wins, keep as modules. |

**How to actually archive:**
1. Move app folder to `chase/portfolio/archive/<app>/`.
2. Update root CLAUDE.md portfolio table (mark as Archived).
3. If deployed, remove from Vercel.
4. If has Linear project, mark Cancelled with note.
5. Update Shipyard sync.

**Don't archive yet.** Make the decision per app, after Top 4 monetization is in motion.

---

## 11. What We're NOT Doing

Explicit deferrals. List of decisions that are NOT in the next 90 days.

- **Not building any new apps until at least one is monetized.** No new ideas in /idea-kitchen for the first 60 days. Use the time to ship paywalls on existing apps.
- **Not chasing virality.** No TikTok dances, no Twitter hot takes, no LinkedIn cringe. Build slowly, sustainably.
- **Not requiring video content in the first 90 days.** Voice is OK (mini-course screencasts). Face is optional. Camera is later.
- **Not bootstrapping a marketing agency.** Stay solo. Don't hire freelancers until $2k MRR.
- **Not pursuing VC funding.** None of these apps justify it. Bootstrapping is the path.
- **Not going full-time on apps.** The job search is primary income optionality. Apps are supplementary.
- **Not committing to a writing schedule that will burn Chase out.** Weekly cadence on artifacts. Daily cadence on tweets. NOT 3 long-form posts per week.
- **Not pretending to be an authority before there's evidence.** No "I'm an expert in X" framing in any post. Always frame as "I built this, here's what I learned."
- **Not starting a podcast.** Too high a confidence cost. Maybe Year 2.
- **Not making the goal "go viral on X."** The goal is $X MRR + first 100 customers. Audience is a means, not the end.

---

## 12. The 90-Day Roadmap (Compressed)

| Week | Top 4 progress | Confidence-bypass | Brand-from-zero |
|---|---|---|---|
| 1 | Stripe accounts (3), Lemon Squeezy account (1). Plan-gating spike on Job Search HQ. | Sign up for affiliate programs. Build Contra/Wellfound profile. | Read Ideaflow + Naval. Write 20 bug list items. |
| 2 | Job Search HQ: pricing page + first Pro feature behind paywall. | Ship YNAB templates pack on Gumroad ($19). | Write IndieHackers post #1: "I built 38 apps in a year." |
| 3 | GMAT Mastery: Lemon Squeezy product setup. | Post YNAB pack in r/ynab. Track first sale. | Write IndieHackers post #2. |
| 4 | Job Search HQ: legal pages + soft launch to network. | Ship ADHD founder ops template pack ($49). | Twitter daily build-in-public starts (Day 1 of 30). |
| 5-6 | Clarity Budget: Stripe + plan gating + Safe to Spend behind paywall. | Soft-launch ADHD pack in r/ADHD. | Continue daily Twitter. First IndieHackers post #3. |
| 7-8 | GMAT Mastery: landing page + soft launch to r/GMAT. | Affiliate links wired into IndieHackers posts. | Twitter milestone: 100 followers? |
| 9-10 | Clarity Budget: pricing page + soft launch to r/ynab. | Productize Idea Kitchen as $299 service. | First LinkedIn weekly post. |
| 11-12 | Unnamed: Stripe + soft launch to r/ADHD. | Productize Brand systems if Twitter > 100 followers. | Start adding face to LinkedIn. |
| Day 90 | Decision: which of the 4 has product-market fit? Double down. | $500-1,500 cumulative confidence-bypass revenue. | 100 followers somewhere. 4 long-form posts. |

---

## 13. Linear Sync Required

Per global CLAUDE.md rule: every monetized app gets a Linear project under WHI team.

Current Linear projects (from CLAUDE.md):
- Job Search HQ ✓
- Job Search HQ iOS ✓
- Clarity Budget Web ✓
- Idea Kitchen ✓
- RollerTask Tycoon iOS ✓
- Claude Usage Tool ✓

**Missing Linear projects needed for Top 4 + monetization work:**
- GMAT Mastery Web (create)
- Unnamed Web (create)
- Unnamed iOS (create)
- "Monetization Sprint" cross-app project (create, parent issues for each app's Stripe/legal/pricing work)

Use Linear's "update linear" flow per CLAUDE.md when ready.

---

## 14. Verification Checklist

When this strategy is read by Chase or any future AI session:
- [ ] Can answer "what's my next step for revenue?" in <30 seconds.
- [ ] Knows which 4 apps are top priority and why.
- [ ] Understands both Clarity paths and which is recommended.
- [ ] Has a low-pressure plan for building audience without faking confidence.
- [ ] Knows which income paths require zero personal brand.
- [ ] Has a deprecation list to consult later.
- [ ] Understands what NOT to do.

If any of these are unclear, the doc needs revision.

---

*End of strategy doc. This is a living document. Update at the end of each month with actuals against targets, what worked, what didn't, what to change.*
