import { createSync } from './shared/sync.js';

export const APP_NAME = 'clarity-hub';
export const DEFAULT_CANONICAL_PATH = '/hub';

const { push, pull, auth, emailRedirectTo } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    appName: APP_NAME,
    canonicalPath: process.env.REACT_APP_AUTH_APP_PATH || DEFAULT_CANONICAL_PATH,
  }
);

export const pushCheckin = (data) => push('checkin', data);
export const pullCheckin = (local, ts) => pull('checkin', local, ts);
export const pushTriage = (data) => push('triage', data);
export const pullTriage = (local, ts) => pull('triage', local, ts);
export const pushTime = (data) => push('time', data);
export const pullTime = (local, ts) => pull('time', local, ts);
export const pushBudget = (data) => push('budget', data);
export const pullBudget = (local, ts) => pull('budget', local, ts);
export const pushGrowth = (data) => push('growth', data);
export const pullGrowth = (local, ts) => pull('growth', local, ts);

export { auth, emailRedirectTo };
