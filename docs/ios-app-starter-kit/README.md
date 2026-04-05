# iOS App Starter Kit

**Kit version: v3.** Edits here are the **canonical blank templates** for any iOS effort in this monorepo. If you fork or replace the kit (e.g. v4), update this line and either replace these files in place or add a dated subfolder — avoid a second parallel top-level kit under `portfolio/`.

This starter kit is designed for small-to-medium iOS apps, especially when a junior developer needs a clear path from idea to release.

**In use:** [Park Checklist (iOS)](../../portfolio/park-checklist-ios/docs/planning/README.md) keeps **filled** copies under `portfolio/park-checklist-ios/docs/planning/`.

## Recommended order
1. PRODUCT_BUILD_FRAMEWORK.md
2. PRODUCT_BRIEF.md
3. PRD.md
4. APP_FLOW.md
5. TECHNICAL_DESIGN.md
6. BACKLOG.md
7. QA_CHECKLIST.md
8. RELEASE_PLAN.md

## Rule
Do not start implementation until Product Definition, Product Requirements, and App Flow are complete.

## What this kit includes
- a universal planning framework
- document templates with prompts
- a simple backlog structure
- QA and release checklists
- Claude and handoff docs for continuity

## Suggested workflow
### Week 1
- define the app
- identify the user
- define V1
- write the Product Brief
- write the PRD

### Week 2
- map the app flow
- sketch wireframes
- choose the architecture
- set up repo and Xcode

### Week 3+
- implement the core flow
- test on device
- polish
- release to TestFlight

## Files
- PRODUCT_BUILD_FRAMEWORK.md: mandatory framework for every project
- PRODUCT_BRIEF.md: one-page app definition
- PRD.md: lightweight product requirements doc
- APP_FLOW.md: screens, navigation, empty and error states
- TECHNICAL_DESIGN.md: architecture and code decisions
- BACKLOG.md: task and sprint structure
- QA_CHECKLIST.md: test checklist
- RELEASE_PLAN.md: launch workflow
- CLAUDE.md: AI collaboration rules
- HANDOFF_TEMPLATE.md: project transfer notes (template — not the monorepo session [`HANDOFF.md`](../../HANDOFF.md) at repo root)
