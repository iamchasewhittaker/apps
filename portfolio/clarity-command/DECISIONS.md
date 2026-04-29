# Decisions — Clarity Command

> Architecture and design decisions for this app.
> Each entry records what was decided, why, and what was considered.
> Read alongside LEARNINGS.md (what went wrong) and CHANGELOG.md (what shipped).
>
> See also: `/PATTERNS.md` (reusable code recipes) at repo root.

---

## 2026-04-13 — Conviction triggers on yesterday's existence (grace on day 1)

**Context:** The mission briefing shows "you missed this yesterday" messaging. Needed to decide when to show conviction-level alerts.

**Options considered:**
1. **Always show if yesterday's data is incomplete** — aggressive, may scare off new users
2. **Only show if yesterday's log exists** — first-day users see no red flags

**Decision:** Grace-based: fire conviction triggers only when yesterday's log exists.

**Why:** Grace-based onboarding. Let users act before convicting. If they never used the app yesterday, there's nothing to convict them of. The conviction panel kicks in on day 2+.

**Revisit when:** N/A — this is a UX philosophy decision rooted in faith context (grace before judgment).

> **Chase:**

---

## 2026-04-13 — Shared sync module: copy, not symlink

**Context:** Clarity Command uses `shared/sync.js` for Supabase blob sync. CRA apps can't import outside `src/`.

**Options considered:**
1. **Symlink `shared/sync.js` into `src/`** — single source, but breaks on Vercel and CRA forbids it
2. **Copy to `src/shared/sync.js`** — real file, portable, Vercel-safe

**Decision:** Copy — same pattern as Wellness Tracker and Job Search HQ.

**Why:** CRA forbids imports outside `src/`. Symlinks break on Vercel. The copy pattern is established across 3+ apps. If the shared module updates, re-copy manually.

**Revisit when:** Migration to Next.js or Vite removes the `src/` boundary restriction.

> **Chase:**
