// Supabase sync for Wellness Tracker.
// Wires createSync() with this app's env vars.
// If .env is missing or incomplete, createSync() gracefully falls back
// to localStorage-only mode (no crash, just a console.warn).
// shared/sync.js is symlinked into src/shared/ so CRA's webpack can resolve it
// (CRA blocks imports outside src/ — symlink is the cleanest workaround)
import { createSync } from './shared/sync.js';

export const APP_KEY = 'wellness';
export const APP_NAME = 'wellness';
export const DEFAULT_CANONICAL_PATH = '/wellness';

// CRA exposes env vars via process.env.REACT_APP_* (not import.meta.env.VITE_*)
const { push, pull, auth, emailRedirectTo } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    appName: APP_NAME,
    canonicalPath: process.env.REACT_APP_AUTH_APP_PATH || DEFAULT_CANONICAL_PATH,
  }
);

export { push, pull, auth, emailRedirectTo };
