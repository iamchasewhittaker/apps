# Product Build Framework

> Universal 6-phase framework for every app in this portfolio.
> **Rule:** No coding starts until Phases 1–3 are documented.

---

## Phase 1 — Product Definition

Figure out what the app is before thinking about code.

**Write these 5 things first:**

1. **App summary** — One sentence: "This app helps ___ do ___."
2. **Target user** — Who specifically is this for?
3. **Main pain point** — What is failing for them today?
4. **Core value** — What does this app do better?
5. **V1 scope** — What is the smallest useful version?

If you skip this phase, you will overbuild.

**Template:**
```
App summary:
Target user:
Main pain point:
Core value:
V1 scope (3–5 bullets):
```

---

## Phase 2 — Product Requirements (PRD)

Turn the idea into something buildable.

**Sections:**

- **Problem** — What are we solving?
- **Users** — Who is this for?
- **User stories** — "As a user, I want to ___"
- **V1 features** — The list
- **Not in V1** — The explicit cut list (this is critical)
- **Success metrics** — How do you know V1 worked?

**Template:**
```
Problem:

Users:

User stories:
- As a user, I want to ___
- As a user, I want to ___

V1 features:
-
-

Not in V1:
-
-

Success metrics:
- User can complete primary flow in under 30 seconds
- Crash-free sessions above 99%
```

---

## Phase 3 — UX / App Flow

Before coding, map the experience.

**Answer these questions:**
- What is the first screen?
- What is the main action?
- How many taps does the user need?
- Where could they get stuck?
- What appears when there is no data?

**Deliverables:**
- Screen list
- Primary flow (step by step)
- Empty states for every screen
- Error states
- Permission flows (if any)

**Template:**
```
First screen:
Main action:
Primary flow:
  1.
  2.
  3.

Screens:
-
-

Empty states:
- [Screen]: "[message]"

Error states:
- [Trigger]: "[message]"
```

---

## Phase 4 — Technical Architecture

Now decide how it should be built.

**Default iOS stack (2026):**
- UI: SwiftUI
- Architecture: MVVM (lightweight — no overengineering)
- State: `@State`, `@StateObject`, `@Observable`, `@Environment`
- Persistence: SwiftData (local-first; no backend until truly needed)
- Dependency management: Swift Package Manager
- Networking: URLSession (only if cloud sync is required)
- Backend: None for V1

**Folder structure:**
```
App/
Core/
Features/
  FeatureName/
    FeatureNameView.swift
    FeatureNameViewModel.swift
Models/
Services/
Resources/
Utilities/
```

**What to avoid:**
- Adding a backend before the local version is proven
- Complex DI frameworks for simple apps
- Over-abstracting before you have 3+ identical patterns

---

## Phase 5 — Delivery / Milestone Plan

Break the work into milestones. A developer should never think "build the app" — they should think "build milestone 1."

**Milestone structure:**

| Milestone | Goal |
|-----------|------|
| 0: Setup | Repo, Xcode project, bundle id, branch strategy, design tokens, task board |
| 1: Foundation | Tab navigation, colors, typography, reusable components, data models |
| 2: Core feature | Main user flow, CRUD, empty/error states, local persistence |
| 3: Supporting features | Secondary screens, settings, filters |
| 4: Polish | Accessibility, edge cases, real-device testing, error messaging |
| 5: Release prep | App icon, screenshots, privacy labels, TestFlight, App Store metadata |

**Ticket format:**
```
Title:
Description:
Acceptance criteria:
- User can ___
- Validation appears when ___
- Data persists after ___
Dependencies:
Estimate:
```

---

## Phase 6 — Ship and Learn

Ship the smallest version that proves the core loop works. Then learn.

**After launch, ask:**
- Do users understand the core concept?
- What is the #1 point of confusion?
- What feature do users ask for first?
- Does the core reward/value loop work?

**V2 planning rule:** Only add features that at least 3 users have requested or that you personally feel the absence of after 1 week of daily use.

---

## Recommended Documentation Set

Keep these 7 docs per app:

| Doc | Purpose |
|-----|---------|
| `PRODUCT_BRIEF.md` | One-page summary |
| `PRD.md` | Features, scope, success metrics |
| `APP_FLOW.md` | Screens + navigation + empty states |
| `TECHNICAL_DESIGN.md` | Architecture, data flow, dependencies |
| `BACKLOG.md` | Tasks and sprint progress |
| `QA_CHECKLIST.md` | What must be tested before release |
| `RELEASE_PLAN.md` | TestFlight, App Store, launch steps |

---

## What Junior Devs Must Avoid

- Starting with code before scope is clear
- Adding backend too early
- Building too many features in V1
- Making architecture overly clever
- Skipping error states and empty states
- Not testing on a real device
- Changing direction every day

---

## Planning Order (Every Project)

```
Phase 1: Define → Phase 2: PRD → Phase 3: UX Flow
       ↓
Phase 4: Architecture → Phase 5: Milestones → Phase 6: Ship
```

No phase skips. No coding before phase 3 is documented.

---

## App-Specific References

| App | PRD | App Flow | Tech Doc |
|-----|-----|----------|----------|
| RollerTask Tycoon (iOS) | [docs/PRD.md](portfolio/roller-task-tycoon-ios/docs/PRD.md) | [docs/APP_FLOW.md](portfolio/roller-task-tycoon-ios/docs/APP_FLOW.md) | CLAUDE.md |
| Wellness Tracker (iOS) | — | — | portfolio/wellness-tracker-ios/CLAUDE.md |
| Job Search HQ | — | — | portfolio/job-search-hq/CLAUDE.md |
| App Forge | — | — | portfolio/app-forge/CLAUDE.md |
