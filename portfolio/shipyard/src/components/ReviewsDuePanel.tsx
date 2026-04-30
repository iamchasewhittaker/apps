'use client';

import Link from 'next/link';
import { useLabel } from '@/components/ModeProvider';
import type { Project } from '@/lib/types';

interface Props {
  // Top stale projects sorted by days_since_commit desc; max 4 expected
  staleProjects: Project[];
}

type Severity = 'overdue' | 'due_soon' | 'ok';

function severity(daysSinceCommit: number | null): Severity {
  if (daysSinceCommit == null) return 'overdue';
  if (daysSinceCommit >= 14) return 'overdue';
  if (daysSinceCommit >= 7) return 'due_soon';
  return 'ok';
}

const BADGE_CLASSES: Record<Severity, string> = {
  overdue: 'bg-danger/20 text-danger border-danger/30',
  due_soon: 'bg-warning/20 text-warning border-warning/30',
  ok: 'bg-success/20 text-success border-success/30',
};

const BADGE_LABEL: Record<Severity, string> = {
  overdue: 'Overdue',
  due_soon: 'Due soon',
  ok: 'OK',
};

export function ReviewsDuePanel({ staleProjects }: Props) {
  const eyebrow = useLabel('reviewsDue');

  return (
    <div className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-7">
      <div className="text-xs font-bold uppercase tracking-widest text-steel mb-4">
        📋 {eyebrow}
      </div>

      {staleProjects.length === 0 ? (
        <p className="text-sm text-steel">All caught up — no reviews pending.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {staleProjects.map((p) => {
            const sev = severity(p.days_since_commit);
            return (
              <li key={p.slug}>
                <Link
                  href={`/ship/${p.slug}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-dimmer bg-bg/40 px-4 py-3 min-h-[56px] transition-colors hover:border-gold/30 hover:bg-bg/60"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">
                      {p.name}
                    </div>
                    <div className="text-xs text-steel mt-0.5">
                      {p.days_since_commit == null
                        ? 'no commits yet'
                        : `${p.days_since_commit}d since commit`}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold ${BADGE_CLASSES[sev]}`}
                  >
                    {BADGE_LABEL[sev]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Note: per-ship review tracking does not exist in the data model yet.
          This list uses days_since_commit as a proxy until reviews are tracked per ship. */}
    </div>
  );
}
