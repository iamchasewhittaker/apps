/**
 * Spend Radar — Subscriptions tab + menu + installable onOpen trigger
 *
 * This file owns:
 *   - onOpen()              — the Sheet menu
 *   - setupOnOpenTrigger()  — one-time installer (run once from editor)
 *   - createDedicatedSheet() — one-time Sheet factory (Phase C migration helper)
 *   - refreshSubscriptions() — aggregated recurring detector
 *   - debugSubscriptions()   — diagnostic log for empty Subscriptions tab
 *   - healthCheck()          — Script Properties + trigger status
 *
 * Per-receipt extraction + Receipts tab → receipts.gs
 * SENDER_RULES + heuristic fallback         → extraction.gs
 * Rules-based audit                          → audit.gs
 * refreshAll / refreshAllApps / openDashboard → triggers.gs
 * Shared utilities                           → helpers.gs
 *
 * Setup:
 *   1. Create a new Apps Script project at script.google.com
 *   2. Paste all 6 .gs files (or deploy via clasp — see DEPLOY-CLASP.md)
 *   3. Run createDedicatedSheet() once → copy the logged ID
 *   4. Script Properties → SHEET_ID = <id>, GMAIL_FORGE_WEB_APP_URL, GMAIL_FORGE_TRIGGER_TOKEN, DASHBOARD_URL
 *   5. Run setupOnOpenTrigger() once → authorize Gmail + Sheets + UrlFetch
 *   6. Open the Sheet → "Spend Radar" menu appears
 */

// ---------------------------------------------------------------------------
// Subscriptions tab shape
// ---------------------------------------------------------------------------

var SUBSCRIPTIONS_SHEET_NAME = 'Subscriptions';
var SUBSCRIPTIONS_HEADERS = [
  'Service', 'Category', 'Sender Domain', 'Sender Email', 'Last Amount',
  'Cadence', 'Last Charge', 'Est. Next Charge', 'Receipts (180d)', 'Status',
];

// ---------------------------------------------------------------------------
// Sheet menu — installable trigger (standalone scripts can't use simple triggers)
// ---------------------------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Spend Radar')
    .addItem('Refresh Subscriptions', 'refreshSubscriptions')
    .addItem('Refresh Receipts', 'refreshReceipts')
    .addItem('Refresh All', 'refreshAll')
    .addItem('Refresh All Apps', 'refreshAllApps')
    .addSeparator()
    .addItem('Audit Last Run', 'auditLastRun')
    .addSeparator()
    .addItem('Open Dashboard', 'openDashboard')
    .addItem('Debug (check Receipt label)', 'debugSubscriptions')
    .addToUi();
}

/**
 * Run ONCE from the Apps Script editor (Run > setupOnOpenTrigger).
 * Installs an onOpen trigger so the Sheet menu appears on load.
 */
function setupOnOpenTrigger() {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) {
    Logger.log('No SHEET_ID set — cannot install onOpen trigger');
    return;
  }
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onOpen') {
      Logger.log('onOpen trigger already exists — skipping');
      return;
    }
  }
  ScriptApp.newTrigger('onOpen').forSpreadsheet(sheetId).onOpen().create();
  Logger.log('Installed onOpen trigger for spreadsheet ' + sheetId);
}

// ---------------------------------------------------------------------------
// Phase C helper — create the dedicated Spend Radar Sheet
// ---------------------------------------------------------------------------

/**
 * Run ONCE from the editor. Creates a new Google Sheet titled "Spend Radar",
 * logs the ID and URL. Paste the ID into Script Properties as SHEET_ID, then
 * re-run setupOnOpenTrigger() to wire the menu to the new Sheet.
 */
function createDedicatedSheet() {
  var ss = SpreadsheetApp.create('Spend Radar');
  Logger.log('Created Sheet. ID: ' + ss.getId());
  Logger.log('URL: ' + ss.getUrl());
  Logger.log('Next: paste the ID into Script Properties as SHEET_ID, then re-run setupOnOpenTrigger()');
}

// ---------------------------------------------------------------------------
// Main — refresh the Subscriptions tab
// ---------------------------------------------------------------------------

