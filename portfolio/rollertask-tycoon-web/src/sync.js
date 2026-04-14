import { createSync } from './shared/sync.js';

const { push, pull, auth } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const pushRollertask = (data) => push('rollertask', data);
export const pullRollertask = (local, ts) => pull('rollertask', local, ts);
export { auth };
