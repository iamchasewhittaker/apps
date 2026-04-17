# YNAB Transaction Enrichment Tool

Enriches YNAB transactions with item-level detail by parsing Gmail receipt emails and (for Privacy.com) the **Privacy.com API**. Matches receipts to YNAB transactions by merchant, date, and amount, then writes descriptive memos and optional categories back to YNAB.

## Setup

### 1. Install dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

- `YNAB_API_TOKEN` — from https://app.ynab.com/settings/developer
- `YNAB_BUDGET_ID` — the UUID from your YNAB budget URL

### 3. Gmail API setup (for email-based merchants)

Skip this section if you only run **`--merchants privacy`** with a valid **`PRIVACY_API_KEY`** (see below) — the CLI does not require Gmail OAuth for that path.

1. Go to https://console.cloud.google.com
2. Create a new project: **YNAB Enrichment**
3. Enable the **Gmail API**
4. Go to **OAuth consent screen** → External → fill in app name
5. Go to **Credentials** → Create OAuth 2.0 Client ID → **Desktop App**
6. Download the JSON → save as `config/gmail_credentials.json`
   - If the download saves as `config:gmail_credentials.json` (colon instead of slash), rename it:
     ```bash
     mv config/'config:gmail_credentials.json' config/gmail_credentials.json
     ```
7. Go back to **OAuth consent screen** → scroll to **Test users** → **Add users**
   - Add the Gmail address you want to authorize (the one with the receipts)
   - Without this step, Google will block the auth with "Access blocked: app has not completed verification"
8. Run `python src/main.py --auth` to complete the OAuth flow
9. A browser window will open → click **Advanced** → **Go to YNAB Enrichment (unsafe)** → allow read-only Gmail access
10. Token saved to `config/gmail_token.json` — do not commit this file

Scope required: `https://www.googleapis.com/auth/gmail.readonly`

> **Note:** macOS does not alias `python` by default. Always use `python3` outside the venv, or activate the venv first (`source .venv/bin/activate`) so `python` works.

### 4. Privacy.com API (optional but recommended for virtual-card charges)

Add your API key to `.env`:

```
PRIVACY_API_KEY=your_key_here
```

Use a real key from https://privacy.com/developer. When set, the tool fetches settled transactions from the Privacy.com API instead of parsing `support@privacy.com` emails. Placeholder values starting with `your_` are ignored (use a real key).

**Privacy-only test (no Gmail files):**

```bash
python src/main.py --dry-run --merchants privacy
DRY_RUN=false python src/main.py --merchants privacy
```

For a narrower run, set `LOOKBACK_DAYS=30` and optionally `AUTO_CATEGORIZE=false` (Step 4.5 otherwise categorizes all remaining blank-memo transactions by payee).

### 5. Run (dry run first)

```bash
# Preview what would be written — no changes made to YNAB
python src/main.py

# Write to YNAB for real
DRY_RUN=false python src/main.py
```

At startup, the CLI validates configured category IDs (`category_rules.yaml` + `category_overrides.yaml`) against the live YNAB budget. It fails fast only if **zero** configured IDs resolve.

### 6. Tests

From `portfolio/spend-clarity/` (project root for this app):

```bash
source .venv/bin/activate
PYTHONPATH=$(pwd) pytest tests/ -q
```

### 7. Scheduled run (launchd)

Install/update a nightly LaunchAgent (defaults to dry-run mode):

```bash
scripts/install_launchd_job.sh
```

Switch scheduler to live writes:

```bash
scripts/install_launchd_job.sh --live
```

Operational commands:

```bash
launchctl print gui/$(id -u)/com.chase.spend-clarity.enrich
launchctl kickstart -k gui/$(id -u)/com.chase.spend-clarity.enrich
launchctl bootout gui/$(id -u) "$HOME/Library/LaunchAgents/com.chase.spend-clarity.enrich.plist"
```

Print a plist without installing (for manual review/customization):

```bash
python src/main.py --print-launchd-plist > ~/Desktop/com.chase.spend-clarity.enrich.plist
```

## Configuration

Edit `config/category_rules.yaml` to map item keywords to YNAB category IDs.

Set `AUTO_CATEGORIZE=true` in `.env` to enable automatic category assignment (including Step 4.5 payee-based categorization for all blank-memo transactions).

## Output

- `output/enrichment_log.txt` — every match decision and write
- `output/unmatched_report.txt` — unmatched transactions with merchant-candidate context and closest-failure diagnostics

## Supported Merchants

| Merchant | Source |
|---|---|
| Amazon | Gmail (ship-confirm@amazon.com, digital-no-reply@amazon.com) |
| Audible | Gmail (no-reply@audible.com) |
| Apple | Gmail (no_reply@email.apple.com) |
| DoorDash | Gmail (no-reply@doordash.com) |
| Privacy.com | API (or Gmail fallback: support@privacy.com) |
| Netflix | Gmail (info@mailer.netflix.com) |
| Spotify | Gmail (no-reply@spotify.com) |
| Hulu | Gmail (no-reply@hulu.com) |
| Disney+ | Gmail (noreply@disneyplus.com) |
| Walmart / Target / Costco | Gmail (online order confirmations) |

## Docs and session start

- **`HANDOFF.md`** — current state for the next session  
- **`prompts/SESSION_START.md`** — paste into a new chat  
- **`CLAUDE.md`** — agent conventions  

Gmail Forge labels mail with **Receipt** so Spend Clarity can align queries; see `portfolio/gmail-forge/integrations/receipt-to-spend-clarity.md`.
