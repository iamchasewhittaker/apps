# SESSION_START — Clarity Budget Web Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Budget Web is a live deployed app (Session 2 done).
**App:** Clarity Budget Web
**Slug:** clarity-budget-web
**One-liner:** YNAB-backed Spend-Track-Save dashboard with URL-persisted filters, tabbed spending breakdown (category / payee / week), and a sortable transaction list — web companion to Clarity Budget iOS.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is in active development; core decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-budget-web`
2. **BRANDING.md** — Clarity palette (sky blue accent), STS dashboard aesthetic, YNAB-connected
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect Session 1–2 shipped scope; Session 3 (Claude money companion) in V2
5. **APP_FLOW.md** — document the YNAB fetch → STS dashboard → SpendingBreakdown → TransactionList flow
6. **SESSION_START_clarity-budget-web.md** — stub only

Output paths: `portfolio/clarity-budget-web/docs/`

---

## App context — CLAUDE.md

**Version:** v0.4
**Stack:** Next.js 15 (App Router) + TypeScript + YNAB API + localStorage + Vercel
**URL:** clarity-budget-web.vercel.app
**Storage keys:**
- `chase_budget_web_v1` — main blob (YNAB token, budget selection, filter state)
- `chase_budget_web_tx_v1` — transaction cache (never synced to Supabase)
- YNAB token key in `localStorage` (separate from main blob)

**What this app is:**
A YNAB-backed STS (Spend-Track-Save) dashboard. Reads the current YNAB budget via API and renders: a month/week/day spending summary, a tabbed SpendingBreakdown (category, payee, week tabs), and a sortable/filterable TransactionList with role chips. URL params persist active filters so deep links work.

**Key architecture:**
- YNAB API calls proxied through Next.js API routes (token never exposed client-side)
- Monthly YNAB fetch with local tx cache (tx never written to Supabase)
- URL-persisted filter state (timeframe, category, payee) via `useSearchParams`
- TransactionList: sortable columns, role chips (spending / income / transfer), pagination

**Session history:**
- Session 1: STS dashboard skeleton, YNAB OAuth + budget selection
- Session 2 (current): URL-persisted filters + tabbed SpendingBreakdown + sortable TransactionList
- Session 3 (next): Claude money companion (AI-powered spending analysis)

**Brand system:**
- Clarity palette: sky blue accent (`#38bdf8`)
- Clean, data-forward — numbers first, UI second
- Companion to Clarity Budget iOS (shares YNAB budget; no Supabase sync between them)

---

## App context — HANDOFF.md

**Version:** v0.4
**Focus:** Session 2 complete. Session 3 next: Claude money companion tab.
**Last touch:** 2026-04-21

**What shipped in Session 2:**
- URL-persisted filters (timeframe, category, payee)
- Tabbed SpendingBreakdown (category / payee / week tabs)
- Sortable TransactionList with role chips and pagination

**Next (Session 3):**
- Claude money companion: user types a question → Claude analyzes YNAB data → structured response
- Likely a new `/companion` route or a slide-in panel on the dashboard
- Needs `callClaude()` helper + ANTHROPIC_API_KEY in Vercel env

**Constraints:**
- tx data intentionally NOT synced to Supabase — performance-sensitive, privacy-conscious
- YNAB token stored in localStorage only — never committed, never in Supabase
