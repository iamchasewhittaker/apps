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
  'JobSearch', 'Newsletter', 'Notification', 'Receipt', 'Calendar',
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

    var result = matchRules_(senderEmail, senderDomain, to, subject);

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
      subjectPatterns: rule.subjectPatterns || [],
    };
  }
  return out;
}

function matchRules_(email, domain, to, subject) {
  var rulesMap = getRulesForMatching_();
  var labels = Object.keys(rulesMap);

  // Pass 1: exact address + toAlias — highest specificity, overrides domain.
  // Allows e.g. messages-noreply@linkedin.com → Notification even though
  // linkedin.com is a JobSearch domain.
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    var rule = rulesMap[label];
    for (var a = 0; a < rule.addresses.length; a++) {
      if (email === rule.addresses[a]) return label;
    }
    if (to && rule.toAliases) {
      for (var t = 0; t < rule.toAliases.length; t++) {
        if (to.indexOf(rule.toAliases[t]) !== -1) return label;
      }
    }
  }

  // Pass 2: domain matching.
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    var rule = rulesMap[label];
    for (var d = 0; d < rule.domains.length; d++) {
      if (domain.indexOf(rule.domains[d]) !== -1) return label;
    }
  }

  // Pass 3: subject patterns (catch recruiter outreach from unknown domains).
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    var rule = rulesMap[label];
    if (subject && rule.subjectPatterns && rule.subjectPatterns.length) {
      for (var s = 0; s < rule.subjectPatterns.length; s++) {
        if (rule.subjectPatterns[s].test(subject)) return label;
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
    'Valid labels: JobSearch, Newsletter, Notification, Receipt, Calendar, Marketing, Cold Email, Security, Personal, FYI. ' +
    'Rules:\n' +
    '- JobSearch: ATS platforms (Greenhouse, Lever, Workday, Ashby, etc.), recruiter outreach, interview invites, scheduling/availability requests for hiring conversations, LinkedIn job alerts/InMail\n' +
    '- Newsletter: blogs, digests, Substack, recurring content emails\n' +
    '- Notification: app alerts, service updates, shipping, automated messages\n' +
    '- Receipt: purchases, payments, invoices, billing, subscriptions\n' +
    '- Calendar: appointment reminders, event invitations, scheduling (non-job)\n' +
    '- Marketing: promotions, sales, brand emails, product launches\n' +
    '- Cold Email: unsolicited outreach, sales pitches from unknown senders (non-recruiter)\n' +
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
    jobsearch: 'JobSearch',
    'job search': 'JobSearch',
    'job-search': 'JobSearch',
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
  if (label === 'JobSearch') return true;
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

// Known TLDs used to detect the boundary between domain and hash in iCloud relay addresses.
var KNOWN_TLDS_ = ['com', 'co', 'io', 'net', 'org', 'ai', 'md', 'edu', 'gov', 'us', 'uk', 'app'];

function extractDomain_(email) {
  var atIdx = email.indexOf('@');
  if (atIdx === -1) return '';
  var domain = email.substring(atIdx + 1);

  // Decode iCloud Hide My Email relay pattern:
  //   name_at_DOMAIN_TLD_hash1_hash2@icloud.com  →  DOMAIN.TLD
  // e.g. simonowens_at_substack_com_abc123_456@icloud.com  →  substack.com
  if (domain === 'icloud.com') {
    var local = email.substring(0, atIdx);
    var relayAt = local.indexOf('_at_');
    if (relayAt !== -1) {
      var segments = local.substring(relayAt + 4).split('_');
      var domainParts = [];
      for (var i = 0; i < segments.length && domainParts.length < 5; i++) {
        domainParts.push(segments[i]);
        if (KNOWN_TLDS_.indexOf(segments[i]) !== -1) break;
      }
      if (domainParts.length >= 2) return domainParts.join('.');
    }
  }

  return domain;
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
// Job Search HQ integration health check
// ---------------------------------------------------------------------------

/**
 * Diagnoses whether Job Search HQ's InboxPanel will see any emails.
 * JSHQ queries Gmail by labelIds=<JobSearch label id>, so this verifies the
 * label exists, the trigger is running, and that recently-received recruiter
 * mail actually got tagged.
 */
function healthCheck_jobSearch() {
  var triggers = ScriptApp.getProjectTriggers().filter(function (t) {
    return t.getHandlerFunction() === 'autoSort';
  });
  var label = GmailApp.getUserLabelByName('JobSearch');
  var threadCount = label ? label.getThreads(0, 50).length : 0;
  var unlabeled = GmailApp.search(
    'is:inbox -label:JobSearch -label:Newsletter -label:Notification ' +
    '-label:Receipt -label:Calendar -label:Marketing -label:"Cold-Email" ' +
    '-label:Security -label:Personal -label:FYI ' +
    '-label:Follow-up -label:To-Reply -label:Actioned',
    0, 5);

  Logger.log('=== Gmail Forge × Job Search HQ health check ===');
  Logger.log('5-min autoSort trigger active: ' + (triggers.length > 0));
  Logger.log('JobSearch label exists: ' + !!label);
  Logger.log('JobSearch threads (up to 50): ' + threadCount);
  Logger.log('Unlabeled inbox samples (up to 5): ' + unlabeled.length);
  for (var i = 0; i < unlabeled.length; i++) {
    var msg = unlabeled[i].getMessages()[0];
    Logger.log('  - ' + msg.getFrom() + ' / ' + unlabeled[i].getFirstMessageSubject());
  }
  Logger.log('=== end JSHQ health check ===');
}

// ---------------------------------------------------------------------------
// Tokenized web app — two modes:
//   (default)        Spend Radar's "Refresh All Apps" → runs autoSort() over HTTP
//   ?view=dashboard  Renders the dashboard HTML (see dashboard.gs / dashboard.html)
//
// Deploy: script.google.com → Deploy → New deployment → Web app
// (Execute as Me, Anyone has access) → copy URL. Script Property TRIGGER_TOKEN
// must be set to a UUID that matches Spend Radar's GMAIL_FORGE_TRIGGER_TOKEN.
// ---------------------------------------------------------------------------

function doGet(e) {
  var expected = PropertiesService.getScriptProperties().getProperty('TRIGGER_TOKEN');
  var view = e && e.parameter ? e.parameter.view : null;
  var tokenOk = !!expected && !!e && !!e.parameter && e.parameter.token === expected;

  if (!tokenOk) {
    if (view === 'dashboard') {
      return HtmlService
        .createHtmlOutput('<h1 style="font-family:sans-serif;color:#f06464">401 Unauthorized</h1>' +
                          '<p style="font-family:sans-serif;color:#8892a4">Append ?token=&lt;TRIGGER_TOKEN&gt;&amp;view=dashboard to the web app URL.</p>')
        .setTitle('Gmail Forge — Unauthorized');
    }
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (view === 'dashboard') {
    try {
      return renderDashboard_();
    } catch (err) {
      return HtmlService
        .createHtmlOutput('<h1 style="font-family:sans-serif;color:#f06464">Dashboard error</h1>' +
                          '<pre style="font-family:ui-monospace,monospace;color:#e2e8f0;background:#1a1d27;padding:12px;border-radius:8px">' +
                          String(err).replace(/</g, '&lt;') + '</pre>')
        .setTitle('Gmail Forge — Error');
    }
  }

  // Default: Spend Radar's Refresh All Apps trigger
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

// ---------------------------------------------------------------------------
// Label-apply endpoint — called by the Chrome extension Sort button.
// Accepts POST { token, applications: [{ messageId, label }] }
// Returns { results: [{ messageId, label, ok, error? }] }
// ---------------------------------------------------------------------------

function doPost(e) {
  var expected = PropertiesService.getScriptProperties().getProperty('TRIGGER_TOKEN');
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (!expected || payload.token !== expected) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var results = [];
  (payload.applications || []).forEach(function (item) {
    try {
      var msg = GmailApp.getUserMessageById(item.messageId);
      var gmailLabel = GmailApp.getUserLabelByName(item.label);
      if (!gmailLabel) gmailLabel = GmailApp.createLabel(item.label);
      msg.getThread().addLabel(gmailLabel);
      results.push({ messageId: item.messageId, label: item.label, ok: true });
    } catch (err) {
      results.push({ messageId: item.messageId, ok: false, error: err.message });
    }
  });

  return ContentService
    .createTextOutput(JSON.stringify({ results: results }))
    .setMimeType(ContentService.MimeType.JSON);
}

