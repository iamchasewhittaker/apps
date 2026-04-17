/**
 * Spend Radar — Rules-based Audit
 *
 * auditLastRun() scans the Subscriptions + Receipts tabs, flags rows via
 * deterministic rules, shades flagged rows yellow in their home tabs,
 * and writes the Audit tab (worklist for growing SENDER_RULES).
 */

var AUDIT_SHEET_NAME = 'Audit';
var AUDIT_HEADERS = [
  'Timestamp', 'Source Tab', 'Row Ref', 'Merchant', 'Amount', 'Flags', 'Gmail Link',
];

var AUDIT_HIGHLIGHT = '#fff8db';
var STALE_DAYS = 180;
var LARGE_CHARGE = 500;

var SYSTEM_SENDER_RE = /(noreply|no-reply|no_reply|mailer-daemon|donotreply|automated)/i;

function auditLastRun() {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) {
    Logger.log('No SHEET_ID set — cannot audit');
    try { SpreadsheetApp.getUi().alert('SHEET_ID is not set in Script Properties.'); } catch (e) {}
    return;
  }

  var ss = SpreadsheetApp.openById(sheetId);
  var timestamp = new Date();
  var auditRows = [];
  var totalScanned = 0;

  // --- Receipts tab ---
  var receiptsSheet = ss.getSheetByName(RECEIPTS_SHEET_NAME);
  if (receiptsSheet && receiptsSheet.getLastRow() > 1) {
    var rData = receiptsSheet.getRange(2, 1, receiptsSheet.getLastRow() - 1, RECEIPTS_HEADERS.length).getValues();
    // Clear prior shading on the data range
    receiptsSheet.getRange(2, 1, rData.length, RECEIPTS_HEADERS.length).setBackground(null);

    for (var i = 0; i < rData.length; i++) {
      totalScanned++;
      var row = rData[i];
      // Columns: Date(0), Merchant(1), Item(2), Amount(3), Category(4), Sender(5), Source(6), GmailLink(7)
      var flags = [];
      var amountNum = parseDollarAmount_(row[3]);

      if (!row[3] || amountNum === 0) flags.push('missing amount');
      if ((!row[2] || String(row[2]).trim() === '') && row[6] === 'fallback') flags.push('unknown-sender needs a rule');
      if (String(row[1] || '').match(SYSTEM_SENDER_RE) || String(row[5] || '').match(SYSTEM_SENDER_RE)) {
        flags.push('system sender — not a real receipt');
      }
      if (amountNum > LARGE_CHARGE) flags.push('large charge — verify');

      if (flags.length > 0) {
        receiptsSheet.getRange(i + 2, 1, 1, RECEIPTS_HEADERS.length).setBackground(AUDIT_HIGHLIGHT);
        auditRows.push([
          timestamp,
          RECEIPTS_SHEET_NAME,
          'Row ' + (i + 2),
          row[1],
          row[3],
          flags.join('; '),
          row[7] || '',
        ]);
      }
    }
  }

  // --- Subscriptions tab ---
  var subsSheet = ss.getSheetByName(SUBSCRIPTIONS_SHEET_NAME);
  if (subsSheet && subsSheet.getLastRow() > 1) {
    var lastRow = subsSheet.getLastRow();
    // Skip any trailing summary rows ("Monthly est." / "Yearly est.") when scanning
    // We detect by checking column A for known labels.
    var sData = subsSheet.getRange(2, 1, lastRow - 1, SUBSCRIPTIONS_HEADERS.length).getValues();
    // Clear shading on data rows only (not on the summary rows, which we repaint below if needed)
    subsSheet.getRange(2, 1, sData.length, SUBSCRIPTIONS_HEADERS.length).setBackground(null);

    for (var s = 0; s < sData.length; s++) {
      var sub = sData[s];
      // Columns: Service(0), Category(1), Sender Domain(2), Sender Email(3), Last Amount(4),
      //          Cadence(5), Last Charge(6), Est. Next Charge(7), Receipts (180d)(8), Status(9)
      var label = String(sub[0] || '');
      if (label === 'Monthly est.' || label === 'Yearly est.' || label === '') continue;
      totalScanned++;
      var flags = [];
      var amountNum = parseDollarAmount_(sub[4]);
      var domain = String(sub[2] || '');
      var receiptCount = Number(sub[8] || 0);
      var status = String(sub[9] || '');
      var lastCharge = sub[6];

      if (!sub[4] || amountNum === 0) flags.push('missing amount');
      if (!findSenderRule_(domain) && receiptCount >= 2) flags.push('recurring unknown — add a rule');
      if (String(sub[3] || '').match(SYSTEM_SENDER_RE)) flags.push('system sender — not a real receipt');
      if (amountNum > LARGE_CHARGE) flags.push('large charge — verify');
      if (status === 'Active' && lastCharge instanceof Date) {
        var ageDays = (new Date() - lastCharge) / (1000 * 60 * 60 * 24);
        if (ageDays > STALE_DAYS) flags.push('stale subscription');
      }

      if (flags.length > 0) {
        subsSheet.getRange(s + 2, 1, 1, SUBSCRIPTIONS_HEADERS.length).setBackground(AUDIT_HIGHLIGHT);
        auditRows.push([
          timestamp,
          SUBSCRIPTIONS_SHEET_NAME,
          'Row ' + (s + 2),
          sub[0],
          sub[4],
          flags.join('; '),
          '',
        ]);
      }
    }
  }

  // --- Write Audit tab ---
  var auditSheet = ss.getSheetByName(AUDIT_SHEET_NAME) || ss.insertSheet(AUDIT_SHEET_NAME);
  auditSheet.clear();
  auditSheet.appendRow(AUDIT_HEADERS);
  auditSheet.getRange(1, 1, 1, AUDIT_HEADERS.length).setFontWeight('bold');
  auditSheet.setFrozenRows(1);

  if (auditRows.length > 0) {
    auditSheet.getRange(2, 1, auditRows.length, AUDIT_HEADERS.length).setValues(auditRows);
  }

  // Footer summary
  var footerRow = auditRows.length + 2;
  auditSheet.getRange(footerRow, 1).setValue(
    'Audited ' + totalScanned + ' rows | ' + auditRows.length + ' flagged | last run: ' + timestamp
  );
  auditSheet.getRange(footerRow, 1).setFontStyle('italic');

  try {
    ss.toast('Audited ' + totalScanned + ' rows — ' + auditRows.length + ' flagged', 'Spend Radar', 6);
  } catch (e) {}
  Logger.log('Audit: scanned ' + totalScanned + ' rows, flagged ' + auditRows.length);
}
