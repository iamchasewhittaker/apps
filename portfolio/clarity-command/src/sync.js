// Clarity Command — Supabase sync adapter
// Mirrors the pattern in wellness-tracker/src/sync.js exactly.
// APP_KEY = 'command'

import { createSync } from './shared/sync.js';

export const APP_KEY = 'command';

const { push, pull, auth } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export { push, pull, auth };
