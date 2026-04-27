# Park Operations Key — what everything means & how to use it

Companion to [`PARK_OPERATIONS_CONSOLE.md`](PARK_OPERATIONS_CONSOLE.md). **Support + contributors:** treat this as source of truth for UX copy and behavior.

**Device:** The interface is **designed around iPhone 12 Pro Max** proportions; it works on other iPhones—if something feels tight on a smaller phone, that’s expected to vary slightly.

## Bottom tabs

| Tab | Purpose |
|-----|---------|
| **Overview** | Dashboard: metrics, thoughts, priorities, alerts, quick actions; **Templates / Export / Import / Settings** in the nav bar. |
| **Attractions** | Your task board: **Board** (four columns) or **List**; tap a card → **detail**. |
| **Staff** | Four **roles** with suggested “next assignment” heuristics (not separate accounts). |
| **Finances** | **Today** / **week** profit from the **ledger**; top earners (last 7 days, task-linked closes). |
| **Map** | **Zones**; tap one → **Attractions** tab filtered to that zone. |

## Header metrics (Overview)

| Metric | Meaning | Source |
|--------|---------|--------|
| **Rating %** | 0–100 park health from completion + broken + overdue | `GameFlavor.parkRatingPercent` |
| **Profit today** | Sum of **ledger** amounts with today’s date | `ParkFinance.profitToday` |
| **Guests** | `1 +` (count of **Open** attractions), minimum 1 | Playful throughput |
| **Alerts** | Count of **alert rules** firing (same list as Alerts card) | `GameFlavor.parkAlerts` |

## Overview cards

- **Park status:** rating again; counts **Open / Testing / Broken Down**; **Closed today** (by `closedAt` date); **Active** = Open + Testing.
- **Guest thoughts:** 1–2 strings chosen from pools biased by broken/overdue/testing load.
- **Priority attractions:** up to three **non-closed** items sorted by overdue → priority → Open → recency.
- **Alerts:** bullet list of operational warnings (not push notifications in V1).
- **Quick actions:** **Add** (new attraction sheet); **Testing** (jump to Attractions, highlight Testing column); **Log profit** (manual dollars); **Repair** (jump to Attractions, highlight Broken Down column).

## Statuses

| Status | Meaning |
|--------|---------|
| **Open** | Ready to start. |
| **Testing** | In progress. |
| **Broken Down** | Blocked, stalled, or avoided — needs attention. |
| **Closed** | Done for now; **reward** was credited when you entered Closed (unless reward was $0). |

Re-opening (moving **from** Closed **to** another status) **subtracts** the current reward from **park cash** (ledger history is kept).

## Attraction fields

- **Zone:** Home, Career, Family, Growth, Health, Errands — life-area filter.
- **Staff role:** Operator, Janitor, Mechanic, Entertainer — flavor + Staff tab grouping.
- **Priority:** Low / Medium / High — affects priority list and Staff “urgent” heuristic.
- **Reward:** Whole dollars added to cash **each time** you transition **into** Closed.
- **Due date:** Optional; **overdue** = due before start of today and not Closed.
- **Subtasks:** Checklist only; they do **not** pay reward.

## Attractions screen

- **Board / List** toggle persists (`chase_roller_task_tycoon_ios_board`).
- **Filter bar:** shows active **zone** (from Map) or **column focus** (from quick actions); **Clear** removes it.
- **Card:** title, zone, reward, priority, due label (Today / Tomorrow / date).

## Detail panel buttons

- **Start testing** → **Testing** (disabled if already Testing or Closed).
- **Mark broken down** → **Broken Down** (disabled if already Broken or Closed).
- **Close attraction** → **Closed** (pays reward, sets `closedAt`, ledger note “Close attraction”).
- **Edit** → full editor (subtasks replaced on save when editing).
- **Delete** → removes attraction (and subtasks); does not remove old ledger rows.

## Staff tab

For each role, **Assigned** is the best matching **non-closed** attraction (overdue & priority first). **Status** is **Idle** / **Needed** / **Active** / **Urgent** from the same pool.

## Finances tab

- **Today / Weekly profit:** sums **ledger** rows in period (includes **Manual** entries).
- **Top earning attractions:** sums **ledger** rows in the last 7 days that have a **task id**, grouped by attraction title.
- **Ideas for later:** “Spending leaks” are **not** implemented in v1.

## Log profit sheet

Enter a **positive whole dollar** amount → adds to **park cash** and inserts a **Manual** ledger row.

## Backup

- **Export:** always **schema v2** JSON: `tasks` (with `subtasks` nested), `ledger`, `cash`.
- **Import:** **v1** or **v2**; **replaces everything** (attractions, subtasks, ledger, cash). Confirm before apply.

## Settings

- **Readable fonts:** system body/headline instead of rounded/monospaced display styling in places that respect the toggle.

## UserDefaults keys (non-exhaustive)

| Key | Purpose |
|-----|---------|
| `chase_roller_task_tycoon_ios_cash` | Park cash |
| `chase_roller_task_tycoon_ios_readable` | Readable fonts |
| `chase_roller_task_tycoon_ios_board` | Board vs list on Attractions |
| `chase_roller_task_tycoon_ios_migrated_v2_fields` | One-time legacy `isDone` → status migration |

## FAQ

- **Why did cash drop when I reopened a closed attraction?** Leaving Closed reverses the last rewarded amount from **cash** (ledger stays for history).
- **Do subtasks pay?** No — only **Close attraction** pays the attraction **reward**.
