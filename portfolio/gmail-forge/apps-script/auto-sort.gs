/**
 * Gmail Forge — Auto-Sort Engine
 *
 * Runs on a time-driven trigger (every 5 min). Finds unlabeled inbox emails,
 * classifies them via local rules or AI, applies the correct Gmail label,
 * and optionally archives. Logs new-sender classifications to a Google Sheet.
 *
 * Setup:
 *   1. Create a new Apps Script project at script.google.com
 *   2. Paste this file + rules.gs into the project
 *   3. Set Script Properties (Settings > Script Properties):
 *      - CLASSIFIER_MODE: GEMINI (default) or RULES_ONLY
 *      - GEMINI_API_KEY: your Gemini API key (required only for GEMINI mode)
 *      - SHEET_ID: (optional) Google Sheet ID for new-sender logging
 *      - NEWSLETTER_TO_ALIASES: (optional) comma-separated recipient emails for iCloud Hide My
 *        Substack / Daily Crossword (etc.) — merged into Newsletter toAliases at runtime
 *   4. Run setupTrigger() once to create the 5-minute timer
 *   5. Authorize when prompted (Gmail + Sheets access)
 *   6. Run healthCheck() once to verify mode, keys (presence only), trigger, and sheet access
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

var VALID_LABELS = [
  'Newsletter', 'Notification', 'Receipt', 'Calendar',
  'Marketing', 'Cold Email', 'Security', 'Personal', 'FYI',
];

var BATCH_SIZE = 20;
var DEFAULT_CLASSIFIER_MODE = 'GEMINI';

// ---------------------------------------------------------------------------
// Entry point — called by the time-driven trigger
// ---------------------------------------------------------------------------

function autoSort() {
  var threads = findUnlabeledInboxThreads_();
  if (threads.length === 0) return;

  var labelCache = {};
  var newSenderRows = [];
  var unknownSenderRows = [];

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var message = thread.getMessages()[0];

    var from = message.getFrom();
    var to = message.getTo();
    var subject = message.getSubject();
    var snippet = message.getPlainBody().substring(0, 300);
    var senderEmail = extractEmail_(from);
    var senderDomain = extractDomain_(senderEmail);

    if (isJobSearchSender_(senderEmail, senderDomain)) continue;

    var result = matchRules_(senderEmail, senderDomain, to);

    if (!result) {
      var classification = classifyUnknown_(senderEmail, from, subject, snippet);
      result = classification.label;
      if (result) {
        newSenderRows.push([
          new Date(),
          senderEmail,
          senderDomain,
          from,
          subject,
          result,
          classification.source,
        ]);
      } else if (classification.source === 'RULES_ONLY') {
        unknownSenderRows.push([new Date(), senderEmail, senderDomain, from, subject, '', false]);
      } else {
        Logger.log('No label assigned for ' + senderEmail + ' (source=' + classification.source + ')');
      }
    }

    if (result && VALID_LABELS.indexOf(result) !== -1) {
      var gmailLabel = getOrCreateLabel_(result, labelCache);
      gmailLabel.addToThread(thread);

      if (!shouldSkipArchive_(senderEmail, result)) {
        thread.moveToArchive();
      }
    }
  }

  if (newSenderRows.length > 0) {
    logToSheet_(newSenderRows);
  }

  if (unknownSenderRows.length > 0) {
    logUnknownToSheet_(unknownSenderRows);
  }
}

// ---------------------------------------------------------------------------
// Find unlabeled inbox threads
// ---------------------------------------------------------------------------

function findUnlabeledInboxThreads_() {
  var exclude = VALID_LABELS.map(function (l) {
    return '-label:' + l.replace(/ /g, '-');
  }).join(' ');

  var query = 'is:inbox ' + exclude + ' -label:Follow-up -label:To-Reply -label:Actioned';
  return GmailApp.search(query, 0, BATCH_SIZE);
}

// ---------------------------------------------------------------------------
// Job Search whitelist — never touch these
// ---------------------------------------------------------------------------

function isJobSearchSender_(email, domain) {
  for (var i = 0; i < JOB_SEARCH_DOMAINS.length; i++) {
    if (domain.indexOf(JOB_SEARCH_DOMAINS[i]) !== -1) return true;
  }
  for (var i = 0; i < JOB_SEARCH_ADDRESSES.length; i++) {
    if (email === JOB_SEARCH_ADDRESSES[i]) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Rule matching — same logic as gmail-filters.xml
// ---------------------------------------------------------------------------

/**
 * Returns a shallow copy of RULES with Newsletter.toAliases extended from
 * Script Property NEWSLETTER_TO_ALIASES (comma-separated), so iCloud aliases
 * are never committed to the repo.
 */
