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
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function ShipCard({ project }: Props) {
  const stepLabel =
    project.mvp_step != null
      ? STEP_LABELS[project.mvp_step] ?? `Step ${project.mvp_step}`
      : 'Unknown';

  return (
    <Link
      href={`/ship/${project.slug}`}
      className="group block rounded-lg border border-slate-700/60 bg-[#131b2e] p-4 transition-colors hover:border-amber-500/40"
    >
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <h3 className="truncate text-sm font-bold text-slate-100 group-hover:text-amber-300">
          {project.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[project.type] ?? 'bg-slate-600/30 text-slate-400'}`}
        >
          {project.type}
        </span>
      </div>

      {/* MVP step chip */}
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
          {project.mvp_step != null ? `${project.mvp_step}` : '?'} &middot; {stepLabel}
        </span>
      </div>

      {/* Meta row */}
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
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
              <span className="text-emerald-400">&#10003;</span>
              <span className="text-emerald-400">live</span>
            </>
          ) : (
            <>
              <span className="text-slate-500">&#10005;</span>
              <span className="text-slate-500">no url</span>
            </>
          )}
        </span>

        {/* Linear link */}
        {project.linear_project_url && (
          <span
            className="text-slate-500 hover:text-slate-300"
            title="Linear project"
          >
            &#128279;
          </span>
        )}
      </div>

      {/* Compliance bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
        <div
          className={`h-full rounded-full transition-all ${scoreColor(project.compliance_score)}`}
          style={{ width: `${Math.min(project.compliance_score, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-right text-[10px] text-slate-500">
        {Math.round(project.compliance_score)}%
      </p>
    </Link>
  );
}
