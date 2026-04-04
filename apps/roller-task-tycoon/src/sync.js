import { createSync } from './shared/sync.js';

export const APP_KEY = 'roller_task_tycoon_v1';

const { push, pull, auth } = createSync(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export { push, pull, auth };
