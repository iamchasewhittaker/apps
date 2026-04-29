# Decisions — Job Search HQ

> Architecture and design decisions for this app.
> Each entry records what was decided, why, and what was considered.
> Read alongside LEARNINGS.md (what went wrong) and CHANGELOG.md (what shipped).
>
> See also: `/PATTERNS.md` (reusable code recipes) at repo root.

---

## 2026-04-26 — Gmail OAuth: server-side exchange with encrypted refresh tokens

**Context:** Job Search HQ needs to read Gmail for recruiter emails. Needed a secure OAuth flow for a public-repo SPA.

**Options considered:**
1. **Implicit flow (no refresh token)** — simple but tokens expire and can't auto-refresh
2. **Embed `client_secret` in bundle** — gets refresh tokens but secret is world-readable in a public repo
3. **PKCE + server exchange** — browser popup auth → `api/gmail/exchange.js` server exchange → encrypted refresh token in Supabase

**Decision:** PKCE + server exchange — only approach that gets real refresh tokens without exposing the client secret.

**Why:** Implicit flow doesn't return refresh tokens. Embedding secrets in a public repo is a security disaster. Server-side exchange keeps the secret on the server, and AES-256-GCM encryption protects the refresh token at rest in Supabase.

**Revisit when:** N/A — this is the correct OAuth pattern for SPAs with sensitive scopes. Same architecture used by Clarity Budget Web for YNAB.

> **Chase:**

---

## 2026-04-26 — Separate Supabase row for OAuth state

**Context:** Gmail OAuth tokens need persistent storage. Same decision as Clarity Budget Web — where do tokens live?

**Options considered:**
1. **Store in main data blob** — round-trips through localStorage + Supabase
2. **Separate `user_data` row with `app_key='job-search:gmail'`** — isolated from sync

**Decision:** Separate row — tokens never in the sync blob.

**Why:** Same reasoning as Clarity Budget Web: blob round-trips create XSS exposure. Cross-app pattern: both apps independently arrived at the same architecture, which validates it.

**Revisit when:** N/A — validated cross-app security pattern.

> **Chase:**

---

## 2026-04-26 — Heuristic email classifier over LLM

**Context:** Inbox feature needs to classify incoming emails (recruiter, rejection, interview, etc.). Needed to decide between ML and rules-based approach.

**Options considered:**
1. **Per-message LLM call (Claude/GPT)** — high accuracy but cost + latency per email
2. **Regex patterns + sender-domain rules + confidence scoring** — fast, free, deterministic

**Decision:** Heuristic classifier — regex + sender domains in `src/inbox/classifier.js`.

**Why:** HQ processes ~20 emails/day for one user. LLM cost + overhead unjustified at this scale. Review-first queue means false positives are low-risk — the user reviews before acting. Confidence is tracked but threshold-filter not yet exposed. Smoke test: 6/7 fields extracted from realistic Stripe recruiter email.

**Revisit when:** Volume exceeds 100 emails/day OR accuracy drops below 70% on recruiter identification.

> **Chase:**

---

## 2026-04-26 — Modal onAfterSave callback for chaining inbox actions

**Context:** Inbox workflow needs multi-step actions: read email → save contact → create application → mark actioned. Needed a way to chain these without hardcoding the flow.

**Options considered:**
1. **Hardcoded sequential flow in App.jsx** — works but modals become tightly coupled to inbox
2. **`onAfterSave(savedItem)` callback in modal config** — modals stay agnostic, call sites compose chains

**Decision:** onAfterSave callback pattern — modals don't know about inbox; inbox composes the chain.

**Why:** ContactModal and AppModal stay reusable outside the inbox context. The chain is composed at the call site: `setContactModal({ onAfterSave: (c) => setAppModal({ onAfterSave: (a) => markInboxActioned(...) }) })`. Adding new chains doesn't require touching modal internals.

**Revisit when:** Chain depth exceeds 3 steps (at that point, consider a state machine).

> **Chase:**

---

## 2026-04-26 — Launchpad stage derivation (not persistence)

**Context:** The Launchpad progress tracker needs to show daily stage. Needed to decide between storing stage or computing it.

**Options considered:**
1. **Persist `launchpadStage` field** — requires migration, manual reset on day rollover
2. **Derive stage from existing data** — `getLaunchpadProgress(applications, dailyActions, now)` computes from what's already saved

**Decision:** Derive, don't persist — stage is computed from `dailyActions` + `applications`.

**Why:** No new persistence = no migration, no schema drift. Stage resets naturally next day via date filter. Pure function, easy to test, no state management complexity.

**Revisit when:** Stage computation becomes expensive (>100ms) or needs to persist across sessions.

> **Chase:**

---

## 2026-04-21 — Identity folder as cross-app source of truth

**Context:** Multiple apps (Job Search HQ, Shipyard, LinkedIn rewrite) need the same personal data — strengths, voice, career direction.

**Options considered:**
1. **Duplicate in each app's `constants.js`** — simple but rots as data changes
2. **Single `identity/` folder at repo root** — one source, apps mirror a minimal slice

**Decision:** Single `identity/` folder — apps import a minimal slice via constants exports.

**Why:** Duplication rots. When voice brief changes, updating 5 files vs 1 is the difference between consistency and drift. Root `CLAUDE.md` points at `identity/` as the canonical source.

**Revisit when:** N/A — this is an organizational principle, not a technical decision.

> **Chase:**

---

## 2026-04-26 — Wizard modal over new tab for daily application flow

**Context:** The daily "apply to jobs" routine needs a step-by-step flow. Should it be an in-place modal or a new browser tab?

**Options considered:**
1. **New tab consolidating with Apply Tools** — separate workspace for the flow
2. **In-place wizard modal** — stays in the Focus tab context

**Decision:** In-place wizard modal — no context switching.

**Why:** Daily routine = Focus tab → modal → back to Focus. New tab creates a context-switch cost that discourages daily use. The modal keeps the user in flow state.

**Revisit when:** Wizard exceeds 5 steps or needs more screen real estate.

> **Chase:**

---

## 2026-04-21 — Auto-logged + manual wins split

**Context:** Wins tracking needs to capture both automatic events (applications submitted, interviews completed) and manual entries (personal victories, Kassie's encouragement).

**Options considered:**
1. **Pure auto-logged** — misses small personal proofs that matter for morale
2. **Pure manual** — requires discipline Chase lacks in crisis moments
3. **Both, with `autoLogged: true` flag** — clearly separated, both contribute

**Decision:** Both — auto-logged events + manual entries with a flag distinguishing them.

**Why:** Pure-auto misses the personal victories that build confidence. Pure-manual needs discipline that's unreliable under stress. Both, clearly separated, means wins accumulate whether or not Chase remembers to log them.

**Revisit when:** N/A — this is a design philosophy decision about user psychology.

> **Chase:**
