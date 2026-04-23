# SESSION_START — Knowledge Base Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Knowledge Base is a live deployed v2.1.1 app.
**App:** Knowledge Base
**Slug:** knowledge-base
**One-liner:** Personal bookmark and notes hub with an ARC-style sidebar, import/export, and organized folders for Git, Vercel, and Supabase references — deployed and auto-syncing via GitHub.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is in production; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/knowledge-base`
2. **BRANDING.md** — clean knowledge/reference aesthetic, ARC-style sidebar, muted palette
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v2.1.1 shipped scope; V3 = Next.js migration candidate
5. **APP_FLOW.md** — document the bookmark → folder → search → export flow
6. **SESSION_START_knowledge-base.md** — stub only

Output paths: `portfolio/knowledge-base/docs/`

---

## App context — CLAUDE.md

**Version:** v2.1.1
**Stack:** React CRA + inline styles + localStorage + Vercel
**Storage key:** `chase_knowledge_base_v1`
**URL:** knowledge-base-hazel-iota.vercel.app
**GitHub:** connected to `iamchasewhittaker/apps` for auto-deploy

**What this app is:**
A personal bookmark and notes hub. ARC-inspired sidebar navigation with folder grouping. Supports importing/exporting bookmarks as JSON, adding favicons, and organizing references into pre-built folders (Git, Vercel, Supabase, etc.). Used daily as a quick-access reference panel.

**Key features (v2.1.1):**
- ARC-style collapsible sidebar with folder groups
- Favicons auto-fetched from bookmark URLs
- Import / export as JSON (full data portability)
- Pre-populated folders: Git, Vercel, Supabase, Tools, Reference
- Search across all bookmarks (title + URL + tags)

**Architecture:**
- Single-blob: `chase_knowledge_base_v1` in localStorage
- No Supabase sync (intentional — local reference tool)
- No auth gate
- Vercel + GitHub auto-deploy connected

**Brand system:**
- Clean, muted palette — knowledge-forward, nothing competing with content
- Sidebar-first layout: folders on left, content on right

---

## App context — HANDOFF.md

**Version:** v2.1.1
**Focus:** Stable. Production-ready; used daily.
**Last touch:** 2026-04-21

**Next (V3 candidates):**
- Migrate to Next.js (App Router) for better routing and SSR
- Add tag-based filtering alongside folder grouping
- Add Supabase sync for cross-device access
- Add a "recently visited" section at the top
