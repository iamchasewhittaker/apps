export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import { computeChipState, chipColor, chipLabel } from '@/lib/review-cadence';
import StatsBar from '@/components/StatsBar';
import DailyScoreboard from '@/components/DailyScoreboard';
import RecentWins from '@/components/RecentWins';
import { DashboardHeading } from '@/components/DashboardHeading';
import { ActiveShipPanel } from '@/components/ActiveShipPanel';
import { ReviewsDuePanel } from '@/components/ReviewsDuePanel';
import { ShipCard } from '@/components/ShipCard';
import { filterByVisible } from '@/lib/visible-projects';
import { readVisibleSetFromCookie } from '@/lib/visible-projects-server';
import type { Project, FleetStats, ReviewCadence, ReviewChip, WipDecision } from '@/lib/types';

function formatRelative(iso: string | null | undefined): string {
  if (!iso) return 'never';
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const d = Math.floor(hr / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

export default async function FleetDashboard() {
  const supabase = await createServerClient();

  const [{ data: allProjects }, { data: cadenceRows }, { data: wipRows }, visibleSet] =
    await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .order('last_commit_date', { ascending: false }),
      supabase.from('review_cadence').select('*'),
      supabase
        .from('wip_decisions')
        .select('*')
        .order('decided_at', { ascending: false })
        .limit(1),
      readVisibleSetFromCookie(),
    ]);

  const projects: Project[] = filterByVisible(allProjects ?? [], visibleSet);
  const cadences: ReviewCadence[] = cadenceRows ?? [];

  const chips: ReviewChip[] = cadences.map(computeChipState);
  const reviewsDue = chips.filter(
    (c) => c.state === 'amber' || c.state === 'red',
  ).length;

  const stats: FleetStats = {
    total: projects.length,
    shipped: projects.filter((p) => (p.mvp_step_actual ?? 0) >= 5).length,
    in_progress: projects.filter(
      (p) =>
        (p.mvp_step_actual ?? 0) >= 1 &&
        (p.mvp_step_actual ?? 0) <= 4 &&
        p.status === 'active',
    ).length,
    reviews_due: reviewsDue,
    building: projects.filter(
      (p) => p.mvp_step_actual === 4 && p.status === 'active',
    ).length,
    drydock: projects.filter((p) => p.status === 'stalled').length,
    archived: projects.filter((p) => p.status === 'archived').length,
    compliance_avg:
      projects.length > 0
        ? projects.reduce((sum, p) => sum + p.compliance_score, 0) /
          projects.length
        : 0,
  };

  const lastSynced = projects.reduce<string | null>((latest, p) => {
    if (!p.updated_at) return latest;
    if (!latest || new Date(p.updated_at) > new Date(latest)) return p.updated_at;
    return latest;
  }, null);

  const wipDecisions: WipDecision[] = wipRows ?? [];
  const activeSlug = wipDecisions[0]?.active_slug ?? null;
  const activeProject =
    (activeSlug && projects.find((p) => p.slug === activeSlug)) || null;
  const activeDaysSinceUpdate = activeProject?.days_since_commit ?? null;

  const staleProjects: Project[] = projects
    .filter((p) => p.status === 'active')
    .slice()
    .sort(
      (a, b) =>
        (b.days_since_commit ?? -1) - (a.days_since_commit ?? -1),
    )
    .slice(0, 4);

  // Recently active: 3 most recent by commit, excluding the active ship
  const recentlyActive: Project[] = projects
    .filter((p) => p.status === 'active' && p.slug !== activeSlug)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <DashboardHeading
        total={stats.total}
        lastSyncedRelative={formatRelative(lastSynced)}
      />

      <StatsBar stats={stats} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ActiveShipPanel
          project={activeProject}
          daysSinceUpdate={activeDaysSinceUpdate}
        />
        <ReviewsDuePanel staleProjects={staleProjects} />
      </div>

      {recentlyActive.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
            Recently Active
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentlyActive.map((project) => (
              <ShipCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6 pt-4">
        <DailyScoreboard />
        <RecentWins />

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.kind}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${chipColor(chip.state)}`}
              >
                {chipLabel(chip)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
