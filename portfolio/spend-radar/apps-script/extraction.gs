/**
 * Spend Radar — API-free extraction
 *
 * Entry point: extractReceipt_(msg) → { merchant, item, amount, category, source }
 *   - source: "rule" when SENDER_RULES matched, "fallback" when heuristic was used
 *
 * Grow SENDER_RULES from the Audit tab worklist — each Audit run flags
 * unknown recurring senders that should get a rule here.
 */

// ---------------------------------------------------------------------------
// Known-sender rules
// ---------------------------------------------------------------------------

var SENDER_RULES = {
  'spotify.com':            { merchant: 'Spotify',             itemRe: /Spotify\s+(Premium[^\n,.]*)/i,                      category: 'Streaming' },
  'anthropic.com':          { merchant: 'Anthropic',           itemRe: /(Claude\s+(?:Pro|Max|Team))/i,                      category: 'AI Tools' },
  'apple.com':              { merchant: 'Apple',               itemRe: /^(.+?)(?:\n|\s+\$)/m,                                category: 'Software' },
  'paypal.com':             { merchant: 'PayPal',              itemRe: /to\s+(.+?)\s+for/i,                                  category: 'Finance' },
  'costco.com':             { merchant: 'Costco',              itemRe: /Order\s+#?\s*([^\s]+)/i,                             category: 'Retail' },
  'target.com':             { merchant: 'Target',              itemRe: /Order\s+#?\s*([^\s]+)/i,                             category: 'Retail' },
  'uber.com':               { merchant: 'Uber',                itemRe: /(?:Trip|Ride)\s+(?:with|on)\s+(.+?)(?:\n|,)/i,       category: 'Transport' },
  'doordash.com':           { merchant: 'DoorDash',            itemRe: /Order\s+from\s+(.+?)(?:\n|,)/i,                      category: 'Food' },
  'chewy.com':              { merchant: 'Chewy',               itemRe: /Order\s+#?\s*([^\s]+)/i,                             category: 'Retail' },
  'nike.com':               { merchant: 'Nike',                itemRe: /Order\s+#?\s*([^\s]+)/i,                             category: 'Retail' },
  'rockymountainpower.net': { merchant: 'Rocky Mountain Power', itemRe: null,                                                 category: 'Utilities' },
  'domenergyuteb.com':      { merchant: 'Enbridge Gas',        itemRe: null,                                                 category: 'Utilities' },
  'fastel.com':             { merchant: 'FASTEL',              itemRe: null,                                                 category: 'Utilities' },
  'privacy.com':            { merchant: 'Privacy.com',         itemRe: /(.+?)\s+charged/i,                                   category: 'Finance' },
  'venmo.com':              { merchant: 'Venmo',               itemRe: /for\s+"([^"]+)"/i,                                   category: 'Finance' },
  'citi.com':               { merchant: 'Citi',                itemRe: null,                                                 category: 'Finance' },
  'safeco.com':             { merchant: 'Safeco',              itemRe: null,                                                 category: 'Insurance' },
  'google.com':             { merchant: 'Google',              itemRe: /(Google\s+\w+)/i,                                    category: 'Software' },
};

// ---------------------------------------------------------------------------
// Prioritized amount extraction
// ---------------------------------------------------------------------------

var AMOUNT_PATTERNS = [
  /Total[:\s]+\$?\s?([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]{2}))/i,
  /Amount\s+charged[:\s]+\$?\s?([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]{2}))/i,
  /You\s+paid[:\s]+\$?\s?([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]{2}))/i,
  /Grand\s+total[:\s]+\$?\s?([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]{2}))/i,
];

var GENERIC_AMOUNT_RE = /\$\s?([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]{2}))/g;

function extractAmountPrioritized_(subject, body) {
  // Prioritized patterns first — in body then subject
  for (var i = 0; i < AMOUNT_PATTERNS.length; i++) {
    var bm = body.match(AMOUNT_PATTERNS[i]);
    if (bm) return '$' + bm[1];
    var sm = subject.match(AMOUNT_PATTERNS[i]);
    if (sm) return '$' + sm[1];
  }
  // Fallback: last $X.XX in the first 4000 chars of body
  var scoped = body.substring(0, 4000);
  var matches = scoped.match(GENERIC_AMOUNT_RE);
  if (matches && matches.length > 0) return matches[matches.length - 1];
  // Last-ditch: any dollar in subject
  var subjMatch = subject.match(GENERIC_AMOUNT_RE);
  if (subjMatch && subjMatch.length > 0) return subjMatch[0];
  return '';
}

// ---------------------------------------------------------------------------
// Main extractor
// ---------------------------------------------------------------------------

function extractReceipt_(msg) {
  var fromHeader = msg.getFrom();
  var email = extractEmail_(fromHeader);
  var domain = extractDomain_(email);
  var displayName = extractDisplayName_(fromHeader);
  var subject = msg.getSubject() || '';
  var body = (msg.getPlainBody() || '').substring(0, 4000);

  var rule = findSenderRule_(domain);
  var amount = extractAmountPrioritized_(subject, body);

  if (rule) {
    var item = '';
    if (rule.itemRe) {
      var m = body.match(rule.itemRe) || subject.match(rule.itemRe);
      if (m && m[1]) item = m[1].trim();
    }
    return {
      merchant: rule.merchant,
      item: item,
      amount: amount,
      category: rule.category,
      source: 'rule',
    };
  }

  // Fallback — heuristic
  return {
    merchant: fallbackMerchant_(displayName, domain),
    item: fallbackItem_(body),
    amount: amount,
    category: 'Other',
    source: 'fallback',
  };
}

function findSenderRule_(domain) {
  var keys = Object.keys(SENDER_RULES);
  for (var i = 0; i < keys.length; i++) {
    if (domain.indexOf(keys[i]) !== -1) return SENDER_RULES[keys[i]];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Fallback heuristics
// ---------------------------------------------------------------------------

var FALLBACK_SUFFIX_RE = /\s*(billing|receipts?|support|noreply|no-reply|no_reply|automated|info|notifications?|team|store|sales)\s*$/i;

function fallbackMerchant_(displayName, domain) {
  if (displayName) {
    var cleaned = displayName.replace(FALLBACK_SUFFIX_RE, '').trim();
    if (cleaned) return cleaned;
  }
  // Domain root title-case
  var root = (domain || '').split('.').slice(-2)[0] || domain || '';
  return root ? root.charAt(0).toUpperCase() + root.slice(1) : '';
}

function fallbackItem_(body) {
  if (!body) return '';
  var lines = body.split('\n');
  // Preferred: line that looks like "Widget — $12.99" or "Widget: $12.99"
  var pref = /^(.{3,80}?)\s*[—\-:]\s*\$\s?[0-9][0-9.,]*/;
  for (var i = 0; i < lines.length && i < 80; i++) {
    var l = lines[i].trim();
    var m = l.match(pref);
    if (m) return m[1].trim();
  }
  // Next: first line containing $ with 3–80 chars preceding
  var anyDollar = /^(.{3,80}?)\s+\$\s?[0-9]/;
  for (var j = 0; j < lines.length && j < 80; j++) {
    var l2 = lines[j].trim();
    var mm = l2.match(anyDollar);
    if (mm) return mm[1].trim();
  }
  return '';
}
