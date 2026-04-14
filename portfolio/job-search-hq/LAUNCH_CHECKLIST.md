# Launch Checklist — Job Search HQ

> Instance of `docs/governance/LAUNCH_CHECKLIST.md`.
> Last updated: 2026-04-14 · WHI-37

---

## Gate 1 — Strategy ✅

- [x] **Problem statement written:** Job seekers lose track of companies, contacts, and follow-up timing — everything lives across browser tabs, spreadsheets, and memory.
- [x] **Target user defined:** Active job seekers managing 10–50 companies simultaneously, who benefit from AI-assisted drafting and structured daily focus.
- [x] **Success metric chosen:** User can review their full pipeline, identify today's top priority, and generate a tailored application draft in under 10 minutes.
- [x] **Product line assigned:** Career Toolkit (see `docs/governance/PRODUCT_LINES.md`)
- [x] **No unresolved overlap:** No active app in portfolio covers job pipeline management. Inbox Zero (future) would complement, not overlap.

---

## Gate 2 — Build ✅

- [x] **Scope frozen:** v8.5 shipped — pipeline, contacts, STAR stories, AI drafts, Focus tab, company research, By-Company view, Chrome extension.
- [x] **BRANDING.md exists:** `docs/BRANDING.md` — DM Sans, dark palette, 5-accent system.
- [x] **Security checklist started:** See security scan items in Gate 3 below.
- [x] **Shared files pulled from portfolio/shared/:** `src/shared/sync.js`, `src/shared/auth.js` present.
- [x] **Chrome extension built:** MV3 extension in `extension/` — LinkedIn capture + Action Queue badge.

---

## Gate 3 — Launch ✅

- [x] **Build passes CI:** `npm ci && npm run build` — tracked in `.github/workflows/portfolio-web-build.yml`
- [x] **Security checklist complete:**
  - [x] No hardcoded API keys in tracked files (Anthropic key stored in localStorage `chase_anthropic_key` only)
  - [x] `.env` gitignored; `.env.example` committed
  - [x] Supabase anon key only (RLS enforced)
  - [x] `npm audit` — 0 critical, 0 high (verify before each deploy)
  - [x] Auth gate: email OTP via Supabase
  - [x] `REACT_APP_AUTH_CANONICAL_ORIGIN` set in Vercel env vars
  - [ ] CORS/redirect allowlist confirmed in Supabase dashboard *(verify)*
- [x] **README has user-facing description:** `README.md` updated — WHI-37
- [x] **BRANDING.md complete:** `docs/BRANDING.md` — palette, typography, component patterns
- [x] **Live URL verified:** https://job-search-hq.vercel.app — confirmed green in portfolio-health-check
- [x] **Linear project created:** https://linear.app/whittaker/project/job-search-hq-3695b3336b7d

---

## Gate 4 — Post-launch (ongoing)

- [x] **Week 1 check:** URL live, auth works, no console errors — confirmed active daily use
- [x] **Week 4 decision:** Invest — v8.5 shipped By-Company view and Chrome extension; v9 scope being defined
- [ ] **External beta:** Share with 1–2 other job seekers for feedback *(not yet)*
- [ ] **v9 scope defined:** Review Wave 2 items in ROADMAP.md and pick next milestone *(pending)*

---

## Notes

- Chrome extension (MV3) loads unpacked from `extension/` — not yet published to Chrome Web Store
- Anthropic API key is user-supplied via in-app UI modal (not a deploy-time env var)
- App is personal-use today; external launch would require API key proxy to protect billing
