# Product Build Framework

Use this framework for every project. The goal is to make planning and execution simple enough that a junior developer can follow it without getting lost.

## Core rule
Do not start coding until Phases 1–3 are complete.

---

## Phase 1: Product Definition

Figure out what the app is before thinking about code.

### Define
- the problem
- the target user
- the core outcome
- the smallest useful version of the app

### Write these 5 things first
1. App summary  
   Format: “This app helps ___ do ___.”
2. Target user
3. Main pain point
4. Core value
5. V1 scope

### Why this matters
If this phase is skipped, the team will almost always overbuild.

### Example
- User: busy parents
- Problem: they forget small recurring tasks
- Value: quick, visual task capture
- V1: add tasks, organize tasks, mark complete, basic reminders

---

## Phase 2: Product Requirements

Turn the idea into something buildable.

### Create a lightweight PRD with
- app goal
- user stories
- feature list
- success criteria
- non-goals

### Suggested structure
#### Problem
What problem are we solving?

#### Users
Who is this for?

#### User stories
- As a user, I want to create a task quickly
- As a user, I want to group tasks by category
- As a user, I want to be reminded at the right time

#### V1 features
- onboarding
- task list
- add/edit/delete task
- reminders
- settings

#### Not in V1
- collaboration
- widgets
- AI suggestions
- Apple Watch app

#### Success metrics
- user can create first task in under 30 seconds
- user can complete a task flow without confusion
- crash-free usage above 99%

---

## Phase 3: UX / App Flow Planning

Before coding, map the experience.

### Create
- screen list
- user flows
- navigation structure
- low-fidelity wireframes

### Questions to answer
- What is the first screen?
- What is the main action?
- How many taps does the user need?
- Where could they get stuck?
- What state appears when there is no data?

### Minimum deliverables
- app map
- primary flow
- empty states
- error states
- permission flows

### Typical flow example
- Launch
- onboarding
- home
- create item
- view details
- edit
- settings

### For iOS, think in terms of
- tab navigation
- navigation stack
- modal sheets
- alerts
- permissions

---

## Phase 4: Technical Architecture

Now decide how it should be built.

### Strong default for a modern iOS app
- Swift
- SwiftUI
- MVVM
- Combine or async/await
- SwiftData or Core Data for local persistence
- Firebase / Supabase / custom backend only if cloud sync is needed
- Xcode + GitHub
- TestFlight for testing

### Junior-friendly default stack
- UI: SwiftUI
- Architecture: MVVM
- State: @State, @StateObject, @Observable, @Environment
- Networking: URLSession
- Persistence: SwiftData
- Dependency management: Swift Package Manager
- Analytics: lightweight at first
- Backend: none for V1 unless truly needed

### Folder structure
- App
- Core
- Features
- Services
- Models
- ViewModels
- Views
- Resources
- Utilities

### Per-feature structure
- FeatureNameView
- FeatureNameViewModel
- FeatureNameModel
- FeatureNameService

---

## Phase 5: Delivery / Build Plan

Break the work into milestones.

A junior dev should not think: “build the app.” They should think: “build milestone 1.”

### Milestone 0: Project setup
- create repo
- define branch strategy
- set up Xcode project
- choose bundle id
- configure app targets
- create design system basics
- set up task tracking

### Milestone 1: Foundation
- app navigation
- theme/colors/typography
- reusable components
- basic models
- local storage setup

### Milestone 2: Core feature
- implement the main user flow
- handle loading/empty/error states
- save and retrieve data
- basic validation

### Milestone 3: Supporting features
- settings
- reminders
- search/filter
- onboarding

### Milestone 4: Polish
- animation
- accessibility
- edge cases
- performance cleanup
- error messaging

### Milestone 5: Release prep
- app icon
- screenshots
- privacy labels
- test plan
- TestFlight
- App Store metadata

---

## Phase 6: Ship and Learn

### Use lightweight Agile with weekly sprints
That means:
- keep a backlog
- plan one week at a time
- define small tasks
- demo progress weekly
- adjust scope fast

### Backlog categories
- product
- design
- iOS engineering
- QA
- release

### Ticket format
Every task should have:
- title
- description
- acceptance criteria
- dependencies
- estimate
- status

### Example
Task: Build task creation screen

Acceptance criteria:
- user can enter title
- user can save task
- validation appears if title is empty
- task persists locally

---

## Planning order
Always use this order:

### Step 1: Define
- What are we building?
- Who is it for?
- What is V1?

### Step 2: Design
- What screens exist?
- What is the main flow?
- What does success look like?

### Step 3: Architect
- What stack are we using?
- How is code organized?
- Where does data live?

### Step 4: Break down
- What are the milestones?
- What are the tickets?
- What can ship first?

### Step 5: Build
- foundation first
- one feature at a time
- test as you go

### Step 6: Ship and learn
- TestFlight
- gather feedback
- prioritize V2

---

## Recommended documentation set
Keep these 7 docs:
1. Product Brief
2. PRD
3. App Flow Doc
4. Technical Design Doc
5. Backlog / Sprint Board
6. QA Checklist
7. Release Plan

---

## What a junior dev should avoid
- starting with code before scope is clear
- adding backend too early
- building too many features in V1
- making architecture overly clever
- skipping error states and empty states
- not testing on real devices
- changing direction every day

---

## Best default iOS approach in 2026 for a simple app
- SwiftUI
- MVVM
- SwiftData
- async/await
- SPM
- modular-ish feature folders, but not overengineered
- TestFlight early

This is usually the best balance of speed, clarity, and maintainability.

---

## Practical starter workflow

### Week 1
- define app idea
- write product brief
- define V1
- create user stories
- sketch app flow

### Week 2
- create wireframes
- choose architecture
- set up repo and Xcode project
- define design tokens
- break work into tickets

### Week 3+
- build navigation
- build main screens
- implement data layer
- test core flow
- polish
- TestFlight

---

## Simple template
App name:  
One-line summary:  
Target user:  
Main problem:  
Core V1 features:  
Non-goals:  
Primary flow:  
Tech stack:  
Architecture:  
Milestones:  
Launch risks:

---

## Final recommendation
For most junior iOS projects, use:
Lean product planning + weekly Agile + SwiftUI/MVVM technical architecture

That gives:
- enough structure
- fast iteration
- cleaner code
- less overwhelm
