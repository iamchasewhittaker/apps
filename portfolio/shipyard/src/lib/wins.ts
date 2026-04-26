import { createServerClient } from './supabase';

export interface JobSearchWin {
  id: string;
  date: string;
  type: 'response' | 'progression' | 'daily_target' | 'manual';
  title: string;
  note?: string;
  source?: string;
  autoLogged?: boolean;
}

export interface RecentWinsResult {
  count: number;
  recent: JobSearchWin[];
  windowDays: number;
}

// Reads the latest job-search blob from Supabase user_data and returns
// wins logged in the trailing N days. Single-tenant assumption: the
// portfolio Supabase project has one user (Chase). Service role bypasses
// RLS, so we can read by app_key alone.
export async function getRecentWins(days = 7): Promise<RecentWinsResult> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('user_data')
    .select('data')
    .eq('app_key', 'job-search')
    .limit(1)
    .maybeSingle();

  if (error || !data?.data) {
    return { count: 0, recent: [], windowDays: days };
  }

  const wins: JobSearchWin[] = Array.isArray((data.data as { wins?: JobSearchWin[] }).wins)
    ? ((data.data as { wins: JobSearchWin[] }).wins)
    : [];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const filtered = wins
    .filter((w) => (w.date || '') >= cutoffStr && !!w.title)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return {
    count: filtered.length,
    recent: filtered.slice(0, 3),
    windowDays: days,
  };
}
