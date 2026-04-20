export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import { QueueList } from './QueueList';
import { ModeHeading } from '@/components/ModeHeading';
import type { Project, WipDecision } from '@/lib/types';

export default async function WipPage() {
  const supabase = await createServerClient();

  const [{ data: projects }, { data: recentDecisions }] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .in('status', ['active', 'stalled'])
      .order('last_commit_date', { ascending: false }),
    supabase
      .from('wip_decisions')
      .select('*')
      .order('decided_at', { ascending: false })
      .limit(5),
  ]);

  const ships: Project[] = projects ?? [];
  const decisions: WipDecision[] = recentDecisions ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <ModeHeading
        labelKey="wip"
        subtitle="All active ships. Pin the one you're focused on, rank the rest."
      />

      {ships.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted">
            No active ships. Run a scan to populate the fleet.
          </p>
        </div>
      ) : (
        <QueueList ships={ships} />
      )}

      {decisions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Past Decisions
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Active Ship</th>
                  <th className="px-4 py-2.5 font-medium">Moved to Drydock</th>
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
