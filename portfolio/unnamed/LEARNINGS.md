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
