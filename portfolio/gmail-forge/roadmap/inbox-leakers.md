# Gmail Forge — Inbox leaker log (Phase 2)

**Purpose:** During the 30-day iteration (through ~2026-05-12), record senders that still hit the **inbox** without the intended label so they can be promoted into `gmail-filters.xml` / `apps-script/rules.gs`.

**Source:** Daily email reports — any sender called out as an **inbox leaker** at the end of the report.

## Weekly rollup

| Week ending (Sun) | New leakers noted | Promoted to XML/rules | Notes |
|---|---|---|---|
|  |  |  |  |

## Raw entries

| Date | Sender / domain | Subject (optional) | Proposed label | Added to filters? |
|---|---|---|---|---|
|  |  |  |  | ⬜ |

## How to close the loop

1. Add domain or address to `gmail-filters.xml` (prefer domain-level).
2. Mirror the same rule in `apps-script/rules.gs`.
3. Re-import XML in Gmail with **Also apply filter to matching conversations**.
4. Tick **Added to filters** above and note the week in the rollup table.
