# Gmail Forge — Inbox leaker log (Phase 2)

**Purpose:** During the 30-day iteration (through ~2026-05-12), record senders that still hit the **inbox** without the intended label so they can be promoted into `gmail-filters.xml` / `apps-script/rules.gs`.

**Source:** Daily email reports — any sender called out as an **inbox leaker** at the end of the report.

## Weekly rollup

| Week ending (Sun) | New leakers noted | Promoted to XML/rules | Notes |
|---|---|---|---|
| 2026-05-03 | 5 | 0 | Apr 30 daily report — capacities.io, hi.extra.email, updates.linear.app, toybook.com domain gap, GitHub CI mislabel (currently routed to Security via `github.com` domain). |

## Raw entries

| Date | Sender / domain | Subject (optional) | Proposed label | Added to filters? |
|---|---|---|---|---|
| 2026-04-30 | `capacities.io` | — | Notification | ⬜ |
| 2026-04-30 | `hi.extra.email` | Extra app | Notification | ⬜ |
| 2026-04-30 | `updates.linear.app` | Linear security alerts | Security | ⬜ |
| 2026-04-30 | `james@toybook.com` → `toybook.com` | — | Newsletter (promote to domain rule) | ⬜ |
| 2026-04-30 | GitHub CI | — | Notification (currently mislabeled Security) | ⬜ |

## How to close the loop

1. Add domain or address to `gmail-filters.xml` (prefer domain-level).
2. Mirror the same rule in `apps-script/rules.gs`.
3. Re-import XML in Gmail with **Also apply filter to matching conversations**.
4. Tick **Added to filters** above and note the week in the rollup table.
