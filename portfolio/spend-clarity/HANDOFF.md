# YNAB Enrichment Tool — Handoff

## What this is
A **standalone Python CLI** Chase is building to enrich YNAB transactions with item-level detail parsed from receipt emails (Amazon, Apple) and merchant data from Privacy.com's API. Runs locally (or via `launchd`/cron) on Chase's machine. Not a plugin, not a service — a personal tool that talks to external APIs.

## Why
Goal is genuine clarity on household finances: income vs expenses, spending leaks, a realistic monthly target. Clean enriched transaction data is the foundation. Secondary goal: a weekly glanceable digest for Chase's partner, who doesn't use YNAB directly.

## Architecture (one repo, one CLI)
```
ynab-enrich/
├── src/ynab_enrich/
│   ├── cli.py              # entry point: `ynab-enrich run|digest`
│   ├── config.py           # env loading, budget resolution
│   ├── ynab_client.py      # YNAB API wrapper
│   ├── gmail_client.py     # Gmail API + OAuth
│   ├── privacy_client.py   # Privacy.com REST API (NEW — see below)
│   ├── parsers/
│   │   ├── amazon.py       # BeautifulSoup on ship-confirm emails
│   │   └── apple.py        # Apple receipt emails
│   ├── matcher.py          # amount + date (±1 day) → YNAB txn
│   └── writer.py           # memo updates, respects DRY_RUN
├── CLAUDE.md
├── PROMPT.md
└── pyproject.toml
```

## Current state
- Scaffolding phase. No repo, no Gmail creds yet.
- `CLAUDE.md` and `PROMPT.md` bootstrap files exist (regenerated — see alongside this doc).
- Next concrete step: set up Gmail API OAuth in Google Cloud Console, then start a fresh Claude Code session with `PROMPT.md`.

## Key decisions already made
- **No web scraping of Amazon.** Gmail parsing only. Fragility + CAPTCHA + TOS.
- **Firecrawl evaluated and rejected** for v1. Gmail + Privacy.com API cover the named merchants. Revisit only if a future merchant has stub emails and no API.
- **Privacy.com uses its REST API**, not email parsing. Returns real merchant behind each virtual card as JSON — better than any scraper.
- **Budget resolution is automatic.** Default to YNAB's `last-used` budget ID; optionally resolve by name via `YNAB_BUDGET` env var; log the resolved budget name + ID on every run so it's never ambiguous which budget got touched.
- **Safety defaults:** `DRY_RUN=true`, never overwrite existing memos, skip ambiguous matches, idempotent by design.
- **Match rule:** amount + date with ±1 day tolerance.

## How it runs
Batch CLI, not a daemon. Progression:
1. **Manual dry-runs** for 1–2 weeks to verify parsers on real receipts.
2. **`launchd` daily job, still dry-run**, logs to `~/Library/Logs/ynab-enrich.log`. Shadow mode.
3. **Flip `DRY_RUN=false`** once the log looks clean for a week.
4. **Add weekly digest job** (separate launchd entry, Sunday evening) once enrichment is trusted.

The CLI must stay idempotent: `--since 7d` bounds the work, memo-preservation makes re-runs safe.

## Three-phase roadmap
1. **Enrich** — parse, match, write memos/categories.
2. **Audit** — use enriched data to diagnose spending patterns.
3. **Digest** — weekly summary for partner (separate CLI command, same package).

## Open questions for the new chat
- Do we add Privacy.com as a first-class client *before* or *after* Amazon/Apple parsers land? (Recommendation: before — it's simpler and de-risks the virtual-card matching problem.)
- Partner digest delivery: email, Slack DM, or static HTML page? Not decided.
- How far back to backfill on first run? Memory says 6–12 months; confirm with Chase.

## Secrets handling (decided)
- **macOS Keychain via Python `keyring`** for `YNAB_TOKEN` and `PRIVACY_API_KEY`. Never in `.env`, never in the repo.
- **Gmail OAuth files** in `~/.config/ynab-enrich/` (`chmod 700` dir, `chmod 600` files). Outside the repo.
- **`.gitignore` from commit 1**: `.env`, `secrets/`, `*.json` at root, `.venv/`, `*.log`.
- **`gitleaks` pre-commit hook** installed before first commit. Non-optional.
- **Redacting log formatter** strips `Bearer \S+` and token patterns before anything hits disk. Log file `chmod 600`.
- First-time setup is two `keyring set` commands + one `mkdir` + dropping the Gmail client JSON. Full commands are in CLAUDE.md.
- Env vars are ONLY for non-secret config (`YNAB_BUDGET`, `DRY_RUN`, `LOG_PATH`, Gmail file paths). No fallback to env for tokens — defeats the point.

## Reference repos
- `GraysonCAdams/amazon-ynab-sync` — top-ranked, Gmail/IMAP fuzzy matching
- `DanielKarp/YNAmazon` — memo formatting, split-order handling
- `troylar/ynab-a-day` — digest use case

## First message to paste into the new chat
> I'm building a standalone Python CLI to enrich YNAB transactions with data from Amazon/Apple receipt emails and the Privacy.com API. Read HANDOFF.md and CLAUDE.md (both attached). I haven't set up Gmail OAuth yet — walk me through that, then we'll start the Claude Code session with PROMPT.md.
