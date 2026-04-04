// Supabase sync for Wellness Tracker.
// Wires createSync() with this app's env vars.
// If .env is missing or incomplete, createSync() gracefully falls back
// to localStorage-only mode (no crash, just a console.warn).
// shared/sync.js is symlinked into src/shared/ so CRA's webpack can resolve it
// (CRA blocks imports outside src/ — symlink is the cleanest workaround)
import { createSync } from './shared/sync.js';

export const APP_KEY = 'wellness';

// CRA exposes env vars via process.env.REACT_APP_* (not import.meta.env.VITE_*)
const { push, pull, auth } = createSync(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export { push, pull, auth };
