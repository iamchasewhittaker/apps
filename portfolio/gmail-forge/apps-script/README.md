# Gmail Forge — Apps Script Auto-Sorter

Automatically classifies and labels Gmail emails that slip past the 69 static XML filters. Runs every 5 minutes inside your Google account — no installs, no extensions, no servers.

## How It Works

1. **Layer 1:** Your existing 69 Gmail XML filters handle known senders instantly (server-side)
2. **Layer 2:** This Apps Script catches everything else on a 5-minute timer
3. **Layer 3:** Unknown senders are classified by Gemini (or skipped in Rules-only mode) and logged to a Google Sheet for review

### Classification flow

```
New email arrives
  → Gmail filter matches? → Label + archive (instant)
  → No filter? → Apps Script picks it up within 5 min
    → Known domain/address in rules.gs? → Label + archive
    → Unknown sender? → Gemini classifies (or Rules-only skips) → Label + archive + log to Sheet
    → Job search sender? → Skip entirely (stays in inbox)
```

## Setup (10 minutes)

### Option A — clasp CLI (recommended)

From this directory:

```bash
npm install
npx clasp login
npx clasp create --type standalone --title "Gmail Forge Auto-Sort" --rootDir .
npm run deploy
```

See [DEPLOY-CLASP.md](DEPLOY-CLASP.md) for linking an existing browser project.

### Option B — Browser editor (paste)

### 1. Create the Apps Script project

1. Go to [script.google.com](https://script.google.com)
2. Click **New project**
3. Name it "Gmail Forge Auto-Sort"

### 2. Add the code

1. In the editor, rename the default `Code.gs` to `auto-sort.gs`
2. Paste the contents of `auto-sort.gs` from this folder
3. Click **+** next to Files → **Script** → name it `rules` (creates `rules.gs`)
4. Paste the contents of `rules.gs` from this folder

### 3. Set Script Properties

1. Click the **gear icon** (Project Settings) in the left sidebar
2. Scroll to **Script Properties** → click **Add script property**
3. Add these properties:

| Property | Value | Required |
|----------|-------|----------|
| `CLASSIFIER_MODE` | `GEMINI` or `RULES_ONLY` | No (defaults to `GEMINI`) |
| `GEMINI_API_KEY` | Your Gemini API key | Only for `GEMINI` mode |
| `SHEET_ID` | Google Sheet ID for new-sender logging | No (falls back to Apps Script log) |
| `NEWSLETTER_TO_ALIASES` | Comma-separated **To:** addresses (e.g. iCloud Hide My Email) for Substack, Daily Crossword, etc. | No (merged into Newsletter matching) |

**To get a Sheet ID:** Create a new Google Sheet, copy the long string from the URL between `/d/` and `/edit`.

**Example `NEWSLETTER_TO_ALIASES`:** `newsletters.xxxx@icloud.com,crossword.yyyy@icloud.com` (no secrets in git — set only in Script Properties).

### 4. Create the trigger

1. In the Apps Script editor, select `setupTrigger` from the function dropdown
2. Click **Run**
3. Authorize when prompted (needs Gmail + Sheets access)
4. The 5-minute trigger is now active

### 5. Test it

1. Select `testRun` from the function dropdown
2. Click **Run**
3. Check **Executions** (left sidebar) to see logs

### Health check (one-click setup verification)

1. Select `healthCheck` from the function dropdown
2. Click **Run**
3. Open **Executions** → latest run → **View** logs

You should see: resolved `CLASSIFIER_MODE`, whether `GEMINI_API_KEY` is set (character count only — never the key itself), whether `SHEET_ID` is set, whether `NEWSLETTER_TO_ALIASES` is set (entry count only), how many `autoSort` triggers exist (expect `1`), and whether the spreadsheet opens (if `SHEET_ID` is set). No network call to Gemini is made.

## iCloud / Hide My Email (Substack, Daily Crossword)

Add **Script Property** `NEWSLETTER_TO_ALIASES` with comma-separated recipient addresses. They are merged at runtime with Newsletter rules (see `getRulesForMatching_()` in `auto-sort.gs`). `healthCheck` logs how many entries are set (not the raw values).

## New Sender Log (Google Sheet)

When classification runs, it logs a row to the "New Senders" sheet:

| Date | Email | Domain | From Header | Subject | Label | Source |
|------|-------|--------|-------------|---------|-------|--------|
| 2026-04-14 | promo@newbrand.com | newbrand.com | New Brand <promo@newbrand.com> | Spring Sale | Marketing | GEMINI |

**Weekly review:** Check this sheet, confirm the AI got it right, and optionally promote frequently-seen senders into `rules.gs` to skip AI calls in the future.

## Costs

- **Apps Script:** Free (Google's infrastructure)
- **Gemini API:** low-cost usage for short classification prompts (check current Google AI Studio pricing)
- **Rules-only mode:** $0 API cost
- **Gmail quota:** 20,000 operations/day for consumer accounts (more than enough)

## Updating Rules

When you add a new sender to `gmail-filters.xml`, also add the domain or address to `rules.gs` so the Apps Script layer stays in sync. This isn't strictly required (the XML filter will catch it first), but keeps the rules file accurate for reference.

## Troubleshooting

- **"No GEMINI_API_KEY set"** in logs: either add the key or set `CLASSIFIER_MODE=RULES_ONLY`
- **"Gemini returned invalid label"**: model output didn't map to one of the allowed labels, so message remains in inbox
- **Emails not getting sorted**: Check that the trigger is active (Triggers page in Apps Script). Run `testRun` manually to check for errors
- **Sheets logging not working**: Verify the SHEET_ID is correct and the Sheet is accessible to your Google account
