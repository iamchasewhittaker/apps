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
        className={stats.building > 1 ? 'text-red-400' : undefined}
      />
      <StatCard label="Launched" value={stats.shipped} className="text-emerald-400" />
      <StatCard label="In Drydock" value={stats.drydock} className="text-amber-400" />
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
    <div className="rounded-lg border border-slate-700/60 bg-[#131b2e] px-4 py-3">
      <p className={`text-2xl font-bold ${className ?? 'text-slate-100'}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
