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

export function StsCard({ safeM, safeW, safeD, loading }: StsCardProps) {
  if (loading) {
    return (
      <div
        className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-6"
        aria-busy="true"
        aria-label="Loading YNAB"
      >
        <div className="h-4 w-40 animate-pulse rounded bg-dimmer" />
        <div className="mt-4 h-12 w-3/4 max-w-[220px] animate-pulse rounded-lg bg-dimmer" />
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="h-24 animate-pulse rounded-xl bg-dimmer" />
          <div className="h-24 animate-pulse rounded-xl bg-dimmer" />
        </div>
      </div>
    );
  }

  if (safeM == null) return null;

  return (
    <section
      className="rounded-[20px] border border-dimmer overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
      style={{
        background: "linear-gradient(145deg, var(--surface) 0%, #0B1530 100%)",
      }}
    >
      <div
        className="h-0.5 w-full"
        style={{ background: "linear-gradient(90deg, var(--green) 0%, transparent 100%)" }}
      />

      <div className="p-5 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            This month
          </p>
          <p className="mt-2 text-[2.2rem] font-bold leading-none tabular-nums tracking-tight text-accent">
            {fmt(safeM)}
          </p>
          <p className="mt-1 text-[10px] text-muted">
            Full pool
          </p>
        </div>

        <div className="col-span-1 border-l border-dimmer pl-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            This week
          </p>
          <p className="mt-2 text-xl font-bold tabular-nums">
            {safeW != null ? fmt(safeW) : "—"}
          </p>
          <p className="mt-1 text-[10px] text-muted">
            ~7 days
          </p>
        </div>

        <div className="col-span-1 border-l border-dimmer pl-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            Today
          </p>
          <p className="mt-2 text-xl font-bold tabular-nums">
            {safeD != null ? fmt(safeD) : "—"}
          </p>
          <p className="mt-1 text-[10px] text-muted">
            Per day left
          </p>
        </div>
      </div>
    </section>
  );
}
