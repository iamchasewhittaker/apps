# Deploy with clasp (CLI)

One-way sync from this folder to your Google Apps Script project.

## Prerequisites

- Node 18+
- A Google account with Apps Script access

## First-time setup

```bash
cd apps-script
npm install
npx clasp login
```

Create a new script project (or link an existing one):

```bash
npx clasp create --type standalone --title "Gmail Forge Auto-Sort" --rootDir .
```

That writes `.clasp.json` with your `scriptId`. **Do not commit `.clasp.json`** if the repo is shared (it identifies your project).

If you already created the project in the browser, use **Project Settings → Script ID** and create `.clasp.json` manually from [.clasp.json.example](.clasp.json.example).

## Push code

```bash
npm run deploy
```

Then in [script.google.com](https://script.google.com): set Script Properties (`CLASSIFIER_MODE`, `GEMINI_API_KEY`, optional `SHEET_ID`, optional `NEWSLETTER_TO_ALIASES`), run `setupTrigger()`, then `healthCheck` and `testRun`.

## After editing `.gs` files locally

```bash
npm run deploy
```

Re-run `setupTrigger()` only if you deleted the trigger in the UI.

## Web app deployment (for Spend Radar's "Refresh All Apps" button)

`auto-sort.gs` exposes a tokenized `doGet(e)` endpoint so Spend Radar's Apps Script can trigger `autoSort()` from its own menu. One-time setup:

1. `npm run deploy` (so the latest `doGet` is pushed).
2. In script.google.com → **Deploy → New deployment → Web app**
   - Description: `Gmail Forge — autoSort trigger`
   - Execute as: **Me**
   - Who has access: **Anyone** (token protects it)
   - Click **Deploy** → copy the Web app URL (ends with `/exec`).
3. Set Script Property `TRIGGER_TOKEN` to a new UUID (generate one locally — e.g. `uuidgen` on macOS).
4. Paste the matching UUID into **Spend Radar's** Script Properties as `GMAIL_FORGE_TRIGGER_TOKEN`, and paste the Web app URL as `GMAIL_FORGE_WEB_APP_URL`.
5. Spend Radar's `Refresh All Apps` menu item will now fan out.

> **Security:** the token is a shared secret. Never commit. Rotate by regenerating the UUID and updating both Script Properties simultaneously.
