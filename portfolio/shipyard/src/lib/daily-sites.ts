export type DailySiteCategory = 'job-search' | 'dev' | 'ai' | 'personal' | 'faith';

export interface DailySite {
  category: DailySiteCategory;
  name: string;
  url: string;
  note?: string;
}

export const CATEGORY_ORDER: { key: DailySiteCategory; label: string }[] = [
  { key: 'job-search', label: 'Job Search' },
  { key: 'dev', label: 'Dev / Deploy' },
  { key: 'ai', label: 'AI' },
  { key: 'personal', label: 'Personal' },
  { key: 'faith', label: 'Faith' },
];

export const DAILY_SITES: DailySite[] = [
  { category: 'job-search', name: 'Job Search HQ', url: 'https://job-search-hq.vercel.app', note: 'Pipeline + outreach' },
  { category: 'job-search', name: 'LinkedIn', url: 'https://www.linkedin.com/feed/', note: 'Network + DMs' },
  { category: 'job-search', name: 'Welcome to the Jungle', url: 'https://app.welcometothejungle.com/', note: 'Curated roles' },
  { category: 'job-search', name: 'Stripe Careers', url: 'https://stripe.com/jobs', note: 'Primary target' },
  { category: 'job-search', name: 'Adyen Careers', url: 'https://careers.adyen.com', note: 'Primary target' },

  { category: 'dev', name: 'GitHub', url: 'https://github.com/iamchasewhittaker', note: 'Repos + activity' },
  { category: 'dev', name: 'Vercel', url: 'https://vercel.com/iamchasewhittakers-projects', note: 'Deploys' },
  { category: 'dev', name: 'Supabase', url: 'https://supabase.com/dashboard', note: 'Shared project' },
  { category: 'dev', name: 'Linear (Whittaker)', url: 'https://linear.app/whittaker', note: 'Project tracking' },
  { category: 'dev', name: 'Shipyard', url: 'https://shipyard-iamchasewhittakers-projects.vercel.app', note: 'Fleet command' },

  { category: 'ai', name: 'Claude', url: 'https://claude.ai' },
  { category: 'ai', name: 'ChatGPT', url: 'https://chat.openai.com' },
  { category: 'ai', name: 'Anthropic Console', url: 'https://console.anthropic.com' },

  { category: 'personal', name: 'Gmail', url: 'https://mail.google.com' },
  { category: 'personal', name: 'Google Calendar', url: 'https://calendar.google.com' },
  { category: 'personal', name: 'Ash Reader', url: 'https://ash-reader.vercel.app', note: 'Mental health' },
  { category: 'personal', name: 'Knowledge Base', url: 'https://knowledge-base-hazel-iota.vercel.app', note: 'Bookmarks + notes' },

  { category: 'faith', name: 'Gospel Library', url: 'https://www.churchofjesuschrist.org/study/scriptures' },
  { category: 'faith', name: 'Scripture Citation Index', url: 'https://scriptures.byu.edu' },
];

export function sitesByCategory(
  sites: DailySite[] = DAILY_SITES,
): Record<DailySiteCategory, DailySite[]> {
  const seed: Record<DailySiteCategory, DailySite[]> = {
    'job-search': [],
    dev: [],
    ai: [],
    personal: [],
    faith: [],
  };
  for (const site of sites) seed[site.category].push(site);
  return seed;
}
