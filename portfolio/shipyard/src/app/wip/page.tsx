export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import { STEP_LABELS } from '@/lib/mvp-step';
import WipActions from './WipActions';
import type { Project, WipDecision } from '@/lib/types';

export default async function WipPage() {
  const supabase = createServerClient();

  const [{ data: buildShips }, { data: recentDecisions }] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('mvp_step_actual', 4)
      .in('status', ['active', 'stalled'])
      .order('last_commit_date', { ascending: false }),
    supabase
      .from('wip_decisions')
      .select('*')
      .order('decided_at', { ascending: false })
      .limit(5),
  ]);

  const ships: Project[] = buildShips ?? [];
  const decisions: WipDecision[] = recentDecisions ?? [];

  const activeShip = ships.find((s) => s.status === 'active');

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-accent">
          Drydock Gate
        </h1>
        <p className="text-sm text-muted">
          Pick ONE active ship. Others move to drydock (paused).
        </p>
      </div>

      {/* Ships in Build */}
      {ships.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted">
            No ships currently under construction.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Ships in Build ({ships.length})
          </h2>
          <div className="space-y-2">
            {ships.map((ship) => {
              const isActive = activeShip?.slug === ship.slug;
              const daysSince = ship.days_since_commit;

              return (
                <div
                  key={ship.slug}
                  className={`flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors ${
                    isActive
                      ? 'border-accent bg-accent/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {ship.name}
                      </h3>
                      {isActive && (
                        <span className="shrink-0 rounded-full border border-accent/40 bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                          Active Focus
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="rounded border border-border px-1.5 py-0.5">
                        {ship.type}
                      </span>
                      <span>
                        {daysSince !== null
                          ? daysSince === 0
                            ? 'Committed today'
                            : `${daysSince}d since commit`
                          : 'No commits'}
                      </span>
                      <span>
                        Compliance:{' '}
                        <span
                          className={
                            ship.compliance_score >= 80
                              ? 'text-success'
                              : ship.compliance_score >= 50
                                ? 'text-warning'
                                : 'text-danger'
                          }
                        >
                          {Math.round(ship.compliance_score)}%
                        </span>
                      </span>
                    </div>
                  </div>

                  <WipActions slug={ship.slug} isActive={isActive} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Decisions */}
      {decisions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Past Decisions
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Active Ship</th>
                  <th className="px-4 py-2.5 font-medium">
                    Moved to Drydock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {decisions.map((d) => (
                  <tr key={d.id} className="bg-card/50">
                    <td className="whitespace-nowrap px-4 py-2.5 text-muted">
                      {new Date(d.decided_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-accent">
                      {d.active_slug}
                    </td>
                    <td className="px-4 py-2.5 text-muted">
                      {d.stalled_slugs.length > 0
                        ? d.stalled_slugs.join(', ')
                        : '\u2014'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
