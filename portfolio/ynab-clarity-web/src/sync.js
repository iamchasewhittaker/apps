import { createSync } from './shared/sync.js';

const { push, pull, auth } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const pushYnab = (data) => push('ynab', data);
export const pullYnab = (local, ts) => pull('ynab', local, ts);
export { auth };
