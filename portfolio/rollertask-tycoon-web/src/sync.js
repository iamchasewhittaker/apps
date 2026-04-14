import { createSync } from './shared/sync.js';

export const APP_NAME = 'rollertask';
export const DEFAULT_CANONICAL_PATH = '/tasks';

const { push, pull, auth, emailRedirectTo } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    appName: APP_NAME,
    canonicalPath: process.env.REACT_APP_AUTH_APP_PATH || DEFAULT_CANONICAL_PATH,
  }
);

export const pushRollertask = (data) => push('rollertask', data);
export const pullRollertask = (local, ts) => pull('rollertask', local, ts);
export { auth, emailRedirectTo };
