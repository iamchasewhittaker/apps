/**
 * Gmail Forge — Sender/Domain Rules
 *
 * Mirrors the 69 Gmail XML filters so Apps Script can match known senders
 * without an AI call. Keep this in sync when you add new XML filters.
 *
 * Structure:
 *   RULES[label] = { domains: [...], addresses: [...], toAliases: [...] }
 *
 * Match logic (in auto-sort.gs):
 *   1. Extract sender domain from the "From" header
 *   2. Check if domain appears in any label's `domains` array
 *   3. Check if full address appears in any label's `addresses` array
 *   4. Check if recipient matches any `toAliases` entry
 *   5. If no match → fall through to AI classification
 */

var JOB_SEARCH_DOMAINS = [
  'greenhouse-mail.io',
  'lever.co',
  'myworkday.com',
  'ziprecruiter.com',
];

var JOB_SEARCH_ADDRESSES = [
  'jobs-listings@linkedin.com',
  'inmail@linkedin.com',
];

var RULES = {
  'Newsletter': {
    domains: [
      'substack.com',
      'thehustle.co',
      'polymarket.com',
      'sporcle.com',
      'thetwistriddle.com',
      'farnamstreetblog.com',
      'dailystoic.com',
      'churchofjesuschrist.org',
      'missionary.org',
      'e1.theathletic.com',
      'email.masters.com',
      'digest.producthunt.com',
      'mailer.puzzmo.com',
      'mail.joinsuperhuman.ai',
      'ship30for30.com',
      'daily.therundown.ai',
      'thedailydad.com',
      'aisecret.us',
      'the-dailee.com',
      'nickwignall.com',
    ],
    addresses: [
      'hello@readwise.io',
      'newsletter@themarginalian.org',
      'dan@tldrnewsletter.com',
      'hello@wordsmarts.com',
      'johnhiltoniii@byu.edu',
      'john@johnhiltoniii.com',
      'natia@space-leads.com',
    ],
    // Optional static aliases; prefer Script Property NEWSLETTER_TO_ALIASES (see apps-script/README.md)
    toAliases: [
      'pipe.evasive_9z@icloud.com',  // WordPress Daily Crossword relay — can't match by wordpress.com broadly
    ],
  },

  'Notification': {
    domains: [
      'amazon.com',
      'obsidian.md',
      'mail.app.supabase.io',
    ],
    addresses: [
      'invitations@linkedin.com',
      'messages-noreply@linkedin.com',
      'USPSInformeddelivery@email.informeddelivery.usps.com',
      'fantasy@espnmail.com',
      'no-reply@backblaze.com',
      'no-reply@sunsama.com',
      'noreply@email.apple.com',
      'notify@me.sh',
    ],
    toAliases: [],
  },

  'Calendar': {
    domains: [
      'phreesia-mail.com',
      'messaging.squareup.com',
      'mail.sg.getweave.com',
      'luma-mail.com',
    ],
    addresses: [
      'calendar-notification@google.com',
    ],
    toAliases: [],
  },

  'Security': {
    domains: [
      'accounts.google.com',
      'github.com',
    ],
    addresses: [],
    toAliases: [],
  },

  'Receipt': {
    domains: [
      'citi.com',
      'safeco.com',
      'paypal.com',
      'online.costco.com',
      'target.com',
      'uber.com',
      'doordash.com',
      'spotify.com',
      'chewy.com',
      'domenergyuteb.com',
      'billing.fastel.com',
      'nike.com',
      'mail.anthropic.com',
    ],
    addresses: [
      'venmo@venmo.com',
      'support@privacy.com',
      'no_reply@email.apple.com',
      'googleplay-noreply@google.com',
      'accountnotices@rockymountainpower.net',
    ],
    toAliases: [],
  },

  'Marketing': {
    domains: [
      'buckmason.com',
      'weareollin.com',
      'hello.treatmyocd.com',
      'lakeview.com',
      'officialjackcarr.com',
      'twelvesouth.com',
      'gygi.com',
      'mail.grammarly.com',
      'yardmastery.com',
    ],
    addresses: [],
    toAliases: [],
  },
};

/**
 * LinkedIn Messages: labeled Notification but NOT archived (stays in inbox).
 * This set controls which senders skip the archive step even when matched.
 */
var NEVER_ARCHIVE_ADDRESSES = [
  'messages-noreply@linkedin.com',
];
