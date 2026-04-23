/**
 * Spend Radar — Triggers and orchestration
 *
 * refreshAll()      — both Spend Radar tabs (Subscriptions + Receipts)
 * openDashboard()   — open the companion spend-radar-web dashboard
 *
 * Script Properties used:
 *   DASHBOARD_URL  — spend-radar-web Vercel URL
 */

function refreshAll() {
  refreshSubscriptions();
  refreshReceipts();
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Spend Radar refreshed.', 'Spend Radar', 4);
  } catch (e) {}
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
