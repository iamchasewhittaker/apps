/**
 * Spend Radar — Receipts tab
 *
 * refreshReceipts() reads label:Receipt (last 180d), extracts per-receipt
 * rows via extraction.gs, and writes the "Receipts" tab.
 */

var RECEIPTS_SHEET_NAME = 'Receipts';
var RECEIPTS_HEADERS = [
  'Date', 'Merchant', 'Item', 'Amount', 'Category',
  'Sender Email', 'Source', 'Gmail Link',
];

function refreshReceipts() {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) {
    Logger.log('No SHEET_ID set — cannot write Receipts tab');
    try { SpreadsheetApp.getUi().alert('SHEET_ID is not set in Script Properties.'); } catch (e) {}
    return 0;
  }

  var threads = GmailApp.search('label:Receipt newer_than:180d', 0, 500);
  var rows = [];

  for (var i = 0; i < threads.length; i++) {
    var msg = threads[i].getMessages()[0];
    var r = extractReceipt_(msg);
    var email = extractEmail_(msg.getFrom());
    rows.push([
      msg.getDate(),
      r.merchant,
      r.item,
      r.amount,
      r.category,
      email,
      r.source,
      gmailThreadLink_(threads[i]),
    ]);
  }

  // Sort by Date desc
  rows.sort(function (a, b) { return b[0] - a[0]; });

  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheetByName(RECEIPTS_SHEET_NAME) || ss.insertSheet(RECEIPTS_SHEET_NAME);
  sheet.clear();
  sheet.appendRow(RECEIPTS_HEADERS);
  sheet.getRange(1, 1, 1, RECEIPTS_HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, RECEIPTS_HEADERS.length).setValues(rows);
  }

  try { ss.toast('Refreshed ' + rows.length + ' receipts', 'Spend Radar', 5); } catch (e) {}
  Logger.log('Receipts refresh: ' + rows.length + ' rows written');
  return rows.length;
}
