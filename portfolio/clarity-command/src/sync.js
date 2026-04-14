// Clarity Command — Supabase sync adapter
// Mirrors the pattern in wellness-tracker/src/sync.js exactly.
// APP_KEY = 'command'

import { createSync } from './shared/sync.js';

export const APP_KEY = 'command';
export const APP_NAME = 'clarity-command';
export const DEFAULT_CANONICAL_PATH = '/command';

const { push, pull, auth, emailRedirectTo } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    appName: APP_NAME,
    canonicalPath: process.env.REACT_APP_AUTH_APP_PATH || DEFAULT_CANONICAL_PATH,
  }
);

export { push, pull, auth, emailRedirectTo };
