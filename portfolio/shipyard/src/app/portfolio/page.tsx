export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import { filterByVisible } from '@/lib/visible-projects';
import { readVisibleSetFromCookie } from '@/lib/visible-projects-server';
import PortfolioActions from './PortfolioActions';
import { ModeHeading } from '@/components/ModeHeading';
import { ShowcaseCard } from './ShowcaseCard';
import type { Project } from '@/lib/types';

export default async function PortfolioPage() {
  const supabase = await createServerClient();

  const [{ data: ships }, visibleSet] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .neq('status', 'archived')
      .neq('family', 'archived')
      .order('last_commit_date', { ascending: false }),
    readVisibleSetFromCookie(),
  ]);

  const fleet: Project[] = filterByVisible(ships ?? [], visibleSet);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <ModeHeading
          labelKey="showcase"
          subtitle="Every active ship in the fleet. Click a card to inspect its design system."
        />
        <PortfolioActions />
      </div>

      {fleet.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-lg font-medium text-muted">No active ships yet.</p>
          <p className="mt-1 text-sm text-muted/70">
            Run <code className="text-accent">npm run sync:projects</code> to pull the fleet from CLAUDE.md.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fleet.map((ship) => (
            <ShowcaseCard key={ship.slug} ship={ship} />
          ))}
        </div>
      )}
    </div>
  );
}

