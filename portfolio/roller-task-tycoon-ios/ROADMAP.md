# RollerTask Tycoon — roadmap (iOS)

## Done (v1 — Park Operations Console)

- Five-tab shell, Overview dashboard, Attractions board/list + detail, Staff/Finances/Map, floating **New Attraction**.
- Four statuses, zones, staff roles, priority, reward, due date, description, subtasks; profit **ledger** + close/manual profit.
- Backup **schema v2** (+ v1 import); docs **[`docs/PARK_OPERATIONS_CONSOLE.md`](docs/PARK_OPERATIONS_CONSOLE.md)** + **[`docs/PARK_OPERATIONS_KEY.md`](docs/PARK_OPERATIONS_KEY.md)**.
- Rebrand + keys: Xcode **RollerTaskTycoon** / **RollerTaskTycoonTests**, `chase_roller_task_tycoon_ios_*` + Park Checklist migration; backup **RollerTaskTycoon-backup-*.json**.

## Planning

- **Workflow + filled docs:** [`docs/planning/README.md`](docs/planning/README.md) — start with [`PLANNING_WORKFLOW.md`](docs/planning/PLANNING_WORKFLOW.md).
- **Blank templates (kit v3):** [`docs/ios-app-starter-kit/README.md`](../../docs/ios-app-starter-kit/README.md).
- **Execution:** Linear **[Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e)** (product RollerTask Tycoon; rename optional) — issues mirror [`docs/planning/BACKLOG.md`](docs/planning/BACKLOG.md).

## Next ideas

- **Kanban:** drag-and-drop between columns; swipe on cards to change status.
- **Completion feedback:** optional sound + light coin/rating animation (currently no sound in V1).
- **Import merge mode** (by task `id`) — optional; still **replace-all** today.
- **Pixel font** asset (OFL) + optional tiled grass / map art (CC0).
- **Widgets** / Siri (add attraction, show open count).
- **CloudKit** or shared sync (align with portfolio Supabase apps if desired).
