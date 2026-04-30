import type { FleetStats } from '@/lib/types';

interface Props {
  stats: FleetStats;
}

export default function StatsBar({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
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
    <div className="rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm px-6 py-5 transition-colors hover:border-gold/20">
      <p className={`font-display text-4xl font-bold ${className ?? 'text-white'}`}>
        {value}
      </p>
      <p className="text-sm text-steel mt-2">{label}</p>
    </div>
  );
}
