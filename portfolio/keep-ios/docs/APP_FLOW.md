# App Flow — Keep

> Phase 3: UX / App Flow.

## First screen
HomeView — list of rooms with item counts, triage progress bars, and a quick stats banner. Empty state prompts "Add Room."

## Main action
Triage items one at a time — the keep/donate/toss/unsure decision is the core loop.

## Primary flow
1. Create a room (e.g., "Garage") and define spots within it (e.g., "Shelf A", "Workbench")
2. Add items via camera + name (batch mode — keep adding without leaving)
3. Start triage — swipe through items one at a time, deciding Keep / Donate / Toss / Unsure
4. Kept items get assigned to a spot
5. View stats to see progress and feel motivated

## Screens
- **HomeView (Tab 1: Rooms)** — room list with cards showing item count + progress bar + stats banner
- **RoomDetailView** — spots with their items, unsorted items, action buttons (Add Items / Triage)
- **AddItemView** (sheet) — camera capture + name field, "Add & Next" for batch entry
- **TriageView** (full screen) — one item at a time with 4 triage buttons + progress bar
- **SpotPickerSheet** — appears after "Keep" to assign item to a spot
- **CoachSheet** — 3 yes/no questions to help decide, triggered after 3+ Unsure
- **StatsView (Tab 2: Stats)** — overview, breakdown by status, room progress, donation bags
- **AddRoomSheet** — name + emoji picker
- **AddSpotSheet** — name field

## Empty states
- HomeView: house icon + "No rooms yet" + "Tap + to add your first room" + Add Room button
- RoomDetailView spots: "No spots defined yet. Add spots like 'Shelf A' or 'Under workbench' to assign items a home."
- TriageView complete: checkmark seal + "All caught up!" + session count

## Error states
- No destructive errors possible (all local, no network)
- Camera unavailable: falls back to photo library (simulator support)
- Empty name fields: Add buttons are disabled until text is entered
