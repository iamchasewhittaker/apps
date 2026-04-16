/**
 * Spend Radar — Subscriptions Engine
 *
 * Scans Gmail label:Receipt emails (last 180 days), detects recurring senders,
 * and writes a "Subscriptions" tab to a Google Sheet.
 *
 * Setup:
 *   1. Create a new Apps Script project at script.google.com
 *   2. Paste this file into the project (or deploy via clasp)
 *   3. Set Script Properties (Settings > Script Properties):
 *      - SHEET_ID: Google Sheet ID (same sheet as Inbox Zero, or its own)
 *   4. Run setupOnOpenTrigger() once to wire up the Sheet menu
 *   5. Open the Sheet — click "Spend Radar → Refresh Subscriptions"
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

var AMOUNT_RE = /\$\s?([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]{2}))/;

// Pretty service names for known Receipt senders. Domain matched with indexOf
// so subdomain variants (e.g. mail.anthropic.com → Anthropic) work.
var DOMAIN_TO_SERVICE = {
  'spotify.com': 'Spotify',
  'anthropic.com': 'Anthropic',
  'apple.com': 'Apple',
  'paypal.com': 'PayPal',
  'venmo.com': 'Venmo',
  'privacy.com': 'Privacy.com',
  'citi.com': 'Citi',
  'safeco.com': 'Safeco',
  'costco.com': 'Costco',
  'target.com': 'Target',
  'uber.com': 'Uber',
  'doordash.com': 'DoorDash',
  'chewy.com': 'Chewy',
  'nike.com': 'Nike',
  'google.com': 'Google',
  'rockymountainpower.net': 'Rocky Mountain Power',
  'domenergyuteb.com': 'Enbridge Gas',
  'fastel.com': 'FASTEL',
};

// ---------------------------------------------------------------------------
// Sheet menu — installable trigger (standalone scripts can't use simple triggers)
// ---------------------------------------------------------------------------

/**
 * Adds the "Spend Radar" menu to the Sheet.
 * Fired by an installable onOpen trigger — run setupOnOpenTrigger() once to install.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Spend Radar')
    .addItem('Refresh Subscriptions', 'refreshSubscriptions')
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

  ScriptApp.newTrigger('onOpen')
    .forSpreadsheet(sheetId)
    .onOpen()
    .create();

  Logger.log('Installed onOpen trigger for spreadsheet ' + sheetId);
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
    return;
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
      body: msg.getPlainBody().substring(0, 2000),
      date: msg.getDate(),
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

  // Active first (by last charge desc), then Lapsed
  rows.sort(function (a, b) {
    var aActive = a[8] === 'Active' ? 0 : 1;
    var bActive = b[8] === 'Active' ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return b[5] - a[5];
  });

  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName('Subscriptions') || ss.insertSheet('Subscriptions');
  sheet.clear();
  sheet.appendRow([
    'Service', 'Sender Domain', 'Sender Email', 'Last Amount',
    'Cadence', 'Last Charge', 'Est. Next Charge', 'Receipts (180d)', 'Status',
  ]);
  sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  sheet.setFrozenRows(1);

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 9).setValues(rows);
  }

  try { ss.toast('Refreshed ' + rows.length + ' subscriptions', 'Spend Radar', 5); } catch (e) {}
  Logger.log('Subscriptions refresh: ' + rows.length + ' rows written');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function summarizeSubscription_(receipts) {
  var n = receipts.length;
  var last = receipts[n - 1];

  var gaps = [];
  for (var i = 1; i < n; i++) {
    gaps.push((receipts[i].date - receipts[i - 1].date) / (1000 * 60 * 60 * 24));
  }
  gaps.sort(function (a, b) { return a - b; });
  var cadenceDays = gaps.length % 2 === 1
    ? gaps[(gaps.length - 1) / 2]
    : (gaps[gaps.length / 2 - 1] + gaps[gaps.length / 2]) / 2;

  var cadenceLabel;
  if (cadenceDays >= 5 && cadenceDays <= 10) cadenceLabel = 'Weekly';
  else if (cadenceDays >= 25 && cadenceDays <= 35) cadenceLabel = 'Monthly';
  else if (cadenceDays >= 80 && cadenceDays <= 100) cadenceLabel = 'Quarterly';
  else if (cadenceDays >= 340 && cadenceDays <= 400) cadenceLabel = 'Yearly';
  else cadenceLabel = 'Irregular (~' + Math.round(cadenceDays) + 'd)';

  var amount = extractAmount_(last.subject, last.body);
  var nextEst = cadenceLabel.indexOf('Irregular') === 0
    ? ''
    : new Date(last.date.getTime() + cadenceDays * 24 * 60 * 60 * 1000);

  var ageDays = (new Date() - last.date) / (1000 * 60 * 60 * 24);
  var status = ageDays < 1.5 * cadenceDays ? 'Active' : 'Lapsed?';

  return [
    serviceNameForDomain_(last.domain),
    last.domain,
    last.email,
    amount,
    cadenceLabel,
    last.date,
    nextEst,
    n,
    status,
  ];
}

function serviceNameForDomain_(domain) {
  var keys = Object.keys(DOMAIN_TO_SERVICE);
  for (var i = 0; i < keys.length; i++) {
    if (domain.indexOf(keys[i]) !== -1) return DOMAIN_TO_SERVICE[keys[i]];
  }
  var root = domain.split('.').slice(-2)[0] || domain;
  return root.charAt(0).toUpperCase() + root.slice(1);
}

function extractAmount_(subject, body) {
  var subjectMatch = subject.match(AMOUNT_RE);
  if (subjectMatch) return '$' + subjectMatch[1];
  var bodyMatch = body.match(AMOUNT_RE);
  if (bodyMatch) return '$' + bodyMatch[1];
  return '';
}

function extractEmail_(fromHeader) {
  var match = fromHeader.match(/<(.+?)>/);
  return match ? match[1].toLowerCase() : fromHeader.toLowerCase().trim();
}

function extractDomain_(email) {
  var parts = email.split('@');
  return parts.length > 1 ? parts[1] : '';
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
      Logger.log('All Receipt emails are older than 180 days — try wider_than:400d.');
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
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  Logger.log('=== Spend Radar — healthCheck ===');
  Logger.log('SHEET_ID: ' + (sheetId ? 'set' : 'MISSING — set this in Script Properties'));
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
