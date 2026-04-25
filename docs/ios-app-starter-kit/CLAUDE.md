# CLAUDE.md — iOS App Starter Kit (templates)

**Scope:** Planning discipline and gates for **greenfield or major-scope** iOS work. This is **not** the implementation guide for a specific app.

**RollerTask Tycoon (iOS, this monorepo):** When editing **`portfolio/roller-task-tycoon-ios/`**, read **[`portfolio/roller-task-tycoon-ios/CLAUDE.md`](../../portfolio/roller-task-tycoon-ios/CLAUDE.md)** first. Filled product docs live in **[`portfolio/roller-task-tycoon-ios/docs/planning/`](../../portfolio/roller-task-tycoon-ios/docs/planning/README.md)** (workflow: `PLANNING_WORKFLOW.md`).

**Session handoff (multi-agent):** Repo root **[`HANDOFF.md`](../../HANDOFF.md)** is monorepo session state — not the same as **[`HANDOFF_TEMPLATE.md`](HANDOFF_TEMPLATE.md)** in this kit.

---

This project must follow PRODUCT_BUILD_FRAMEWORK.md before implementation begins.

## iOS Build Prerequisite (This Machine — 2017 MBP · Ventura · Xcode 15.2)

The iOS 17.2 simulator runtime DMG unmounts on every reboot. Run this once per build session before any `xcodebuild` call:

```bash
sudo hdiutil attach \
  /Library/Developer/CoreSimulator/Images/B3B0953C-8EEB-4DF1-8149-B9770CC90CC7.dmg \
  -mountpoint /Library/Developer/CoreSimulator/Volumes/iOS_21C62 \
  -readonly -noverify
```

SDK plist patch (`ProductBuildVersion` 21C52→21C62) is persistent — no re-run after reboot. Full context: `portfolio/unnamed-ios/LEARNINGS.md`.

## Rules for Claude
- enforce scope discipline
- do not allow V1 creep without explicit approval
- prefer simple iOS-native patterns
- guide work one milestone at a time
- create implementation plans before writing code
- keep architecture understandable for a junior developer

## Working principles
- clarity over cleverness
- usability over feature count
- shipping over perfection
- local-first over premature backend complexity

## Before coding
Claude should confirm that these docs exist and are filled out:
- PRODUCT_BRIEF.md
- PRD.md
- APP_FLOW.md
- TECHNICAL_DESIGN.md

## When generating code
- prefer SwiftUI
- prefer MVVM
- prefer reusable components
- avoid giant files when possible
- explain tradeoffs simply
- note assumptions clearly

## When helping with planning
Claude should:
1. define the problem
2. define the user
3. define V1
4. define the flow
5. define the architecture
6. break the work into milestones and tickets
