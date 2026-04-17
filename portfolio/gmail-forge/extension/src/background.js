/**
 * Inbox Zero — Background Service Worker
 *
 * Handles AI classification requests from the content script.
 * Runs as a MV3 service worker (no DOM access).
 */

var VALID_LABELS = [
  'Newsletter', 'Notification', 'Receipt', 'Calendar',
  'Marketing', 'Cold Email', 'Security', 'Personal', 'FYI',
];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'CLASSIFY') {
    handleClassify(request.emails).then(sendResponse);
    return true;
  }

  if (request.type === 'GET_UNSORTED_COUNT') {
    sendResponse({ count: 0 });
    return false;
  }
});

async function handleClassify(emails) {
  var settings = await chrome.storage.sync.get(['geminiApiKey', 'classifierMode']);
  var mode = normalizeMode(settings.classifierMode);

  var results = [];

  for (var i = 0; i < emails.length; i++) {
    var email = emails[i];
    try {
      var label = null;
      var source = mode;

      if (mode === 'GEMINI') {
        if (settings.geminiApiKey) {
          label = await classifyWithGemini(settings.geminiApiKey, email);
          source = 'GEMINI';
        } else {
          source = 'RULES_ONLY_NO_KEY';
        }
      }

      if (!label) {
        label = classifyRulesOnly(email);
        source = source.indexOf('RULES_ONLY') === 0 ? source : 'RULES_ONLY';
      }

      results.push({ sender: email.sender, subject: email.subject, label: label, source: source });
    } catch (e) {
      results.push({ sender: email.sender, subject: email.subject, label: null, error: e.message });
    }
  }

  return { results: results };
}

function normalizeMode(value) {
  if (!value) return 'GEMINI';
  value = String(value).toUpperCase();
  if (value !== 'GEMINI' && value !== 'RULES_ONLY') return 'GEMINI';
  return value;
}

async function classifyWithGemini(apiKey, email) {
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
    'From: ' + email.sender + '\n' +
    'Subject: ' + email.subject + '\n' +
    'Snippet: ' + (email.snippet || '').substring(0, 300);

  var response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(apiKey), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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
    }),
  });

  var json = await response.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  var part = (((json.candidates || [])[0] || {}).content || {}).parts || [];
  if (!part.length || !part[0].text) {
    throw new Error('Gemini returned an empty response');
  }
  var label = normalizeLabel(part[0].text.trim());

  if (VALID_LABELS.indexOf(label) === -1) {
    throw new Error('Gemini returned invalid label: ' + label);
  }

  return label;
}

function classifyRulesOnly(email) {
  var haystack = [
    (email.sender || '').toLowerCase(),
    (email.subject || '').toLowerCase(),
    (email.snippet || '').toLowerCase(),
  ].join(' ');

  if (/(invoice|receipt|payment|charged|billing|order total|subscription)/.test(haystack)) return 'Receipt';
  if (/(calendar|appointment|scheduled|meeting|invite)/.test(haystack)) return 'Calendar';
  if (/(password|2fa|security|login|verification|code)/.test(haystack)) return 'Security';
  if (/(newsletter|digest|substack)/.test(haystack)) return 'Newsletter';
  if (/(sale|promo|discount|offer|deal)/.test(haystack)) return 'Marketing';
  if (/(cold outreach|quick call|partnership|prospect|lead generation)/.test(haystack)) return 'Cold Email';
  if (/(notification|alert|update|reminder|shipped|delivered)/.test(haystack)) return 'Notification';
  return 'FYI';
}

function normalizeLabel(raw) {
  var cleaned = String(raw).replace(/[^\w\s-]/g, '').trim().toLowerCase();
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
  return map[cleaned] || raw;
}