/**
 * Reads label:Receipt emails from the last 180 days, groups by sender,
 * keeps senders with ≥2 receipts, and writes the "Subscriptions" tab.
 */
function refreshSubscriptions() {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) {
    Logger.log('No SHEET_ID set — cannot write Subscriptions tab');
    try { SpreadsheetApp.getUi().alert('SHEET_ID is not set in Script Properties.'); } catch (e) {}
    return 0;
  }

  var threads = GmailApp.search('label:Receipt newer_than:180d', 0, 500);
  var groups = {};

  for (var i = 0; i < threads.length; i++) {
    var msg = threads[i].getMessages()[0];
    var email = extractEmail_(msg.getFrom());
    var domain = extractDomain_(email);
    var receipt = {
      email: email,
      domain: domain,
      subject: msg.getSubject(),
      body: (msg.getPlainBody() || '').substring(0, 2000),
      date: msg.getDate(),
      msg: msg,
    };
    if (!groups[email]) groups[email] = [];
    groups[email].push(receipt);
  }

  var rows = [];
  var emails = Object.keys(groups);
  for (var e = 0; e < emails.length; e++) {
    var list = groups[emails[e]];
    if (list.length < 2) continue;
    list.sort(function (a, b) { return a.date - b.date; });
    rows.push(summarizeSubscription_(list));
  }

  // Active first (by last charge desc), then Lapsed. Status is column 9 (0-based).
  rows.sort(function (a, b) {
    var aActive = a[9] === 'Active' ? 0 : 1;
    var bActive = b[9] === 'Active' ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return b[6] - a[6];
  });

  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(SUBSCRIPTIONS_SHEET_NAME) || ss.insertSheet(SUBSCRIPTIONS_SHEET_NAME);
  sheet.clear();
  sheet.appendRow(SUBSCRIPTIONS_HEADERS);
  sheet.getRange(1, 1, 1, SUBSCRIPTIONS_HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, SUBSCRIPTIONS_HEADERS.length).setValues(rows);
  }

  // Append Monthly est. + Yearly est. summary rows (Active only)
  var monthly = 0;
  for (var r = 0; r < rows.length; r++) {
    if (rows[r][9] !== 'Active') continue;
    monthly += monthlyEquivalent_(rows[r][5], rows[r][4]);
  }
  var yearly = monthly * 12;
  var summaryStart = rows.length + 2;
  var summaryRows = [
    ['Monthly est.', '', '', '', formatDollar_(monthly), '', '', '', '', ''],
    ['Yearly est.',  '', '', '', formatDollar_(yearly),  '', '', '', '', ''],
  ];
  sheet.getRange(summaryStart, 1, 2, SUBSCRIPTIONS_HEADERS.length).setValues(summaryRows);
  sheet.getRange(summaryStart, 1, 2, SUBSCRIPTIONS_HEADERS.length).setFontWeight('bold');

  try { ss.toast('Refreshed ' + rows.length + ' subscriptions', 'Spend Radar', 5); } catch (e) {}
  Logger.log('Subscriptions refresh: ' + rows.length + ' rows, monthly ' + formatDollar_(monthly));
  return rows.length;
}

// ---------------------------------------------------------------------------
// Helpers — subscription summarization
// ---------------------------------------------------------------------------

function summarizeSubscription_(receipts) {
  var n = receipts.length;
  var last = receipts[n - 1];

  var dates = [];
  for (var i = 0; i < n; i++) dates.push(receipts[i].date);
  var cadenceDays = medianGapDays_(dates);
  var cadenceLabel = cadenceLabelForDays_(cadenceDays);

  // Use extraction.gs for consistent merchant/item/category/amount
  var extracted = extractReceipt_(last.msg);

  var nextEst = cadenceLabel.indexOf('Irregular') === 0
    ? ''
    : new Date(last.date.getTime() + cadenceDays * 24 * 60 * 60 * 1000);

  var ageDays = (new Date() - last.date) / (1000 * 60 * 60 * 24);
  var status = ageDays < 1.5 * cadenceDays ? 'Active' : 'Lapsed?';

  return [
    extracted.merchant || last.domain,
    extracted.category || 'Other',
    last.domain,
    last.email,
    extracted.amount,
    cadenceLabel,
    last.date,
    nextEst,
    n,
    status,
  ];
}