function getRulesForMatching_() {
  var extra = PropertiesService.getScriptProperties().getProperty('NEWSLETTER_TO_ALIASES');
  var fromProps = [];
  if (extra) {
    var parts = extra.split(',');
    for (var p = 0; p < parts.length; p++) {
      var s = parts[p].replace(/^\s+|\s+$/g, '');
      if (s) fromProps.push(s);
    }
  }

  var keys = Object.keys(RULES);
  var out = {};
  for (var i = 0; i < keys.length; i++) {
    var label = keys[i];
    var rule = RULES[label];
    var toAliases = rule.toAliases ? rule.toAliases.slice() : [];
    if (label === 'Newsletter' && fromProps.length) {
      for (var j = 0; j < fromProps.length; j++) {
        toAliases.push(fromProps[j]);
      }
    }
    out[label] = {
      domains: rule.domains,
      addresses: rule.addresses,
      toAliases: toAliases,
    };
  }
  return out;
}

function matchRules_(email, domain, to) {
  var rulesMap = getRulesForMatching_();
  var labels = Object.keys(rulesMap);
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    var rule = rulesMap[label];

    for (var d = 0; d < rule.domains.length; d++) {
      if (domain.indexOf(rule.domains[d]) !== -1) return label;
    }

    for (var a = 0; a < rule.addresses.length; a++) {
      if (email === rule.addresses[a]) return label;
    }

    if (to && rule.toAliases) {
      for (var t = 0; t < rule.toAliases.length; t++) {
        if (to.indexOf(rule.toAliases[t]) !== -1) return label;
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Unknown sender classification
// ---------------------------------------------------------------------------

function classifyUnknown_(senderEmail, fromHeader, subject, snippet) {
  var mode = getClassifierMode_();
  if (mode === 'RULES_ONLY') {
    return { label: null, source: 'RULES_ONLY' };
  }

  var label = classifyWithGemini_(senderEmail, fromHeader, subject, snippet);
  if (!label) {
    return { label: null, source: 'GEMINI_FAILED' };
  }
  return { label: label, source: 'GEMINI' };
}

function classifyWithGemini_(senderEmail, fromHeader, subject, snippet) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    Logger.log('No GEMINI_API_KEY set — switching to RULES_ONLY behavior');
    return null;
  }

  var systemPrompt =
    'You classify emails into exactly one Gmail label. ' +
    'Valid labels: Newsletter, Notification, Receipt, Calendar, Marketing, Cold Email, Security, Personal, FYI. ' +
    'Rules:\n' +
    '- Newsletter: blogs, digests, Substack, recurring content emails\n' +
    '- Notification: app alerts, service updates, shipping, automated messages\n' +
    '- Receipt: purchases, payments, invoices, billing, subscriptions\n' +
    '- Calendar: appointment reminders, event invitations, scheduling\n' +
    '- Marketing: promotions, sales, brand emails, product launches\n' +
    '- Cold Email: unsolicited outreach, sales pitches from unknown senders\n' +
    '- Security: password resets, 2FA codes, account alerts, verification emails\n' +
    '- Personal: from a real person, personal conversation\n' +
    '- FYI: informational, no action needed, doesn\'t fit other categories\n' +
    'Return ONLY the label name, nothing else.';

  var userMsg =
    'From: ' + fromHeader + '\n' +
    'Email: ' + senderEmail + '\n' +
    'Subject: ' + subject + '\n' +
    'Snippet: ' + snippet;

  var payload = {
    contents: [
      {
        parts: [
          {
            text: systemPrompt + '\n\n' + userMsg,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      maxOutputTokens: 20,
    },
  };

  try {
    var response = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(apiKey), {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    var json = JSON.parse(response.getContentText());
    if (json.error) {
      Logger.log('Gemini error: ' + json.error.message);
      return null;
    }

    var text = (((json.candidates || [])[0] || {}).content || {}).parts || [];
    if (!text.length || !text[0].text) {
      Logger.log('Gemini response missing label text for ' + senderEmail);
      return null;
    }

    var label = normalizeLabel_(text[0].text.trim());

    if (VALID_LABELS.indexOf(label) !== -1) {
      return label;
    }

    Logger.log('Gemini returned invalid label: ' + label + ' for ' + senderEmail);
    return null;
  } catch (e) {
    Logger.log('Gemini classification failed: ' + e.message);
    return null;
  }
}

function getClassifierMode_() {
  var value = PropertiesService.getScriptProperties().getProperty('CLASSIFIER_MODE');
  if (!value) return DEFAULT_CLASSIFIER_MODE;
  value = value.toUpperCase().trim();
  if (value !== 'GEMINI' && value !== 'RULES_ONLY') {
    return DEFAULT_CLASSIFIER_MODE;
  }
  return value;
}

function normalizeLabel_(raw) {
  var cleaned = raw.replace(/[^\w\s-]/g, '').trim();
  var lowered = cleaned.toLowerCase();
  var map = {
    newsletter: 'Newsletter',
    notification: 'Notification',
    receipt: 'Receipt',
    calendar: 'Calendar',
    marketing: 'Marketing',
    'cold email': 'Cold Email',
    coldemail: 'Cold Email',
    security: 'Security',
    personal: 'Personal',
    fyi: 'FYI',
  };
  return map[lowered] || cleaned;
}

// ---------------------------------------------------------------------------
// Archive control
// ---------------------------------------------------------------------------

function shouldSkipArchive_(email, label) {
  if (NEVER_ARCHIVE_ADDRESSES.indexOf(email) !== -1) return true;
  if (label === 'Personal') return true;
  return false;
}

// ---------------------------------------------------------------------------
// Label cache
// ---------------------------------------------------------------------------

function getOrCreateLabel_(name, cache) {
  if (cache[name]) return cache[name];

  var label = GmailApp.getUserLabelByName(name);
  if (!label) {
    label = GmailApp.createLabel(name);
  }
  cache[name] = label;
  return label;
}

// ---------------------------------------------------------------------------
// Google Sheets logging — new sender classifications
// ---------------------------------------------------------------------------

function logToSheet_(rows) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) {
    Logger.log('No SHEET_ID set — logging ' + rows.length + ' new senders to Apps Script log only');
    for (var i = 0; i < rows.length; i++) {
      Logger.log('New sender: ' + rows[i].join(' | '));
    }
    return;
  }

  try {
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName('New Senders') || ss.insertSheet('New Senders');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Date', 'Email', 'Domain', 'From Header', 'Subject', 'Label', 'Source']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }

    for (var i = 0; i < rows.length; i++) {
      sheet.appendRow(rows[i]);
    }
  } catch (e) {
    Logger.log('Sheet logging failed: ' + e.message);
  }
}

// ---------------------------------------------------------------------------
// Google Sheets logging — unknown senders for manual review (RULES_ONLY mode)
// ---------------------------------------------------------------------------

/**
 * Appends unknown senders to a "Review Queue" sheet tab, deduplicated by email.
 * Columns: First Seen | Email | Domain | From Header | Subject | Assign Label | Added to rules.gs?
 * Chase fills in "Assign Label" and checks "Added to rules.gs?" after adding the rule.
 */
function logUnknownToSheet_(rows) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!sheetId) return;

  try {
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName('Review Queue') || ss.insertSheet('Review Queue');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['First Seen', 'Email', 'Domain', 'From Header', 'Subject', 'Assign Label', 'Added to rules.gs?']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    }

    // Build set of already-logged emails to avoid duplicates
    var existing = {};
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var emailValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < emailValues.length; i++) {
        existing[String(emailValues[i][0]).toLowerCase()] = true;
      }
    }

    for (var i = 0; i < rows.length; i++) {
      var email = String(rows[i][1]).toLowerCase();
      if (!existing[email]) {
        sheet.appendRow(rows[i]);
        existing[email] = true;
      }
    }
  } catch (e) {
    Logger.log('Review Queue logging failed: ' + e.message);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractEmail_(fromHeader) {
  var match = fromHeader.match(/<(.+?)>/);
  return match ? match[1].toLowerCase() : fromHeader.toLowerCase().trim();
}

function extractDomain_(email) {
  var parts = email.split('@');
  return parts.length > 1 ? parts[1] : '';
}

// ---------------------------------------------------------------------------
// Setup — run once to create the trigger
// ---------------------------------------------------------------------------

function setupTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'autoSort') {
      Logger.log('Trigger already exists — skipping');
      return;
    }
  }

  ScriptApp.newTrigger('autoSort')
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log('Created 5-minute trigger for autoSort');
}

