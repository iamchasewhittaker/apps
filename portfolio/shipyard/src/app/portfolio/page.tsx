export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import PortfolioActions from './PortfolioActions';
import type { Project } from '@/lib/types';

export default async function PortfolioPage() {
  const supabase = await createServerClient();

  const { data: launchedShips } = await supabase
    .from('projects')
    .select('*')
    .gte('mvp_step_actual', 5)
    .eq('has_live_url', true)
    .order('last_commit_date', { ascending: false });

  const ships: Project[] = launchedShips ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-accent">
            The Fleet Showcase
          </h1>
          <p className="text-sm text-muted">
            Launched ships ready for the world. Step 5+ with a live URL.
          </p>
        </div>
        <PortfolioActions />
      </div>

      {ships.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-lg font-medium text-muted">
            No ships launched yet. Keep building!
          </p>
          <p className="mt-1 text-sm text-muted/70">
            Ships appear here once they reach MVP step 5 and have a live URL.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ships.map((ship) => (
            <ShowcaseCard key={ship.slug} ship={ship} />
          ))}
        </div>
      )}
    </div>
  );
}

function ShowcaseCard({ ship }: { ship: Project }) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{ship.name}</h3>
        {ship.jtbd_primary && (
          <p className="text-xs text-muted leading-relaxed">
            {ship.jtbd_primary}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {ship.tech_stack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-muted"
            >
              {tech}
            </span>
          ))}
      </div>

      {ship.live_url && (
        <a
          href={ship.live_url.startsWith('http') ? ship.live_url : `https://${ship.live_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center rounded-md border border-success bg-success/10 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success/20"
        >
          View Live
        </a>
      )}
    </div>
  );
}
