'use client';

import Link from 'next/link';
import { useLabel } from '@/components/ModeProvider';
import type { Project } from '@/lib/types';

interface Props {
  project: Project | null;
  daysSinceUpdate: number | null;
}

export function ActiveShipPanel({ project, daysSinceUpdate }: Props) {
  const eyebrow = useLabel('activeShip');
  const openLabel = useLabel('openShip');

  if (!project) {
    return (
      <div className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-7 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
          <span className="inline-block w-2 h-2 rounded-full bg-steel" />
          {eyebrow}
        </div>
        <p className="text-base text-steel">
          No focus picked yet. Head to Drydock to choose your active ship.
        </p>
        <Link
          href="/wip"
          className="mt-2 inline-flex items-center gap-2 self-start rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-gold/90 min-h-[44px]"
        >
          Pick Active →
        </Link>
      </div>
    );
  }

  const step = project.mvp_step_actual ?? project.mvp_step ?? 0;
  const compliance = Math.round(project.compliance_score);
  const complianceColor =
    compliance >= 80 ? 'bg-success' : compliance >= 50 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-surface/80 backdrop-blur-sm p-7">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold to-transparent" />

      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold mb-3">
        <span className="inline-block w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
        {eyebrow}
      </div>

      <h2 className="text-2xl font-bold text-white leading-tight mb-2">
        {project.name}
      </h2>
      <p className="text-sm text-steel mb-5">
        Step {step}
        {project.next_action ? ` · ${project.next_action}` : ''}
      </p>

      <div className="mb-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-dimmer">
          <div
            className={`h-full rounded-full ${complianceColor}`}
            style={{ width: `${Math.min(compliance, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-steel">Compliance</span>
          <span className="text-white font-medium">{compliance}%</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-steel mb-5">
        <span>
          Updated {daysSinceUpdate == null ? 'unknown' : daysSinceUpdate === 0 ? 'today' : `${daysSinceUpdate}d ago`}
        </span>
        <span aria-hidden>·</span>
        {project.has_live_url ? (
          <span className="text-success">✓ Live</span>
        ) : (
          <span>No URL</span>
        )}
        {project.linear_project_url && (
          <>
            <span aria-hidden>·</span>
            <a
              href={project.linear_project_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Linear
            </a>
          </>
        )}
      </div>

      <Link
        href={`/ship/${project.slug}`}
        className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-bg transition-all hover:bg-gold/90 hover:-translate-y-0.5 min-h-[44px] shadow-[0_4px_16px_rgba(255,215,0,0.25)]"
      >
        {openLabel} →
      </Link>
    </div>
  );
}
