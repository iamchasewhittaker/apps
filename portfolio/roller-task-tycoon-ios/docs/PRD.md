# RollerTask Tycoon iOS — Product Requirements Document

> Version: V1 | Status: Active | Last updated: 2026-04-05

---

## Problem

Traditional task apps feel flat, stressful, and uninspiring. Users know what they need to do, but the experience of managing tasks doesn't help them feel engaged, in control, or rewarded. Plain lists lack structure, feedback, and any sense of momentum.

---

## Users

**Primary:** Adults managing personal tasks across multiple life areas (home, career, health, family) who want a more motivating, structured system than a standard to-do app.

**Specifically:**
- People who like systems and visual organisation
- People who get overwhelmed by undifferentiated task lists
- People who respond to game-like feedback and small rewards
- iPhone users who want a daily driver, not a side experiment

---

## User Stories

- As a user, I want to add an attraction quickly so I can capture a task without friction
- As a user, I want to move attractions through clear statuses so I can see what is ready, in progress, blocked, or done
- As a user, I want to view a dashboard each morning so I know what needs attention first
- As a user, I want to group attractions by life area so I can context-switch effectively
- As a user, I want to see a small reward when I finish something so it feels satisfying
- As a user, I want blocked tasks to be visible without feeling punished by them
- As a user, I want the app to feel fun and distinct without becoming confusing

---

## V1 Features

### Core
- Create / edit / delete attractions (tasks)
- 4 statuses: Open → Testing → Broken Down → Closed
- 6 zones: Home, Career, Family, Growth, Health, Errands
- 4 staff roles: Operator, Janitor, Mechanic, Entertainer
- Priority: Low / Medium / High
- Reward value in dollars
- Optional due date
- Optional description

### Dashboard (Overview tab)
- Park rating % (derived from completion, broken, overdue)
- Profit today (cumulative reward from closed attractions)
- Guest count
- Alert count
- Rotating guest thoughts (state-aware sayings, refresh every 10 seconds)
- Park status pills (Open / Testing / Broken counts)
- Priority attractions (top 3 by priority + overdue)
- Alerts (broken rides, overdue tasks, low rating)
- Quick action buttons

### Attractions tab
- Kanban board view (horizontal scroll, 4 columns)
- List view (toggle)
- Zone filter chips
- Staff role filter chips
- Status focus from Overview quick actions

### Finances tab
- Today's profit
- Weekly profit
- Top earning attractions list

### Settings
- Readable font toggle
- Export backup (JSON share sheet)
- Import backup (file picker, confirms before replacing)

### In-App Guide
- Park Guide sheet (book icon in Overview toolbar)
- Explains statuses, zones, staff roles, park rating, profit, best practices

---

## Not in V1

- Subtasks (V2)
- Templates / pre-built attraction library (V2)
- Manual profit logging (V2)
- Recurring attractions (V3)
- Drag-to-reorder on board (V2)
- Haptic / sound feedback (V2)
- Animations / coin burst (V2)
- Widgets (V3)
- Apple Watch (V3)
- Siri shortcuts (V3)
- Cloud sync / Supabase (V3)
- Achievements / streaks (V2)
- Staff tab as dedicated view (merged into Attractions filter)
- Map tab as dedicated view (merged into Attractions filter)

---

## Success Metrics

- User can create first attraction in under 30 seconds
- User can move an attraction through all 4 statuses without confusion
- User understands the dashboard at a glance without reading a tutorial
- App is usable as a daily driver — not just tried once
- Crash-free sessions above 99%
- At least one test user says it feels more motivating than a standard to-do app

---

## Data Model (V1)

**ChecklistTaskItem** (SwiftData)
- `id: UUID`
- `text: String`
- `createdAt: Date`
- `statusRaw: String` (AttractionStatus enum)
- `zoneRaw: String` (ParkZone enum)
- `staffTypeRaw: String` (StaffRole enum)
- `priorityRaw: String` (TaskPriority enum)
- `rewardDollars: Int`
- `dueDate: Date?`
- `details: String`
- `closedAt: Date?`

**ProfitLedgerEntry** (SwiftData)
- `id: UUID`
- `createdAt: Date`
- `amount: Int`
- `taskId: String?`
- `note: String`

**UserDefaults (@AppStorage)**
- `chase_roller_task_tycoon_ios_cash: Int` — park cash total
- `chase_roller_task_tycoon_ios_readable: Bool` — font preference
- `chase_roller_task_tycoon_ios_board: Bool` — board vs list toggle

---

## Tech Stack

- Swift + SwiftUI
- SwiftData (local persistence)
- @AppStorage (lightweight preferences)
- No backend, no networking, no third-party dependencies
- Bundle ID: `com.chasewhittaker.ParkChecklist`
