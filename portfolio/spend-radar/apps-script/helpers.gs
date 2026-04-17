/**
 * Spend Radar — Shared helpers
 *
 * Utilities used across subscriptions.gs, receipts.gs, extraction.gs, audit.gs.
 * No top-level code — pure functions only.
 */

// ---------------------------------------------------------------------------
// Email / domain
// ---------------------------------------------------------------------------

function extractEmail_(fromHeader) {
  var match = fromHeader.match(/<(.+?)>/);
  return match ? match[1].toLowerCase() : fromHeader.toLowerCase().trim();
}

function extractDomain_(email) {
  var parts = email.split('@');
  return parts.length > 1 ? parts[1] : '';
}

function extractDisplayName_(fromHeader) {
  // "Spotify <no-reply@spotify.com>" → "Spotify"
  // "no-reply@spotify.com" → "" (no display name)
  var match = fromHeader.match(/^\s*"?([^"<]+?)"?\s*</);
  if (!match) return '';
  return match[1].trim();
}

// ---------------------------------------------------------------------------
// Cadence math
// ---------------------------------------------------------------------------

function medianGapDays_(dates) {
  if (dates.length < 2) return 0;
  var gaps = [];
  for (var i = 1; i < dates.length; i++) {
    gaps.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
  }
  gaps.sort(function (a, b) { return a - b; });
  return gaps.length % 2 === 1
    ? gaps[(gaps.length - 1) / 2]
    : (gaps[gaps.length / 2 - 1] + gaps[gaps.length / 2]) / 2;
}

function cadenceLabelForDays_(cadenceDays) {
  if (cadenceDays >= 5 && cadenceDays <= 10) return 'Weekly';
  if (cadenceDays >= 25 && cadenceDays <= 35) return 'Monthly';
  if (cadenceDays >= 80 && cadenceDays <= 100) return 'Quarterly';
  if (cadenceDays >= 340 && cadenceDays <= 400) return 'Yearly';
  return 'Irregular (~' + Math.round(cadenceDays) + 'd)';
}

// Normalize any cadence's amount into a monthly-equivalent number.
// amountStr may be "" / "$12.99" — returns 0 when unparseable.
function monthlyEquivalent_(cadenceLabel, amountStr) {
  var n = parseDollarAmount_(amountStr);
  if (!n) return 0;
  if (cadenceLabel === 'Weekly') return n * 4.33;
  if (cadenceLabel === 'Monthly') return n;
  if (cadenceLabel === 'Quarterly') return n / 3;
  if (cadenceLabel === 'Yearly') return n / 12;
  return 0; // Irregular — don't project
}

function parseDollarAmount_(str) {
  if (!str) return 0;
  var m = String(str).match(/\$?\s?([0-9]{1,5}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/);
  if (!m) return 0;
  return parseFloat(m[1].replace(/,/g, '')) || 0;
}

function formatDollar_(n) {
  return '$' + n.toFixed(2);
}

// ---------------------------------------------------------------------------
// Gmail links
// ---------------------------------------------------------------------------

function gmailThreadLink_(thread) {
  return 'https://mail.google.com/mail/u/0/#all/' + thread.getId();
}
