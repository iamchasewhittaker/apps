/**
 * Gmail Forge — Sender/Domain Rules
 *
 * Mirrors the Gmail XML filters so Apps Script can match known senders
 * without an AI call. Keep this in sync when you add new XML filters.
 *
 * Structure:
 *   RULES[label] = {
 *     domains: [...],
 *     addresses: [...],
 *     toAliases: [...],
 *     subjectPatterns: [/regex/i, ...]   // optional — matched against the email subject
 *   }
 *
 * Match logic (in auto-sort.gs) — three passes, highest specificity wins:
 *   Pass 1 (exact): addresses + toAliases across all labels
 *   Pass 2 (broad): domains across all labels
 *   Pass 3 (content): subjectPatterns across all labels
 *   No match → fall through to AI classification
 *
 * Address-before-domain ordering lets specific addresses override broad
 * domain rules (e.g. messages-noreply@linkedin.com → Notification even
 * though linkedin.com is a JobSearch domain).
 */

var RULES = {
  // Job search emails stay in inbox (never archived by Forge) and are
  // picked up by Job Search HQ's InboxPanel via the Gmail label 'JobSearch'.
  // Domains mirror ATS_SENDER_DOMAINS + LINKEDIN_DOMAINS in
  // portfolio/job-search-hq/src/inbox/classifier.js — keep in sync.
  'JobSearch': {
    domains: [
      // ATS platforms
      'greenhouse-mail.io',
      'greenhouse.io',
      'hire.lever.co',
      'lever.co',
      'myworkday.com',
      'workday.com',
      'ashbyhq.com',
      'smartrecruiters.com',
      'jobvite.com',
      'bamboohr.com',
      'workable.com',
      'recruitee.com',
      'rippling.com',
      'icims.com',
      'taleo.net',
      'successfactors.com',
      // General job boards
      'ziprecruiter.com',
      // LinkedIn (all sub-domains)
      'linkedin.com',
      'e.linkedin.com',
      'el.linkedin.com',
    ],
    addresses: [
      'jobs-listings@linkedin.com',
      'inmail@linkedin.com',
      'jobalerts-noreply@linkedin.com',
      'notifications-noreply@linkedin.com',
    ],
    toAliases: [],
    // Catches recruiter outreach from personal/unknown domains.
    // Keep tight — broad words like "schedule" alone produce false positives
    // (calendar invites, app notifications), so we anchor scheduling phrases
    // to call/chat/interview/time.
    subjectPatterns: [
      /\binterview\b/i,
      /\bavailability\b/i,
      /\bphone screen\b/i,
      /\btime to chat\b/i,
      /\bschedule (a |an )?(call|chat|interview|time)\b/i,
    ],
  },

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
      'USPSInformeddelivery@email.informeddelivery.usps.com',
      'fantasy@espnmail.com',
      'no-reply@backblaze.com',
      'no-reply@sunsama.com',
      'noreply@email.apple.com',
      'notify@me.sh',
      // LinkedIn social — override the broad linkedin.com JobSearch domain match
      'messages-noreply@linkedin.com',
      'invitations@linkedin.com',
      'updates-noreply@linkedin.com',
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
 * Addresses that stay in inbox even when matched to an archive-able label.
 * LinkedIn DMs moved to JobSearch (handled by label-level skip in shouldSkipArchive_).
 */
var NEVER_ARCHIVE_ADDRESSES = [];