// ---------------------------------------------------------------------------
// Manual run — test on current inbox
// ---------------------------------------------------------------------------

function testRun() {
  Logger.log('Starting manual test run...');
  autoSort();
  Logger.log('Done.');
}

// ---------------------------------------------------------------------------
// Health check — run once to verify Script Properties + trigger + sheet
// ---------------------------------------------------------------------------

/**
 * Run from the Apps Script editor (Run > healthCheck). Does not call Gemini.
 * Logs: resolved CLASSIFIER_MODE, whether GEMINI_API_KEY is set (length only, never the value),
 * SHEET_ID presence, autoSort trigger count, and optional sheet open test.
 */
function healthCheck() {
  var props = PropertiesService.getScriptProperties();
  var mode = getClassifierMode_();
  var geminiKey = props.getProperty('GEMINI_API_KEY');
  var sheetId = props.getProperty('SHEET_ID');

  Logger.log('=== Gmail Forge — healthCheck ===');
  Logger.log('CLASSIFIER_MODE (resolved): ' + mode);
  Logger.log('GEMINI_API_KEY: ' + (geminiKey ? 'set (length ' + String(geminiKey.length) + ')' : 'missing'));
  Logger.log('SHEET_ID: ' + (sheetId ? 'set' : 'missing'));

  var newsletterAliases = props.getProperty('NEWSLETTER_TO_ALIASES');
  if (newsletterAliases) {
    var n = newsletterAliases.split(',').filter(function (s) {
      return s.replace(/^\s+|\s+$/g, '').length > 0;
    }).length;
    Logger.log('NEWSLETTER_TO_ALIASES: set (' + n + ' recipient(s))');
  } else {
    Logger.log('NEWSLETTER_TO_ALIASES: missing (optional — iCloud Substack/Crossword aliases)');
  }

  if (mode === 'GEMINI' && !geminiKey) {
    Logger.log('WARN: GEMINI mode but no GEMINI_API_KEY — unknown senders will not be classified.');
  }

  var triggers = ScriptApp.getProjectTriggers();
  var autoSortTriggers = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'autoSort') autoSortTriggers++;
  }
  Logger.log('Triggers for autoSort: ' + autoSortTriggers + ' (expected: 1)');

  if (sheetId) {
    try {
      SpreadsheetApp.openById(sheetId);
      Logger.log('SHEET_ID: spreadsheet opens OK');
    } catch (e) {
      Logger.log('SHEET_ID: FAILED to open — ' + e.message);
    }
  }

  Logger.log('=== end healthCheck ===');
}

// ---------------------------------------------------------------------------
// Tokenized web app — lets Spend Radar's "Refresh All Apps" button trigger
// autoSort() over HTTP. Deploy: script.google.com → Deploy → New deployment →
// Web app (Execute as Me, Anyone has access) → copy URL. Script Property
// TRIGGER_TOKEN must be set to a UUID that matches Spend Radar's
// GMAIL_FORGE_TRIGGER_TOKEN Script Property.
// ---------------------------------------------------------------------------

function doGet(e) {
  var expected = PropertiesService.getScriptProperties().getProperty('TRIGGER_TOKEN');
  if (!expected || !e || !e.parameter || e.parameter.token !== expected) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    autoSort();
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, ran: 'autoSort' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

