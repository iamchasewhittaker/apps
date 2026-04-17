export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { computeChipState, chipColor, chipLabel } from '@/lib/review-cadence';
import { STEP_LABELS, STEP_NAUTICAL } from '@/lib/mvp-step';
import StatsBar from '@/components/StatsBar';
import WipBanner from '@/components/WipBanner';
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
  const supabase = createServerClient();

  const [{ data: allProjects }, { data: cadenceRows }] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .order('last_commit_date', { ascending: false }),
    supabase.from('review_cadence').select('*'),
  ]);

  const projects: Project[] = allProjects ?? [];
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
      <h1 className="text-2xl font-bold tracking-tight text-accent">
        Fleet Dashboard
      </h1>

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
  stalled: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  frozen: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  archived: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
};

const TYPE_COLORS: Record<string, string> = {
  web: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ios: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  library: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  cli: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  desktop: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

function ShipCard({ project }: { project: Project }) {
  const step = project.mvp_step_actual ?? project.mvp_step ?? 0;
  const stepLabel = STEP_LABELS[step] ?? `Step ${step}`;
  const nautical = STEP_NAUTICAL[step] ?? '';

  return (
    <Link
      href={`/ship/${project.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent/50"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
          {project.name}
        </h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[project.status] ?? ''}`}
        >
          {project.status}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[project.type] ?? ''}`}
        >
          {project.type}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted">
          {project.family}
        </span>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          {stepLabel} &middot; {nautical}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between text-xs text-muted">
        <span>
          Compliance:{' '}
          <span
            className={
              project.compliance_score >= 80
                ? 'text-success'
                : project.compliance_score >= 50
                  ? 'text-warning'
                  : 'text-danger'
            }
          >
            {Math.round(project.compliance_score)}%
          </span>
        </span>
        {project.days_since_commit !== null && (
          <span>
            {project.days_since_commit === 0
              ? 'Today'
              : `${project.days_since_commit}d ago`}
          </span>
        )}
      </div>
    </Link>
  );
}
