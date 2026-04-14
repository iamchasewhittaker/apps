# Inbox Zero — Chrome Extension

A Chrome extension that adds a label-based tab bar to Gmail and an AI-powered "Sort" button for classifying emails on the fly.

## Features

- **Label tab bar** across the top of Gmail: Inbox, To Reply, Newsletter, Calendar, Receipt, Notification, Marketing, Cold Email, Security, Personal
- Click any tab to filter your view to that label
- **Sort button** in the Gmail toolbar: select emails, click Sort, and AI classifies them
- **Settings popup** to configure visible tabs, classifier mode (`GEMINI` or `RULES_ONLY`), and Gemini API key
- Dark mode support (follows Gmail's theme)
- Unsorted email count badge

## Install (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right)
3. Click **Load unpacked**
4. Select the `extension/` folder (this directory)
5. The extension icon appears in your toolbar

## Configure

1. Click the Inbox Zero extension icon in the Chrome toolbar
2. Choose classifier mode:
   - `GEMINI` for AI labels
   - `RULES_ONLY` for zero-API heuristic fallback
3. Enter Gemini API key (only needed for `GEMINI`)
4. Check/uncheck which label tabs you want visible
5. Click **Save Settings**

## How It Works

### Tab Bar

The tab bar renders below Gmail's header. Each tab is a shortcut to a Gmail search query:
- "Newsletter" tab → `label:Newsletter`
- "Inbox" tab → `in:inbox`

Clicking a tab changes the URL hash, which Gmail interprets as a search. The active tab highlights automatically based on the current URL.

### Sort Button

When you select one or more emails in the inbox and click the Sort button:
1. The extension extracts the sender, subject, and snippet from each selected row
2. Sends them to the background service worker
3. The service worker classifies via Gemini (or rules-only fallback)
4. Results are displayed via a toast notification

**Note:** The Sort button classifies emails through AI but does not yet apply Gmail labels directly (that requires Gmail API OAuth). For now, it shows you the classification so you can apply labels manually or let the Apps Script auto-sorter handle it on the next 5-minute cycle.

## File Structure

```
extension/
  manifest.json         — Chrome MV3 manifest
  icons/                — Extension icons (SVG placeholders)
  scripts/
    generate-icons.js   — Script to regenerate icon placeholders
  src/
    content.js          — Injected into Gmail: tab bar, sort button, toast UI
    background.js       — Service worker: handles AI classification requests
    inboxsdk.js         — Placeholder shim (see upgrade notes below)
    styles.css          — All extension styles (light + dark mode)
    popup.html          — Settings popup markup
    popup.js            — Settings popup logic
```

## Upgrading to InboxSDK

The initial release uses direct DOM manipulation for simplicity. For a more robust Gmail integration (stable across Gmail updates), you can upgrade to InboxSDK:

1. Register for a free App ID at [register.inboxsdk.com](https://register.inboxsdk.com)
2. `npm install @inboxsdk/core`
3. Set up a bundler (webpack or rollup)
4. Replace `content.js` with InboxSDK API calls
5. InboxSDK handles Gmail DOM changes, dark mode, and SPA navigation automatically

## Costs

- **Extension:** Free (runs locally in Chrome)
- **Gemini (Sort button):** low-cost short classification calls
- **Rules-only mode:** no API cost
- **No Chrome Web Store fees** unless you want to publish publicly ($5 one-time registration)

## Icons

The current icons are SVG placeholders (blue square with "0"). To replace with real icons:

1. Create 16x16, 48x48, and 128x128 PNG files
2. Save them as `icons/icon16.png`, `icons/icon48.png`, `icons/icon128.png`
3. Update `manifest.json` to reference `.png` instead of `.svg`
