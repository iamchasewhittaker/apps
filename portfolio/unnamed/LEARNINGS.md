# Learnings — Unnamed

> Append surprises, failures, and "aha" moments after each session.

---

## 2026-04-17 — MVP v0.1

**Context matters more than code.**
This app came from 3+ hours of conversation, reading a 30k-word ChatGPT thread, and asking the right questions. The best decision wasn't a coding choice — it was NOT building an Ash clone, and NOT making a task manager. Understanding the actual problem (self-knowledge gap, not productivity gap) shaped everything.

**pnpm via corepack, not npm install -g.**
`npm install -g pnpm` failed (permissions). `corepack enable pnpm` worked silently. Always check `pnpm --version` after to confirm.

**Tailwind 4 uses `@import "tailwindcss"` not `@tailwind base/components/utilities`.**
The v4 CSS setup is different from training data. `create-next-app` scaffolds it correctly — don't overwrite globals.css without checking the existing import pattern first.

**localStorage + no auth = use it today.**
The temptation was to wire Supabase auth upfront. Resisting that means Chase can open the app and use it immediately. Supabase can come in v2 after he's used it for a week and knows what he needs.

**The anti-features are the hardest design decisions.**
Deciding NOT to add due dates, priorities, tags, or settings required more thought than adding them would have. Write the anti-feature list early and protect it.

**AGENTS.md as a warning label.**
The auto-generated `AGENTS.md` warns that Next.js APIs change frequently and to read docs before writing code. Good habit — but for a project this straightforward, the Tailwind 4 import pattern was the main real gotcha.

**The overlay of "what to build" problem is meta to the build itself.**
Chase's core loop is building systems instead of using them. This app was designed to be the LAST system he builds for a while — one he uses himself. Keep this in mind when he wants to add features. Ask: "Have you used it for 7 days first?"

---

## 2026-04-17 — iOS Phase 1

iOS-specific learnings are in [`portfolio/unnamed-ios/LEARNINGS.md`](../unnamed-ios/LEARNINGS.md). Highlights:

**The hand-crafted xcodeproj approach works.** xcodegen failed to install (macOS 13/Xcode 15.3 mismatch). Adapting an existing `project.pbxproj` with fresh sequential UUIDs took ~15 minutes and xcodebuild accepted it cleanly. Good pattern to know.

**`@MainActor` must be explicit on view helper methods.** SwiftUI view body runs on MainActor, but private `func` inside a view struct does not inherit it. Calls to the `@MainActor`-isolated store produce a compile error. Mark the method explicitly.

---

## 2026-04-24 — Web/iOS parity audit

**iOS as source of truth.** When two implementations of the same app drift, picking the newer one as canonical works well — iOS shipped second (2026-04-17), was hand-tuned on device, and reflected sharper thinking about Skip semantics. Web bent to match it.

**Three divergences found, not the planned two.**
1. **Sort missing a Skip button** — flagged in plan, easy add.
2. **`skipItem` semantics differ** — flagged in plan: web marked `status: "skipped"` (item gone forever); iOS cycles the item to the end of `state.items` (defer / come back later). Web rewritten to match.
3. **Surprise: FocusView lane-iteration vs. items-iteration.** Web's FocusView built `allItems` via `lanes.flatMap((lane) => getActiveItemsForLane(state, lane).map(...))` — iterating BY LANE first, then by items within each lane. iOS's `activeItems` reads `state.items.filter(...)` directly. With one item per active lane, the lane-flatMap order made the *first* lane's first item always render first, so cycling Skip to the end of `state.items` had no visible effect. Caught only because end-to-end verification noticed the same item kept showing after Skip even though localStorage clearly had it cycled. **Lesson: when you change a state-mutation's ordering semantics, also audit every reader that depends on order.**

**Verification needs to actually verify, not just type-check.** `pnpm build` passed at every stage. The FocusView bug only revealed itself when I clicked Skip in the running preview and watched the same item come back. Type checks and unit-style smoke tests would have missed it; live observation caught it in 30 seconds.

**Skip button styling: subtle, not equal to lane choices.** iOS Skip is gray text — secondary, deferring. Match this on web with `text-zinc-500 text-sm py-3` rather than the full-bordered button styling used for lane choices. The visual weight teaches users that Skip is the cheaper action.

**`ItemStatus = "skipped"` left in the type even though now unwritten.** iOS keeps `enum ItemStatus { case ..., skipped }` defined-but-unused. Type parity is worth more than dead-code cleanup when the cost is one enum case that's been there since v0.1.
