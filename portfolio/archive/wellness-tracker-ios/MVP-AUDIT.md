# MVP Audit — Wellness Tracker (iOS)
*Audit date: 2026-04-12 · Framework: 6-step MVP (Capture → Validate → Define → Build → Ship → Learn)*

---

**What it is:** Native SwiftUI daily check-in app (morning + evening) with local-only storage — companion to the web Wellness Tracker, no cloud sync.

**Current step (per the framework):** Step 4 — Build (early Build)

**Evidence for that step:** Phase 1 is implemented — check-in flow, draft persistence, meds, past days view. 2 commits of actual feature work. Tests exist (WellnessBlobTests). Changelog shows Supabase/sync was removed (simplified to local-only). No ROADMAP, no planning docs beyond CLAUDE.md.

**What's missing to legitimately be at this step:** A definition of "done" for V1. There's no PRD, no MoSCoW list, no written scope. What makes this "shipped" vs. "still building"? Without that, Build has no finish line. Also needs the same Xcode build verification as RollerTask — sitting on the same unmerged branch.

**Biggest risk/red flag:** This is a companion to an already-shipped web app (v15.10) that does everything this does and more, with Supabase sync. What problem does the iOS version solve that the web PWA doesn't? If the answer is "it's native and faster to open," that's valid — but it needs to be written down to justify the WIP slot.

**Recommended next action:** Write a 3-sentence scope statement: what this app does, what "shipped V1" means, and what it does that the web version doesn't. Then build-verify in Xcode. Without scope, you can't know when to stop. This is paused while RollerTask iOS is the focus.
