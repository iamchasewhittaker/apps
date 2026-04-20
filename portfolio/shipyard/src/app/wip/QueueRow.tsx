'use client';

import Link from 'next/link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStepLabel } from '@/components/ModeProvider';
import WipActions from './WipActions';
import type { Project } from '@/lib/types';

interface Props {
  ship: Project;
  isActive: boolean;
  draggable: boolean;
}

export function QueueRow({ ship, isActive, draggable }: Props) {
  const stepLabel = useStepLabel(ship.mvp_step_actual ?? 1);
  const daysSince = ship.days_since_commit;

  const sortable = useSortable({ id: ship.slug, disabled: !draggable });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    opacity: sortable.isDragging ? 0.5 : 1,
  };

  const compliance =
    ship.compliance_score >= 80
      ? 'text-success'
      : ship.compliance_score >= 50
        ? 'text-warning'
        : 'text-danger';

  const containerClass = `flex items-center gap-3 rounded-lg border p-4 transition-colors ${
    isActive ? 'border-accent bg-accent/5' : 'border-border bg-card hover:border-accent/40'
  }`;

  return (
    <div
      ref={sortable.setNodeRef}
      style={style}
      className={containerClass}
    >
      {draggable && (
        <button
          {...sortable.attributes}
          {...sortable.listeners}
          className="shrink-0 cursor-grab rounded px-1.5 py-1 text-muted hover:bg-dimmer/40 hover:text-accent active:cursor-grabbing"
          aria-label={`Drag ${ship.name}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </button>
      )}

      <Link
        href={`/portfolio/${ship.slug}`}
        className="min-w-0 flex-1 space-y-1"
      >
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {ship.name}
          </h3>
          {isActive && (
            <span className="shrink-0 rounded-full border border-accent/40 bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              Active Focus
            </span>
          )}
          {ship.category && (
            <span className="shrink-0 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted">
              {ship.category}
            </span>
          )}
        </div>

        {ship.tagline && (
          <p className="truncate text-xs text-muted/80">{ship.tagline}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="rounded border border-border px-1.5 py-0.5">{ship.type}</span>
          <span className="rounded border border-border px-1.5 py-0.5">{stepLabel}</span>
          <span>
            {daysSince !== null
              ? daysSince === 0
                ? 'Committed today'
                : `${daysSince}d since commit`
              : 'No commits'}
          </span>
          <span>
            Compliance:{' '}
            <span className={compliance}>{Math.round(ship.compliance_score)}%</span>
          </span>
        </div>
      </Link>

      <div onClick={(e) => e.stopPropagation()}>
        <WipActions slug={ship.slug} isActive={isActive} />
      </div>
    </div>
  );
}
