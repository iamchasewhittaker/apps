# Park Operations Console — product spec (RollerTask Tycoon iOS)

**Audience:** PM, design, future you. **Canonical how-to / definitions:** [`PARK_OPERATIONS_KEY.md`](PARK_OPERATIONS_KEY.md).

**Design reference:** Primary layout and visual density assume **iPhone 12 Pro Max**; other sizes are supported—verify dense screens (Attractions board, Overview cards) when changing UI.

## Thesis

The user is the **park manager**; their life is the **park**. Work items are **attractions** with tycoon language (statuses, zones, staff roles, profit). The app stays **practical** (real tasks, due dates, backups) with a **retro control-panel** feel—not a toy that blocks shipping.

## V1 scope (shipped direction)

**In**

- Five bottom tabs: **Overview**, **Attractions**, **Staff**, **Finances**, **Map** (segment-style tab bar).
- **Attractions** with four statuses: **Open**, **Testing**, **Broken Down**, **Closed**; metadata: **zone**, **staff role**, **priority**, **reward ($)**, optional **due date**, **description**, **subtasks**.
- **Overview** dashboard: header metrics (rating %, profit today, guests, alert count), cards for park status, guest thoughts, priority top three, alerts, quick actions (Add, Testing focus, Log profit, Repair focus).
- **Board** (four columns) + **List** toggle on Attractions; **ride panel** detail with status buttons + edit + delete.
- **Profit ledger**: closing an attraction credits **reward** to **park cash** and appends a ledger row; **Log profit** adds manual dollars (ledger + cash).
- **Backup JSON schema v2** (tasks + subtasks + ledger); **import still accepts v1** (`isDone` only).
- **Legacy migration**: one-time mapping from `isDone` → status for existing installs.

**Out (defer)**

- Drag-and-drop kanban, swipe-to-change-status on cards, completion **sound**, heavy **animations**, achievements, pixel isometric map, widgets, Watch, Siri, AI.

## Information architecture

- **Global:** floating **+ New Attraction** (same as Quick action Add).
- **Overview toolbar:** Templates, Export backup, Import backup, Settings.
- **Map:** zone rows → switches to **Attractions** tab with **zone filter**.

## Domain model (summary)

- **Attraction** (`ChecklistTaskItem`): title, status, zone, staff role, priority, reward, due, details, subtasks, `closedAt` when closed.
- **Subtask**: checklist line; toggling does **not** auto-close the attraction.
- **Ledger entry**: timestamp, amount, optional task id, note (`Close attraction` or `Manual`).

## Rating, guests, alerts (V1)

- **Park rating %:** heuristic from % closed, penalties for **Broken Down** and **overdue** work (see `GameFlavor.parkRatingPercent`).
- **Guests:** `max(1, 1 + count of Open)` — playful throughput signal.
- **Alerts:** rule-based strings (many broken, overdue, low rating).
- **Priority top 3:** overdue first, then priority, prefer Open, then recency.

## Copy & voice

- Use park operations vocabulary in UI; boring productivity jargon avoided for statuses.
- Templates can use names like “Facility Maintenance: …” — no automatic title rewriting in V1.

## Visual

- **ParkTheme:** grass gradient background, beige **panels**, wood borders, gold accents, red for alerts; **display** font (monospaced when park fonts on) vs readable system body.

## Backup

- **v2** export includes `ledger[]`. **v1** import maps `isDone` → Closed/Open and defaults for new fields; ledger starts empty.

## Roadmap hints

- V1.5: drag board, swipe status, smarter alerts.
- V2: sound, light animations, achievements.
- V3+: visual map, ecosystem (widgets, Siri).

## Linear

Track work under **[Park Checklist (iOS) / RollerTask Tycoon](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e)**; link this file and the Key doc in the epic / V1 issue description.
