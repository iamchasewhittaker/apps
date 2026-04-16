/**
 * /portfolio/shared/sync.js (monorepo)
 * Offline-first Supabase sync layer for all apps.
 *
 * Usage (after copying this file to the app as src/shared/sync.js):
 *   import { createSync } from './shared/sync';
 *   export const { push, pull, auth, emailRedirectTo } = createSync(
 *     process.env.REACT_APP_SUPABASE_URL,
 *     process.env.REACT_APP_SUPABASE_ANON_KEY,
 *     { appName: 'my-app' }
 *   );
 *
 * Config options (all optional):
 *   appName             string — used in debug logs (default: 'app')
 *   canonicalOrigin     string — if set, non-canonical origins are redirected here
 *   canonicalPath       string — path within canonicalOrigin (e.g. '/')
 *   storageKey          string — localStorage key for auth session (default: 'chase_portfolio_auth_token')
 *
 * Environment variables (CRA apps use REACT_APP_ prefix):
 *   REACT_APP_SUPABASE_URL
 *   REACT_APP_SUPABASE_ANON_KEY
 *   REACT_APP_AUTH_CANONICAL_ORIGIN   (optional)
 *   REACT_APP_AUTH_APP_PATH           (optional)
 *   REACT_APP_AUTH_DEBUG              (optional, set to '1' for debug logs)
 *
 * Supabase table (run once in the SQL editor):
 *   create table user_data (
 *     id         uuid primary key default gen_random_uuid(),
 *     user_id    uuid references auth.users(id) on delete cascade not null,
 *     app_key    text not null,
 *     data       jsonb not null default '{}',
 *     updated_at timestamptz not null default now(),
 *     unique (user_id, app_key)
 *   );
 *   alter table user_data enable row level security;
 *   create policy "own data only" on user_data for all
 *     using (auth.uid() = user_id) with check (auth.uid() = user_id);
 *   create or replace function set_updated_at()
 *     returns trigger language plpgsql as $$
 *     begin new.updated_at = now(); return new; end; $$;
 *   create trigger user_data_updated_at before update on user_data
 *     for each row execute function set_updated_at();
 *
 * Known app_key values in this monorepo:
 *   wellness, job-search, roller_task_tycoon_v1 (archived web), clarity_budget (Clarity Budget web + future iOS Supabase)
 */

import {
  createPortfolioAuthClient,
  getAuthConfig,
  getEmailRedirectUrl,
  maybeRedirectToCanonical,
} from './auth';

/**
 * Create a sync instance bound to a specific Supabase project.
 * Each app calls this once at the top of its sync.js file.
 */
export function createSync(supabaseUrl, supabaseKey, config = {}) {
  const authConfig = getAuthConfig(config);
  const emailRedirectTo = getEmailRedirectUrl(authConfig);

  maybeRedirectToCanonical(authConfig);

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[sync] Missing Supabase credentials — running in localStorage-only mode.');
    return {
      push: async () => {},
      pull: async (appKey, localData) => localData,
      auth: null,
      emailRedirectTo,
    };
  }

  const sb = createPortfolioAuthClient(supabaseUrl, supabaseKey, authConfig);

  async function getUser() {
    const { data: { user } } = await sb.auth.getUser();
    return user;
  }

  /**
   * push(appKey, data)
   * Fire-and-forget — writes data blob to Supabase in the background.
   * Always call your local save() first, then push().
   * Never blocks the UI; silently no-ops if not logged in.
   */
  async function push(appKey, data) {
    try {
      const user = await getUser();
      if (!user) return;
      const { error } = await sb
        .from('user_data')
        .upsert(
          { user_id: user.id, app_key: appKey, data },
          { onConflict: 'user_id,app_key' }
        );
      if (error) console.warn('[sync] push failed:', error.message);
    } catch (e) {
      console.warn('[sync] push error:', e.message);
    }
  }

  /**
   * pull(appKey, localData, localTimestamp)
   * Call on app startup after loading from localStorage.
   * Returns remote data if it's newer than localTimestamp,
   * otherwise returns localData unchanged.
   *
   * localTimestamp = localData._syncAt (ms since epoch),
   * written by save() in your storage helpers.
   * If remote is newer, caller should update localStorage with the returned data.
   */
  async function pull(appKey, localData, localTimestamp) {
    try {
      const user = await getUser();
      if (!user) return localData;

      const { data: row, error } = await sb
        .from('user_data')
        .select('data, updated_at')
        .eq('user_id', user.id)
        .eq('app_key', appKey)
        .single();

      if (error || !row) return localData;

      const remoteTs = new Date(row.updated_at).getTime();
      if (remoteTs > (localTimestamp || 0)) {
        console.log('[sync] remote is newer — hydrating from Supabase');
        return row.data;
      }
      return localData;
    } catch (e) {
      console.warn('[sync] pull error:', e.message);
      return localData;
    }
  }

  return { push, pull, auth: sb.auth, emailRedirectTo };
}
