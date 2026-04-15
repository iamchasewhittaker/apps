# MVP Audit — YNAB Clarity (iOS)
*Audit date: 2026-04-12 · Framework: 6-step MVP (Capture → Validate → Define → Build → Ship → Learn)*

---

**What it is:** Native SwiftUI YNAB companion app that answers 4 budget questions the YNAB UI handles poorly — bills coverage, income gap, safe-to-spend, and mortgage funding timeline.

**Current step (per the framework):** Step 4 — Build (late Build)

**Evidence for that step:** Feature-rich: 4-tab UI (Dashboard, Bills, Income, Cash Flow), 4-step setup flow, YNAB API read + write, MetricsEngine + CashFlowEngine, Keychain security, SwiftData persistence. Tests exist for both engines. ROADMAP has a clear v0.1 (done) and v1 backlog. 6 feature commits in recent history, latest April 11 (clamp fix). Most active iOS project.

**What's missing to legitimately be at this step:** No README (the only project without one). The ROADMAP lists 10 v1 backlog items — it's unclear which are Must vs. Could. No MoSCoW cut. Also needs Xcode build verification (same branch issue as other iOS apps).

**Biggest risk/red flag:** Scope creep. The v1 backlog has 10 items and v2 ideas are already parked. This is the most feature-dense iOS app and also the one most at risk of "just one more thing" syndrome. The YNAB API dependency also means any YNAB API change breaks the app.

**Recommended next action:** Draw the MoSCoW line on the v1 backlog. Which items are Must (ship-blocking) vs. Could (nice later)? If v0.1 already answers the 4 core questions, you might already be at Ship and not know it. This is the natural next focus after RollerTask iOS ships.
