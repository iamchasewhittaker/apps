# Gmail Forge — Session Starter: Wire Sort Button to Apply Labels

Read `CLAUDE.md` and `HANDOFF.md` first.

---

## Context

The Chrome extension is loaded and working. The Sort button lives in the right side of the tab bar and correctly classifies selected emails (RULES_ONLY mode uses keyword regex; GEMINI mode calls Gemini 2.0 Flash). However, it **never applies the label** — it just shows a toast and discards the results.

**Goal this session:** Make the Sort button actually label the selected emails in Gmail.

---

## What Exists

- `extension/src/content.js` — `sortSelectedEmails()` sends email data to background, receives `{ results }`, shows toast. Does NOT apply labels. The selected `tr` rows are in `rows[]` (has `row` DOM ref).
- `extension/src/background.js` — `handleClassify(emails)` classifies and returns `{ results: [{ sender, subject, label, source }] }`. Emails are passed as `{ sender, subject, snippet }` — **no message ID** currently.
- `apps-script/auto-sort.gs` — deployed web app; has `doGet(e)` for Spend Radar integration. Needs a `doPost(e)` handler for apply-label requests.
- Apps Script web app URL + trigger token are in Script Properties: `GMAIL_FORGE_WEB_APP_URL` and `GMAIL_FORGE_TRIGGER_TOKEN`.

---

## Recommended Approach

### Step 1 — Extract Gmail message IDs in content.js

In `sortSelectedEmails()`, when building `rows[]`, also grab the message ID from the row's DOM. Gmail stores it on the `tr` as `data-legacy-message-id` or on a child element with attribute `data-message-id`. Try both. Add `messageId` to each item in `rows[]` and pass it through to the `CLASSIFY` message.

### Step 2 — Pass message IDs through background.js

In `handleClassify(emails)`, keep `messageId` on each email object and include it in the result objects returned.

### Step 3 — Add doPost handler to auto-sort.gs

```javascript
function doPost(e) {
  var token = PropertiesService.getScriptProperties().getProperty('GMAIL_FORGE_TRIGGER_TOKEN');
  var payload = JSON.parse(e.postData.contents);
  if (payload.token !== token) return ContentService.createTextOutput('Unauthorized');

  var results = [];
  (payload.applications || []).forEach(function(item) {
    try {
      var msg = GmailApp.getUserMessageById(item.messageId);
      var label = GmailApp.getUserLabelByName(item.label);
      if (!label) label = GmailApp.createLabel(item.label);
      msg.getThread().addLabel(label);
      results.push({ messageId: item.messageId, label: item.label, ok: true });
    } catch(err) {
      results.push({ messageId: item.messageId, error: err.message });
    }
  });

  return ContentService.createTextOutput(JSON.stringify({ results: results }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy with `cd apps-script && npx clasp push --force`, then re-deploy as web app in script.google.com (Execute as: Me, Who has access: Anyone).

### Step 4 — Apply labels from content.js

After receiving classification results, POST to the web app:

```javascript
// In content.js, after receiving response.results:
chrome.storage.sync.get(['webAppUrl', 'triggerToken'], function(cfg) {
  if (!cfg.webAppUrl || !cfg.triggerToken) {
    showToast('Sort: web app URL not set in extension settings');
    return;
  }
  var applications = response.results
    .filter(function(r) { return r.label && r.messageId; })
    .map(function(r) { return { messageId: r.messageId, label: r.label }; });

  fetch(cfg.webAppUrl, {
    method: 'POST',
    body: JSON.stringify({ token: cfg.triggerToken, applications: applications })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    var ok = (data.results || []).filter(function(r) { return r.ok; }).length;
    showToast('Labeled ' + ok + ' email(s)');
  })
  .catch(function(err) { showToast('Apply failed: ' + err.message); });
});
```

Add `webAppUrl` and `triggerToken` fields to the extension popup settings so they can be configured without hardcoding.

### Step 5 — Add to manifest host_permissions

The extension needs to POST to the Apps Script web app URL. Add `https://script.google.com/*` and `https://script.googleusercontent.com/*` to `host_permissions` in `manifest.json`.

### Step 6 — Test

1. Reload extension at `chrome://extensions`
2. Open extension popup → enter web app URL + trigger token
3. Select 2–3 emails in Gmail inbox → click Sort
4. Verify toast says "Labeled X email(s)"
5. Check those emails now have the correct Gmail label applied

---

## After Sort is wired up

See `HANDOFF.md` "Remaining / Next Steps" for the other items:
- Off-filesystem renames (Apps Script console, Spend Radar Script Properties, Asana) — manual, ~5 min
- Subscriptions backfill — one click in the Google Sheet
- Gemini enable — when billing is set up
