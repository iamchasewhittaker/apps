import Link from 'next/link';
import type { Project } from '@/lib/types';
import { STEP_LABELS } from '@/lib/mvp-step';

interface Props {
  project: Project;
}

const TYPE_COLORS: Record<string, string> = {
  web: 'bg-blue-500/20 text-blue-300',
  ios: 'bg-purple-500/20 text-purple-300',
  library: 'bg-teal-500/20 text-teal-300',
  cli: 'bg-orange-500/20 text-orange-300',
  desktop: 'bg-pink-500/20 text-pink-300',
};

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
}

export default function ShipCard({ project }: Props) {
  const stepLabel =
    project.mvp_step != null
      ? STEP_LABELS[project.mvp_step] ?? `Step ${project.mvp_step}`
      : 'Unknown';

  return (
    <Link
      href={`/ship/${project.slug}`}
      className="group block rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm p-6 transition-all hover:border-gold/30 hover:-translate-y-0.5 hover:shadow-lg"
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

      {/* MVP step chip */}
      <div className="mb-4">
        <span className="rounded-md border border-gold/20 bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">
          {project.mvp_step != null ? `Step ${project.mvp_step}` : '?'} &middot; {stepLabel}
        </span>
      </div>

      {/* Meta row */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-steel">
        <span>
          {project.days_since_commit != null
            ? `${project.days_since_commit}d ago`
            : 'no commits'}
        </span>

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

        {project.linear_project_url && (
          <span className="text-steel hover:text-white" title="Linear project">
            &#128279;
          </span>
        )}
      </div>

      {/* Build / deploy indicator */}
      {project.days_since_opened != null &&
        project.days_since_opened !== project.days_since_commit && (
          <div className="mb-4 flex items-center gap-x-2 text-sm text-steel">
            <span>
              {project.type === 'ios' ? 'built' : 'deployed'}:{' '}
              {project.days_since_opened === 0
                ? 'today'
                : `${project.days_since_opened}d ago`}
            </span>
            {project.type === 'ios' && project.last_device_deploy_at && (
              <span className="text-purple-400" title="Device build">
                &#9679;
              </span>
            )}
          </div>
        )}

      {/* Compliance bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-dimmer">
        <div
          className={`h-full rounded-full transition-all ${scoreColor(project.compliance_score)}`}
          style={{ width: `${Math.min(project.compliance_score, 100)}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between">
        <span className="text-xs text-steel">Compliance</span>
        <span className="text-xs font-medium text-white">
          {Math.round(project.compliance_score)}%
        </span>
      </div>
    </Link>
  );
}
