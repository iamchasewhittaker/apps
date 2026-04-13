# Roadmap — Spend Clarity

> Python CLI: enriches YNAB transactions from Gmail receipts + auto-categorizes by payee.
> Run: `python3 src/main.py` from `portfolio/spend-clarity/`

---

## Current state — v0.2.0

| Area | Status |
|------|--------|
| YNAB API read (transactions, categories) | ✅ Done |
| Gmail OAuth + receipt parsing (Amazon, Apple, DoorDash) | ✅ Done |
| Privacy.com API client | ✅ Done |
| Receipt → YNAB transaction matching (amount ± $0.50, date ± 6 days) | ✅ Done |
| Memo formatting + YNAB PATCH write (dry-run default) | ✅ Done |
| `payee_formatter.py` — bank noise strip + 50+ merchant map | ✅ Done |
| `category_rules.yaml` — keyword rules + payee_rules (12 groups, correct budget IDs) | ✅ Done |
| `category_overrides.yaml` — user-editable corrections, checked first | ✅ Done |
| Three-tier `Categorizer` (overrides → payee rules → keywords) | ✅ Done |
| Step 4.5: categorize ALL blank-memo transactions by payee | ✅ Done |
| `setup_categories.py` — emoji stripping + duplicate name handling | ✅ Done |
| 57 tests passing (`test_payee_formatter.py`, `test_categorizer.py`) | ✅ Done |

---

## V1 Backlog (next up)

| # | Priority | Task | Why |
|---|----------|------|-----|
| 1 | 🔴 High | Startup validation — check that at least one category ID resolves against live budget | Prevents silent failures from stale/wrong IDs (root cause of v0.1 bug) |
| 2 | 🔴 High | `venv` + `requirements.txt` install instructions in README | `bs4`, `pyyaml`, `google-auth-oauthlib` need to be installed before first run |
| 3 | 🟡 Medium | Scheduled run via `launchd` — auto-enrich on a cron (e.g. nightly) | Eliminates manual runs; `DRY_RUN=false` after confidence validated |
| 4 | 🟡 Medium | Unmatched report improvement — show which payee rule (if any) was tried and why it failed | Easier to debug missing rules |
| 5 | 🟡 Medium | `category_overrides.yaml` auto-suggest — print "add this override?" prompt when a pattern fails | Reduces friction for adding corrections |
| 6 | 🟢 Low | Amazon payee sub-categorization — detect "Amazon Fresh" → Groceries vs default Miscellaneous | Amazon is intentionally excluded from payee rules; item-keyword rules handle it, but Amazon Fresh is grocery-only |
| 7 | 🟢 Low | Summary stats at end of run — X categorized, Y memos enriched, Z skipped | Better run feedback beyond the current log |

---

## V2 Ideas (parked)

| # | Idea | Notes |
|---|------|-------|
| V2-1 | Interactive override editor — `python src/main.py --edit-overrides` | Opens YAML in `$EDITOR` after showing unmatched transactions |
| V2-2 | Monthly spending summary — export CSV of categorized transactions | Useful for partner review / budget retro |
| V2-3 | Multiple budget support | Currently hard-coded to one `YNAB_BUDGET_ID` |
| V2-4 | Web UI digest — weekly HTML report emailed to self | Phase 3 of original design |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-04-12 | **v0.2.0:** `payee_formatter.py`, `category_overrides.yaml`, three-tier `Categorizer`, Step 4.5 in `main.py`, emoji stripping in `setup_categories.py`, all 9 category IDs fixed, 57 new tests |
| 2026-03-30 | **v0.1.2:** `privacy_client.py`, Audible parser, matcher split/dedup fixes, receipt parser improvements |
| 2026-03-30 | **v0.1.1:** README + CLAUDE.md OAuth setup gotchas |
| 2026-03-30 | **v0.1.0:** initial scaffold — Gmail, YNAB, matcher, memo formatter, categorizer, tests |
