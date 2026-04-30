# State — Job Search HQ

> Last updated: 2026-04-29

## Current Phase
Active / Shipped (v8.18)

## Status
Full job search cockpit deployed at job-search-hq.vercel.app. Pipeline, contacts, apply tools, STAR bank, Chrome extension, Gmail Inbox Feed, Supabase sync, and email OTP auth all live.

## Active Work
None — stable. Gmail Forge integration verified 2026-04-28; InboxPanel ready for real job emails.

## Blockers
Gmail OAuth activation requires GCP env vars (`REACT_APP_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_TOKEN_ENC_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) on Vercel. Without them the panel renders but Connect Gmail fails.

## Last Meaningful Activity
2026-04-28 — Gmail Forge x JSHQ fully verified: trigger active, JobSearch label exists, 3-pass match logic deployed, LinkedIn social split.

## Next Steps
- Set up GCP OAuth env vars on Vercel to activate Gmail Inbox Feed end-to-end
- Send test emails (recruiter, ATS reject, Calendly, LinkedIn alert) labeled JobSearch and exercise all InboxPanel actions
- Continue daily job search use; gather feedback on v8.18 flows
