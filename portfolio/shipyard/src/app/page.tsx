export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { computeChipState, chipColor, chipLabel } from '@/lib/review-cadence';
import { STEP_LABELS } from '@/lib/mvp-step';
import StatsBar from '@/components/StatsBar';
import DailyScoreboard from '@/components/DailyScoreboard';
import RecentWins from '@/components/RecentWins';
import { DashboardHeading } from '@/components/DashboardHeading';
import { ActiveShipPanel } from '@/components/ActiveShipPanel';
import { ReviewsDuePanel } from '@/components/ReviewsDuePanel';
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

interface Props {
  searchParams: Promise<{
    type?: string;
    family?: string;
    status?: string;
    has_live_url?: string;
  }>;
}

export default async function FleetDashboard({ searchParams }: Props) {
  const sp = await searchParams;
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

  // Compute review chips first so we can count overdue reviews
  const chips: ReviewChip[] = cadences.map(computeChipState);
  const reviewsDue = chips.filter(
    (c) => c.state === 'amber' || c.state === 'red',
  ).length;

  // Compute fleet stats
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

  // Apply filters
  let filtered = projects;
  if (sp.type) {
    filtered = filtered.filter((p) => p.type === sp.type);
  }
  if (sp.family) {
    filtered = filtered.filter((p) => p.family === sp.family);
  }
  if (sp.status) {
    filtered = filtered.filter((p) => p.status === sp.status);
  }
  if (sp.has_live_url === 'true') {
    filtered = filtered.filter((p) => p.has_live_url);
  } else if (sp.has_live_url === 'false') {
    filtered = filtered.filter((p) => !p.has_live_url);
  }

  const lastSynced = projects.reduce<string | null>((latest, p) => {
    if (!p.updated_at) return latest;
    if (!latest || new Date(p.updated_at) > new Date(latest)) return p.updated_at;
    return latest;
  }, null);

  // Active ship: most recent WIP pick
  const wipDecisions: WipDecision[] = wipRows ?? [];
  const activeSlug = wipDecisions[0]?.active_slug ?? null;
  const activeProject =
    (activeSlug && projects.find((p) => p.slug === activeSlug)) || null;
  const activeDaysSinceUpdate = activeProject?.days_since_commit ?? null;

  // Reviews Due (proxy): top 4 active projects by days_since_commit desc
  const staleProjects: Project[] = projects
    .filter((p) => p.status === 'active')
    .slice()
    .sort(
      (a, b) =>
        (b.days_since_commit ?? -1) - (a.days_since_commit ?? -1),
    )
    .slice(0, 4);

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

      {/* Filter bar */}
      <FilterBar current={sp} projects={projects} />

      {/* Ship cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ShipCard key={project.slug} project={project} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-steel">
            No projects match the current filters.
          </p>
        )}
      </div>

      {/* Supplementary widgets */}
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

/* ── Filter Bar ─────────────────────────────────────────────── */

const TYPE_OPTIONS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'ios', label: 'iOS' },
  { key: 'cli', label: 'CLI' },
  { key: 'library', label: 'Library' },
  { key: 'desktop', label: 'Desktop' },
];

function FilterBar({
  current,
  projects,
}: {
  current: Record<string, string | undefined>;
  projects: Project[];
}) {
  const counts: Record<string, number> = { all: projects.length };
  for (const p of projects) {
    counts[p.type] = (counts[p.type] ?? 0) + 1;
  }

  function buildHref(key: string, value: string) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(current)) {
      if (v && k !== key) params.set(k, v);
    }
    if (value && value !== 'all' && current[key] !== value) {
      params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  }

  const activeType = current.type ?? 'all';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TYPE_OPTIONS.map((opt) => {
        const isActive = activeType === opt.key;
        const count = counts[opt.key] ?? 0;
        if (count === 0 && opt.key !== 'all') return null;
        return (
          <Link
            key={opt.key}
            href={buildHref('type', opt.key)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all min-h-[44px] ${
              isActive
                ? 'border-gold bg-gold/15 text-gold'
                : 'border-dimmer bg-surface/50 text-steel hover:border-gold/30 hover:text-white'
            }`}
          >
            {opt.label}
            <span
              className={`rounded-md px-1.5 py-0.5 text-xs ${
                isActive ? 'bg-gold text-bg' : 'bg-white/10 text-steel'
              }`}
            >
              {count}
            </span>
          </Link>
        );
      })}

      <select
        defaultValue="recent"
        className="ml-auto min-h-[44px] rounded-lg border border-dimmer bg-surface/50 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-gold/50"
        aria-label="Sort"
      >
        <option value="recent">Sort: Recent</option>
        <option value="name">Sort: Name</option>
        <option value="compliance">Sort: Compliance</option>
      </select>
    </div>
  );
}

/* ── Ship Card ──────────────────────────────────────────────── */

const TYPE_COLORS: Record<string, string> = {
  web: 'bg-blue-500/15 text-blue-300',
  ios: 'bg-purple-500/15 text-purple-300',
  library: 'bg-teal-500/15 text-teal-300',
  cli: 'bg-orange-500/15 text-orange-300',
  desktop: 'bg-pink-500/15 text-pink-300',
};

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
}

function ShipCard({ project }: { project: Project }) {
  const step = project.mvp_step_actual ?? project.mvp_step ?? 0;
  const stepName = STEP_LABELS[step];
  const stepLabel = stepName ? `Step ${step} · ${stepName}` : `Step ${step}`;

  type StatusKind = 'live' | 'local' | 'no-url';
  const statusKind: StatusKind = project.has_live_url
    ? 'live'
    : project.type === 'ios' || (project.local_port != null)
      ? 'local'
      : 'no-url';
  const statusLabel = statusKind === 'live' ? 'Live' : statusKind === 'local' ? 'Local' : 'No URL';
  const dotClass =
    statusKind === 'live'
      ? 'bg-success shadow-[0_0_6px_rgba(52,211,153,0.7)]'
      : statusKind === 'local'
        ? 'bg-warning shadow-[0_0_6px_rgba(251,191,36,0.7)]'
        : 'bg-danger';

  const compliance = Math.round(project.compliance_score);

  return (
    <Link
      href={`/ship/${project.slug}`}
      className="group relative overflow-hidden flex flex-col rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm p-6 transition-all hover:border-gold/30 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg text-white leading-snug group-hover:text-gold transition-colors">
          {project.name}
        </h3>
        <span
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${TYPE_COLORS[project.type] ?? 'bg-dimmer text-steel'}`}
        >
          {project.type}
        </span>
      </div>

      {/* Step line */}
      <p className="mb-4 text-sm text-steel">{stepLabel}</p>

      {/* Meta row */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-steel">
        <span className="flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full ${dotClass}`} />
          <span className={statusKind === 'live' ? 'text-success' : statusKind === 'local' ? 'text-warning' : ''}>
            {statusLabel}
          </span>
        </span>
        {project.days_since_commit !== null && (
          <span>
            {project.days_since_commit === 0 ? 'Today' : `${project.days_since_commit}d ago`}
          </span>
        )}
        {project.linear_project_url && <span>Linear</span>}
      </div>

      {/* Compliance bar */}
      <div className="mt-auto">
        <div className="h-2 w-full overflow-hidden rounded-full bg-dimmer">
          <div
            className={`h-full rounded-full transition-all ${scoreColor(project.compliance_score)}`}
            style={{ width: `${Math.min(compliance, 100)}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-sm">
          <span className="text-steel">Compliance</span>
          <span className="font-medium text-white">{compliance}%</span>
        </div>
      </div>
    </Link>
  );
}
