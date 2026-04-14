import { createSync } from './shared/sync.js';

export const APP_NAME = 'ynab';
export const DEFAULT_CANONICAL_PATH = '/ynab';

const { push, pull, auth, emailRedirectTo } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    appName: APP_NAME,
    canonicalPath: process.env.REACT_APP_AUTH_APP_PATH || DEFAULT_CANONICAL_PATH,
  }
);

export const pushYnab = (data) => push('ynab', data);
export const pullYnab = (local, ts) => pull('ynab', local, ts);
export { auth, emailRedirectTo };
