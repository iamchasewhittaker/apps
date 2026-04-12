# Changelog

All notable changes to this project will be documented here.

## [Unreleased]

- **Docs:** `HANDOFF.md` — note that Wellness Tracker branding references **YNAB Clarity** `ClarityTheme` (this CLI ships no logo asset).

## [0.1.2] — 2026-03-30

### Added
- `src/privacy_client.py` — Privacy.com API client; fetches settled transactions and converts them to `ParsedReceipt` objects, replacing email parsing for Privacy.com virtual cards
- `PRIVACY_API_KEY` env var support; when set, Privacy.com transactions are sourced from the API rather than Gmail
- Audible merchant: Gmail parsing (`no-reply@audible.com`), extracts audiobook title + author, payee keywords include both `audible` and `amazon`
- Privacy.com merchant: Gmail fallback parser (`support@privacy.com`), extracts merchant name from notification text

### Fixed
- `matcher.py` `_find_split_matches()`: removed stray `or True` that was sending all transactions (including already-matched ones) to split matching
- `matcher.py`: added `used_txn_ids` set to prevent a single YNAB transaction from being matched by two different merchants (e.g. DoorDash via email AND Privacy.com via API)
- `matcher.py`: split matching disabled for `privacy` and `audible` to prevent false coincidental amount matches on high-volume merchants
- `receipt_parser.py` `_parse_apple()`: filters out marketing rows ("Save 3% with Apple Card"), ALL-CAPS run-on label rows, rows >80 chars; adds subscription name fallback via "Renews/Monthly/Annual" pattern
- `receipt_parser.py` `_parse_amazon()`: order ID regex now handles alphanumeric IDs (e.g. `D01-xxx`); amount regex targets labeled totals (`Grand Total`, `Order Total`, `Charged to`) with `_find_last_amount()` fallback
- `receipt_parser.py` `_parse_doordash()`: only processes `Order Confirmation` emails; restaurant name extracted from subject `"from RESTAURANT"` pattern
- `privacy_client.py`: descriptor normalization — `*` separator logic correctly distinguishes token codes (`Audible*DZ4065L83` → `Audible`) from product names (`GOOGLE *YouTube TV` → `YouTube TV`); ALL-CAPS → title case only when full string is uppercase

### Changed
- `main.py`: Privacy.com excluded from Gmail fetch loop via separate `email_merchants` variable, keeping `active_merchants` intact for matching (was: `active_merchants` mutated, causing Privacy.com receipts to never be matched)
- `main.py`: added `audible` and `privacy` to `MERCHANTS` config; updated DoorDash payee keywords to include `doordas`
- Match rate improved from 4 → 50 transactions (out of 251 relevant)

## [0.1.1] — 2026-03-30

### Fixed
- `README.md`: Added step to add Gmail address as a test user in Google Cloud Console (required to avoid "Access blocked" error during OAuth)
- `README.md`: Added note about macOS not aliasing `python` — must activate venv or use `python3`
- `README.md`: Added fix for credentials file saved with colon (`config:gmail_credentials.json`) instead of slash
- `README.md`: Clarified the "Advanced → Go to unsafe" click required during OAuth consent screen
- `CLAUDE.md`: Added "Setup Gotchas" section documenting all of the above for future sessions

## [0.1.0] — 2026-03-30

### Added
- Initial project scaffold
- `src/main.py` — CLI orchestrator with `--auth`, `--dry-run`, `--merchants` flags; runs all 7 enrichment steps
- `src/gmail_client.py` — Gmail OAuth2 authentication (read-only scope), paginated email search by sender and date range
- `src/receipt_parser.py` — Per-merchant receipt parsing for Amazon, Apple, DoorDash, Netflix/Spotify/Hulu/Disney+, Walmart/Target/Costco
- `src/ynab_client.py` — YNAB REST API wrapper; fetches blank-memo transactions, bulk PATCH in batches of 100
- `src/matcher.py` — Exact → fuzzy → split order matching logic with ambiguity detection
- `src/memo_formatter.py` — Memo string generation with 200-char YNAB limit, overflow truncation, split order prefix
- `src/categorizer.py` — Keyword-based YNAB category assignment via `category_rules.yaml`
- `config/category_rules.yaml` — Default keyword mappings for Electronics, Groceries, Household, Clothing, Books, Health, Kids, Pets
- `tests/test_matcher.py` — 9 unit tests covering exact, fuzzy, split, ambiguous, and out-of-tolerance cases
- `tests/test_receipt_parser.py` — 9 unit tests for all merchant parsers and helper functions
- `tests/test_memo_formatter.py` — 10 unit tests covering all memo formatting rules
- `output/enrichment_log.txt` and `output/unmatched_report.txt` — generated output targets (gitignored)
- `.env.example`, `.gitignore`, `requirements.txt`, `README.md`, `CLAUDE.md`, `PROMPT.md`
