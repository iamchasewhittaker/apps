export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { computeChipState, chipColor, chipLabel } from '@/lib/review-cadence';
import { STEP_LABELS } from '@/lib/mvp-step';
import StatsBar from '@/components/StatsBar';
import WipBanner from '@/components/WipBanner';
import DailyScoreboard from '@/components/DailyScoreboard';
import RecentWins from '@/components/RecentWins';
import { filterByVisible } from '@/lib/visible-projects';
import { readVisibleSetFromCookie } from '@/lib/visible-projects-server';
import type { Project, FleetStats, ReviewCadence, ReviewChip } from '@/lib/types';

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

  const [{ data: allProjects }, { data: cadenceRows }, visibleSet] =
    await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .order('last_commit_date', { ascending: false }),
      supabase.from('review_cadence').select('*'),
      readVisibleSetFromCookie(),
    ]);

  const projects: Project[] = filterByVisible(allProjects ?? [], visibleSet);
  const cadences: ReviewCadence[] = cadenceRows ?? [];

  // Compute fleet stats
  const stats: FleetStats = {
    total: projects.length,
    building: projects.filter(
      (p) => p.mvp_step_actual === 4 && p.status === 'active',
    ).length,
    shipped: projects.filter((p) => (p.mvp_step_actual ?? 0) >= 5).length,
    drydock: projects.filter((p) => p.status === 'stalled').length,
    archived: projects.filter((p) => p.status === 'archived').length,
    compliance_avg:
      projects.length > 0
        ? projects.reduce((sum, p) => sum + p.compliance_score, 0) /
          projects.length
        : 0,
  };

  // Compute review chips
  const chips: ReviewChip[] = cadences.map(computeChipState);

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

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="font-mono-label text-xs text-dim">PORT INSPECTION</p>
        <h1 className="font-display text-5xl text-white gold-rule inline-block">
          FLEET DASHBOARD
        </h1>
      </div>

      <DailyScoreboard />

      <RecentWins />

      <StatsBar stats={stats} />
      <WipBanner wipCount={stats.building} />

      {/* Review countdown chips */}
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

      {/* Filter bar */}
      <FilterBar current={sp} projects={projects} />

      {/* Ship cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ShipCard key={project.slug} project={project} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-muted">
            No ships match the current filters.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Filter Bar ─────────────────────────────────────────────── */

function FilterBar({
  current,
  projects,
}: {
  current: Record<string, string | undefined>;
  projects: Project[];
}) {
  const types = [...new Set(projects.map((p) => p.type))].sort();
  const families = [...new Set(projects.map((p) => p.family))].sort();
  const statuses = [...new Set(projects.map((p) => p.status))].sort();

  function buildHref(key: string, value: string) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(current)) {
      if (v && k !== key) params.set(k, v);
    }
    if (current[key] !== value) params.set(key, value);
    const qs = params.toString();
    return qs ? `/?${qs}` : '/';
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted">
        Filters
      </span>

      {/* Type filters */}
      {types.map((t) => (
        <Link
          key={`type-${t}`}
          href={buildHref('type', t)}
          className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
            current.type === t
              ? 'border-accent bg-accent/20 text-accent'
              : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
          }`}
        >
          {t}
        </Link>
      ))}

      <span className="text-border">|</span>

      {/* Family filters */}
      {families.map((f) => (
        <Link
          key={`family-${f}`}
          href={buildHref('family', f)}
          className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
            current.family === f
              ? 'border-accent bg-accent/20 text-accent'
              : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
          }`}
        >
          {f}
        </Link>
      ))}

      <span className="text-border">|</span>

      {/* Status filters */}
      {statuses.map((s) => (
        <Link
          key={`status-${s}`}
          href={buildHref('status', s)}
          className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
            current.status === s
              ? 'border-accent bg-accent/20 text-accent'
              : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
          }`}
        >
          {s}
        </Link>
      ))}

      <span className="text-border">|</span>

      {/* Live URL toggle */}
      <Link
        href={buildHref('has_live_url', 'true')}
        className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
          current.has_live_url === 'true'
            ? 'border-success bg-success/20 text-success'
            : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
        }`}
      >
        Live
      </Link>
      <Link
        href={buildHref('has_live_url', 'false')}
        className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
          current.has_live_url === 'false'
            ? 'border-danger bg-danger/20 text-danger'
            : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
        }`}
      >
        No URL
      </Link>

      {/* Clear all */}
      {Object.values(current).some(Boolean) && (
        <Link
          href="/"
          className="ml-2 text-xs text-muted underline underline-offset-2 hover:text-foreground"
        >
          Clear all
        </Link>
      )}
    </div>
  );
}

/* ── Ship Card ──────────────────────────────────────────────── */

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-success/20 text-success border-success/30',
  stalled: 'bg-warning/20 text-warning border-warning/30',
  frozen: 'bg-steel/20 text-steel border-steel/30',
  archived: 'bg-dimmer/60 text-steel border-dimmer/60',
};

const TYPE_COLORS: Record<string, string> = {
  web: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ios: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  library: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  cli: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  desktop: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
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

  return (
    <Link
      href={`/ship/${project.slug}`}
      className="group flex flex-col rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm p-6 transition-all hover:border-gold/30 hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg text-white leading-snug group-hover:text-gold transition-colors">
          {project.name}
        </h3>
        <span
          className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[project.status] ?? ''}`}
        >
          {project.status}
        </span>
      </div>

      {/* Type + family + step chips */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <span
          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${TYPE_COLORS[project.type] ?? ''}`}
        >
          {project.type}
        </span>
        <span className="rounded-lg border border-dimmer px-2.5 py-1 text-xs font-medium text-steel">
          {project.family}
        </span>
        <span className="rounded-md border border-gold/20 bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">
          {stepLabel}
        </span>
      </div>

      {/* Meta: commit age + live status */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-steel">
        {project.days_since_commit !== null && (
          <span>
            {project.days_since_commit === 0 ? 'Today' : `${project.days_since_commit}d ago`}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          {project.has_live_url ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-success shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
              <span className="text-success">live</span>
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-danger" />
              <span className="text-steel">no url</span>
            </>
          )}
        </span>
      </div>

      {/* Build / deploy line */}
      {project.days_since_opened !== null &&
        project.days_since_opened !== project.days_since_commit && (
          <div className="mb-4 flex items-center gap-x-2 text-sm text-steel">
            <span>
              {project.type === 'ios' ? 'built' : 'deployed'}:{' '}
              {project.days_since_opened === 0 ? 'today' : `${project.days_since_opened}d ago`}
            </span>
            {project.type === 'ios' && project.last_device_deploy_at && (
              <span className="text-purple-400" title="Device build">&#9679;</span>
            )}
          </div>
        )}

      {/* Compliance bar */}
      <div className="mt-auto">
        <div className="h-2 w-full overflow-hidden rounded-full bg-dimmer">
          <div
            className={`h-full rounded-full transition-all ${scoreColor(project.compliance_score)}`}
            style={{ width: `${Math.min(project.compliance_score, 100)}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="text-xs text-steel">Compliance</span>
          <span className="text-xs font-medium text-white">{Math.round(project.compliance_score)}%</span>
        </div>
      </div>
    </Link>
  );
}
