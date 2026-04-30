# Session Start — Spend Clarity (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-03-30** — v0.1.0: Initial scaffold. Gmail OAuth + receipt parsing (Amazon, Apple, DoorDash, Netflix, Walmart, Target, Costco). YNAB API read + bulk PATCH. Exact/fuzzy/split matching. Memo formatter with 200-char limit. Keyword-based categorizer. 28 tests
- **2026-03-30** — v0.1.1: OAuth setup gotchas documented (test user, macOS python alias, credentials path)
- **2026-03-30** — v0.1.2: Privacy.com API client. Audible parser. Matcher split/dedup fixes. Match rate improved 4 to 50 transactions
- **2026-04-12** — v0.2.0: payee_formatter.py (50+ merchant map, bank noise stripping). category_overrides.yaml. Three-tier Categorizer (overrides then payee rules then keywords). Step 4.5: categorize ALL blank-memo transactions by payee. All 9 category IDs fixed to correct budget. 57 new tests
- **2026-04-13** — v0.2.1: Startup category-ID validation against live YNAB. Launchd scheduler install flow. Richer unmatched diagnostics
- **2026-04-16** — v0.2.2: Conditional Gmail init (Privacy-only runs skip OAuth). PRIVACY_API_KEY placeholder strip. 90 tests passing

---

## Still needs action

- Add real PRIVACY_API_KEY to .env (https://privacy.com/developer), then test with `--merchants privacy`
- First live run with DRY_RUN=false on real YNAB budget (start narrow: LOOKBACK_DAYS=30, AUTO_CATEGORIZE=false)
- category_overrides.yaml auto-suggest (print "add this override?" on pattern failures)
- Amazon Fresh sub-categorization (currently all Amazon goes to default)

---

## Spend Clarity state at a glance

| Field | Value |
|-------|-------|
| Version | v0.2.2 |
| URL | local Python |
| Storage key | n/a |
| Stack | Python 3.11+ CLI (python-dotenv, google-auth-oauthlib, requests) |
| Linear | [Spend Clarity](https://linear.app/whittaker/project/spend-clarity-4352a4e7f1c5) |
| Last touch | 2026-04-16 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/spend-clarity/CLAUDE.md | App-level instructions |
| portfolio/spend-clarity/HANDOFF.md | Session state + notes |
| src/main.py | CLI orchestrator: YNAB fetch, receipt match, memo format, categorize, PATCH |
| src/matcher.py | Receipt-to-YNAB transaction matching (exact, fuzzy, split) |
| src/categorizer.py | Three-tier categorizer: overrides then payee rules then keywords |
| src/privacy_client.py | Privacy.com API client (replaces Gmail for virtual-card charges) |
| config/category_rules.yaml | Keyword rules + payee rules (12 groups, correct budget IDs) |

---

## Suggested next actions (pick one)

1. First live YNAB write: DRY_RUN=false, LOOKBACK_DAYS=30, AUTO_CATEGORIZE=false for a narrow memo-only pass
2. Add category_overrides.yaml auto-suggest prompt for unmatched patterns
3. Add summary stats at end of run (X categorized, Y memos enriched, Z skipped)
