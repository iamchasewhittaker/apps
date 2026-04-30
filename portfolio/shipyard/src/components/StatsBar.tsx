'use client';

import { useLabel } from '@/components/ModeProvider';
import type { FleetStats } from '@/lib/types';

interface Props {
  stats: FleetStats;
}

export default function StatsBar({ stats }: Props) {
  const totalLabel = useLabel('totalShips');
  const launchedLabel = useLabel('launched');
  const inProgressLabel = useLabel('inProgressLabel');
  const reviewsLabel = useLabel('reviewsDue');

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label={totalLabel} value={stats.total} />
      <StatCard
        label={launchedLabel}
        value={stats.shipped}
        valueClassName="text-success"
      />
      <StatCard
        label={inProgressLabel}
        value={stats.in_progress}
        valueClassName="text-gold"
      />
      <StatCard
        label={reviewsLabel}
        value={stats.reviews_due}
        valueClassName={stats.reviews_due > 0 ? 'text-warning' : 'text-white'}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number | string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm px-6 py-5 transition-colors hover:border-gold/20">
      <p className={`text-4xl font-bold leading-none ${valueClassName ?? 'text-white'}`}>
        {value}
      </p>
      <p className="text-sm text-steel mt-2">{label}</p>
    </div>
  );
}
