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
npx clasp create --type standalone --title "Inbox Zero Auto-Sort" --rootDir .
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