// ---------------------------------------------------------------------------
// Debug — run from editor to diagnose empty Subscriptions tab
// ---------------------------------------------------------------------------

function debugSubscriptions() {
  Logger.log('=== debugSubscriptions ===');

  var threads = GmailApp.search('label:Receipt newer_than:180d', 0, 500);
  Logger.log('Threads found (label:Receipt newer_than:180d): ' + threads.length);

  if (threads.length === 0) {
    var allReceipts = GmailApp.search('label:Receipt', 0, 10);
    Logger.log('Threads with label:Receipt (no date limit): ' + allReceipts.length);
    if (allReceipts.length === 0) {
      Logger.log('LIKELY CAUSE: No emails carry the Receipt label yet, or the label name is wrong.');
      Logger.log('Check Gmail — label must be exactly "Receipt" (capital R).');
    } else {
      var msg = allReceipts[0].getMessages()[0];
      Logger.log('Receipt label exists. Most recent email date: ' + msg.getDate());
      Logger.log('All Receipt emails are older than 180 days — try newer_than:400d.');
    }
    Logger.log('=== end ===');
    return;
  }

  var groups = {};
  for (var i = 0; i < threads.length; i++) {
    var msg = threads[i].getMessages()[0];
    var email = extractEmail_(msg.getFrom());
    if (!groups[email]) groups[email] = [];
    groups[email].push(msg.getSubject());
  }

  var emailKeys = Object.keys(groups);
  Logger.log('Unique senders: ' + emailKeys.length);

  var qualifying = 0;
  for (var e = 0; e < emailKeys.length; e++) {
    var count = groups[emailKeys[e]].length;
    var flag = count >= 2 ? ' *** QUALIFIES ***' : '';
    Logger.log(emailKeys[e] + ' — ' + count + ' receipt(s)' + flag);
    if (flag) {
      Logger.log('  Sample subject: ' + groups[emailKeys[e]][0]);
      qualifying++;
    }
  }

  Logger.log('Senders qualifying (>=2 receipts): ' + qualifying);
  Logger.log('=== end debugSubscriptions ===');
}

// ---------------------------------------------------------------------------
// Setup — health check
// ---------------------------------------------------------------------------

function healthCheck() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SHEET_ID');
  var gmailForgeUrl = props.getProperty('GMAIL_FORGE_WEB_APP_URL');
  var gmailForgeToken = props.getProperty('GMAIL_FORGE_TRIGGER_TOKEN');
  var dashboardUrl = props.getProperty('DASHBOARD_URL');

  Logger.log('=== Spend Radar — healthCheck ===');
  Logger.log('SHEET_ID: ' + (sheetId ? 'set' : 'MISSING — set this in Script Properties'));
  Logger.log('GMAIL_FORGE_WEB_APP_URL: ' + (gmailForgeUrl ? 'set' : 'missing (Refresh All Apps will skip Gmail Forge)'));
  Logger.log('GMAIL_FORGE_TRIGGER_TOKEN: ' + (gmailForgeToken ? 'set' : 'missing (Refresh All Apps will skip Gmail Forge)'));
  Logger.log('DASHBOARD_URL: ' + (dashboardUrl ? 'set' : 'missing (Open Dashboard will alert)'));

  if (sheetId) {
    try {
      SpreadsheetApp.openById(sheetId);
      Logger.log('Sheet opens OK');
    } catch (e) {
      Logger.log('Sheet FAILED to open: ' + e.message);
    }
  }
  var triggers = ScriptApp.getProjectTriggers();
  var onOpenCount = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onOpen') onOpenCount++;
  }
  Logger.log('onOpen triggers: ' + onOpenCount + ' (expected: 1 after setupOnOpenTrigger)');
  Logger.log('=== end healthCheck ===');
}
