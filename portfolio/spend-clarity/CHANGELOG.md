# Changelog

All notable changes to this project will be documented here.

## [Unreleased]

### Added
- `main.py` — `_email_merchants_for_step2()` helper; Chase Gmail OAuth runs only when pipeline mode or at least one merchant still uses Gmail (Privacy excluded when `PRIVACY_API_KEY` is set)
- `prompts/SESSION_START.md` — copy-paste session bootstrap for new chats
- `scripts/install_launchd_job.sh` + `ops/com.chase.spend-clarity.enrich.plist` — one-command launchd install/update flow (nightly schedule, dry-run default, optional `--live`)
- `src/main.py --print-launchd-plist` — prints a fully resolved launchd plist for manual review/custom scheduling
- `tests/test_matcher.py` — unmatched diagnostics coverage and merchant-candidate metadata assertion
- `tests/test_categorizer.py` — startup-validation support coverage for configured category ID collection

### Changed
- `main.py` — `PRIVACY_API_KEY` values starting with `your_` are ignored (`.env.example` placeholders)
- `HANDOFF.md`, `CLAUDE.md`, `README.md`, `ROADMAP.md`, `PROMPT.md` — Privacy-only path, tests (`PYTHONPATH`), session prompt
- `src/main.py` — startup category validation now checks configured IDs against live YNAB categories and fails fast if none resolve
- `src/main.py` + `src/matcher.py` — unmatched report now includes merchant candidates and closest date/amount mismatch details
- `src/ynab_client.py` + `src/categorizer.py` — expose category ID sets for startup validation (`get_category_ids`, `configured_category_ids`)
- `README.md` + `ROADMAP.md` — documented launchd operation, startup validation behavior, and completed roadmap items (#1, #3, #4)

### Fixed
- `tests/test_pipeline_auto.py` — resolved stub collision so `google.auth.transport.requests.Request` is no longer overwritten by a fake `requests` module during collection
- `tests/test_receipt_parser.py` — updated DoorDash fixture to include order-confirmation subject text expected by parser guards
- `src/main.py` — removed duplicated launchd parser/helper blocks and restored Python 3.9 compatibility (`Optional[str]`)

## [0.2.0] — 2026-04-12

### Added
- `src/payee_formatter.py` — port of iOS `PayeeDisplayFormatter.swift`; strips ACH/bank noise (10 regex patterns, 8-pass iterative), resolves 50+ known merchants by substring, strips trailing `*ALPHANUM` / `#digits` noise, title-cases ALL CAPS strings ≥ 4 letters
- `config/category_overrides.yaml` — user-editable correction file checked before all rules; format: `pattern` (case-insensitive substring) → `category_id` → optional `note`; starts empty so only corrections intentionally added take effect
- `config/category_rules.yaml` — new `payee_rules:` section; 12 rule groups covering Subscriptions, Utilities, Insurance, Groceries, Gas, Dining, Rideshare, Pharmacy, Big-box, Gifts, Home improvement, Kids activities
- `tests/test_payee_formatter.py` — 37 tests (known merchants, bank noise stripping, trailing noise, ALL CAPS, edge cases)
- `tests/test_categorizer.py` — 20 tests (payee rules, combined categorization, overrides priority)

### Fixed
- **Critical:** All 9 category IDs in `category_rules.yaml` were pointing to the wrong YNAB budget (`583fdbca` "ynab-enrichment") — every categorization attempt was writing invalid IDs. All IDs updated to the correct budget (`ab0a40fe`).
- `config/category_rules.yaml` — budget ID removed from comment (replaced with `.env` reference) to avoid committing identifiable config to a public repo

### Changed
- `src/categorizer.py` — rewritten with three-tier `Categorizer` class: (1) user overrides, (2) payee rules, (3) item keyword rules; `categorize_transaction(payee, items)` tries all three in order
- `src/main.py` — **Step 4.5** added: after receipt matching, iterates ALL remaining blank-memo transactions and applies `categorize_transaction(payee=...)` via cleaned payee name; previously only receipt-matched transactions were categorized
- `src/main.py` — uses `display_payee()` for clean payee names in unmatched report output
- `src/main.py` — `AUTO_CATEGORIZE` defaults to `true` (was `false`)
- `src/setup_categories.py` — added `strip_emojis()` (removes `[^\x00-\u024F]` characters) so YNAB category names with emoji suffixes (💸, 🔒, etc.) match correctly; `build_name_to_id()` handles duplicate base names across groups via `group/name` qualified keys; `CATEGORY_NAME_MAP` uses group-qualified names for ambiguous entries (e.g., `"NEEDS/Clothing"`)
- `.env.example` — `AUTO_CATEGORIZE` default changed to `true`

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
