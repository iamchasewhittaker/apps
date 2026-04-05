# RollerTask Tycoon — roadmap (iOS)

## Done (v1 scaffold)

- SwiftData persistence, checklist UX, templates, backup export, settings toggle.
- Layout polish: toolbar cash/rating stack, multiline banner and task text, safe-area padding above home indicator.
- Rebrand: Xcode **RollerTaskTycoon** / **RollerTaskTycoonTests**, `UserDefaults` keys `chase_roller_task_tycoon_ios_*` + migration from Park Checklist keys; backup filenames **RollerTaskTycoon-backup-*.json**.

## Planning

- **Workflow + filled docs:** [`docs/planning/README.md`](docs/planning/README.md) — start with [`PLANNING_WORKFLOW.md`](docs/planning/PLANNING_WORKFLOW.md).
- **Blank templates (kit v3):** [`docs/ios-app-starter-kit/README.md`](../../docs/ios-app-starter-kit/README.md).
- **Execution:** Linear **[Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e)** (product RollerTask Tycoon; rename optional) — issues mirror [`docs/planning/BACKLOG.md`](docs/planning/BACKLOG.md).

## Next ideas

- **Import merge mode** (by task `id`) — optional follow-up; v1 shipped **replace-all** only.
- **Pixel font** asset (OFL) + optional tiled grass background art (CC0).
- **Widgets** / Siri (add task, show open count).
- **CloudKit** or shared sync (align with portfolio Supabase apps if desired).
