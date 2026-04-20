import type { FleetStats } from '@/lib/types';

interface Props {
  stats: FleetStats;
}

export default function StatsBar({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      <StatCard label="Total Ships" value={stats.total} />
      <StatCard
        label="Under Construction"
        value={stats.building}
        className={stats.building > 1 ? 'text-danger' : undefined}
      />
      <StatCard label="Launched" value={stats.shipped} className="text-gold" />
      <StatCard label="In Drydock" value={stats.drydock} className="text-steel" />
      <StatCard
        label="Compliance Avg"
        value={`${Math.round(stats.compliance_avg)}%`}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: number | string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border border-dimmer bg-surface px-4 py-3">
      <p className={`font-display text-4xl ${className ?? 'text-white'}`}>
        {value}
      </p>
      <p className="font-mono-label text-xs text-dim mt-1">{label}</p>
    </div>
  );
}
