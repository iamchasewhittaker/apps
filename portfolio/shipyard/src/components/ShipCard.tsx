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
  if (score >= 50) return 'bg-gold';
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
      className="group block rounded-lg border border-dimmer bg-surface p-4 transition-colors hover:border-steel/60"
    >
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <h3 className="truncate font-display text-base text-white group-hover:text-steel">
          {project.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 font-mono-label text-[9px] ${TYPE_COLORS[project.type] ?? 'bg-dimmer/60 text-dim'}`}
        >
          {project.type}
        </span>
      </div>

      {/* MVP step chip */}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded border border-steel/30 bg-steel/10 px-2 py-0.5 font-mono-label text-[9px] text-steel">
          {project.mvp_step != null ? `${project.mvp_step}` : '?'} &middot; {stepLabel}
        </span>
      </div>

      {/* Meta row */}
      <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-label text-[10px] text-dim">
        {/* Days since commit */}
        <span>
          {project.days_since_commit != null
            ? `${project.days_since_commit}d ago`
            : 'no commits'}
        </span>

        {/* Live URL badge */}
        <span className="flex items-center gap-1">
          {project.has_live_url ? (
            <>
              <span className="text-success">&#10003;</span>
              <span className="text-success">live</span>
            </>
          ) : (
            <>
              <span className="text-dim/60">&#10005;</span>
              <span className="text-dim/60">no url</span>
            </>
          )}
        </span>

        {/* Linear link */}
        {project.linear_project_url && (
          <span
            className="text-dim/60 hover:text-white"
            title="Linear project"
          >
            &#128279;
          </span>
        )}
      </div>

      {/* Opened / build indicator */}
      {project.days_since_opened != null &&
        project.days_since_opened !== project.days_since_commit && (
          <div className="mb-3 flex items-center gap-x-2 font-mono-label text-[10px] text-dim/60">
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
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-dimmer/60">
        <div
          className={`h-full rounded-full transition-all ${scoreColor(project.compliance_score)}`}
          style={{ width: `${Math.min(project.compliance_score, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-right font-mono-label text-[9px] text-dim/70">
        {Math.round(project.compliance_score)}%
      </p>
    </Link>
  );
}
