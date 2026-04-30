import Link from 'next/link';
import { STEP_LABELS } from '@/lib/mvp-step';
import type { Project } from '@/lib/types';

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

interface ShipCardProps {
  project: Project;
  highlight?: boolean;
}

export function ShipCard({ project, highlight }: ShipCardProps) {
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

  const borderClass = highlight
    ? 'border-gold bg-gold/5 hover:border-gold/60'
    : 'border-dimmer hover:border-gold/30';

  return (
    <Link
      href={`/ship/${project.slug}`}
      className={`group relative overflow-hidden flex flex-col rounded-xl border ${borderClass} bg-surface/80 backdrop-blur-sm p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
    >
      {/* Header */}
      {highlight && (
        <span className="mb-1 inline-block w-fit rounded-full border border-gold/40 bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
          Active Focus
        </span>
      )}
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg text-white leading-snug group-hover:text-gold transition-colors truncate min-w-0">
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
