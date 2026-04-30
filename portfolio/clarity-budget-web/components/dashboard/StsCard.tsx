function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

interface StsCardProps {
  safeM: number | null;
  safeW: number | null;
  safeD: number | null;
  loading: boolean;
}

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm px-6 py-5 transition-colors hover:border-green/20">
      <p className={`text-4xl font-bold leading-none tabular-nums ${valueClassName ?? "text-white"}`}>
        {value}
      </p>
      <p className="text-sm text-steel mt-2">{label}</p>
    </div>
  );
}

export function StsCard({ safeM, safeW, safeD, loading }: StsCardProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-busy="true"
        aria-label="Loading YNAB"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm px-6 py-5"
          >
            <div className="h-10 w-24 animate-pulse rounded bg-dimmer" />
            <div className="mt-2 h-4 w-16 animate-pulse rounded bg-dimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (safeM == null) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="This month"
        value={fmt(safeM)}
        valueClassName="text-accent"
      />
      <StatCard
        label="This week"
        value={safeW != null ? fmt(safeW) : "—"}
      />
      <StatCard
        label="Today"
        value={safeD != null ? fmt(safeD) : "—"}
      />
    </div>
  );
}
