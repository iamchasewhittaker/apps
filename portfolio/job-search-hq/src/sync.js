// Supabase sync for Job Search HQ.
// Wires createSync() with this app's env vars.
// If .env is missing or incomplete, createSync() gracefully falls back
// to localStorage-only mode (no crash, just a console.warn).
// shared/sync.js is copied into src/shared/ as a real file (NOT a symlink)
// because symlinks break on Vercel when only the app repo is cloned.
import { createSync } from './shared/sync.js';

export const APP_KEY = 'job-search';

// CRA exposes env vars via process.env.REACT_APP_* (not import.meta.env.VITE_*)
const { push, pull, auth } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export { push, pull, auth };
