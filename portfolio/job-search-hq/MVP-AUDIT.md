# MVP Audit — Job Search HQ
*Audit date: 2026-04-12 · Framework: 6-step MVP (Capture → Validate → Define → Build → Ship → Learn)*

---

**What it is:** Job search command center (React/CRA) with pipeline tracking, contacts, daily focus blocks, and Claude-powered resume/cover letter tools — Supabase sync live, deployed on Vercel.

**Current step (per the framework):** Step 5 — Ship

**Evidence for that step:** v8.3 is live at job-search-hq.vercel.app. Supabase sync and email OTP auth both working. 8 versions shipped. Claude API integration functional. No feature commits in the last week — only docs/housekeeping.

**What's missing to legitimately be at this step:** Nothing critical. The app is live and usable.

**Biggest risk/red flag:** Is this app actually being used? Job Search HQ only has value if you're actively job-searching. If you're not, it's a finished tool sitting idle — which is fine, but it means Step 6 (Learn) should ask "is this still relevant?" not "is this working?"

**Recommended next action:** Step 6 (Learn). Honest question: are you actively using this for a job search right now? If yes, it's shipped and working. If no, archive it cleanly and free it from your mental WIP. The scaffold is at `portfolio/audits/learn-job-search-hq.md` — fill it in.
