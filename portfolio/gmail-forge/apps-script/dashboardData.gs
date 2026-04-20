/**
 * Gmail Forge — Dashboard (Apps Script Web App view)
 *
 * Serves a single HTML page showing live filtering activity:
 *   - Per-label thread counts for today / 7-day / 30-day windows
 *   - "New Senders" activity (today count + recent events)
 *   - "Review Queue" size
 *   - Trigger + classifier health
 *
 * Entry point: renderDashboard_() — called from doGet() in auto-sort.gs when
 * the request includes ?view=dashboard&token=<TRIGGER_TOKEN>.
 */

var DASHBOARD_SEARCH_CAP = 500;

function renderDashboard_() {
  var data = getDashboardData_();
  var template = HtmlService.createTemplateFromFile('dashboard');
  template.payload = JSON.stringify(data);
  return template
    .evaluate()
    .setTitle('Gmail Forge — Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getDashboardData_() {
  return {
    generatedAt: new Date().toISOString(),
    timezone: Session.getScriptTimeZone(),
    labelCounts: getLabelCounts_(),
    autoSortToday: getAutoSortTodayCount_(),
    reviewQueue: getReviewQueueInfo_(),
    recentActivity: getRecentActivity_(10),
    health: getHealthInfo_(),
    searchCap: DASHBOARD_SEARCH_CAP,
  };
}

function getLabelCounts_() {
  var today = dateQueryNDaysAgo_(0);
  var sevenDaysAgo = dateQueryNDaysAgo_(7);
  var thirtyDaysAgo = dateQueryNDaysAgo_(30);

  var rows = [];
  for (var i = 0; i < VALID_LABELS.length; i++) {
    var name = VALID_LABELS[i];
    var escaped = 'label:' + name.replace(/ /g, '-');
    rows.push({
      label: name,
      today: countSearch_(escaped + ' after:' + today),
      sevenDay: countSearch_(escaped + ' after:' + sevenDaysAgo),
      thirtyDay: countSearch_(escaped + ' after:' + thirtyDaysAgo),
    });
  }
  return rows;
}

function countSearch_(query) {
  var threads = GmailApp.search(query, 0, DASHBOARD_SEARCH_CAP);
  var count = threads.length;
  return {
    count: count,
    capped: count >= DASHBOARD_SEARCH_CAP,
  };
}

function dateQueryNDaysAgo_(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  var y = d.getFullYear();
  var m = ('0' + (d.getMonth() + 1)).slice(-2);
  var day = ('0' + d.getDate()).slice(-2);
  return y + '/' + m + '/' + day;
}

function getAutoSortTodayCount_() {
  var sheet = openSheetTab_('New Senders');
  if (!sheet) return null;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0;

  var timestamps = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  var count = 0;
  for (var i = 0; i < timestamps.length; i++) {
    var ts = timestamps[i][0];
    if (ts instanceof Date && ts >= todayStart) count++;
  }
  return count;
}

function getRecentActivity_(n) {
  var sheet = openSheetTab_('New Senders');
  if (!sheet) return [];

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var numRows = Math.min(n, lastRow - 1);
  var startRow = lastRow - numRows + 1;
  // Columns: Date, Email, Domain, From Header, Subject, Label, Source
  var values = sheet.getRange(startRow, 1, numRows, 7).getValues();

  var out = [];
  for (var i = values.length - 1; i >= 0; i--) {
    var r = values[i];
    out.push({
      when: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      email: String(r[1] || ''),
      subject: String(r[4] || ''),
      label: String(r[5] || ''),
      source: String(r[6] || ''),
    });
  }
  return out;
}

function getReviewQueueInfo_() {
  var sheet = openSheetTab_('Review Queue');
  if (!sheet) return { count: null, available: false };

  var lastRow = sheet.getLastRow();
  return {
    count: Math.max(0, lastRow - 1),
    available: true,
  };
}

function getHealthInfo_() {
  var triggers = ScriptApp.getProjectTriggers();
  var autoSortTriggers = 0;
  var lastRun = null;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'autoSort') {
      autoSortTriggers++;
    }
  }

  var props = PropertiesService.getScriptProperties();
  return {
    classifierMode: getClassifierMode_(),
    triggerCount: autoSortTriggers,
    triggerHealthy: autoSortTriggers === 1,
    filterCount: 69,
    sheetConnected: !!props.getProperty('SHEET_ID'),
    newsletterAliasesSet: !!props.getProperty('NEWSLETTER_TO_ALIASES'),
    geminiKeyPresent: !!props.getProperty('GEMINI_API_KEY'),
  };
}

function openSheetTab_(tabName) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) return null;
  try {
    var ss = SpreadsheetApp.openById(sheetId);
    return ss.getSheetByName(tabName);
  } catch (e) {
    Logger.log('Dashboard: failed to open tab "' + tabName + '": ' + e.message);
    return null;
  }
}
