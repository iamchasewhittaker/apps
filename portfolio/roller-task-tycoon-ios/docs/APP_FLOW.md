# RollerTask Tycoon iOS — App Flow Document

> Version: V1 | Last updated: 2026-04-05

---

## Navigation Structure

**Tab bar (3 tabs):**
```
Overview  |  Attractions  |  Finances
```

**Global elements:**
- Floating "+ New Attraction" capsule button (bottom, visible on all tabs)
- Toast notification overlay (auto-dismisses after 2.6s)

---

## Primary Flow

```
Launch app
  ↓
Overview tab (default)
  ↓
Tap "+ New Attraction"
  ↓
AttractionEditorView (modal sheet)
  - Enter name, zone, staff, priority, reward, due date, description
  - Tap "Save"
  ↓
Toast: "🎢 New attraction added"
  ↓
Tap "Attractions" tab
  ↓
ParkAttractionsView (board or list)
  ↓
Tap attraction card → AttractionDetailView
  ↓
Tap "Start testing" → status: Testing
  ↓
Tap "Close attraction" → status: Closed
  ↓
Toast: "🎢 Status: Closed"
  ↓
Overview: profit increases, rating adjusts
```

---

## Screens

### 1. Overview (OverviewConsoleView)

**Entry:** Default tab on launch

**Content (top to bottom):**
- "Park Operations Console" header
- Metric chips: ⭐ Rating · 💰 Profit · 🧍 Guests · 🔔 Alerts
- Park status card (Open / Testing / Broken counts + closed today)
- Guest thoughts card (2 rotating sayings, refresh every 10s)
- Priority attractions card (top 3 by priority + overdue)
- Alerts card (broken rides, overdue tasks, low rating)
- Quick actions (Add, Testing, Repair, All open)

**Toolbar (top right):**
- 📖 Park Guide → ParkGuideView sheet
- ⚙️ Settings → SettingsView sheet

**Empty state:** Park rating shows 72% as baseline; guest thought says "Welcome to the park!"

---

### 2. Attractions (ParkAttractionsView)

**Entry:** Attractions tab

**Content:**
- Filter bar (horizontal scroll): zone chips + staff role chips + "Clear all"
- Board/List toggle (segmented picker)
- Board view: 4 horizontal columns (Open / Testing / Broken / Closed)
- List view: sectioned list grouped by status

**Tap attraction card** → AttractionDetailView (pushed via NavigationLink)

**Empty state (per column/section):** Column just shows empty space with header visible

**Filter states:**
- Zone filter active: only shows that zone's tasks
- Staff filter active: only shows that role's tasks
- Status focus (from Overview quick actions): highlights that column

---

### 3. AttractionDetailView

**Entry:** Tap any attraction card

**Content:**
- Attraction name (large display font)
- Info rows: Status · Zone · Staff · Reward · Priority · Due
- Description (if set)
- Action buttons:
  - "Start testing" (disabled if already Testing or Closed)
  - "Mark broken down" (disabled if already Broken or Closed)
  - "Close attraction" (disabled if already Closed)
  - "Delete attraction" (destructive, red)

**Toolbar:** Edit button → AttractionEditorView sheet

**Transitions:**
- Status change → toast + immediate UI update
- Delete → toast + dismiss (returns to Attractions)

---

### 4. AttractionEditorView

**Entry:** "New Attraction" button (new), or "Edit" from detail (existing)

**Content (Form):**
- Section "Attraction": Name text field
- Section "Park ops": Zone picker · Staff picker · Priority picker · Reward stepper · Due date toggle + picker
- Section "Description": Multi-line text field (optional)
- Cancel / Save toolbar buttons

**Validation:** Save disabled while name is empty

**Error handling:** Alert on save failure (SwiftData error)

---

### 5. Finances (FinancesView)

**Entry:** Finances tab

**Content:**
- Today's profit (large number)
- Weekly profit (large number)
- Top earning attractions list (title + amount)

**Empty state:** "Close attractions to see earnings here."

---

### 6. SettingsView

**Entry:** Gear icon from Overview toolbar

**Content (Form):**
- Display: Readable fonts toggle
- Backup: Export backup button · Import backup button
- About: App description text

**Backup flow:**
- Export → share sheet (system) with JSON file
- Import → file picker → confirmation alert → replace all data

---

### 7. ParkGuideView

**Entry:** Book icon from Overview toolbar

**Content (scrollable):**
- What is this app?
- Attraction statuses (Open / Testing / Broken Down / Closed)
- Zones (6 life areas explained)
- Staff roles (4 modes explained)
- Park rating (how it's calculated)
- Profit (how it's earned)
- Best use tips (5 tips)

**Dismiss:** "Done" button top right

---

## Empty States

| Screen | Message |
|--------|---------|
| Overview (no tasks) | Rating shows 72% · Guest thought: "Welcome to the park!" |
| Attractions board (no tasks in column) | Column header visible, no cards |
| Finances (no ledger entries) | "Close attractions to see earnings here." |
| Priority attractions (no open tasks) | "Nothing queued — add an attraction." |
| Alerts (none) | "No incidents on the radio." |

---

## Error States

| Trigger | Handling |
|---------|----------|
| Save attraction fails | Alert: "Save failed" + error message |
| Delete attraction fails | Toast: "⚠️ Delete failed — try again" |
| Status change save fails | Toast: "⚠️ Save failed — try again" |
| Export backup fails | Alert: "Export failed" + error message |
| Import file invalid | Alert: "Import failed" + specific error |
| Import schema mismatch | Alert: "This backup needs a newer version of the app" |

---

## Permission Flows

None in V1 (no notifications, no camera, no location).

---

## Navigation Patterns

| Pattern | Used for |
|---------|----------|
| Tab bar | Top-level navigation (3 tabs) |
| NavigationLink (push) | Attraction card → AttractionDetailView |
| Modal sheet | AttractionEditorView, SettingsView, ParkGuideView |
| Floating button | Global "+ New Attraction" |
| Toast overlay | Status changes, saves, deletes |
| Alert | Destructive confirmation (import), errors |
