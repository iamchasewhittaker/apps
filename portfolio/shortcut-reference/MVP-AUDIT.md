# MVP Audit — Shortcut Reference
*Audit date: 2026-04-12 · Framework: 6-step MVP (Capture → Validate → Define → Build → Ship → Learn)*

---

**What it is:** Native macOS app (Swift/SwiftUI + AppKit) that shows a floating keyboard shortcut reference panel for the active application, using Accessibility APIs.

**Current step (per the framework):** Step 4 — Build (stalled)

**Evidence for that step:** Both CLI (`swift run`) and macOS app (`.app` via Xcode) targets work. Architecture documented with ADRs. Accessibility onboarding and diagnostics implemented. Build script exists. But: only housekeeping commits visible in the monorepo (folder rename, April 4). No feature commits. CHANGELOG shows unreleased fixes (layout, accessibility re-prompting) but no dates. The feature work appears to have happened before the monorepo migration and then stopped.

**What's missing to legitimately be at this step:** Any recent momentum. No definition of "V1 done," no MoSCoW, no PRD. The ROADMAP exists but without clear milestones. Nothing on disk to suggest active sprint work.

**Biggest risk/red flag:** Staleness. No feature commits in the monorepo era. May have been a learning exercise that's run its course. The Accessibility API dependency also makes it fragile — macOS permission changes can break it silently.

**Recommended next action:** Decide: is this worth finishing, or was building it the point? If you want to ship it, write a 1-sentence definition of "done" and a MoSCoW list. If the build was the learning, archive it with a retro note. Don't let it hold a Build slot without a finish line.
