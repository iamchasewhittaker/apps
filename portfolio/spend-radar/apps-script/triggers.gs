/**
 * Spend Radar — Cross-project orchestration
 *
 * refreshAll()        — both Spend Radar tabs (Subscriptions + Receipts)
 * refreshAllApps()    — Spend Radar + Gmail Forge autoSort() via tokenized web app
 * openDashboard()     — open the companion spend-radar-web dashboard
 *
 * Script Properties used:
 *   GMAIL_FORGE_WEB_APP_URL  — deployed doGet endpoint from Gmail Forge
 *   GMAIL_FORGE_TRIGGER_TOKEN — shared secret (UUID), must match TRIGGER_TOKEN in Gmail Forge
 *   DASHBOARD_URL           — spend-radar-web Vercel URL
 */

function refreshAll() {
  refreshSubscriptions();
  refreshReceipts();
}

function refreshAllApps() {
  refreshAll();

  var url = PropertiesService.getScriptProperties().getProperty('GMAIL_FORGE_WEB_APP_URL');
  var token = PropertiesService.getScriptProperties().getProperty('GMAIL_FORGE_TRIGGER_TOKEN');

  if (!url || !token) {
    try {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        'Spend Radar refreshed. Gmail Forge skipped — GMAIL_FORGE_* props not set.',
        'Spend Radar', 6
      );
    } catch (e) {}
    return;
  }

  try {
    var resp = UrlFetchApp.fetch(url + '?token=' + encodeURIComponent(token), {
      method: 'get',
      muteHttpExceptions: true,
    });
    var body = JSON.parse(resp.getContentText());
    var msg = body.ok
      ? 'Spend Radar + Gmail Forge refreshed.'
      : 'Spend Radar ok. Gmail Forge failed: ' + body.error;
    SpreadsheetApp.getActiveSpreadsheet().toast(msg, 'Spend Radar', 6);
  } catch (err) {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      'Spend Radar ok. Gmail Forge fetch threw: ' + err,
      'Spend Radar', 6
    );
  }
}

function openDashboard() {
  var url = PropertiesService.getScriptProperties().getProperty('DASHBOARD_URL');
  if (!url) {
    SpreadsheetApp.getUi().alert('Set DASHBOARD_URL in Script Properties first.');
    return;
  }
  var html = HtmlService.createHtmlOutput(
    '<script>window.open("' + url + '","_blank");google.script.host.close();</script>'
  ).setWidth(100).setHeight(50);
  SpreadsheetApp.getUi().showModalDialog(html, 'Opening dashboard…');
}
